import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { AlertOctagon, AlertTriangle, Check, CheckCircle, Copy, ShieldAlert, User, Wrench, Layers, MapPin } from 'lucide-react';
import { ChatMessageItem } from '../types';
import { findMatchingDiagram, DiagnosticDiagram } from '../data/diagnosticDiagrams';
import DiagramCard from './DiagramCard';

interface ChatMessageProps {
  message: ChatMessageItem;
  onOpenDiagram?: (diagram: DiagnosticDiagram) => void;
  onFindMechanic?: (specialty?: string) => void;
}

export default function ChatMessage({ message, onOpenDiagram, onFindMechanic }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  // Detect urgency or critical safety alert in assistant message
  const lower = message.content.toLowerCase();
  const isCriticalSafety =
    !isUser &&
    (lower.includes('stop driving immediately') ||
      lower.includes('stop driving') ||
      lower.includes('critical safety') ||
      lower.includes('brake failure') ||
      lower.includes('do not drive'));

  const isCheckSoon =
    !isUser &&
    !isCriticalSafety &&
    (lower.includes('get checked soon') || lower.includes('inspect soon') || lower.includes('warning:'));

  const isSafeToDrive =
    !isUser &&
    !isCriticalSafety &&
    !isCheckSoon &&
    lower.includes('safe to drive');

  // Check if assistant identified a specific mechanical component issue
  const detectedDiagram = !isUser ? findMatchingDiagram(message.content) : null;

  return (
    <div
      className={`w-full py-2.5 flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`flex gap-3 max-w-[92%] sm:max-w-[85%] md:max-w-[80%] ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border text-xs font-semibold ${
            isUser
              ? 'bg-neutral-800 border-neutral-700 text-neutral-300'
              : isCriticalSafety
              ? 'bg-red-500/20 border-red-500/40 text-red-400'
              : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
          }`}
        >
          {isUser ? (
            <User className="w-4 h-4" />
          ) : isCriticalSafety ? (
            <AlertOctagon className="w-4 h-4" />
          ) : (
            <Wrench className="w-4 h-4" />
          )}
        </div>

        {/* Message Bubble */}
        <div
          className={`relative rounded-2xl p-4 text-sm sm:text-base leading-relaxed border transition-all ${
            isUser
              ? 'bg-neutral-800 text-neutral-100 border-neutral-700/80 rounded-tr-sm shadow-sm'
              : isCriticalSafety
              ? 'bg-red-500/10 text-neutral-200 border-red-500/40 rounded-tl-sm shadow-md shadow-red-500/5'
              : 'bg-neutral-900/95 text-neutral-200 border-neutral-800/90 rounded-tl-sm shadow-sm'
          }`}
        >
          {/* Header for Assistant */}
          {!isUser && (
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-neutral-800/80">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs tracking-wider uppercase text-neutral-300 font-['Chakra_Petch']">
                  Automotive Diagnostic Specialist
                </span>
                {isCriticalSafety && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                    <AlertOctagon className="w-3 h-3" /> STOP DRIVING RISK
                  </span>
                )}
                {isCheckSoon && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <AlertTriangle className="w-3 h-3" /> Check Soon
                  </span>
                )}
                {isSafeToDrive && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle className="w-3 h-3" /> Safe Temporarily
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="p-1 rounded text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
                title="Copy diagnosis"
                aria-label="Copy diagnosis"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          )}

          {/* Message Content */}
          {isUser ? (
            <div className="whitespace-pre-wrap font-sans text-neutral-100">{message.content}</div>
          ) : (
            <div className="markdown-content text-neutral-200">
              <ReactMarkdown>{message.content}</ReactMarkdown>
              {message.isStreaming && (
                <span className="inline-block w-2 h-4 ml-1.5 bg-amber-400 animate-pulse align-middle rounded-xs" />
              )}
            </div>
          )}

          {/* Illustrative Diagnostic Diagram when mechanical fault is detected */}
          {detectedDiagram && onOpenDiagram && !message.isStreaming && (
            <DiagramCard diagram={detectedDiagram} onOpenModal={onOpenDiagram} />
          )}

          {/* Quick link to Mechanic Locator */}
          {!isUser && !message.isStreaming && onFindMechanic && (
            <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  let targetSpec = 'All Specialties';
                  if (detectedDiagram?.id === 'cv_joint' || detectedDiagram?.id === 'suspension_struts') {
                    targetSpec = 'Suspension & Axles';
                  } else if (detectedDiagram?.id === 'disc_brakes') {
                    targetSpec = 'Brakes & ABS';
                  } else if (detectedDiagram?.id === 'cooling_radiator') {
                    targetSpec = 'Auto AC & Cooling';
                  } else if (detectedDiagram?.id === 'throttle_engine') {
                    targetSpec = 'Engine & EFI Tuning';
                  } else if (lower.includes('hybrid') || lower.includes('inverter') || lower.includes('battery')) {
                    targetSpec = 'Hybrid & Battery';
                  }
                  onFindMechanic(targetSpec);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all hover:scale-[1.02]"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Find Nearby Specialists & Scrap Hubs in Pakistan</span>
              </button>
            </div>
          )}

          {/* Timestamp footer */}
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
            <span>{message.timestamp}</span>
            {isUser && <span className="text-amber-500/70 font-semibold">User Query</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

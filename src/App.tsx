import { useState, useRef, useEffect } from 'react';
import Header, { AppSection, AppTheme } from './components/Header';
import LandingView from './components/LandingView';
import ChatMessage from './components/ChatMessage';
import TypingIndicator from './components/TypingIndicator';
import ChatInput from './components/ChatInput';
import DisclaimerFooter from './components/DisclaimerFooter';
import DiagramModal from './components/DiagramModal';
import MechanicLocator from './components/MechanicLocator';
import SchematicsLibrary from './components/SchematicsLibrary';
import RatesGuide from './components/RatesGuide';
import BikesHub from './components/BikesHub';
import MaintenanceLog from './components/MaintenanceLog';
import { DIAGNOSTIC_DIAGRAMS, DiagnosticDiagram } from './data/diagnosticDiagrams';
import { ChatMessageItem } from './types';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeDiagram, setActiveDiagram] = useState<DiagnosticDiagram | null>(null);
  const [activeSection, setActiveSection] = useState<AppSection>('diagnosis');
  const [mechanicSpecialtyFilter, setMechanicSpecialtyFilter] = useState<string>('All Specialties');
  
  // Theme state: defaults to high-craft 'light' (Precision Studio Light), with 'dark' & 'cobalt' presets
  const [theme, setTheme] = useState<AppTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app-theme') as AppTheme | null;
      if (saved && ['light', 'dark', 'cobalt'].includes(saved)) {
        return saved;
      }
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (activeSection === 'diagnosis') {
      scrollToBottom();
    }
  }, [messages, isLoading, activeSection]);

  const handleSendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setActiveSection('diagnosis');
    setErrorMessage(null);

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: ChatMessageItem = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: timeString,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    let hasReceivedFirstChunk = false;
    let accumulatedText = "";
    const assistantId = `assistant-${Date.now()}`;

    try {
      const response = await fetch('/api/chat?stream=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response stream returned by server');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine.startsWith('data:')) continue;
          const dataStr = trimmedLine.replace(/^data:\s*/, '');
          if (dataStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            if (parsed.text) {
              accumulatedText += parsed.text;

              if (!hasReceivedFirstChunk) {
                hasReceivedFirstChunk = true;
                setIsLoading(false);
                const initialMsg: ChatMessageItem = {
                  id: assistantId,
                  role: 'assistant',
                  content: accumulatedText,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  isStreaming: true,
                };
                setMessages((prev) => [...prev, initialMsg]);
              } else {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantId
                      ? { ...msg, content: accumulatedText, isStreaming: true }
                      : msg
                  )
                );
              }
            }
          } catch (e: any) {
            if (e.message && !dataStr.startsWith('{')) {
              // Ignore non-json data formatting noise
            } else if (e.message) {
              throw e;
            }
          }
        }
      }

      // Mark streaming complete
      if (hasReceivedFirstChunk) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: accumulatedText, isStreaming: false }
              : msg
          )
        );
      } else if (!accumulatedText) {
        throw new Error('No diagnostic content received. Please try again.');
      }
    } catch (err: any) {
      console.error('Diagnostic chat failed:', err);
      setErrorMessage(
        err.message || 'Unable to connect to the automotive diagnostic engine. Please check your connection and try again.'
      );
      if (hasReceivedFirstChunk) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, isStreaming: false } : msg
          )
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetConversation = () => {
    setMessages([]);
    setErrorMessage(null);
    setIsLoading(false);
    setActiveSection('diagnosis');
  };

  const handleRetryLast = () => {
    if (messages.length === 0) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.content);
    }
  };

  const handleOpenMechanicWithSpecialty = (specialty?: string) => {
    if (specialty) {
      setMechanicSpecialtyFilter(specialty);
    }
    setActiveSection('mechanics');
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-500/30 selection:text-amber-600 transition-colors duration-200">
      {/* Automotive Precision Top Navigation Bar with Theme Controls */}
      <Header
        onReset={handleResetConversation}
        messageCount={messages.length}
        activeSection={activeSection}
        onSelectSection={(sec) => setActiveSection(sec)}
        theme={theme}
        onSelectTheme={(newTheme) => setTheme(newTheme)}
      />

      {/* Main Content Area */}
      <main
        ref={chatContainerRef}
        className="flex-1 w-full max-w-5xl mx-auto flex flex-col justify-between overflow-y-auto"
      >
        {/* SECTION 1: AI DIAGNOSTIC CHAT */}
        {activeSection === 'diagnosis' && (
          <>
            {messages.length === 0 ? (
              /* Landing Screen */
              <div className="flex-1 flex items-center justify-center my-auto">
                <LandingView
                  onSelectPrompt={handleSendMessage}
                  onOpenDiagram={(diag) => setActiveDiagram(diag)}
                  onNavigateSection={(sec) => setActiveSection(sec)}
                />
              </div>
            ) : (
              /* Active Chat Thread */
              <div className="flex-1 w-full px-4 sm:px-6 py-4 flex flex-col justify-start">
                {/* Conversation Reset Prompt at top of active chat */}
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-neutral-900 text-xs text-neutral-500">
                  <span className="font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Active Diagnostic Session
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveSection('mechanics')}
                      className="hover:text-amber-400 transition-colors flex items-center gap-1 font-mono text-[11px]"
                    >
                      Find Workshop
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection('schematics')}
                      className="hover:text-amber-400 transition-colors flex items-center gap-1 font-mono text-[11px]"
                    >
                      Schematics
                    </button>
                    <button
                      type="button"
                      onClick={handleResetConversation}
                      className="hover:text-amber-400 transition-colors flex items-center gap-1 font-mono text-[11px]"
                    >
                      <RotateCcw className="w-3 h-3" />
                      New Car / Reset
                    </button>
                  </div>
                </div>

                {/* Message stream */}
                <div className="space-y-1">
                  {messages.map((msg) => (
                    <ChatMessage
                      key={msg.id}
                      message={msg}
                      onOpenDiagram={(diag) => setActiveDiagram(diag)}
                      onFindMechanic={handleOpenMechanicWithSpecialty}
                    />
                  ))}

                  {isLoading && <TypingIndicator />}

                  {errorMessage && (
                    <div className="my-3 p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRetryLast}
                        className="px-2.5 py-1 rounded bg-red-900/60 hover:bg-red-800 text-red-200 font-medium transition-colors flex-shrink-0"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  <div ref={messagesEndRef} className="h-2" />
                </div>
              </div>
            )}
          </>
        )}

        {/* SECTION 2: MECHANIC & WORKSHOP LOCATOR */}
        {activeSection === 'mechanics' && (
          <MechanicLocator
            initialSpecialty={mechanicSpecialtyFilter}
            onAskAiAboutFault={(query) => {
              setActiveSection('diagnosis');
              handleSendMessage(query);
            }}
          />
        )}

        {/* SECTION 3: BIKES & MECHANICS DIRECTORY */}
        {activeSection === 'bikes' && (
          <BikesHub
            onAskAiAboutBikeFault={(query) => {
              setActiveSection('diagnosis');
              handleSendMessage(query);
            }}
          />
        )}

        {/* SECTION 4: VEHICLE MAINTENANCE LOG */}
        {activeSection === 'maintenance' && (
          <MaintenanceLog
            onAskAiAboutService={(query) => {
              setActiveSection('diagnosis');
              handleSendMessage(query);
            }}
          />
        )}

        {/* SECTION 5: COMPONENT BLUEPRINTS & SCHEMATICS */}
        {activeSection === 'schematics' && (
          <SchematicsLibrary
            onSelectDiagram={(diag) => setActiveDiagram(diag)}
            onAskAboutDiagram={(diag) => {
              setActiveSection('diagnosis');
              handleSendMessage(`What are the symptoms and repair costs for ${diag.title} in Pakistan?`);
            }}
          />
        )}

        {/* SECTION 6: RATES & LABOR GUIDE */}
        {activeSection === 'rates' && (
          <RatesGuide
            onAskAboutRate={(item) => {
              setActiveSection('diagnosis');
              handleSendMessage(`What is the average replacement cost and labor charge for ${item} in Pakistan?`);
            }}
          />
        )}
      </main>

      {/* Input area (pinned to bottom only on diagnosis view) */}
      {activeSection === 'diagnosis' ? (
        <div className="sticky bottom-0 z-20 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800/80 pt-2 shadow-lg shadow-neutral-950/10">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          <DisclaimerFooter />
        </div>
      ) : (
        <div className="border-t border-neutral-800/80 bg-neutral-950/80 py-3">
          <DisclaimerFooter />
        </div>
      )}

      {/* Technical Schematic Modal */}
      <DiagramModal
        diagram={activeDiagram}
        onClose={() => setActiveDiagram(null)}
        onSelectDiagram={(diag) => setActiveDiagram(diag)}
      />
    </div>
  );
}

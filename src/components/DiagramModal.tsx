import { X, Wrench, CheckCircle2, DollarSign, Layers, ExternalLink } from 'lucide-react';
import { DiagnosticDiagram, DIAGNOSTIC_DIAGRAMS } from '../data/diagnosticDiagrams';

interface DiagramModalProps {
  diagram: DiagnosticDiagram | null;
  onClose: () => void;
  onSelectDiagram: (diagram: DiagnosticDiagram) => void;
}

export default function DiagramModal({ diagram, onClose, onSelectDiagram }: DiagramModalProps) {
  if (!diagram) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-neutral-900 border border-neutral-700/80 text-neutral-100 shadow-2xl flex flex-col z-10">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 bg-neutral-950/95 border-b border-neutral-800 backdrop-blur">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Layers className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-['Chakra_Petch'] tracking-wide">
                TECHNICAL DIAGNOSTIC CUTAWAY
              </h3>
              <p className="text-[11px] text-neutral-400 font-mono">
                Illustrative Component Blueprint • Pakistani Automotive Standard
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Diagram Switcher Tabs */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-neutral-950/60 border-b border-neutral-800/80 overflow-x-auto scrollbar-none text-xs">
          <span className="text-[11px] text-neutral-500 font-mono flex-shrink-0 mr-1">All Schematics:</span>
          {DIAGNOSTIC_DIAGRAMS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onSelectDiagram(d)}
              className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs transition-all ${
                d.id === diagram.id
                  ? 'bg-amber-500 text-neutral-950 font-semibold shadow-sm'
                  : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700/80 hover:text-white border border-neutral-700/60'
              }`}
            >
              {d.category}: {d.title.split('&')[0].trim()}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Image visual */}
          <div className="flex flex-col gap-2">
            <div className="relative rounded-xl overflow-hidden border border-neutral-700/80 bg-neutral-950 shadow-inner group">
              <img
                src={diagram.image}
                alt={diagram.title}
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover max-h-[380px] group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-neutral-950/80 backdrop-blur border border-amber-500/40 text-[10px] text-amber-400 font-mono">
                {diagram.category}
              </div>
            </div>
            <span className="text-[11px] text-neutral-500 text-center font-mono">
              Engineering cutaway illustration generated for {diagram.title}
            </span>
          </div>

          {/* Details & Mechanic Checklist */}
          <div className="flex flex-col gap-4">
            <div>
              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider mb-1 font-mono">
                {diagram.category} Component
              </span>
              <h4 className="text-lg font-bold text-white font-['Chakra_Petch']">
                {diagram.title}
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                {diagram.subtitle}
              </p>
            </div>

            {/* Typical Estimated Cost */}
            <div className="p-3 rounded-xl bg-neutral-950 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono text-neutral-400">Pakistani Market Estimate:</span>
              </div>
              <span className="text-xs font-bold text-amber-400 font-mono">
                {diagram.typicalLocalCostPKR}
              </span>
            </div>

            {/* Key Sub-Components */}
            <div>
              <h5 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-amber-400" />
                Key Components in Diagram:
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {diagram.components.map((comp, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-neutral-950/80 border border-neutral-800 text-xs text-neutral-300 flex items-start gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inspection Tips for Local Workshop */}
            <div>
              <h5 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                What to Ask Your Local Ustaad / Mechanic:
              </h5>
              <ul className="space-y-1.5">
                {diagram.inspectionTips.map((tip, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-neutral-300 bg-neutral-950/60 p-2.5 rounded-lg border border-neutral-800/80 leading-relaxed"
                  >
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
          <span>AI diagnostic visual aid • Always verify with physical measurement / inspection</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

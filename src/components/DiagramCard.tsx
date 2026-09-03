import { Layers, Maximize2, Wrench, ShieldCheck, ChevronRight } from 'lucide-react';
import { DiagnosticDiagram } from '../data/diagnosticDiagrams';

interface DiagramCardProps {
  diagram: DiagnosticDiagram;
  onOpenModal: (diagram: DiagnosticDiagram) => void;
}

export default function DiagramCard({ diagram, onOpenModal }: DiagramCardProps) {
  return (
    <div className="mt-3.5 rounded-xl border border-amber-500/30 bg-neutral-950/90 overflow-hidden shadow-md">
      {/* Visual Header */}
      <div className="px-3.5 py-2 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border-b border-amber-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-amber-500/20 text-amber-400">
            <Layers className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-bold text-amber-300 font-['Chakra_Petch'] tracking-wide">
            DIAGNOSTIC COMPONENT DIAGRAM
          </span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-neutral-900 border border-neutral-700 text-neutral-400">
            {diagram.category}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onOpenModal(diagram)}
          className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400 hover:text-amber-300 transition-colors"
        >
          <span>Enlarge</span>
          <Maximize2 className="w-3 h-3" />
        </button>
      </div>

      {/* Card Content with Image + Quick Breakdown */}
      <div className="p-3 sm:p-3.5 flex flex-col sm:flex-row gap-3 items-center sm:items-start">
        {/* Clickable Image Preview */}
        <div
          onClick={() => onOpenModal(diagram)}
          className="relative w-full sm:w-44 h-28 sm:h-28 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 flex-shrink-0 cursor-pointer group"
          title="Click to zoom schematic"
        >
          <img
            src={diagram.image}
            alt={diagram.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-mono gap-1">
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Click to Zoom</span>
          </div>
        </div>

        {/* Info & Checklist */}
        <div className="flex-1 w-full text-left flex flex-col justify-between">
          <div>
            <h5 className="text-xs font-bold text-white font-['Chakra_Petch']">
              {diagram.title}
            </h5>
            <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-2 leading-relaxed">
              {diagram.subtitle}
            </p>
          </div>

          <div className="mt-2 pt-2 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-1.5 text-[11px]">
            <span className="text-neutral-400 font-mono">
              Market Est: <strong className="text-amber-400">{diagram.typicalLocalCostPKR.split('(')[0]}</strong>
            </span>

            <button
              type="button"
              onClick={() => onOpenModal(diagram)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-[11px] font-medium transition-colors"
            >
              <span>View Component Blueprint</span>
              <ChevronRight className="w-3 h-3 text-amber-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

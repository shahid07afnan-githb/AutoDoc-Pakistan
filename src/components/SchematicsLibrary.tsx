import { useState } from 'react';
import { DIAGNOSTIC_DIAGRAMS, DiagnosticDiagram } from '../data/diagnosticDiagrams';
import { Layers, ZoomIn, CheckCircle2, AlertTriangle, Coins, HelpCircle } from 'lucide-react';

interface SchematicsLibraryProps {
  onSelectDiagram: (diagram: DiagnosticDiagram) => void;
  onAskAboutDiagram?: (diagram: DiagnosticDiagram) => void;
}

export const SCHEMATIC_CATEGORIES = [
  'All Components',
  'Drivetrain & Axle',
  'Brakes & Safety',
  'Cooling System',
  'Suspension & Steering',
  'Engine & Intake',
] as const;

export default function SchematicsLibrary({
  onSelectDiagram,
  onAskAboutDiagram,
}: SchematicsLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Components');

  const filtered = DIAGNOSTIC_DIAGRAMS.filter((d) => {
    if (selectedCategory === 'All Components') return true;
    return d.category.toLowerCase().includes(selectedCategory.toLowerCase().split(' ')[0]);
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-neutral-900 border border-neutral-800 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-2">
          <Layers className="w-3.5 h-3.5" />
          <span>Automotive Cutaway Technical Diagrams</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white font-['Chakra_Petch'] tracking-wide">
          COMPONENT SCHEMATICS & ENGINEERING BLUEPRINTS
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl leading-relaxed">
          High-resolution cutaway illustrations designed to help you understand mechanical components, spot physical wear and tear, and know what your mechanic should inspect before you pay.
        </p>

        {/* Category filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-4 scrollbar-none">
          {SCHEMATIC_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex-shrink-0 ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm shadow-amber-500/20'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blueprints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((diag) => (
          <div
            key={diag.id}
            className="rounded-2xl bg-neutral-900/90 border border-neutral-800 overflow-hidden flex flex-col justify-between hover:border-amber-500/40 transition-all shadow-lg group"
          >
            <div>
              {/* Image Preview with click to enlarge */}
              <div
                onClick={() => onSelectDiagram(diag)}
                className="w-full h-52 bg-neutral-950 relative cursor-pointer overflow-hidden group"
                title="Click to view full high-res schematic"
              >
                <img
                  src={diag.image}
                  alt={diag.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-amber-500/30 text-xs font-mono text-amber-400">
                  {diag.category}
                </span>

                <button
                  type="button"
                  className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-neutral-900/90 hover:bg-amber-500 hover:text-neutral-950 text-white text-xs font-medium flex items-center gap-1.5 backdrop-blur-md border border-neutral-700 transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Enlarge Blueprint</span>
                </button>
              </div>

              {/* Title & Description */}
              <div className="p-4 sm:p-5">
                <h3 className="text-base font-bold text-white font-['Chakra_Petch'] group-hover:text-amber-300 transition-colors">
                  {diag.title}
                </h3>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                  {diag.subtitle}
                </p>

                {/* Key Components Tag Cloud */}
                <div className="mt-3">
                  <span className="text-[11px] font-mono text-neutral-400 block mb-1.5">
                    Critical Anatomy Identified:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {diag.components.map((comp, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-neutral-950 text-[10px] font-mono text-neutral-300 border border-neutral-800"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Inspection Checklist */}
                <div className="mt-4 p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80">
                  <span className="text-[11px] font-mono text-amber-400 font-bold block mb-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Pakistani Workshop Inspection Tip:
                  </span>
                  <ul className="space-y-1 text-xs text-neutral-400">
                    {diag.inspectionTips.slice(0, 2).map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-500">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Estimated Market PKR */}
                <div className="mt-3 flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    Market Repair Rate:
                  </span>
                  <span className="text-amber-400 font-bold">
                    {diag.typicalLocalCostPKR}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 pt-0 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectDiagram(diag)}
                className="flex-1 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                <span>View Full Anatomy & Diagnostics</span>
              </button>

              {onAskAboutDiagram && (
                <button
                  type="button"
                  onClick={() => onAskAboutDiagram(diag)}
                  className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium transition-colors flex items-center gap-1"
                  title="Diagnose a problem related to this component"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Diagnose</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

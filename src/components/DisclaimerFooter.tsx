import { AlertTriangle, ShieldCheck } from 'lucide-react';

export default function DisclaimerFooter() {
  return (
    <footer className="w-full border-t border-neutral-900 bg-neutral-950 py-2.5 px-4 text-center">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 text-xs text-neutral-500 font-sans">
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500/80 flex-shrink-0" />
          <span>AI-generated estimate, not a substitute for professional inspection</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-neutral-500">
          <span>Rates benchmarked against Pakistani auto parts markets</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-amber-500/80 font-mono">PKR Estimates</span>
        </div>
      </div>
    </footer>
  );
}

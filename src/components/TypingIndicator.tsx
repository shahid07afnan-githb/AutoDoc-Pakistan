import { Wrench } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="w-full py-2 flex justify-start">
      <div className="flex gap-3 max-w-[85%] items-start">
        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Wrench className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
        </div>

        {/* Bubble */}
        <div className="rounded-2xl rounded-tl-sm p-4 bg-neutral-900/95 border border-neutral-800 text-neutral-300 shadow-sm flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-xs text-neutral-400 font-mono tracking-wide">
            Consulting Pakistani automotive database & diagnosing fault...
          </span>
        </div>
      </div>
    </div>
  );
}

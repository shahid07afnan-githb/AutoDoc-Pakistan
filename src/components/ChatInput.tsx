import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { ArrowUp, Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

const QUICK_TAGS = [
  'Suzuki Alto',
  'Toyota Corolla',
  'Honda Civic',
  'Lahore',
  'Islamabad',
  'Karachi',
  'Check Engine Light',
  'Cold Start',
  'High Speed Vibration',
];

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isLoading) {
      textareaRef.current?.focus();
    }
  }, [isLoading]);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    onSendMessage(trimmed);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleAppendTag = (tag: string) => {
    setInput((prev) => {
      if (!prev) return `${tag}: `;
      if (prev.endsWith(' ')) return `${prev}${tag}, `;
      return `${prev} ${tag}, `;
    });
    textareaRef.current?.focus();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-3">
      {/* Quick context insertion tags */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-[11px]">
        <span className="text-neutral-500 font-mono text-[10px] uppercase flex items-center gap-1 flex-shrink-0">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Quick Tags:
        </span>
        {QUICK_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleAppendTag(tag)}
            className="flex-shrink-0 px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-amber-400 hover:border-amber-500/40 hover:bg-neutral-850 transition-colors"
          >
            +{tag}
          </button>
        ))}
      </div>

      {/* Input container */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end rounded-2xl bg-neutral-900/95 border border-neutral-800/90 focus-within:border-amber-500/60 focus-within:ring-1 focus-within:ring-amber-500/40 shadow-lg shadow-black/40 transition-all p-2 gap-2"
      >
        <textarea
          id="diagnostic-chat-input"
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your car symptom (e.g. 2018 Civic AC not cooling, Mehran gear slipping, grinding brakes in Lahore)..."
          disabled={isLoading}
          className="flex-1 max-h-36 resize-none bg-transparent px-3 py-2 text-sm sm:text-base text-neutral-100 placeholder-neutral-500 focus:outline-none disabled:opacity-50 font-sans"
        />

        <button
          id="send-diagnostic-message-btn"
          type="submit"
          disabled={!input.trim() || isLoading}
          className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-semibold hover:bg-amber-400 active:scale-95 disabled:opacity-30 disabled:hover:bg-amber-500 disabled:cursor-not-allowed transition-all shadow-sm"
          title="Send message"
          aria-label="Send message"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <ArrowUp className="w-5 h-5 stroke-[2.5]" />
          )}
        </button>
      </form>

      <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-neutral-500">
        <span>Press <kbd className="px-1 py-0.2 bg-neutral-800 rounded text-neutral-400 font-mono text-[10px]">Enter</kbd> to send, <kbd className="px-1 py-0.2 bg-neutral-800 rounded text-neutral-400 font-mono text-[10px]">Shift+Enter</kbd> for line break</span>
        <span className="hidden sm:inline">Calculated in Pakistani Rupees (PKR)</span>
      </div>
    </div>
  );
}

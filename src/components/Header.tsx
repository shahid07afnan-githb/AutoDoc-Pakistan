import { RotateCcw, Wrench, Layers, MessageSquare, MapPin, DollarSign, Bike, Sun, Moon, Zap, ClipboardList } from 'lucide-react';
import AppLogo from './AppLogo';

export type AppSection = 'diagnosis' | 'mechanics' | 'bikes' | 'maintenance' | 'schematics' | 'rates';
export type AppTheme = 'light' | 'dark' | 'cobalt';

interface HeaderProps {
  onReset: () => void;
  messageCount: number;
  activeSection: AppSection;
  onSelectSection: (section: AppSection) => void;
  theme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
}

export default function Header({
  onReset,
  messageCount,
  activeSection,
  onSelectSection,
  theme,
  onSelectTheme,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-neutral-800/80 bg-neutral-950/95 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-3 sm:px-6">
        {/* Top Brand Bar */}
        <div className="h-16 flex items-center justify-between gap-2">
          {/* Brand identity */}
          <div
            className="cursor-pointer select-none"
            onClick={() => onSelectSection('diagnosis')}
          >
            <AppLogo size="md" showText={true} />
          </div>

          {/* Action Controls & Theme Selector */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Theme Selector Segmented Pill */}
            <div
              className="flex items-center p-0.5 sm:p-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs shadow-xs"
              role="radiogroup"
              aria-label="Select website theme"
            >
              <button
                id="theme-btn-light"
                type="button"
                onClick={() => onSelectTheme('light')}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all text-[11px] ${
                  theme === 'light'
                    ? 'bg-amber-500/20 text-amber-600 font-bold border border-amber-500/30'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Precision Light Theme (Best readability)"
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Light</span>
              </button>

              <button
                id="theme-btn-dark"
                type="button"
                onClick={() => onSelectTheme('dark')}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all text-[11px] ${
                  theme === 'dark'
                    ? 'bg-neutral-800 text-amber-400 font-bold border border-neutral-700'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Midnight Titanium Dark Theme"
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Dark</span>
              </button>

              <button
                id="theme-btn-cobalt"
                type="button"
                onClick={() => onSelectTheme('cobalt')}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all text-[11px] ${
                  theme === 'cobalt'
                    ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Electric Cobalt Racing Theme"
              >
                <Zap className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Cobalt</span>
              </button>
            </div>

            {activeSection === 'diagnosis' && messageCount > 0 && (
              <button
                id="start-new-diagnosis-btn"
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-200 bg-neutral-900 border border-neutral-700/80 hover:bg-neutral-800 hover:border-amber-500/40 hover:text-amber-500 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-500"
                title="Reset conversation and start a new diagnostic session"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">New Diagnosis</span>
                <span className="sm:hidden">Reset</span>
              </button>
            )}

            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900/90 border border-neutral-800 text-[11px] text-neutral-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>AI Ready</span>
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 border-t border-neutral-900 overflow-x-auto scrollbar-none py-1.5 text-xs">
          <button
            type="button"
            onClick={() => onSelectSection('diagnosis')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex-shrink-0 ${
              activeSection === 'diagnosis'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>1. AI Diagnosis</span>
            {messageCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-bold font-mono">
                {messageCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onSelectSection('mechanics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex-shrink-0 ${
              activeSection === 'mechanics'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>2. Car Workshops</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[9px] font-mono font-bold">
              50+ HUBS
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSection('bikes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex-shrink-0 ${
              activeSection === 'bikes'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Bike className="w-3.5 h-3.5 text-amber-400" />
            <span>3. Bikes & Mechanics</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[9px] font-mono font-bold">
              CD70 / CG125 / YBR
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSection('maintenance')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex-shrink-0 ${
              activeSection === 'maintenance'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5 text-amber-500" />
            <span>4. Maintenance Log</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[9px] font-mono font-bold">
              OIL & CHECKUPS
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSection('schematics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex-shrink-0 ${
              activeSection === 'schematics'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>5. Blueprints</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSection('rates')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex-shrink-0 ${
              activeSection === 'rates'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>6. Car Rates</span>
          </button>
        </div>
      </div>
    </header>
  );
}

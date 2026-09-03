import { AlertTriangle, Car, CheckCircle2, Clock, DollarSign, Gauge, ShieldAlert, Sparkles, Layers, MapPin, MessageSquare, ArrowRight, Bike, ClipboardList } from 'lucide-react';
import { QuickPrompt } from '../types';
import { DIAGNOSTIC_DIAGRAMS, DiagnosticDiagram } from '../data/diagnosticDiagrams';
import { AppSection } from './Header';
import AppLogo from './AppLogo';

interface LandingViewProps {
  onSelectPrompt: (promptText: string) => void;
  onOpenDiagram?: (diagram: DiagnosticDiagram) => void;
  onNavigateSection?: (section: AppSection) => void;
}

const SAMPLE_PROMPTS: QuickPrompt[] = [
  {
    car: 'Honda CG 125 (Pushrod OHV)',
    symptom: 'Loud metallic tappet clicking from cylinder head & footrest vibration',
    category: 'Motorcycle Engine',
    fullPrompt: 'My Honda CG 125 is making a continuous loud metallic "tuk-tuk" tappet ticking sound from the cylinder head when warm, and the footpegs vibrate excessively above 60 km/h. What is the root cause, feeler clearance, and repair cost in Pakistan?',
  },
  {
    car: 'Honda CD 70 / Chinese 70cc',
    symptom: 'Dense white-blue smoke from silencer & engine consuming mobil oil',
    category: 'Motorcycle Piston',
    fullPrompt: 'My Honda CD 70 in Lahore has started blowing white-blue smoke from the silencer on acceleration, and the oil level drops every week. How much does a cylinder bore with RIK rings cost at McLeod Road?',
  },
  {
    car: 'Suzuki Alto (660cc / VXR)',
    symptom: 'Clicking "tuk-tuk" noise when turning wheels sharply',
    category: 'CV Joint & Axle',
    fullPrompt: 'I have a 2021 Suzuki Alto 660cc in Lahore. When I make sharp turns at U-turns or low speeds, I hear a repetitive clicking "tuk-tuk" sound from the front wheels. What could be the issue and how much would it cost to fix?',
  },
  {
    car: 'Yamaha YBR 125 / YBR 125G',
    symptom: 'Engine bogging on sudden acceleration & front disc brake dragging hot',
    category: 'Motorcycle Carb & Brake',
    fullPrompt: 'My Yamaha YBR 125 bogs down and cuts power when I twist the throttle quickly. Also, the front disc brake rotor gets very hot after a short ride. What needs to be cleaned or replaced?',
  },
  {
    car: 'Toyota Corolla (GLi / Altis / Grande)',
    symptom: 'Severe engine vibration and RPM dip when idling at traffic lights',
    category: 'Throttle & Mounts',
    fullPrompt: 'My 2016 Toyota Corolla GLi automatic vibrates heavily when stopped at traffic signals in gear (Drive mode) with AC on. The vibration goes down when I shift to Neutral. Is it engine mounts or throttle body?',
  },
  {
    car: 'Suzuki GS 150 / GR 150',
    symptom: 'Battery acid boiling and burning headlight bulbs on highway',
    category: 'Motorcycle Electrical',
    fullPrompt: 'My Suzuki GS 150 is boiling battery acid and blowing out the headlight bulb whenever I go past 6000 RPM on highway trips. Is the rectifier overcharging and how can I fix it?',
  },
];

const LOCAL_MAKES = [
  'Suzuki (Alto, Cultus, Mehran, Wagon R, Swift)',
  'Toyota (Corolla GLi/Grande, Yaris, Aqua, Prius, Hilux)',
  'Honda Cars (Civic, City, Vezel Hybrid, BR-V)',
  'Honda Bikes (CD 70, CG 125, CG 125 SE, Pridor)',
  'Yamaha Bikes (YBR 125, YBR 125G, YB125Z)',
  'Suzuki Bikes (GS 150, GR 150, GD 110S)',
  'Daihatsu (Mira, Move 660cc)',
  'KIA & Hyundai (Sportage, Picanto, Tucson, Elantra)',
  'Electric Bikes (Yadea, Metro, Crown EV)',
];

export default function LandingView({ onSelectPrompt, onOpenDiagram, onNavigateSection }: LandingViewProps) {
  return (
    <div className="w-full max-w-4xl mx-auto pt-2 pb-8 px-4 flex flex-col items-center text-center">
      {/* Automotive Brand Emblem */}
      <div className="mb-3 flex flex-col items-center">
        <AppLogo size="xl" showText={false} />
      </div>

      {/* Automotive Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-900 border border-amber-500/30 text-xs text-amber-400 mb-4 font-mono shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Comprehensive Automotive & Bike Diagnostic Portal (Pakistan)</span>
      </div>

      {/* Main Title & Subtitle */}
      <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-2 font-['Chakra_Petch']">
        What seems to be wrong with your vehicle?
      </h2>
      <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mb-6 leading-relaxed">
        Describe noises, engine vibrations, smoke, or electrical faults for <span className="text-amber-400 font-semibold">cars & local motorcycles</span>. Get localized fault diagnosis, realistic repair costs in <span className="text-amber-400 font-semibold">PKR</span>, and verified mechanics across Pakistan.
      </p>

      {/* 6 Organized Section Shortcut Cards */}
      {onNavigateSection && (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-7 text-left">
          <button
            type="button"
            onClick={() => onNavigateSection('diagnosis')}
            className="p-3 rounded-xl bg-neutral-900/90 border border-amber-500/40 hover:bg-neutral-850 transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 w-fit mb-2">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white font-['Chakra_Petch'] group-hover:text-amber-300">
                1. AI Diagnosis
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-2">
                Cars & Bikes fault analysis
              </p>
            </div>
            <span className="text-[10px] font-mono text-amber-400 mt-2 flex items-center gap-1 font-semibold">
              Active Chat →
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSection('mechanics')}
            className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/50 transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 w-fit mb-2">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white font-['Chakra_Petch'] group-hover:text-amber-300">
                2. Car Locator
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-2">
                50+ Ustaads in Bilal Ganj, Shershah
              </p>
            </div>
            <span className="text-[10px] font-mono text-amber-400 mt-2 flex items-center gap-1 font-semibold">
              Car Garages →
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSection('bikes')}
            className="p-3 rounded-xl bg-neutral-900/90 border border-amber-500/30 hover:border-amber-400 transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 w-fit mb-2">
                <Bike className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white font-['Chakra_Petch'] group-hover:text-amber-300">
                3. Bike Portal
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-2">
                CD 70, CG 125, YBR, GS150 & McLeod Rd
              </p>
            </div>
            <span className="text-[10px] font-mono text-amber-400 mt-2 flex items-center gap-1 font-semibold">
              Bike Hub →
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSection('maintenance')}
            className="p-3 rounded-xl bg-neutral-900/90 border border-amber-500/50 hover:border-amber-400 transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 w-fit mb-2">
                <ClipboardList className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white font-['Chakra_Petch'] group-hover:text-amber-300">
                4. Service Log
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-2">
                Oil intervals & mileage checkup reminders
              </p>
            </div>
            <span className="text-[10px] font-mono text-amber-400 mt-2 flex items-center gap-1 font-semibold">
              Open Log →
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSection('schematics')}
            className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/50 transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 w-fit mb-2">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white font-['Chakra_Petch'] group-hover:text-amber-300">
                5. Blueprints
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-2">
                5 Technical engineering cutaways
              </p>
            </div>
            <span className="text-[10px] font-mono text-amber-400 mt-2 flex items-center gap-1 font-semibold">
              Schematics →
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSection('rates')}
            className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/50 transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 w-fit mb-2">
                <DollarSign className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white font-['Chakra_Petch'] group-hover:text-amber-300">
                6. Car Rates
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-2">
                Kabli vs OEM & Mazdoori price card
              </p>
            </div>
            <span className="text-[10px] font-mono text-amber-400 mt-2 flex items-center gap-1 font-semibold">
              Price Guide →
            </span>
          </button>
        </div>
      )}

      {/* Component Blueprints Quick Strip */}
      {onOpenDiagram && (
        <div className="w-full mb-7 p-3 rounded-2xl bg-neutral-900/90 border border-amber-500/30 text-left">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-amber-500/20 text-amber-400">
                <Layers className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-bold text-neutral-200 font-['Chakra_Petch'] tracking-wide uppercase">
                Diagnostic Component Schematics
              </span>
            </div>
            <span className="text-[11px] font-mono text-amber-400">
              5 Technical Blueprints
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {DIAGNOSTIC_DIAGRAMS.map((diag) => (
              <button
                key={diag.id}
                type="button"
                onClick={() => onOpenDiagram(diag)}
                className="group p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-amber-500/60 transition-all text-left flex flex-col gap-1"
              >
                <div className="w-full h-14 rounded overflow-hidden bg-neutral-900 relative">
                  <img
                    src={diag.image}
                    alt={diag.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded bg-black/80 text-[8px] text-amber-400 font-mono">
                    {diag.category}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-neutral-300 truncate group-hover:text-amber-300">
                  {diag.title.split('&')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3-Step Process Highlights */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 text-left mb-8">
        <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 flex flex-col gap-1.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-mono text-xs font-bold border border-amber-500/20">
            01
          </div>
          <h3 className="text-xs font-semibold text-neutral-200 tracking-wide font-['Chakra_Petch'] uppercase">
            1. Describe Problem
          </h3>
          <p className="text-xs text-neutral-400 leading-normal">
            Share car make, model, sound type (clicking, grinding), or when it happens.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 flex flex-col gap-1.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-mono text-xs font-bold border border-amber-500/20">
            02
          </div>
          <h3 className="text-xs font-semibold text-neutral-200 tracking-wide font-['Chakra_Petch'] uppercase">
            2. Localized Analysis
          </h3>
          <p className="text-xs text-neutral-400 leading-normal">
            Ranked faults tailored to Pakistani roads, climate & mechanic practices.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 flex flex-col gap-1.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-mono text-xs font-bold border border-amber-500/20">
            03
          </div>
          <h3 className="text-xs font-semibold text-neutral-200 tracking-wide font-['Chakra_Petch'] uppercase">
            3. Diagrams & PKR Costs
          </h3>
          <p className="text-xs text-neutral-400 leading-normal">
            Illustrative component diagrams, Bilal Ganj/Shershah rates & safety ratings.
          </p>
        </div>
      </div>

      {/* Suggested Quick Diagnostic Starters */}
      <div className="w-full text-left">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase font-mono flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-amber-400" />
            Common Diagnostic Examples
          </span>
          <span className="text-[11px] text-neutral-500">Click any card to begin</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SAMPLE_PROMPTS.map((sample, idx) => (
            <button
              key={idx}
              id={`sample-prompt-${idx}`}
              type="button"
              onClick={() => onSelectPrompt(sample.fullPrompt)}
              className="group p-3.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800/80 hover:border-amber-500/50 text-left transition-all duration-150 flex flex-col justify-between focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-amber-400 font-['Chakra_Petch']">
                    {sample.car}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono border border-neutral-700/50">
                    {sample.category}
                  </span>
                </div>
                <p className="text-xs text-neutral-300 group-hover:text-neutral-100 transition-colors line-clamp-2 leading-relaxed">
                  "{sample.symptom}"
                </p>
              </div>
              <div className="mt-2 flex items-center text-[11px] text-amber-400/80 group-hover:text-amber-300 font-medium">
                <span>Diagnose this issue →</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Popular local models tags */}
      <div className="w-full mt-6 pt-5 border-t border-neutral-900 flex flex-wrap items-center justify-center gap-1.5 text-xs text-neutral-500">
        <span className="text-neutral-400 font-mono text-[11px] mr-1">All Pakistani cars supported:</span>
        {LOCAL_MAKES.map((make, i) => (
          <span
            key={i}
            className="px-2 py-0.5 rounded bg-neutral-900/60 border border-neutral-800 text-neutral-400 text-[11px]"
          >
            {make}
          </span>
        ))}
      </div>
    </div>
  );
}

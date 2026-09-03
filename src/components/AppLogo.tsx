import React from 'react';

interface AppLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  badgeText?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showText = false,
  className = '',
  badgeText = 'PK SPEC',
}) => {
  const sizeMap = {
    xs: { icon: 24, box: 'w-6 h-6', text: 'text-xs', subtext: 'text-[9px]' },
    sm: { icon: 32, box: 'w-8 h-8', text: 'text-sm', subtext: 'text-[10px]' },
    md: { icon: 40, box: 'w-10 h-10', text: 'text-base sm:text-lg', subtext: 'text-[11px]' },
    lg: { icon: 52, box: 'w-13 h-13', text: 'text-xl sm:text-2xl', subtext: 'text-xs' },
    xl: { icon: 68, box: 'w-17 h-17', text: 'text-2xl sm:text-3xl', subtext: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Precision Geometric Logo Icon */}
      <div
        className={`${currentSize.box} relative flex-shrink-0 flex items-center justify-center rounded-xl overflow-hidden transition-transform duration-200 hover:scale-105 group`}
        title="Pakistani Automotive & Motorcycle Diagnostics"
      >
        <svg
          viewBox="0 0 64 64"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoShield" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#27272a" />
              <stop offset="50%" stopColor="#18181b" />
              <stop offset="100%" stopColor="#09090b" />
            </linearGradient>

            <linearGradient id="logoAmber" x1="16" y1="12" x2="48" y2="52" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            <linearGradient id="logoSteel" x1="20" y1="14" x2="44" y2="46" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>

            <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Precision Outer Hex Shield */}
          <polygon
            points="32,4 56,15 56,41 32,60 8,41 8,15"
            fill="url(#logoShield)"
            stroke="url(#logoAmber)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Inner Accent Inset */}
          <polygon
            points="32,8 52,18 52,39 32,55 12,39 12,18"
            fill="none"
            stroke="#3f3f46"
            strokeWidth="1.2"
            strokeLinejoin="round"
            opacity="0.6"
          />

          {/* Aerodynamic Dual Speed Arches (representing Cars & Bikes) */}
          <path
            d="M15 31 C15 22 22 17 30 16"
            stroke="url(#logoAmber)"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M49 31 C49 22 42 17 34 16"
            stroke="url(#logoAmber)"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Stylized Engine Piston Crown (Automotive Core) */}
          <rect x="22" y="15" width="20" height="9.5" rx="2" fill="url(#logoAmber)" />
          {/* Compression & Oil Scraper Ring Grooves */}
          <line x1="22" y1="18.5" x2="42" y2="18.5" stroke="#78350f" strokeWidth="1" />
          <line x1="22" y1="21.5" x2="42" y2="21.5" stroke="#78350f" strokeWidth="1" />

          {/* Precision Gudgeon Pin / Bearing Hub */}
          <circle cx="32" cy="29" r="4.5" fill="url(#logoSteel)" />
          <circle cx="32" cy="29" r="2.2" fill="#09090b" />

          {/* Connecting Rod & Diagnostic Spark Geometry */}
          <path
            d="M30 33 L25.5 46.5 L30.5 46.5 L32.5 42 L36 46.5 L38.5 46.5 L34 33 Z"
            fill="url(#logoSteel)"
          />

          {/* Diagnostic Spark Dot at Base */}
          <circle cx="32" cy="51" r="2.2" fill="#fbbf24" filter="url(#logoGlow)" />
        </svg>

        {/* Ambient subtle backlight */}
        <div className="absolute inset-0 bg-amber-500/10 rounded-xl pointer-events-none group-hover:bg-amber-500/20 transition-colors" />
      </div>

      {/* Typography Label */}
      {showText && (
        <div className="leading-tight">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h1 className={`font-bold tracking-tight text-white font-['Chakra_Petch'] ${currentSize.text}`}>
              CAR & BIKE DIAGNOSIS
            </h1>
            {badgeText && (
              <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                {badgeText}
              </span>
            )}
          </div>
          <p className={`text-neutral-400 font-sans hidden sm:block ${currentSize.subtext}`}>
            AI Diagnostic & Workshop Portal for Pakistani Cars & Motorcycles
          </p>
        </div>
      )}
    </div>
  );
};

export default AppLogo;

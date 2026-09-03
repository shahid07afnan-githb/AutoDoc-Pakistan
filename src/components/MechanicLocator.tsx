import { useState, useMemo } from 'react';
import {
  MapPin,
  Phone,
  MessageSquare,
  Search,
  Wrench,
  Star,
  ShieldCheck,
  Navigation,
  Clock,
  Car,
  AlertCircle,
  ExternalLink,
  Filter,
  Sparkles,
  Layers,
  Zap,
} from 'lucide-react';
import {
  PAKISTAN_WORKSHOPS,
  CITIES,
  SPECIALTIES,
  FAMOUS_MARKET_HUBS,
  POPULAR_MAKES,
  Workshop,
} from '../data/mechanicsData';

interface MechanicLocatorProps {
  initialCity?: string;
  initialSpecialty?: string;
  onAskAiAboutFault?: (query: string) => void;
}

export default function MechanicLocator({
  initialCity = 'All Cities',
  initialSpecialty = 'All Specialties',
  onAskAiAboutFault,
}: MechanicLocatorProps) {
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(initialSpecialty);
  const [selectedMarketHub, setSelectedMarketHub] = useState<string>('All Markets');
  const [selectedMake, setSelectedMake] = useState<string>('All Makes');
  const [searchQuery, setSearchQuery] = useState('');
  const [locating, setLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  // Compute counts per city for quick badges
  const cityCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All Cities': PAKISTAN_WORKSHOPS.length };
    CITIES.forEach((c) => {
      if (c !== 'All Cities') {
        counts[c] = PAKISTAN_WORKSHOPS.filter((w) => w.city === c).length;
      }
    });
    return counts;
  }, []);

  // Detect user city via browser Geolocation approximation
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported in this browser.');
      return;
    }

    setLocating(true);
    setLocationStatus('Locating nearby auto market in Pakistan...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let detected = 'Lahore';
        if (latitude < 26.5 && longitude < 69.0) {
          detected = 'Karachi';
        } else if (latitude > 33.2 && latitude < 34.0 && longitude > 72.5 && longitude < 73.5) {
          detected = 'Islamabad';
        } else if (latitude > 33.5 && latitude < 34.5 && longitude < 72.0) {
          detected = 'Peshawar';
        } else if (latitude > 31.0 && latitude < 32.0 && longitude < 73.5) {
          detected = 'Faisalabad';
        } else if (latitude > 29.5 && latitude < 30.5) {
          detected = 'Multan';
        } else if (latitude > 32.0 && latitude < 32.5 && longitude > 74.0) {
          detected = 'Gujranwala';
        } else {
          detected = 'Lahore';
        }

        setSelectedCity(detected);
        setSelectedMarketHub('All Markets');
        setLocationStatus(`Detected ${detected} region. Showing famous workshops.`);
        setLocating(false);
        setTimeout(() => setLocationStatus(null), 4000);
      },
      () => {
        setLocationStatus('Could not determine city. Please pick your city from the tabs.');
        setLocating(false);
        setTimeout(() => setLocationStatus(null), 4000);
      }
    );
  };

  // Filtered workshops
  const filteredWorkshops = useMemo(() => {
    return PAKISTAN_WORKSHOPS.filter((w) => {
      // City filter
      const matchCity =
        selectedCity === 'All Cities' || w.city.toLowerCase() === selectedCity.toLowerCase();

      // Specialty filter
      const matchSpecialty =
        selectedSpecialty === 'All Specialties' ||
        w.specialties.includes(selectedSpecialty as any);

      // Market hub filter
      const matchMarket =
        selectedMarketHub === 'All Markets' ||
        (w.marketHub && w.marketHub.toLowerCase().includes(selectedMarketHub.toLowerCase()));

      // Make filter
      const matchMake =
        selectedMake === 'All Makes' ||
        w.supportedMakes.some((m) => {
          if (selectedMake === 'Hybrid (Aqua/Prius/Vezel)') {
            return (
              m.toLowerCase().includes('hybrid') ||
              m.toLowerCase().includes('prius') ||
              m.toLowerCase().includes('aqua') ||
              m.toLowerCase().includes('vezel')
            );
          }
          if (selectedMake === 'Daihatsu / 660cc') {
            return (
              m.toLowerCase().includes('daihatsu') ||
              m.toLowerCase().includes('mira') ||
              m.toLowerCase().includes('660cc') ||
              m.toLowerCase().includes('dayz')
            );
          }
          if (selectedMake === 'Changan / Chinese') {
            return (
              m.toLowerCase().includes('changan') ||
              m.toLowerCase().includes('alsvin') ||
              m.toLowerCase().includes('karvaan') ||
              m.toLowerCase().includes('haval') ||
              m.toLowerCase().includes('mg')
            );
          }
          return m.toLowerCase().includes(selectedMake.toLowerCase());
        });

      // Free text search
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        w.name.toLowerCase().includes(q) ||
        w.ustaadName.toLowerCase().includes(q) ||
        w.area.toLowerCase().includes(q) ||
        (w.marketHub && w.marketHub.toLowerCase().includes(q)) ||
        w.famousFor.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        w.supportedMakes.some((m) => m.toLowerCase().includes(q));

      return matchCity && matchSpecialty && matchMarket && matchMake && matchQuery;
    });
  }, [selectedCity, selectedSpecialty, selectedMarketHub, selectedMake, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCity('All Cities');
    setSelectedSpecialty('All Specialties');
    setSelectedMarketHub('All Markets');
    setSelectedMake('All Makes');
    setSearchQuery('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 relative overflow-hidden shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>Verified Pakistan Automotive Workshops & Ustaad Network</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-['Chakra_Petch'] tracking-wide">
              FAMOUS WORKSHOPS OF TARGETED CITIES
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl leading-relaxed">
              Find legendary workshops and master ustaads across <strong className="text-white">Lahore</strong> (Bilal Ganj, Montgomery Rd, Model Town), <strong className="text-white">Karachi</strong> (Shershah, Plaza, PECHS), <strong className="text-white">Rawalpindi</strong> (Sultan Ka Khoo), <strong className="text-white">Islamabad</strong> (G-8, I-9), <strong className="text-white">Faisalabad</strong>, <strong className="text-white">Peshawar</strong> (Karkhano), <strong className="text-white">Multan</strong>, and <strong className="text-white">Gujranwala</strong>.
            </p>
          </div>

          {/* Quick Geolocation button */}
          <button
            id="detect-city-btn"
            type="button"
            onClick={handleDetectLocation}
            disabled={locating}
            className="self-start sm:self-center flex-shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-amber-500/50 hover:text-white transition-all shadow-sm"
          >
            <Navigation className={`w-4 h-4 text-amber-400 ${locating ? 'animate-spin' : ''}`} />
            <span>{locating ? 'Locating...' : 'Detect My City'}</span>
          </button>
        </div>

        {locationStatus && (
          <div className="mt-3 text-xs font-mono text-amber-400 bg-neutral-950/80 p-2 rounded-lg border border-amber-500/20 inline-block">
            {locationStatus}
          </div>
        )}
      </div>

      {/* Filter Controls Bar */}
      <div className="space-y-3.5 mb-6">
        {/* Search & City Select Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-8 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by market (e.g., Bilal Ganj, Shershah, G-8), ustaad name, car or fault..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500 text-neutral-100 placeholder-neutral-500 text-xs sm:text-sm transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 text-xs font-mono"
              >
                Clear
              </button>
            )}
          </div>

          {/* City Dropdown for Mobile / Direct Select */}
          <div className="sm:col-span-4 relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400 pointer-events-none" />
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setSelectedMarketHub('All Markets');
              }}
              className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-amber-500 text-neutral-100 text-xs sm:text-sm font-medium appearance-none cursor-pointer"
            >
              {CITIES.map((c) => (
                <option key={c} value={c} className="bg-neutral-900 text-white">
                  {c} {cityCounts[c] ? `(${cityCounts[c]} workshops)` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Targeted Cities Tabs with Badge Counts */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[11px] font-mono text-neutral-500 flex-shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-amber-400" />
            Target Cities:
          </span>
          {CITIES.map((city) => {
            const count = cityCounts[city] || 0;
            const isSelected = selectedCity === city;
            return (
              <button
                key={city}
                type="button"
                onClick={() => {
                  setSelectedCity(city);
                  setSelectedMarketHub('All Markets');
                }}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm shadow-amber-500/20'
                    : 'bg-neutral-900/90 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                <span>{city}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    isSelected
                      ? 'bg-neutral-950 text-amber-400'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Famous Scrap & Auto Markets Strip */}
        <div className="p-2.5 rounded-xl bg-neutral-950/90 border border-neutral-850 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          <span className="text-[11px] font-mono text-amber-400 flex-shrink-0 mr-1 flex items-center gap-1 font-semibold">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Famous Markets:
          </span>
          {FAMOUS_MARKET_HUBS.map((hub) => {
            const isSelected = selectedMarketHub === hub.name;
            return (
              <button
                key={hub.name}
                type="button"
                onClick={() => {
                  setSelectedMarketHub(hub.name);
                  if (hub.city !== 'All Cities') {
                    setSelectedCity(hub.city);
                  }
                }}
                className={`flex-shrink-0 px-2.5 py-1 rounded-md text-[11px] transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold'
                    : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                }`}
              >
                {hub.name}
              </button>
            );
          })}
        </div>

        {/* Specialties and Make Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
          {/* Specialty Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[11px] font-mono text-neutral-500 flex-shrink-0 mr-1 flex items-center gap-1">
              <Wrench className="w-3 h-3 text-amber-400" />
              Specialties:
            </span>
            {SPECIALTIES.map((spec) => (
              <button
                key={spec}
                type="button"
                onClick={() => setSelectedSpecialty(spec)}
                className={`flex-shrink-0 px-2.5 py-1 rounded-md text-xs transition-all ${
                  selectedSpecialty === spec
                    ? 'bg-neutral-200 text-neutral-950 font-bold shadow-sm'
                    : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850 border border-neutral-800'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>

          {/* Car Make Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[11px] font-mono text-neutral-500 flex-shrink-0 mr-1 flex items-center gap-1">
              <Car className="w-3 h-3 text-amber-400" />
              Vehicle:
            </span>
            {POPULAR_MAKES.map((make) => (
              <button
                key={make}
                type="button"
                onClick={() => setSelectedMake(make)}
                className={`flex-shrink-0 px-2.5 py-1 rounded-md text-xs transition-all ${
                  selectedMake === make
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                    : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850 border border-neutral-800'
                }`}
              >
                {make}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count & Active Filter Reset */}
      <div className="flex items-center justify-between mb-4 text-xs text-neutral-400 font-mono">
        <span>
          Showing <strong className="text-amber-400 font-bold">{filteredWorkshops.length}</strong> verified famous workshops in{' '}
          <strong className="text-white">{selectedCity}</strong>
          {selectedMarketHub !== 'All Markets' && ` • ${selectedMarketHub}`}
          {selectedSpecialty !== 'All Specialties' && ` • ${selectedSpecialty}`}
          {selectedMake !== 'All Makes' && ` • ${selectedMake}`}
        </span>
        {(selectedCity !== 'All Cities' ||
          selectedSpecialty !== 'All Specialties' ||
          selectedMarketHub !== 'All Markets' ||
          selectedMake !== 'All Makes' ||
          searchQuery) && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-amber-400 hover:underline font-semibold"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Workshop Cards Grid */}
      {filteredWorkshops.length === 0 ? (
        <div className="p-10 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center flex flex-col items-center justify-center">
          <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
          <h3 className="text-base font-bold text-white font-['Chakra_Petch']">
            No Workshops Found Matching Selected Filters
          </h3>
          <p className="text-xs text-neutral-400 max-w-md mt-1 mb-4">
            Try switching the city to "All Cities", choosing "All Markets", or searching for a broader term like "suspension", "hybrid", "engine", or "AC".
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs hover:bg-amber-400 transition-colors"
          >
            View All 50+ Pakistani Workshops
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWorkshops.map((ws) => (
            <div
              key={ws.id}
              className="p-4 sm:p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-md group relative overflow-hidden"
            >
              <div>
                {/* Top Badge & Rating Row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono font-bold text-amber-400">
                      {ws.city}
                    </span>
                    {ws.marketHub && (
                      <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-[10px] font-mono text-neutral-300">
                        {ws.marketHub}
                      </span>
                    )}
                    {ws.emergencyAvailable && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-950/50 text-amber-400 border border-amber-500/30 text-[9px] font-mono font-bold">
                        TOW / MOBILE ✓
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-950 border border-neutral-800 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-neutral-100">{ws.rating}</span>
                    <span className="text-[10px] text-neutral-500 font-mono">({ws.reviewCount})</span>
                  </div>
                </div>

                {/* Workshop Name & Ustaad */}
                <h3 className="text-base font-bold text-white font-['Chakra_Petch'] group-hover:text-amber-300 transition-colors">
                  {ws.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-neutral-300 mt-0.5 font-medium">
                  <Wrench className="w-3.5 h-3.5 text-amber-400" />
                  <span>Lead Specialist: <strong className="text-white">{ws.ustaadName}</strong></span>
                  {ws.verified && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-400 font-mono ml-1">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Famous For Callout Highlight */}
                {ws.famousFor && (
                  <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="font-medium">
                      <strong>Famous For:</strong> {ws.famousFor}
                    </span>
                  </div>
                )}

                {/* Description */}
                <p className="text-xs text-neutral-400 mt-2.5 leading-relaxed line-clamp-3">
                  {ws.description}
                </p>

                {/* Specialties Badges */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {ws.specialties.map((spec, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-neutral-950 text-[10px] font-mono text-neutral-300 border border-neutral-800"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Supported Makes & Timing */}
                <div className="mt-3 pt-3 border-t border-neutral-800/80 space-y-1.5 text-[11px] text-neutral-400 font-mono">
                  <div className="flex items-start gap-1.5">
                    <Car className="w-3.5 h-3.5 text-neutral-500 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-1">Cars: {ws.supportedMakes.join(', ')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{ws.timing}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-1.5 text-neutral-400">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-1">{ws.address}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Direct Call, WhatsApp & Google Maps */}
              <div className="mt-4 pt-3 border-t border-neutral-800 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Phone Call */}
                    <a
                      href={`tel:${ws.phone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-200 text-xs font-bold transition-colors"
                      title={`Call ${ws.name}`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Ustaad</span>
                    </a>

                    {/* WhatsApp */}
                    {ws.whatsapp && (
                      <a
                        href={`https://wa.me/${ws.whatsapp}?text=${encodeURIComponent(
                          `Salam ${ws.ustaadName}, I found ${ws.name} on the Pakistan Car Diagnostic Assistant. I need an inspection/estimate for my car.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-600/40 hover:bg-emerald-600 hover:text-white text-emerald-400 text-xs font-semibold transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>

                  {/* Google Maps Directions */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${ws.name}, ${ws.address}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400 hover:text-amber-300 transition-colors"
                    title="Open location in Google Maps"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Ask AI Diagnostician about this workshop's specialty */}
                {onAskAiAboutFault && (
                  <button
                    type="button"
                    onClick={() =>
                      onAskAiAboutFault(
                        `I am planning to visit ${ws.name} in ${ws.city} (${ws.area}) regarding ${ws.specialties.join(', ')}. What specific technical questions and inspection checklist should I ask Ustaad ${ws.ustaadName} to ensure honest pricing and avoid being overcharged?`
                      )
                    }
                    className="w-full text-center py-1.5 px-2 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-[11px] font-mono text-neutral-400 hover:text-amber-300 border border-neutral-850 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Ask AI what to inspect at this workshop</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Famous Pakistani Scrap & Spare Parts Markets Directory */}
      <div className="mt-10 p-5 rounded-2xl bg-neutral-950 border border-neutral-800">
        <h3 className="text-sm font-bold text-white font-['Chakra_Petch'] uppercase tracking-wider mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-400" />
          Major Auto Scrap & Spares Hubs in Pakistan (Kabli & OEM Markets)
        </h3>
        <p className="text-xs text-neutral-400 mb-4">
          If your mechanic recommends sourcing Kabli (Japanese scrap imported) or genuine parts, these are Pakistan's primary auto markets:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <button
            type="button"
            onClick={() => {
              setSelectedCity('Lahore');
              setSelectedMarketHub('Bilal Ganj Scrap Hub');
            }}
            className="p-3 rounded-xl bg-neutral-900/70 border border-neutral-800/80 hover:border-amber-500/40 text-left transition-all group"
          >
            <h4 className="font-bold text-amber-400 group-hover:text-amber-300">
              Bilal Ganj, Lahore →
            </h4>
            <p className="text-neutral-400 text-[11px] mt-1">
              Asia's largest scrap market for imported Japanese engines, transmissions, axles, body panels, and steering racks.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedCity('Karachi');
              setSelectedMarketHub('Shershah Kabari Bazar');
            }}
            className="p-3 rounded-xl bg-neutral-900/70 border border-neutral-800/80 hover:border-amber-500/40 text-left transition-all group"
          >
            <h4 className="font-bold text-amber-400 group-hover:text-amber-300">
              Shershah & Plaza, Karachi →
            </h4>
            <p className="text-neutral-400 text-[11px] mt-1">
              Primary seaport entry point for Japanese cut pieces, half-engines, high-voltage hybrid batteries, and JDM accessories.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedCity('Rawalpindi');
              setSelectedMarketHub('Sultan Ka Khoo / Chah Sultan');
            }}
            className="p-3 rounded-xl bg-neutral-900/70 border border-neutral-800/80 hover:border-amber-500/40 text-left transition-all group"
          >
            <h4 className="font-bold text-amber-400 group-hover:text-amber-300">
              Sultan Ka Khoo, Rawalpindi →
            </h4>
            <p className="text-neutral-400 text-[11px] mt-1">
              North hub specializing in suspensions, Mehran/Cultus/Corolla spare parts, bush pressing, and custom spring jobs.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedCity('Peshawar');
              setSelectedMarketHub('Karkhano Scrap Market');
            }}
            className="p-3 rounded-xl bg-neutral-900/70 border border-neutral-800/80 hover:border-amber-500/40 text-left transition-all group"
          >
            <h4 className="font-bold text-amber-400 group-hover:text-amber-300">
              Karkhano Market, Peshawar →
            </h4>
            <p className="text-neutral-400 text-[11px] mt-1">
              Renowned for direct Japanese 4x4 components, Prado/Surf differentials, low-mileage Toyota/Nissan engines.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

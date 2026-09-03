import { useState, useMemo } from 'react';
import {
  Bike,
  Wrench,
  Sparkles,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Gauge,
  DollarSign,
  Search,
  Zap,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Info,
  Layers,
  Fuel,
  ArrowRight,
} from 'lucide-react';
import {
  FAMOUS_BIKES_DATA,
  FAMOUS_BIKE_MECHANICS,
  BIKE_RATE_GUIDE,
  BIKE_CITIES,
  BIKE_MARKET_HUBS,
  BIKE_SPECIALTIES,
  BikeModel,
  BikeMechanic,
} from '../data/bikesData';

interface BikesHubProps {
  onAskAiAboutBikeFault: (query: string) => void;
}

type BikeSubTab = 'models' | 'mechanics' | 'rates';

export default function BikesHub({ onAskAiAboutBikeFault }: BikesHubProps) {
  const [activeSubTab, setActiveSubTab] = useState<BikeSubTab>('models');
  const [selectedBikeId, setSelectedBikeId] = useState<string>('honda-cd70');

  // Mechanic Filters
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [selectedMarket, setSelectedMarket] = useState<string>('All Bike Markets');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All Specialties');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Rate guide bike filter
  const [rateBikeFilter, setRateBikeFilter] = useState<string>('All');

  // Currently selected bike model
  const selectedBike = useMemo<BikeModel>(() => {
    return FAMOUS_BIKES_DATA.find((b) => b.id === selectedBikeId) || FAMOUS_BIKES_DATA[0];
  }, [selectedBikeId]);

  // Filter mechanics
  const filteredMechanics = useMemo<BikeMechanic[]>(() => {
    return FAMOUS_BIKE_MECHANICS.filter((mech) => {
      // City filter
      if (selectedCity !== 'All Cities' && mech.city !== selectedCity) {
        return false;
      }
      // Market filter
      if (selectedMarket !== 'All Bike Markets' && mech.marketHub !== selectedMarket) {
        return false;
      }
      // Specialty filter
      if (selectedSpecialty !== 'All Specialties' && mech.specialtyCategory !== selectedSpecialty) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = mech.name.toLowerCase().includes(q);
        const matchesUstaad = mech.ustaadName.toLowerCase().includes(q);
        const matchesArea = mech.area.toLowerCase().includes(q);
        const matchesSpecialty = mech.famousSpecialty.toLowerCase().includes(q);
        const matchesBikes = mech.supportedBikes.some((b) => b.toLowerCase().includes(q));
        const matchesLandmark = mech.landmark.toLowerCase().includes(q);
        if (!matchesName && !matchesUstaad && !matchesArea && !matchesSpecialty && !matchesBikes && !matchesLandmark) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCity, selectedMarket, selectedSpecialty, searchQuery]);

  // City counts for mechanics
  const cityCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All Cities': FAMOUS_BIKE_MECHANICS.length };
    for (const m of FAMOUS_BIKE_MECHANICS) {
      counts[m.city] = (counts[m.city] || 0) + 1;
    }
    return counts;
  }, []);

  // Filter rate guide items
  const filteredRates = useMemo(() => {
    if (rateBikeFilter === 'All') return BIKE_RATE_GUIDE;
    return BIKE_RATE_GUIDE.filter(
      (r) => r.applicableBikes.toLowerCase().includes(rateBikeFilter.toLowerCase()) || r.applicableBikes.includes('All')
    );
  }, [rateBikeFilter]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-5 text-neutral-100 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="mb-6 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono mb-2">
              <Bike className="w-3.5 h-3.5" />
              <span>PAKISTANI MOTORCYCLE PORTAL</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-['Chakra_Petch'] tracking-wide">
              Famous Bikes & Master Ustaads Network
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
              Authentic specs, common faults, and verified mechanics across Pakistan's legendary bike markets —{' '}
              <span className="text-amber-400 font-medium">McLeod Road, Akbar Road, College Road & Shoba Bazar</span>.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={() => onAskAiAboutBikeFault(selectedBike.quickDiagnosePrompt)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Diagnose {selectedBike.name.split('&')[0]}</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="mt-5 pt-3 border-t border-neutral-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveSubTab('models')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'models'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>1. Famous Bike Models & Faults</span>
            <span className="px-1.5 py-0.2 rounded bg-neutral-800 text-[10px] font-mono text-neutral-300">
              {FAMOUS_BIKES_DATA.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('mechanics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'mechanics'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>2. Bike Mechanics & Ustaads Directory</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold">
              {FAMOUS_BIKE_MECHANICS.length} Ustaads
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('rates')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'rates'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>3. Spare Parts & Labor Rate Card</span>
            <span className="px-1.5 py-0.2 rounded bg-neutral-800 text-[10px] font-mono text-neutral-300">
              PKR Rates
            </span>
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------
          SUB-TAB 1: FAMOUS BIKE MODELS & FAULTS
          ------------------------------------------------------------- */}
      {activeSubTab === 'models' && (
        <div className="space-y-5">
          {/* Bike Model Selector Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {FAMOUS_BIKES_DATA.map((bike) => {
              const isSelected = bike.id === selectedBikeId;
              return (
                <button
                  key={bike.id}
                  type="button"
                  onClick={() => setSelectedBikeId(bike.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
                    isSelected
                      ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20 border border-amber-400'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-850'
                  }`}
                >
                  <Bike className={`w-3.5 h-3.5 ${isSelected ? 'text-neutral-950' : 'text-amber-400'}`} />
                  <span>{bike.name}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                      isSelected ? 'bg-neutral-950/20 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {bike.category}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Bike Overview Card */}
          <div className="p-4 sm:p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-['Chakra_Petch']">
                    {selectedBike.name}
                  </h2>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono">
                    {selectedBike.category}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">{selectedBike.tagline}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSubTab('mechanics');
                    setSearchQuery(selectedBike.name.split(' ')[0]);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors flex items-center gap-1.5"
                >
                  <Wrench className="w-3.5 h-3.5 text-amber-400" />
                  <span>Find {selectedBike.name.split(' ')[1] || 'Bike'} Mechanics</span>
                </button>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80">
                <span className="text-[10px] font-mono text-neutral-500 uppercase block">Engine & Bore</span>
                <span className="text-xs font-semibold text-neutral-200 mt-0.5 block">{selectedBike.engine}</span>
                <span className="text-[10px] text-neutral-400 mt-0.5 block">{selectedBike.specs.boreStroke}</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80">
                <span className="text-[10px] font-mono text-neutral-500 uppercase block">Fuel Mileage</span>
                <span className="text-xs font-semibold text-emerald-400 mt-0.5 block flex items-center gap-1">
                  <Fuel className="w-3 h-3 text-emerald-400" />
                  {selectedBike.fuelAverage}
                </span>
                <span className="text-[10px] text-neutral-400 mt-0.5 block">Tank: {selectedBike.fuelCapacity}</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80">
                <span className="text-[10px] font-mono text-neutral-500 uppercase block">Oil & Transmission</span>
                <span className="text-xs font-semibold text-neutral-200 mt-0.5 block">{selectedBike.oilCapacity}</span>
                <span className="text-[10px] text-neutral-400 mt-0.5 block">{selectedBike.transmission}</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80">
                <span className="text-[10px] font-mono text-neutral-500 uppercase block">Top Speed & Brakes</span>
                <span className="text-xs font-semibold text-amber-400 mt-0.5 block flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-amber-400" />
                  {selectedBike.topSpeed}
                </span>
                <span className="text-[10px] text-neutral-400 mt-0.5 block truncate">{selectedBike.specs.brakes}</span>
              </div>
            </div>

            {/* Iconic Trait Callout */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5 mb-5">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold font-mono uppercase text-[11px] text-amber-400">Pakistani Market Reputation: </span>
                <span>{selectedBike.iconicTrait}</span>
              </div>
            </div>

            {/* Common Faults & Symptoms */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-['Chakra_Petch'] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Signature Common Faults & Symptoms</span>
                </h3>
                <span className="text-[11px] font-mono text-neutral-400">Typical Pakistani Road Conditions</span>
              </div>

              <div className="space-y-3">
                {selectedBike.commonFaults.map((fault) => {
                  let urgencyBadgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                  if (fault.urgency === 'STOP RIDING IMMEDIATELY') {
                    urgencyBadgeClass = 'bg-red-500/20 text-red-400 border-red-500/40 font-bold';
                  } else if (fault.urgency === 'Safe to ride temporarily') {
                    urgencyBadgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                  }

                  return (
                    <div
                      key={fault.id}
                      className="p-3.5 sm:p-4 rounded-xl bg-neutral-950/70 border border-neutral-800/80 hover:border-neutral-700 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-neutral-100 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          {fault.title}
                        </h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border self-start sm:self-auto ${urgencyBadgeClass}`}>
                          {fault.urgency}
                        </span>
                      </div>

                      <div className="mt-2 space-y-1.5 text-xs text-neutral-300">
                        <p>
                          <strong className="text-neutral-400">Symptom: </strong>
                          {fault.symptom}
                        </p>
                        <p>
                          <strong className="text-neutral-400">Root Cause: </strong>
                          {fault.rootCause}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-amber-400 font-semibold">{fault.estimatedCostPkr}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              onAskAiAboutBikeFault(
                                `My ${selectedBike.name} has this problem: "${fault.title}". Symptom: ${fault.symptom}. Can you give a detailed diagnostic breakdown and what to tell the ustaad?`
                              )
                            }
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 hover:text-amber-300 transition-colors font-mono"
                          >
                            <span>Ask AI Diagnosis</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Ustaad Advice Box */}
                      <div className="mt-2 p-2 rounded-lg bg-neutral-900/90 border border-neutral-800 text-[11px] text-neutral-400 flex items-start gap-2">
                        <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-neutral-300 font-mono">Ustaad Tip: </strong>
                          {fault.ustaadAdvice}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Spare Parts Cost Comparison Table */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-['Chakra_Petch'] flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Key Spare Parts Price Guide (OEM Genuine vs Crown / Aftermarket)</span>
                </h3>
              </div>

              <div className="overflow-x-auto rounded-xl border border-neutral-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-950 border-b border-neutral-800 text-[11px] font-mono text-neutral-400">
                      <th className="p-3">Spare Part</th>
                      <th className="p-3">Atlas / OEM Genuine</th>
                      <th className="p-3">Crown / Quality Local</th>
                      <th className="p-3">Avg Lifespan</th>
                      <th className="p-3">Ustaad Advice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-850">
                    {selectedBike.sparePartQuotes.map((part, idx) => (
                      <tr key={idx} className="hover:bg-neutral-850/50 transition-colors">
                        <td className="p-3 font-medium text-neutral-200">{part.partName}</td>
                        <td className="p-3 font-mono text-emerald-400 font-semibold">{part.atlasOemPkr}</td>
                        <td className="p-3 font-mono text-amber-300">{part.crownOrLocalPkr}</td>
                        <td className="p-3 text-neutral-400 font-mono text-[11px]">{part.lifespan}</td>
                        <td className="p-3 text-neutral-300 text-[11px]">{part.ustaadTip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          SUB-TAB 2: BIKE MECHANICS & USTAADS DIRECTORY
          ------------------------------------------------------------- */}
      {activeSubTab === 'mechanics' && (
        <div className="space-y-5">
          {/* City Selection Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {BIKE_CITIES.map((city) => {
              const isSelected = selectedCity === city;
              const count = cityCounts[city] || 0;
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    setSelectedCity(city);
                    setSelectedMarket('All Bike Markets');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                    isSelected
                      ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                      : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850 border border-neutral-800'
                  }`}
                >
                  <span>{city}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                      isSelected ? 'bg-neutral-950/30 text-neutral-950 font-bold' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Market Hubs & Specialty Filters */}
          <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ustaad name, shop, area (McLeod, Akbar Rd), or bike model..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              {/* Specialty Dropdown */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500/50"
                >
                  {BIKE_SPECIALTIES.map((spec) => (
                    <option key={spec} value={spec} className="bg-neutral-950">
                      {spec}
                    </option>
                  ))}
                </select>

                {(searchQuery || selectedSpecialty !== 'All Specialties' || selectedCity !== 'All Cities') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedSpecialty('All Specialties');
                      setSelectedCity('All Cities');
                      setSelectedMarket('All Bike Markets');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 font-mono"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Quick Market Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none">
              <span className="text-[10px] font-mono text-neutral-500 uppercase flex-shrink-0">Hubs:</span>
              {BIKE_MARKET_HUBS.map((hub) => {
                const isSelected = selectedMarket === hub.name;
                return (
                  <button
                    key={hub.name}
                    type="button"
                    onClick={() => {
                      setSelectedMarket(hub.name);
                      if (hub.city !== 'All Cities') setSelectedCity(hub.city);
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                        : 'text-neutral-400 hover:text-neutral-200 bg-neutral-950/60 border border-neutral-850'
                    }`}
                  >
                    {hub.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mechanics Results List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
              <span>
                Showing <strong className="text-white">{filteredMechanics.length}</strong> master bike mechanics
                {selectedCity !== 'All Cities' && ` in ${selectedCity}`}
              </span>
              <span className="text-[11px] font-mono text-amber-400">Direct Phone & WhatsApp Available</span>
            </div>

            {filteredMechanics.length === 0 ? (
              <div className="p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center">
                <Wrench className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-neutral-200 font-['Chakra_Petch']">No mechanics found</h4>
                <p className="text-xs text-neutral-400 mt-1">Try relaxing your search query or selecting "All Cities".</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredMechanics.map((mech) => (
                  <div
                    key={mech.id}
                    className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Row: Name, Verified & Experience */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-bold text-white font-['Chakra_Petch'] group-hover:text-amber-300 transition-colors">
                              {mech.name}
                            </h3>
                            {mech.verified && (
                              <span title="Verified Master Ustaad">
                                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-amber-400 font-medium mt-0.5 flex items-center gap-1">
                            <span>{mech.ustaadName}</span>
                            <span className="text-neutral-500 font-mono">({mech.experienceYears}+ yrs exp)</span>
                          </p>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold">
                            <span>★</span>
                            <span>{mech.rating}</span>
                            <span className="text-neutral-500 text-[10px]">({mech.reviewCount})</span>
                          </div>
                        </div>
                      </div>

                      {/* Famous Specialty Box */}
                      <div className="mt-3 p-2 rounded-lg bg-neutral-950/80 border border-neutral-800/80 text-xs">
                        <span className="text-[10px] font-mono text-amber-400 uppercase block font-semibold">
                          Known Across {mech.city} For:
                        </span>
                        <p className="text-neutral-200 text-[11px] mt-0.5 leading-snug">{mech.famousSpecialty}</p>
                      </div>

                      {/* Supported Bikes Chips */}
                      <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                        {mech.supportedBikes.map((bikeName, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-300 border border-neutral-700/60"
                          >
                            {bikeName}
                          </span>
                        ))}
                      </div>

                      {/* Location & Landmark */}
                      <div className="mt-3 text-xs text-neutral-400 space-y-1">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2 text-[11px]">
                            {mech.address} — <em className="text-neutral-300 not-italic">({mech.landmark})</em>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-mono">
                          <Clock className="w-3 h-3 text-neutral-500" />
                          <span>{mech.timing}</span>
                          {mech.emergencyAvailable && (
                            <span className="text-emerald-400 ml-1 font-semibold">• Emergency Roadside Assistance</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* Direct Phone Call */}
                        <a
                          href={`tel:${mech.phone}`}
                          className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
                          title="Call mechanic"
                        >
                          <Phone className="w-3 h-3 text-emerald-400" />
                          <span>{mech.phone}</span>
                        </a>

                        {/* Direct WhatsApp */}
                        {mech.whatsapp && (
                          <a
                            href={`https://wa.me/${mech.whatsapp}?text=${encodeURIComponent(
                              `As-salamu alaykum Ustaad ji, I found your workshop on the Bike Diagnostic portal. I want to inspect my motorcycle.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/80 hover:bg-emerald-900 text-emerald-400 text-xs transition-colors"
                            title="Message on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {/* Google Maps Directions */}
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(`${mech.name} ${mech.address} ${mech.city}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors"
                          title="Open Google Maps Location"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      {/* Ask AI to compose inspection questions for this ustaad */}
                      <button
                        type="button"
                        onClick={() =>
                          onAskAiAboutBikeFault(
                            `I am going to visit ${mech.ustaadName} at ${mech.name} in ${mech.marketHub}, ${mech.city}. What specific questions should I ask him about inspecting my motorcycle's engine, tappets, and clutch?`
                          )
                        }
                        className="text-[11px] font-mono text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-semibold"
                      >
                        <span>Ask AI Questions</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          SUB-TAB 3: SPARE PARTS & LABOR RATE CARD
          ------------------------------------------------------------- */}
      {activeSubTab === 'rates' && (
        <div className="space-y-5">
          {/* Bike Filter for Rate Guide */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-['Chakra_Petch']">
                Pakistani Motorcycle Labor & Spare Parts Price Guide
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Transparent market rates for Atlas Honda, Suzuki, Yamaha, and Chinese 70cc maintenance.
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono text-neutral-500">Filter Bike:</span>
              <select
                value={rateBikeFilter}
                onChange={(e) => setRateBikeFilter(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500/50"
              >
                <option value="All">All Bikes</option>
                <option value="CD 70">Honda CD 70</option>
                <option value="CG 125">Honda CG 125</option>
                <option value="YBR">Yamaha YBR 125</option>
                <option value="GS 150">Suzuki GS 150</option>
              </select>
            </div>
          </div>

          {/* Rate Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredRates.map((rate) => (
              <div
                key={rate.id}
                className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white font-['Chakra_Petch']">
                      {rate.task}
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-300 border border-neutral-700/60 flex-shrink-0">
                      {rate.applicableBikes}
                    </span>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="mt-3 grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-neutral-950 border border-neutral-850 text-center">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-500 uppercase block">Parts Cost</span>
                      <span className="text-xs font-semibold text-neutral-300 mt-0.5 block">{rate.partsCostRange}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-neutral-500 uppercase block">Labor Mazdoori</span>
                      <span className="text-xs font-semibold text-amber-400 mt-0.5 block">{rate.laborCostRange}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-neutral-500 uppercase block">Total Range</span>
                      <span className="text-xs font-bold text-emerald-400 mt-0.5 block">{rate.totalEstimate}</span>
                    </div>
                  </div>

                  {/* Specifications & Recommendations */}
                  <div className="mt-3 space-y-1 text-xs text-neutral-300">
                    <p>
                      <strong className="text-neutral-400 font-mono text-[11px]">Recommended Brands: </strong>
                      {rate.recommendedBrands}
                    </p>
                    <div className="flex items-center gap-4 text-[11px] text-neutral-400 font-mono">
                      <span>Time: {rate.timeRequired}</span>
                      <span>•</span>
                      <span>Frequency: {rate.frequency}</span>
                    </div>
                  </div>
                </div>

                {/* Ustaad Warning Note */}
                <div className="mt-3 pt-2.5 border-t border-neutral-850">
                  <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-400 font-mono">Important Tip: </strong>
                      {rate.ustaadNote}
                    </div>
                  </div>

                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        onAskAiAboutBikeFault(
                          `What are the typical parts, lathe work, and labor charges for ${rate.task} for ${rate.applicableBikes} in Pakistan? Are there any common workshop scams or fake parts to watch out for?`
                        )
                      }
                      className="text-[11px] font-mono text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 font-semibold"
                    >
                      <span>Ask AI about this job</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Anti-Fraud Guide for Pakistani Bike Owners */}
          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/80 border border-amber-500/30">
            <h4 className="text-sm font-bold text-white font-['Chakra_Petch'] uppercase tracking-wider flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Pakistani Bike Owner's Anti-Fraud & Reliability Tips</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300">
              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800">
                <span className="font-bold text-amber-400 font-mono block mb-1">
                  1. Beware of Recycled / Fake Mobile Oil ("Do Number Tel")
                </span>
                <p className="text-neutral-400 leading-relaxed">
                  Always inspect the security foil seal under the cap of your Havoline, Total, Yamalube, or Atlas oil bottle.
                  Crush the empty bottle after use so roadside shops cannot refill it with burned recycled oil.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800">
                <span className="font-bold text-amber-400 font-mono block mb-1">
                  2. Cylinder Bore "Running-In" (First 500 km)
                </span>
                <p className="text-neutral-400 leading-relaxed">
                  After getting a ring piston or cylinder bore job, never throttle above 40-45 km/h for the first 500 km.
                  Change engine oil at 300 km to flush out micro-metal shavings from the lathe hone.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800">
                <span className="font-bold text-amber-400 font-mono block mb-1">
                  3. Feeler Gauge vs Finger Tappet Setting
                </span>
                <p className="text-neutral-400 leading-relaxed">
                  A professional ustaad sets CG 125 tappets with a 0.08mm feeler gauge on a stone-cold engine.
                  Avoid mechanics who tighten tappets by fingertip feel on hot engines, which burns valves on highway runs.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800">
                <span className="font-bold text-amber-400 font-mono block mb-1">
                  4. Replace Entire Chain & Sprocket Set Together
                </span>
                <p className="text-neutral-400 leading-relaxed">
                  Never replace only the drive chain while leaving hooked, worn sprockets in place. Worn sprockets will
                  stretch and destroy a brand-new chain within 1,500 km.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

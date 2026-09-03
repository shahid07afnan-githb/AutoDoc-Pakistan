import { useState } from 'react';
import { DollarSign, ShieldAlert, Tag, Check, Info, ArrowUpRight, Search, Wrench } from 'lucide-react';

interface PartCostItem {
  category: string;
  item: string;
  popularCars: string;
  kabliPrice: string;
  newAftermarketPrice: string;
  oemGenuinePrice: string;
  laborRate: string;
  recommendation: 'Kabli' | 'Brand New' | 'OEM Genuine';
  notes: string;
}

const PAKISTAN_PRICE_INDEX: PartCostItem[] = [
  {
    category: 'Suspension & Axles',
    item: 'Front Outer CV Joint (Goda)',
    popularCars: 'Suzuki Alto / Cultus / Wagon R',
    kabliPrice: 'Rs. 2,000 – 3,500',
    newAftermarketPrice: 'Rs. 2,500 – 4,500 (GSP / C.V.K)',
    oemGenuinePrice: 'Rs. 9,000 – 16,000 (Pak Suzuki SGP)',
    laborRate: 'Rs. 1,000 – 1,800 per side',
    recommendation: 'Brand New',
    notes: 'Brand new good quality aftermarket (GSP or Japanese 555) is safer than used Kabli joints which may already have internal ball cage wear.',
  },
  {
    category: 'Suspension & Axles',
    item: 'Front Lower Control Arms (Chimtay with Bushes)',
    popularCars: 'Toyota Corolla (GLi/Altis) & Yaris',
    kabliPrice: 'Rs. 4,500 – 7,500 (Pair, Bilal Ganj)',
    newAftermarketPrice: 'Rs. 6,000 – 11,000 (Taiwanese/RBI)',
    oemGenuinePrice: 'Rs. 24,000 – 38,000 (Toyota Indus)',
    laborRate: 'Rs. 1,500 – 2,500',
    recommendation: 'Kabli',
    notes: 'Genuine Japanese Kabli control arms from Shershah or Bilal Ganj with original factory rubber bushes usually outlast cheap Chinese aftermarket arms on Pakistani potholes.',
  },
  {
    category: 'Braking System',
    item: 'Front Brake Pads (Complete Set)',
    popularCars: 'Honda Civic & City / Suzuki Swift',
    kabliPrice: 'Not Recommended',
    newAftermarketPrice: 'Rs. 2,500 – 4,500 (MK Kashiyama / FBK)',
    oemGenuinePrice: 'Rs. 8,500 – 14,000 (Honda Genuine)',
    laborRate: 'Rs. 600 – 1,200',
    recommendation: 'Brand New',
    notes: 'Never buy used Kabli brake pads. Get genuine MK Kashiyama or Advics from authorized parts dealers to prevent brake fade and rotor scoring.',
  },
  {
    category: 'Cooling System',
    item: 'Aluminum Radiator Core',
    popularCars: 'Japanese 660cc (Mira / Move / Alto)',
    kabliPrice: 'Rs. 5,000 – 8,000 (Original Denso single/double nali)',
    newAftermarketPrice: 'Rs. 6,500 – 10,000 (Local/Chinese)',
    oemGenuinePrice: 'Rs. 22,000 – 35,000',
    laborRate: 'Rs. 1,200 – 2,000 (including coolant filling)',
    recommendation: 'Kabli',
    notes: 'Original Japanese Denso scrap radiators tested under water pressure offer higher heat dissipation than thin cheap Chinese aftermarket cores in summer traffic.',
  },
  {
    category: 'Engine & Fuel',
    item: 'Throttle Body & IACV Assembly',
    popularCars: 'Suzuki Cultus / Mehran EFI / Wagon R',
    kabliPrice: 'Rs. 4,000 – 7,500 (Clean import)',
    newAftermarketPrice: 'Rs. 8,000 – 14,000',
    oemGenuinePrice: 'Rs. 28,000 – 45,000',
    laborRate: 'Rs. 1,000 – 1,500 (Cleaning & Calibration)',
    recommendation: 'Kabli',
    notes: 'Kabli Japanese Mikuni/Keihin throttle assemblies are widely available in Bilal Ganj and Sultan Ka Khoo with working sensors.',
  },
  {
    category: 'Engine & Fuel',
    item: 'Electric Fuel Pump & Filter Set',
    popularCars: 'Toyota Corolla / Honda Civic',
    kabliPrice: 'Rs. 3,500 – 5,500 (Denso)',
    newAftermarketPrice: 'Rs. 3,000 – 6,000 (Bosch copy / Chinese)',
    oemGenuinePrice: 'Rs. 18,000 – 26,000',
    laborRate: 'Rs. 1,000 – 2,000 (Fuel tank drop)',
    recommendation: 'OEM Genuine',
    notes: 'Avoid cheap counterfeit fuel pumps as they fail suddenly on motorways in high temperatures. If budget is tight, inspect pressure on a genuine Kabli Denso pump.',
  },
  {
    category: 'Air Conditioning',
    item: 'Car AC Compressor (Denso Scroll/Piston)',
    popularCars: 'Toyota Corolla / Honda Civic / Suzuki Alto',
    kabliPrice: 'Rs. 12,000 – 20,000 (Tested suction)',
    newAftermarketPrice: 'Rs. 16,000 – 28,000 (Chinese Sanden/Denso copy)',
    oemGenuinePrice: 'Rs. 65,000 – 110,000',
    laborRate: 'Rs. 3,000 – 6,000 (Gas R134a + Oil + Flush)',
    recommendation: 'Kabli',
    notes: '90% of Pakistani AC ustaads install Kabli compressors from Karachi or Bilal Ganj. Ensure they test hand compression suction and check internal oil cleanliness before purchase.',
  },
  {
    category: 'Electrical & Ignition',
    item: 'Engine Ignition Coils (Pack of 3 or 4)',
    popularCars: 'Suzuki Alto 660cc / Vitz / City',
    kabliPrice: 'Rs. 1,500 – 2,500 each (Rs. 6k set)',
    newAftermarketPrice: 'Rs. 2,000 – 3,500 each (Diamond / YEC)',
    oemGenuinePrice: 'Rs. 8,000 – 14,000 each',
    laborRate: 'Rs. 500 – 1,000',
    recommendation: 'Brand New',
    notes: 'Get Japanese Diamond or YEC brand new coils. Used Kabli coils often develop micro-cracks that cause misfiring once the engine gets hot under load.',
  },
];

export default function RatesGuide({ onAskAboutRate }: { onAskAboutRate?: (item: string) => void }) {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Suspension & Axles', 'Braking System', 'Cooling System', 'Engine & Fuel', 'Air Conditioning', 'Electrical & Ignition'];

  const filtered = PAKISTAN_PRICE_INDEX.filter((item) => {
    const matchCat = filterCategory === 'All' || item.category === filterCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchQ =
      !q ||
      item.item.toLowerCase().includes(q) ||
      item.popularCars.toLowerCase().includes(q) ||
      item.notes.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-neutral-900 border border-neutral-800 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-2">
          <DollarSign className="w-3.5 h-3.5" />
          <span>Pakistani Market Price & Labor Index (PKR)</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white font-['Chakra_Petch'] tracking-wide">
          PARTS & USTAAD LABOR RATE CARD
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl leading-relaxed">
          Realistic pricing benchmark across major Pakistani spare parts hubs (Bilal Ganj Lahore, Shershah Karachi, Sultan Ka Khoo Rawalpindi). Compare Kabli vs Brand New vs Genuine OEM before visiting a workshop.
        </p>

        {/* Filter bar */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search component (e.g., Goda, Chimtay, Compressor, AC gas)..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-amber-500"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  filterCategory === cat
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Guide Cards */}
      <div className="space-y-4">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col gap-3"
          >
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                  {item.category}
                </span>
                <h3 className="text-base font-bold text-white font-['Chakra_Petch']">
                  {item.item}
                </h3>
                <span className="text-xs text-neutral-400 font-sans">
                  Commonly fitted in: <strong className="text-neutral-300">{item.popularCars}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-neutral-400">Recommended Choice:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                    item.recommendation === 'Kabli'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : item.recommendation === 'Brand New'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  }`}
                >
                  ✓ {item.recommendation}
                </span>
              </div>
            </div>

            {/* Price Comparison Columns */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 font-mono text-xs">
              <div className="flex flex-col">
                <span className="text-[10px] text-neutral-500 uppercase">Kabli (Japanese Scrap)</span>
                <span className="text-neutral-200 font-bold mt-0.5">{item.kabliPrice}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] text-neutral-500 uppercase">Brand New Aftermarket</span>
                <span className="text-amber-400 font-bold mt-0.5">{item.newAftermarketPrice}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] text-neutral-500 uppercase">OEM Dealership Genuine</span>
                <span className="text-neutral-300 font-bold mt-0.5">{item.oemGenuinePrice}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] text-neutral-500 uppercase">Ustaad Labor (Mazdoori)</span>
                <span className="text-emerald-400 font-bold mt-0.5">{item.laborRate}</span>
              </div>
            </div>

            {/* Practical Advice & Tip */}
            <div className="flex items-start gap-2 text-xs text-neutral-300 bg-neutral-900 p-2.5 rounded-xl border border-neutral-800">
              <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">{item.notes}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mechanic Negotiation & Anti-Fraud Tips for Pakistani Car Owners */}
      <div className="mt-8 p-5 rounded-2xl bg-neutral-950 border border-amber-500/30">
        <h3 className="text-sm font-bold text-amber-400 font-['Chakra_Petch'] uppercase tracking-wider mb-2 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          5 Golden Rules for Dealing with Mechanics in Pakistan
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300 mt-3">
          <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <strong className="text-white block mb-1">1. Ask for Old Parts (Purana Samaan)</strong>
            Always tell the mechanic before starting work: "Jo cheez badlein ge, purani gari ki diggi mein rakhna." This stops dishonest workshops from charging for replacement parts they never actually changed.
          </div>

          <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <strong className="text-white block mb-1">2. Agree on Labor (Mazdoori) Upfront</strong>
            Always fix the labor charge prior to disassembling. Asking "Ustaad ji kholnay se pehle batayein kul mazdoori kitni ho gi?" prevents inflated labor bills once the car is dismantled on hydraulic jack.
          </div>

          <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <strong className="text-white block mb-1">3. Don't Let Them Remove Thermostat Valve</strong>
            Pakistani roadside mechanics love to remove the engine thermostat valve ("Direct kr dete hain"). This causes low operating temperatures, excess fuel consumption, carbon buildup, and AC cooling cutoffs on modern EFI/VVT engines.
          </div>

          <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <strong className="text-white block mb-1">4. Verify Japanese Kabli Warranty (Check Return)</strong>
            When buying Kabli assemblies (radiators, compressors, steering racks, axles) from Bilal Ganj or Shershah, always insist on a minimum 3 to 7 days "Check Return Warranty" on the shop receipt.
          </div>
        </div>
      </div>
    </div>
  );
}

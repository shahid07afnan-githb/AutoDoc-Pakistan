export interface VehicleProfile {
  id: string;
  name: string;
  type: 'car' | 'bike';
  makeModel: string;
  year: number;
  currentMileageKm: number;
  oilIntervalKm: number;
  lastOilChangeKm: number;
  oilGrade: string;
  oilBrand: string;
  fuelType?: 'Petrol' | 'Hybrid' | 'Diesel' | 'Electric';
  regNumber?: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleType: 'car' | 'bike';
  date: string;
  mileageKm: number;
  serviceType: 
    | 'Oil & Filter'
    | 'Brakes'
    | 'Tuning & Plugs'
    | 'Suspension & Tyres'
    | 'Electrical & Battery'
    | 'Transmission'
    | 'Cooling System'
    | 'General Periodic Service'
    | 'Other';
  description: string;
  partsReplaced?: string;
  costPkr: number;
  workshopName: string;
  city: string;
  notes?: string;
}

export interface MaintenanceScheduleItem {
  id: string;
  title: string;
  vehicleType: 'car' | 'bike' | 'both';
  intervalKm: number;
  category: 'Engine' | 'Fluids' | 'Brakes' | 'Tyres & Drive' | 'Filters & Intake' | 'Electrical';
  description: string;
  importance: 'critical' | 'important' | 'routine';
  tips: string;
}

export const DEFAULT_VEHICLES: VehicleProfile[] = [
  {
    id: 'veh-alto-01',
    name: 'Suzuki Alto VXR',
    type: 'car',
    makeModel: 'Suzuki Alto (660cc R06A)',
    year: 2022,
    currentMileageKm: 34200,
    oilIntervalKm: 5000,
    lastOilChangeKm: 31000,
    oilGrade: '0W-20 (Synthetic)',
    oilBrand: 'Suzuki Genuine Oil (SGO)',
    fuelType: 'Petrol',
    regNumber: 'LEA-22-4819',
  },
  {
    id: 'veh-cg125-02',
    name: 'Honda CG 125',
    type: 'bike',
    makeModel: 'Honda CG 125 (Pushrod OHV)',
    year: 2023,
    currentMileageKm: 14600,
    oilIntervalKm: 1200,
    lastOilChangeKm: 13800,
    oilGrade: '20W-50 (4T Motorcycle Oil)',
    oilBrand: 'Caltex Havoline Super 4T',
    fuelType: 'Petrol',
    regNumber: 'KHI-23-8821',
  },
];

export interface VehiclePreset {
  label: string;
  name: string;
  makeModel: string;
  type: 'car' | 'bike';
  oilIntervalKm: number;
  oilGrade: string;
  oilBrand: string;
  fuelType: 'Petrol' | 'Hybrid' | 'Diesel';
}

export const PAKISTANI_VEHICLE_PRESETS: VehiclePreset[] = [
  // CARS
  {
    label: 'Suzuki Alto 660cc (VXR/VXL)',
    name: 'Suzuki Alto 660cc',
    makeModel: 'Suzuki Alto 660cc R06A',
    type: 'car',
    oilIntervalKm: 5000,
    oilGrade: '0W-20 (Synthetic)',
    oilBrand: 'Suzuki Genuine Oil (SGO)',
    fuelType: 'Petrol',
  },
  {
    label: 'Suzuki Cultus 1.0L (K10B)',
    name: 'Suzuki Cultus 1.0L',
    makeModel: 'Suzuki Cultus VXL/AGS (K10B)',
    type: 'car',
    oilIntervalKm: 5000,
    oilGrade: '5W-30 (Synthetic Blend)',
    oilBrand: 'Total Quartz 9000 / SGO',
    fuelType: 'Petrol',
  },
  {
    label: 'Suzuki Wagon R 1.0L',
    name: 'Suzuki Wagon R',
    makeModel: 'Suzuki Wagon R VXR/VXL (K10B)',
    type: 'car',
    oilIntervalKm: 5000,
    oilGrade: '5W-30 (Semi-Synthetic)',
    oilBrand: 'SGO / ZIC X7',
    fuelType: 'Petrol',
  },
  {
    label: 'Toyota Corolla (1.3 / 1.6 / 1.8)',
    name: 'Toyota Corolla Altis',
    makeModel: 'Toyota Corolla GLi/Altis 1.6',
    type: 'car',
    oilIntervalKm: 5000,
    oilGrade: '5W-30 (Fully Synthetic)',
    oilBrand: 'Toyota Taglon 5W-30',
    fuelType: 'Petrol',
  },
  {
    label: 'Toyota Yaris (1.3 / 1.5 ATIV)',
    name: 'Toyota Yaris ATIV',
    makeModel: 'Toyota Yaris 1.3L / 1.5L ATIV X',
    type: 'car',
    oilIntervalKm: 5000,
    oilGrade: '0W-20 / 5W-30',
    oilBrand: 'Toyota Taglon Synthetic',
    fuelType: 'Petrol',
  },
  {
    label: 'Honda Civic (Reborn / Rebirth / X / XI)',
    name: 'Honda Civic Oriel',
    makeModel: 'Honda Civic 1.8L i-VTEC / 1.5 Turbo',
    type: 'car',
    oilIntervalKm: 5000,
    oilGrade: '5W-30 / 0W-20 (SN/SP)',
    oilBrand: 'Honda Genuine SN 3.7L',
    fuelType: 'Petrol',
  },
  {
    label: 'Honda City (1.2 / 1.3 / 1.5)',
    name: 'Honda City 1.3/1.5',
    makeModel: 'Honda City Aspire 1.5L',
    type: 'car',
    oilIntervalKm: 5000,
    oilGrade: '5W-30 (Synthetic)',
    oilBrand: 'Honda Genuine Motor Oil',
    fuelType: 'Petrol',
  },
  {
    label: 'Daihatsu Mira / Move 660cc',
    name: 'Daihatsu Mira ES',
    makeModel: 'Daihatsu Mira KF-VE 660cc JDM',
    type: 'car',
    oilIntervalKm: 5000,
    oilGrade: '0W-20 Eco Idling',
    oilBrand: 'Castrol Magnatec / Shell Helix',
    fuelType: 'Petrol',
  },
  {
    label: 'Toyota Prius / Aqua (Hybrid)',
    name: 'Toyota Aqua Hybrid',
    makeModel: 'Toyota Aqua / Prius 1.5L Hybrid',
    type: 'car',
    oilIntervalKm: 6000,
    oilGrade: '0W-20 (Hybrid Formula)',
    oilBrand: 'Toyota Genuine Hybrid 0W-20',
    fuelType: 'Hybrid',
  },
  {
    label: 'Kia Sportage 2.0L',
    name: 'Kia Sportage AWD/FWD',
    makeModel: 'Kia Sportage 2.0L Nu Engine',
    type: 'car',
    oilIntervalKm: 5000,
    oilGrade: '5W-30 (Full Synthetic)',
    oilBrand: 'Total Quartz 9000 / Shell Ultra',
    fuelType: 'Petrol',
  },
  // BIKES
  {
    label: 'Honda CD 70 / 70cc Clones',
    name: 'Honda CD 70 Dream',
    makeModel: 'Honda CD 70 (4-Stroke Air-Cooled)',
    type: 'bike',
    oilIntervalKm: 1000,
    oilGrade: '20W-50 (4T Motorcycle Oil)',
    oilBrand: 'Atlas Honda 4T Red (0.7L)',
    fuelType: 'Petrol',
  },
  {
    label: 'Honda CG 125 (Euro 2 / Self)',
    name: 'Honda CG 125',
    makeModel: 'Honda CG 125 OHV Pushrod',
    type: 'bike',
    oilIntervalKm: 1200,
    oilGrade: '20W-50 (Heavy Duty 4T)',
    oilBrand: 'Atlas Honda 4T / Caltex Havoline',
    fuelType: 'Petrol',
  },
  {
    label: 'Yamaha YBR 125 / YB125Z',
    name: 'Yamaha YBR 125 ESD',
    makeModel: 'Yamaha YBR 125 OHC Balancer Engine',
    type: 'bike',
    oilIntervalKm: 1500,
    oilGrade: '10W-40 (4T Synthetic Yamalube)',
    oilBrand: 'Yamaha Yamalube 4T 1.0L',
    fuelType: 'Petrol',
  },
  {
    label: 'Suzuki GS 150 / GR 150',
    name: 'Suzuki GS 150 SE',
    makeModel: 'Suzuki GS 150 (Air-Cooled 150cc)',
    type: 'bike',
    oilIntervalKm: 1500,
    oilGrade: '10W-40 or 20W-50 (4T)',
    oilBrand: 'Suzuki SGO 4T Premium',
    fuelType: 'Petrol',
  },
  {
    label: 'Honda CB 150F',
    name: 'Honda CB 150F',
    makeModel: 'Honda CB 150F SOHC Balancer',
    type: 'bike',
    oilIntervalKm: 1500,
    oilGrade: '10W-30 / 10W-40 (4T SL)',
    oilBrand: 'Atlas Honda Blue 4T Synthetic',
    fuelType: 'Petrol',
  },
];

export const DEFAULT_MAINTENANCE_RECORDS: MaintenanceRecord[] = [
  {
    id: 'rec-001',
    vehicleId: 'veh-alto-01',
    vehicleName: 'Suzuki Alto VXR',
    vehicleType: 'car',
    date: '2026-08-14',
    mileageKm: 31000,
    serviceType: 'Oil & Filter',
    description: '30,000 km Periodic Service: 0W-20 Suzuki Genuine Oil + OEM filter + AC Cabin filter cleaning.',
    partsReplaced: 'SGO 0W-20 2.8 Liters, SGO Oil Filter',
    costPkr: 6800,
    workshopName: 'Suzuki Authorized Motors',
    city: 'Lahore',
    notes: 'Next oil change due at 36,000 km. Brake pads inspected (7mm remaining).',
  },
  {
    id: 'rec-002',
    vehicleId: 'veh-cg125-02',
    vehicleName: 'Honda CG 125',
    vehicleType: 'bike',
    date: '2026-08-20',
    mileageKm: 13800,
    serviceType: 'Oil & Filter',
    description: 'Engine oil replacement + oil mesh strainer wash with petrol + chain tightening.',
    partsReplaced: 'Havoline 20W-50 4T (0.7 Liter)',
    costPkr: 1450,
    workshopName: 'Ustaad Rashid Bike Tuning',
    city: 'Lahore (McLeod Road)',
    notes: 'Tappets adjusted to 0.08mm cold clearance. Ticking reduced.',
  },
  {
    id: 'rec-003',
    vehicleId: 'veh-alto-01',
    vehicleName: 'Suzuki Alto VXR',
    vehicleType: 'car',
    date: '2026-06-10',
    mileageKm: 26000,
    serviceType: 'Brakes',
    description: 'Front disc rotor skimming & replacement of front brake pads due to squealing.',
    partsReplaced: 'MK Kashiyama Japanese Brake Pads',
    costPkr: 5200,
    workshopName: 'Al-Madina Brake Specialists',
    city: 'Rawalpindi (Sultan Ka Khoo)',
    notes: 'Pedal feel firm and responsive now.',
  },
  {
    id: 'rec-004',
    vehicleId: 'veh-cg125-02',
    vehicleName: 'Honda CG 125',
    vehicleType: 'bike',
    date: '2026-07-02',
    mileageKm: 12000,
    serviceType: 'Tuning & Plugs',
    description: 'New NGK spark plug + carburettor jetting service & air filter foam wash.',
    partsReplaced: 'NGK D8EA Spark Plug, Atlas Honda air filter sponge',
    costPkr: 950,
    workshopName: 'Akbar Autos Workshop',
    city: 'Karachi (Akbar Road)',
    notes: 'Fuel economy improved from 38 km/l to 44 km/l.',
  },
];

export const STANDARD_SCHEDULES: MaintenanceScheduleItem[] = [
  // MOTORCYCLE SCHEDULES
  {
    id: 'sch-bike-oil',
    title: 'Engine Oil & Filter Mesh Strainer',
    vehicleType: 'bike',
    intervalKm: 1200,
    category: 'Fluids',
    importance: 'critical',
    description: 'Drain old oil while warm. Clean the centrifugal oil filter rotor / bottom mesh strainer.',
    tips: 'Recommended 20W-50 API SL/MA for CG 125 & CD 70. Never exceed 1,500 km to prevent piston scuffing.',
  },
  {
    id: 'sch-bike-chain',
    title: 'Drive Chain Lube & Slack Adjustment',
    vehicleType: 'bike',
    intervalKm: 800,
    category: 'Tyres & Drive',
    importance: 'important',
    description: 'Clean road grit with kerosene, lubricate with 90-weight gear oil or chain wax, adjust slack to 25-30 mm.',
    tips: 'Prevents chain snapping and premature rear sprocket (garari) tooth wear.',
  },
  {
    id: 'sch-bike-plug',
    title: 'Spark Plug Inspection & Cleaning',
    vehicleType: 'bike',
    intervalKm: 3000,
    category: 'Engine',
    importance: 'important',
    description: 'Inspect electrode color (chocolate brown is optimal). Clean carbon deposits and set gap to 0.6–0.7 mm.',
    tips: 'Use genuine NGK C7HSA (CD70) or D8EA (CG125). Black soot indicates rich fuel mixture.',
  },
  {
    id: 'sch-bike-tappet',
    title: 'Valve / Tappet Clearance Check',
    vehicleType: 'bike',
    intervalKm: 4000,
    category: 'Engine',
    importance: 'important',
    description: 'Measure clearance with feeler gauge at Top Dead Center (TDC) compression stroke.',
    tips: 'CD70: 0.05 mm intake & exhaust. CG125: 0.08 mm intake & exhaust. Prevents valve burnout.',
  },
  {
    id: 'sch-bike-airfilter',
    title: 'Air Filter Cleaning & Oil Treatment',
    vehicleType: 'bike',
    intervalKm: 3000,
    category: 'Filters & Intake',
    importance: 'routine',
    description: 'Wash polyurethane foam in kerosene, squeeze dry, and apply a few drops of clean 20W-50 oil.',
    tips: 'Dust in Pakistani city roads clogs filters fast, causing heavy petrol consumption and black smoke.',
  },
  {
    id: 'sch-bike-brakes',
    title: 'Brake Shoes & Cable Lubrication',
    vehicleType: 'bike',
    intervalKm: 5000,
    category: 'Brakes',
    importance: 'critical',
    description: 'Open brake drum, blow dust with compressed air, inspect lining thickness, lubricate cam pivot.',
    tips: 'Replace brake shoes if lining is under 2.0 mm. Never get grease on brake linings.',
  },
  {
    id: 'sch-bike-carb',
    title: 'Carburettor Deep Clean & Float Bowl Drain',
    vehicleType: 'bike',
    intervalKm: 6000,
    category: 'Filters & Intake',
    importance: 'routine',
    description: 'Disassemble jets, blow through pilot and main emulsion tubes, verify float needle seal.',
    tips: 'Solves cold morning hard starting, throttle hesitation, and fuel dripping from overflow tube.',
  },

  // CAR SCHEDULES
  {
    id: 'sch-car-oil',
    title: 'Engine Oil & Genuine Filter Replacement',
    vehicleType: 'car',
    intervalKm: 5000,
    category: 'Fluids',
    importance: 'critical',
    description: 'Drain engine oil, replace spin-on / element oil filter, check drain plug washer.',
    tips: 'Use 0W-20 for 660cc Kei cars (Alto, Mira), 5W-30 for modern sedans (Civic, Corolla, Yaris). Always use genuine Japanese / OEM filter.',
  },
  {
    id: 'sch-car-filters',
    title: 'Engine Air Filter & AC Cabin Filter',
    vehicleType: 'car',
    intervalKm: 10000,
    category: 'Filters & Intake',
    importance: 'important',
    description: 'Replace paper air filter element and cabin filter behind glovebox. Inspect every 5,000 km.',
    tips: 'Clogged AC filter leads to weak air throw and evaporator coil cooling failure in summer heat.',
  },
  {
    id: 'sch-car-tyrerotate',
    title: 'Tire Rotation & Wheel Alignment',
    vehicleType: 'car',
    intervalKm: 10000,
    category: 'Tyres & Drive',
    importance: 'routine',
    description: 'Rotate front to rear in cross pattern. Inspect computerized alignment toe and camber.',
    tips: 'Pakistan potholes knock alignment out easily, causing outer edge tire shaving and steering pull.',
  },
  {
    id: 'sch-car-brakepads',
    title: 'Brake Pads & Disc Rotor Thickness Inspection',
    vehicleType: 'car',
    intervalKm: 10000,
    category: 'Brakes',
    importance: 'critical',
    description: 'Check inner and outer pad friction material, slide pins lubrication, caliper dust boots.',
    tips: 'Replace pads when under 3 mm. Skim rotors only if grooved or vibrating under high-speed braking.',
  },
  {
    id: 'sch-car-throttle',
    title: 'Throttle Body Service & MAF Sensor Clean',
    vehicleType: 'car',
    intervalKm: 20000,
    category: 'Engine',
    importance: 'important',
    description: 'Remove carbon ring from butterfly flap using specialized electronic cleaner. Clean MAF wire gently.',
    tips: 'Fixes unstable idling, RPM drops when AC compressor kicks in, and poor initial pickup.',
  },
  {
    id: 'sch-car-sparkplugs',
    title: 'Iridium / Nickel Spark Plug Replacement',
    vehicleType: 'car',
    intervalKm: 30000,
    category: 'Engine',
    importance: 'important',
    description: 'Inspect plug gap, carbon tracking on porcelain insulator, and ignition coil boot condition.',
    tips: 'Standard nickel plugs last 25,000 km. Laser Iridium (e.g. Denso SC20HR11) lasts up to 80,000 km.',
  },
  {
    id: 'sch-car-transmission',
    title: 'CVT / Automatic Transmission Fluid Flush',
    vehicleType: 'car',
    intervalKm: 40000,
    category: 'Fluids',
    importance: 'critical',
    description: 'Drain pan, replace transmission internal strainer / paper filter, refill with exact OEM specification.',
    tips: 'Crucial for Alto 660cc, Mira, Aqua, Vezel, and Corolla CVT. Wrong oil burns the steel CVT pushbelt.',
  },
  {
    id: 'sch-car-coolant',
    title: 'Radiator Long-Life Coolant Flush',
    vehicleType: 'car',
    intervalKm: 40000,
    category: 'Fluids',
    importance: 'critical',
    description: 'Drain tap water or old fluid. Flush block, bleed air bubbles, fill 50/50 ethylene glycol.',
    tips: 'Never use plain tap water in Pakistan! Tap water causes rust scaling, thermostat jamming, and radiator leakage.',
  },
];

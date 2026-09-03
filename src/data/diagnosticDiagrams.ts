import cvJointImg from '../assets/images/cv_joint_diagram_1788420712079.jpg';
import brakeSystemImg from '../assets/images/brake_system_diagram_1788420735195.jpg';
import coolingSystemImg from '../assets/images/cooling_system_diagram_1788420753943.jpg';
import suspensionBushImg from '../assets/images/suspension_bush_diagram_1788420771560.jpg';
import throttleEngineImg from '../assets/images/throttle_engine_diagram_1788420792197.jpg';

export interface DiagnosticDiagram {
  id: string;
  title: string;
  subtitle: string;
  category: 'Drivetrain' | 'Braking' | 'Cooling' | 'Suspension' | 'Intake & Fuel';
  image: string;
  keywords: string[];
  components: string[];
  inspectionTips: string[];
  typicalLocalCostPKR: string;
}

export const DIAGNOSTIC_DIAGRAMS: DiagnosticDiagram[] = [
  {
    id: 'cv-joint',
    title: 'CV Joint & Front Drive Axle Assembly',
    subtitle: 'Outer Constant Velocity joint, bearing cage & rubber grease boot',
    category: 'Drivetrain',
    image: cvJointImg,
    keywords: ['cv joint', 'axle', 'tuk-tuk', 'clicking', 'outer joint', 'drive shaft', 'boot'],
    components: [
      'Outer CV joint housing & ball bearings',
      'Flexible rubber grease boot & clamp',
      'Drive axle spline shaft',
      'Wheel hub bearing connection',
    ],
    inspectionTips: [
      'Look inside the front rim for sprayed dark black grease (indicates torn boot).',
      'If boot just tore recently, a new boot + fresh moly grease (Rs. 800–1,500) might save the joint.',
      'If metal-on-metal clicking has started, the entire outer joint must be replaced (Desi/Kabli or new GSP/Taiwanese).',
    ],
    typicalLocalCostPKR: 'Rs. 4,000 – Rs. 9,500 (Part + Ustaad Labor)',
  },
  {
    id: 'brake-system',
    title: 'Hydraulic Disc Brake & Caliper Assembly',
    subtitle: 'Vented brake rotor disc, floating caliper, ceramic pads & hydraulic hose',
    category: 'Braking',
    image: brakeSystemImg,
    keywords: ['brake', 'caliper', 'rotor', 'disc', 'pad', 'sinking pedal', 'spongy', 'squeal', 'grinding'],
    components: [
      'Ventilated cast iron brake rotor disc',
      'Hydraulic floating caliper & sliding pins',
      'Friction brake pads (inner & outer)',
      'Pressurized rubber brake fluid line',
    ],
    inspectionTips: [
      'Inspect rotor disc for deep circular grooves or heat discoloration (lip on edge means tooling/facing needed).',
      'Check if caliper slider pins are greased; seized pins cause uneven pad wear and car pulling to one side.',
      'Check master cylinder brake fluid reservoir level — dark/cloudy fluid requires a DOT 3/4 flush.',
    ],
    typicalLocalCostPKR: 'Rs. 3,500 – Rs. 14,000 (Pads, Facing & Fluid)',
  },
  {
    id: 'cooling-system',
    title: 'Engine Cooling System & Radiator Circuit',
    subtitle: 'Aluminum radiator core, thermo-fan, thermostat valve & coolant hoses',
    category: 'Cooling',
    image: coolingSystemImg,
    keywords: ['overheat', 'radiator', 'coolant', 'thermostat', 'temperature', 'water pump', 'fan motor', 'heating'],
    components: [
      'Aluminum cross-flow radiator core',
      'Electric radiator cooling fan & sensor',
      'Wax-pellet thermostat bypass valve (82°C/88°C)',
      'High-pressure upper & lower coolant hoses',
    ],
    inspectionTips: [
      'Check if local ustaad removed the thermostat valve (running direct ruins fuel average and engine life).',
      'Look for chalky green/pink crust around radiator tanks indicating hairline plastic seam leaks.',
      'Inspect radiator fan motor carbon brushes; sluggish fan spin causes immediate overheating in traffic.',
    ],
    typicalLocalCostPKR: 'Rs. 2,500 – Rs. 12,000 (Service, Thermostat & Fan)',
  },
  {
    id: 'suspension-system',
    title: 'Front Suspension Strut & Lower Control Arm',
    subtitle: 'MacPherson shock absorber, coil spring, lower arm bushes (chimtay) & ball joint',
    category: 'Suspension',
    image: suspensionBushImg,
    keywords: ['suspension', 'bush', 'chimtay', 'control arm', 'ball joint', 'strut', 'thud', 'jumping', 'pothole'],
    components: [
      'Hydraulic/gas charged MacPherson strut',
      'Heavy-duty helical coil spring',
      'Pressed lower control arm rubber bushes',
      'Steering knuckle ball joint',
    ],
    inspectionTips: [
      'Pakistani speed breakers and potholes tear rubber control arm bushes (leads to wandering alignment).',
      'Inspect shock absorber bodies for oily wetness, indicating blown hydraulic seals.',
      'Pounding/thud sound when dropping into potholes usually means torn strut mount / kangan or dead link rods.',
    ],
    typicalLocalCostPKR: 'Rs. 3,500 – Rs. 18,000 (Bush Pressing or Kabli Struts)',
  },
  {
    id: 'throttle-intake',
    title: 'Electronic Throttle Body & Fuel Injection System',
    subtitle: 'Motorized butterfly valve, intake manifold, spark plugs & fuel injectors',
    category: 'Intake & Fuel',
    image: throttleEngineImg,
    keywords: ['throttle', 'vibration', 'rpm dip', 'idling', 'misfire', 'spark plug', 'injector', 'fuel pump', 'hesitation'],
    components: [
      'Motorized electronic throttle valve & TPS',
      'Multi-port electronic fuel injectors',
      'Iridium / Nickel spark plugs',
      'Engine intake plenum & vacuum channels',
    ],
    inspectionTips: [
      'Black oily carbon deposits behind the throttle butterfly cause rough idle and stalling when turning AC on.',
      'Cleaning requires ultrasonic spray or throttle cleaner, followed by an electronic idle relearn procedure.',
      'Check spark plug electrode gap and look for fuel injector spray atomization on bench tester.',
    ],
    typicalLocalCostPKR: 'Rs. 1,500 – Rs. 7,000 (Cleaning, Tuning & Plugs)',
  },
];

export function findMatchingDiagram(text: string): DiagnosticDiagram | null {
  const lower = text.toLowerCase();
  for (const diag of DIAGNOSTIC_DIAGRAMS) {
    for (const kw of diag.keywords) {
      if (lower.includes(kw)) {
        return diag;
      }
    }
  }
  return null;
}

import { useState, useEffect } from 'react';
import {
  Car,
  Bike,
  Gauge,
  Droplet,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Wrench,
  Calendar,
  Trash2,
  Search,
  Filter,
  DollarSign,
  Plus,
  X,
  Edit3,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Check,
  FileText,
  Download,
} from 'lucide-react';
import {
  VehicleProfile,
  MaintenanceRecord,
  MaintenanceScheduleItem,
  DEFAULT_VEHICLES,
  DEFAULT_MAINTENANCE_RECORDS,
  STANDARD_SCHEDULES,
  PAKISTANI_VEHICLE_PRESETS,
  VehiclePreset,
} from '../data/maintenanceData';
import { ExportPdfModal } from './ExportPdfModal';

interface MaintenanceLogProps {
  onAskAiAboutService?: (query: string) => void;
}

const STORAGE_KEY_VEHICLES = 'car_bike_diag_vehicles_v1';
const STORAGE_KEY_RECORDS = 'car_bike_diag_records_v1';

export default function MaintenanceLog({ onAskAiAboutService }: MaintenanceLogProps) {
  // Load vehicles from localStorage or use defaults
  const [vehicles, setVehicles] = useState<VehicleProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VEHICLES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_VEHICLES;
  });

  const [activeVehicleId, setActiveVehicleId] = useState<string>(() => {
    return vehicles[0]?.id || 'veh-alto-01';
  });

  // Load records from localStorage or use defaults
  const [records, setRecords] = useState<MaintenanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECORDS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_MAINTENANCE_RECORDS;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VEHICLES, JSON.stringify(vehicles));
    } catch (e) {
      console.error('Failed to save vehicles to storage', e);
    }
  }, [vehicles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save records to storage', e);
    }
  }, [records]);

  // Current selected vehicle
  const activeVehicle = vehicles.find((v) => v.id === activeVehicleId) || vehicles[0] || null;

  // Filters for records
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modals & Forms
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isEditMileageOpen, setIsEditMileageOpen] = useState(false);
  const [isExportPdfOpen, setIsExportPdfOpen] = useState(false);
  const [tempMileage, setTempMileage] = useState<number>(activeVehicle?.currentMileageKm || 0);

  // Delete confirmations
  const [vehicleToDelete, setVehicleToDelete] = useState<VehicleProfile | null>(null);
  const [deleteAssociatedRecords, setDeleteAssociatedRecords] = useState(true);
  const [recordToDelete, setRecordToDelete] = useState<MaintenanceRecord | null>(null);

  // New Record form state
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newMileage, setNewMileage] = useState<number>(activeVehicle?.currentMileageKm || 0);
  const [newServiceType, setNewServiceType] = useState<MaintenanceRecord['serviceType']>('Oil & Filter');
  const [newDescription, setNewDescription] = useState('');
  const [newParts, setNewParts] = useState('');
  const [newCost, setNewCost] = useState<string>('');
  const [newWorkshop, setNewWorkshop] = useState('');
  const [newCity, setNewCity] = useState('Lahore');
  const [newNotes, setNewNotes] = useState('');

  // New Vehicle form state
  const [nvName, setNvName] = useState('Suzuki Alto 660cc');
  const [nvType, setNvType] = useState<'car' | 'bike'>('car');
  const [nvMakeModel, setNvMakeModel] = useState('Suzuki Alto 660cc R06A');
  const [nvYear, setNvYear] = useState<number>(2022);
  const [nvMileage, setNvMileage] = useState<number>(30000);
  const [nvOilInterval, setNvOilInterval] = useState<number>(5000);
  const [nvOilGrade, setNvOilGrade] = useState('0W-20 (Synthetic)');
  const [nvOilBrand, setNvOilBrand] = useState('Suzuki Genuine Oil (SGO)');
  const [nvRegNumber, setNvRegNumber] = useState('');
  const [nvFuelType, setNvFuelType] = useState<'Petrol' | 'Hybrid' | 'Diesel'>('Petrol');

  // Sync temp mileage when active vehicle changes
  useEffect(() => {
    if (activeVehicle) {
      setTempMileage(activeVehicle.currentMileageKm);
      setNewMileage(activeVehicle.currentMileageKm);
    }
  }, [activeVehicle?.id]);

  // Update Odometer
  const handleSaveMileage = () => {
    if (!activeVehicle) return;
    const updated = vehicles.map((v) =>
      v.id === activeVehicle.id ? { ...v, currentMileageKm: tempMileage } : v
    );
    setVehicles(updated);
    setIsEditMileageOpen(false);
  };

  // Add Record
  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVehicle) return;

    const parsedCost = parseInt(newCost.replace(/[^0-9]/g, ''), 10) || 0;
    const newRec: MaintenanceRecord = {
      id: 'rec-' + Date.now(),
      vehicleId: activeVehicle.id,
      vehicleName: activeVehicle.name,
      vehicleType: activeVehicle.type,
      date: newDate,
      mileageKm: newMileage,
      serviceType: newServiceType,
      description: newDescription || `${newServiceType} maintenance performed.`,
      partsReplaced: newParts,
      costPkr: parsedCost,
      workshopName: newWorkshop || 'Independent Workshop',
      city: newCity,
      notes: newNotes,
    };

    setRecords([newRec, ...records]);

    // If this was an oil change, update the vehicle's lastOilChangeKm
    if (newServiceType === 'Oil & Filter') {
      const updatedVehicles = vehicles.map((v) =>
        v.id === activeVehicle.id
          ? {
              ...v,
              lastOilChangeKm: newMileage,
              currentMileageKm: Math.max(v.currentMileageKm, newMileage),
            }
          : v
      );
      setVehicles(updatedVehicles);
    } else if (newMileage > activeVehicle.currentMileageKm) {
      // Auto bump current mileage if service happened at higher mileage
      const updatedVehicles = vehicles.map((v) =>
        v.id === activeVehicle.id ? { ...v, currentMileageKm: newMileage } : v
      );
      setVehicles(updatedVehicles);
    }

    // Reset form
    setIsAddRecordOpen(false);
    setNewDescription('');
    setNewParts('');
    setNewCost('');
    setNewNotes('');
  };

  // Quick action: Open Record Form for Oil Change
  const handleQuickLogOilChange = () => {
    if (!activeVehicle) return;
    setNewServiceType('Oil & Filter');
    setNewMileage(activeVehicle.currentMileageKm);
    setNewDescription(
      `${activeVehicle.oilGrade} engine oil replacement + genuine oil filter / strainer cleaning.`
    );
    setNewParts(`${activeVehicle.oilBrand} (${activeVehicle.oilGrade})`);
    setIsAddRecordOpen(true);
  };

  // Select Pakistani Preset
  const handleSelectPreset = (preset: VehiclePreset) => {
    setNvType(preset.type);
    setNvName(preset.name);
    setNvMakeModel(preset.makeModel);
    setNvOilInterval(preset.oilIntervalKm);
    setNvOilGrade(preset.oilGrade);
    setNvOilBrand(preset.oilBrand);
    setNvFuelType(preset.fuelType);
  };

  // Delete Record Confirmation
  const handleConfirmDeleteRecord = () => {
    if (!recordToDelete) return;
    setRecords(records.filter((r) => r.id !== recordToDelete.id));
    setRecordToDelete(null);
  };

  // Delete Vehicle Confirmation
  const handleConfirmDeleteVehicle = () => {
    if (!vehicleToDelete) return;
    const targetId = vehicleToDelete.id;
    const remaining = vehicles.filter((v) => v.id !== targetId);
    setVehicles(remaining);

    if (deleteAssociatedRecords) {
      setRecords(records.filter((r) => r.vehicleId !== targetId));
    }

    if (activeVehicleId === targetId) {
      setActiveVehicleId(remaining.length > 0 ? remaining[0].id : '');
    }

    setVehicleToDelete(null);
  };

  // Restore Default Pakistani Vehicles
  const handleRestoreDefaults = () => {
    setVehicles(DEFAULT_VEHICLES);
    setRecords(DEFAULT_MAINTENANCE_RECORDS);
    setActiveVehicleId(DEFAULT_VEHICLES[0].id);
  };

  // Create New Vehicle
  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nvName.trim()) return;

    const newVeh: VehicleProfile = {
      id: 'veh-' + Date.now(),
      name: nvName.trim(),
      type: nvType,
      makeModel: nvMakeModel.trim() || nvName.trim(),
      year: nvYear,
      currentMileageKm: nvMileage,
      oilIntervalKm: nvOilInterval,
      lastOilChangeKm: nvMileage,
      oilGrade: nvOilGrade,
      oilBrand: nvOilBrand,
      fuelType: nvFuelType,
      regNumber: nvRegNumber.trim() || undefined,
    };

    const updated = [...vehicles, newVeh];
    setVehicles(updated);
    setActiveVehicleId(newVeh.id);
    setIsAddVehicleOpen(false);

    // reset
    setNvName('Suzuki Alto 660cc');
    setNvMakeModel('Suzuki Alto 660cc R06A');
    setNvRegNumber('');
  };

  // Calculate Oil Interval Metrics
  const kmSinceLastOil = activeVehicle
    ? Math.max(0, activeVehicle.currentMileageKm - activeVehicle.lastOilChangeKm)
    : 0;
  const oilInterval = activeVehicle?.oilIntervalKm || 5000;
  const kmRemainingOil = oilInterval - kmSinceLastOil;
  const oilLifePercent = Math.max(0, Math.min(100, Math.round(((oilInterval - kmSinceLastOil) / oilInterval) * 100)));
  const isOilOverdue = kmRemainingOil < 0;
  const isOilDueSoon = kmRemainingOil >= 0 && kmRemainingOil <= (activeVehicle?.type === 'bike' ? 250 : 500);

  // Filtered records for current vehicle
  const vehicleRecords = records.filter((r) => r.vehicleId === activeVehicle?.id);
  const displayRecords = vehicleRecords.filter((rec) => {
    const matchesSearch =
      rec.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.workshopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rec.partsReplaced && rec.partsReplaced.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCat = categoryFilter === 'all' || rec.serviceType === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Calculate Total Spent
  const totalSpentPkr = vehicleRecords.reduce((sum, r) => sum + (r.costPkr || 0), 0);

  // Calculate Upcoming Checkups
  const relevantSchedules = STANDARD_SCHEDULES.filter(
    (item) => item.vehicleType === 'both' || item.vehicleType === activeVehicle?.type
  );

  const upcomingCheckups = relevantSchedules.map((item) => {
    const curKm = activeVehicle?.currentMileageKm || 0;
    // Find last recorded service of this type if any
    let lastDoneKm = 0;
    if (item.category === 'Fluids' && item.title.includes('Oil')) {
      lastDoneKm = activeVehicle?.lastOilChangeKm || 0;
    } else {
      const matchRec = vehicleRecords.find(
        (r) =>
          r.serviceType.toLowerCase().includes(item.category.toLowerCase()) ||
          r.description.toLowerCase().includes(item.title.toLowerCase())
      );
      if (matchRec) {
        lastDoneKm = matchRec.mileageKm;
      } else {
        // approximate using modulo
        lastDoneKm = Math.floor(curKm / item.intervalKm) * item.intervalKm;
      }
    }

    const nextDueKm = lastDoneKm + item.intervalKm;
    const kmUntilDue = nextDueKm - curKm;
    const isDueNow = kmUntilDue <= (activeVehicle?.type === 'bike' ? 150 : 300) && kmUntilDue >= 0;
    const isOverdue = kmUntilDue < 0;

    return {
      ...item,
      lastDoneKm,
      nextDueKm,
      kmUntilDue,
      isDueNow,
      isOverdue,
    };
  }).sort((a, b) => a.kmUntilDue - b.kmUntilDue);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Header Banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Chakra_Petch'] flex items-center gap-2">
              <Wrench className="w-6 h-6 text-amber-500" />
              VEHICLE MAINTENANCE LOG
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              PAKISTAN SPEC
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400">
            Track service history, oil change intervals, and mileage-based reminders for your cars and motorcycles.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsExportPdfOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-900 border border-neutral-700/80 hover:bg-neutral-800 text-neutral-200 hover:text-white transition-all cursor-pointer shadow-xs hover:border-amber-500/50"
            title="Export service history and reminders to PDF report"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Export to PDF</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddRecordOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log Service Record</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddVehicleOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-neutral-900 border border-neutral-700/80 hover:bg-neutral-800 text-neutral-200 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* Vehicle Profile Selector Bar or Empty State */}
      {vehicles.length === 0 ? (
        <div className="mb-6 p-8 text-center rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3 border border-amber-500/20">
            <Car className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white font-['Chakra_Petch'] mb-1">
            NO VEHICLES IN MAINTENANCE LOG
          </h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto mb-5">
            You currently have no registered cars or motorcycles. Add your vehicle to begin tracking oil intervals, schedule checkup reminders, and log workshop receipts.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setIsAddVehicleOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Car / Bike</span>
            </button>
            <button
              type="button"
              onClick={handleRestoreDefaults}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-950 border border-neutral-700 hover:bg-neutral-800 text-neutral-300 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Restore Pakistani Defaults (Alto & CG 125)</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono uppercase text-neutral-400 font-semibold tracking-wider">
                Select Vehicle:
              </span>
              {activeVehicle && (
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-amber-400 font-bold">{activeVehicle.makeModel}</span>
                  {activeVehicle.regNumber && (
                    <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-bold text-[10px] border border-neutral-700">
                      {activeVehicle.regNumber}
                    </span>
                  )}
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px]">
                    {activeVehicle.year} • {activeVehicle.fuelType || 'Petrol'}
                  </span>
                </div>
              )}
            </div>

            {/* Inline Odometer & Delete Active Vehicle Buttons */}
            {activeVehicle && (
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800">
                  <Gauge className="w-4 h-4 text-amber-500" />
                  <div className="text-xs">
                    <span className="text-neutral-400 mr-1">Odometer:</span>
                    <span className="font-mono font-bold text-white text-sm">
                      {activeVehicle.currentMileageKm.toLocaleString()} km
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTempMileage(activeVehicle.currentMileageKm);
                      setIsEditMileageOpen(true);
                    }}
                    className="ml-1 text-neutral-400 hover:text-amber-400 p-1 transition-colors cursor-pointer"
                    title="Update current odometer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setVehicleToDelete(activeVehicle)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all cursor-pointer shadow-xs"
                  title={`Delete ${activeVehicle.name} from maintenance log`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete {activeVehicle.type === 'car' ? 'Car' : 'Bike'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Vehicle Switcher Tabs + Inline Add Vehicle Button */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {vehicles.map((veh) => {
              const isSelected = veh.id === activeVehicle?.id;
              return (
                <div
                  key={veh.id}
                  onClick={() => setActiveVehicleId(veh.id)}
                  className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex-shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/15 border border-amber-500/50 text-amber-300 font-bold shadow-xs'
                      : 'bg-neutral-950/70 border border-neutral-800/80 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850'
                  }`}
                >
                  {veh.type === 'car' ? (
                    <Car className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-neutral-400'}`} />
                  ) : (
                    <Bike className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-neutral-400'}`} />
                  )}
                  <span>{veh.name}</span>
                  {veh.regNumber && (
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-neutral-800 text-neutral-300">
                      {veh.regNumber}
                    </span>
                  )}
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800/60 text-neutral-400">
                    {veh.currentMileageKm.toLocaleString()} km
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVehicleToDelete(veh);
                    }}
                    className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-red-500/20 transition-all opacity-60 group-hover:opacity-100 ml-0.5 cursor-pointer"
                    title={`Delete ${veh.name}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => setIsAddVehicleOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-950 border border-dashed border-amber-500/40 text-amber-400 hover:border-amber-400 hover:text-amber-300 hover:bg-amber-500/5 transition-all flex-shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Vehicle</span>
            </button>
          </div>
        </div>
      )}

      {activeVehicle && (
        <>
          {/* Top Overview Cards: Oil Interval Gauge & Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* CARD 1: Oil Change Status & Interval Meter */}
            <div className="p-4.5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-sm flex flex-col justify-between md:col-span-2">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${isOilOverdue ? 'bg-red-500/15 text-red-400' : isOilDueSoon ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
                      <Droplet className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white font-['Chakra_Petch']">
                        ENGINE OIL CHANGE INTERVAL
                      </h3>
                      <p className="text-[11px] text-neutral-400">
                        {activeVehicle.oilBrand} • <span className="font-mono text-amber-400">{activeVehicle.oilGrade}</span>
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isOilOverdue ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse font-mono">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        OVERDUE BY {Math.abs(kmRemainingOil).toLocaleString()} KM
                      </span>
                    ) : isOilDueSoon ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        DUE IN {kmRemainingOil.toLocaleString()} KM
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        GOOD ({kmRemainingOil.toLocaleString()} KM LEFT)
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="my-3">
                  <div className="flex justify-between text-xs text-neutral-400 font-mono mb-1.5">
                    <span>Last Change: {activeVehicle.lastOilChangeKm.toLocaleString()} km</span>
                    <span className="font-bold text-white">{kmSinceLastOil.toLocaleString()} / {oilInterval.toLocaleString()} km driven</span>
                    <span>Next: {(activeVehicle.lastOilChangeKm + oilInterval).toLocaleString()} km</span>
                  </div>

                  <div className="w-full h-3 rounded-full bg-neutral-950 overflow-hidden border border-neutral-800 p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOilOverdue
                          ? 'bg-red-500'
                          : isOilDueSoon
                          ? 'bg-amber-500'
                          : 'bg-gradient-to-r from-emerald-500 to-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.round((kmSinceLastOil / oilInterval) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                <span className="text-neutral-400 text-[11px]">
                  Interval: <strong className="text-neutral-200 font-mono">Every {oilInterval.toLocaleString()} km</strong>
                </span>
                <button
                  type="button"
                  onClick={handleQuickLogOilChange}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-800 hover:bg-neutral-750 text-amber-300 border border-amber-500/30 hover:border-amber-500/60 transition-all cursor-pointer"
                >
                  <Droplet className="w-3.5 h-3.5 text-amber-400" />
                  <span>Log Fresh Oil Change</span>
                </button>
              </div>
            </div>

            {/* CARD 2: Vehicle Quick Stats */}
            <div className="p-4.5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-['Chakra_Petch'] mb-3 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  SERVICE INVESTMENT & STATS
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                    <span className="text-xs text-neutral-400">Total Recorded Cost</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">
                      Rs. {totalSpentPkr.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                    <span className="text-xs text-neutral-400">Maintenance Entries</span>
                    <span className="text-xs font-bold text-white font-mono">
                      {vehicleRecords.length} records
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400">Vehicle Model</span>
                    <span className="text-xs font-semibold text-neutral-200">
                      {activeVehicle.makeModel}
                    </span>
                  </div>
                </div>
              </div>

              {onAskAiAboutService && (
                <button
                  type="button"
                  onClick={() =>
                    onAskAiAboutService(
                      `What is the recommended periodic maintenance checklist and typical labor cost in Pakistan for my ${activeVehicle.name} (${activeVehicle.makeModel}) at ${activeVehicle.currentMileageKm} km?`
                    )
                  }
                  className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 hover:border-amber-500/40 hover:text-amber-300 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ask AI for Maintenance Advice</span>
                </button>
              )}
            </div>
          </div>

          {/* UPCOMING CHECKUP REMINDERS SECTION */}
          <div className="mb-8">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div>
                <h2 className="text-base font-bold text-white font-['Chakra_Petch'] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  UPCOMING MILEAGE-BASED CHECKUPS
                </h2>
                <p className="text-xs text-neutral-400">
                  Calculated automatically from your current odometer reading ({activeVehicle.currentMileageKm.toLocaleString()} km).
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsExportPdfOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all cursor-pointer"
                title="Include checkups in PDF report"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Export PDF Schedule</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {upcomingCheckups.slice(0, 6).map((item) => {
                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                      item.isOverdue
                        ? 'bg-red-500/10 border-red-500/40'
                        : item.isDueNow
                        ? 'bg-amber-500/10 border-amber-500/40'
                        : 'bg-neutral-900 border-neutral-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-950 text-neutral-300 border border-neutral-800">
                          {item.category}
                        </span>

                        {item.isOverdue ? (
                          <span className="text-[11px] font-bold text-red-400 font-mono flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Overdue {Math.abs(item.kmUntilDue).toLocaleString()} km
                          </span>
                        ) : item.isDueNow ? (
                          <span className="text-[11px] font-bold text-amber-400 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Due in {item.kmUntilDue.toLocaleString()} km
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono text-neutral-400">
                            Due in {item.kmUntilDue.toLocaleString()} km
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-[11px] text-neutral-400 line-clamp-2 mb-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-neutral-400 font-mono text-[10px]">
                        Due at: <strong className="text-neutral-200">{item.nextDueKm.toLocaleString()} km</strong>
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          setNewServiceType(
                            item.title.includes('Oil')
                              ? 'Oil & Filter'
                              : item.category === 'Brakes'
                              ? 'Brakes'
                              : item.title.includes('Plug') || item.title.includes('Tuning')
                              ? 'Tuning & Plugs'
                              : 'General Periodic Service'
                          );
                          setNewDescription(`${item.title}: ${item.tips}`);
                          setNewMileage(activeVehicle.currentMileageKm);
                          setIsAddRecordOpen(true);
                        }}
                        className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-0.5 text-xs cursor-pointer"
                      >
                        <span>Mark Done</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SERVICE HISTORY LOG */}
          <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 overflow-hidden shadow-sm">
            {/* Filter and Search Bar */}
            <div className="p-4 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white font-['Chakra_Petch']">
                  SERVICE HISTORY LOG
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-mono text-xs font-bold">
                  {displayRecords.length}
                </span>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search logs, parts, ustaad..."
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500 w-44 sm:w-56"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="all">All Service Types</option>
                  <option value="Oil & Filter">Oil & Filter</option>
                  <option value="Brakes">Brakes</option>
                  <option value="Tuning & Plugs">Tuning & Plugs</option>
                  <option value="Suspension & Tyres">Suspension & Tyres</option>
                  <option value="General Periodic Service">General Periodic</option>
                </select>

                {/* Export PDF quick button */}
                <button
                  type="button"
                  onClick={() => setIsExportPdfOpen(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 hover:bg-neutral-800 text-xs text-neutral-300 hover:text-white transition-all cursor-pointer"
                  title="Export records to PDF report"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Export PDF</span>
                </button>
              </div>
            </div>

            {/* Records List */}
            {displayRecords.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <Wrench className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-neutral-300">No service records found</p>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                  Log your vehicle's oil changes, brake services, or tuning history to keep your car or bike running smoothly.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddRecordOpen(true)}
                  className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500 text-neutral-950 hover:bg-amber-400"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Record</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-neutral-800/80">
                {displayRecords.map((record) => (
                  <div key={record.id} className="p-4 hover:bg-neutral-850/40 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {record.serviceType}
                        </span>
                        <span className="text-xs font-mono font-bold text-white">
                          {record.mileageKm.toLocaleString()} km
                        </span>
                        <span className="text-xs text-neutral-400 font-mono">
                          • {record.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        {record.costPkr > 0 && (
                          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            Rs. {record.costPkr.toLocaleString()}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => setRecordToDelete(record)}
                          className="text-neutral-500 hover:text-red-400 p-1 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-200 font-medium mb-1.5">
                      {record.description}
                    </p>

                    {record.partsReplaced && (
                      <p className="text-[11px] text-neutral-400 mb-1">
                        <strong className="text-neutral-300">Parts:</strong> {record.partsReplaced}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
                      <span>
                        Workshop: <strong className="text-neutral-400">{record.workshopName}</strong> ({record.city})
                      </span>
                      {record.notes && (
                        <span className="italic text-neutral-400 truncate max-w-xs">
                          "{record.notes}"
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* MODAL: ADD SERVICE RECORD */}
      {isAddRecordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-['Chakra_Petch'] flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-500" />
                LOG MAINTENANCE SERVICE ({activeVehicle?.name})
              </h3>
              <button
                type="button"
                onClick={() => setIsAddRecordOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="p-5 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Service Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Odometer at Service (km)
                  </label>
                  <input
                    type="number"
                    required
                    value={newMileage}
                    onChange={(e) => setNewMileage(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Service Category
                  </label>
                  <select
                    value={newServiceType}
                    onChange={(e) => setNewServiceType(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Oil & Filter">Oil & Filter</option>
                    <option value="Brakes">Brakes</option>
                    <option value="Tuning & Plugs">Tuning & Plugs</option>
                    <option value="Suspension & Tyres">Suspension & Tyres</option>
                    <option value="Cooling System">Cooling System</option>
                    <option value="Transmission">Transmission</option>
                    <option value="Electrical & Battery">Electrical & Battery</option>
                    <option value="General Periodic Service">General Periodic Service</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Total Cost (PKR)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4500"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  Service Description / Work Performed
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engine oil replaced + OEM filter + air filter blown clean"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  Parts Replaced / Lubricants Used
                </label>
                <input
                  type="text"
                  placeholder="e.g. ZIC X7 5W-30 3 Liters, Leppon Oil Filter"
                  value={newParts}
                  onChange={(e) => setNewParts(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Workshop / Ustaad Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ustaad Aslam Autos"
                    value={newWorkshop}
                    onChange={(e) => setNewWorkshop(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    City / Market
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lahore (Bilal Ganj)"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  Mechanic Notes / Recommendations (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Brake pads good for another 5,000 km, battery water topped up"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddRecordOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-neutral-950 hover:bg-amber-400"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ODOMETER MILEAGE */}
      {isEditMileageOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl p-5 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-sm font-bold text-white font-['Chakra_Petch'] mb-2 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-amber-500" />
              UPDATE CURRENT ODOMETER
            </h3>
            <p className="text-xs text-neutral-400 mb-4">
              Enter current mileage for <strong className="text-white">{activeVehicle?.name}</strong>. Upcoming checkups will recalculate instantly.
            </p>

            <div className="mb-4">
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                Current Odometer (Kilometers)
              </label>
              <input
                type="number"
                value={tempMileage}
                onChange={(e) => setTempMileage(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm font-mono text-white focus:outline-none focus:border-amber-500 font-bold"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditMileageOpen(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveMileage}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-neutral-950 hover:bg-amber-400"
              >
                Update Mileage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD VEHICLE PROFILE */}
      {isAddVehicleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-['Chakra_Petch'] flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-500" />
                ADD NEW CAR OR BIKE PROFILE
              </h3>
              <button
                type="button"
                onClick={() => setIsAddVehicleOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVehicle} className="p-5 space-y-3.5">
              {/* Type Switcher */}
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  Vehicle Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNvType('car');
                      setNvOilInterval(5000);
                      setNvOilGrade('0W-20 (Synthetic)');
                      setNvOilBrand('Suzuki Genuine Oil (SGO)');
                      setNvName('Suzuki Alto 660cc');
                      setNvMakeModel('Suzuki Alto 660cc R06A');
                    }}
                    className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      nvType === 'car'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-neutral-950 text-neutral-400 border border-neutral-800'
                    }`}
                  >
                    <Car className="w-4 h-4" />
                    <span>Car (Sedan/Hatch/SUV)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNvType('bike');
                      setNvOilInterval(1200);
                      setNvOilGrade('20W-50');
                      setNvOilBrand('Atlas Honda 4T Genuine');
                      setNvName('Honda CD 70');
                      setNvMakeModel('Atlas Honda CD 70');
                    }}
                    className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      nvType === 'bike'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-neutral-950 text-neutral-400 border border-neutral-800'
                    }`}
                  >
                    <Bike className="w-4 h-4" />
                    <span>Motorcycle / Bike</span>
                  </button>
                </div>
              </div>

              {/* Pakistani Quick Presets */}
              <div className="bg-neutral-950/80 p-3 rounded-xl border border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-amber-400 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Popular Pakistani Presets (Click to Auto-fill):
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PAKISTANI_VEHICLE_PRESETS.filter((p) => p.type === nvType).map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-neutral-900 border border-neutral-700 hover:border-amber-500 hover:text-amber-300 text-neutral-300 transition-all cursor-pointer"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  Vehicle Display Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My Alto VXR / Honda CD 70 / Civic X"
                  value={nvName}
                  onChange={(e) => setNvName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Make & Model
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Suzuki Alto 660cc"
                    value={nvMakeModel}
                    onChange={(e) => setNvMakeModel(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Registration Plate (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. LEA-22-4819 / KHI-901"
                    value={nvRegNumber}
                    onChange={(e) => setNvRegNumber(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Model Year
                  </label>
                  <input
                    type="number"
                    value={nvYear}
                    onChange={(e) => setNvYear(parseInt(e.target.value, 10) || 2022)}
                    className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Fuel Type
                  </label>
                  <select
                    value={nvFuelType}
                    onChange={(e) => setNvFuelType(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Current Odometer (km)
                  </label>
                  <input
                    type="number"
                    required
                    value={nvMileage}
                    onChange={(e) => setNvMileage(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Oil Interval (km)
                  </label>
                  <input
                    type="number"
                    required
                    value={nvOilInterval}
                    onChange={(e) => setNvOilInterval(parseInt(e.target.value, 10) || 5000)}
                    className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Oil Grade / Viscosity
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 0W-20 / 20W-50"
                    value={nvOilGrade}
                    onChange={(e) => setNvOilGrade(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Preferred Oil Brand
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Havoline / SGO / ZIC"
                    value={nvOilBrand}
                    onChange={(e) => setNvOilBrand(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddVehicleOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs text-neutral-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-neutral-950 hover:bg-amber-400 cursor-pointer shadow-sm"
                >
                  Create Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Vehicle Confirmation Modal */}
      {vehicleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-400 font-['Chakra_Petch'] font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span>DELETE VEHICLE PROFILE</span>
              </div>
              <button
                type="button"
                onClick={() => setVehicleToDelete(null)}
                className="text-neutral-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-neutral-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                    {vehicleToDelete.type === 'car' ? <Car className="w-5 h-5" /> : <Bike className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{vehicleToDelete.name}</h4>
                    <p className="text-xs text-neutral-400 font-mono">
                      {vehicleToDelete.makeModel} • {vehicleToDelete.year}
                      {vehicleToDelete.regNumber ? ` • ${vehicleToDelete.regNumber}` : ''}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-neutral-300">
                  Current Odometer: <strong className="font-mono text-white">{vehicleToDelete.currentMileageKm.toLocaleString()} km</strong>
                </p>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">
                Are you sure you want to delete this vehicle from your maintenance log? This action cannot be undone.
              </p>

              {records.filter((r) => r.vehicleId === vehicleToDelete.id).length > 0 && (
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deleteAssociatedRecords}
                    onChange={(e) => setDeleteAssociatedRecords(e.target.checked)}
                    className="mt-0.5 rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-medium text-neutral-200 block">
                      Also delete all {records.filter((r) => r.vehicleId === vehicleToDelete.id).length} service history records
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      Uncheck if you want to keep service history records in storage.
                    </span>
                  </div>
                </label>
              )}

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setVehicleToDelete(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteVehicle}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition-all cursor-pointer shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Confirm Delete Vehicle</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Record Confirmation Modal */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-400 font-['Chakra_Petch'] font-bold text-sm">
                <Trash2 className="w-4 h-4 text-red-500" />
                <span>DELETE SERVICE RECORD</span>
              </div>
              <button
                type="button"
                onClick={() => setRecordToDelete(null)}
                className="text-neutral-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-amber-400">{recordToDelete.serviceType}</span>
                  <span className="font-mono text-neutral-400">{recordToDelete.date}</span>
                </div>
                <p className="text-neutral-300 mb-1">{recordToDelete.description}</p>
                <div className="flex items-center justify-between text-neutral-400 font-mono text-[11px]">
                  <span>{recordToDelete.mileageKm.toLocaleString()} km</span>
                  {recordToDelete.costPkr > 0 && (
                    <span className="text-emerald-400 font-bold">Rs. {recordToDelete.costPkr.toLocaleString()}</span>
                  )}
                </div>
              </div>

              <p className="text-xs text-neutral-300">
                Are you sure you want to permanently delete this service record?
              </p>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setRecordToDelete(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteRecord}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition-all cursor-pointer shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Record</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export to PDF Modal */}
      <ExportPdfModal
        isOpen={isExportPdfOpen}
        onClose={() => setIsExportPdfOpen(false)}
        vehicles={vehicles}
        activeVehicle={activeVehicle}
        records={records}
      />
    </div>
  );
}

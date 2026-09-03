import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  X,
  CheckSquare,
  Square,
  Car,
  Bike,
  ShieldCheck,
  Calendar,
  DollarSign,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';
import { MaintenanceRecord, VehicleProfile } from '../data/maintenanceData';
import { generateMaintenancePdf } from '../utils/maintenancePdfExport';
import AppLogo from './AppLogo';

interface ExportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: VehicleProfile[];
  activeVehicle: VehicleProfile | null;
  records: MaintenanceRecord[];
}

export function ExportPdfModal({
  isOpen,
  onClose,
  vehicles,
  activeVehicle,
  records,
}: ExportPdfModalProps) {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(activeVehicle?.id || (vehicles[0]?.id ?? 'all'));
  const [includeOilStatus, setIncludeOilStatus] = useState(true);
  const [includeUpcomingCheckups, setIncludeUpcomingCheckups] = useState(true);
  const [includeServiceHistory, setIncludeServiceHistory] = useState(true);
  const [includeCostSummary, setIncludeCostSummary] = useState(true);
  const [ownerName, setOwnerName] = useState('');
  const [notes, setNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const isAll = selectedVehicleId === 'all';
  const currentTargetVehicle = vehicles.find((v) => v.id === selectedVehicleId) || activeVehicle || vehicles[0];

  // Calculate stats for preview
  const relevantRecords = isAll
    ? records
    : records.filter((r) => r.vehicleId === selectedVehicleId);
  const totalCost = relevantRecords.reduce((sum, r) => sum + (r.costPkr || 0), 0);

  const handleDownloadPdf = () => {
    setIsGenerating(true);
    setDownloadSuccess(false);

    try {
      const { doc, filename } = generateMaintenancePdf({
        vehicle: isAll ? 'all' : currentTargetVehicle,
        allVehicles: vehicles,
        records,
        includeOilStatus,
        includeUpcomingCheckups,
        includeServiceHistory,
        includeCostSummary,
        ownerName: ownerName.trim(),
        notes: notes.trim(),
      });

      doc.save(filename);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Error generating PDF:', err);
      window.alert('Failed to generate PDF report. Please check the console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrintOrPreview = () => {
    setIsGenerating(true);
    try {
      const { doc } = generateMaintenancePdf({
        vehicle: isAll ? 'all' : currentTargetVehicle,
        allVehicles: vehicles,
        records,
        includeOilStatus,
        includeUpcomingCheckups,
        includeServiceHistory,
        includeCostSummary,
        ownerName: ownerName.trim(),
        notes: notes.trim(),
      });

      // Output as blob URL and open in new tab for print/preview
      const blobUrl = doc.output('bloburl');
      const win = window.open(blobUrl, '_blank');
      if (!win) {
        // If popup blocked, fallback to auto-print iframe or direct download
        doc.save();
      }
    } catch (err) {
      console.error('Error previewing PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/90">
          <div className="flex items-center gap-3">
            <AppLogo size="sm" showText={false} />
            <div>
              <h3 className="text-base font-bold text-white font-['Chakra_Petch'] tracking-wide flex items-center gap-2">
                EXPORT MAINTENANCE REPORT TO PDF
              </h3>
              <p className="text-xs text-neutral-400">
                Generate formatted PDF report for vehicle history, inspection, or resale
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto text-neutral-200">
          {/* Target Vehicle Selection */}
          <div>
            <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2 font-semibold">
              Select Report Scope:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedVehicleId(activeVehicle?.id || vehicles[0]?.id || '')}
                className={`flex items-center gap-3 p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  !isAll
                    ? 'bg-amber-500/10 border-amber-500/50 text-amber-300'
                    : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850'
                }`}
              >
                <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-amber-400">
                  {currentTargetVehicle?.type === 'bike' ? (
                    <Bike className="w-4 h-4" />
                  ) : (
                    <Car className="w-4 h-4" />
                  )}
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold block text-white truncate">
                    {currentTargetVehicle ? currentTargetVehicle.name : 'Single Vehicle'}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400 block truncate">
                    {currentTargetVehicle?.makeModel}
                    {currentTargetVehicle?.regNumber ? ` • ${currentTargetVehicle.regNumber}` : ''}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedVehicleId('all')}
                className={`flex items-center gap-3 p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  isAll
                    ? 'bg-amber-500/10 border-amber-500/50 text-amber-300'
                    : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850'
                }`}
              >
                <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-amber-400">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-white">All Vehicles ({vehicles.length})</span>
                  <span className="text-[11px] font-mono text-neutral-400 block">
                    Combined Fleet Master Report
                  </span>
                </div>
              </button>
            </div>

            {/* If Single Vehicle selected, show vehicle picker dropdown if multiple exist */}
            {!isAll && vehicles.length > 1 && (
              <div className="mt-2.5">
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.makeModel} - {v.regNumber || `${v.year}`})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Quick Summary Pill Bar */}
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-400">Target:</span>
              <strong className="text-white font-mono">
                {isAll ? `${vehicles.length} Vehicles (Fleet)` : currentTargetVehicle?.name}
              </strong>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-400">Services:</span>
              <strong className="text-amber-400 font-mono">{relevantRecords.length} Records</strong>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-400">Expenditure:</span>
              <strong className="text-emerald-400 font-mono">PKR {totalCost.toLocaleString()}</strong>
            </div>
          </div>

          {/* Section Inclusion Checkboxes */}
          <div>
            <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2 font-semibold">
              Sections to Include in PDF:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div
                onClick={() => setIncludeOilStatus(!includeOilStatus)}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 hover:border-neutral-700 cursor-pointer transition-colors"
              >
                {includeOilStatus ? (
                  <CheckSquare className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-neutral-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="text-xs">
                  <span className="font-semibold text-neutral-200 block">Engine Oil Health Status</span>
                  <span className="text-[11px] text-neutral-400">
                    Viscosity, brand, interval km, and oil life %
                  </span>
                </div>
              </div>

              <div
                onClick={() => setIncludeUpcomingCheckups(!includeUpcomingCheckups)}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 hover:border-neutral-700 cursor-pointer transition-colors"
              >
                {includeUpcomingCheckups ? (
                  <CheckSquare className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-neutral-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="text-xs">
                  <span className="font-semibold text-neutral-200 block">Upcoming Checkups</span>
                  <span className="text-[11px] text-neutral-400">
                    Mileage schedule with Overdue & Due alerts
                  </span>
                </div>
              </div>

              <div
                onClick={() => setIncludeServiceHistory(!includeServiceHistory)}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 hover:border-neutral-700 cursor-pointer transition-colors"
              >
                {includeServiceHistory ? (
                  <CheckSquare className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-neutral-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="text-xs">
                  <span className="font-semibold text-neutral-200 block">Service History Table</span>
                  <span className="text-[11px] text-neutral-400">
                    Workshop receipts, dates, odometers & costs
                  </span>
                </div>
              </div>

              <div
                onClick={() => setIncludeCostSummary(!includeCostSummary)}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 hover:border-neutral-700 cursor-pointer transition-colors"
              >
                {includeCostSummary ? (
                  <CheckSquare className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-neutral-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="text-xs">
                  <span className="font-semibold text-neutral-200 block">Expenditure Breakdown</span>
                  <span className="text-[11px] text-neutral-400">
                    Category distribution (Fluids, Suspension, etc.)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Optional Metadata (Owner Name / Custom Note) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                Owner / Custodian Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Muhammad Shahid"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                Report Memo / Purpose (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Prepared for pre-purchase inspection"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Success Feedback Alert */}
          {downloadSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>PDF report generated and downloaded successfully!</span>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/60 flex items-center justify-between flex-wrap gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintOrPreview}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-neutral-200 transition-all cursor-pointer disabled:opacity-50"
              title="Open print-ready PDF in new browser window"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Preview / Print</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Generating PDF...' : 'Download PDF Report'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MaintenanceRecord, VehicleProfile, STANDARD_SCHEDULES } from '../data/maintenanceData';

export interface PdfExportOptions {
  vehicle: VehicleProfile | 'all';
  allVehicles?: VehicleProfile[];
  records: MaintenanceRecord[];
  includeOilStatus?: boolean;
  includeUpcomingCheckups?: boolean;
  includeServiceHistory?: boolean;
  includeCostSummary?: boolean;
  ownerName?: string;
  notes?: string;
}

export function generateMaintenancePdf(options: PdfExportOptions): { doc: jsPDF; filename: string } {
  const {
    vehicle,
    allVehicles = [],
    records,
    includeOilStatus = true,
    includeUpcomingCheckups = true,
    includeServiceHistory = true,
    includeCostSummary = true,
    ownerName = '',
    notes = '',
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let currentY = margin;

  const isAllVehicles = vehicle === 'all';
  const targetVehicles: VehicleProfile[] = isAllVehicles
    ? allVehicles
    : [vehicle];

  const reportDate = new Date().toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Calculate overall summary stats
  const totalVehiclesCount = targetVehicles.length;
  const targetVehicleIds = new Set(targetVehicles.map((v) => v.id));
  const relevantRecords = records.filter((r) => targetVehicleIds.has(r.vehicleId));
  const totalSpentAll = relevantRecords.reduce((sum, r) => sum + (r.costPkr || 0), 0);

  // Colors
  const primaryColor = [20, 24, 33]; // Dark charcoal
  const accentAmber = [217, 119, 6]; // Warm amber/orange
  const neutralGray = [100, 116, 139]; // Slate text
  const tableHeaderBg = [30, 41, 59]; // Slate 800

  // Helper for adding new page if needed
  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - margin - 15) {
      doc.addPage();
      currentY = margin;
      return true;
    }
    return false;
  };

  // --- 1. COVER / HEADER BANNER ---
  // Top accent bar
  doc.setFillColor(accentAmber[0], accentAmber[1], accentAmber[2]);
  doc.rect(margin, currentY, pageWidth - margin * 2, 3, 'F');
  currentY += 7;

  // Title & Brand
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('VEHICLE MAINTENANCE & SERVICE REPORT', margin, currentY);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(accentAmber[0], accentAmber[1], accentAmber[2]);
  const tagText = 'PAKISTAN AUTOMOTIVE LOG';
  doc.text(tagText, pageWidth - margin - doc.getTextWidth(tagText), currentY);

  currentY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(neutralGray[0], neutralGray[1], neutralGray[2]);
  doc.text('Certified service history, oil change intervals, and scheduled maintenance records', margin, currentY);

  const dateStr = `Report Date: ${reportDate}`;
  doc.text(dateStr, pageWidth - margin - doc.getTextWidth(dateStr), currentY);

  currentY += 4;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 6;

  // Summary Stat Pills
  const statBoxWidth = (pageWidth - margin * 2 - 6) / 3;
  const statBoxHeight = 14;

  // Box 1: Vehicles
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, statBoxWidth, statBoxHeight, 2, 2, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(neutralGray[0], neutralGray[1], neutralGray[2]);
  doc.text('COVERED VEHICLES', margin + 4, currentY + 4.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(isAllVehicles ? `${totalVehiclesCount} Fleet Vehicles` : targetVehicles[0].name, margin + 4, currentY + 10);

  // Box 2: Total Recorded Services
  const box2X = margin + statBoxWidth + 3;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(box2X, currentY, statBoxWidth, statBoxHeight, 2, 2, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(neutralGray[0], neutralGray[1], neutralGray[2]);
  doc.text('RECORDED SERVICES', box2X + 4, currentY + 4.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`${relevantRecords.length} Service Logs`, box2X + 4, currentY + 10);

  // Box 3: Total Logged Investment (PKR)
  const box3X = box2X + statBoxWidth + 3;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(box3X, currentY, statBoxWidth, statBoxHeight, 2, 2, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(neutralGray[0], neutralGray[1], neutralGray[2]);
  doc.text('TOTAL EXPENDITURE', box3X + 4, currentY + 4.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(accentAmber[0], accentAmber[1], accentAmber[2]);
  doc.text(`PKR ${totalSpentAll.toLocaleString()}`, box3X + 4, currentY + 10);

  currentY += statBoxHeight + 8;

  // If user provided owner name or custom notes, display it
  if (ownerName || notes) {
    doc.setFillColor(254, 243, 199); // Amber-50
    doc.setDrawColor(245, 158, 11);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, ownerName && notes ? 14 : 10, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(180, 83, 9);

    let infoText = '';
    if (ownerName) infoText += `Owner / Custodian: ${ownerName}   `;
    if (notes) infoText += `Notes: ${notes}`;
    doc.text(infoText, margin + 4, currentY + 6);
    currentY += ownerName && notes ? 18 : 14;
  }

  // --- LOOP THROUGH VEHICLES ---
  targetVehicles.forEach((veh, vehIndex) => {
    // If not first vehicle, add visual separator or page break
    if (vehIndex > 0) {
      checkPageBreak(50);
      doc.setDrawColor(203, 213, 225);
      doc.setLineDashPattern([2, 2], 0);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      doc.setLineDashPattern([], 0);
      currentY += 8;
    }

    // Vehicle Title Banner
    checkPageBreak(25);
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 18, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    const vehicleHeading = `${veh.type === 'car' ? '🚗' : '🏍️'} ${veh.name} (${veh.year}) - ${veh.makeModel}`;
    doc.text(vehicleHeading, margin + 4, currentY + 6.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(neutralGray[0], neutralGray[1], neutralGray[2]);
    const specsLine = `Plate: ${veh.regNumber || 'Not Specified'}   |   Odometer: ${veh.currentMileageKm.toLocaleString()} km   |   Fuel: ${veh.fuelType || 'Petrol'}   |   Type: ${veh.type.toUpperCase()}`;
    doc.text(specsLine, margin + 4, currentY + 13);

    currentY += 23;

    // Oil Interval Calculations
    const kmSinceLastOil = Math.max(0, veh.currentMileageKm - veh.lastOilChangeKm);
    const oilInterval = veh.oilIntervalKm || 5000;
    const kmRemainingOil = oilInterval - kmSinceLastOil;
    const oilLifePercent = Math.max(0, Math.min(100, Math.round(((oilInterval - kmSinceLastOil) / oilInterval) * 100)));
    const isOilOverdue = kmRemainingOil < 0;
    const isOilDueSoon = kmRemainingOil >= 0 && kmRemainingOil <= (veh.type === 'bike' ? 250 : 500);

    const oilStatusLabel = isOilOverdue
      ? `OVERDUE by ${Math.abs(kmRemainingOil).toLocaleString()} km`
      : isOilDueSoon
      ? `DUE SOON (${kmRemainingOil.toLocaleString()} km left)`
      : `GOOD (${kmRemainingOil.toLocaleString()} km remaining - ${oilLifePercent}% Life)`;

    // 2. OIL CHANGE HEALTH CARD
    if (includeOilStatus) {
      checkPageBreak(24);
      doc.setFillColor(isOilOverdue ? 254 : isOilDueSoon ? 254 : 240, isOilOverdue ? 242 : isOilDueSoon ? 249 : 253, isOilOverdue ? 242 : isOilDueSoon ? 235 : 244);
      doc.setDrawColor(isOilOverdue ? 239 : isOilDueSoon ? 245 : 34, isOilOverdue ? 68 : isOilDueSoon ? 158 : 197, isOilOverdue ? 68 : isOilDueSoon ? 11 : 94);
      doc.roundedRect(margin, currentY, pageWidth - margin * 2, 20, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(isOilOverdue ? 185 : isOilDueSoon ? 180 : 21, isOilOverdue ? 28 : isOilDueSoon ? 83 : 128, isOilOverdue ? 28 : isOilDueSoon ? 9 : 61);
      doc.text(`ENGINE OIL STATUS: ${oilStatusLabel}`, margin + 4, currentY + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      const oilDetail = `Spec: ${veh.oilGrade}   |   Brand: ${veh.oilBrand}   |   Interval: Every ${oilInterval.toLocaleString()} km   |   Last Changed: ${veh.lastOilChangeKm.toLocaleString()} km (${kmSinceLastOil.toLocaleString()} km ago)`;
      doc.text(oilDetail, margin + 4, currentY + 12);

      const adviceText = isOilOverdue
        ? 'Action Required: Drain engine oil & replace oil filter immediately to prevent cylinder wear.'
        : isOilDueSoon
        ? 'Reminder: Plan workshop visit within the next 200-300 km for scheduled oil service.'
        : 'Status: Oil viscosity and lubricating condition within nominal operating limits.';
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(adviceText, margin + 4, currentY + 17);

      currentY += 25;
    }

    // 3. UPCOMING SERVICE CHECKUP REMINDERS
    if (includeUpcomingCheckups) {
      checkPageBreak(40);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('UPCOMING MILEAGE-BASED CHECKUP REMINDERS', margin, currentY);
      currentY += 3;

      const vRecords = records.filter((r) => r.vehicleId === veh.id);
      const relevantSchedules = STANDARD_SCHEDULES.filter(
        (item) => item.vehicleType === 'both' || item.vehicleType === veh.type
      );

      const checkupRows = relevantSchedules.map((item) => {
        const curKm = veh.currentMileageKm;
        let lastDoneKm = 0;
        if (item.category === 'Fluids' && item.title.includes('Oil')) {
          lastDoneKm = veh.lastOilChangeKm;
        } else {
          const matchRec = vRecords.find(
            (r) =>
              r.serviceType.toLowerCase().includes(item.category.toLowerCase()) ||
              r.description.toLowerCase().includes(item.title.toLowerCase())
          );
          if (matchRec) {
            lastDoneKm = matchRec.mileageKm;
          } else {
            lastDoneKm = Math.floor(curKm / item.intervalKm) * item.intervalKm;
          }
        }

        const nextDueKm = lastDoneKm + item.intervalKm;
        const kmUntilDue = nextDueKm - curKm;
        const isDueNow = kmUntilDue <= (veh.type === 'bike' ? 150 : 300) && kmUntilDue >= 0;
        const isOverdue = kmUntilDue < 0;

        let statusStr = '';
        if (isOverdue) {
          statusStr = `OVERDUE (-${Math.abs(kmUntilDue).toLocaleString()} km)`;
        } else if (isDueNow) {
          statusStr = `DUE NOW (${kmUntilDue} km left)`;
        } else {
          statusStr = `OK (in ${kmUntilDue.toLocaleString()} km)`;
        }

        return [
          item.title,
          item.category,
          `Every ${item.intervalKm.toLocaleString()} km`,
          `${lastDoneKm.toLocaleString()} km`,
          `${nextDueKm.toLocaleString()} km`,
          statusStr,
        ];
      });

      autoTable(doc, {
        startY: currentY,
        head: [['Service Task', 'Category', 'Interval', 'Last Done', 'Next Due', 'Status']],
        body: checkupRows,
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 7.5,
          cellPadding: 2,
          textColor: [30, 41, 59],
        },
        headStyles: {
          fillColor: tableHeaderBg as any,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8,
        },
        columnStyles: {
          0: { cellWidth: 45, fontStyle: 'bold' },
          1: { cellWidth: 26 },
          2: { cellWidth: 26 },
          3: { cellWidth: 25 },
          4: { cellWidth: 25 },
          5: { cellWidth: 35, fontStyle: 'bold' },
        },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 5) {
            const val = String(data.cell.raw);
            if (val.includes('OVERDUE')) {
              data.cell.styles.textColor = [220, 38, 38]; // Red
            } else if (val.includes('DUE NOW')) {
              data.cell.styles.textColor = [217, 119, 6]; // Amber
            } else {
              data.cell.styles.textColor = [22, 101, 52]; // Green
            }
          }
        },
      });

      currentY = (doc as any).lastAutoTable.finalY + 8;
    }

    // 4. DETAILED SERVICE HISTORY LOG
    if (includeServiceHistory) {
      checkPageBreak(40);
      const vRecords = records
        .filter((r) => r.vehicleId === veh.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(`RECORDED SERVICE HISTORY (${vRecords.length} Logs)`, margin, currentY);
      currentY += 3;

      if (vRecords.length === 0) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(neutralGray[0], neutralGray[1], neutralGray[2]);
        doc.text('No service records recorded yet for this vehicle.', margin, currentY + 4);
        currentY += 10;
      } else {
        const historyRows = vRecords.map((rec) => {
          let descText = rec.description;
          if (rec.partsReplaced) {
            descText += `\nParts: ${rec.partsReplaced}`;
          }
          if (rec.notes) {
            descText += `\nNote: ${rec.notes}`;
          }

          return [
            rec.date,
            `${rec.mileageKm.toLocaleString()} km`,
            rec.serviceType,
            descText,
            `${rec.workshopName}\n(${rec.city})`,
            rec.costPkr > 0 ? `PKR ${rec.costPkr.toLocaleString()}` : 'Free / DIY',
          ];
        });

        autoTable(doc, {
          startY: currentY,
          head: [['Date', 'Mileage', 'Service Type', 'Details & Parts', 'Workshop / City', 'Cost']],
          body: historyRows,
          margin: { left: margin, right: margin },
          styles: {
            fontSize: 7.5,
            cellPadding: 2.2,
            textColor: [30, 41, 59],
          },
          headStyles: {
            fillColor: [51, 65, 85], // Slate 700
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 8,
          },
          columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 22, fontStyle: 'bold' },
            2: { cellWidth: 28 },
            3: { cellWidth: 55 },
            4: { cellWidth: 32 },
            5: { cellWidth: 25, halign: 'right', fontStyle: 'bold', textColor: [180, 83, 9] },
          },
        });

        currentY = (doc as any).lastAutoTable.finalY + 6;

        // Subtotal for this vehicle
        const vSpent = vRecords.reduce((s, r) => s + (r.costPkr || 0), 0);
        checkPageBreak(12);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        const subtotalText = `Subtotal Maintenance for ${veh.name}: PKR ${vSpent.toLocaleString()}`;
        doc.text(subtotalText, pageWidth - margin - doc.getTextWidth(subtotalText), currentY);
        currentY += 8;
      }
    }
  });

  // --- 5. OVERALL COST SUMMARY & BREAKDOWN ---
  if (includeCostSummary && relevantRecords.length > 0) {
    checkPageBreak(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('EXPENDITURE BREAKDOWN BY CATEGORY', margin, currentY);
    currentY += 3;

    // Calculate category breakdown
    const categoryTotals: Record<string, number> = {};
    relevantRecords.forEach((r) => {
      categoryTotals[r.serviceType] = (categoryTotals[r.serviceType] || 0) + (r.costPkr || 0);
    });

    const categoryRows = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, amount]) => [
        cat,
        `PKR ${amount.toLocaleString()}`,
        `${Math.round((amount / Math.max(1, totalSpentAll)) * 100)}%`,
      ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Service Category', 'Total Spent', '% of Total']],
      body: categoryRows,
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 7.5,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [71, 85, 105],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 80, fontStyle: 'bold' },
        1: { cellWidth: 55, halign: 'right' },
        2: { cellWidth: 45, halign: 'right' },
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;
  }

  // --- 6. WORKSHOP STAMP & SIGNATURE BLOCK ---
  checkPageBreak(30);
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 6;

  const signBoxWidth = (pageWidth - margin * 2 - 10) / 2;
  // Left: Workshop / Mechanic Stamp & Signature
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(neutralGray[0], neutralGray[1], neutralGray[2]);
  doc.text('Workshop / Certified Mechanic Stamp & Signature:', margin, currentY + 3);
  doc.line(margin, currentY + 16, margin + signBoxWidth, currentY + 16);
  doc.setFontSize(6.5);
  doc.text('Date & Verification Stamp', margin, currentY + 19);

  // Right: Owner / Buyer Signature
  const rightSignX = margin + signBoxWidth + 10;
  doc.setFontSize(7.5);
  doc.text('Vehicle Owner / Custodian Signature:', rightSignX, currentY + 3);
  doc.line(rightSignX, currentY + 16, rightSignX + signBoxWidth, currentY + 16);
  doc.setFontSize(6.5);
  doc.text('Acknowledged accurate maintenance record', rightSignX, currentY + 19);

  currentY += 23;

  // --- 7. FOOTERS ACROSS ALL PAGES ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text(
      'Generated by Car Fault Diagnosis & Workshop Portal • Local Pakistani Vehicle Log',
      margin,
      pageHeight - 7
    );

    const pageNumStr = `Page ${i} of ${totalPages}`;
    doc.text(pageNumStr, pageWidth - margin - doc.getTextWidth(pageNumStr), pageHeight - 7);
  }

  // Prepare filename
  const cleanName = isAllVehicles
    ? 'All_Vehicles_Fleet'
    : targetVehicles[0].name.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Maintenance_Report_${cleanName}_${new Date().toISOString().split('T')[0]}.pdf`;

  return { doc, filename };
}

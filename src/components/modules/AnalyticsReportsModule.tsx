import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Filter, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  TrendingUp, 
  FileSpreadsheet, 
  FileText 
} from 'lucide-react';
import { useCampusData } from '../../context/CampusDataContext.js';

export const AnalyticsReportsModule: React.FC = () => {
  const { rooms, timetables, buses, grievances, energyMetrics } = useCampusData();

  const [reportType, setReportType] = useState<'utilization' | 'transit' | 'grievance' | 'energy'>('utilization');

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    let filename = `campus_${reportType}_report.csv`;

    if (reportType === 'utilization') {
      csvContent += "Room Number,Name,Building,Capacity,Current Occupancy,Load Pct,Power kW,CO2 ppm\n";
      rooms.forEach(r => {
        const pct = Math.round((r.currentOccupancy / r.capacity) * 100);
        csvContent += `"${r.roomNumber}","${r.name}","${r.buildingName}",${r.capacity},${r.currentOccupancy},"${pct}%",${r.powerKw},${r.co2Ppm}\n`;
      });
    } else if (reportType === 'transit') {
      csvContent += "Route,Bus Number,Driver,Status,Delay Mins,Passengers,Capacity,Speed kmh\n";
      buses.forEach(b => {
        csvContent += `"${b.routeName}","${b.busNumber}","${b.driverName}","${b.status}",${b.delayMinutes},${b.currentPassengers},${b.capacity},${b.speedKmh}\n`;
      });
    } else if (reportType === 'grievance') {
      csvContent += "Reference No,Title,Category,Priority,Status,Location,Assigned Department,Created At\n";
      grievances.forEach(g => {
        csvContent += `"${g.referenceNo}","${g.title}","${g.category}","${g.priority}","${g.status}","${g.location}","${g.assignedDepartment}","${g.createdAt}"\n`;
      });
    } else {
      csvContent += "Building ID,Building Name,Current kW,Daily kWh,Peak kW,Cost USD,Carbon kg\n";
      energyMetrics.forEach(m => {
        csvContent += `"${m.buildingId}","${m.buildingName}",${m.currentKw},${m.dailyKwh},${m.peakKwToday},${m.costEstUsd},${m.carbonKg}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Institutional Analytics &amp; Compliance Reporting
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
              CSV Export Ready
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Auditable operational records, SLA compliance metrics, and downloadable administrative spreadsheets.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print View</span>
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector (Zero-pill button segmented controls) */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 w-fit">
        {[
          { id: 'utilization', label: 'Classroom Utilization' },
          { id: 'transit', label: 'Transport Punctuality' },
          { id: 'grievance', label: 'Grievance Resolution SLA' },
          { id: 'energy', label: 'Energy Consumption & Cost' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setReportType(t.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              reportType === t.id ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tabular Data View */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          {reportType === 'utilization' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Room</th>
                  <th className="p-3">Building</th>
                  <th className="p-3">Capacity</th>
                  <th className="p-3">Occupancy</th>
                  <th className="p-3">Load Rate</th>
                  <th className="p-3">Power</th>
                  <th className="p-3">CO₂ Level</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {rooms.map(r => {
                  const pct = Math.round((r.currentOccupancy / r.capacity) * 100);

                  return (
                    <tr key={r.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-white">{r.name} ({r.roomNumber})</td>
                      <td className="p-3">{r.buildingName}</td>
                      <td className="p-3 font-mono">{r.capacity}</td>
                      <td className="p-3 font-mono">{r.currentOccupancy}</td>
                      <td className="p-3 font-mono font-bold text-cyan-300">{pct}%</td>
                      <td className="p-3 font-mono">{r.powerKw} kW</td>
                      <td className="p-3 font-mono">{r.co2Ppm} ppm</td>
                      <td className="p-3 capitalize font-semibold">{r.occupancyStatus}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {reportType === 'transit' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Route Name</th>
                  <th className="p-3">Vehicle Plate</th>
                  <th className="p-3">Driver Name</th>
                  <th className="p-3">Delay Status</th>
                  <th className="p-3">Passengers</th>
                  <th className="p-3">Current Speed</th>
                  <th className="p-3">Next Stop</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {buses.map(b => (
                  <tr key={b.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-white">{b.routeName}</td>
                    <td className="p-3 font-mono text-cyan-300">{b.busNumber}</td>
                    <td className="p-3">{b.driverName}</td>
                    <td className="p-3 font-mono font-bold">
                      {b.status === 'delayed' ? (
                        <span className="text-amber-400">+{b.delayMinutes} mins Late</span>
                      ) : (
                        <span className="text-emerald-400">On Time</span>
                      )}
                    </td>
                    <td className="p-3 font-mono">{b.currentPassengers} / {b.capacity}</td>
                    <td className="p-3 font-mono">{b.speedKmh} km/h</td>
                    <td className="p-3">{b.nextStopName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'grievance' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Ref ID</th>
                  <th className="p-3">Issue Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Assigned Dept</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Filed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {grievances.map(g => (
                  <tr key={g.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-cyan-400">{g.referenceNo}</td>
                    <td className="p-3 font-bold text-white max-w-xs truncate">{g.title}</td>
                    <td className="p-3 capitalize">{g.category}</td>
                    <td className="p-3 font-bold uppercase">{g.priority}</td>
                    <td className="p-3">{g.assignedDepartment}</td>
                    <td className="p-3 capitalize font-semibold">{g.status.replace('_', ' ')}</td>
                    <td className="p-3 font-mono text-[11px] text-slate-500">{new Date(g.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'energy' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Sub-Station Facility</th>
                  <th className="p-3">Live Demand (kW)</th>
                  <th className="p-3">Today Consumption (kWh)</th>
                  <th className="p-3">Peak kW Today</th>
                  <th className="p-3">Estimated Cost (USD)</th>
                  <th className="p-3">Carbon Equivalent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {energyMetrics.map(m => (
                  <tr key={m.buildingId} className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-white">{m.buildingName}</td>
                    <td className="p-3 font-mono font-bold text-cyan-300">{m.currentKw} kW</td>
                    <td className="p-3 font-mono">{m.dailyKwh} kWh</td>
                    <td className="p-3 font-mono">{m.peakKwToday} kW</td>
                    <td className="p-3 font-mono text-emerald-400 font-bold">${m.costEstUsd}</td>
                    <td className="p-3 font-mono">{m.carbonKg} kg CO₂</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

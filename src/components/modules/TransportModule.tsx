import React, { useState } from 'react';
import { 
  BusFront, 
  MapPin, 
  Navigation, 
  Clock, 
  AlertTriangle, 
  Users, 
  Phone, 
  CheckCircle2, 
  Send, 
  Search, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useCampusData } from '../../context/CampusDataContext.js';
import { Bus, BusRoute } from '../../types/index.js';

export const TransportModule: React.FC = () => {
  const { currentUser, isRole } = useAuth();
  const { buses, busRoutes, publishEmergencyAlert } = useCampusData();

  const [selectedBusId, setSelectedBusId] = useState<string>(buses[0]?.id || '');
  const [stopSearch, setStopSearch] = useState<string>('');
  const [showAdminAlertModal, setShowAdminAlertModal] = useState(false);
  const [alertForm, setAlertForm] = useState({
    title: 'Route 3 Service Delay Advisory',
    message: 'Bus #03 delayed by 20 mins due to construction on East Ring Road. Take connecting Route 1 shuttle from Orchard Lake.',
    severity: 'warning' as const
  });

  const selectedBus = buses.find(b => b.id === selectedBusId) || buses[0];
  const selectedRoute = busRoutes.find(r => r.id === selectedBus?.routeId) || busRoutes[0];

  const handleBroadcastAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    await publishEmergencyAlert({
      title: alertForm.title,
      severity: alertForm.severity,
      message: alertForm.message,
      location: selectedBus?.routeName || 'Campus Transit Corridors',
      recommendedActions: [
        'Check estimated arrivals in Transport portal',
        'Board connecting Route 1 or internal EV shuttle',
        'Excused tardiness granted for 9:00 AM lectures'
      ]
    });
    setShowAdminAlertModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Live College Bus Tracking &amp; Fleet Operations
            </h1>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              GPS Active
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Real-time telemetry, predictive arrival durations, and transport administrator dispatch controls.
          </p>
        </div>

        {/* Transport Admin Action */}
        <div className="flex items-center gap-2">
          {isRole(['transport_admin', 'campus_admin']) && (
            <button
              onClick={() => setShowAdminAlertModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-slate-950" />
              <span>Broadcast Fleet Advisory</span>
            </button>
          )}
        </div>
      </div>

      {/* Transit Map & Route Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive SVG Campus Map */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Live Route Navigation &amp; Stop Telemetry</h3>
              <p className="text-xs text-slate-400">Interactive schematic of university arterial routes and moving vehicles</p>
            </div>
            <span className="text-[10px] text-slate-400 font-mono px-2 py-1 rounded bg-slate-800 border border-slate-700">
              SIMULATED GPS BEACONS
            </span>
          </div>

          {/* Interactive SVG Canvas */}
          <div className="relative w-full h-80 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-4">
            <svg viewBox="0 0 700 350" className="w-full h-full">
              {/* Grid backdrop */}
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="700" height="350" fill="url(#grid)" />

              {/* Campus Quadrants */}
              <rect x="420" y="40" width="240" height="130" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1" />
              <text x="435" y="65" fill="#94a3b8" fontSize="12" fontWeight="bold">Main University Campus</text>
              <text x="435" y="85" fill="#64748b" fontSize="10">Engineering · Computing · Labs</text>

              <rect x="40" y="220" width="200" height="100" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1" />
              <text x="55" y="245" fill="#94a3b8" fontSize="12" fontWeight="bold">South Hostels &amp; Tech Hub</text>

              {/* Route 1 Path (Cyan) */}
              <path
                d="M 60 70 Q 250 80 480 100 T 600 120"
                fill="none"
                stroke={selectedRoute?.id === 'route_1' ? '#22d3ee' : '#0891b2'}
                strokeWidth={selectedRoute?.id === 'route_1' ? '4' : '2'}
                strokeDasharray="4 2"
              />

              {/* Route 2 Path (Amber) */}
              <path
                d="M 120 280 Q 300 240 500 140"
                fill="none"
                stroke={selectedRoute?.id === 'route_2' ? '#fbbf24' : '#d97706'}
                strokeWidth={selectedRoute?.id === 'route_2' ? '4' : '2'}
                strokeDasharray="4 2"
              />

              {/* Route 3 Path (Purple) */}
              <path
                d="M 80 180 Q 280 190 490 110"
                fill="none"
                stroke={selectedRoute?.id === 'route_3' ? '#c084fc' : '#7e22ce'}
                strokeWidth={selectedRoute?.id === 'route_3' ? '4' : '2'}
                strokeDasharray="4 2"
              />

              {/* Designated Stops along selected route */}
              {selectedRoute.stops.map((stop, i) => {
                const x = 80 + i * 115;
                const y = 80 + (i % 2 === 0 ? 25 : -15) + (selectedRoute.id === 'route_2' ? 120 : 0);

                return (
                  <g key={stop.id} className="cursor-pointer group">
                    <circle cx={x} cy={y} r="6" fill="#0f172a" stroke="#22d3ee" strokeWidth="2.5" />
                    <circle cx={x} cy={y} r="2.5" fill="#22d3ee" />
                    <text x={x} y={y + 18} fill="#e2e8f0" fontSize="9" textAnchor="middle" fontWeight="bold">
                      {stop.name}
                    </text>
                  </g>
                );
              })}

              {/* Moving Bus Pin Indicator */}
              <g transform="translate(380, 92)" className="animate-pulse">
                <circle cx="0" cy="0" r="14" fill="#06b6d4" opacity="0.2" />
                <rect x="-10" y="-8" width="20" height="16" rx="3" fill="#06b6d4" />
                <text x="0" y="4" fill="#020617" fontSize="8" fontWeight="bold" textAnchor="middle">BUS</text>
              </g>
            </svg>

            {/* Float badge inside map */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-700/80 p-2.5 rounded-xl text-xs backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="font-bold text-white">{selectedBus.routeName}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Speed: {selectedBus.speedKmh} km/h · Passenger Load: {selectedBus.currentPassengers}/{selectedBus.capacity}
              </p>
            </div>
          </div>

          {/* Stops List */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
              Stops &amp; Schedule on {selectedRoute.routeName}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {selectedRoute.stops.map((stop, index) => (
                <div key={stop.id} className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Stop #{index + 1}</span>
                    <span className="font-mono text-cyan-300">{stop.scheduledArrivalTime}</span>
                  </div>
                  <p className="font-medium text-slate-200 mt-1 truncate">{stop.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bus List & Details Panel */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">College Bus Fleet</h3>
            <p className="text-xs text-slate-400">Select a bus to inspect telemetry and route progress</p>
          </div>

          {/* Bus cards */}
          <div className="space-y-2.5">
            {buses.map(bus => {
              const isSelected = selectedBusId === bus.id;

              return (
                <div
                  key={bus.id}
                  onClick={() => setSelectedBusId(bus.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-400 shadow-md shadow-cyan-950/20'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{bus.routeName}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                      bus.status === 'delayed' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {bus.status === 'delayed' ? `+${bus.delayMinutes}m Late` : 'On Schedule'}
                    </span>
                  </div>
                  <p className="text-[11px] text-cyan-300 font-mono mt-1">{bus.busNumber}</p>
                  
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-700/60">
                    <span>Next: {bus.nextStopName}</span>
                    <span className="text-white font-bold font-mono">ETA: {bus.estimatedArrivalMins}m</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Driver Info (Authorized View) */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-300">Vehicle &amp; Driver Dossier</span>
              {isRole(['transport_admin', 'campus_admin', 'faculty']) ? (
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Staff Authorized
                </span>
              ) : (
                <span className="text-[10px] text-slate-500">Public Overview</span>
              )}
            </div>

            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Driver:</span>
                <span className="font-medium text-white">{selectedBus.driverName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Direct Contact:</span>
                <span className="font-mono text-cyan-400">
                  {isRole(['transport_admin', 'campus_admin']) ? selectedBus.driverPhone : 'Contact Fleet Dispatch'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Passenger Capacity:</span>
                <span>{selectedBus.currentPassengers} / {selectedBus.capacity} seats</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Advisory Modal */}
      {showAdminAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Broadcast Transport Advisory</h3>
              </div>
              <button onClick={() => setShowAdminAlertModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleBroadcastAlert} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Advisory Title</label>
                <input
                  type="text"
                  value={alertForm.title}
                  onChange={e => setAlertForm({ ...alertForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Severity</label>
                <select
                  value={alertForm.severity}
                  onChange={e => setAlertForm({ ...alertForm, severity: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                >
                  <option value="warning">Warning (Service Delay / Detour)</option>
                  <option value="critical">Critical (Route Breakdown / Cancellation)</option>
                  <option value="info">Info (Schedule Modification)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Notification Message</label>
                <textarea
                  rows={3}
                  value={alertForm.message}
                  onChange={e => setAlertForm({ ...alertForm, message: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdminAlertModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Broadcast Push Notification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

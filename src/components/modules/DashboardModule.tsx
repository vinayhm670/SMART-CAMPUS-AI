import React from 'react';
import { 
  Users, 
  DoorOpen, 
  BusFront, 
  FlaskConical, 
  AlertCircle, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  ArrowUpRight, 
  Sparkles, 
  Clock, 
  Calendar,
  CheckCircle2,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useCampusData } from '../../context/CampusDataContext.js';
import { ActiveTab } from '../layout/Sidebar.js';

interface DashboardModuleProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenOrchestrator: () => void;
  onOpenAssistant: () => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  onNavigate,
  onOpenOrchestrator,
  onOpenAssistant
}) => {
  const { currentUser } = useAuth();
  const { 
    rooms, 
    timetables, 
    buses, 
    equipment, 
    grievances, 
    energyMetrics, 
    recommendations,
    applyRecommendation,
    emergencyAlerts 
  } = useCampusData();

  const occupiedRooms = rooms.filter(r => r.occupancyStatus === 'occupied').length;
  const availableRooms = rooms.filter(r => r.occupancyStatus === 'available').length;
  const totalRooms = rooms.length;
  const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);

  const activeBusesCount = buses.filter(b => b.status === 'on_route' || b.status === 'delayed').length;
  const delayedBuses = buses.filter(b => b.status === 'delayed');
  const availableEquipCount = equipment.filter(e => e.status === 'available').length;
  const pendingGrievances = grievances.filter(g => g.status !== 'resolved');
  const totalPowerKw = energyMetrics.reduce((acc, m) => acc + m.currentKw, 0);

  // Hourly curve data for classroom utilization
  const utilizationHours = [
    { hour: '08:00', pct: 28 },
    { hour: '09:00', pct: 72 },
    { hour: '10:00', pct: 86 },
    { hour: '11:00', pct: 92 },
    { hour: '12:00', pct: 64 },
    { hour: '13:00', pct: 54 },
    { hour: '14:00', pct: 88 },
    { hour: '15:00', pct: 79 },
    { hour: '16:00', pct: 45 },
    { hour: '17:00', pct: 22 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome & KPI Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Campus Intelligence Overview
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Ingest
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Real-time telemetry across academic scheduling, transport fleets, research apparatus, and energy grids.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenOrchestrator}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-500/20 to-cyan-500/20 hover:from-teal-500/30 hover:to-cyan-500/30 border border-teal-500/40 text-cyan-300 hover:text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Orchestration Engine</span>
          </button>
          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-900/30 transition-all"
          >
            <span>Ask Campus AI</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Classrooms */}
        <div 
          onClick={() => onNavigate('occupancy')}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Classroom Occupancy</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <DoorOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{occupiedRooms}</span>
            <span className="text-xs text-slate-400">/ {totalRooms} rooms active</span>
          </div>
          <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-teal-400 h-full rounded-full transition-all" style={{ width: `${occupancyRate}%` }} />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>{availableRooms} vacant for booking</span>
            <span className="text-cyan-400 font-semibold">{occupancyRate}% Load</span>
          </div>
        </div>

        {/* Card 2: Transit */}
        <div 
          onClick={() => onNavigate('transport')}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Bus Fleet</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <BusFront className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{activeBusesCount}</span>
            <span className="text-xs text-slate-400">vehicles transmitting GPS</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px]">
            {delayedBuses.length > 0 ? (
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> {delayedBuses.length} Route with delay ({delayedBuses[0].delayMinutes}m)
              </span>
            ) : (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All fleets on schedule
              </span>
            )}
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Internal shuttle loop every 15m</p>
        </div>

        {/* Card 3: Research Labs & Equipment */}
        <div 
          onClick={() => onNavigate('laboratories')}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Research Equipment</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <FlaskConical className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{availableEquipCount}</span>
            <span className="text-xs text-slate-400">/ {equipment.length} ready to reserve</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
            <span>DGX H100 GPU Cluster in use</span>
          </div>
          <p className="mt-2 text-[11px] text-indigo-400 font-medium">NanoSEM slot open tomorrow</p>
        </div>

        {/* Card 4: Energy Grid */}
        <div 
          onClick={() => onNavigate('energy')}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/40 hover:bg-slate-900 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Real-time Campus Load</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{totalPowerKw.toFixed(1)}</span>
            <span className="text-xs text-slate-400">kW power demand</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>8.4% below monthly peak</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">4 micro-grid submeters active</p>
        </div>
      </div>

      {/* Middle Grid: Utilization Chart & Live Transit Teaser */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Classroom Hourly Utilization Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Classroom Utilization by Hour</h3>
              <p className="text-xs text-slate-400">Aggregated PIR and timetabled headcount across 5 buildings</p>
            </div>
            <button
              onClick={() => onNavigate('occupancy')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              Floor Plan <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Native SVG Bar Chart */}
          <div className="h-52 w-full flex items-end gap-2 pt-6 pb-2">
            {utilizationHours.map(item => (
              <div key={item.hour} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                  {item.pct}%
                </span>
                <div 
                  className={`w-full rounded-t-md transition-all duration-300 ${
                    item.pct > 80 
                      ? 'bg-gradient-to-t from-cyan-600 to-cyan-400 group-hover:brightness-110' 
                      : 'bg-gradient-to-t from-slate-700 to-slate-600 group-hover:bg-slate-500'
                  }`}
                  style={{ height: `${item.pct}%` }}
                />
                <span className="text-[10px] text-slate-400 font-mono mt-1">
                  {item.hour.split(':')[0]}h
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-cyan-400" /> Peak hours (10:00 - 12:00 &amp; 14:00)
            </span>
            <span>Sensor Source: ESP32 IoT Nodes</span>
          </div>
        </div>

        {/* Live Transit Monitor Widget */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Live College Buses</h3>
              <p className="text-xs text-slate-400">Real-time GPS arrival estimates</p>
            </div>
            <button
              onClick={() => onNavigate('transport')}
              className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
            >
              Transit Map <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 my-2">
            {buses.slice(0, 3).map(bus => (
              <div 
                key={bus.id} 
                onClick={() => onNavigate('transport')}
                className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{bus.routeName}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    bus.status === 'delayed' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {bus.status === 'delayed' ? `+${bus.delayMinutes}m delay` : 'On Time'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                  <span className="truncate">Approaching: {bus.nextStopName}</span>
                  <span className="text-cyan-300 font-semibold font-mono">ETA: {bus.estimatedArrivalMins}m</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>{buses.length} routes operating</span>
            <span className="text-emerald-400">GPS Ping: 6s</span>
          </div>
        </div>
      </div>

      {/* Bottom Grid: AI Recommendations & Pending Grievances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Recommendations Panel */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-cyan-950/20 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">AI Resource Optimization Recommendations</h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold">
              Autonomous Assistant
            </span>
          </div>

          <div className="space-y-3 mt-3">
            {recommendations.map(rec => (
              <div 
                key={rec.id}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/30 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-white leading-snug">{rec.title}</span>
                  <span className="text-[10px] font-mono font-bold text-teal-400 px-1.5 py-0.5 rounded bg-teal-500/10">
                    {Math.round(rec.confidence * 100)}% Conf.
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{rec.reasoning}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-medium text-emerald-400">Impact: {rec.impact}</span>
                  {rec.status === 'accepted' ? (
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Reassignment Applied
                    </span>
                  ) : (
                    <button
                      onClick={() => applyRecommendation(rec.id)}
                      className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-[11px] transition-colors"
                    >
                      {rec.actionLabel || 'Apply'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Grievances & Facility Issues */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Grievance & Maintenance Stream</h3>
                <p className="text-xs text-slate-400">AI-clustered student facility issues and resolution SLA</p>
              </div>
              <button
                onClick={() => onNavigate('grievances')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                All Tickets <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 my-2">
              {pendingGrievances.slice(0, 3).map(g => (
                <div 
                  key={g.id} 
                  onClick={() => onNavigate('grievances')}
                  className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-cyan-500/20 text-cyan-300">
                        {g.referenceNo}
                      </span>
                      <span className="font-semibold text-white truncate max-w-[200px]">{g.title}</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold capitalize ${
                      g.priority === 'urgent' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {g.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 truncate">{g.location} · Assigned: {g.assignedDepartment}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>{pendingGrievances.length} open tickets in queue</span>
            <button
              onClick={() => onNavigate('grievances')}
              className="text-xs text-cyan-400 hover:underline font-medium"
            >
              + Submit New Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

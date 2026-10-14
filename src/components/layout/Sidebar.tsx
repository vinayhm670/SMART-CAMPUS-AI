import React from 'react';
import { 
  LayoutDashboard, 
  CalendarClock, 
  Users, 
  BusFront, 
  FlaskConical, 
  AlertCircle, 
  Zap, 
  MapPin, 
  ShieldAlert, 
  Ticket, 
  SearchCheck, 
  BookOpen, 
  BarChart3, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useCampusData } from '../../context/CampusDataContext.js';

export type ActiveTab = 
  | 'dashboard' 
  | 'timetable' 
  | 'occupancy' 
  | 'transport' 
  | 'laboratories' 
  | 'grievances' 
  | 'energy' 
  | 'digital_twin' 
  | 'safety' 
  | 'queue' 
  | 'lost_found' 
  | 'knowledge_hub' 
  | 'analytics';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onOpenOrchestrator: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  onOpenOrchestrator
}) => {
  const { currentUser } = useAuth();
  const { timetables, buses, grievances, emergencyAlerts } = useCampusData();

  const conflictCount = timetables.filter(t => t.isConflict).length;
  const delayedBusCount = buses.filter(b => b.status === 'delayed').length;
  const pendingGrievanceCount = grievances.filter(g => g.status === 'submitted' || g.status === 'in_progress').length;
  const activeAlertCount = emergencyAlerts.filter(a => a.active).length;

  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Command Center', icon: LayoutDashboard },
    { id: 'timetable' as ActiveTab, label: 'Smart Timetable', icon: CalendarClock, badge: conflictCount > 0 ? `${conflictCount} Conflict` : undefined, badgeColor: 'bg-rose-500/20 text-rose-300' },
    { id: 'occupancy' as ActiveTab, label: 'Room Occupancy', icon: Users },
    { id: 'transport' as ActiveTab, label: 'Live Bus Transit', icon: BusFront, badge: delayedBusCount > 0 ? `${delayedBusCount} Delayed` : undefined, badgeColor: 'bg-amber-500/20 text-amber-300' },
    { id: 'laboratories' as ActiveTab, label: 'Labs & Equipment', icon: FlaskConical },
    { id: 'grievances' as ActiveTab, label: 'Student Grievance', icon: AlertCircle, badge: pendingGrievanceCount > 0 ? `${pendingGrievanceCount} Active` : undefined, badgeColor: 'bg-cyan-500/20 text-cyan-300' },
    { id: 'energy' as ActiveTab, label: 'Energy & Climate', icon: Zap },
    { id: 'digital_twin' as ActiveTab, label: 'Campus Digital Twin', icon: MapPin },
    { id: 'safety' as ActiveTab, label: 'Safety & Emergency', icon: ShieldAlert, badge: activeAlertCount > 0 ? 'Alert' : undefined, badgeColor: 'bg-red-500/20 text-red-300' },
    { id: 'queue' as ActiveTab, label: 'Smart Virtual Queue', icon: Ticket },
    { id: 'lost_found' as ActiveTab, label: 'Lost & Found AI', icon: SearchCheck },
    { id: 'knowledge_hub' as ActiveTab, label: 'Knowledge Hub', icon: BookOpen },
    { id: 'analytics' as ActiveTab, label: 'Reports & Analytics', icon: BarChart3 }
  ];

  return (
    <aside 
      className={`relative z-20 flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out select-none ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40">
        {!collapsed ? (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center shadow-lg shadow-cyan-900/30 flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-base font-bold tracking-tight text-white truncate">
                Smart Campus <span className="text-cyan-400">AI</span>
              </span>
              <span className="text-[10px] text-cyan-200/60 uppercase tracking-widest font-semibold truncate">
                Apex Institute
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center shadow-lg shadow-cyan-900/30">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${collapsed ? 'hidden' : 'block'}`}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Signature Cross-Module AI Orchestrator Callout Button */}
      <div className="p-3">
        <button
          onClick={onOpenOrchestrator}
          className={`w-full group relative overflow-hidden rounded-xl border border-teal-500/30 bg-gradient-to-r from-teal-950/60 via-cyan-950/50 to-slate-900 p-2.5 text-left transition-all hover:border-cyan-400/50 hover:shadow-md hover:shadow-cyan-950/50 ${
            collapsed ? 'flex justify-center' : 'flex items-center gap-3'
          }`}
          title="Open Cross-Module AI Orchestrator"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 group-hover:scale-105 transition-transform flex-shrink-0">
            <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-white tracking-wide">AI Orchestration</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-400/20 text-cyan-300 font-medium">LIVE</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">Run cross-module cascades</p>
            </div>
          )}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-600/25 to-teal-600/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              } ${collapsed ? 'justify-center px-2' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
              
              {!collapsed && (
                <>
                  <span className="truncate flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Status Bar at bottom */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/30">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <img 
            src={currentUser.avatarUrl} 
            alt={currentUser.name} 
            className="w-8 h-8 rounded-full border border-cyan-500/30 object-cover flex-shrink-0"
          />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate">{currentUser.name}</p>
              <p className="text-[11px] text-cyan-400/90 capitalize truncate">{currentUser.role.replace('_', ' ')}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

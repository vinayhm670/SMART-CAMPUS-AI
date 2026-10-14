import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Sparkles, 
  Sun, 
  Moon, 
  ShieldAlert, 
  ChevronDown, 
  UserCheck,
  Check,
  Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useCampusData } from '../../context/CampusDataContext.js';
import { UserRole } from '../../types/index.js';

interface TopNavbarProps {
  onOpenSearch: () => void;
  onOpenAssistant: () => void;
  onOpenNotifications: () => void;
  onToggleSidebarMobile: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onOpenSearch,
  onOpenAssistant,
  onOpenNotifications,
  onToggleSidebarMobile,
  isDark,
  toggleTheme
}) => {
  const { currentUser, switchRole, availableUsers } = useAuth();
  const { notifications, emergencyAlerts } = useCampusData();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const activeAlert = emergencyAlerts.find(a => a.active);

  const roleLabels: Record<UserRole, { label: string; icon: string; desc: string }> = {
    student: { label: 'Student', icon: '🎓', desc: 'Aarav Sharma · CS Dept' },
    faculty: { label: 'Faculty', icon: '👩‍🏫', desc: 'Prof. Elena Vance · ECE' },
    transport_admin: { label: 'Transport Admin', icon: '🚌', desc: 'Marcus Brody · Fleet Ops' },
    lab_admin: { label: 'Lab Admin', icon: '🔬', desc: 'Dr. Sarah Chen · Quantum Labs' },
    campus_admin: { label: 'Campus Admin', icon: '🏛️', desc: 'Dean Robert Sterling · Vice Chancellor' },
  };

  return (
    <header className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-slate-800 bg-slate-900/95 backdrop-blur-md sticky top-0 z-10 select-none">
      {/* Left side: Mobile menu toggle & Global search button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebarMobile}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-slate-200 text-xs md:text-sm font-normal transition-all shadow-inner w-44 md:w-80 group text-left"
        >
          <Search className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors flex-shrink-0" />
          <span className="truncate flex-1">Search rooms, buses, labs...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-slate-900 rounded border border-slate-700">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Center: Emergency Safety Flash (if active) */}
      {activeAlert && (
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 border border-red-500/40 text-red-200 text-xs animate-pulse max-w-md truncate">
          <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="font-semibold text-red-300">Safety Advisory:</span>
          <span className="truncate">{activeAlert.title}</span>
        </div>
      )}

      {/* Right side controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* AI Assistant Quick Launcher */}
        <button
          onClick={onOpenAssistant}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white text-xs font-medium transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
          <span className="hidden sm:inline">AI Campus Copilot</span>
        </button>

        {/* In-App Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950 flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Role Switcher Pill & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 transition-all hover:border-cyan-500/40"
          >
            <span className="text-base">{roleLabels[currentUser.role]?.icon}</span>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[10px] text-slate-400 uppercase font-semibold leading-none">Role</span>
              <span className="text-xs font-bold text-cyan-300 leading-tight">
                {roleLabels[currentUser.role]?.label}
              </span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${roleMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-black/80 py-2 z-50">
              <div className="px-3 py-1.5 border-b border-slate-800">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Switch Persona / Role</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Test role-tailored views and authorization rules.</p>
              </div>

              <div className="p-1 space-y-0.5">
                {(['student', 'faculty', 'transport_admin', 'lab_admin', 'campus_admin'] as UserRole[]).map(role => {
                  const meta = roleLabels[role];
                  const isCurrent = currentUser.role === role;

                  return (
                    <button
                      key={role}
                      onClick={() => {
                        switchRole(role);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
                        isCurrent
                          ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-200 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="text-lg">{meta.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold">{meta.label}</span>
                          {isCurrent && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{meta.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

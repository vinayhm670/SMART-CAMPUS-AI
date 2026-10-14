import React, { useState } from 'react';
import { X, CheckCheck, Bell, ShieldAlert, BusFront, Calendar, FlaskConical, AlertCircle, Wrench } from 'lucide-react';
import { useCampusData } from '../../context/CampusDataContext.js';
import { ActiveTab } from '../layout/Sidebar.js';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveTab) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose, onNavigate }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useCampusData();
  const [filter, setFilter] = useState<string>('all');

  if (!isOpen) return null;

  const filtered = notifications.filter(n => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'safety': return <ShieldAlert className="w-4 h-4 text-red-400" />;
      case 'transit': return <BusFront className="w-4 h-4 text-amber-400" />;
      case 'academic': return <Calendar className="w-4 h-4 text-cyan-400" />;
      case 'lab': return <FlaskConical className="w-4 h-4 text-indigo-400" />;
      case 'maintenance': return <Wrench className="w-4 h-4 text-yellow-400" />;
      default: return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTabForType = (type: string): ActiveTab => {
    switch (type) {
      case 'safety': return 'safety';
      case 'transit': return 'transport';
      case 'academic': return 'timetable';
      case 'lab': return 'laboratories';
      case 'maintenance': return 'grievances';
      default: return 'dashboard';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Campus Notifications</h3>
              <p className="text-[11px] text-slate-400">Live system events & alerts</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Bar (Zero-pill button segmented control) */}
        <div className="px-4 py-2 border-b border-slate-800 flex items-center gap-1 overflow-x-auto scrollbar-none">
          {['all', 'academic', 'transit', 'safety', 'lab'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                filter === f
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs">No notifications in this filter</p>
            </div>
          ) : (
            filtered.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  markNotificationRead(item.id);
                  onNavigate(getTabForType(item.type));
                  onClose();
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer text-left relative ${
                  item.read 
                    ? 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/40' 
                    : 'bg-slate-800/60 border-cyan-500/30 text-slate-200 hover:bg-slate-800'
                }`}
              >
                {!item.read && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                )}
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">{getIcon(item.type)}</div>
                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{item.message}</p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500">
                      <span>{item.timestamp}</span>
                      <span>·</span>
                      <span className="capitalize">{item.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

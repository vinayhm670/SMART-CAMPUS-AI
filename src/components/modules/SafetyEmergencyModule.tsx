import React, { useState } from 'react';
import { 
  ShieldAlert, 
  PhoneCall, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  Flame, 
  CloudLightning, 
  Activity, 
  Lock, 
  Check, 
  LifeBuoy 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useCampusData } from '../../context/CampusDataContext.js';

export const SafetyEmergencyModule: React.FC = () => {
  const { isRole } = useAuth();
  const { emergencyAlerts, acknowledgeEmergencyAlert, publishEmergencyAlert } = useCampusData();

  const [acknowledged, setAcknowledged] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [newAlertForm, setNewAlertForm] = useState({
    title: '',
    severity: 'warning' as const,
    location: 'Main University Campus',
    message: '',
    actions: 'Follow official directions from building wardens.'
  });

  const activeAlert = emergencyAlerts.find(a => a.active);

  const emergencyContacts = [
    { title: 'Campus Security Control & Dispatch', phone: '+91 80 2345 0100', ext: 'Ext 100', hours: '24/7 Rapid Response' },
    { title: 'University Health Center & Ambulance', phone: '+91 80 2345 0108', ext: 'Ext 108', hours: 'Emergency Trauma Ward' },
    { title: 'Campus Fire & Hazardous Materials', phone: '+91 80 2345 0101', ext: 'Ext 101', hours: 'Fire Marshal' },
    { title: 'Mental Health & Student Crisis Support', phone: '+91 80 2345 0199', ext: 'Ext 199', hours: 'Confidential 24/7 Helpline' }
  ];

  const handleAcknowledge = async () => {
    if (activeAlert) {
      await acknowledgeEmergencyAlert(activeAlert.id);
      setAcknowledged(true);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    await publishEmergencyAlert({
      title: newAlertForm.title,
      severity: newAlertForm.severity,
      message: newAlertForm.message,
      location: newAlertForm.location,
      recommendedActions: newAlertForm.actions.split('\n').filter(Boolean)
    });
    setShowAdminModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Campus Safety, Evacuation &amp; Emergency Hub
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1 font-mono">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              Official Alert Channel
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Real-time critical safety broadcasts, evacuation protocols, and direct first-responder hotlines.
          </p>
        </div>

        {isRole(['campus_admin']) && (
          <button
            onClick={() => setShowAdminModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-950/40 transition-colors"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Publish Emergency Broadcast</span>
          </button>
        )}
      </div>

      {/* Active Broadcast Banner */}
      {activeAlert && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-900 border border-red-500/50 shadow-xl space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0">
                <CloudLightning className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                  CRITICAL CAMPUS ADVISORY · {activeAlert.location}
                </span>
                <h2 className="text-base md:text-lg font-bold text-white mt-0.5">{activeAlert.title}</h2>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-red-300 px-2.5 py-1 rounded bg-red-500/20 uppercase">
              {activeAlert.severity}
            </span>
          </div>

          <p className="text-xs md:text-sm text-slate-200 leading-relaxed">{activeAlert.message}</p>

          <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
            <span className="font-bold text-white">Recommended Safety Actions:</span>
            {activeAlert.recommendedActions.map((act, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                <span>{act}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
            <span>Official broadcast confirmed by Vice Chancellor's Safety Council · {activeAlert.acknowledgedCount} verified acknowledgments</span>

            {acknowledged ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Acknowledged by You
              </span>
            ) : (
              <button
                onClick={handleAcknowledge}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-colors shadow-sm"
              >
                Acknowledge Safety Notice
              </button>
            )}
          </div>
        </div>
      )}

      {/* Verified Emergency Contacts Directory */}
      <div>
        <h3 className="text-sm font-bold text-white mb-3">Verified First Responder Hotlines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyContacts.map((contact, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">{contact.title}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{contact.hours}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-mono text-cyan-300 font-bold text-sm">{contact.phone}</span>
                  <span className="text-[10px] text-slate-500 font-mono">({contact.ext})</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-800 text-cyan-400 flex items-center justify-center flex-shrink-0">
                <PhoneCall className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Broadcast Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Publish Official Emergency Alert</h3>
              <button onClick={() => setShowAdminModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handlePublish} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Alert Title</label>
                <input
                  type="text"
                  required
                  value={newAlertForm.title}
                  onChange={e => setNewAlertForm({ ...newAlertForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  placeholder="e.g. Chemical Storage Leak in Block L"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Severity</label>
                <select
                  value={newAlertForm.severity}
                  onChange={e => setNewAlertForm({ ...newAlertForm, severity: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                >
                  <option value="warning">Warning (Severe Weather / Caution)</option>
                  <option value="critical">Critical (Immediate Evacuation / Lockdown)</option>
                  <option value="info">Info (Precautionary Notice)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Alert Message</label>
                <textarea
                  rows={3}
                  required
                  value={newAlertForm.message}
                  onChange={e => setNewAlertForm({ ...newAlertForm, message: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Recommended Instructions (1 per line)</label>
                <textarea
                  rows={2}
                  value={newAlertForm.actions}
                  onChange={e => setNewAlertForm({ ...newAlertForm, actions: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold"
                >
                  Broadcast Immediate Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

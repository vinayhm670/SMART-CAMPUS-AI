import React, { useState } from 'react';
import { 
  FlaskConical, 
  Cpu, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  Filter, 
  Search,
  Check,
  X,
  Wrench
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useCampusData } from '../../context/CampusDataContext.js';
import { Laboratory, LabEquipment } from '../../types/index.js';

export const LaboratoryModule: React.FC = () => {
  const { currentUser, isRole } = useAuth();
  const { 
    laboratories, 
    equipment, 
    reservations, 
    createReservation, 
    updateReservationStatus 
  } = useCampusData();

  const [activeTabSub, setActiveTabSub] = useState<'equipment' | 'reservations' | 'ai_matcher'>('equipment');
  const [selectedLabId, setSelectedLabId] = useState<string>('all');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedEquipForBooking, setSelectedEquipForBooking] = useState<LabEquipment | null>(null);

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    date: '2026-10-15',
    startTime: '10:00',
    endTime: '12:00',
    purpose: ''
  });
  const [bookingStatusMsg, setBookingStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // AI Matcher Form State
  const [aiRequirement, setAiRequirement] = useState({
    need: 'GPU Deep Learning Node with 80GB VRAM',
    studentCount: 1,
    durationHours: 4
  });
  const [aiMatchResult, setAiMatchResult] = useState<string | null>(null);

  const filteredEquipment = equipment.filter(e => {
    if (selectedLabId !== 'all' && e.labId !== selectedLabId) return false;
    return true;
  });

  const handleOpenBooking = (equip: LabEquipment) => {
    setSelectedEquipForBooking(equip);
    setBookingStatusMsg(null);
    setBookingModalOpen(true);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipForBooking) return;

    const res = await createReservation({
      labId: selectedEquipForBooking.labId,
      equipmentId: selectedEquipForBooking.id,
      date: bookingForm.date,
      startTime: bookingForm.startTime,
      endTime: bookingForm.endTime,
      purpose: bookingForm.purpose
    });

    if (res.success) {
      setBookingStatusMsg({ type: 'success', text: res.message });
      setTimeout(() => {
        setBookingModalOpen(false);
        setBookingStatusMsg(null);
      }, 1800);
    } else {
      setBookingStatusMsg({ type: 'error', text: res.message });
    }
  };

  const runAiMatcher = () => {
    if (aiRequirement.need.toLowerCase().includes('gpu') || aiRequirement.need.toLowerCase().includes('model')) {
      setAiMatchResult('Recommendation: NVIDIA DGX H100 Node #4 in High-Performance AI Cluster (B-008). 8x 80GB SXM5 VRAM available with NVLink. Slot recommended: Tomorrow 14:00 - 18:00.');
    } else if (aiRequirement.need.toLowerCase().includes('sem') || aiRequirement.need.toLowerCase().includes('microscope') || aiRequirement.need.toLowerCase().includes('nano')) {
      setAiMatchResult('Recommendation: FEI Nova NanoSEM 450 in Cleanroom L-101. 1.0 nm resolution at 15kV. Requires Gowning Certification and faculty signoff.');
    } else {
      setAiMatchResult('Recommendation: Autonomous Robotics Flight Bay A-012 with Vicon Vero 16-Camera Optical Tracking.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Smart Laboratory &amp; Equipment Booking
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Double-Booking Prevention Engine
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Browse high-tech scientific apparatus, check real-time availability, and reserve certified research slots.
          </p>
        </div>

        {/* Tab Controls (Zero-pill button segmented controls) */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTabSub('equipment')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTabSub === 'equipment' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            Equipment Inventory
          </button>
          <button
            onClick={() => setActiveTabSub('reservations')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTabSub === 'reservations' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            Active Reservations ({reservations.length})
          </button>
          <button
            onClick={() => setActiveTabSub('ai_matcher')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTabSub === 'ai_matcher' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            AI Apparatus Matcher
          </button>
        </div>
      </div>

      {activeTabSub === 'equipment' && (
        <>
          {/* Lab Selector Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedLabId('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                selectedLabId === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Research Facilities
            </button>
            {laboratories.map(lab => (
              <button
                key={lab.id}
                onClick={() => setSelectedLabId(lab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedLabId === lab.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {lab.name}
              </button>
            ))}
          </div>

          {/* Equipment Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEquipment.map(eq => {
              const isAvailable = eq.status === 'available';
              const isFaulty = eq.status === 'faulty';

              return (
                <div
                  key={eq.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top title */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {eq.category}
                        </span>
                        <h3 className="text-sm font-bold text-white mt-1.5">{eq.name}</h3>
                        <p className="text-[11px] text-cyan-300/80 mt-0.5">{eq.labName}</p>
                      </div>

                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                        isAvailable 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : isFaulty
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {eq.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Spec sheet */}
                    <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Technical Specifications:
                      </span>
                      {Object.entries(eq.specs).map(([key, val]) => (
                        <div key={key} className="flex justify-between text-slate-300">
                          <span className="text-slate-400">{key}:</span>
                          <span className="font-mono text-white">{val}</span>
                        </div>
                      ))}
                    </div>

                    {/* Maintenance meta */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800">
                      <span>Serial: {eq.serialNumber}</span>
                      <span>Next Service: {eq.maintenanceDue || 'Routine'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    {eq.restricted ? (
                      <span className="text-[11px] text-amber-400 flex items-center gap-1 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" /> Approval Required
                      </span>
                    ) : (
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Instant Booking
                      </span>
                    )}

                    <button
                      onClick={() => handleOpenBooking(eq)}
                      disabled={isFaulty}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      {isFaulty ? 'Maintenance Required' : 'Book Time Slot'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTabSub === 'reservations' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-3">Reservation Log &amp; Approval Queue</h3>
            <div className="divide-y divide-slate-800">
              {reservations.map(res => (
                <div key={res.id} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{res.equipmentName || res.labName}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                        res.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {res.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{res.purpose}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Date: {res.date} ({res.startTime} - {res.endTime}) · Reserved by: {res.userName} ({res.userRole})
                    </p>
                  </div>

                  {/* Lab Admin Approval Controls */}
                  {res.status === 'pending_approval' && isRole(['lab_admin', 'campus_admin']) && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateReservationStatus(res.id, 'confirmed')}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                      >
                        Approve Slot
                      </button>
                      <button
                        onClick={() => updateReservationStatus(res.id, 'rejected', 'Capacity limit reached')}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-rose-900 text-slate-300 hover:text-white font-medium text-xs transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTabSub === 'ai_matcher' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 max-w-2xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">AI Research Apparatus Recommender</h3>
          </div>
          <p className="text-xs text-slate-400">
            Tell the campus assistant your experimental requirements or compute workloads. The model matches verified equipment specs with minimum downtime.
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Required Capability or Instrument</label>
              <input
                type="text"
                value={aiRequirement.need}
                onChange={e => setAiRequirement({ ...aiRequirement, need: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
              />
            </div>

            <button
              onClick={runAiMatcher}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors"
            >
              Analyze &amp; Find Equipment
            </button>
          </div>

          {aiMatchResult && (
            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs text-cyan-200 leading-relaxed mt-4 animate-in fade-in">
              <span className="font-bold text-white block mb-1">AI Recommendation:</span>
              {aiMatchResult}
            </div>
          )}
        </div>
      )}

      {/* Booking Modal */}
      {bookingModalOpen && selectedEquipForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Reserve Research Equipment</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedEquipForBooking.name}</p>
              </div>
              <button onClick={() => setBookingModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {bookingStatusMsg ? (
              <div className={`p-4 rounded-xl text-xs font-semibold ${
                bookingStatusMsg.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {bookingStatusMsg.text}
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Reservation Date</label>
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Start Time</label>
                    <input
                      type="time"
                      value={bookingForm.startTime}
                      onChange={e => setBookingForm({ ...bookingForm, startTime: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">End Time</label>
                    <input
                      type="time"
                      value={bookingForm.endTime}
                      onChange={e => setBookingForm({ ...bookingForm, endTime: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Project Objective / Purpose</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of research experiment..."
                    value={bookingForm.purpose}
                    onChange={e => setBookingForm({ ...bookingForm, purpose: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

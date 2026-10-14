import React, { useState } from 'react';
import { 
  AlertCircle, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Layers, 
  MessageSquare, 
  Wrench, 
  Filter, 
  Plus, 
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useCampusData } from '../../context/CampusDataContext.js';
import { Grievance, GrievanceCategory, GrievancePriority, GrievanceStatus } from '../../types/index.js';

export const GrievanceModule: React.FC = () => {
  const { currentUser, isRole } = useAuth();
  const { grievances, submitGrievance, updateGrievanceStatus } = useCampusData();

  const [activeTabSub, setActiveTabSub] = useState<'my_tickets' | 'submit' | 'staff_board'>('my_tickets');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<Grievance | null>(null);

  // New Ticket Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<GrievanceCategory>('facilities');
  const [newLocation, setNewLocation] = useState('Computing & AI Complex, Room B-305');
  const [newPriority, setNewPriority] = useState<GrievancePriority>('medium');
  const [aiAnalysis, setAiAnalysis] = useState<{
    suggestedCategory?: string;
    suggestedPriority?: string;
    assignedDepartment?: string;
    isDuplicate?: boolean;
    duplicateClusterId?: string;
    explanation?: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // Staff Update State
  const [staffNoteInput, setStaffNoteInput] = useState('');

  const filteredTickets = grievances.filter(g => {
    if (selectedCategory !== 'all' && g.category !== selectedCategory) return false;
    if (activeTabSub === 'my_tickets' && !isRole(['campus_admin', 'faculty'])) {
      // Students see tickets they filed or relevant to them
      return g.studentId === currentUser.idNumber || g.studentEmail === currentUser.email;
    }
    return true;
  });

  const analyzeWithAI = async () => {
    if (!newTitle && !newDesc) return;
    try {
      const res = await fetch('/api/gemini/classify-complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          location: newLocation
        })
      });
      const data = await res.json();
      setAiAnalysis(data);
      if (data.suggestedCategory) setNewCategory(data.suggestedCategory as GrievanceCategory);
      if (data.suggestedPriority) setNewPriority(data.suggestedPriority as GrievancePriority);
    } catch (err) {
      console.warn('AI analysis failed:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await submitGrievance({
      title: newTitle,
      description: newDesc,
      category: newCategory,
      location: newLocation,
      priority: newPriority
    });
    setSubmitting(false);
    if (res.success && res.referenceNo) {
      setSubmittedRef(res.referenceNo);
      setNewTitle('');
      setNewDesc('');
      setAiAnalysis(null);
    }
  };

  const handleUpdateStatus = async (ticketId: string, status: GrievanceStatus) => {
    await updateGrievanceStatus(ticketId, {
      status,
      staffNotes: staffNoteInput ? `[${currentUser.name}]: ${staffNoteInput}` : undefined
    });
    setStaffNoteInput('');
    if (selectedTicket) {
      setSelectedTicket({ ...selectedTicket, status });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              AI Student Grievance &amp; Facilities Management
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Duplicate Detection Active
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Autonomous ticket triage, severity prediction, SLA tracking, and multi-department work order routing.
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTabSub('my_tickets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTabSub === 'my_tickets' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ticket Registry ({filteredTickets.length})
          </button>
          <button
            onClick={() => {
              setActiveTabSub('submit');
              setSubmittedRef(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTabSub === 'submit' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            File Grievance
          </button>
        </div>
      </div>

      {activeTabSub === 'submit' && (
        <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          {submittedRef ? (
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Grievance Ticket Successfully Created</h3>
              <p className="text-xs text-slate-400">
                Your ticket reference number is <strong className="font-mono text-cyan-300">{submittedRef}</strong>.
                Authorized technicians have been dispatched in accordance with campus SLA.
              </p>
              <button
                onClick={() => setActiveTabSub('my_tickets')}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
              >
                Track in My Tickets
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Issue Title / Summary</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  onBlur={analyzeWithAI}
                  placeholder="e.g. Broken laser projector bulb flickering in Room B-305"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  onBlur={analyzeWithAI}
                  placeholder="Describe the defect, safety implications, or class interruption..."
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  >
                    <option value="facilities">Classroom Facilities &amp; AV</option>
                    <option value="electrical_water">Electrical, Plumbing &amp; Water</option>
                    <option value="connectivity">Internet &amp; Campus Wi-Fi</option>
                    <option value="transport">Bus Fleet &amp; Transport</option>
                    <option value="lab_equipment">Laboratory Equipment</option>
                    <option value="cleanliness">Campus Cleanliness</option>
                    <option value="hostel">Hostel &amp; Dining</option>
                    <option value="other">Other Campus Services</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Location / Classroom</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                    required
                  />
                </div>
              </div>

              {/* AI Auto-Triage Feedback Card */}
              {aiAnalysis && (
                <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 ${
                  aiAnalysis.isDuplicate ? 'bg-amber-950/30 border-amber-500/40 text-amber-200' : 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>AI Grievance Classification:</span>
                  </div>
                  <p>{aiAnalysis.explanation}</p>
                  <div className="flex items-center gap-2 pt-1 font-mono text-[11px]">
                    <span>Assigned: <strong>{aiAnalysis.assignedDepartment}</strong></span>
                    <span>·</span>
                    <span>Priority: <strong className="uppercase">{aiAnalysis.suggestedPriority}</strong></span>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-cyan-950/40"
                >
                  {submitting ? 'Submitting...' : 'Submit Grievance Ticket'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {activeTabSub === 'my_tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets List */}
          <div className="lg:col-span-2 space-y-3">
            {filteredTickets.map(ticket => {
              const isSelected = selectedTicket?.id === ticket.id;

              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-400 shadow-md shadow-cyan-950/30'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                        {ticket.referenceNo}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                        ticket.priority === 'urgent' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {ticket.priority}
                      </span>
                      {ticket.isDuplicate && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                          Clustered
                        </span>
                      )}
                    </div>

                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      ticket.status === 'resolved' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : ticket.status === 'in_progress'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mt-2">{ticket.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">{ticket.description}</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-800/80">
                    <span>{ticket.location}</span>
                    <span>Dept: {ticket.assignedDepartment}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ticket Inspection & Staff Workflow Panel */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            {selectedTicket ? (
              <div className="space-y-4 text-xs">
                <div className="border-b border-slate-800 pb-3">
                  <span className="font-mono text-cyan-400 font-bold">{selectedTicket.referenceNo}</span>
                  <h3 className="text-sm font-bold text-white mt-1">{selectedTicket.title}</h3>
                  <p className="text-slate-400 mt-1">{selectedTicket.description}</p>
                </div>

                <div className="space-y-2 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reporter:</span>
                    <span className="font-semibold text-white">{selectedTicket.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span>{selectedTicket.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Department:</span>
                    <span className="text-cyan-300 font-medium">{selectedTicket.assignedDepartment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reported At:</span>
                    <span>{new Date(selectedTicket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {selectedTicket.staffNotes && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Staff Resolution Notes:
                    </span>
                    <p className="text-cyan-200">{selectedTicket.staffNotes}</p>
                  </div>
                )}

                {/* Staff Status Change Actions */}
                {isRole(['campus_admin', 'faculty']) && (
                  <div className="pt-3 border-t border-slate-800 space-y-2.5">
                    <span className="font-bold text-white block">Update Ticket Status &amp; Notes</span>
                    <input
                      type="text"
                      placeholder="Add resolution or technician note..."
                      value={staffNoteInput}
                      onChange={e => setStaffNoteInput(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                    />

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateStatus(selectedTicket.id, 'in_progress')}
                        className="flex-1 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold"
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedTicket.id, 'resolved')}
                        className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-30 text-cyan-400" />
                <p className="text-xs">Select any ticket to view detailed staff notes, resolution history, and SLAs.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

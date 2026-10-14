import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Plus, 
  Clock, 
  MapPin, 
  Users, 
  Monitor, 
  Accessibility, 
  Filter,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useCampusData } from '../../context/CampusDataContext.js';
import { TimetableEntry } from '../../types/index.js';

export const TimetableModule: React.FC = () => {
  const { currentUser } = useAuth();
  const { timetables, rooms, resolveTimetableConflict } = useCampusData();

  const [selectedDay, setSelectedDay] = useState<number>(1); // 1 = Monday
  const [filterConflictOnly, setFilterConflictOnly] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New course form state
  const [newCourse, setNewCourse] = useState({
    courseCode: '',
    courseName: '',
    facultyName: currentUser.name,
    roomId: rooms[0]?.id || '',
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '10:30',
    studentCount: 45,
    department: 'Computer Science',
    requiresProjector: true,
    requiresComputers: false
  });

  const days = [
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' }
  ];

  const displayedTimetables = timetables.filter(t => {
    if (filterConflictOnly && !t.isConflict) return false;
    return t.dayOfWeek === selectedDay;
  });

  const conflictCount = timetables.filter(t => t.isConflict).length;

  const handleApplyResolution = (t: TimetableEntry) => {
    if (t.alternativeSuggestion) {
      resolveTimetableConflict(t.id, t.alternativeSuggestion.roomId, t.alternativeSuggestion.roomName);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Smart Timetable & Conflict Resolution
            </h1>
            {conflictCount > 0 ? (
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {conflictCount} Double-Booking Detected
              </span>
            ) : (
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Schedules Validated
              </span>
            )}
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Autonomous collision detection, wheelchair accessibility verification, and AI room reassignment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterConflictOnly(!filterConflictOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              filterConflictOnly
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                : 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-300'
            }`}
          >
            {filterConflictOnly ? 'Showing Conflicts Only' : 'Filter Conflicts'}
          </button>
        </div>
      </div>

      {/* Day Selector (Zero-Pill Segmented Buttons) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {days.map(d => (
          <button
            key={d.id}
            onClick={() => setSelectedDay(d.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedDay === d.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      {/* Conflict Alert Banner if any conflict on current day */}
      {displayedTimetables.some(t => t.isConflict) && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">Double-booking detected on {days.find(d => d.id === selectedDay)?.name}</p>
              <p className="text-rose-300/80 text-[11px] mt-0.5">Two courses scheduled concurrently in the same computer lab. Review AI recommendation below.</p>
            </div>
          </div>
        </div>
      )}

      {/* Timetable Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedTimetables.map(entry => {
          const roomObj = rooms.find(r => r.id === entry.roomId);

          return (
            <div
              key={entry.id}
              className={`p-5 rounded-2xl border transition-all ${
                entry.isConflict
                  ? 'bg-gradient-to-br from-rose-950/30 via-slate-900 to-slate-900 border-rose-500/50 shadow-lg shadow-rose-950/20 ring-1 ring-rose-500/30'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                      {entry.courseCode}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{entry.department}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1.5">{entry.courseName}</h3>
                </div>

                {entry.isConflict && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Conflict
                  </span>
                )}
              </div>

              {/* Details List */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{entry.startTime} - {entry.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Users className="w-3.5 h-3.5 text-teal-400" />
                  <span>{entry.studentCount} Students</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 col-span-2">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span className="truncate">{entry.roomName}</span>
                </div>
              </div>

              {/* Accessibility & Equipment Badges */}
              <div className="flex items-center gap-2 mt-3 pt-2 text-[11px] text-slate-400">
                {entry.requiresProjector && (
                  <span className="flex items-center gap-1">
                    <Monitor className="w-3 h-3 text-cyan-400" /> Projector
                  </span>
                )}
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Accessibility className="w-3 h-3 text-emerald-400" /> Wheelchair Verified
                </span>
                <span>·</span>
                <span className="text-slate-400">{entry.facultyName}</span>
              </div>

              {/* Conflict Callout & AI Recommendation Box */}
              {entry.isConflict && entry.alternativeSuggestion && (
                <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-rose-400 text-xs font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{entry.conflictReason}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs">
                    <div className="flex items-center gap-1.5 text-cyan-300 font-bold mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>AI Reassignment Recommendation:</span>
                    </div>
                    <p className="text-white font-semibold">{entry.alternativeSuggestion.roomName}</p>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      {entry.alternativeSuggestion.reason}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => handleApplyResolution(entry)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept &amp; Reassign Room</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

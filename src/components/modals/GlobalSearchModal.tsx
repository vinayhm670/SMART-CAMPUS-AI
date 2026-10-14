import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, BusFront, FlaskConical, AlertCircle, BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { useCampusData } from '../../context/CampusDataContext.js';
import { ActiveTab } from '../layout/Sidebar.js';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveTab) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const { rooms, busRoutes, buses, laboratories, equipment, grievances, documents, announcements } = useCampusData();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredRooms = q ? rooms.filter(r => r.name.toLowerCase().includes(q) || r.roomNumber.toLowerCase().includes(q) || r.buildingName.toLowerCase().includes(q)).slice(0, 3) : [];
  const filteredBuses = q ? buses.filter(b => b.busNumber.toLowerCase().includes(q) || b.routeName.toLowerCase().includes(q) || b.nextStopName.toLowerCase().includes(q)).slice(0, 3) : [];
  const filteredLabs = q ? laboratories.filter(l => l.name.toLowerCase().includes(q) || l.department.toLowerCase().includes(q)).slice(0, 3) : [];
  const filteredEquipment = q ? equipment.filter(e => e.name.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)).slice(0, 3) : [];
  const filteredGrievances = q ? grievances.filter(g => g.referenceNo.toLowerCase().includes(q) || g.title.toLowerCase().includes(q) || g.location.toLowerCase().includes(q)).slice(0, 3) : [];
  const filteredDocs = q ? documents.filter(d => d.title.toLowerCase().includes(q) || d.summary.toLowerCase().includes(q)).slice(0, 3) : [];

  const totalResults = filteredRooms.length + filteredBuses.length + filteredLabs.length + filteredEquipment.length + filteredGrievances.length + filteredDocs.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-900/90">
          <Search className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a room (e.g. A-101), bus route, lab, grievance ID, or policy..."
            className="flex-1 bg-transparent text-sm md:text-base text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white rounded">
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onClose}
            className="px-2 py-1 text-xs rounded bg-slate-800 text-slate-400 hover:text-white border border-slate-700 font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!q && (
            <div className="py-8 text-center text-slate-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40 text-cyan-400" />
              <p className="text-sm font-medium text-slate-400">Search authorized campus records</p>
              <p className="text-xs text-slate-500 mt-1">Try typing "B-101", "Route 1", "GPU", "GRV-2026-1041", or "Policy"</p>
            </div>
          )}

          {q && totalResults === 0 && (
            <div className="py-8 text-center text-slate-400">
              <p className="text-sm">No campus records matched "{query}"</p>
              <p className="text-xs text-slate-500 mt-1">Try another keyword or check spelling.</p>
            </div>
          )}

          {/* Rooms */}
          {filteredRooms.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Classrooms & Halls
              </div>
              <div className="space-y-1">
                {filteredRooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => {
                      onNavigate('occupancy');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors text-left group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">{room.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">{room.roomNumber}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${room.occupancyStatus === 'available' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                          {room.occupancyStatus}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{room.buildingName} · Floor {room.floor} · Cap: {room.capacity}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Transit Buses */}
          {filteredBuses.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center gap-1.5">
                <BusFront className="w-3.5 h-3.5 text-teal-400" /> College Buses & Routes
              </div>
              <div className="space-y-1">
                {filteredBuses.map(bus => (
                  <button
                    key={bus.id}
                    onClick={() => {
                      onNavigate('transport');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors text-left group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">{bus.routeName}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono">{bus.busNumber}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Next stop: {bus.nextStopName} · Delay: {bus.delayMinutes}m · ETA: {bus.estimatedArrivalMins}m</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Laboratories & Equipment */}
          {(filteredLabs.length > 0 || filteredEquipment.length > 0) && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-indigo-400" /> Research Labs & Equipment
              </div>
              <div className="space-y-1">
                {filteredLabs.map(lab => (
                  <button
                    key={lab.id}
                    onClick={() => {
                      onNavigate('laboratories');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors text-left group"
                  >
                    <div>
                      <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">{lab.name}</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">{lab.department} · {lab.roomNumber} · In-charge: {lab.inChargeName}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
                {filteredEquipment.map(eq => (
                  <button
                    key={eq.id}
                    onClick={() => {
                      onNavigate('laboratories');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors text-left group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">{eq.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">{eq.serialNumber}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{eq.labName} · Status: {eq.status}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Grievances */}
          {filteredGrievances.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Student Grievances
              </div>
              <div className="space-y-1">
                {filteredGrievances.map(g => (
                  <button
                    key={g.id}
                    onClick={() => {
                      onNavigate('grievances');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors text-left group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">{g.referenceNo}</span>
                        <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">{g.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{g.location} · Status: {g.status} · Priority: {g.priority}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Documents & Policies */}
          {filteredDocs.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-purple-400" /> Knowledge Hub Policies
              </div>
              <div className="space-y-1">
                {filteredDocs.map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      onNavigate('knowledge_hub');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors text-left group"
                  >
                    <div>
                      <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">{doc.title}</span>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{doc.summary}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Layers, 
  MapPin, 
  Accessibility, 
  Zap, 
  Flame, 
  ShieldAlert, 
  CheckCircle2, 
  DoorOpen, 
  Users, 
  Eye, 
  Info 
} from 'lucide-react';
import { useCampusData } from '../../context/CampusDataContext.js';
import { Building, Room } from '../../types/index.js';

export const CampusDigitalTwin: React.FC = () => {
  const { buildings, rooms } = useCampusData();

  const [activeLayer, setActiveLayer] = useState<'occupancy' | 'accessibility' | 'energy' | 'safety'>('occupancy');
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('bld_a');

  const selectedBuilding = buildings.find(b => b.id === selectedBuildingId) || buildings[0];
  const buildingRooms = rooms.filter(r => r.buildingId === selectedBuildingId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Campus Digital Twin (2D Spatial View)
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
              Vector Map 2.0
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Spatial representation of physical facilities, real-time sensor layers, and accessibility pathways.
          </p>
        </div>

        {/* Layer Switcher (Zero-pill button segmented controls) */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveLayer('occupancy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeLayer === 'occupancy' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Occupancy
          </button>
          <button
            onClick={() => setActiveLayer('accessibility')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeLayer === 'accessibility' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Accessibility className="w-3.5 h-3.5" />
            Accessible Routes
          </button>
          <button
            onClick={() => setActiveLayer('energy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeLayer === 'energy' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Energy Heatmap
          </button>
          <button
            onClick={() => setActiveLayer('safety')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeLayer === 'safety' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Evacuation &amp; Safety
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Campus Spatial Canvas + Building Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive 2D Campus Layout */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Apex Institute Master Plan</h3>
              <p className="text-xs text-slate-400">Click any facility polygon to inspect floor telemetry</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>Layer: <strong className="capitalize text-white">{activeLayer}</strong></span>
            </div>
          </div>

          {/* SVG Campus Floorplan / Masterplan */}
          <div className="relative w-full h-84 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-4">
            <svg viewBox="0 0 700 380" className="w-full h-full select-none">
              {/* Walkways */}
              <path d="M 120 180 L 580 180" stroke="#1e293b" strokeWidth="24" strokeLinecap="round" />
              <path d="M 350 70 L 350 320" stroke="#1e293b" strokeWidth="24" strokeLinecap="round" />

              {/* Accessible Ramp / Elevator Overlays */}
              {activeLayer === 'accessibility' && (
                <>
                  <path d="M 120 180 L 580 180" stroke="#10b981" strokeWidth="6" strokeDasharray="6 4" />
                  <path d="M 350 70 L 350 320" stroke="#10b981" strokeWidth="6" strokeDasharray="6 4" />
                </>
              )}

              {/* Buildings */}

              {/* Block A - Engineering */}
              <g 
                onClick={() => setSelectedBuildingId('bld_a')}
                className="cursor-pointer group"
              >
                <rect 
                  x="80" y="60" width="160" height="90" rx="10" 
                  fill={selectedBuildingId === 'bld_a' ? '#0e7490' : '#0f172a'} 
                  stroke={activeLayer === 'energy' ? '#f59e0b' : '#38bdf8'} 
                  strokeWidth="2" 
                />
                <text x="160" y="100" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">
                  Block A: Engineering
                </text>
                <text x="160" y="120" fill="#94a3b8" fontSize="10" textAnchor="middle">
                  {activeLayer === 'energy' ? '142.8 kW' : '12 Classrooms · 3 Floors'}
                </text>
              </g>

              {/* Block B - Computing */}
              <g 
                onClick={() => setSelectedBuildingId('bld_b')}
                className="cursor-pointer group"
              >
                <rect 
                  x="460" y="60" width="160" height="90" rx="10" 
                  fill={selectedBuildingId === 'bld_b' ? '#0e7490' : '#0f172a'} 
                  stroke={activeLayer === 'energy' ? '#ef4444' : '#22d3ee'} 
                  strokeWidth="2" 
                />
                <text x="540" y="100" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">
                  Block B: Computing &amp; AI
                </text>
                <text x="540" y="120" fill="#94a3b8" fontSize="10" textAnchor="middle">
                  {activeLayer === 'energy' ? '218.4 kW (High Load)' : '16 Labs &amp; Halls · 4 Floors'}
                </text>
              </g>

              {/* Block C - Humanities */}
              <g 
                onClick={() => setSelectedBuildingId('bld_c')}
                className="cursor-pointer group"
              >
                <rect 
                  x="80" y="230" width="160" height="90" rx="10" 
                  fill={selectedBuildingId === 'bld_c' ? '#0e7490' : '#0f172a'} 
                  stroke={activeLayer === 'accessibility' ? '#f43f5e' : '#a855f7'} 
                  strokeWidth="2" 
                />
                <text x="160" y="270" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">
                  Block C: Humanities
                </text>
                <text x="160" y="290" fill="#94a3b8" fontSize="10" textAnchor="middle">
                  {activeLayer === 'accessibility' ? 'Stairs only to Fl 2 (No Elevator)' : '10 Lecture Rooms'}
                </text>
              </g>

              {/* Block L - Research Labs */}
              <g 
                onClick={() => setSelectedBuildingId('bld_l')}
                className="cursor-pointer group"
              >
                <rect 
                  x="460" y="230" width="160" height="90" rx="10" 
                  fill={selectedBuildingId === 'bld_l' ? '#0e7490' : '#0f172a'} 
                  stroke={activeLayer === 'energy' ? '#f59e0b' : '#6366f1'} 
                  strokeWidth="2" 
                />
                <text x="540" y="270" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">
                  Block L: Central Labs
                </text>
                <text x="540" y="290" fill="#94a3b8" fontSize="10" textAnchor="middle">
                  {activeLayer === 'energy' ? '310.5 kW' : '8 Cleanrooms &amp; Testbeds'}
                </text>
              </g>

              {/* Central Plaza / Student Commons */}
              <g 
                onClick={() => setSelectedBuildingId('bld_s')}
                className="cursor-pointer"
              >
                <circle 
                  cx="350" cy="180" r="45" 
                  fill={selectedBuildingId === 'bld_s' ? '#0e7490' : '#1e293b'} 
                  stroke="#38bdf8" 
                  strokeWidth="2" 
                />
                <text x="350" y="176" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  Commons &amp;
                </text>
                <text x="350" y="190" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  Registrar
                </text>
              </g>

              {/* Evacuation Assembly Points */}
              {activeLayer === 'safety' && (
                <>
                  <g transform="translate(350, 260)">
                    <circle cx="0" cy="0" r="14" fill="#10b981" />
                    <text x="0" y="4" fill="#020617" fontSize="8" fontWeight="bold" textAnchor="middle">SAFE</text>
                  </g>
                  <text x="350" y="285" fill="#34d399" fontSize="10" textAnchor="middle" fontWeight="bold">
                    Assembly Point #1 (Central Lawn)
                  </text>
                </>
              )}
            </svg>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Selected: <strong className="text-white">{selectedBuilding.name} ({selectedBuilding.code})</strong></span>
            <span>Click any building on the map above to inspect rooms</span>
          </div>
        </div>

        {/* Selected Building Floor Telemetry Dossier */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
              {selectedBuilding.code}
            </span>
            <h3 className="text-base font-bold text-white mt-1">{selectedBuilding.name}</h3>
            <p className="text-xs text-slate-400">{selectedBuilding.floors} Floors · {selectedBuilding.totalRooms} Rooms</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Power Demand</span>
              <span className="text-base font-bold text-cyan-300 font-mono mt-0.5 block">
                {selectedBuilding.energyConsumptionKw} kW
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Air Quality</span>
              <span className="text-base font-bold text-emerald-400 font-mono mt-0.5 block">
                AQI {selectedBuilding.aqi}
              </span>
            </div>
          </div>

          {/* Rooms in this building */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-300 block">Rooms &amp; Facilities on Record:</span>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
              {buildingRooms.map(room => (
                <div key={room.id} className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{room.name}</span>
                    <span className="font-mono text-cyan-300">{room.roomNumber}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>Floor {room.floor} · Cap: {room.capacity}</span>
                    <span className="capitalize">{room.occupancyStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

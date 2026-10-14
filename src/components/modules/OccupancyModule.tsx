import React, { useState } from 'react';
import { 
  Building2, 
  DoorOpen, 
  Users, 
  Thermometer, 
  Wind, 
  Zap, 
  Radio, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  Filter, 
  Cpu, 
  ArrowUpRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { useCampusData } from '../../context/CampusDataContext.js';
import { RoomOccupancyStatus } from '../../types/index.js';

export const OccupancyModule: React.FC = () => {
  const { buildings, rooms } = useCampusData();

  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [simulationActive, setSimulationActive] = useState<boolean>(true);
  const [activeTabSub, setActiveTabSub] = useState<'rooms' | 'iot_api'>('rooms');

  const filteredRooms = rooms.filter(r => {
    if (selectedBuildingId !== 'all' && r.buildingId !== selectedBuildingId) return false;
    if (statusFilter !== 'all' && r.occupancyStatus !== statusFilter) return false;
    return true;
  });

  const getStatusBadge = (status: RoomOccupancyStatus) => {
    switch (status) {
      case 'available':
        return <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">Available</span>;
      case 'occupied':
        return <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">Occupied</span>;
      case 'reserved':
        return <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">Reserved</span>;
      case 'maintenance':
        return <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">Maintenance</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              AI Classroom Occupancy &amp; IoT Telemetry
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              ESP32 PIR Array
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Privacy-preserving aggregate occupancy counts, thermal comfort indices, and underutilized space detection.
          </p>
        </div>

        {/* Sub-view toggle & IoT Simulation indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setActiveTabSub('rooms')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTabSub === 'rooms' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Floor &amp; Room Grid
            </button>
            <button
              onClick={() => setActiveTabSub('iot_api')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTabSub === 'iot_api' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              ESP32 / MQTT Telemetry API
            </button>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400">Simulation Mode:</span>
            <span className="font-bold text-amber-400 font-mono">DEMO DATA</span>
          </div>
        </div>
      </div>

      {activeTabSub === 'iot_api' ? (
        /* Extensible IoT Ingestion Interface */
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Extensible IoT Sensor Telemetry Specification</h3>
              <p className="text-xs text-slate-400">RESTful ingestion endpoint for physical ESP32, PIR counters, and MQTT telemetry bridges.</p>
            </div>
          </div>

          <div className="space-y-4 text-xs text-slate-300">
            <p>
              Smart Campus AI accepts HTTP POST telemetry payloads directly from microcontrollers installed in lecture halls.
              Payload format:
            </p>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto">
{`POST /api/iot/telemetry
Content-Type: application/json
Authorization: Bearer <CAMPUS_SENSOR_TOKEN>

{
  "sensorId": "ESP32-PIR-A101",
  "roomId": "rm_a101",
  "occupancyCount": 94,
  "powerKw": 18.2,
  "tempC": 22.0,
  "co2Ppm": 540
}`}
            </pre>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
              <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Privacy-Preserving Sensor Guarantee</p>
                <p className="text-slate-400 mt-1">
                  By university ethics policy, smart sensors record only aggregate count approximations via infrared thermal breaks and PIR pulses. 
                  No video surveillance or facial biometric recognition is installed.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Building & Status Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedBuildingId('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  selectedBuildingId === 'all'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All Buildings
              </button>
              {buildings.map(b => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBuildingId(b.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    selectedBuildingId === b.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
              {['all', 'available', 'occupied', 'maintenance'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                    statusFilter === status
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Underutilized Classroom Alert Banner */}
          {filteredRooms.some(r => r.id === 'rm_c101') && (
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between gap-3 text-xs text-amber-200">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>
                  <strong>Underutilized Room Detected:</strong> Philosophy Hall (C-101) currently holds only 15 students in a 90-seat hall (16% utilization). Consider reassigning to Seminar A-102 to conserve HVAC power.
                </span>
              </div>
            </div>
          )}

          {/* Room Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map(room => {
              const occupancyPct = Math.round((room.currentOccupancy / room.capacity) * 100);

              return (
                <div
                  key={room.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-mono font-bold text-cyan-400">{room.roomNumber}</span>
                        <h3 className="text-sm font-bold text-white mt-0.5">{room.name}</h3>
                        <p className="text-[11px] text-slate-400">{room.buildingName} · Floor {room.floor}</p>
                      </div>
                      {getStatusBadge(room.occupancyStatus)}
                    </div>

                    {/* Occupancy Progress Bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-400">Occupancy</span>
                        <span className="font-bold text-white font-mono">
                          {room.currentOccupancy} / {room.capacity} ({occupancyPct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            occupancyPct > 90
                              ? 'bg-rose-500'
                              : occupancyPct > 60
                              ? 'bg-cyan-500'
                              : 'bg-teal-500'
                          }`}
                          style={{ width: `${occupancyPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Environmental Telemetry */}
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                        <span>{room.tempC}°C</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Wind className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{room.co2Ppm} ppm</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-teal-400" />
                        <span>{room.powerKw} kW</span>
                      </div>
                    </div>
                  </div>

                  {/* Sensor status footer */}
                  <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>ID: {room.sensorId}</span>
                    <span>{room.isSimulatedSensor ? 'Simulated Telemetry' : 'Genuine Hardware Feed'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

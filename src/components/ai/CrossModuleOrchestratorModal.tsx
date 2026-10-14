import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle, 
  Building2, 
  CalendarClock, 
  BusFront, 
  FlaskConical, 
  AlertCircle, 
  RefreshCw,
  Zap,
  Check
} from 'lucide-react';
import { useCampusData } from '../../context/CampusDataContext.js';
import { ActiveTab } from '../layout/Sidebar.js';

interface CrossModuleOrchestratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveTab) => void;
}

export const CrossModuleOrchestratorModal: React.FC<CrossModuleOrchestratorModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { runOrchestrationScenario } = useCampusData();
  const [selectedScenario, setSelectedScenario] = useState<string>('classroom_maintenance');
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<{
    success: boolean;
    workflowTitle: string;
    stepsExecuted: { module: string; action: string; status: string }[];
  } | null>(null);

  if (!isOpen) return null;

  const scenarios = [
    {
      id: 'classroom_maintenance',
      title: 'Classroom Maintenance Outage & Academic Reassignment',
      tagline: 'Timetable ⇄ IoT Sensors ⇄ Facilities ⇄ Student Notifications',
      description: 'Room A-201 experiences an unexpected HVAC thermal runaway (31.2°C). AI reassigns the scheduled ME-302 lecture to vacant Room A-102, creates an urgent facilities ticket, and notifies all 52 students.',
      primaryIcon: CalendarClock,
      accentColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/30'
    },
    {
      id: 'transit_delay',
      title: 'Severe Bus Transit Gridlock & Academic Coordination',
      tagline: 'Fleet GPS ⇄ Student Rosters ⇄ Academic Exceptions ⇄ EV Shuttles',
      description: 'Bus #03 encounters unexpected East Ring road flyover gridlock (+26 min delay). System identifies 39 students aboard, notifies course instructors of excused late arrivals, and deploys backup Electric Shuttle #04.',
      primaryIcon: BusFront,
      accentColor: 'border-amber-500/40 text-amber-300 bg-amber-950/30'
    }
  ];

  const handleExecute = async () => {
    setRunning(true);
    setResults(null);
    try {
      const res = await runOrchestrationScenario(selectedScenario);
      setResults(res);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-950/50">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-bold text-white">Cross-Module AI Orchestrator</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-bold tracking-wide">
                  SIGNATURE ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Execute autonomous multi-department campus cascades in real-time
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-6">
          {/* Scenario Selection Grid */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 block">
              1. Select Real-World Cross-Module Incident Scenario
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {scenarios.map(s => {
                const Icon = s.primaryIcon;
                const isSelected = selectedScenario === s.id;

                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      setSelectedScenario(s.id);
                      setResults(null);
                    }}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800/90 border-cyan-400 shadow-md shadow-cyan-950/30 ring-1 ring-cyan-400/30'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg border ${s.accentColor}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-white leading-tight">{s.title}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'border-cyan-400 bg-cyan-400 text-slate-950' : 'border-slate-700'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                    <p className="text-[11px] font-mono text-cyan-300/80 mb-2">{s.tagline}</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{s.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <p className="text-xs font-semibold text-slate-200">Ready to trigger orchestration cascade?</p>
              <p className="text-[11px] text-slate-400">This mutates live system state, creates maintenance tickets, and broadcasts notices.</p>
            </div>
            <button
              onClick={handleExecute}
              disabled={running}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs md:text-sm shadow-lg shadow-cyan-900/50 transition-all disabled:opacity-50"
            >
              {running ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Reasoning & Executing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Execute AI Cascade</span>
                </>
              )}
            </button>
          </div>

          {/* Execution Results & Timeline */}
          {results && (
            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 animate-in fade-in duration-300 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-bold text-white">{results.workflowTitle}</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  ALL 5 MODULES SYNCHRONIZED
                </span>
              </div>

              <div className="space-y-3">
                {results.stepsExecuted.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                          {step.module}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Done
                        </span>
                      </div>
                      <p className="text-slate-200 mt-1 font-medium">{step.action}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onNavigate(selectedScenario === 'classroom_maintenance' ? 'timetable' : 'transport');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 transition-colors"
                >
                  <span>View Affected Module in System</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

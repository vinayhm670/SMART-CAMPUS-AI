import React, { useState } from 'react';
import { 
  Ticket, 
  Clock, 
  Users, 
  CheckCircle2, 
  Plus, 
  Radio, 
  Sparkles,
  ArrowRight,
  Building2,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useCampusData } from '../../context/CampusDataContext.js';

export const QueueModule: React.FC = () => {
  const { currentUser, isRole } = useAuth();
  const { queueTokens, takeQueueToken, advanceQueueToken } = useCampusData();

  const [selectedService, setSelectedService] = useState<'registrar' | 'accounts' | 'library' | 'hostel_desk' | 'id_cards'>('registrar');
  const [issuedToken, setIssuedToken] = useState<any>(null);

  const services = [
    { id: 'registrar' as const, name: 'Academic Transcripts & Verification Counter', code: 'REG', avgWait: '8 mins' },
    { id: 'accounts' as const, name: 'Fee & Scholarship Administration Desk', code: 'ACC', avgWait: '14 mins' },
    { id: 'library' as const, name: 'Reference Desk & Inter-Library Loan', code: 'LIB', avgWait: '4 mins' },
    { id: 'hostel_desk' as const, name: 'Campus Housing & Maintenance Counter', code: 'HOS', avgWait: '10 mins' },
    { id: 'id_cards' as const, name: 'Smart ID & NFC Access Badge Issuance', code: 'IDC', avgWait: '5 mins' }
  ];

  const handleTakeToken = async () => {
    const token = await takeQueueToken(selectedService);
    if (token) {
      setIssuedToken(token);
    }
  };

  const handleAdvance = async (tokenId: string, status: 'called' | 'completed') => {
    await advanceQueueToken(tokenId, status, status === 'called' ? Math.floor(1 + Math.random() * 4) : undefined);
  };

  const currentCalled = queueTokens.find(q => q.status === 'called');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Smart Virtual Queue Management
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Zero Physical Lines
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Generate digital tokens, monitor real-time queue wait estimates, and receive turn notifications.
          </p>
        </div>
      </div>

      {/* Main Grid: Token Dispenser + Live Counter Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Token Dispenser */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-white">Issue Virtual Token</h3>
            <p className="text-xs text-slate-400">Select campus service desk</p>
          </div>

          <div className="space-y-2">
            {services.map(s => {
              const isSelected = selectedService === s.id;

              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedService(s.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-400 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{s.name}</span>
                    <span className="font-mono text-cyan-400 font-bold">{s.code}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Avg Wait: {s.avgWait}</p>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleTakeToken}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950/50 transition-all flex items-center justify-center gap-2"
          >
            <Ticket className="w-4 h-4" />
            <span>Generate Virtual Queue Token</span>
          </button>

          {issuedToken && (
            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 text-center space-y-1 animate-in zoom-in-95">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Your Digital Token</span>
              <p className="text-3xl font-extrabold text-cyan-300 font-mono">{issuedToken.tokenNumber}</p>
              <p className="text-xs text-slate-300 font-medium">{issuedToken.serviceName}</p>
              <p className="text-[11px] text-teal-400 font-semibold pt-1">
                Estimated wait: ~{issuedToken.estWaitMinutes} minutes
              </p>
            </div>
          )}
        </div>

        {/* Live Counter Display Board */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Live Service Desk Display</h3>
                <p className="text-xs text-slate-400">Now serving at Student Commons Counters</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse" /> Live Display
              </span>
            </div>

            {/* Now Serving Big Display */}
            {currentCalled ? (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-slate-950 border border-cyan-500/40 text-center mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">NOW SERVING</span>
                <p className="text-5xl font-black text-white font-mono my-2">{currentCalled.tokenNumber}</p>
                <p className="text-sm font-bold text-cyan-200">
                  Please proceed to Counter #{currentCalled.counterNumber || 2}
                </p>
                <p className="text-xs text-slate-400 mt-1">{currentCalled.serviceName} ({currentCalled.studentName})</p>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center mb-6 text-slate-400 text-xs">
                No active token currently being served. Staff may call next token below.
              </div>
            )}

            {/* Queue Waiting List */}
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Waiting Queue ({queueTokens.filter(q => q.status === 'waiting').length} Students)
            </span>
            <div className="divide-y divide-slate-800 border-t border-slate-800">
              {queueTokens.map(token => (
                <div key={token.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-cyan-400 w-16">{token.tokenNumber}</span>
                    <div>
                      <p className="font-medium text-white">{token.studentName}</p>
                      <p className="text-[11px] text-slate-400">{token.serviceName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      token.status === 'called' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {token.status}
                    </span>

                    {/* Staff Call Buttons */}
                    {isRole(['campus_admin', 'faculty']) && token.status === 'waiting' && (
                      <button
                        onClick={() => handleAdvance(token.id, 'called')}
                        className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-[11px]"
                      >
                        Call Next
                      </button>
                    )}
                    {isRole(['campus_admin', 'faculty']) && token.status === 'called' && (
                      <button
                        onClick={() => handleAdvance(token.id, 'completed')}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                      >
                        Complete
                      </button>
                    )}
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

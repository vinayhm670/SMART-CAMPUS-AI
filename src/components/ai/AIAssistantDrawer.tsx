import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User as UserIcon, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { ActiveTab } from '../layout/Sidebar.js';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveTab) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
  actionSuggestion?: {
    type: string;
    label: string;
  };
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({ isOpen, onClose, onNavigate }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello ${currentUser.name}! I am your **Smart Campus AI Copilot**. I have real-time access to campus timetables, bus transit GPS, room occupancy sensors, lab apparatus, and facilities tickets.\n\nHow can I assist your day on campus?`,
      timestamp: 'Just now',
      source: 'gemini-3.8-flash'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    "Where is my next class?",
    "When will my bus reach the main gate?",
    "Which laboratory is available this afternoon?",
    "How can I report a broken classroom projector?",
    "Find an alternative classroom for this lecture",
    "What is the status of my complaint?",
    "Which rooms have low utilization tomorrow?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          userRole: currentUser.role,
          userName: currentUser.name
        })
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Sorry, I could not complete that query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'campus-rag-engine',
        actionSuggestion: data.actionSuggestion
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          text: 'Unable to reach the campus intelligence server. Please verify network connection.',
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const executeAction = (actionType: string) => {
    switch (actionType) {
      case 'view_timetable':
        onNavigate('timetable');
        break;
      case 'view_transit':
        onNavigate('transport');
        break;
      case 'book_lab':
        onNavigate('laboratories');
        break;
      case 'view_occupancy':
        onNavigate('occupancy');
        break;
      case 'submit_grievance':
        onNavigate('grievances');
        break;
      default:
        onNavigate('dashboard');
        break;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-950/40">
              <Sparkles className="w-5 h-5 text-slate-950 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Smart Campus AI Assistant</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Context: {currentUser.name} ({currentUser.role.replace('_', ' ')})</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs md:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-br-xs shadow-md'
                    : 'bg-slate-800/80 border border-slate-700/70 text-slate-200 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-line space-y-1">
                  {msg.text.split('\n').map((line, i) => {
                    // Quick bolding replacement for display
                    if (line.includes('**')) {
                      const parts = line.split('**');
                      return (
                        <p key={i}>
                          {parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-cyan-300 font-semibold">{p}</strong> : p)}
                        </p>
                      );
                    }
                    return <p key={i}>{line}</p>;
                  })}
                </div>

                {/* Action CTA within message */}
                {msg.actionSuggestion && (
                  <div className="mt-3 pt-2.5 border-t border-slate-700/60">
                    <button
                      onClick={() => executeAction(msg.actionSuggestion!.type)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 hover:text-white text-xs font-semibold transition-all group"
                    >
                      <span>{msg.actionSuggestion.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 mt-2 pt-1 text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {msg.source && (
                    <span className="font-mono text-[9px] text-teal-400/80">Source: {msg.source}</span>
                  )}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0 mt-0.5">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-slate-400 text-xs">
              <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700">
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>Retrieving campus telemetry & reasoning...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Prompt Chips */}
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/40">
          <div className="text-[10px] text-slate-400 mb-1.5 font-semibold uppercase tracking-wider flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-cyan-400" /> Suggested Queries
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {sampleQuestions.slice(0, 4).map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 text-[11px] text-slate-300 hover:text-cyan-200 whitespace-nowrap transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/70">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about classes, buses, lab bookings, or facilities..."
              className="flex-1 bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/80"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-cyan-900/40 transition-all flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

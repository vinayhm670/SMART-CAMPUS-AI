import React, { useState } from 'react';
import { 
  SearchCheck, 
  Plus, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Mail, 
  Tag, 
  CheckCircle2, 
  Filter 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useCampusData } from '../../context/CampusDataContext.js';
import { LostFoundItem } from '../../types/index.js';

export const LostFoundModule: React.FC = () => {
  const { currentUser } = useAuth();
  const { lostFound, reportLostFound } = useCampusData();

  const [activeTabSub, setActiveTabSub] = useState<'all' | 'lost' | 'found'>('all');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    type: 'lost' as 'lost' | 'found',
    title: '',
    description: '',
    category: 'electronics' as any,
    locationFound: 'Engineering Hall, Room A-101'
  });

  const filteredItems = lostFound.filter(item => {
    if (activeTabSub === 'all') return true;
    return item.type === activeTabSub;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await reportLostFound({
      ...reportForm,
      reportedBy: currentUser.name,
      contactEmail: currentUser.email
    });
    setShowReportModal(false);
    setReportForm({
      type: 'lost',
      title: '',
      description: '',
      category: 'electronics',
      locationFound: 'Engineering Hall, Room A-101'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Campus Lost &amp; Found Registry
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              AI Similarity Matching
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Community asset recovery portal with verified custody logs and AI description matching.
          </p>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Report Item</span>
        </button>
      </div>

      {/* Filter Tabs (Zero-pill button segmented controls) */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 w-fit">
        {['all', 'lost', 'found'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTabSub(tab as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
              activeTabSub === tab ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'all' ? 'All Reported Items' : tab}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => {
          const isFound = item.type === 'found';

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                    isFound ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {item.type}
                  </span>
                  <span className="text-[11px] text-slate-400 capitalize">{item.category}</span>
                </div>

                <h3 className="text-sm font-bold text-white mt-2">{item.title}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="truncate">{item.locationFound}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Mail className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span>Contact: {item.contactEmail}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Report Lost or Found Item</h3>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="lost"
                    checked={reportForm.type === 'lost'}
                    onChange={() => setReportForm({ ...reportForm, type: 'lost' })}
                  />
                  <span>I Lost an Item</span>
                </label>
                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="found"
                    checked={reportForm.type === 'found'}
                    onChange={() => setReportForm({ ...reportForm, type: 'found' })}
                  />
                  <span>I Found an Item</span>
                </label>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blue Casio Scientific Calculator"
                  value={reportForm.title}
                  onChange={e => setReportForm({ ...reportForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Description &amp; Identifying Marks</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Serial numbers, color, stickers, distinctive scratches..."
                  value={reportForm.description}
                  onChange={e => setReportForm({ ...reportForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Category</label>
                  <select
                    value={reportForm.category}
                    onChange={e => setReportForm({ ...reportForm, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  >
                    <option value="electronics">Electronics &amp; Gadgets</option>
                    <option value="id_cards">Student / Employee ID Cards</option>
                    <option value="books">Textbooks &amp; Notebooks</option>
                    <option value="accessories">Wallets, Glasses &amp; Bags</option>
                    <option value="keys">Keys &amp; Fobs</option>
                    <option value="clothing">Clothing &amp; Umbrellas</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={reportForm.locationFound}
                    onChange={e => setReportForm({ ...reportForm, locationFound: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold"
                >
                  Publish Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

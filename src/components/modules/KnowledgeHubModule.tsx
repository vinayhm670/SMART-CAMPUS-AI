import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  FileText, 
  Clock, 
  ArrowRight, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useCampusData } from '../../context/CampusDataContext.js';
import { CampusDocument } from '../../types/index.js';

export const KnowledgeHubModule: React.FC = () => {
  const { documents } = useCampusData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<CampusDocument>(documents[0]);

  const filteredDocs = documents.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Smart Campus Knowledge Hub
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Grounded Institutional Policies
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Searchable repository of academic statutes, laboratory protocols, fleet SLAs, and student rights.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search policies or SLAs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
          />
        </div>
      </div>

      {/* Main Grid: Doc Browser & Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document List */}
        <div className="space-y-2.5">
          {filteredDocs.map(doc => {
            const isSelected = selectedDoc.id === doc.id;

            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-800 border-cyan-400 shadow-md shadow-cyan-950/20'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                    {doc.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-500">Updated: {doc.lastUpdated}</span>
                </div>
                <h3 className="text-sm font-bold text-white mt-1.5">{doc.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{doc.summary}</p>
              </div>
            );
          })}
        </div>

        {/* Selected Document Full Reader */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
              <FileText className="w-4 h-4" />
              <span className="uppercase">{selectedDoc.category}</span>
              <span>·</span>
              <span className="text-slate-500">Approved Version: {selectedDoc.lastUpdated}</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-2">{selectedDoc.title}</h2>
            <p className="text-xs text-slate-300 mt-1">{selectedDoc.summary}</p>
          </div>

          <div className="prose prose-invert max-w-none text-xs md:text-sm text-slate-200 leading-relaxed whitespace-pre-line bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 font-serif">
            {selectedDoc.content}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" /> Academic Board Ratified
            </span>
            <span className="text-slate-500">Document ID: {selectedDoc.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

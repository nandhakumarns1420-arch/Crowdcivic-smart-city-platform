import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Calendar, MapPin, 
  ChevronRight, Clock, CheckCircle, 
  AlertCircle, ArrowRight, BarChart3,
  PieChart as PieChartIcon, Info, X, Camera, Send, RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';
import { usePlatform } from '../context/PlatformContext';
import { useLanguage } from '../context/LanguageContext';

const MyComplaints = () => {
  const { complaints, confirmComplaintResolution, reopenComplaint } = usePlatform();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [reopenNote, setReopenNote] = useState('');
  const [showReopenInput, setShowReopenNote] = useState(false);

  const safeComplaints = Array.isArray(complaints) ? complaints : [];
  
  const filteredComplaints = safeComplaints.filter(c => {
    const matchesSearch = (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (c.id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' ? true : c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const total = safeComplaints.length;
  const resolved = safeComplaints.filter(c => c.status === 'Resolved').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const COLORS = ['#3B82F6', '#06B6D4', '#8B5CF6', '#F59E0B', '#EF4444'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'Awaiting Citizen Confirmation': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'Work In Progress': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'Reopened': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'Submitted': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const handleReopenAction = (id) => {
    if (!reopenNote) {
       setShowReopenNote(true);
       return;
    }
    reopenComplaint(id, reopenNote);
    setShowReopenNote(false);
    setReopenNote('');
    setSelectedComplaint(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* Verification Notification Card */}
      <AnimatePresence>
        {safeComplaints.filter(c => c.status === 'Awaiting Citizen Confirmation').map(c => (
           <motion.div key={c.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-6 border-l-4 border-l-purple-500 rounded-3xl bg-purple-500/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 shrink-0">
                    <CheckCircle className="w-8 h-8 text-purple-400" />
                 </div>
                 <div>
                    <h3 className="text-white font-bold text-lg">Action Required: Verify Work</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">Your reported issue <span className="text-purple-400 font-mono font-bold">{c.id}</span> has been resolved. Please verify the completed work.</p>
                 </div>
              </div>
              <button onClick={() => setSelectedComplaint(c)} className="px-8 py-3.5 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-500 transition-all shadow-lg shadow-purple-600/30 whitespace-nowrap">Review & Verify</button>
           </motion.div>
        ))}
      </AnimatePresence>

      {/* Stats Summary */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('myReports')}</h1>
          <p className="text-slate-400">{t('manageYourComplaints')}</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
          {[{l: t('total'), v: total, c: 'text-white'}, {l: t('resolved'), v: resolved, c: 'text-green-400'}, {l: 'Resolution', v: resolutionRate+'%', c: 'text-blue-400'}, {l: 'Last Action', v: 'Today', c: 'text-cyan-400'}].map((s, i) => (
             <div key={i} className="glass px-6 py-4 rounded-2xl border border-white/5 min-w-[150px]">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{s.l}</p>
                <p className={`text-2xl font-bold ${s.c}`}>{s.v}</p>
             </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Complaints Table Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/5">
            <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="text" placeholder={t('searchPlaceholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {['All', 'Submitted', 'Assigned', 'Work In Progress', 'Awaiting Citizen Confirmation', 'Resolved', 'Reopened'].map(status => (
                  <button key={status} onClick={() => setFilterStatus(status)} className={`px-4 py-2 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all ${filterStatus === status ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-slate-400 hover:text-white'}`}>
                    {status === 'All' ? t('allStatus') : t(status)}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/[0.02] text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <th className="p-5 pl-8">{t('complaint')}</th>
                    <th className="p-5">{t('category')}</th>
                    <th className="p-5">{t('Status')}</th>
                    <th className="p-5 pr-8 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredComplaints.length > 0 ? filteredComplaints.map((c) => (
                    <tr key={c.id} onClick={() => navigate(`/dashboard/reports/${c.id}`)} className="group cursor-pointer transition-colors hover:bg-white/[0.03]">
                      <td className="p-5 pl-8">
                        <p className="text-sm font-bold text-white mb-0.5">{c.title}</p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500">
                           <span className="font-mono text-blue-400">{c.id}</span>
                           <span>{c.date}</span>
                        </div>
                      </td>
                      <td className="p-5">
                         <span className="text-[11px] font-bold text-slate-400 px-2.5 py-1 rounded-lg bg-white/5">{c.category}</span>
                      </td>
                      <td className="p-5">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider ${getStatusColor(c.status)}`}>
                           {t(c.status)}
                        </div>
                      </td>
                      <td className="p-5 pr-8 text-right"><ArrowRight className="w-4 h-4 ml-auto text-slate-600 group-hover:text-blue-400 transition-colors" /></td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="p-10 text-center">
                        <p className="text-slate-500 font-medium">No complaints found matching your criteria.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detailed Pane Column */}
        <div className="lg:col-span-4">
          <AnimatePresence mode="wait">
            {selectedComplaint ? (
              <motion.div key={selectedComplaint.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="glass-card rounded-[2.5rem] p-8 border border-white/5 sticky top-24 shadow-2xl overflow-y-auto max-h-[calc(100vh-120px)]">
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-1 rounded-md mb-2 inline-block">{selectedComplaint.id}</span>
                    <h2 className="text-xl font-bold text-white leading-tight">{selectedComplaint.title}</h2>
                  </div>
                  <button onClick={() => setSelectedComplaint(null)} className="p-2 text-slate-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                </div>

                {/* Verification View Logic */}
                {selectedComplaint.status === 'Awaiting Citizen Confirmation' ? (
                   <div className="space-y-6">
                      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                         <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">{t('completionNotes')}</p>
                         <p className="text-sm text-white italic leading-relaxed">"{selectedComplaint.resolutionNotes}"</p>
                         <p className="text-[9px] text-slate-500 mt-2 uppercase tracking-tighter">Completed on: {new Date().toLocaleDateString()}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <p className="text-[9px] font-bold text-slate-500 uppercase mb-2">{t('beforePhoto')}</p>
                            <img src={selectedComplaint.image} className="h-32 w-full object-cover rounded-xl border border-white/5 grayscale" />
                         </div>
                         <div>
                            <p className="text-[9px] font-bold text-blue-400 uppercase mb-2">{t('afterPhoto')}</p>
                            <img src={selectedComplaint.afterImage} className="h-32 w-full object-cover rounded-xl border border-blue-500/30" />
                         </div>
                      </div>

                      <div className="space-y-3">
                         <button onClick={() => confirmComplaintResolution(selectedComplaint.id)} className="w-full py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold shadow-lg shadow-green-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                           <CheckCircle className="w-5 h-5" /> Confirm & Close Ticket
                         </button>
                         
                         {showReopenInput ? (
                            <div className="space-y-3 pt-2 animate-in slide-in-from-top duration-300">
                               <textarea value={reopenNote} onChange={e => setReopenNote(e.target.value)} placeholder="Reason for reopening..."
                                 className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-red-500 outline-none resize-none" />
                               <div className="flex gap-2">
                                  <button onClick={() => handleReopenAction(selectedComplaint.id)} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold text-xs uppercase shadow-lg shadow-red-600/20">Submit Rework</button>
                                  <button onClick={() => setShowReopenNote(false)} className="px-4 rounded-xl bg-white/5 text-slate-500 text-xs hover:text-white transition-colors">Cancel</button>
                               </div>
                            </div>
                         ) : (
                            <button onClick={() => setShowReopenNote(true)} className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-slate-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all">
                              <RotateCcw className="w-4 h-4" /> Request Rework / Reopen
                            </button>
                         )}
                      </div>
                   </div>
                ) : (
                   <div className="space-y-6">
                      <div className="rounded-2xl overflow-hidden aspect-video bg-slate-900 border border-white/5">
                        <img src={selectedComplaint.image} className="w-full h-full object-cover" />
                      </div>

                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{t('detailedDesc')}</p>
                        <p className="text-sm text-slate-300 leading-relaxed">{selectedComplaint.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0"><MapPin className="w-4 h-4 text-blue-400" /></div>
                           <div>
                              <p className="text-[9px] font-bold text-slate-500 uppercase">Location</p>
                              <p className="text-[11px] text-white font-medium truncate w-24">{typeof selectedComplaint.location === 'object' && selectedComplaint.location !== null ? selectedComplaint.location.address : selectedComplaint.location}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0"><Clock className="w-4 h-4 text-cyan-400" /></div>
                           <div>
                              <p className="text-[9px] font-bold text-slate-500 uppercase">Status</p>
                              <p className="text-[11px] text-white font-bold uppercase tracking-tighter">{t(selectedComplaint.status)}</p>
                           </div>
                        </div>
                      </div>

                      {/* Full Journey Timeline */}
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Complaint Journey</p>
                        <div className="space-y-5 relative">
                          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/10" />
                          {[
                            { id: 'Submitted', done: true },
                            { id: 'Assigned', done: !['Submitted'].includes(selectedComplaint.status) },
                            { id: 'Work In Progress', done: !['Submitted', 'Assigned'].includes(selectedComplaint.status) },
                            { id: 'Awaiting Citizen Confirmation', done: ['Awaiting Citizen Confirmation', 'Resolved'].includes(selectedComplaint.status) },
                            { id: 'Resolved', done: selectedComplaint.status === 'Resolved' }
                          ].map((step, i) => (
                            <div key={i} className="flex gap-4 relative z-10 items-center">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 ${step.done ? 'bg-blue-600 border-blue-600' : 'bg-[#0b1121] border-white/10'}`}>
                                {step.done ? <CheckCircle className="w-3.5 h-3.5 text-white" /> : <div className="w-1.5 h-1.5 rounded-full bg-white/10" />}
                              </div>
                              <p className={`text-[11px] font-bold ${step.done ? 'text-white' : 'text-slate-600'}`}>{t(step.id)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                   </div>
                )}
              </motion.div>
            ) : (
              <div className="glass rounded-[2.5rem] p-10 border border-white/5 border-dashed flex flex-col items-center justify-center text-center h-[600px]">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 shadow-inner">
                   <Info className="w-12 h-12 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-400 mb-2">Tracking Center</h3>
                <p className="text-sm text-slate-500 max-w-[220px] leading-relaxed">Select a complaint from your history to view high-resolution photos and live progress tracking.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default MyComplaints;

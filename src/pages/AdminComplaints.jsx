import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShieldCheck, Camera, User, Building,
  Bell, Activity, Map as MapIcon, Layers, Download, X, Send,
  Filter, Calendar, ArrowRight, Info, AlertTriangle, Clock,
  CheckCircle, RotateCcw, MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlatform } from '../context/PlatformContext';
import { useLanguage } from '../context/LanguageContext';

const AdminComplaints = () => {
  const { complaints, updateComplaintStatus, addToast } = usePlatform();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedId, setSelectedId] = useState(null);
  const [showProofModal, setShowProofModal] = useState(false);
  const [workProofData, setWorkProofData] = useState({ image: null, notes: '' });

  const safeComplaints = Array.isArray(complaints) ? complaints : [];
  
  // Keep selected complaint synced with context data
  const selectedComplaint = safeComplaints.find(c => c.id === selectedId);

  const handleProofImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setWorkProofData({ ...workProofData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const submitWorkProof = (id) => {
    if (!workProofData.image || !workProofData.notes) {
      alert("Please provide completion photo and notes.");
      return;
    }
    updateComplaintStatus(id, 'Awaiting Citizen Confirmation', {
      afterImage: workProofData.image,
      resolutionNotes: workProofData.notes,
      text: 'Work proof uploaded. Redirected to citizen for verification.'
    });
    setShowProofModal(false);
    setWorkProofData({ image: null, notes: '' });
  };

  const handleAssign = (id) => {
    const worker = prompt("Enter Worker Name:", "Rajesh Kumar");
    const dept = prompt("Enter Department:", "Electrical Dept.");
    if (worker && dept) {
      updateComplaintStatus(id, 'Assigned', {
        assignedWorker: worker,
        assignedDept: dept,
        text: `Ticket assigned to ${worker} (${dept})`
      });
    }
  };

  const filteredComplaints = safeComplaints.filter(c => {
    const matchesSearch = (c.id || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (c.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' ? true : c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Resolved': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'Reopened': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'Awaiting Citizen Confirmation': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'Work In Progress': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'Assigned': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* Page Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">{t('allComplaints')}</h1>
          <p className="text-slate-400 text-sm tracking-wide uppercase">{t('mgmtCenter')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Complaints Table Column */}
        <div className="lg:col-span-8 space-y-6">
           <div className="glass-card rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
              <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" placeholder={t('searchPlaceholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-all" />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                  {['All', 'Submitted', 'Assigned', 'Work In Progress', 'Awaiting Citizen Confirmation', 'Resolved', 'Reopened'].map(st => (
                    <button key={st} onClick={() => setFilterStatus(st)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all ${filterStatus === st ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-slate-400 hover:text-white'}`}>
                      {st === 'All' ? t('allStatus') : t(st)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/[0.02] text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <th className="p-5 pl-8">{t('tokenID')}</th>
                      <th className="p-5">{t('complaint')}</th>
                      <th className="p-5">{t('Status')}</th>
                      <th className="p-5 pr-8 text-right">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredComplaints.map((c) => (
                      <tr key={c.id} onClick={() => setSelectedId(c.id)} 
                        className={`group cursor-pointer transition-colors ${selectedId === c.id ? 'bg-blue-600/5' : 'hover:bg-white/[0.03]'}`}>
                        <td className="p-5 pl-8 font-mono text-xs text-blue-400">{c.id}</td>
                        <td className="p-5">
                           <p className="text-sm font-bold text-white mb-0.5">{c.title}</p>
                           <p className="text-[10px] text-slate-500">{c.category} • {c.ward}</p>
                        </td>
                        <td className="p-5">
                           <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider ${getStatusStyle(c.status)}`}>
                              {t(c.status)}
                           </div>
                        </td>
                        <td className="p-5 pr-8 text-right">
                           <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {c.status === 'Submitted' && <button onClick={(e) => { e.stopPropagation(); handleAssign(c.id); }} className="p-2 rounded-lg bg-blue-500/10 text-blue-400" title={t('assignWorker')}><User className="w-4 h-4" /></button>}
                              {c.status === 'Assigned' && <button onClick={(e) => { e.stopPropagation(); updateComplaintStatus(c.id, 'Work In Progress'); }} className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400" title="Start Work"><Clock className="w-4 h-4" /></button>}
                              {c.status === 'Work In Progress' && <button onClick={(e) => { e.stopPropagation(); setSelectedId(c.id); setShowProofModal(true); }} className="p-2 rounded-lg bg-purple-500/10 text-purple-400" title={t('uploadProof')}><Camera className="w-4 h-4" /></button>}
                              <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/complaints/${c.id}`); }} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-all hover:scale-110" title={t('viewDetails')}>
                                 <ArrowRight className="w-4 h-4" />
                              </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredComplaints.length === 0 && (
                   <div className="py-20 text-center text-slate-600">
                      <Info className="w-12 h-12 mx-auto mb-4 opacity-10" />
                      <p className="text-sm">No complaints found matching the criteria.</p>
                   </div>
                )}
              </div>
           </div>
        </div>

        {/* Professional Detail Side Panel */}
        <div className="lg:col-span-4">
           <AnimatePresence mode="wait">
             {selectedComplaint ? (
                <motion.div key={selectedComplaint.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
                  className="glass-card rounded-[2.5rem] p-8 border border-white/5 sticky top-24 shadow-2xl overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-hide">
                  
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-1 rounded-md mb-2 inline-block shadow-inner">{selectedComplaint.id}</span>
                      <h2 className="text-xl font-bold text-white leading-tight">{selectedComplaint.title}</h2>
                    </div>
                    <button onClick={() => setSelectedId(null)} className="p-2 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-xl"><X className="w-5 h-5" /></button>
                  </div>

                  {/* Visual Content */}
                  <div className="space-y-8">
                     <div className="rounded-3xl overflow-hidden aspect-video bg-slate-900 border border-white/5 relative group">
                        <img src={selectedComplaint.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full text-[9px] font-bold text-white uppercase tracking-widest shadow-lg">Original Issue</div>
                     </div>

                     {/* Details Grid */}
                     <div className="space-y-6">
                        <div>
                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Info className="w-3 h-3" /> {t('detailedDesc')}</p>
                           <p className="text-sm text-slate-300 leading-relaxed bg-black/20 p-4 rounded-2xl border border-white/5">{selectedComplaint.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{t('citizenName')}</p>
                              <p className="text-xs text-white font-medium">Arul Kumar</p>
                           </div>
                           <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{t('submissionDate')}</p>
                              <p className="text-xs text-white font-medium">{selectedComplaint.date}</p>
                           </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/10">
                           <MapPin className="w-5 h-5 text-red-400" />
                           <div>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Location Matrix</p>
                              <p className="text-xs text-white">{typeof selectedComplaint.location === 'object' && selectedComplaint.location !== null ? selectedComplaint.location.address : selectedComplaint.location} • {selectedComplaint.ward}</p>
                           </div>
                        </div>

                        {/* Action Workflow Section */}
                        <div className="pt-6 border-t border-white/10 space-y-4">
                           {selectedComplaint.status === 'Submitted' && (
                              <button onClick={() => handleAssign(selectedComplaint.id)} className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all">
                                 <User className="w-5 h-5" /> {t('assignWorker')}
                              </button>
                           )}
                           
                           {selectedComplaint.status === 'Assigned' && (
                              <button onClick={() => updateComplaintStatus(selectedComplaint.id, 'Work In Progress')} className="w-full py-4 rounded-2xl bg-cyan-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 hover:bg-cyan-500 transition-all">
                                 <Clock className="w-5 h-5" /> Start Physical Work
                              </button>
                           )}

                           {selectedComplaint.status === 'Work In Progress' && (
                              <button onClick={() => setShowProofModal(true)} className="w-full py-4 rounded-2xl bg-purple-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 hover:bg-purple-500 transition-all">
                                 <Camera className="w-5 h-5" /> {t('uploadProof')}
                              </button>
                           )}

                           {/* Worker Assignment Info */}
                           {selectedComplaint.assignedWorker && (
                              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center font-bold text-blue-400 border border-blue-500/20">{selectedComplaint.assignedWorker[0]}</div>
                                    <div>
                                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Assigned Representative</p>
                                       <p className="text-sm font-bold text-white">{selectedComplaint.assignedWorker}</p>
                                       <p className="text-[9px] text-cyan-400 uppercase font-bold">{selectedComplaint.assignedDept}</p>
                                    </div>
                                 </div>
                              </div>
                           )}

                           {/* Resolution Proof Display */}
                           {selectedComplaint.afterImage && (
                              <div className="space-y-4">
                                 <div className="flex items-center gap-2 text-green-400">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{t('workProof')}</span>
                                 </div>
                                 <div className="rounded-2xl overflow-hidden aspect-video border border-green-500/20 bg-green-500/5">
                                    <img src={selectedComplaint.afterImage} className="w-full h-full object-cover" />
                                 </div>
                                 <div className="p-4 rounded-2xl bg-black/40 border border-white/5 italic text-xs text-slate-300">
                                    "{selectedComplaint.resolutionNotes}"
                                 </div>
                              </div>
                           )}

                           {selectedComplaint.status === 'Reopened' && (
                              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                                 <div className="flex items-center gap-2 text-red-400 mb-2">
                                    <RotateCcw className="w-4 h-4" />
                                    <span className="text-[10px] font-bold uppercase">{t('reworkRequested')}</span>
                                 </div>
                                 <p className="text-sm text-white italic">"{selectedComplaint.reopenedReason}"</p>
                              </div>
                           )}
                        </div>

                        {/* Audit Timeline */}
                        <div className="pt-6 border-t border-white/10">
                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Execution Log</p>
                           <div className="space-y-6 relative">
                              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/10" />
                              {(selectedComplaint.updates || []).slice().reverse().map((u, i) => (
                                 <div key={i} className="flex gap-4 relative z-10">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 ${i === 0 ? 'bg-blue-600 border-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'bg-[#0b1121] border-white/10'}`}>
                                       {i === 0 ? <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> : <div className="w-1 h-1 rounded-full bg-white/20" />}
                                    </div>
                                    <div>
                                       <p className={`text-xs font-bold ${i === 0 ? 'text-white' : 'text-slate-500'}`}>{u.text}</p>
                                       <p className="text-[9px] text-slate-600 font-mono mt-0.5">{u.date}</p>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
                </motion.div>
             ) : (
                <div className="glass rounded-[2.5rem] p-10 border border-white/5 border-dashed flex flex-col items-center justify-center text-center h-[600px] bg-white/5 shadow-inner">
                   <Info className="w-16 h-16 text-slate-700 mb-6 opacity-20" />
                   <h3 className="text-xl font-bold text-slate-400 mb-2">Municipal Command Node</h3>
                   <p className="text-sm text-slate-500 max-w-[240px] leading-relaxed">Select a live complaint from the ledger to access detailed geospatial data and operational controls.</p>
                </div>
             )}
           </AnimatePresence>
        </div>
      </div>

      {/* Mandatory Resolution Proof Modal */}
      <AnimatePresence>
        {showProofModal && selectedComplaint && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050D1A]/90 backdrop-blur-xl">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card max-w-lg w-full p-10 border border-blue-500/20 rounded-[3rem] shadow-[0_0_50px_rgba(37,99,235,0.2)]">
              
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-2xl font-bold text-white">{t('uploadProof')}</h3>
                 <button onClick={() => setShowProofModal(false)} className="text-slate-500 hover:text-white transition-colors p-2 bg-white/5 rounded-xl"><X className="w-6 h-6" /></button>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('beforePhoto')}</p>
                      <div className="h-36 rounded-2xl overflow-hidden border border-white/5 bg-black/40 shadow-inner">
                         <img src={selectedComplaint.image} className="h-full w-full object-cover grayscale opacity-30" />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{t('afterPhoto')}</p>
                      <div className="relative h-36 rounded-2xl border-2 border-dashed border-blue-500/30 bg-blue-500/5 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-blue-500/60 shadow-inner group">
                         <input type="file" accept="image/*" onChange={handleProofImage} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                         {workProofData.image ? (
                            <img src={workProofData.image} className="w-full h-full object-cover" />
                         ) : (
                            <>
                               <Camera className="w-8 h-8 text-blue-400 opacity-40 group-hover:opacity-100 transition-opacity" />
                               <p className="text-[9px] text-blue-500 font-bold mt-2 uppercase tracking-tighter">Click to upload</p>
                            </>
                         )}
                      </div>
                   </div>
                </div>

                <div>
                   <label className="text-[10px] font-bold text-slate-500 uppercase block mb-3">{t('completionNotes')}</label>
                   <textarea rows="4" value={workProofData.notes} onChange={e => setWorkProofData({...workProofData, notes: e.target.value})}
                    placeholder="Enter details about the resolution work..." 
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:border-blue-500 outline-none resize-none transition-all shadow-inner" />
                </div>

                <button onClick={() => submitWorkProof(selectedComplaint.id)} 
                   className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 hover:scale-[1.02] transition-transform active:scale-95">
                  <Send className="w-5 h-5" /> {t('submitVerification')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminComplaints;

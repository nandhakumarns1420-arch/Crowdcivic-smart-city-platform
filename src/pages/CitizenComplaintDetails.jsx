import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Calendar, Clock, 
  CheckCircle, Camera, RotateCcw, Info, 
  FileText, ShieldCheck, Tag, Activity, Maximize2, X
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { useLanguage } from '../context/LanguageContext';

const CitizenComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { complaints, confirmComplaintResolution, reopenComplaint } = usePlatform();
  const { t } = useLanguage();

  const [reopenNote, setReopenNote] = useState('');
  const [showReopenInput, setShowReopenNote] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // MATCHING LOGIC: Case-Insensitive + Trimmed
  const complaint = complaints?.find(c => String(c.id).trim().toLowerCase() === String(id).trim().toLowerCase());

  useEffect(() => {
    console.log("[CITIZEN DETAILS] COMPLAINT ID FROM URL:", id);
    console.log("[CITIZEN DETAILS] COMPLAINT OBJECT DATA:", complaint);
    if (complaint) {
        console.log("[CITIZEN DETAILS] RESOLUTION IMAGE STATUS:", complaint.afterImage ? "LOADED (length: " + complaint.afterImage.length + ")" : "NOT FOUND");
        console.log("[CITIZEN DETAILS] CURRENT STATUS:", complaint.status);
    }
  }, [complaint, id]);

  useEffect(() => {
    if (!complaint && complaints?.length > 0) {
      console.warn("[CITIZEN DETAILS] COMPLAINT NOT FOUND, REDIRECTING...");
      navigate('/dashboard/reports');
    }
  }, [complaint, complaints, navigate]);

  if (!complaint) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleReopen = () => {
    if (!reopenNote) {
       setShowReopenNote(true);
       return;
    }
    reopenComplaint(id, reopenNote);
    setShowReopenNote(false);
    setReopenNote('');
  };

  const statusStyle = {
    'Resolved': 'text-green-400 bg-green-500/10 border-green-500/20',
    'Reopened': 'text-red-400 bg-red-500/10 border-red-500/20',
    'Awaiting Citizen Confirmation': 'text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]',
    'Work In Progress': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    'Assigned': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    'Submitted': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
  }[complaint.status] || 'text-slate-400 bg-white/5 border-white/10';

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/dashboard/reports')} 
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">My Complaints</span>
        </button>
        <div className={`px-5 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest ${statusStyle}`}>
          {t(complaint.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
           
           <div className="glass-card rounded-[2.5rem] p-10 border border-white/5 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <FileText className="w-40 h-40 text-blue-500" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4 text-xs font-bold uppercase tracking-tighter">
                   <span className="text-blue-400 font-mono">{complaint.id}</span>
                   <span className="text-slate-700">/</span>
                   <span className="text-slate-400">{complaint.category}</span>
                </div>
                
                <h1 className="text-4xl font-bold text-white mb-8 leading-tight">{complaint.title}</h1>
                
                <div className="grid grid-cols-2 gap-8 mb-10">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                         <MapPin className="w-6 h-6 text-red-400" />
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('location')}</p>
                         <p className="text-white font-medium">{typeof complaint.location === 'object' && complaint.location !== null ? complaint.location.address : complaint.location}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                         <Calendar className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('submissionDate')}</p>
                         <p className="text-white font-medium">{complaint.date}</p>
                      </div>
                   </div>
                </div>

                <div className="p-6 rounded-3xl bg-black/20 border border-white/5 italic">
                   <p className="text-slate-400 leading-relaxed">"{complaint.description}"</p>
                </div>
              </div>
           </div>

           <div className="space-y-6">
              <h3 className="text-xl font-bold text-white px-2">Visual Evidence Tracking</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="glass-card rounded-[2.5rem] p-8 border border-white/5 shadow-xl">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Camera className="w-4 h-4" /> Before (Your Submission)
                    </p>
                    <div className="rounded-3xl overflow-hidden aspect-video border border-white/10 group relative cursor-zoom-in"
                         onClick={() => setPreviewImage(complaint.image)}>
                       <img src={complaint.image} className="w-full h-full object-cover grayscale opacity-60 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="w-8 h-8 text-white opacity-50" />
                       </div>
                    </div>
                 </div>

                 <div className="glass-card rounded-[2.5rem] p-8 border border-white/5 shadow-xl">
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <CheckCircle className="w-4 h-4" /> After (Resolution Proof)
                    </p>
                    {complaint.afterImage ? (
                       <div className="space-y-4">
                          <div className="rounded-3xl overflow-hidden aspect-video border border-blue-500/20 shadow-[0_0_30px_rgba(37,99,235,0.1)] group relative cursor-zoom-in"
                               onClick={() => setPreviewImage(complaint.afterImage)}>
                             <img src={complaint.afterImage} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Maximize2 className="w-8 h-8 text-white opacity-50" />
                             </div>
                          </div>
                          <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                             <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">{t('completionNotes')}</p>
                             <p className="text-xs text-slate-300 italic">"{complaint.resolutionNotes}"</p>
                             <p className="text-[8px] text-blue-400 font-mono mt-2 uppercase">Verified Persistence Hash: NODE_0{id}</p>
                          </div>
                       </div>
                    ) : (
                       <div className="h-full min-h-[160px] rounded-3xl border-2 border-dashed border-white/5 bg-white/5 flex flex-col items-center justify-center text-center p-6 opacity-30">
                          <Clock className="w-10 h-10 text-slate-500 mb-3" />
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Awaiting physical completion</p>
                       </div>
                    )}
                 </div>
              </div>

              {complaint.status === 'Awaiting Citizen Confirmation' && (
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                   className="p-8 rounded-[2.5rem] bg-purple-600/10 border border-purple-500/30 shadow-2xl">
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-14 h-14 rounded-2xl bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
                          <ShieldCheck className="w-8 h-8 text-purple-400" />
                       </div>
                       <div>
                          <h4 className="text-xl font-bold text-white">Administration Resolution Note</h4>
                          <p className="text-purple-300/80 text-sm">Please verify the work performed and confirm closure.</p>
                       </div>
                    </div>
                    <p className="text-white italic text-lg mb-8 leading-relaxed">"{complaint.resolutionNotes}"</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                       <button onClick={() => confirmComplaintResolution(id)} 
                         className="flex-1 py-5 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold text-base shadow-xl shadow-green-600/30 hover:scale-[1.02] transition-transform active:scale-95 flex items-center justify-center gap-2">
                          <CheckCircle className="w-6 h-6" /> Confirm Resolution
                       </button>
                       
                       {showReopenInput ? (
                          <div className="flex-1 space-y-4 animate-in slide-in-from-top duration-300">
                             <textarea value={reopenNote} onChange={e => setReopenNote(e.target.value)}
                               placeholder="Specify why you are reopening this ticket..."
                               className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-red-500 outline-none resize-none h-32" />
                             <div className="flex gap-2">
                                <button onClick={handleReopen} className="flex-1 py-4 rounded-xl bg-red-600 text-white font-bold text-xs uppercase shadow-lg shadow-red-600/20">Submit Rework Request</button>
                                <button onClick={() => setShowReopenNote(false)} className="px-6 rounded-xl bg-white/5 text-slate-500 text-xs">Cancel</button>
                             </div>
                          </div>
                       ) : (
                          <button onClick={() => setShowReopenNote(true)} 
                            className="flex-1 py-5 rounded-2xl bg-white/5 border border-white/10 text-slate-400 font-bold text-base hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all flex items-center justify-center gap-2">
                             <RotateCcw className="w-5 h-5" /> Reopen Complaint
                          </button>
                       )}
                    </div>
                 </motion.div>
              )}
           </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
           <div className="glass-card rounded-[2.5rem] p-8 border border-white/5 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                 <Activity className="w-5 h-5 text-blue-400" /> Resolution Journey
              </h3>
              <div className="space-y-8 relative">
                 <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-500 via-white/10 to-transparent" />
                 
                 {[
                    { label: 'Submitted', key: 'Submitted', done: true },
                    { label: 'Under Review', key: 'Assigned', done: !['Submitted'].includes(complaint.status) },
                    { label: 'Field Work', key: 'Work In Progress', done: ['Work In Progress', 'Awaiting Citizen Confirmation', 'Resolved'].includes(complaint.status) },
                    { label: 'Verification', key: 'Awaiting Citizen Confirmation', done: ['Awaiting Citizen Confirmation', 'Resolved'].includes(complaint.status) },
                    { label: 'Success', key: 'Resolved', done: complaint.status === 'Resolved' }
                 ].map((step, i) => (
                    <div key={i} className="flex gap-6 relative z-10 items-center">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${step.done ? 'bg-blue-600 border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-[#0b1121] border-white/10'}`}>
                          {step.done ? <CheckCircle className="w-4 h-4 text-white" /> : <div className="w-1.5 h-1.5 rounded-full bg-white/10" />}
                       </div>
                       <p className={`text-sm font-bold ${step.done ? 'text-white' : 'text-slate-600'}`}>{step.label}</p>
                    </div>
                 ))}
              </div>
           </div>

           <div className="glass-card rounded-[2.5rem] p-8 border border-white/5 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Update Logs</h3>
              <div className="space-y-6">
                 {(complaint.updates || []).slice().reverse().map((u, i) => (
                    <div key={i} className="flex gap-4">
                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                       <div>
                          <p className="text-xs text-slate-300 font-medium">{u.text}</p>
                          <p className="text-[10px] text-slate-600 font-mono mt-1">{u.date}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-[#050D1A]/95 backdrop-blur-3xl"
               onClick={() => setPreviewImage(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-5xl w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
              <button onClick={() => setPreviewImage(null)} className="absolute top-0 right-0 p-4 text-white hover:text-blue-400 transition-colors">
                 <X className="w-10 h-10" />
              </button>
              <img src={previewImage} className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl border border-white/10" alt="Preview" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CitizenComplaintDetails;

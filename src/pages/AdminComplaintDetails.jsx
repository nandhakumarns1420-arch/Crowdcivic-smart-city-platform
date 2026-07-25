import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Calendar, User, Building, 
  Clock, CheckCircle, AlertTriangle, Camera, 
  Send, Info, ShieldCheck, Tag, FileText, RotateCcw, Activity, X, Maximize2
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { useLanguage } from '../context/LanguageContext';

const AdminComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { complaints, updateComplaintStatus, addToast } = usePlatform();
  const { t } = useLanguage();

  const [showProofModal, setShowProofModal] = useState(false);
  const [workProofData, setWorkProofData] = useState({ image: null, notes: '' });
  const [previewImage, setPreviewImage] = useState(null);

  const complaint = complaints?.find(c => String(c.id).trim() === String(id).trim());

  useEffect(() => {
    console.log("[ADMIN DETAILS] COMPLAINT OBJECT IN ADMIN VIEW:", complaint);
    if (complaint) {
        console.log("[ADMIN DETAILS] HAS AFTER_IMAGE?", !!complaint.afterImage);
    }
  }, [complaint]);

  useEffect(() => {
    if (!complaint && complaints?.length > 0) {
      navigate('/admin/complaints');
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

  const handleProofImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("[ADMIN DETAILS] SELECTING IMAGE:", file.name, "SIZE:", file.size);
      const reader = new FileReader();
      reader.onloadend = () => {
        setWorkProofData({ ...workProofData, image: reader.result });
        console.log("[ADMIN DETAILS] IMAGE CONVERTED TO BASE64 (Length):", reader.result.length);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitWorkProof = () => {
    if (!workProofData.image || !workProofData.notes) {
      addToast("Please provide both resolution photo and notes.", "error");
      return;
    }
    
    console.log("[ADMIN DETAILS] SUBMITTING WORK PROOF FOR ID:", id);
    console.log("[ADMIN DETAILS] DATA TO SAVE (Notes):", workProofData.notes);
    
    updateComplaintStatus(id, 'Awaiting Citizen Confirmation', {
      afterImage: workProofData.image,
      resolutionNotes: workProofData.notes,
      text: 'Completion proof uploaded by administrator. Citizen verification triggered.'
    });
    
    addToast("Resolution proof submitted successfully!", "success");
    setShowProofModal(false);
    setWorkProofData({ image: null, notes: '' });
  };

  const handleAssign = () => {
    const worker = prompt("Enter Worker Name:", "Rajesh Kumar");
    const dept = prompt("Enter Department:", "Electrical Dept.");
    if (worker && dept) {
      updateComplaintStatus(id, 'Assigned', {
        assignedWorker: worker,
        assignedDept: dept,
        text: `Complaint assigned to ${worker} (${dept})`
      });
    }
  };

  const statusStyle = {
    'Resolved': 'text-green-400 bg-green-500/10 border-green-500/20',
    'Reopened': 'text-red-400 bg-red-500/10 border-red-500/20',
    'Awaiting Citizen Confirmation': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    'Work In Progress': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    'Assigned': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    'Submitted': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
  }[complaint.status] || 'text-slate-400 bg-white/5 border-white/10';

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/admin/complaints')} 
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">{t('backToPortals')}</span>
        </button>
        <div className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest shadow-lg ${statusStyle}`}>
          {t(complaint.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Complaint Details & Images */}
        <div className="lg:col-span-2 space-y-8">
           
           {/* Section 1: Complaint Information */}
           <div className="glass-card rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <ShieldCheck className="w-32 h-32 text-blue-500" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                   <span className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 font-mono text-sm font-bold border border-blue-500/20">
                      {complaint.id}
                   </span>
                   <span className="text-slate-500 font-medium">•</span>
                   <span className="text-slate-400 font-medium flex items-center gap-1.5">
                      <Tag className="w-4 h-4" /> {complaint.category}
                   </span>
                </div>

                <h1 className="text-4xl font-bold text-white mb-6 leading-tight">{complaint.title}</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                            <MapPin className="w-5 h-5 text-red-400" />
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('location')}</p>
                            <p className="text-white font-medium">{typeof complaint.location === 'object' && complaint.location !== null ? complaint.location.address : complaint.location}, {complaint.ward}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                            <Calendar className="w-5 h-5 text-blue-400" />
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('submissionDate')}</p>
                            <p className="text-white font-medium">{complaint.date}</p>
                         </div>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                            <User className="w-5 h-5 text-cyan-400" />
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('citizenName')}</p>
                            <p className="text-white font-medium">Arul Kumar</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                            <ShieldCheck className="w-5 h-5 text-purple-400" />
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Priority Node</p>
                            <p className={`font-bold ${complaint.priority === 'Critical' ? 'text-red-500' : 'text-blue-400'}`}>{complaint.priority}</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> {t('detailedDesc')}
                   </p>
                   <p className="text-slate-300 leading-relaxed text-lg italic">"{complaint.description}"</p>
                </div>
              </div>
           </div>

           {/* Section 2: Proof Display */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Original Proof */}
              <div className="glass-card rounded-[2.5rem] p-8 border border-white/5 shadow-xl">
                 <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-blue-400" /> Citizen Submitted Proof
                 </h3>
                 <div className="rounded-2xl overflow-hidden aspect-video border border-white/10 group relative cursor-zoom-in"
                      onClick={() => setPreviewImage(complaint.image)}>
                    <img src={complaint.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Maximize2 className="w-10 h-10 text-white opacity-50" />
                    </div>
                    <div className="absolute bottom-4 left-4 glass px-3 py-1 rounded-full text-[9px] font-bold text-white uppercase tracking-widest">Before Work</div>
                 </div>
              </div>

              {/* Resolution Proof - Functional Form */}
              <div className="glass-card rounded-[2.5rem] p-8 border border-white/5 shadow-xl">
                 <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" /> {t('workProof')}
                 </h3>
                 {complaint.afterImage ? (
                    <div className="space-y-4">
                       <div className="rounded-2xl overflow-hidden aspect-video border border-green-500/20 group relative cursor-zoom-in"
                            onClick={() => setPreviewImage(complaint.afterImage)}>
                          <img src={complaint.afterImage} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-green-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <Maximize2 className="w-10 h-10 text-white opacity-50" />
                          </div>
                          <div className="absolute bottom-4 left-4 glass px-3 py-1 rounded-full text-[9px] font-bold text-white uppercase tracking-widest border-green-500/30">After Work</div>
                       </div>
                       <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/10 italic text-sm text-slate-300">
                          "{complaint.resolutionNotes}"
                       </div>
                    </div>
                 ) : (
                    <div className="space-y-6">
                       <div className="p-6 rounded-3xl bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center relative group hover:border-blue-500/50 transition-colors">
                          <input type="file" accept="image/*" onChange={handleProofImage} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                          {workProofData.image ? (
                             <img src={workProofData.image} className="w-full h-32 object-cover rounded-xl" />
                          ) : (
                             <>
                                <Camera className="w-8 h-8 text-slate-500 mb-2 group-hover:text-blue-400 transition-colors" />
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Upload Resolution Image</p>
                             </>
                          )}
                       </div>
                       <textarea 
                         value={workProofData.notes}
                         onChange={e => setWorkProofData({...workProofData, notes: e.target.value})}
                         placeholder="Enter resolution notes (e.g. Pipeline repaired successfully)..."
                         className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-blue-500 outline-none resize-none h-24 transition-all shadow-inner"
                       />
                       <button 
                         onClick={submitWorkProof}
                         className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold text-sm shadow-lg shadow-green-600/20 hover:scale-[1.02] transition-transform active:scale-95 flex items-center justify-center gap-2"
                       >
                          <Send className="w-4 h-4" /> Submit & Mark Resolved
                       </button>
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* Right Column: Timeline & Actions */}
        <div className="space-y-8">
           
           {/* Section 3: Complaint Timeline */}
           <div className="glass-card rounded-[2.5rem] p-8 border border-white/5 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                 <Activity className="w-5 h-5 text-purple-400" /> Lifecycle Status
              </h3>
              <div className="space-y-8 relative">
                 <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-500 via-white/10 to-transparent" />
                 
                 {(complaint.updates || []).slice().reverse().map((u, i) => (
                    <div key={i} className="flex gap-6 relative z-10">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${i === 0 ? 'bg-blue-600 border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-[#0b1121] border-white/10'}`}>
                          {i === 0 ? <div className="w-2 h-2 rounded-full bg-white animate-pulse" /> : <div className="w-1.5 h-1.5 rounded-full bg-white/20" />}
                       </div>
                       <div>
                          <p className={`text-sm font-bold ${i === 0 ? 'text-white' : 'text-slate-500'}`}>{u.text}</p>
                          <p className="text-[10px] text-slate-600 font-mono mt-1 uppercase tracking-tighter">{u.date}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Section 4: Admin Actions */}
           <div className="glass-card rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none" />
              <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2 relative z-10">
                 <ShieldCheck className="w-5 h-5 text-blue-400" /> Operational Control
              </h3>

              <div className="space-y-4 relative z-10">
                 {complaint.status === 'Submitted' && (
                    <button onClick={handleAssign} className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all transform active:scale-95">
                       <User className="w-5 h-5" /> {t('assignWorker')}
                    </button>
                 )}

                 {complaint.status === 'Assigned' && (
                    <button onClick={() => updateComplaintStatus(id, 'Work In Progress')} className="w-full py-4 rounded-2xl bg-cyan-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 hover:bg-cyan-500 transition-all transform active:scale-95">
                       <Clock className="w-5 h-5" /> Start Field Work
                    </button>
                 )}

                 {complaint.assignedWorker && (
                    <div className="p-5 rounded-3xl bg-white/5 border border-white/10 mt-4">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center font-bold text-blue-400 border border-blue-500/20 shadow-inner">
                             {complaint.assignedWorker[0]}
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{t('assignedWorker')}</p>
                             <p className="text-white font-bold text-lg">{complaint.assignedWorker}</p>
                             <p className="text-[9px] text-cyan-400 uppercase font-bold tracking-tighter">{complaint.assignedDept}</p>
                          </div>
                       </div>
                    </div>
                 )}

                 {complaint.status === 'Resolved' && (
                    <div className="p-8 rounded-3xl bg-green-500/10 border border-green-500/20 text-center space-y-3">
                       <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
                       <h4 className="text-green-400 font-bold uppercase tracking-widest text-sm">Complaint Closed</h4>
                       <p className="text-slate-400 text-xs leading-relaxed">Verified and closed by citizen Arul Kumar.</p>
                    </div>
                 )}

                 {complaint.status === 'Awaiting Citizen Confirmation' && (
                    <div className="p-8 rounded-3xl bg-purple-500/10 border border-purple-500/20 text-center space-y-4 animate-pulse">
                       <Clock className="w-12 h-12 text-purple-400 mx-auto" />
                       <h4 className="text-purple-400 font-bold uppercase tracking-widest text-sm">Awaiting Verify</h4>
                       <p className="text-slate-400 text-xs leading-relaxed">Proof submitted. Waiting for citizen verification.</p>
                    </div>
                 )}
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

export default AdminComplaintDetails;

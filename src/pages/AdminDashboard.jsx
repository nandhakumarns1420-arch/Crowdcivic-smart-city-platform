import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, CheckCircle, Clock, AlertTriangle, 
  Search, ShieldCheck, Camera, User, Building,
  Bell, Activity, Map as MapIcon, Layers, Download, X, Send
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { usePlatform } from '../context/PlatformContext';
import { useLanguage } from '../context/LanguageContext';

const AdminDashboard = () => {
  const { complaints, updateComplaintStatus, addToast, analytics } = usePlatform();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [activeTab, setActiveTab] = useState('management');
  
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [workProofData, setWorkProofData] = useState({ image: null, notes: '' });

  const safeComplaints = Array.isArray(complaints) ? complaints : [];

  const handleWorkProofImage = (e) => {
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
      alert("Please provide completion image and notes.");
      return;
    }
    updateComplaintStatus(id, 'Awaiting Citizen Confirmation', {
      afterImage: workProofData.image,
      resolutionNotes: workProofData.notes,
      text: 'Work completed. Awaiting citizen verification.'
    });
    setEditingComplaint(null);
    setWorkProofData({ image: null, notes: '' });
  };

  const assignTask = (id) => {
    const dept = prompt("Enter Department (e.g. Public Works):", "Public Works");
    const worker = prompt("Enter Assigned Worker Name:", "Kumar S.");
    if (dept && worker) {
      updateComplaintStatus(id, 'Assigned', {
        assignedDept: dept,
        assignedWorker: worker,
        text: `Complaint assigned to ${worker} (${dept} Dept).`
      });
    }
  };

  const stats = [
    { label: t('totalComplaints'), value: analytics?.total ?? safeComplaints.length, icon: BarChart3, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: t('Pending'), value: (analytics?.status?.Submitted ?? 0) + (analytics?.status?.Pending ?? 0) || safeComplaints.filter(c => c.status === 'Submitted' || c.status === 'Pending').length, icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: t('In Progress'), value: (analytics?.status?.['In Progress'] ?? 0) + (analytics?.status?.['Work In Progress'] ?? 0) + (analytics?.status?.Assigned ?? 0) || safeComplaints.filter(c => c.status === 'Assigned' || c.status === 'Work In Progress' || c.status === 'In Progress').length, icon: Clock, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: t('awaitingVerification'), value: analytics?.status?.['Awaiting Citizen Confirmation'] ?? safeComplaints.filter(c => c.status === 'Awaiting Citizen Confirmation').length, icon: ShieldCheck, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  const filteredComplaints = safeComplaints.filter(c => {
    const matchesSearch = (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || (c.id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' ? true : c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">{t('controlCenter')}</h1>
          <p className="text-slate-400 text-sm tracking-wide">{t('dindigul')} MUNICIPALITY • ADMIN COMMAND</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 self-stretch md:self-auto">
          <button onClick={() => setActiveTab('management')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'management' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>{t('management')}</button>
          <button onClick={() => setActiveTab('analytics')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>{t('analytics')}</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div key={i} whileHover={{ y: -5 }} className="glass-card p-6 rounded-3xl relative overflow-hidden group border border-white/5">
            <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </div>
            <p className="text-4xl font-bold text-white mb-1">{s.value}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'management' ? (
            <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/5">
              <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" placeholder={t('searchPlaceholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                  {['All', 'Submitted', 'Assigned', 'Work In Progress', 'Awaiting Citizen Confirmation', 'Resolved', 'Reopened'].map(st => (
                    <button key={st} onClick={() => setFilterStatus(st)} className={`px-4 py-2 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all ${filterStatus === st ? 'bg-white/10 text-white border border-white/20' : 'text-slate-500 hover:text-slate-300'}`}>
                      {st === 'All' ? t('allStatus') : st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/[0.02] text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <th className="p-4 pl-8">Complaint Details</th>
                      <th className="p-4">Assigned To</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 pr-8 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredComplaints.length > 0 ? filteredComplaints.map((c) => (
                      <tr key={c.id} className="group hover:bg-white/[0.03] transition-colors">
                        <td className="p-4 pl-8">
                          <div className="flex items-center gap-3">
                             {c.image && <img src={c.image} className="w-10 h-10 rounded-lg object-cover border border-white/10" />}
                             <div>
                                <p className="text-sm font-bold text-white mb-0.5">{c.title}</p>
                                <p className="text-[10px] text-slate-500">{c.id} • {c.category}</p>
                             </div>
                          </div>
                        </td>
                        <td className="p-4">
                          {c.assignedWorker ? (
                            <div>
                              <p className="text-xs text-slate-300 font-medium">{c.assignedWorker}</p>
                              <p className="text-[9px] text-slate-500 uppercase tracking-tighter">{c.assignedDept}</p>
                            </div>
                          ) : <span className="text-[10px] text-slate-600 italic">Unassigned</span>}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${c.status === 'Resolved' ? 'bg-green-500' : c.status === 'Reopened' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                            <span className="text-[10px] font-bold text-slate-400">{c.status}</span>
                          </div>
                        </td>
                        <td className="p-4 pr-8 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {c.status === 'Submitted' && (
                              <button onClick={() => assignTask(c.id)} className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20" title="Assign Task"><User className="w-4 h-4" /></button>
                            )}
                            {c.status === 'Assigned' && (
                              <button onClick={() => updateComplaintStatus(c.id, 'Work In Progress')} className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20" title="Start Work"><Clock className="w-4 h-4" /></button>
                            )}
                            {c.status === 'Work In Progress' && (
                              <button onClick={() => setEditingComplaint(c)} className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20" title="Complete Work"><Camera className="w-4 h-4" /></button>
                            )}
                            <button className="p-2 rounded-lg bg-white/5 text-slate-500 hover:text-white"><Download className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="p-10 text-center text-slate-500 italic">No complaints found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-[2.5rem] p-8 border border-white/5">
              <h3 className="text-lg font-bold text-white mb-8">Performance Analytics</h3>
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <BarChart data={analytics ? [
                    { name: 'Garbage', count: analytics.categories?.Garbage ?? 0 },
                    { name: 'Water', count: (analytics.categories?.Water ?? 0) + (analytics.categories?.['Water supply'] ?? 0) },
                    { name: 'Roads', count: analytics.categories?.Roads ?? 0 },
                    { name: 'Electricity', count: (analytics.categories?.Electricity ?? 0) + (analytics.categories?.Lighting ?? 0) },
                    { name: 'Others', count: (analytics.categories?.Others ?? 0) + (analytics.categories?.Sanitation ?? 0) },
                  ] : [
                    { name: 'Garbage', count: safeComplaints.filter(c => c.category === 'Garbage').length },
                    { name: 'Water', count: safeComplaints.filter(c => c.category === 'Water' || c.category === 'Water supply').length },
                    { name: 'Roads', count: safeComplaints.filter(c => c.category === 'Roads').length },
                    { name: 'Electricity', count: safeComplaints.filter(c => c.category === 'Electricity' || c.category === 'Lighting').length },
                    { name: 'Others', count: safeComplaints.filter(c => c.category === 'Others' || c.category === 'Sanitation').length },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tick={{fill: '#64748b'}} />
                    <YAxis tick={{fill: '#64748b'}} />
                    <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px' }} />
                    <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Widgets */}
        <div className="lg:col-span-1 space-y-8">
           <div className="glass-card rounded-[2rem] p-6 border border-white/5">
              <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                <Bell className="w-4 h-4 text-yellow-400" /> Notifications
              </h3>
              <div className="space-y-4">
                 {safeComplaints.filter(c => c.status === 'Reopened').map((c, i) => (
                   <div key={i} className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                      <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Citizen Rework</p>
                      <p className="text-xs text-white leading-tight">{c.id} requested rework: "{c.reopenedReason}"</p>
                   </div>
                 ))}
                 <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[11px] font-bold text-white mb-1">System Maintenance</p>
                    <p className="text-[10px] text-slate-500">Scheduled for tonight 02:00 AM</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Work Completion Modal */}
      <AnimatePresence>
        {editingComplaint && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050D1A]/90 backdrop-blur-xl">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card max-w-lg w-full p-10 border border-blue-500/20 rounded-[3rem] shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-2xl font-bold text-white">Upload Completion Proof</h3>
                 <button onClick={() => setEditingComplaint(null)} className="text-slate-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Before Photo</p>
                      <div className="h-32 rounded-xl overflow-hidden border border-white/5 bg-black/40">
                         <img src={editingComplaint.image} className="h-full w-full object-cover grayscale opacity-50" />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">After Photo (Upload)</p>
                      <div className="relative group h-32 rounded-xl border-2 border-dashed border-blue-500/30 hover:border-blue-500/50 bg-blue-500/5 transition-all flex flex-col items-center justify-center">
                         <input type="file" accept="image/*" onChange={handleWorkProofImage} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                         {workProofData.image ? (
                            <img src={workProofData.image} className="h-full w-full object-cover rounded-lg p-1" />
                         ) : (
                            <Camera className="w-6 h-6 text-blue-400 opacity-50" />
                         )}
                      </div>
                   </div>
                </div>

                <div>
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Resolution Notes</label>
                   <textarea rows="4" value={workProofData.notes} onChange={e => setWorkProofData({...workProofData, notes: e.target.value})}
                    placeholder="Describe the work done..." className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-all resize-none" />
                </div>

                <button onClick={() => submitWorkProof(editingComplaint.id)} className="w-full py-4 rounded-xl btn-primary text-white font-bold flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Submit for Verification
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;

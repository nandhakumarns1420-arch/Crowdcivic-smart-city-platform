import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Calendar, User, Shield, 
  Activity, Filter, Clock, ArrowRight,
  UserCheck, FileText, CheckCircle, AlertCircle, RotateCcw, Camera
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlatform } from '../context/PlatformContext';
import { useLanguage } from '../context/LanguageContext';

const AdminLogs = () => {
  const { complaints } = usePlatform();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const safeComplaints = Array.isArray(complaints) ? complaints : [];

  // Consolidate all updates into a single chronological log
  const allLogs = safeComplaints.flatMap(c => 
    (c.updates || []).map(u => ({
      ...u,
      complaintId: c.id,
      category: c.category,
      title: c.title,
      timestamp: new Date(u.date).getTime()
    }))
  ).sort((a, b) => b.timestamp - a.timestamp);

  const filteredLogs = allLogs.filter(log => {
    const matchesSearch = log.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         log.complaintId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getLogIcon = (text) => {
    const t = text.toLowerCase();
    if (t.includes('filed')) return <FileText className="w-4 h-4 text-blue-400" />;
    if (t.includes('assigned')) return <User className="w-4 h-4 text-purple-400" />;
    if (t.includes('completed') || t.includes('proof')) return <Camera className="w-4 h-4 text-cyan-400" />;
    if (t.includes('confirmed') || t.includes('closed')) return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (t.includes('rework') || t.includes('reopened')) return <RotateCcw className="w-4 h-4 text-red-400" />;
    return <Activity className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">{t('activityLogs')}</h1>
          <p className="text-slate-400 text-sm tracking-wide uppercase">{t('systemAudit')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
           <div className="glass-card p-6 rounded-[2rem] border border-white/5 space-y-6">
              <div>
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">{t('filterDate')}</label>
                 <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="date" className="w-full bg-black/30 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500" />
                 </div>
              </div>

              <div>
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">{t('filterUser')}</label>
                 <select className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 appearance-none">
                    <option>All Users</option>
                    <option>Arul Kumar (Citizen)</option>
                    <option>Rajesh K. (Field)</option>
                 </select>
              </div>

              <div>
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">{t('filterAdmin')}</label>
                 <select className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 appearance-none">
                    <option>All Admins</option>
                    <option>Admin Officer</option>
                    <option>System Auto</option>
                 </select>
              </div>

              <div className="pt-4 border-t border-white/5">
                 <button className="w-full py-3 rounded-xl bg-white/5 text-slate-400 text-[10px] font-bold uppercase hover:bg-white/10 hover:text-white transition-all">Clear All Filters</button>
              </div>
           </div>

           <div className="glass-card p-6 rounded-[2rem] border border-white/5">
              <h3 className="text-xs font-bold text-white mb-4">Audit Summary</h3>
              <div className="space-y-3">
                 <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">Chronological Events</span>
                    <span className="text-white font-bold">{filteredLogs.length}</span>
                 </div>
                 <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">Traceable Nodes</span>
                    <span className="text-blue-400 font-bold">{safeComplaints.length}</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Timeline View */}
        <div className="lg:col-span-3 space-y-6">
           <div className="glass-card rounded-[2rem] p-8 border border-white/5 shadow-2xl">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
                 <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="text" placeholder={t('activitySearch')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500" />
                 </div>
                 <div className="flex gap-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                       <Clock className="w-3 h-3" /> Real-time Streaming
                    </span>
                 </div>
              </div>

              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                 {filteredLogs.map((log, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                      className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                       
                       {/* Dot */}
                       <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-[#050D1A] shadow-xl z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 group-hover:border-blue-500 transition-colors">
                          {getLogIcon(log.text)}
                       </div>

                       {/* Content */}
                       <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                            onClick={() => navigate(`/admin/complaints/${log.complaintId}`)}>
                          <div className="flex items-center justify-between space-x-2 mb-2">
                             <div className="font-bold text-white text-sm">{log.text}</div>
                             <time className="font-mono text-[9px] text-blue-400 uppercase">{log.date}</time>
                          </div>
                          <div className="text-slate-500 text-[10px] flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                             <div className="flex items-center gap-2">
                                <span className="bg-blue-500/10 px-2 py-0.5 rounded text-blue-300 font-mono font-bold">{log.complaintId}</span>
                                <span>•</span>
                                <span className="uppercase tracking-widest">{log.category}</span>
                             </div>
                             <div className="text-blue-400 flex items-center gap-1 font-bold group-hover:translate-x-1 transition-transform">
                                TRACE <ArrowRight className="w-3 h-3" />
                             </div>
                          </div>
                       </div>
                    </motion.div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AdminLogs;

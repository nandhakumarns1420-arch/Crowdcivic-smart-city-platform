import { motion } from 'framer-motion';
import { 
  BarChart3, CheckCircle, Clock, AlertTriangle, 
  ShieldCheck, Activity, Bell, Map as MapIcon, 
  TrendingUp, Zap, Users, Building
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell,
  AreaChart, Area
} from 'recharts';
import { usePlatform } from '../context/PlatformContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const AdminControlCenter = () => {
  const { complaints, analytics } = usePlatform();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const safeComplaints = Array.isArray(complaints) ? complaints : [];

  const stats = [
    { label: t('totalComplaints'), value: analytics?.total ?? safeComplaints.length, icon: BarChart3, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: t('Pending'), value: (analytics?.status?.Submitted ?? 0) + (analytics?.status?.Pending ?? 0) || safeComplaints.filter(c => c.status === 'Submitted' || c.status === 'Pending').length, icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: t('Work In Progress'), value: (analytics?.status?.['In Progress'] ?? 0) + (analytics?.status?.['Work In Progress'] ?? 0) + (analytics?.status?.Assigned ?? 0) || safeComplaints.filter(c => c.status === 'Assigned' || c.status === 'Work In Progress' || c.status === 'In Progress').length, icon: Clock, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: t('awaitingVerification'), value: analytics?.status?.['Awaiting Citizen Confirmation'] ?? safeComplaints.filter(c => c.status === 'Awaiting Citizen Confirmation').length, icon: ShieldCheck, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: t('Resolved'), value: analytics?.status?.Resolved ?? safeComplaints.filter(c => c.status === 'Resolved').length, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: t('Reopened'), value: analytics?.status?.Reopened ?? safeComplaints.filter(c => c.status === 'Reopened').length, icon: Activity, color: 'text-red-400', bg: 'bg-red-500/10' },
  ];

  // Derive dynamic category data from analytics or complaints
  const categoryData = analytics?.categories ? Object.entries(analytics.categories).map(([name, count]) => ({
    name,
    count,
    color: name === 'Roads' ? '#3b82f6' : name === 'Sanitation' ? '#06b6d4' : name === 'Lighting' ? '#8b5cf6' : name === 'Water supply' ? '#10b981' : '#f59e0b'
  })) : [];

  // If no analytics categories, fallback to empty or some default
  const chartData = categoryData.length > 0 ? categoryData : [
    { name: 'Roads', count: 0, color: '#3b82f6' },
    { name: 'Sanitation', count: 0, color: '#06b6d4' },
    { name: 'Lighting', count: 0, color: '#8b5cf6' },
    { name: 'Water', count: 0, color: '#10b981' },
  ];

  const deptData = [
    { name: 'Electrical', performance: 92 },
    { name: 'Water', performance: 85 },
    { name: 'Sanitation', performance: 78 },
    { name: 'Roads', performance: 65 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">{t('controlCenter')}</h1>
          <p className="text-slate-400 text-sm tracking-wide">{t('monitoring')}</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
           <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
           <span className="text-xs font-bold uppercase tracking-widest">Live System Status: Optimal</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} whileHover={{ y: -5 }} 
            className="glass-card p-5 rounded-2xl border border-white/5 relative overflow-hidden group">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-white mb-0.5">{s.value}</p>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-tight">{s.label}</p>
            <div className={`absolute top-0 right-0 w-16 h-16 ${s.bg} opacity-10 rounded-full -mr-6 -mt-6`} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Department Performance */}
        <div className="lg:col-span-8 space-y-8">
           <div className="glass-card rounded-[2.5rem] p-8 border border-white/5">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-lg font-bold text-white flex items-center gap-2">
                   <Building className="w-5 h-5 text-blue-400" /> {t('deptPerformance')}
                 </h3>
                 <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase">
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /> Efficiency</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-700" /> Volume</span>
                 </div>
              </div>
              
              <div className="space-y-6">
                 {deptData.map((dept, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between items-end">
                          <p className="text-sm font-bold text-white">{dept.name}</p>
                          <p className="text-xs font-mono text-blue-400">{dept.performance}%</p>
                       </div>
                       <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${dept.performance}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400" />
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Category Analytics */}
           <div className="glass-card rounded-[2.5rem] p-8 border border-white/5">
              <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" /> {t('categoryAnalytics') || "Issue Category Analytics"}
              </h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip 
                      cursor={{fill: 'rgba(255,255,255,0.02)'}}
                      contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="lg:col-span-4 space-y-8">
           
           {/* Heatmap Summary Preview */}
           <div className="glass-card rounded-[2rem] p-8 border border-white/5 h-80 relative overflow-hidden group">
              <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                <MapIcon className="w-4 h-4 text-cyan-400" /> {t('heatmapSummary')}
              </h3>
              <div className="absolute inset-0 grayscale opacity-20 pointer-events-none transition-transform duration-1000 group-hover:scale-110">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="map" />
              </div>
              <div className="relative w-full h-full">
                <div className="absolute top-1/4 left-1/3 w-16 h-16 bg-red-500/20 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/2 left-1/2 w-20 h-24 bg-blue-500/10 rounded-full blur-2xl" />
              </div>
           </div>

           {/* Live Feed */}
           <div className="glass-card rounded-[2rem] p-6 border border-white/5">
              <h3 className="text-sm font-bold text-white mb-6 flex items-center justify-between">
                <span className="flex items-center gap-2"><Bell className="w-4 h-4 text-yellow-400" /> {t('notificationFeed')}</span>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              </h3>
              <div className="space-y-4">
                 {safeComplaints.slice(0, 3).map((c, i) => (
                   <div key={i} onClick={() => navigate(`/admin/complaints/${c.id}`)} className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                      <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0`}>
                         <Activity className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-white leading-tight mb-1">{c.title}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">{c.id} • {t(c.status)}</p>
                      </div>
                   </div>
                 ))}
                 {safeComplaints.length === 0 && (
                    <p className="text-[10px] text-slate-500 text-center py-4">No recent activity</p>
                 )}
              </div>
              <button onClick={() => navigate('/admin/logs')} className="w-full mt-6 py-3 rounded-xl border border-white/10 text-[10px] font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest">
                {t('auditLog')}
              </button>
           </div>

        </div>
      </div>
    </div>
  );
};

export default AdminControlCenter;

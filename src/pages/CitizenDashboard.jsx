import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Send, AlertTriangle, TrendingUp, 
  AlertCircle, Bell, Clock, Camera, 
  CheckCircle, ArrowRight, ShieldCheck, X
} from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { usePlatform } from '../context/PlatformContext';
import { useLanguage } from '../context/LanguageContext';
import { dindigulWards } from '../data/mockData';
import LiveMap from '../components/LiveMap';
import LocationAutocomplete from '../components/LocationAutocomplete';

const CitizenDashboard = () => {
  const { complaints, submitComplaint, checkDuplicate, analytics } = usePlatform();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', category: 'Roads', location: '', 
    ward: 'Ward 1', description: '', image: null,
    lat: null, lng: null
  });

  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.log("Geolocation error:", error)
      );
    }
  }, []);

  const safeComplaints = Array.isArray(complaints) ? complaints : [];
  
  // Use analytics from server if available, fallback to client-side for immediate feedback
  const total = analytics?.total ?? safeComplaints.length;
  const resolved = analytics?.status?.Resolved ?? safeComplaints.filter(c => c.status === 'Resolved').length;
  const pending = (analytics?.status?.Submitted ?? 0) + (analytics?.status?.Pending ?? 0) || safeComplaints.filter(c => c.status === 'Submitted' || c.status === 'Pending').length;
  const inProgress = (analytics?.status?.['In Progress'] ?? 0) + (analytics?.status?.['Work In Progress'] ?? 0) + (analytics?.status?.Assigned ?? 0) || safeComplaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned' || c.status === 'Work In Progress').length;

  const recentActivity = safeComplaints.slice(0, 3).map(c => ({
    id: c.id,
    action: c.status === 'Resolved' ? t('issueResolved') : t('newReport'),
    time: '2 hours ago',
    status: c.status
  }));

  const verificationNeeded = safeComplaints.filter(c => c.status === 'Awaiting Citizen Confirmation');

  const chartData = [
    { name: 'Mon', count: 4 }, { name: 'Tue', count: 7 }, { name: 'Wed', count: 5 },
    { name: 'Thu', count: 12 }, { name: 'Fri', count: 8 }, { name: 'Sat', count: 15 },
    { name: 'Sun', count: 10 },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    if (!formData.image) {
      alert("Please upload a complaint photo.");
      return;
    }

    if (!formData.lat || !formData.lng) {
      alert("Please select a location from the suggestions.");
      return;
    }

    const duplicateData = checkDuplicate(formData.category, formData.lat, formData.lng, formData.title);
    if (duplicateData && !showDuplicateWarning) {
      setShowDuplicateWarning(duplicateData);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await submitComplaint(formData);
      
      setIsSubmitting(false);
      setShowDuplicateWarning(false);
      setSuccessData(result);
      setFormData({ 
        title: '', category: 'Roads', location: '', 
        ward: 'Ward 1', description: '', image: null,
        lat: null, lng: null 
      });
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const handleLocationSelect = (loc) => {
    setFormData({
      ...formData,
      location: loc.address,
      lat: loc.lat,
      lng: loc.lng
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* Verification Notification */}
      <AnimatePresence>
        {verificationNeeded.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 border-l-4 border-l-purple-500 rounded-3xl bg-purple-500/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 shrink-0 shadow-lg">
                <CheckCircle className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Action Required: Verify Resolved Issue</h3>
                <p className="text-sm text-slate-400 leading-relaxed">The administration has marked <span className="text-purple-400 font-mono font-bold">{verificationNeeded[0].id}</span> as completed. Please verify the work.</p>
              </div>
            </div>
            <button onClick={() => navigate(`/dashboard/reports/${verificationNeeded[0].id}`)} 
              className="px-8 py-3.5 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-500 transition-all shadow-lg shadow-purple-600/30 whitespace-nowrap">
              Review & Confirm
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t('totalReports'), value: total, color: 'border-blue-500', glow: 'shadow-blue-500/20' },
          { label: t('pending'), value: pending, color: 'border-yellow-500', glow: 'shadow-yellow-500/20' },
          { label: t('inProgress'), value: inProgress, color: 'border-cyan-500', glow: 'shadow-cyan-500/20' },
          { label: t('resolved'), value: resolved, color: 'border-green-500', glow: 'shadow-green-500/20' }
        ].map((stat, i) => (
          <div key={i} className={`glass-card p-5 border-t-2 ${stat.color} rounded-2xl shadow-lg ${stat.glow}`}>
            <p className="text-sm font-medium text-slate-400 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Analytics */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Report Form */}
          <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-400" /> {t('reportIssue')}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1 block">{t('issueTitle')}</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1 block">{t('category')}</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 appearance-none">
                    <option className="bg-slate-900">Roads</option>
                    <option className="bg-slate-900">Sanitation</option>
                    <option className="bg-slate-900">Lighting</option>
                    <option className="bg-slate-900">Water supply</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1 block">{t('wardNumber')}</label>
                  <select value={formData.ward} onChange={e => setFormData({...formData, ward: e.target.value})}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 appearance-none">
                    {dindigulWards.map(w => <option key={w} className="bg-slate-900">{w}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 mb-1 block">{t('location')}</label>
                <LocationAutocomplete 
                  value={formData.location} 
                  onChange={val => setFormData({...formData, location: val})}
                  onSelect={handleLocationSelect}
                  placeholder={t('locationPlaceholder') || "Search location in Dindigul..."}
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1 block">Complaint Photo</label>
                <div className="relative group">
                  <input type="file" accept="image/*" onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className={`w-full h-32 bg-black/30 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center transition-colors group-hover:border-blue-500/50 ${formData.image ? 'border-green-500/50' : ''}`}>
                    {formData.image ? (
                      <div className="relative h-full w-full p-2">
                        <img src={formData.image} className="h-full w-full object-cover rounded-lg" alt="Preview" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                           <Camera className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <Camera className="w-6 h-6 text-slate-500 mb-2" />
                        <p className="text-[10px] text-slate-500">Tap to capture or upload</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 mb-1 block">{t('detailedDesc')}</label>
                <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
                  placeholder={t('descPlaceholder')}
                />
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2">
                {isSubmitting ? "Submitting..." : <><Send className="w-4 h-4" /> {t('submitReport')}</>}
              </button>
            </form>
          </div>

          {/* Mini Analytics */}
          <div className="glass-card rounded-3xl p-6">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> {t('weeklyTrend')}
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#06B6D4" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-sm font-bold text-white flex items-center gap-2">
                 <Bell className="w-4 h-4 text-yellow-400" /> Recent Activity
               </h3>
               <Link to="/dashboard/reports" className="text-[10px] font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest">View All</Link>
            </div>
            <div className="space-y-4">
               {recentActivity.map((act, i) => (
                 <div key={i} onClick={() => navigate(`/dashboard/reports/${act.id}`)} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${act.status === 'Resolved' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                       <Clock className="w-4 h-4" />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-white">{act.action}</p>
                       <p className="text-[10px] text-slate-500">{act.id}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Map */}
        <div className="lg:col-span-8">
          <div className="glass-card rounded-[2.5rem] p-2 h-full min-h-[600px] relative overflow-hidden">
             <div className="absolute top-6 left-6 z-[400] glass px-4 py-2 rounded-xl border border-white/5 shadow-2xl pointer-events-none">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                   <span className="text-xs font-bold text-white uppercase tracking-widest">{t('liveMap')}</span>
                </div>
             </div>
             <LiveMap />
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {successData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050D1A]/90 backdrop-blur-xl">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card max-w-md w-full p-10 border border-green-500/30 rounded-[3rem] shadow-2xl shadow-green-500/10 text-center relative">
              <div className="w-20 h-20 bg-green-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">Submitted!</h3>
              <p className="text-slate-400 mb-8">Your complaint has been successfully registered in our smart city grid.</p>
              
              <div className="bg-black/40 rounded-2xl p-6 mb-8 border border-white/5 space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Token ID</p>
                  <p className="text-2xl font-mono font-bold text-blue-400">{successData.id}</p>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-4">
                   <div className="text-left">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</p>
                      <p className="text-sm font-bold text-yellow-400 uppercase tracking-tighter">{successData.status}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Priority</p>
                      <p className="text-sm font-bold text-blue-400 uppercase tracking-tighter">{successData.priority}</p>
                   </div>
                </div>
              </div>

              <button onClick={() => setSuccessData(null)}
                className="w-full py-4 rounded-xl btn-primary text-white font-bold text-base shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                Continue to Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Duplicate Warning Popup */}
      <AnimatePresence>
        {showDuplicateWarning && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050D1A]/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card max-w-md w-full p-8 border border-yellow-500/30 rounded-3xl shadow-2xl shadow-yellow-500/10">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white text-center mb-2">{t('similarIssue')}</h3>
              <p className="text-sm text-slate-400 text-center mb-4">{t('matchFound')} <strong className="text-yellow-400">{showDuplicateWarning.confidence}% match</strong></p>
              
              <div className="bg-black/30 rounded-xl p-4 mb-6 border border-white/5">
                <p className="text-xs text-slate-500 mb-1">{t('complaint')}: {showDuplicateWarning.complaint.id}</p>
                <p className="text-sm font-bold text-white">{showDuplicateWarning.complaint.title}</p>
                <p className="text-xs text-slate-400 mt-1"><MapPin className="w-3 h-3 inline mr-1"/>{typeof showDuplicateWarning.complaint.location === 'object' && showDuplicateWarning.complaint.location !== null ? showDuplicateWarning.complaint.location.address : showDuplicateWarning.complaint.location}</p>
              </div>

              <div className="space-y-3">
                <button onClick={() => { setShowDuplicateWarning(null); alert("Supporting existing report..."); }}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-sm shadow-lg shadow-yellow-500/20 hover:scale-[1.02] transition-transform">
                  {t('supportExisting')}
                </button>
                <button onClick={() => { setShowDuplicateWarning(null); handleSubmit(new Event('submit')); }}
                  className="w-full py-4 rounded-xl bg-white/5 text-slate-400 font-bold text-sm hover:bg-white/10 hover:text-white transition-all">
                  {t('reportAnyway')}
                </button>
                <button onClick={() => setShowDuplicateWarning(null)} className="w-full py-2 text-xs text-slate-500 hover:text-white transition-colors">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CitizenDashboard;

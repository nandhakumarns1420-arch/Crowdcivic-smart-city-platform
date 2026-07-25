import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Users, Activity, ArrowRight, ShieldCheck, Zap, Bell, CheckCircle, Clock } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { useLanguage } from '../context/LanguageContext';

const LandingPage = () => {
  const { complaints } = usePlatform();
  const { t } = useLanguage();
  const resolvedCount = Array.isArray(complaints) ? complaints.filter(c => c.status === 'Resolved').length : 0;

  const highlights = [
    { title: t('aiDetection'), desc: t('aiDesc'), icon: Zap, color: 'text-yellow-400' },
    { title: t('realTime'), desc: t('realTimeDesc'), icon: Activity, color: 'text-blue-400' },
    { title: t('smartAnalytics'), desc: t('smartAnalyticsDesc'), icon: ShieldCheck, color: 'text-green-400' },
    { title: t('communityDriven'), desc: t('communityDrivenDesc'), icon: Users, color: 'text-cyan-400' },
  ];

  const recentActivity = Array.isArray(complaints) ? complaints.slice(0, 4).map(c => ({
    id: c.id,
    user: 'Citizen',
    action: c.status === 'Resolved' ? t('issueResolved') : t('newReport'),
    location: typeof c.location === 'object' && c.location !== null ? c.location.address : c.location,
    time: t('justNow'),
    status: c.status
  })) : [];

  return (
    <div className="min-h-screen bg-[#050D1A] text-slate-200">
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=2560"
            alt="Cinematic Smart City"
            className="w-full h-full object-cover scale-105"
            style={{ filter: 'brightness(0.2) saturate(0.8) hue-rotate(180deg)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050D1A]/80 via-transparent to-[#050D1A]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
                <span className="text-xs font-semibold text-cyan-300 tracking-wider uppercase">{t('heroSubtitle')}</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                {t('heroTitle')} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  {t('dindigul')}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-xl leading-relaxed">
                {t('heroDesc')}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/portal" className="btn-primary px-8 py-4 rounded-xl text-white font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25">
                  {t('AccessPortal')} <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>

            {/* Network Visualization (Right side of Hero) */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1 }} className="hidden lg:block relative h-[500px]">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="glass-card w-32 h-32 rounded-full border-2 border-blue-400/50 flex flex-col items-center justify-center relative z-10 shadow-[0_0_40px_rgba(37,99,235,0.4)]">
                    <ShieldCheck className="w-12 h-12 text-blue-400 mb-1" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">{t('dindigul')}</span>
                  </div>
               </div>
               {/* Orbital Nodes */}
               <div className="absolute top-10 left-10 glass p-3 rounded-xl border border-white/10 animate-float">
                  <MapPin className="w-6 h-6 text-red-400" />
               </div>
               <div className="absolute top-10 right-10 glass p-3 rounded-xl border border-white/10 animate-float" style={{animationDelay: '1s'}}>
                  <Activity className="w-6 h-6 text-yellow-400" />
               </div>
               <div className="absolute bottom-10 left-10 glass p-3 rounded-xl border border-white/10 animate-float" style={{animationDelay: '2s'}}>
                  <Users className="w-6 h-6 text-cyan-400" />
               </div>
               <div className="absolute bottom-10 right-10 glass p-3 rounded-xl border border-white/10 animate-float" style={{animationDelay: '3s'}}>
                  <Zap className="w-6 h-6 text-green-400" />
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats & Highlights */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((item, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} className="glass-card p-8 rounded-3xl border border-white/5">
                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Activity Feed */}
      <section className="py-24 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold text-white mb-6" dangerouslySetInnerHTML={{ __html: t('liveActivity').replace('Live', 'Live <br/>') }} />
              <p className="text-slate-400 mb-8">{t('liveActivityDesc')}</p>
              <div className="glass-card p-6 rounded-2xl border border-blue-500/20">
                <p className="text-4xl font-bold text-white mb-1">{resolvedCount}</p>
                <p className="text-sm text-blue-400 font-medium">{t('resolvedThisWeek')}</p>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-4">
              {recentActivity.map((act, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="glass-card p-4 rounded-xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${act.status === 'Resolved' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                      {act.status === 'Resolved' ? <CheckCircle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{act.action}: <span className="text-slate-400 font-normal">{act.id}</span></p>
                      <p className="text-xs text-slate-500">{act.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">{act.time}</p>
                    <div className="flex items-center gap-1 text-[10px] text-cyan-400">
                      <Clock className="w-3 h-3" /> <span>{t('realTimeTag')}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Citizen Engagement CTA */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-12 rounded-[3rem] border border-cyan-500/20 relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 to-cyan-500/10 z-0" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('buildSmarterTitle')}</h2>
              <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
                {t('buildSmarterDesc')}
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/register" className="btn-primary px-10 py-4 rounded-xl text-white font-bold shadow-xl shadow-blue-500/20">
                  {t('registerNow')}
                </Link>
                <Link to="/about" className="glass px-10 py-4 rounded-xl text-white font-bold border border-white/10 hover:bg-white/5 transition-all">
                  {t('learnMore')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;

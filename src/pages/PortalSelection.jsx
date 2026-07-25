import { motion } from 'framer-motion';
import { Shield, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const PortalSelection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const portals = [
    {
      id: 'citizen',
      title: t('citizenPortal'),
      icon: User,
      color: 'from-blue-600 to-cyan-500',
      shadow: 'shadow-blue-500/20',
      desc: 'Report civic issues and track resolution status in real-time.'
    },
    {
      id: 'admin',
      title: t('adminPortal'),
      icon: Shield,
      color: 'from-indigo-600 to-purple-500',
      shadow: 'shadow-indigo-500/20',
      desc: 'Manage complaints, monitor analytics, and coordinate ward actions.'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050D1A] px-4">
      {/* Background orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)', filter: 'blur(50px)' }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', filter: 'blur(50px)' }} />

      <div className="max-w-4xl w-full relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('portalSelection')}</h1>
          <p className="text-slate-400 text-lg">{t('selectRole')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portals.map((portal, i) => (
            <motion.div
              key={portal.id}
              initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => navigate(`/login/${portal.id}`)}
              className="glass-card rounded-[2.5rem] p-10 cursor-pointer group relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${portal.color}`} />
              
              <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${portal.color} flex items-center justify-center mb-8 shadow-2xl ${portal.shadow} group-hover:scale-110 transition-transform`}>
                <portal.icon className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-3xl font-bold text-white mb-4">{portal.title}</h2>
              <p className="text-slate-400 leading-relaxed mb-8">{portal.desc}</p>

              <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-widest text-sm">
                Access Portal <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </div>

              {/* Decorative background element */}
              <div className={`absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-br ${portal.color} opacity-5 blur-3xl rounded-full`} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortalSelection;

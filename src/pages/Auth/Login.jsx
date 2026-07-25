import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { usePlatform } from '../../context/PlatformContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { addToast } = usePlatform();
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { role: urlRole } = useParams();
  
  const [role, setRole] = useState(urlRole || 'citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (urlRole && role !== urlRole) {
      setRole(urlRole);
    }
  }, [urlRole, role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await login(email, password);

    if (result.success) {
      if (result.role !== role) {
        // If user logged in with a different role than the portal they are in
        addToast(`Redirected to ${result.role} portal`, 'info');
      }
      navigate(result.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      addToast(result.message, 'error');
      setIsSubmitting(false);
    }
  };

  const portalName = role === 'admin' ? t('adminPortal') : t('citizenPortal');

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-[#050D1A]">
      {/* Realistic Dindigul Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1596422846543-74c6fc0e2818?auto=format&fit=crop&q=80&w=2560"
          alt="Dindigul Smart City"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#050D1A]/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050D1A] via-[#050D1A]/50 to-transparent" />
        <div className="absolute inset-0 grid-overlay opacity-30" />
      </div>

      <div className="w-full relative z-10 flex flex-col items-center justify-center px-4 py-12">
        
        <Link to="/portal" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Portals</span>
        </Link>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-4 border border-blue-500/30 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
            <Shield className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">CrowdCivic</h1>
          <p className="text-cyan-400 font-medium tracking-widest text-sm uppercase">{t('dindigul')} Smart City</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-md">
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden group">
            {/* Animated glowing border effect */}
            <div className={`absolute -inset-1 bg-gradient-to-r ${role === 'admin' ? 'from-indigo-600 to-purple-500' : 'from-blue-600 to-cyan-500'} rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200`} />
            
            <div className="relative bg-[#0b1121]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-2 text-center">{portalName}</h2>
              <p className="text-slate-400 text-sm text-center mb-8">Enter your credentials to access the system</p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">{t('email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="email" placeholder={role === 'admin' ? 'admin@crowdcivic.com' : 'citizen@crowdcivic.com'} 
                      required value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">{t('password')}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="password" placeholder="••••••••" required
                      value={password} onChange={e => setPassword(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 pb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded bg-black/50 border border-white/20 text-blue-500 focus:ring-0 focus:ring-offset-0" />
                    <span className="text-xs text-slate-400">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300">Forgot password?</Link>
                </div>

                <button type="submit" disabled={isSubmitting}
                  className={`${role === 'admin' ? 'bg-gradient-to-r from-indigo-600 to-purple-500' : 'btn-primary'} w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-xl transition-all`}>
                  {isSubmitting ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-t-transparent rounded-full" />
                  ) : (
                    <>Sign In <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
              
              {role === 'citizen' && (
                <p className="text-center mt-6 text-xs text-slate-500">
                  New citizen? <Link to="/register" className="text-cyan-400 hover:text-cyan-300 ml-1">Create an account</Link>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

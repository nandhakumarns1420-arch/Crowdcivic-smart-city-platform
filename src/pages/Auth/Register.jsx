import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, MapPin, Building, Phone, User, Lock, Bell, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { usePlatform } from '../../context/PlatformContext';
import { useAuth } from '../../context/AuthContext';
import { dindigulWards, dindigulAreas } from '../../data/mockData';

const Register = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { addToast } = usePlatform();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    ward: '',
    area: '',
    role: 'citizen'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    const result = await register(formData);

    if (result.success) {
      addToast('Account created successfully. Welcome to CrowdCivic.', 'success');
      navigate('/dashboard');
    } else {
      addToast(result.message, 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ background: '#050D1A' }}>
      {/* Cinematic smart-city background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=2560"
          alt="Smart City"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.15) saturate(0.8) hue-rotate(180deg)' }}
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(5,13,26,0.95) 0%, rgba(5,13,26,0.6) 50%, rgba(5,13,26,0.95) 100%)' }} />
        <div className="absolute inset-0 grid-overlay opacity-20" />
        
        {/* Animated glowing orbs */}
        <div className="absolute z-0 pointer-events-none"
          style={{ top: '20%', left: '10%', width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)', filter: 'blur(50px)',
            animation: 'float 8s ease-in-out infinite' }} />
        <div className="absolute z-0 pointer-events-none"
          style={{ bottom: '10%', right: '10%', width: 300, height: 300, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', filter: 'blur(40px)',
            animation: 'float 6s 2s ease-in-out infinite' }} />
      </div>

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-5/12 relative z-10 flex-col justify-center px-16 border-r"
        style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(5,13,26,0.4)', backdropFilter: 'blur(10px)' }}>
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <div className="mb-8">
            <Link to="/" className="inline-block w-16 h-16 rounded-2xl flex items-center justify-center mb-6 hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', boxShadow: '0 0 30px rgba(37,99,235,0.3)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 6v6c0 5.1 3.4 9.8 8 11 4.6-1.2 8-5.9 8-11V6L12 2z" fill="url(#sg2)"/>
                <circle cx="12" cy="10" r="2.5" fill="white" opacity="0.9"/>
                <defs><linearGradient id="sg2" x1="4" y1="2" x2="20" y2="22">
                  <stop stopColor="#93C5FD"/><stop offset="1" stopColor="#22D3EE"/>
                </linearGradient></defs>
              </svg>
            </Link>
            <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Join CrowdCivic
            </h1>
            <p className="text-lg font-semibold" style={{ color: '#06B6D4', letterSpacing: '0.15em' }}>DINDIGUL SMART CITY</p>
          </div>
          
          <div className="space-y-6 mt-12">
            {[
              { icon: User, title: 'Citizen Profile', desc: 'Create your verified digital identity for Dindigul Municipality.' },
              { icon: MapPin, title: 'Location Based', desc: 'Automatically route your complaints to the correct ward officials.' },
              { icon: Bell, title: 'Live Updates', desc: 'Get SMS and app notifications on your complaint status.' }
            ].map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (i * 0.1) }}
                className="flex gap-4 items-start p-4 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(37,99,235,0.1)', color: '#60A5FA' }}>
                  <feature.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">{feature.title}</h3>
                  <p className="text-sm" style={{ color: '#64748b' }}>{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-7/12 relative z-10 flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full max-w-xl">
          <div className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden">
            {/* Decorative top gradient */}
            <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #2563EB, #06B6D4)' }} />
            
            {/* Language toggle */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white px-3 py-1 rounded-full" style={{ background: 'rgba(37,99,235,0.2)' }}>Create Account</span>
              </div>
              <button onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}
              >
                <Globe className="w-3.5 h-3.5" />
                {language === 'ta' ? 'English' : 'தமிழ்'}
              </button>
            </div>

            <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {t('registerTitle')}
            </h2>
            <p className="text-sm mb-8" style={{ color: '#475569' }}>Create your CrowdCivic account to start reporting issues.</p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>{t('name')}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="text" name="name" placeholder="Full Name" required
                      value={formData.name} onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>{t('email')}</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input type="email" name="email" placeholder="email@example.com" required
                        value={formData.email} onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white outline-none transition-all"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>{t('mobileNumber')}</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input type="tel" name="mobile" placeholder="98765 43210" required
                        value={formData.mobile} onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white outline-none transition-all"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>{t('password')}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="password" name="password" placeholder="Create a strong password" required
                      value={formData.password} onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>{t('wardNumber')}</label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <select name="ward" required value={formData.ward} onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white outline-none transition-all appearance-none"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        <option value="" disabled className="bg-slate-900">{t('selectWard')}</option>
                        {dindigulWards.map(w => <option key={w} value={w} className="bg-slate-900">{w}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>{t('area')}</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <select name="area" required value={formData.area} onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white outline-none transition-all appearance-none"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        <option value="" disabled className="bg-slate-900">{t('selectArea')}</option>
                        {dindigulAreas.map(a => <option key={a} value={a} className="bg-slate-900">{a}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>{t('district')}</label>
                  <input type="text" value="திண்டுக்கல் / Dindigul" readOnly
                    className="w-full px-4 py-3.5 rounded-xl outline-none"
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.02)', color: '#475569', cursor: 'not-allowed' }}
                  />
                </div>
              </motion.div>

              <div className="pt-4">
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2 py-4 font-semibold text-base"
                  style={{ borderRadius: 12 }}>
                  {isSubmitting ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-t-transparent rounded-full" />
                  ) : (
                    <>{t('registerBtn')} <Check className="w-5 h-5" /></>
                  )}
                </button>
              </div>
            </form>

            <p className="text-center mt-6 text-sm" style={{ color: '#475569' }}>
              {t('haveAccount')}{' '}
              <Link to="/login" style={{ color: '#06B6D4' }}>{t('loginBtn')}</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;

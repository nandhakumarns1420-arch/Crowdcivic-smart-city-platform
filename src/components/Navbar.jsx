import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();

  const links = [
    { name: t('Home'), path: '/' },
    { name: t('AccessPortal'), path: '/portal' },
    { name: t('About'), path: '/about' },
    { name: t('Contact'), path: '/contact' },
  ];

  return (
    <nav className="fixed w-full z-50 glass border-b" style={{ borderColor: 'rgba(37,99,235,0.2)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* AI-generated logo icon */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="relative"
              style={{ width: 44, height: 44 }}
            >
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-xl animate-pulse-glow" 
                style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', borderRadius: 12 }} />
              {/* Icon container */}
              <div className="absolute inset-[2px] rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #1e3a8a, #0e7490)', borderRadius: 10 }}>
                {/* Shield + pin composite icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L4 6v6c0 5.1 3.4 9.8 8 11 4.6-1.2 8-5.9 8-11V6L12 2z" 
                    fill="url(#shield-gradient)" opacity="0.9"/>
                  <circle cx="12" cy="10" r="2.5" fill="white" opacity="0.9"/>
                  <path d="M12 12.5c-1.5 0-3 .8-3 2.5 0 1.5 1.5 2.5 3 2.5s3-1 3-2.5c0-1.7-1.5-2.5-3-2.5z" 
                    fill="white" opacity="0.6"/>
                  <defs>
                    <linearGradient id="shield-gradient" x1="4" y1="2" x2="20" y2="22">
                      <stop stopColor="#60A5FA"/>
                      <stop offset="1" stopColor="#22D3EE"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </motion.div>
            
            <div>
              <div className="font-bold text-xl leading-tight" 
                style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', 
                  background: 'linear-gradient(135deg, #fff 0%, #93C5FD 50%, #22D3EE 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                CrowdCivic
              </div>
              <div className="text-xs font-medium" style={{ color: '#06B6D4', letterSpacing: '0.1em' }}>
                {t('dindigul').toUpperCase()}
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link key={link.name} to={link.path}
                className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{ color: location.pathname === link.path ? '#60A5FA' : '#94a3b8' }}
              >
                {location.pathname === link.path && (
                  <motion.div layoutId="nav-pill" className="absolute inset-0 rounded-lg"
                    style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)' }} />
                )}
                <span className="relative z-10" style={{ color: location.pathname === link.path ? '#93C5FD' : undefined }}>
                  {link.name}
                </span>
              </Link>
            ))}
            <button onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border border-white/10 hover:bg-white/5 transition-all flex items-center gap-2"
              style={{ color: '#06B6D4' }}
            >
              <span className={language === 'en' ? 'text-white' : 'text-slate-500'}>EN</span>
              <div className="w-px h-3 bg-white/20" />
              <span className={language === 'ta' ? 'text-white' : 'text-slate-500'}>தமிழ்</span>
            </button>
            <Link to="/portal"
              className="ml-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', 
                boxShadow: '0 4px 20px rgba(37,99,235,0.4)' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 30px rgba(37,99,235,0.7)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,99,235,0.4)'}
            >
              {t('AccessPortal')}
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: '#94a3b8' }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass border-t px-4 py-4 space-y-1"
          style={{ borderColor: 'rgba(37,99,235,0.2)' }}
        >
          {[...links, { name: t('Login'), path: '/portal' }, { name: t('Register'), path: '/register' }].map(link => (
            <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{ color: location.pathname === link.path ? '#60A5FA' : '#94a3b8',
                background: location.pathname === link.path ? 'rgba(37,99,235,0.1)' : 'transparent' }}
            >{link.name}</Link>
          ))}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;

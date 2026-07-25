import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { forgotPassword } = useAuth();
  const { addToast } = usePlatform();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    const result = await forgotPassword(email);
    
    if (result.success) {
      addToast(result.message, 'success');
      navigate('/reset-password', { state: { email } });
    } else {
      addToast(result.message, 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden items-center justify-center" style={{ background: '#050D1A' }}>
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=2560" alt="Smart City" className="w-full h-full object-cover" style={{ filter: 'brightness(0.15) saturate(0.8) hue-rotate(180deg)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(5,13,26,0.95) 0%, rgba(5,13,26,0.6) 50%, rgba(5,13,26,0.95) 100%)' }} />
        <div className="absolute inset-0 grid-overlay opacity-20" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md px-4">
        <div className="glass-card rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #2563EB, #06B6D4)' }} />
          
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-blue-400" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2 font-space">Forgot Password?</h2>
          <p className="text-sm text-slate-400 mb-8 leading-relaxed">
            Enter your email address and we'll send you a 6-digit OTP to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative text-left">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="email" placeholder="Enter your email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              />
            </div>

            <button type="submit" disabled={isSubmitting || !email} 
              className="btn-primary w-full py-4 rounded-xl font-bold text-white shadow-lg flex justify-center items-center gap-2">
              {isSubmitting ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-t-transparent rounded-full" />
              ) : (
                <>Send Reset Link <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5">
            <Link to="/login" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, ArrowRight, RefreshCcw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOTP, resendOTP } = useAuth();
  const { addToast } = usePlatform();

  const email = location.state?.email || '';
  const type = location.state?.type || 'registration';

  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return addToast('OTP must be 6 digits.', 'error');

    setIsSubmitting(true);
    // Note: We only have verifyOTP currently for registration. Forgot password has a resetPassword method.
    // If we are resetting password, we should actually be on the ResetPassword page.
    if (type === 'registration') {
      const result = await verifyOTP(email, otp);
      if (result.success) {
        addToast('Email verified successfully! Welcome to CrowdCivic.', 'success');
        navigate('/dashboard');
      } else {
        addToast(result.message, 'error');
        setIsSubmitting(false);
      }
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setTimer(60);
    const result = await resendOTP(email, type);
    if (result.success) {
      addToast('OTP resent successfully to your email.', 'success');
    } else {
      addToast(result.message, 'error');
      setTimer(0); // Allow retry immediately if it failed due to server error, unless it's a cooldown error
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden items-center justify-center" style={{ background: '#050D1A' }}>
      {/* Background styling matching Register/Login */}
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
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md px-4">
        <div className="glass-card rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #2563EB, #06B6D4)' }} />
          
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 text-blue-400" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2 font-space">Check your email</h2>
          <p className="text-sm text-slate-400 mb-8 leading-relaxed">
            We've sent a 6-digit verification code to<br />
            <strong className="text-white">{email}</strong>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input 
                type="text" 
                maxLength="6"
                placeholder="0 0 0 0 0 0" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center text-3xl tracking-[0.5em] font-mono py-4 rounded-xl text-white outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                required
              />
            </div>

            <button type="submit" disabled={isSubmitting || otp.length !== 6} 
              className="btn-primary w-full py-4 rounded-xl font-bold text-white shadow-lg flex justify-center items-center gap-2">
              {isSubmitting ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-t-transparent rounded-full" />
              ) : (
                <>Verify Account <ShieldCheck className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-sm text-slate-400">
              Didn't receive the code?{' '}
              <button 
                onClick={handleResend} 
                disabled={timer > 0}
                className={`font-semibold ${timer > 0 ? 'text-slate-500 cursor-not-allowed' : 'text-blue-400 hover:text-blue-300'}`}
              >
                {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;

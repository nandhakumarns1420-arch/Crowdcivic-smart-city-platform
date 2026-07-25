import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetPassword, resendOTP } = useAuth();
  const { addToast } = usePlatform();

  const email = location.state?.email || '';
  
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
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
    if (newPassword.length < 6) return addToast('Password must be at least 6 characters.', 'error');
    if (newPassword !== confirmPassword) return addToast('Passwords do not match.', 'error');

    setIsSubmitting(true);
    const result = await resetPassword(email, otp, newPassword);
    
    if (result.success) {
      addToast('Password reset successfully! You are now logged in.', 'success');
      navigate('/dashboard');
    } else {
      addToast(result.message, 'error');
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setTimer(60);
    const result = await resendOTP(email, 'forgot_password');
    if (result.success) {
      addToast('OTP resent successfully to your email.', 'success');
    } else {
      addToast(result.message, 'error');
      setTimer(0);
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
          
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-green-400" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2 font-space">Reset Password</h2>
          <p className="text-sm text-slate-400 mb-8 leading-relaxed">
            Enter the 6-digit OTP sent to <strong className="text-white">{email}</strong> and your new password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-left">
              <label className="block text-xs font-medium mb-1" style={{ color: '#94a3b8' }}>Verification Code</label>
              <input 
                type="text" 
                maxLength="6"
                placeholder="0 0 0 0 0 0" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center text-xl tracking-[0.5em] font-mono py-3 rounded-xl text-white outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                required
              />
            </div>

            <div className="text-left">
              <label className="block text-xs font-medium mb-1" style={{ color: '#94a3b8' }}>New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="password" placeholder="Min 6 characters" required
                  value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                />
              </div>
            </div>

            <div className="text-left">
              <label className="block text-xs font-medium mb-1" style={{ color: '#94a3b8' }}>Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="password" placeholder="Confirm your new password" required
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting || otp.length !== 6 || newPassword.length < 6} 
              className="btn-primary w-full py-4 rounded-xl font-bold text-white shadow-lg flex justify-center items-center gap-2 mt-4">
              {isSubmitting ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-t-transparent rounded-full" />
              ) : (
                <>Change Password <CheckCircle className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-2">
            <p className="text-sm text-slate-400">
              Didn't receive the code?{' '}
              <button onClick={handleResend} disabled={timer > 0}
                className={`font-semibold ${timer > 0 ? 'text-slate-500 cursor-not-allowed' : 'text-blue-400 hover:text-blue-300'}`}>
                {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
              </button>
            </p>
            <Link to="/login" className="text-xs text-slate-500 hover:text-white transition-colors">
              Cancel and return to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get('/auth/profile');
        if (res.data.success) {
          setUser(res.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        // Only log error if it's not a 401 (which is expected for non-logged in users)
        if (err.response?.status !== 401) {
          console.error('Error loading user:', err);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        if (res.data.token) localStorage.setItem('crowdcivic_token', res.data.token);
        setUser(res.data);
        return { success: true, role: res.data.role };
      }
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        if (res.data.token) localStorage.setItem('crowdcivic_token', res.data.token);
        setUser(res.data);
        return { success: true, role: res.data.role };
      }
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Registration failed. Please try again.' 
      };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      if (res.data.success) {
        if (res.data.token) localStorage.setItem('crowdcivic_token', res.data.token);
        setUser(res.data);
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Verification failed.' };
    }
  };

  const resendOTP = async (email, type) => {
    try {
      const res = await api.post('/auth/resend-otp', { email, type });
      return { success: true, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to resend OTP.' };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await api.post('/auth/forgot-password', { email });
      return { success: true, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to request password reset.' };
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      const res = await api.post('/auth/reset-password', { email, otp, newPassword });
      if (res.data.success) {
        if (res.data.token) localStorage.setItem('crowdcivic_token', res.data.token);
        setUser(res.data);
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to reset password.' };
    }
  };

  const logout = async () => {
    try {
      await api.get('/auth/logout');
      localStorage.removeItem('crowdcivic_token');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      localStorage.removeItem('crowdcivic_token');
      setUser(null); // Still clear user locally
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

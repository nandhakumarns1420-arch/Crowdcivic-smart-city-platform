import OTP from '../models/OTP.js';

/**
 * Generates a 6-digit random OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Checks if the user requested an OTP recently (cooldown)
 * Returns the time remaining in seconds if cooldown is active, 0 otherwise.
 */
export const checkCooldown = async (email, type) => {
  const existingOTP = await OTP.findOne({ email, type }).sort({ createdAt: -1 });
  if (existingOTP) {
    const timeDiff = Date.now() - new Date(existingOTP.createdAt).getTime();
    const cooldownPeriod = 60 * 1000; // 60 seconds
    if (timeDiff < cooldownPeriod) {
      return Math.ceil((cooldownPeriod - timeDiff) / 1000);
    }
  }
  return 0;
};

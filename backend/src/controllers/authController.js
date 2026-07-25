import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import OTP from '../models/OTP.js';
import { generateOTP, checkCooldown } from '../utils/otpService.js';
import { sendOTP, sendWelcomeEmail, sendPasswordChanged } from '../utils/emailService.js';

// @desc    Register user and create auth session immediately
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  const { name, email, password, mobile, ward, area } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'citizen',
      mobile,
      ward,
      area
    });

    sendWelcomeEmail(user.email, user.name).catch(err => console.error('Failed to send welcome email', err));

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendOTP = async (req, res, next) => {
  const { email, type = 'forgot_password' } = req.body;

  try {
    if (type === 'registration') {
      return res.status(400).json({ success: false, message: 'Registration does not require OTP verification.' });
    }

    const cooldown = await checkCooldown(email, type);
    if (cooldown > 0) {
      return res.status(429).json({ success: false, message: `Please wait ${cooldown} seconds before requesting a new OTP.` });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const otpCode = generateOTP();
    await OTP.deleteMany({ email, type });
    await OTP.create({ email, otp: otpCode, type });

    await sendOTP(email, otpCode, type);

    res.status(200).json({ success: true, message: 'OTP resent successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password (Send OTP)
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security, just say email sent.
      return res.status(200).json({ success: true, message: 'If that email is in our system, an OTP has been sent.' });
    }

    const cooldown = await checkCooldown(email, 'forgot_password');
    if (cooldown > 0) {
      return res.status(429).json({ success: false, message: `Please wait ${cooldown} seconds before requesting a new OTP.` });
    }

    const otpCode = generateOTP();
    await OTP.deleteMany({ email, type: 'forgot_password' });
    await OTP.create({ email, otp: otpCode, type: 'forgot_password' });

    await sendOTP(email, otpCode, 'forgot_password');

    res.status(200).json({ success: true, message: 'If that email is in our system, an OTP has been sent.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password (Verify OTP & Change)
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  try {
    const otpRecord = await OTP.findOne({ email, type: 'forgot_password' }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'OTP expired or not found. Please request a new one.' });
    }

    if (otpRecord.attempts >= 3) {
      await OTP.findByIdAndDelete(otpRecord._id);
      return res.status(400).json({ success: false, message: 'Too many failed attempts. Please request a new OTP.' });
    }

    const isMatch = await otpRecord.matchOTP(otp);

    if (!isMatch) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();
    
    await OTP.findByIdAndDelete(otpRecord._id);

    sendPasswordChanged(user.email).catch(err => console.error('Failed to send password changed email', err));

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      sendTokenResponse(user, 200, res);
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = generateToken(user);

  const options = {
    expires: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      mobile: user.mobile,
      ward: user.ward,
      area: user.area,
      token // Still sending token for backward compatibility if needed, but cookie is primary
    });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        ward: user.ward,
        area: user.area
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

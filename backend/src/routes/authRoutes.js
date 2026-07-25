import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getMe,
  logout,
  resendOTP,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

router.post(
  '/register',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    validate
  ],
  register
);

router.post(
  '/resend-otp',
  [
    body('email', 'Please include a valid email').isEmail(),
    validate
  ],
  resendOTP
);

router.post(
  '/forgot-password',
  [
    body('email', 'Please include a valid email').isEmail(),
    validate
  ],
  forgotPassword
);

router.post(
  '/reset-password',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('otp', 'OTP is required').not().isEmpty(),
    body('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    validate
  ],
  resetPassword
);

router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
    validate
  ],
  login
);

router.get('/logout', logout);
router.get('/profile', protect, getMe);

export default router;

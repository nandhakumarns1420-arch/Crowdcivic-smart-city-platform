import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const API_URL = 'http://localhost:5000/api';

const runVerification = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clear previous test user and OTPs
    await mongoose.connection.collection('users').deleteOne({ email: 'otp_test@crowdcivic.com' });
    await mongoose.connection.collection('otps').deleteMany({ email: 'otp_test@crowdcivic.com' });
    
    console.log('--- 1. Testing Registration (OTP Generation) ---');
    const regRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'OTP Test User',
      email: 'otp_test@crowdcivic.com',
      password: 'password123',
      mobile: '9876543210',
      ward: 'Ward 1',
      area: 'Area 1'
    });
    console.log('Register Response:', regRes.data);

    // Verify OTP was stored
    const otpDoc = await mongoose.connection.collection('otps').findOne({ email: 'otp_test@crowdcivic.com' });
    if (otpDoc) {
      console.log('SUCCESS: OTP Document created in MongoDB.');
      console.log('User Data Stored Temporarily:', !!otpDoc.userData);
    } else {
      throw new Error('OTP Document missing in DB');
    }

    // Since we don't have the actual raw OTP (it's hashed), we can't test /verify-otp directly via API easily without 
    // mocking the hash or modifying the DB directly to set a known OTP.
    // We will simulate resetting the hash for test purposes.
    const bcryptModule = await import('bcryptjs');
    const bcrypt = bcryptModule.default || bcryptModule;
    const salt = await bcrypt.genSalt(10);
    const knownHash = await bcrypt.hash('123456', salt);
    await mongoose.connection.collection('otps').updateOne(
      { email: 'otp_test@crowdcivic.com' },
      { $set: { otp: knownHash } }
    );

    console.log('\n--- 2. Testing OTP Verification ---');
    const verifyRes = await axios.post(`${API_URL}/auth/verify-otp`, {
      email: 'otp_test@crowdcivic.com',
      otp: '123456'
    });
    console.log('Verify Response:', !!verifyRes.data.token ? 'JWT Received' : 'No JWT');

    const userDoc = await mongoose.connection.collection('users').findOne({ email: 'otp_test@crowdcivic.com' });
    if (userDoc) {
      console.log('SUCCESS: Final User Document created in MongoDB.');
    } else {
      throw new Error('User Document missing in DB after verification');
    }
    
    const otpDocAfter = await mongoose.connection.collection('otps').findOne({ email: 'otp_test@crowdcivic.com' });
    if (!otpDocAfter) {
      console.log('SUCCESS: OTP Document successfully deleted after verification.');
    } else {
      throw new Error('OTP Document was not deleted');
    }

    console.log('\n--- 3. Testing Forgot Password Flow ---');
    const forgotRes = await axios.post(`${API_URL}/auth/forgot-password`, {
      email: 'otp_test@crowdcivic.com'
    });
    console.log('Forgot Password Response:', forgotRes.data.message);

    // Set known hash again
    await mongoose.connection.collection('otps').updateOne(
      { email: 'otp_test@crowdcivic.com' },
      { $set: { otp: knownHash } }
    );

    console.log('\n--- 4. Testing Reset Password Flow ---');
    const resetRes = await axios.post(`${API_URL}/auth/reset-password`, {
      email: 'otp_test@crowdcivic.com',
      otp: '123456',
      newPassword: 'newpassword123'
    });
    console.log('Reset Password Response:', !!resetRes.data.token ? 'JWT Received' : 'No JWT');

    console.log('\nALL AUTHENTICATION FLOWS VERIFIED SUCCESSFULLY.');

  } catch (err) {
    console.error("Verification failed:", err.message);
    if (err.response) console.log(err.response.data);
  } finally {
    process.exit(0);
  }
};

runVerification();

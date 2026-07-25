import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load env vars
dotenv.config({ path: './.env' });

const createOrUpdateAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    const adminDetails = {
      name: 'System Administrator',
      email: 'admin@crowdcivic.com',
      password: 'CrowdCivic@2026Admin',
      role: 'admin'
    };

    // Check if admin already exists
    let admin = await User.findOne({ email: adminDetails.email });

    if (admin) {
      console.log('Admin account already exists. Updating password...');
      admin.password = adminDetails.password;
      await admin.save();
      console.log('Admin account updated successfully!');
    } else {
      console.log('Admin account does not exist. Creating new one...');
      admin = await User.create(adminDetails);
      console.log('Admin account created successfully!');
    }

    console.log('\nFinal Admin Credentials:');
    console.log(`Email: ${adminDetails.email}`);
    console.log(`Password: ${adminDetails.password}`);

    process.exit(0);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

createOrUpdateAdmin();

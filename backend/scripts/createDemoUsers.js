import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../src/models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Demo user data
const demoAdmin = {
  name: 'Demo Admin',
  email: 'admin@crowdcivic.com',
  password: 'Admin@123',
  role: 'admin',
  mobile: '9999999999',
  ward: 'Admin Ward',
  area: 'Admin Area'
};

const demoCitizen = {
  name: 'Demo Citizen',
  email: 'citizen@crowdcivic.com',
  password: 'Citizen@123',
  role: 'citizen',
  mobile: '9876543210',
  ward: 'Ward 5',
  area: 'Mylapore'
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ MongoDB Connected');
    return true;
  } catch (error) {
    console.error('✗ MongoDB Connection Error:', error.message);
    return false;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✓ MongoDB Disconnected');
  } catch (error) {
    console.error('✗ MongoDB Disconnection Error:', error.message);
  }
};

const seedDemoUsers = async () => {
  console.log('\n🌱 Starting Demo User Seeding...\n');

  if (!await connectDB()) {
    process.exit(1);
  }

  try {
    let adminCreated = false;
    let citizenCreated = false;

    // Check and create admin user
    const adminExists = await User.findOne({ email: demoAdmin.email });
    if (!adminExists) {
      const newAdmin = await User.create(demoAdmin);
      adminCreated = true;
      console.log('✓ Demo Admin Created');
      console.log(`  Email: ${newAdmin.email}`);
      console.log(`  Password: ${demoAdmin.password}`);
      console.log(`  Role: ${newAdmin.role}\n`);
    } else {
      console.log('✓ Demo Admin Already Exists');
      console.log(`  Email: ${adminExists.email}`);
      console.log(`  Role: ${adminExists.role}\n`);
    }

    // Check and create citizen user
    const citizenExists = await User.findOne({ email: demoCitizen.email });
    if (!citizenExists) {
      const newCitizen = await User.create(demoCitizen);
      citizenCreated = true;
      console.log('✓ Demo Citizen Created');
      console.log(`  Email: ${newCitizen.email}`);
      console.log(`  Password: ${demoCitizen.password}`);
      console.log(`  Role: ${newCitizen.role}\n`);
    } else {
      console.log('✓ Demo Citizen Already Exists');
      console.log(`  Email: ${citizenExists.email}`);
      console.log(`  Role: ${citizenExists.role}\n`);
    }

    // Summary
    if (adminCreated || citizenCreated) {
      console.log('━'.repeat(50));
      console.log('✓ Seeding Complete - Demo Accounts Created\n');
    } else {
      console.log('━'.repeat(50));
      console.log('✓ Seeding Complete - All Demo Accounts Already Exist\n');
    }

    console.log('📝 Test Login Information:');
    console.log('━'.repeat(50));
    console.log('\n  Admin Account:');
    console.log(`    Email: ${demoAdmin.email}`);
    console.log(`    Password: ${demoAdmin.password}`);
    console.log(`    URL: http://localhost:3000/login`);
    console.log('\n  Citizen Account:');
    console.log(`    Email: ${demoCitizen.email}`);
    console.log(`    Password: ${demoCitizen.password}`);
    console.log(`    URL: http://localhost:3000/login\n`);

    // Verification: Check if accounts can be retrieved
    const adminCheck = await User.findOne({ email: demoAdmin.email }).select('+password');
    const citizenCheck = await User.findOne({ email: demoCitizen.email }).select('+password');

    if (adminCheck && citizenCheck) {
      console.log('✓ Verification: Both accounts exist in MongoDB');
      
      // Verify passwords work
      const adminPasswordWorks = await adminCheck.matchPassword(demoAdmin.password);
      const citizenPasswordWorks = await citizenCheck.matchPassword(demoCitizen.password);

      if (adminPasswordWorks && citizenPasswordWorks) {
        console.log('✓ Verification: Passwords are correctly hashed and verified');
      } else {
        console.log('✗ Verification: Password verification failed');
      }

      console.log('✓ Verification: Ready for login testing\n');
    } else {
      console.log('✗ Verification: Account retrieval failed\n');
    }

  } catch (error) {
    console.error('\n✗ Error during seeding:', error.message);
    console.error(error);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
};

// Run the seeding
seedDemoUsers();

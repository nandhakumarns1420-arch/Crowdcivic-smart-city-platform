import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const API_URL = 'http://localhost:5000/api';

const run = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    const rawCountBefore = await mongoose.connection.collection('complaints').countDocuments();
    console.log(`\n--- 1. Initial MongoDB Check ---`);
    console.log(`Raw MongoDB Complaints Before: ${rawCountBefore}`);

    console.log(`\n--- 2. Login ---`);
    // Login Admin
    const adminLogin = await axios.post(`${API_URL}/auth/login`, { email: 'admin@crowdcivic.com', password: 'CrowdCivic@2026Admin' });
    const adminToken = adminLogin.data.token;
    console.log('Admin logged in.');

    // Create a new citizen if it doesn't exist, otherwise login
    let citizenToken;
    try {
      const citizenReg = await axios.post(`${API_URL}/auth/register`, { name: 'Citizen Test', email: 'citizen@test.com', password: 'password123' });
      citizenToken = citizenReg.data.token;
      console.log('Citizen registered & logged in.');
    } catch (e) {
      if (e.response && e.response.status === 400) {
        const citizenLogin = await axios.post(`${API_URL}/auth/login`, { email: 'citizen@test.com', password: 'password123' });
        citizenToken = citizenLogin.data.token;
        console.log('Citizen logged in.');
      } else {
        throw e;
      }
    }

    console.log(`\n--- 3. Check Analytics Before ---`);
    const anaBeforeAdmin = await axios.get(`${API_URL}/complaints/analytics`, { headers: { Authorization: `Bearer ${adminToken}` }});
    console.log('Admin Global Analytics Before:', JSON.stringify(anaBeforeAdmin.data.data));
    
    const anaBeforeCit = await axios.get(`${API_URL}/complaints/analytics`, { headers: { Authorization: `Bearer ${citizenToken}` }});
    console.log('Citizen Personal Analytics Before:', JSON.stringify(anaBeforeCit.data.data));

    console.log(`\n--- 4. Citizen Posts New Complaint ---`);
    const newComp = await axios.post(`${API_URL}/complaints`, {
      title: 'Business Flow Verification Test',
      category: 'Water supply',
      location: 'Test Location',
      ward: 'Ward 5',
      description: 'Testing live sync capability',
      lat: 10.36,
      lng: 77.98,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
    }, { headers: { Authorization: `Bearer ${citizenToken}` }});
    console.log('New complaint created. ID:', newComp.data.data.trackingId);

    console.log(`\n--- 5. Final MongoDB Check ---`);
    const rawCountAfter = await mongoose.connection.collection('complaints').countDocuments();
    console.log(`Raw MongoDB Complaints After: ${rawCountAfter}`);

    console.log(`\n--- 6. Check Analytics After ---`);
    const anaAfterAdmin = await axios.get(`${API_URL}/complaints/analytics`, { headers: { Authorization: `Bearer ${adminToken}` }});
    console.log('Admin Global Analytics After:', JSON.stringify(anaAfterAdmin.data.data));

    const anaAfterCit = await axios.get(`${API_URL}/complaints/analytics`, { headers: { Authorization: `Bearer ${citizenToken}` }});
    console.log('Citizen Personal Analytics After:', JSON.stringify(anaAfterCit.data.data));

    console.log(`\n--- 7. Check Admin Notifications ---`);
    const compRes = await axios.get(`${API_URL}/complaints`, { headers: { Authorization: `Bearer ${adminToken}` }});
    console.log(`Total complaints fetched by Admin: ${compRes.data.data.length}`);

    if (rawCountAfter === anaAfterAdmin.data.data.total && rawCountAfter === compRes.data.data.length) {
      console.log('\nSUCCESS: MongoDB, Analytics, and API endpoints are perfectly synchronized in real-time.');
    } else {
      console.log('\nERROR: Data mismatch detected!');
    }

  } catch (err) {
    console.error("Verification failed:", err.message);
    if (err.response) console.log(err.response.data);
  } finally {
    process.exit(0);
  }
};

run();

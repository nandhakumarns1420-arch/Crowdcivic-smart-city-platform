import axios from 'axios';

const adminCredentials = {
  email: 'admin@crowdcivic.com',
  password: 'CrowdCivic@2026Admin'
};

const API_URL = 'http://localhost:5000/api';

const runVerification = async () => {
  try {
    console.log('--- Verifying Admin Login ---');
    const loginRes = await axios.post(`${API_URL}/auth/login`, adminCredentials);
    
    if (loginRes.data.success) {
      console.log('Admin login successful!');
      const token = loginRes.data.token;
      const role = loginRes.data.role;
      console.log(`Role: ${role}`);
      console.log(`JWT Generated: ${token ? 'Yes' : 'No'}`);
      
      // Check for cookie in response headers (simplified check as axios doesn't store cookies by default unless configured)
      const hasCookie = loginRes.headers['set-cookie'] ? 'Yes' : 'No';
      console.log(`HTTP-Only Cookie Sent: ${hasCookie}`);

      if (role !== 'admin') {
        throw new Error('Logged in user is not an admin!');
      }

      console.log('\n--- Verifying Access to Protected Admin Route ---');
      try {
        await axios.put(`${API_URL}/complaints/507f1f77bcf86cd799439011/status`, 
          { status: 'In Progress' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        if (err.response && err.response.status === 404) {
          console.log('Access to admin route authorized (received 404 as expected for invalid ID).');
        } else if (err.response && err.response.status === 403) {
          console.error('Access to admin route FORBIDDEN!');
        } else {
          console.error(`Unexpected error: ${err.message}`);
          if (err.response) console.log(err.response.data);
        }
      }

      console.log('\n--- Verifying Analytics Access ---');
      try {
        const anaRes = await axios.get(`${API_URL}/complaints/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (anaRes.data.success) {
          console.log('Analytics data retrieved successfully.');
        }
      } catch (err) {
        console.error('Failed to access Analytics:', err.message);
      }

    } else {
      console.error('Admin login failed!');
    }
  } catch (err) {
    console.error(`Verification failed: ${err.message}`);
    if (err.response) console.log(err.response.data);
  }
};

runVerification();

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

const verifyDataFlow = async () => {
  try {
    console.log("--- 1. Login as Admin ---");
    const loginRes = await api.post('/auth/login', {
      email: 'admin@crowdcivic.com',
      password: 'CrowdCivic@2026Admin'
    });
    const token = loginRes.data.token;
    console.log("Login successful. Token acquired.");

    console.log("\n--- 2. Fetch Complaints (Admin) ---");
    const compRes = await api.get('/complaints', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`Success! Fetched ${compRes.data.data.length} complaints.`);
    if (compRes.data.data.length > 0) {
      console.log(`First Complaint ID: ${compRes.data.data[0].trackingId}`);
    }

    console.log("\n--- 3. Fetch Analytics ---");
    const anaRes = await api.get('/complaints/analytics', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Success! Analytics Data:");
    console.log(JSON.stringify(anaRes.data.data, null, 2));

    if (anaRes.data.data.total === compRes.data.data.length) {
      console.log("\nVERIFIED: Total complaints count matches analytics.");
    } else {
      console.warn("\nWARNING: Total complaints count does NOT match analytics.");
    }

  } catch (err) {
    console.error("Verification failed:", err.message);
    if (err.response) console.log(err.response.data);
  }
};

verifyDataFlow();

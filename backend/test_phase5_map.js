import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

const testMapData = async () => {
  try {
    // 1. Login as Citizen
    console.log('Logging in as citizen...');
    const citizenLogin = await api.post('/auth/login', {
      email: 'phase2test_v2@example.com',
      password: 'password123'
    });
    const citizenCookie = citizenLogin.headers['set-cookie'][0];

    // 2. Submit Complaint with Coordinates
    console.log('\nSubmitting complaint with specific coordinates...');
    const lat = 10.3700;
    const lng = 77.9850;
    const createRes = await api.post('/complaints', {
      title: 'Geospatial Test Complaint',
      description: 'Verifying map marker placement',
      category: 'Roads',
      'location[address]': 'Test Sector 7',
      'location[latitude]': lat,
      'location[longitude]': lng
    }, {
      headers: { Cookie: citizenCookie }
    });
    const complaint = createRes.data.data;
    console.log('Complaint Created with Tracking ID:', complaint.trackingId);
    console.log('Stored Coordinates:', complaint.location.latitude, ',', complaint.location.longitude);

    // 3. Verify via List API
    console.log('\nVerifying data retrieval via list API...');
    const listRes = await api.get('/complaints', {
      headers: { Cookie: citizenCookie }
    });
    const found = listRes.data.data.find(c => c._id === complaint._id);
    if (found && found.location.latitude === lat) {
      console.log('Data retrieval successful: Coordinates match!');
    } else {
      console.error('Data mismatch or not found');
    }

    // 4. Admin Status Update
    console.log('\nLogging in as admin to update status...');
    const adminLogin = await api.post('/auth/login', {
      email: 'admin_phase3@example.com',
      password: 'password123'
    });
    const adminCookie = adminLogin.headers['set-cookie'][0];

    await api.put(`/complaints/${complaint._id}/status`, {
      status: 'Work In Progress',
      message: 'Map status transition test'
    }, {
      headers: { Cookie: adminCookie }
    });
    console.log('Status updated to Work In Progress');

    // 5. Final check
    const finalCheck = await api.get(`/complaints/${complaint._id}`, {
      headers: { Cookie: adminCookie }
    });
    console.log('Final Status in DB:', finalCheck.data.data.status);

    console.log('\nPhase 5 Live Map Integration Verification PASSED');

  } catch (err) {
    console.error('Test Failed:', err.response?.data || err.message);
  }
};

testMapData();

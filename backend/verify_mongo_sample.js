import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Complaint from './src/models/Complaint.js';

dotenv.config();

const verifyMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Fetch the specific test complaint created in the last step
    const complaint = await Complaint.findOne({ title: 'Geospatial Test Complaint' }).sort('-createdAt');
    
    console.log('--- MONGODB DOCUMENT SAMPLE ---');
    console.log(JSON.stringify(complaint, null, 2));
    console.log('-------------------------------');

    await mongoose.connection.close();
  } catch (err) {
    console.error('Error fetching sample:', err.message);
    process.exit(1);
  }
};

verifyMongo();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Complaint from '../src/models/Complaint.js';

dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

const complaintId = '6a50ab4f3c82d393b50e4fe6';
const citizenId = '6a3a675247a822026a322176';

const main = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const result = await Complaint.updateOne(
    { _id: complaintId },
    { $set: { citizen: citizenId } }
  );
  console.log(JSON.stringify({ matchedCount: result.matchedCount, modifiedCount: result.modifiedCount, complaintId, citizenId }, null, 2));
  await mongoose.disconnect();
};

main();

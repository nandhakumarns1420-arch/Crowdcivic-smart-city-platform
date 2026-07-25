import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    unique: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['Garbage', 'Water', 'Roads', 'Electricity', 'Others', 'Sanitation', 'Lighting', 'Water supply']
  },
  location: {
    address: String,
    latitude: Number,
    longitude: Number
  },
  image: {
    url: String,
    public_id: String
  },
  afterImage: {
    url: String,
    public_id: String
  },
  resolutionNotes: String,
  assignedWorker: String,
  assignedDept: String,
  status: {
    type: String,
    enum: ['Pending', 'Submitted', 'Assigned', 'Work In Progress', 'Awaiting Citizen Confirmation', 'Resolved', 'Reopened', 'Closed'],
    default: 'Submitted'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  citizen: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  timeline: [
    {
      status: String,
      message: String,
      updatedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  confirmedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Complaint', complaintSchema);

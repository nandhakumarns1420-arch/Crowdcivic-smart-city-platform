import Complaint from '../models/Complaint.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { sendStatusUpdate } from '../utils/emailService.js';

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private
export const createComplaint = async (req, res, next) => {
  try {
    if (req.user.role !== 'citizen') {
      return res.status(403).json({ success: false, message: 'Only citizens can submit complaints.' });
    }

    const citizenId = req.user._id || req.user.id;
    req.body.citizen = citizenId;
    
    // Generate tracking ID: CC-YYYY-XXX
    const year = new Date().getFullYear();
    const count = await Complaint.countDocuments();
    const trackingId = `CC-${year}-${String(count + 1).padStart(3, '0')}`;
    req.body.trackingId = trackingId;

    // Handle nested location if sent as location[address], etc.
    if (!req.body.location && req.body['location[address]']) {
      req.body.location = {
        address: req.body['location[address]'],
        latitude: parseFloat(req.body['location[latitude]']),
        longitude: parseFloat(req.body['location[longitude]'])
      };
    }

    // If there's an image uploaded via Cloudinary/Multer
    if (req.file) {
      req.body.image = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }

    const complaint = await Complaint.create(req.body);

    // Create notification for the citizen
    await Notification.create({
      user: citizenId,
      title: 'Complaint Submitted',
      message: `Your complaint "${complaint.title}" has been successfully submitted. Tracking ID: ${complaint.trackingId}`,
      type: 'Complaint Update'
    });

    const citizen = await User.findById(citizenId);
    if (citizen) {
       sendStatusUpdate(citizen.email, complaint.trackingId, 'Submitted', 'Your complaint has been received and is awaiting review.').catch(err => console.error('Email failed', err));
    }

    res.status(201).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private
export const getComplaints = async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    if (req.user.role === 'admin') {
      query = Complaint.find(JSON.parse(queryStr)).populate('citizen', 'name email');
    } else {
      query = Complaint.find({ citizen: req.user.id, ...JSON.parse(queryStr) });
    }

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Complaint.countDocuments(req.user.role === 'admin' ? JSON.parse(queryStr) : { citizen: req.user.id, ...JSON.parse(queryStr) });

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const complaints = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: complaints.length,
      total,
      pagination,
      data: complaints
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
export const getComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('citizen', 'name email');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaint by tracking token
// @route   GET /api/complaints/track/:trackingId
// @access  Public
export const getComplaintByToken = async (req, res, next) => {
  try {
    const complaint = await Complaint.findOne({ trackingId: req.params.trackingId }).populate('citizen', 'name email');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Invalid tracking ID' });
    }

    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private (Admin only)
export const updateComplaintStatus = async (req, res, next) => {
  try {
    let complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const { status, message } = req.body;

    if (status) complaint.status = status;

    if (status === 'Closed') {
      complaint.confirmedAt = complaint.confirmedAt || new Date();
    }
    
    if (message || status) {
      complaint.timeline.push({ 
        status: status || complaint.status, 
        message: message || `Status updated to ${status}` 
      });
    }

    // Handle resolution proof image if provided
    if (req.file) {
      complaint.afterImage = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }
    
    // Check if other metadata was passed (e.g. resolutionNotes)
    if (req.body.resolutionNotes) {
      complaint.resolutionNotes = req.body.resolutionNotes;
    }
    
    if (req.body.assignedWorker) complaint.assignedWorker = req.body.assignedWorker;
    if (req.body.assignedDept) complaint.assignedDept = req.body.assignedDept;

    await complaint.save();

    // Create notification for the citizen
    let notificationTitle = 'Complaint Update';
    let notificationMessage = `Your complaint "${complaint.title}" status has been updated to ${status}.`;

    if (status === 'Assigned') {
      notificationTitle = 'Complaint Assigned';
      notificationMessage = `Your complaint "${complaint.title}" has been assigned to ${complaint.assignedWorker} (${complaint.assignedDept}).`;
    } else if (status === 'Resolved') {
      notificationTitle = 'Complaint Resolved';
      notificationMessage = `Great news! Your complaint "${complaint.title}" has been resolved. Please verify and close the ticket.`;
    } else if (status === 'Closed') {
      notificationTitle = 'Complaint Closed';
      notificationMessage = `Your complaint "${complaint.title}" has been closed successfully. Thank you for your cooperation.`;
    } else if (status === 'Work In Progress') {
      notificationTitle = 'Work Started';
      notificationMessage = `Field work has started on your complaint "${complaint.title}".`;
    }

    await Notification.create({
      user: complaint.citizen,
      title: notificationTitle,
      message: notificationMessage,
      type: 'Complaint Update'
    });

    const citizen = await User.findById(complaint.citizen);
    if (citizen) {
       sendStatusUpdate(citizen.email, complaint.trackingId, status, notificationMessage).catch(err => console.error('Email failed', err));
    }

    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm complaint resolution (Citizen only)
// @route   PUT /api/complaints/:id/confirm
// @access  Private
export const confirmComplaintResolution = async (req, res, next) => {
  try {
    let complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const loggedUserId = req.user?._id || req.user?.id;
    const loggedUserEmail = req.user?.email;
    const loggedUserRole = req.user?.role;
    const complaintOwnerId = complaint.citizen?.toString();
    const complaintOwner = await User.findById(complaint.citizen);
    const complaintOwnerEmail = complaintOwner?.email || null;

    console.log('[CONFIRM_COMPLAINT_DEBUG] logged user id:', loggedUserId);
    console.log('[CONFIRM_COMPLAINT_DEBUG] logged user email:', loggedUserEmail);
    console.log('[CONFIRM_COMPLAINT_DEBUG] logged user role:', loggedUserRole);
    console.log('[CONFIRM_COMPLAINT_DEBUG] complaint owner id:', complaintOwnerId);
    console.log('[CONFIRM_COMPLAINT_DEBUG] complaint owner email:', complaintOwnerEmail);
    console.log('[CONFIRM_COMPLAINT_DEBUG] complaint status:', complaint.status);

    const isOwner = req.user && req.user._id && complaint.citizen.equals(req.user._id);

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    if (!isOwner) {
      return res.status(403).json({ success: false, message: 'Only the complaint owner can confirm resolution.' });
    }

    if (complaint.status !== 'Awaiting Citizen Confirmation') {
      return res.status(400).json({
        success: false,
        message: `Cannot confirm. Complaint status is '${complaint.status}', expected 'Awaiting Citizen Confirmation'`
      });
    }

    complaint.status = 'Closed';
    complaint.confirmedAt = new Date();

    complaint.timeline.push({
      status: 'Closed',
      message: 'Citizen confirmed resolution. Complaint closed.'
    });

    await complaint.save();

    await Notification.create({
      user: complaint.citizen,
      title: 'Complaint Closed',
      message: `Your complaint "${complaint.title}" has been closed successfully. Thank you for your cooperation.`,
      type: 'Complaint Update'
    });

    const citizen = await User.findById(complaint.citizen);
    if (citizen) {
      sendStatusUpdate(citizen.email, complaint.trackingId, 'Closed', 'Your complaint has been successfully completed and closed.').catch(err => console.error('Email failed', err));
    }

    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaint analytics
// @route   GET /api/complaints/analytics
// @access  Private
export const getComplaintAnalytics = async (req, res, next) => {
  try {
    const matchStage = req.user.role === 'admin' ? {} : { citizen: req.user._id };

    const stats = await Complaint.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryStats = await Complaint.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format results
    const results = {
      total: await Complaint.countDocuments(matchStage),
      status: stats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      categories: categoryStats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {})
    };

    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

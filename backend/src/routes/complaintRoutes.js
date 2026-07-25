import express from 'express';
import { body } from 'express-validator';
import {
  createComplaint,
  getComplaints,
  getComplaint,
  updateComplaintStatus,
  getComplaintByToken,
  getComplaintAnalytics,
  confirmComplaintResolution
} from '../controllers/complaintController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';
import validate from '../middleware/validate.js';

const router = express.Router();

router.get('/analytics', protect, getComplaintAnalytics);
router.get('/track/:trackingId', getComplaintByToken);

router
  .route('/')
  .get(protect, getComplaints)
  .post(
    protect, 
    upload.single('image'), 
    [
      body('title', 'Title is required').not().isEmpty(),
      body('description', 'Description is required').not().isEmpty(),
      body('category', 'Category is required').not().isEmpty(),
      validate
    ],
    createComplaint
  );

router.get('/:id', protect, getComplaint);

// Citizen confirms resolution (only for "Awaiting Citizen Confirmation" status)
router.put(
  '/:id/confirm',
  protect,
  authorize('citizen'),
  confirmComplaintResolution
);

// Admin updates complaint status
router.put(
  '/:id/status', 
  protect, 
  authorize('admin'), 
  upload.single('afterImage'), 
  [
    body('status', 'Status is required').not().isEmpty(),
    validate
  ],
  updateComplaintStatus
);

export default router;

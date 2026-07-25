import express from 'express';
import { getNotifications, markAsRead, getUnreadCount, markAllRead } from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.get('/unread/count', protect, getUnreadCount);
router.put('/readall', protect, markAllRead);
router.put('/:id/read', protect, markAsRead);

export default router;

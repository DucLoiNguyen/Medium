import express from 'express';
import NotificationController from '../controllers/NotificationController.js';

const router = express.Router();

router.get('/notifications', NotificationController.getNotifications);
router.patch('/notifications/read/:notificationId', NotificationController.markAsRead);

export default router;
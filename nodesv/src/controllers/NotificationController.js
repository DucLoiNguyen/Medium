import notification from '../models/NotificationModel.js';
import mongoose from 'mongoose';

class NotificationController {
    async createNotification( req, res ) {
        try {
            // const { recipient, sender, type, content } = req.body;
            const notifications = new notification({
                recipient,
                sender,
                type,
                content
            });
            await notifications.save();

            // Gửi realtime notification qua Socket.IO
            req.io.to(recipient).emit('newNotification', notifications);

            res.status(201).json(notifications);
        } catch ( error ) {
            res.status(500).json({ message: error.message });
        }
    }

    async getNotifications( req, res ) {
        try {
            const userId = req.session.user._id;
            const notifications = await notification
                .find({ recipient: userId })
                .sort({ createdAt: -1 })
                .limit(20)
                .populate({
                    path: 'sender',
                    select: 'username email ava'
                })
                .populate('relatedEntity');

            res.json(notifications);
        } catch ( error ) {
            res.status(500).json({ message: error.message });
        }
    }

    async markAsRead( req, res ) {
        try {
            const { notificationId } = req.params;
            await notification.findByIdAndUpdate(notificationId, {
                isRead: true
            });

            res.status(200).json({ message: 'Đã đánh dấu đọc' });
        } catch ( error ) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new NotificationController();
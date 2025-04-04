import history from '../models/HistoryModel.js';
import { populate } from 'dotenv';

class HistoryController {
    async TrackReading( req, res ) {
        try {
            const { postId, readDuration, readPercentage, isCompleted } = req.body;
            const userId = req.session.user._id; // Giả định bạn đã setup authentication middleware

            // Tìm bản ghi lịch sử đọc hiện có hoặc tạo mới
            let readingHistory = await history.findOne({
                user: userId,
                post: postId
            });

            if ( readingHistory ) {
                // Cập nhật bản ghi hiện có
                readingHistory.readAt = Date.now();
                readingHistory.readDuration = Math.max(readingHistory.readDuration, readDuration || 0);
                readingHistory.readPercentage = Math.max(readingHistory.readPercentage, readPercentage || 0);

                if ( isCompleted ) {
                    readingHistory.isCompleted = true;
                }
            } else {
                // Tạo bản ghi mới
                readingHistory = new history({
                    user: userId,
                    post: postId,
                    readDuration: readDuration || 0,
                    readPercentage: readPercentage || 0,
                    isCompleted: isCompleted || false
                });
            }

            await readingHistory.save();

            return res.status(200).json({ success: true, data: readingHistory });
        } catch ( error ) {
            console.error('Error tracking reading:', error);
            return res.status(500).json({ success: false, error: 'Server error' });
        }
    }

    async GetReadingHistory( req, res ) {
        try {
            const userId = req.session.user._id; // Giả định bạn đã setup authentication middleware
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = ( page - 1 ) * limit;

            const readingHistory = await history.find({ user: userId })
                .sort({ readAt: -1 }) // Sắp xếp theo thời gian đọc gần đây nhất
                .skip(skip)
                .limit(limit)
                .populate('post', 'tittle subtittle author thumbnail likes comments') // Lấy thông tin bài viết
                .lean();

            console.log(readingHistory);

            const total = await history.countDocuments({ user: userId });

            return res.status(200).json({
                success: true,
                data: readingHistory,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch ( error ) {
            console.error('Error fetching reading history:', error);
            return res.status(500).json({ success: false, error: 'Server error' });
        }
    }

    async RemoveFromHistory( req, res ) {
        try {
            const { id } = req.params;
            const userId = req.session.user._id;

            const result = await history.findOneAndDelete({
                _id: id,
                user: userId
            });

            if ( !result ) {
                return res.status(404).json({ success: false, error: 'Item not found' });
            }

            return res.status(200).json({ success: true, message: 'Item removed from history' });
        } catch ( error ) {
            console.error('Error removing from history:', error);
            return res.status(500).json({ success: false, error: 'Server error' });
        }
    }

    async clearHistory( req, res ) {
        try {
            const userId = req.session.user._id;

            await history.deleteMany({ user: userId });

            return res.status(200).json({ success: true, message: 'Reading history cleared' });
        } catch ( error ) {
            console.error('Error clearing history:', error);
            return res.status(500).json({ success: false, error: 'Server error' });
        }
    }
}

export default new HistoryController();
import history from '../models/HistoryModel.js';
import post from '../models/PostModel.js';
import { populate } from 'dotenv';
import mongoose from 'mongoose';

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

                // if ( readDuration && readDuration > 0 ) {
                //     await post.findOneAndUpdate(
                //         { _id: postId },
                //         { $inc: { views: readDuration } }
                //     );
                //     console.log(`Đã cộng ${ readDuration } giây vào views của bài viết ${ postId }`);
                // }

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
            const userId = req.session.user._id;
            const limit = parseInt(req.query.limit) || 10;
            const cursor = req.query.cursor;

            // Add validation for cursor format
            if ( cursor && isNaN(Date.parse(cursor)) ) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid cursor format. Expected ISO date string.'
                });
            }

            // Build query with cursor if provided
            const query = { user: userId };
            if ( cursor ) {
                query.readAt = { $lt: new Date(cursor) };
            }

            // Execute query with one extra item to determine if there's a next page
            const readingHistory = await history.find(query)
                .sort({ readAt: -1 })
                .limit(limit + 1)
                .populate('post', 'tittle subtittle author thumbnail likes comments')
                .lean();

            // Check if there's a next page
            const hasNextPage = readingHistory.length > limit;

            // Create the response data (without the extra item)
            const data = hasNextPage ? readingHistory.slice(0, limit) : readingHistory;

            // Determine the next cursor value
            const nextCursor = hasNextPage && data.length > 0
                ? data[data.length - 1].readAt.toISOString()
                : null;

            // Include previous cursor for potential "back" functionality
            const prevParams = cursor ? new URLSearchParams({ cursor, limit: limit.toString() }).toString() : null;

            return res.status(200).json({
                success: true,
                data,
                pagination: {
                    hasNextPage,
                    nextCursor,
                    prevParams,
                    limit
                }
            });
        } catch ( error ) {
            console.error('Error fetching reading history:', error);
            return res.status(500).json({
                success: false,
                error: error.message || 'Server error'
            });
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
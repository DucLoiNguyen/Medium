import mongoose from 'mongoose';

const history = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts',
        required: true
    },
    readAt: {
        type: Date,
        default: Date.now
    },
    readDuration: {
        type: Number,
        default: 0 // Thời gian đọc tính bằng giây
    },
    readPercentage: {
        type: Number,
        default: 0 // Phần trăm bài viết đã đọc (0-100)
    },
    isCompleted: {
        type: Boolean,
        default: false // Đánh dấu nếu người dùng đã đọc hết bài
    }
}, { timestamps: true });

// Đảm bảo mỗi user chỉ có một bản ghi lịch sử cho mỗi bài viết
history.index({ user: 1, post: 1 }, { unique: true });

export default mongoose.model('histories', history);
import mongoose from 'mongoose';

const { Schema } = mongoose;

const recommendation = new Schema({
        // Người dùng sở hữu gợi ý
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
            index: true
        },

        // Gợi ý bài viết
        recommendations: [{
            post: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'posts'
            },
            score: {
                type: Number,
                default: 0
            },
            reason: {
                type: String,
                enum: ['content', 'collaborative', 'trending', 'topic_follow', 'author_follow']
            }
        }],

        // Gợi ý người dùng theo dõi
        userRecommendations: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            },
            score: {
                type: Number,
                default: 0
            },
            reason: {
                type: String,
                enum: ['interest_match', 'reading_history', 'network', 'popular']
            }
        }],

        // Thời gian cập nhật gợi ý
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    });

// Thêm index để cải thiện hiệu suất truy vấn
recommendation.index({ user: 1, lastUpdated: -1 });

export default mongoose.model('recommendations', recommendation);
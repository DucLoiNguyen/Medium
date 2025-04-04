import mongoose, { Schema } from 'mongoose';
import deepPopulate from 'mongoose-deep-populate';

const deepPopulatePlugin = deepPopulate(mongoose);

const comment = new Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'posts',
            required: true
        },
        parentComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comments',
            default: null  // Để hỗ trợ comment gốc và comment trả lời
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }]
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

comment.virtual('replies', {
    ref: 'comments',
    localField: '_id',
    foreignField: 'parentComment'
});

comment.plugin(deepPopulatePlugin);

export default mongoose.model('comments', comment);
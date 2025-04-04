import mongoose from 'mongoose';

const { Schema } = mongoose;

const notification = new mongoose.Schema({
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        type: {
            type: String,
            enum: [
                'COMMENT',
                'LIKE',
                'FOLLOW',
                'ARTICLE_PUBLISHED',
                'MENTION'
            ]
        },
        content: String,
        relatedEntity: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'entityModel'
        },
        entityModel: {
            type: String,
            enum: ['posts', 'comments']
        },
        isRead: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true,
    });

export default mongoose.model('notifications', notification);
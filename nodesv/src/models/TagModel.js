import mongoose from 'mongoose';

const { Schema } = mongoose;

const tag = new Schema(
    {
        tag: { type: String },
        topic: {
            topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'topics' },
            topicName: { type: String }
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('tags', tag);

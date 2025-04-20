import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

const { Schema } = mongoose;

const topic = new Schema(
    {
        topicname: { type: String },
        tags: [
            {
                tagId: { type: mongoose.Schema.Types.ObjectId, ref: 'tags' },
                tagName: { type: String }
            }
        ],
        followers: { type: Number, default: 0 },
        tag: { type: String }
    },
    {
        timestamps: true,
    }
);

topic.index({
    topicname: 1,
    'tags.tagName': 1
});

export default mongoose.model('topics', topic);
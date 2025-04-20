import mongoose from 'mongoose';

const { Schema } = mongoose;

const tag = new Schema(
    {
        tag: { type: String },
        topic: {
            topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'topics' },
            topicName: { type: String }
        },
        followers: { type: Number, default: 0 }
    },
    {
        timestamps: true,
    }
);

tag.index({
    tag: 1,
    'topic.topicName': 1
});

export default mongoose.model('tags', tag);

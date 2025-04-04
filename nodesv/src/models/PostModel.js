import mongoose from 'mongoose';

const { Schema } = mongoose;

const post = new Schema(
    {
        tittle: { type: String },
        subtittle: { type: String, default: '' },
        content: { type: String },
        author: {
            authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
            authorName: { type: String }
        },
        topic: {
            topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'topics' },
            topicName: { type: String }
        },
        tags: [
            {
                tagId: { type: mongoose.Schema.Types.ObjectId, ref: 'tags' },
                tagName: { type: String }
            }
        ],
        thumbnail: { type: String, default: 'conetnt1.jpg' },
        likes: { type: Number, default: 0 },
        status: { type: Boolean, default: false },
        memberonly: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('posts', post);

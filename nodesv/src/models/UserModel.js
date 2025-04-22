import mongoose from 'mongoose';

const { Schema } = mongoose;

const user = new Schema(
    {
        username: { type: String },
        email: { type: String },
        address: { type: String },
        phone: { type: String },
        bio: { type: String, default: '' },
        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
        topicFollowing: [{ type: mongoose.Schema.Types.ObjectId, ref: 'topics' }],
        tagFollowing: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tags' }],
        subdomain: { type: String, unique: true },
        ava: { type: String, default: '' },
        stripeCustomerId: { type: String },
        isMember: { type: Boolean, default: false },
        subscriptionId: { type: String }, // Thêm trường lưu ID subscription
        subscriptionEndDate: { type: Date }, // Thêm trường lưu ngày hết hạn subscription
        subscriptionStatus: { type: String, default: 'inactive' }, // 'active', 'canceled', 'inactive'
        hiddenStories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'posts'
        }],
        hiddenAuthors: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }],
        savedLists: [
            {
                name: { type: String, required: true },
                description: { type: String, default: '' },
                posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'posts' }],
                isDefault: { type: Boolean, default: false },
                createdAt: { type: Date, default: Date.now }
            }
        ]
    },
    {
        timestamps: true,
    }
);

user.index({
    username: 'text',
    email: 'text',
    phone: 'text',
    bio: 'text',
});

export default mongoose.model('users', user);

import mongoose from 'mongoose';

const {Schema} = mongoose;

const user = new Schema(
    {
        username: {type: String},
        email: {type: String},
        address: {type: String},
        phone: {type: String},
        bio: {type: String},
        followers: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
        following: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
        ava: {type: String, default: '/ava.png'},
        stripeCustomerId: {type: String},
        isMember: {type: Boolean, default: false},
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('users', user);

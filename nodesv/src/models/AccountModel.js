import mongoose from 'mongoose';

const { Schema } = mongoose;

const account = new Schema(
    {
        email: { type: String, unique: true, required: true },
        password: { type: String }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('accounts', account);

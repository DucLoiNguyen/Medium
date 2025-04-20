import mongoose from 'mongoose';

const { Schema } = mongoose;

const resetsession = new Schema({
        sessionId: { type: String, required: true, unique: true },
        accId: { type: mongoose.Schema.Types.ObjectId, ref: 'accounts', required: true },
        expiresAt: { type: Date, required: true }
    },
    {
        timestamps: true,
    });

export default mongoose.model('ResetPassSessions', resetsession);
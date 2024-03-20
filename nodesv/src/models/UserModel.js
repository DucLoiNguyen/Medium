import { ObjectId } from "mongodb";
import mongoose from "mongoose";
const { Schema } = mongoose;

const user = new Schema(
  {
    username: { type: String },
    email: { type: String },
    address: { type: String },
    phone: { type: String },
    bio: { type: String },
    followers: { type: String },
    following: { type: String },
    ava: { type: String }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("users", user);

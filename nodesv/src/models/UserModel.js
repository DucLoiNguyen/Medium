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
    followers: { type: String, default: "0" },
    following: { type: String, default: "0" },
    ava: { type: String, default: "/ava.png" }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("users", user);

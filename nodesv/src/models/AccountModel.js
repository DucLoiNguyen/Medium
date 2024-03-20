import { ObjectId } from "mongodb";
import mongoose from "mongoose";
const { Schema } = mongoose;

const account = new Schema(
  {
    userId: { type: ObjectId },
    email: { type: String },
    password: { type: String }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("accounts", account);

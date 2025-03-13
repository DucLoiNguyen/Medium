import { ObjectId } from "mongodb";
import mongoose from "mongoose";
const { Schema } = mongoose;

const tag = new Schema(
  {
    tag: { type: String },
    topic: {
      topicId: { type: ObjectId },
      topicname: { type: String }
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("tags", tag);

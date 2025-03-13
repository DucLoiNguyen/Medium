import { ObjectId } from "mongodb";
import mongoose from "mongoose";
const { Schema } = mongoose;

const topic = new Schema(
  {
    topicname: { type: String },
    tags: [
      {
        tagId: { type: ObjectId },
        tagName: { type: String }
      }
    ]
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("topics", topic);
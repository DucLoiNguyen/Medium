import { ObjectId } from "mongodb";
import mongoose from "mongoose";
const { Schema } = mongoose;

const topic = new Schema(
  {
    topicname: { type: String },
    topicchilds: [
      {
        topicchildId: { type: ObjectId },
        topicchildName: { type: String }
      }
    ],
    tag: { type: String }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("topics", topic);
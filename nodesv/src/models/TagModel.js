import { ObjectId } from "mongodb";
import mongoose from "mongoose";
const { Schema } = mongoose;

const tag = new Schema(
  {
    topicname: { type: String },
    topicrefer: {
      topicreferId: { type: ObjectId },
      topicreferName: { type: String }
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("topicchilds", tag);

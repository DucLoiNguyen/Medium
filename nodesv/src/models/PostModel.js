import { ObjectId } from "mongodb";
import mongoose from "mongoose";
const { Schema } = mongoose;

const post = new Schema(
  {
    header: { type: String },
    content: { type: String },
    author: {
      authorId: { type: ObjectId },
      authorName: { type: String }
    },
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

export default mongoose.model("posts", post);

import { ObjectId } from "mongodb";
import mongoose, {Schema as schema} from "mongoose";
const { Schema } = mongoose;

const post = new Schema(
  {
    tittle: { type: String },
    subtittle: { type: String, default: "" },
    content: { type: String },
    author: {
      authorId: { type: ObjectId },
      authorName: { type: String }
    },
    topic: {
        topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
        topicName: { type: String }
    },
    tags: [
      {
        tagId: { type: mongoose.Schema.Types.ObjectId, ref: "tags" },
        tagName: { type: String }
      }
    ],
      thumbnail: { type: String, default: "conetnt1.jpg" },
  },
  {
    timestamps: true,  }
);

export default mongoose.model("posts", post);

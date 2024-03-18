import mongoose from "mongoose";
const { Schema } = mongoose;

const post = new Schema(
  {
    header: { type: String },
    content: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("posts", post);

import mongoose from "mongoose";
const { Schema } = mongoose;

const test1 = new Schema(
  {
    abc: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("test1s", test1);

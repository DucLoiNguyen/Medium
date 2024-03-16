import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const url = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@medium.ivvwbok.mongodb.net/test`;

async function connect() {
  try {
    await mongoose
      .connect(url)
      .then(() => console.log("<<<< Kết nối với MongoDB thành công! >>>>"));
  } catch (error) {
    console.error("Lỗi kết nối:", error);
  }
}

export default connect;

import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const url = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@medium.ivvwbok.mongodb.net/?retryWrites=true&w=majority&appName=Medium`;
const client = new MongoClient(url);

async function connect() {
  try {
    await client.connect();
    console.log("<<<< Kết nối với MongoDB thành công! >>>>");
    const data1 = await client.db("test").collection("test1").find().toArray();
    console.log(data1);

    await client.close();
  } catch (error) {
    console.error("Lỗi kết nối:", error);
  }
}

export default connect;

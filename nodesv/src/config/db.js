import { MongoClient } from "mongodb";

const url = 'mongodb+srv://loi120765:0uRyhoE9BWdpOCVA@medium.ivvwbok.mongodb.net/?retryWrites=true&w=majority&appName=Medium&tls=true&authMechanism=DEFAULT&readPreference=primary'; // Thay đổi 'localhost' thành địa chỉ MongoDB của bạn
const client = new MongoClient(url);

async function run() {
  try {
    await client.connect();
    console.log('<<<< Kết nối với MongoDB thành công! >>>>');
    await client.close();
  } catch (error) {
    console.error('Lỗi kết nối:', error);
  }
};

export default run;
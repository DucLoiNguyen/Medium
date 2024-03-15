import express from "express";
import morgan from "morgan";
import http from "http";
import dotenv from "dotenv";
import route from "./routes/index.js";
import connect from "./config/db.js";

dotenv.config();
const app = express();
const port = process.env.PORT;
const appurl = process.env.APPURL;

app.use(morgan("combined"));
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", appurl);
  next();
});

connect();
route(app);

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`listen on http://localhost:${port}`);
});

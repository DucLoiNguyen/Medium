import express from "express";
import morgan from "morgan";
import http from "http";
import dotenv from "dotenv";
import route from "./routes/index.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(morgan("combined"));
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

route(app);

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`listen on http://localhost:${port}`);
});

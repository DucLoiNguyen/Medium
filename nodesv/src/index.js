import express from "express";
import morgan from "morgan";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import route from "./routes/index.js";

dotenv.config();
const app = express();
const port = process.env.PORT;
const appurl = process.env.APPURL;

app.use(morgan("combined"));
app.use(express.json());
app.use(cors({ origin: appurl }));

route(app);

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`listen on http://localhost:${port}`);
});

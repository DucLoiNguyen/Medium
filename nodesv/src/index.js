import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(morgan("combined"));

app.get("/", (req, res) => {
  res.send("Hello lợi đẹp vl");
});

app.listen(port, () => {
  console.log(`listen on http://localhost:${port}`);
});

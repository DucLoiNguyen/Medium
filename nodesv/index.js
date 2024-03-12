import express from "express";
import morgan from "morgan";

const app = express();
const port = 3030;

app.use(morgan("combined"));

app.get("/", (req, res) => {
  res.send("Hello lợi đẹp vl");
});

app.listen(port, () => {
  console.log(`listen on http://localhost:${port}`);
});

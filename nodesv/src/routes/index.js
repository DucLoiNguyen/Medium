import Test1Controller from "../controllers/Test1Controller.js";
import PostRouter from "./PostRoute.js";
import TopicRouter from "./TopicRoute.js";

function route(app) {
  app.use("/api/post", PostRouter);
  app.use("/api/topic", TopicRouter)
}

export default route;

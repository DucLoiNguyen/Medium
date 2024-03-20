import PostRouter from "./PostRoute.js";
import TopicRouter from "./TopicRoute.js";
import UserRouter from "./UserRoute.js"

function route(app) {
  app.use("/api/post", PostRouter);
  app.use("/api/topic", TopicRouter);
  app.use("/api/user", UserRouter)
}

export default route;

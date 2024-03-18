import Test1Controller from "../controllers/Test1Controller.js";
import PostController from "../controllers/PostController.js";

function route(app) {
  app.get("/api/", PostController.index);
}

export default route;

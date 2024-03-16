import Test1Controller from "../controllers/Test1Controller.js";

function route(app) {
  app.get("/api/", Test1Controller.index);
}

export default route;

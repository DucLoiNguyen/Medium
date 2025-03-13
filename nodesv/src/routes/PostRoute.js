import express from "express";
import PostController from "../controllers/PostController.js";
const router = express.Router();

router.get("/getpostbyauthor", PostController.GetByAuthor);
router.get("/getallpost", PostController.GetAll);
router.post("/createpost", PostController.Create);

export default router;
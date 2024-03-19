import express from "express";
import PostController from "../controllers/PostController.js";
const router = express.Router();

router.get("/getpost", PostController.index);

export default router;
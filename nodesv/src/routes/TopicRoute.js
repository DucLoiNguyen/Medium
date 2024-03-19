import express from "express";
import TopicController from "../controllers/TopicController.js";
const router = express.Router();

router.get("/gettopic", TopicController.index);

export default router;
import express from "express";
import TopicController from "../controllers/TopicController.js";
const router = express.Router();

router.get("/getalltopic", TopicController.GetAll);

export default router;
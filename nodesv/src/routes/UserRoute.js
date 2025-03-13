import express from "express";
import UserController from "../controllers/UserController.js";
const router = express.Router();

router.get("/getalluser", UserController.GetAll);
router.post("/createuser", UserController.Create);

export default router;
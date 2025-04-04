import express from "express";
import UserController from "../controllers/UserController.js";
const router = express.Router();

router.get("/getalluser", UserController.GetAll);
router.post("/createuser", UserController.Create);
router.get("/getbyemail", UserController.GetByEmail);
router.post("/follow", UserController.Follow);
router.post("/unfollow", UserController.Unfollow);
router.post("/getbyid", UserController.GetById);

export default router;
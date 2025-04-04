import express from 'express';
import AuthController from '../controllers/AuthController.js';
const router = express.Router();

router.post('/login', AuthController.Login);
router.post('/register', AuthController.Register);
router.get("/check-auth", AuthController.CheckAuth);
router.get("/logout", AuthController.Logout);

export default router;
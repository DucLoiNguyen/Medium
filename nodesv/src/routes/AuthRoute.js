import express from 'express';
import AuthController from '../controllers/AuthController.js';

const router = express.Router();

router.post('/login', AuthController.Login);
router.post('/register', AuthController.Register);
router.get('/check-auth', AuthController.CheckAuth);
router.get('/logout', AuthController.Logout);
router.post('/check-pass', AuthController.CheckPassword);
router.post('/check-email', AuthController.CheckEmail);
router.post('/forgot-pass', AuthController.ForgotPassword);
router.get('/validate-reset-session', AuthController.ValidateResetSession);
router.post('/reset-pass', AuthController.ResetPassword);
router.patch('/change-password', AuthController.ChangePassword);
router.delete('/delete-account', AuthController.DeleteAccount);

export default router;
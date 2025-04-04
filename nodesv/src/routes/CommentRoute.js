import express from 'express';
import CommentController from '../controllers/CommentController.js';

const router = express.Router();

router.post('/comments', CommentController.Create);

export default router;
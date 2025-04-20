import express from 'express';
import TagController from '../controllers/TagController.js';

const router = express.Router();

router.get('/getbyid', TagController.GetById);
router.get('/gettag', TagController.GetTag);
router.post('/follow', TagController.Follow);
router.post('/unfollow', TagController.UnFollow);

export default router;
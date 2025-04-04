import express from 'express';
import TagController from '../controllers/TagController.js';

const router = express.Router();

router.get('/getbyid', TagController.GetById);

export default router;
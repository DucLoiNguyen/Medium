import express from 'express';
import PostController from '../controllers/PostController.js';
import CommentController from '../controllers/CommentController.js';

const router = express.Router();

router.get('/getpostbyauthor', PostController.GetByAuthor);
router.get('/getallpublish', PostController.GetAllPublish);
router.get('/getalldraft', PostController.GetAllDraft);
router.get('/getpostbyid/:id', PostController.GetById);
router.post('/createpost', PostController.Create);
router.put('/updatepost/:id', PostController.Update);
router.put('/like/:id', PostController.Like);
router.get('/comments/:id', CommentController.GetComments);

export default router;
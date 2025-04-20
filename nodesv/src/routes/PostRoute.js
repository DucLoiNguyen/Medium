import express from 'express';
import PostController from '../controllers/PostController.js';
import CommentController from '../controllers/CommentController.js';

const router = express.Router();

router.get('/getpostbyauthor', PostController.GetByAuthor);
router.get('/getallpublish', PostController.GetAllPublish);
router.get('/getmydraft', PostController.GetMyDraft);
router.get('/getmypublish', PostController.GetMyPublish);
router.get('/getbyfollow', PostController.GetByFollow);
router.get('/getpostbyid/:id', PostController.GetById);
router.get('/getbytag', PostController.GetByTag);
router.post('/createpost', PostController.Create);
router.put('/updatepost/:id', PostController.Update);
router.put('/like/:id', PostController.Like);
router.get('/comments/:id', CommentController.GetComments);
router.get('/search', PostController.Search);

export default router;
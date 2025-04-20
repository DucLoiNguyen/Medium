import express from 'express';
import UserController from '../controllers/UserController.js';

const router = express.Router();

router.get('/getalluser', UserController.GetAll);
router.post('/createuser', UserController.Create);
router.get('/getbyemail', UserController.GetByEmail);
router.post('/follow', UserController.Follow);
router.post('/unfollow', UserController.Unfollow);
router.get('/getbyid', UserController.GetById);
router.get('/search', UserController.Search);
router.patch('/updateuser', UserController.Update);
router.get('/getbydomaib', UserController.GetByDomain);
router.get('/getuserfollowing', UserController.GetUserFollowing);
router.get('/gettopicfollowing', UserController.GetTopicFollowing);
router.patch('/hidestories', UserController.HideStories);
router.patch('/hideauthors', UserController.HideAuthor);
router.post('/lists', UserController.CreateList);
router.get('/lists', UserController.GetAllLists);
router.put('/lists/:listId', UserController.UpdateList);
router.delete('/lists/:listId', UserController.DeleteList);
router.post('/lists/:listId/posts/:postId', UserController.AddPostToList);
router.delete('/lists/:listId/posts/:postId', UserController.RemovePostFromList);
router.get('/lists/:listId/posts', UserController.GetPostsInList);
router.get('/check/:postId', UserController.CheckPostInLists);

export default router;
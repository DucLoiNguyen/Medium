import express from 'express';
import UserController from '../controllers/UserController.js';
import AdminController from '../controllers/AdminController.js';

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
router.get('/getuserfollower', UserController.GetUserFollower);
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

router.get('/admin/dashboard/stats', AdminController.getDashboardStats);
router.get('/admin/dashboard/user-growth', AdminController.getUserGrowthStats);
router.get('/admin/dashboard/content-stats', AdminController.getContentStats);

// User Management
router.get('/admin/users', AdminController.getAllUsers);
router.get('/admin/users/:userId', AdminController.getUserDetails);
router.post('/admin/users/create-newadmin', AdminController.createAdminAccount);
router.put('/admin/users/:userId/status', AdminController.updateUserStatus);

// Content Management
router.get('/admin/posts', AdminController.getAllPosts);
router.get('/admin/posts/:postId', AdminController.getPostDetails);
router.put('/admin/posts/:postId/status', AdminController.updatePostStatus);

// Comment Management
router.get('/admin/comments', AdminController.getAllComments);
router.delete('/admin/comments/:commentId', AdminController.deleteComment);

// TOPIC MANAGEMENT
router.get('/admin/topics', AdminController.getAllTopics);
router.get('/admin/topics/:topicId', AdminController.getTopicDetails);
router.post('/admin/topics', AdminController.createTopic);
router.put('/admin/topics/:topicId', AdminController.updateTopic);
router.delete('/admin/topics/:topicId', AdminController.deleteTopic);

// TAG MANAGEMENT
router.get('/admin/tags', AdminController.getAllTags);
router.get('/admin/tags/:tagId', AdminController.getTagDetails);
router.post('/admin/tags', AdminController.createTag);
router.put('/admin/tags/:tagId', AdminController.updateTag);
router.delete('/admin/tags/:tagId', AdminController.deleteTag);

export default router;
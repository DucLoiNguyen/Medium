/**
 * @swagger
 * components:
 *   schemas:
 *     Posts:
 *       type: object
 *       properties:
 *         header:
 *           type: string
 *           description: "The title of the post"
 *         content:
 *           type: string
 *           description: "The content of the post"
 *         author:
 *           type: object
 *           properties:
 *             authorId:
 *               type: string
 *               format: objectId
 *               description: "The unique identifier of the author"
 *             authorName:
 *               type: string
 *               description: "The name of the author"
 *         tags:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               tagId:
 *                 type: string
 *                 format: objectId
 *                 description: "The unique identifier of the tag"
 *               tagName:
 *                 type: string
 *                 description: "The name of the tag"
 *       required:
 *         - header
 *         - content
 *         - author
 * */

/**
 * @swagger
 * /api/post/getallpost:
 *   get:
 *     summary: Returns all posts.
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: the list of the posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref:'#/components/schemas/Posts'
 */

import PostRouter from './PostRoute.js';
import TopicRouter from './TopicRoute.js';
import UserRouter from './UserRoute.js';
import AuthRouter from './AuthRoute.js';
import CommentRouter from './CommentRoute.js';
import NotificationRouter from './NotiRoute.js';
import HistoryRouter from './HistoryRoute.js';
import TagRouter from './TagRoute.js';
import RecommendationRouter from './RecommendationRoute.js';

function route( app ) {
    app.use('/api/post', PostRouter);
    app.use('/api/topic', TopicRouter);
    app.use('/api/user', UserRouter);
    app.use('/api/auth', AuthRouter);
    app.use('/api/comment', CommentRouter);
    app.use('/api/notification', NotificationRouter);
    app.use('/api/history', HistoryRouter);
    app.use('/api/tag', TagRouter);
    app.use('/api/recommendation', RecommendationRouter);
}

export default route;

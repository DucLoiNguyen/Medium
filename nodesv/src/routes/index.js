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

import PostRouter from "./PostRoute.js";
import TopicRouter from "./TopicRoute.js";
import UserRouter from "./UserRoute.js"

function route(app) {
  app.use("/api/post", PostRouter);
  app.use("/api/topic", TopicRouter);
  app.use("/api/user", UserRouter)
}

export default route;

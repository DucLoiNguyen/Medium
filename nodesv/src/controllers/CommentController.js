import comment from '../models/CommentModel.js';
import notification from '../models/NotificationModel.js';
import post from '../models/PostModel.js';

class CommentController {
    async Create( req, res ) {
        try {
            const { content, postId, parentCommentId } = req.body;
            const newComment = new comment({
                content,
                author: req.session.user._id,
                post: postId,
                parentComment: parentCommentId || null
            });
            await newComment.save();

            const posts = await post.findByIdAndUpdate(
                postId,
                { $inc: { comments: 1 } },
                { new: true }
            );

            const newNotification = new notification({
                recipient: posts.author.authorId,
                sender: req.session.user._id,
                type: 'COMMENT',
                content: `${ req.session.user.username } đã comment ${ posts.tittle }`
            });

            await newNotification.save();

            if ( newComment.parentComment ) {
                const parentComment = await comment.findById(newComment.parentComment).select('author');

                if ( parentComment && ( parentComment.author.toString() !== req.session.user._id.toString() ) ) {
                    req.io.to(parentComment.author.toString()).emit('newNotification', {
                        newNotification,
                        message: `${ req.session.user.username } reply you`,
                        postId: postId,
                        postTittle: posts.tittle,
                    });
                }
            } else {
                if ( posts.author.authorId.toString() !== req.session.user._id.toString() ) {
                    req.io.to(posts.author.authorId.toString()).emit('newNotification', {
                        newNotification,
                        message: `${ req.session.user.username } comment your post`,
                        postId: postId,
                        postTittle: posts.tittle,
                    });
                }
            }

            res.status(201).json(newComment);

        } catch ( error ) {
            res.status(500).json({ message: error.message });
        }
    }

    async GetComments( req, res ) {
        try {
            const getNestedComments = async ( comment ) => {
                await comment.populate('author', 'username ava');
                await comment.populate('replies');

                for ( let reply of comment.replies ) {
                    await getNestedComments(reply);
                }
                return comment;
            };

            const comments = await comment.find({
                post: req.params.id,
                parentComment: null
            })
                .sort({ createdAt: -1 });
            const populatedComments = await Promise.all(comments.map(getNestedComments));
            res.status(200).json(populatedComments);
        } catch ( error ) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new CommentController();
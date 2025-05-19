import comment from '../models/CommentModel.js';
import notification from '../models/NotificationModel.js';
import post from '../models/PostModel.js';
import mongoose from 'mongoose';

class CommentController {
    async Create( req, res ) {
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const { content, postId, parentCommentId } = req.body;

            // Create new comment
            const newComment = new comment({
                content,
                author: req.session.user._id,
                post: postId,
                parentComment: parentCommentId || null
            });

            await newComment.save({ session });

            // Update post comment count
            const postData = await post.findByIdAndUpdate(
                postId,
                { $inc: { comments: 1 } },
                { new: true, session }
            );

            if ( !postData ) {
                throw new Error('Post not found');
            }

            // Create notification with related entity reference
            const newNotification = new notification({
                recipient: postData.author.authorId,
                sender: req.session.user._id,
                type: 'COMMENT',
                content: `${ req.session.user.username } commented on "${ postData.tittle }"`,
                relatedEntity: postId,
                entityModel: 'posts',
                isRead: false
            });

            await newNotification.save({ session });

            // Commit the transaction
            await session.commitTransaction();

            // Send realtime notifications after successful transaction
            if ( newComment.parentComment ) {
                // For reply to comment
                const parentComment = await comment.findById(newComment.parentComment).select('author');

                if ( parentComment && ( parentComment.author.toString() !== req.session.user._id.toString() ) ) {
                    req.io.to(parentComment.author.toString()).emit('newNotification', {
                        newNotification,
                        message: `${ req.session.user.username } replied to your comment`,
                        postId: postId,
                        postTitle: postData.tittle,
                    });
                }
            } else {
                // For comment on post
                if ( postData.author.authorId.toString() !== req.session.user._id.toString() ) {
                    req.io.to(postData.author.authorId.toString()).emit('newNotification', {
                        newNotification,
                        message: `${ req.session.user.username } commented on your post`,
                        postId: postId,
                        postTitle: postData.tittle,
                    });
                }
            }

            // Return success response
            res.status(201).json({
                success: true,
                message: 'Comment created successfully',
                data: newComment
            });

        } catch ( error ) {
            // Abort transaction in case of error
            await session.abortTransaction();

            // Return error response
            res.status(500).json({
                success: false,
                message: 'Error creating comment',
                error: error.message
            });
        } finally {
            // End session
            session.endSession();
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
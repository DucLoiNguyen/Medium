import user from '../models/UserModel.js';
import post from '../models/PostModel.js';
import comment from '../models/CommentModel.js';
import notification from '../models/NotificationModel.js';
import topic from '../models/TopicModel.js';
import tag from '../models/TagModel.js';
import mongoose from 'mongoose';

class AdminController {
    // Authentication for admin routes
    async validateAdmin( req, res, next ) {
        try {
            const userId = req.session.user?._id;

            if ( !userId ) {
                return res.status(401).json({ message: 'Not authenticated' });
            }

            const adminUser = await user.findById(userId);

            if ( !adminUser || !adminUser.isAdmin ) {
                return res.status(403).json({ message: 'Not authorized as admin' });
            }

            next();
        } catch ( error ) {
            console.error('Admin validation error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // USERS MANAGEMENT
    async getAllUsers( req, res ) {
        try {
            const { page = 1, limit = 10, sortBy = '_id', sortOrder = -1, search = '' } = req.query;

            // Convert to integers
            const currentPage = parseInt(page);
            const itemsPerPage = parseInt(limit);

            // Build query for filtering
            const query = {};
            if ( search ) {
                query.$or = [
                    { username: new RegExp(search, 'i') },
                    { email: new RegExp(search, 'i') },
                    { subdomain: new RegExp(search, 'i') }
                ];
            }

            // Calculate pagination
            const skip = ( currentPage - 1 ) * itemsPerPage;

            // Build sort object
            const sort = {};
            sort[sortBy] = parseInt(sortOrder);

            // Get users with pagination
            const users = await user.find(query)
                .sort(sort)
                .skip(skip)
                .limit(itemsPerPage)
                .select('username email subdomain createdAt followers following isMember subscriptionStatus isAdmin isBanned');

            // Get total count for pagination
            const total = await user.countDocuments(query);

            // Calculate total pages
            const totalPages = Math.ceil(total / itemsPerPage);

            // Create pagination links
            const baseUrl = `${ req.protocol }://${ req.get('host') }${ req.baseUrl }${ req.path }`;

            // Build query string from existing query parameters, excluding page
            const queryParams = { ...req.query };
            delete queryParams.page;
            const queryString = Object.keys(queryParams).length > 0
                ? '&' + new URLSearchParams(queryParams).toString()
                : '';

            // Build pagination object with traditional links
            const pagination = {
                total,
                currentPage,
                totalPages,
                itemsPerPage,
                hasNextPage: currentPage < totalPages,
                hasPrevPage: currentPage > 1,
                nextPage: currentPage < totalPages ? currentPage + 1 : null,
                prevPage: currentPage > 1 ? currentPage - 1 : null,
                firstPage: 1,
                lastPage: totalPages,
                links: {
                    first: `${ baseUrl }?page=1${ queryString }`,
                    last: `${ baseUrl }?page=${ totalPages }${ queryString }`,
                    prev: currentPage > 1 ? `${ baseUrl }?page=${ currentPage - 1 }${ queryString }` : null,
                    next: currentPage < totalPages ? `${ baseUrl }?page=${ currentPage + 1 }${ queryString }` : null
                }
            };

            res.status(200).json({
                users,
                pagination
            });
        } catch ( error ) {
            console.error('Error getting users:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async getUserDetails( req, res ) {
        try {
            const { userId } = req.params;

            const userData = await user.findById(userId)
                .populate('followers', 'username email ava')
                .populate('following', 'username email ava')
                .populate('topicFollowing', 'topicname')
                .populate('tagFollowing', 'tag');

            if ( !userData ) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Get user's posts count
            const postsCount = await post.countDocuments({ 'author.authorId': userId });

            // Get user's comments count
            const commentsCount = await comment.countDocuments({ author: userId });

            res.status(200).json({
                user: userData,
                stats: {
                    postsCount,
                    commentsCount,
                    followersCount: userData.followers.length,
                    followingCount: userData.following.length
                }
            });
        } catch ( error ) {
            console.error('Error getting user details:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async updateUserStatus( req, res ) {
        try {
            const { userId } = req.params;
            const { action, banReason } = req.body;

            if ( !['ban', 'unban', 'makeMember', 'removeMember', 'makeAdmin', 'removeAdmin'].includes(action) ) {
                return res.status(400).json({ message: 'Invalid action' });
            }

            const userData = await user.findById(userId);

            if ( !userData ) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Update user status based on action
            switch ( action ) {
                case 'ban':
                    userData.isBanned = true;
                    userData.banReason = banReason || '';
                    break;
                case 'unban':
                    userData.isBanned = false;
                    userData.banReason = '';
                    break;
                case 'makeMember':
                    userData.isMember = true;
                    userData.subscriptionStatus = 'active';
                    break;
                case 'removeMember':
                    userData.isMember = false;
                    userData.subscriptionStatus = 'inactive';
                    break;
                case 'makeAdmin':
                    userData.isAdmin = true;
                    break;
                case 'removeAdmin':
                    userData.isAdmin = false;
                    break;
            }

            await userData.save();

            res.status(200).json({
                message: `User successfully ${ action }ed`,
                user: {
                    _id: userData._id,
                    username: userData.username,
                    isBanned: userData.isBanned,
                    isMember: userData.isMember,
                    isAdmin: userData.isAdmin,
                    subscriptionStatus: userData.subscriptionStatus,
                    banReason: userData.banReason
                }
            });
        } catch ( error ) {
            console.error('Error updating user status:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // CONTENT MANAGEMENT
    async getAllPosts( req, res ) {
        try {
            const {
                page = 1,
                limit = 10,
                sortOrder = -1,
                status,
                author,
                search = ''
            } = req.query;

            // Chuyển đổi các tham số thành số
            const parsedPage = parseInt(page);
            const parsedLimit = parseInt(limit);
            const parsedSortOrder = parseInt(sortOrder);
            const skip = ( parsedPage - 1 ) * parsedLimit;

            const query = {};

            // Áp dụng các bộ lọc
            if ( author ) {
                query['author.authorId'] = new mongoose.Types.ObjectId(author);
            }

            if ( status ) {
                query.status = status;
            }

            if ( search ) {
                query.$or = [
                    { tittle: new RegExp(search, 'i') },  // Giữ nguyên lỗi chính tả "tittle"
                    { subtittle: new RegExp(search, 'i') },  // Giữ nguyên lỗi chính tả "subtittle"
                    { content: new RegExp(search, 'i') }
                ];
            }

            const sort = { _id: parsedSortOrder };

            // Đếm tổng số bài viết thỏa mãn điều kiện
            const totalPosts = await post.countDocuments(query);

            // Lấy bài viết theo trang
            const posts = await post.find(query)
                .sort(sort)
                .skip(skip)
                .limit(parsedLimit)
                .populate('author.authorId', 'username email ava');

            // Tính toán thông tin phân trang
            const totalPages = Math.ceil(totalPosts / parsedLimit);
            const hasNextPage = parsedPage < totalPages;
            const hasPrevPage = parsedPage > 1;

            res.status(200).json({
                posts,
                pagination: {
                    currentPage: parsedPage,
                    totalPages,
                    totalItems: totalPosts,
                    limit: parsedLimit,
                    hasNextPage,
                    hasPrevPage,
                    nextPage: hasNextPage ? parsedPage + 1 : null,
                    prevPage: hasPrevPage ? parsedPage - 1 : null
                }
            });
        } catch ( error ) {
            console.error('Error getting posts:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async getPostDetails( req, res ) {
        try {
            const { postId } = req.params;

            const postData = await post.findById(postId)
                .populate('author.authorId', 'username email ava subdomain')
                .populate('topic.topicId', 'topicname');

            if ( !postData ) {
                return res.status(404).json({ message: 'Post not found' });
            }

            // Get comments for this post
            const comments = await comment.find({ post: postId })
                .populate('author', 'username email ava')
                .sort({ createdAt: -1 });

            res.status(200).json({
                post: postData,
                comments
            });
        } catch ( error ) {
            console.error('Error getting post details:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async updatePostStatus( req, res ) {
        try {
            const { postId } = req.params;
            const { action } = req.body;

            if ( !['approve', 'reject', 'feature', 'unfeature', 'delete'].includes(action) ) {
                return res.status(400).json({ message: 'Invalid action' });
            }

            const postData = await post.findById(postId);

            if ( !postData ) {
                return res.status(404).json({ message: 'Post not found' });
            }

            // Update post status based on action
            switch ( action ) {
                case 'approve':
                    postData.status = true;
                    break;
                case 'reject':
                    postData.status = false;
                    postData.isFeatured = false;
                    break;
                case 'feature':
                    postData.isFeatured = true;
                    break;
                case 'unfeature':
                    postData.isFeatured = false;
                    break;
                case 'delete':
                    await post.findByIdAndDelete(postId);
                    return res.status(200).json({ message: 'Post deleted successfully' });
            }

            await postData.save();

            // Notify the author if needed
            if ( ['approve', 'reject'].includes(action) ) {
                const newNotification = new notification({
                    recipient: postData.author.authorId,
                    sender: req.session.user._id,
                    type: action === 'approve' ? 'POST_APPROVED' : 'POST_REJECTED',
                    content: `Your post "${ postData.tittle }" has been ${ action === 'approve' ? 'approved' : 'rejected' } by admin`
                });

                await newNotification.save();

                req.io.to(postData.author.authorId.toString()).emit('newNotification', {
                    newNotification,
                    message: `Your post "${ postData.tittle }" has been ${ action === 'approve' ? 'approved' : 'rejected' }`
                });
            }

            res.status(200).json({
                message: `Post successfully ${ action }d`,
                post: {
                    _id: postData._id,
                    tittle: postData.tittle,
                    status: postData.status,
                    isFeatured: postData.isFeatured
                }
            });
        } catch ( error ) {
            console.error('Error updating post status:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // COMMENT MANAGEMENT
    async getAllComments( req, res ) {
        try {
            const {
                page = 1,
                limit = 20,
                sortOrder = -1,
                sortBy = '_id',
                postId
            } = req.query;

            // Parse parameters
            const parsedPage = parseInt(page);
            const parsedLimit = parseInt(limit);
            const parsedSortOrder = parseInt(sortOrder);
            const skip = ( parsedPage - 1 ) * parsedLimit;

            // Build query
            const query = {};

            if ( postId ) {
                query.post = new mongoose.Types.ObjectId(postId);
            }

            const sort = { [sortBy]: parsedSortOrder };

            // Get total count for pagination
            const totalComments = await comment.countDocuments(query);

            // Fetch comments for current page
            const comments = await comment.find(query)
                .sort(sort)
                .skip(skip)
                .limit(parsedLimit)
                .populate('author', 'username email ava')
                .populate('post', 'tittle');

            // Calculate pagination info
            const totalPages = Math.ceil(totalComments / parsedLimit);
            const hasNextPage = parsedPage < totalPages;
            const hasPrevPage = parsedPage > 1;

            res.status(200).json({
                comments,
                pagination: {
                    currentPage: parsedPage,
                    totalPages,
                    totalItems: totalComments,
                    limit: parsedLimit,
                    hasNextPage,
                    hasPrevPage,
                    nextPage: hasNextPage ? parsedPage + 1 : null,
                    prevPage: hasPrevPage ? parsedPage - 1 : null
                }
            });
        } catch ( error ) {
            console.error('Error getting comments:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async deleteComment( req, res ) {
        try {
            const { commentId } = req.params;

            const commentData = await comment.findById(commentId);

            if ( !commentData ) {
                return res.status(404).json({ message: 'Comment not found' });
            }

            // Delete the comment
            await comment.findByIdAndDelete(commentId);

            // Update comment count on the post
            await post.findByIdAndUpdate(
                commentData.post,
                { $inc: { comments: -1 } },
                { new: true }
            );

            // Notify the author if needed
            const newNotification = new notification({
                recipient: commentData.author,
                sender: req.session.user._id,
                type: 'COMMENT',
                content: `Your comment on a post has been removed by admin`
            });

            await newNotification.save();

            req.io.to(commentData.author.toString()).emit('newNotification', {
                newNotification,
                message: `Your comment has been removed by admin`
            });

            res.status(200).json({ message: 'Comment deleted successfully' });
        } catch ( error ) {
            console.error('Error deleting comment:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // TOPIC MANAGEMENT
    async getAllTopics( req, res ) {
        try {
            const { page = 1, limit = 10, sortBy = 'topicname', sortOrder = 1, search = '' } = req.query;

            // Convert to integers
            const currentPage = parseInt(page);
            const itemsPerPage = parseInt(limit);

            // Build query for filtering
            const query = {};
            if ( search ) {
                query.topicname = new RegExp(search, 'i');
            }

            // Calculate pagination
            const skip = ( currentPage - 1 ) * itemsPerPage;

            // Build sort object
            const sort = {};
            sort[sortBy] = parseInt(sortOrder);

            // Get topics with pagination
            const topics = await topic.find(query)
                .sort(sort)
                .skip(skip)
                .limit(itemsPerPage);

            // Get total count for pagination
            const total = await topic.countDocuments(query);

            // Calculate total pages
            const totalPages = Math.ceil(total / itemsPerPage);

            // Get post counts for each topic
            const topicsWithCounts = await Promise.all(topics.map(async ( topicItem ) => {
                const postsCount = await post.countDocuments({ 'topic.topicId': topicItem._id });

                // Convert to plain object to add the postsCount property
                const topicObject = topicItem.toObject();
                topicObject.postsCount = postsCount;

                return topicObject;
            }));

            res.status(200).json({
                topics: topicsWithCounts,
                pagination: {
                    currentPage,
                    totalPages,
                    totalItems: total,
                    limit: itemsPerPage,
                    hasNextPage: currentPage < totalPages,
                    hasPrevPage: currentPage > 1,
                    nextPage: currentPage < totalPages ? currentPage + 1 : null,
                    prevPage: currentPage > 1 ? currentPage - 1 : null
                }
            });
        } catch ( error ) {
            console.error('Error getting topics:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async getTopicDetails( req, res ) {
        try {
            const { topicId } = req.params;

            const topicData = await topic.findById(topicId);

            if ( !topicData ) {
                return res.status(404).json({ message: 'Topic not found' });
            }

            // Get tags for this topic
            const topicTags = await tag.find({ 'topic.topicId': topicId });

            // Get number of posts in this topic
            const postsCount = await post.countDocuments({ 'topic.topicId': topicId });

            // Get number of followers
            const followersCount = topicData.followers || 0;

            res.status(200).json({
                topic: topicData,
                tags: topicTags,
                stats: {
                    postsCount,
                    followersCount,
                    tagsCount: topicTags.length
                }
            });
        } catch ( error ) {
            console.error('Error getting topic details:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async createTopic( req, res ) {
        try {
            const { topicname } = req.body;

            if ( !topicname ) {
                return res.status(400).json({ message: 'Topic name is required' });
            }

            // Check if topic already exists
            const existingTopic = await topic.findOne({ topicname });
            if ( existingTopic ) {
                return res.status(400).json({ message: 'Topic already exists' });
            }

            // Create new topic
            const newTopic = new topic({
                topicname,
                tags: [],
                followers: 0
            });

            await newTopic.save();

            res.status(201).json({
                message: 'Topic created successfully',
                topic: newTopic
            });
        } catch ( error ) {
            console.error('Error creating topic:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async updateTopic( req, res ) {
        try {
            const { topicId } = req.params;
            const { topicname } = req.body;

            if ( !topicname ) {
                return res.status(400).json({ message: 'Topic name is required' });
            }

            const topicData = await topic.findById(topicId);

            if ( !topicData ) {
                return res.status(404).json({ message: 'Topic not found' });
            }

            // Check if new name already exists (if changing name)
            if ( topicname !== topicData.topicname ) {
                const existingTopic = await topic.findOne({ topicname });
                if ( existingTopic ) {
                    return res.status(400).json({ message: 'Topic name already in use' });
                }
            }

            // Update topic
            topicData.topicname = topicname;
            await topicData.save();

            // Update topic name in posts
            await post.updateMany(
                { 'topic.topicId': topicId },
                { $set: { 'topic.topicName': topicname } }
            );

            // Update topic name in tags
            await tag.updateMany(
                { 'topic.topicId': topicId },
                { $set: { 'topic.topicName': topicname } }
            );

            res.status(200).json({
                message: 'Topic updated successfully',
                topic: topicData
            });
        } catch ( error ) {
            console.error('Error updating topic:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async deleteTopic( req, res ) {
        try {
            const { topicId } = req.params;

            const topicData = await topic.findById(topicId);

            if ( !topicData ) {
                return res.status(404).json({ message: 'Topic not found' });
            }

            // Check if there are posts using this topic
            const postsWithTopic = await post.countDocuments({ 'topic.topicId': topicId });
            if ( postsWithTopic > 0 ) {
                return res.status(400).json({
                    message: 'Cannot delete topic that is used in posts',
                    postsCount: postsWithTopic
                });
            }

            // Delete associated tags
            await tag.deleteMany({ 'topic.topicId': topicId });

            // Remove topic from users' following lists
            await user.updateMany(
                { topicFollowing: topicId },
                { $pull: { topicFollowing: topicId } }
            );

            // Delete the topic
            await topic.findByIdAndDelete(topicId);

            res.status(200).json({ message: 'Topic and associated tags deleted successfully' });
        } catch ( error ) {
            console.error('Error deleting topic:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // TAG MANAGEMENT
    async getAllTags( req, res ) {
        try {
            const { page = 1, limit = 20, sortBy = 'tag', sortOrder = 1, search = '', topicId } = req.query;

            // Convert to integers
            const currentPage = parseInt(page);
            const itemsPerPage = parseInt(limit);

            // Build query for filtering
            const query = {};
            if ( search ) {
                query.tag = new RegExp(search, 'i');
            }

            if ( topicId ) {
                query['topic.topicId'] = new mongoose.Types.ObjectId(topicId);
            }

            // Calculate pagination
            const skip = ( currentPage - 1 ) * itemsPerPage;

            // Build sort object
            const sort = {};
            sort[sortBy] = parseInt(sortOrder);

            // Get tags with pagination
            const tags = await tag.find(query)
                .sort(sort)
                .skip(skip)
                .limit(itemsPerPage);

            // Get total count for pagination
            const total = await tag.countDocuments(query);

            // Calculate total pages
            const totalPages = Math.ceil(total / itemsPerPage);

            // Get post counts for each tag
            const tagsWithCounts = await Promise.all(tags.map(async ( tagItem ) => {
                const postsCount = await post.countDocuments({ 'tags.tagId': tagItem._id });

                // Convert to plain object to add the postsCount property
                const tagObject = tagItem.toObject();
                tagObject.postsCount = postsCount;

                return tagObject;
            }));

            res.status(200).json({
                tags: tagsWithCounts,
                pagination: {
                    currentPage,
                    totalPages,
                    totalItems: total,
                    limit: itemsPerPage,
                    hasNextPage: currentPage < totalPages,
                    hasPrevPage: currentPage > 1,
                    nextPage: currentPage < totalPages ? currentPage + 1 : null,
                    prevPage: currentPage > 1 ? currentPage - 1 : null
                }
            });
        } catch ( error ) {
            console.error('Error getting tags:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async getTagDetails( req, res ) {
        try {
            const { tagId } = req.params;

            const tagData = await tag.findById(tagId)
                .populate('topic.topicId', 'topicname');

            if ( !tagData ) {
                return res.status(404).json({ message: 'Tag not found' });
            }

            // Get number of posts with this tag
            const postsCount = await post.countDocuments({ 'tags.tagId': tagId });

            // Get number of followers
            const followersCount = tagData.followers || 0;

            res.status(200).json({
                tag: tagData,
                stats: {
                    postsCount,
                    followersCount
                }
            });
        } catch ( error ) {
            console.error('Error getting tag details:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async createTag( req, res ) {
        try {
            const { tag: tagName, topicId } = req.body;

            if ( !tagName ) {
                return res.status(400).json({ message: 'Tag name is required' });
            }

            // Check if topic exists if provided
            let topicData = null;
            if ( topicId ) {
                topicData = await topic.findById(topicId);
                if ( !topicData ) {
                    return res.status(404).json({ message: 'Topic not found' });
                }
            }

            // Check if tag already exists in this topic
            const existingTag = topicId
                ? await tag.findOne({ tag: tagName, 'topic.topicId': topicId })
                : await tag.findOne({ tag: tagName });

            if ( existingTag ) {
                return res.status(400).json({ message: 'Tag already exists' });
            }

            // Create new tag
            const newTag = new tag({
                tag: tagName,
                followers: 0
            });

            // Associate with topic if provided
            if ( topicData ) {
                newTag.topic = {
                    topicId: topicData._id,
                    topicName: topicData.topicname
                };

                // Add tag to topic's tags array
                topicData.tags.push({
                    tagId: newTag._id,
                    tagName: tagName
                });
                await topicData.save();
            }

            await newTag.save();

            res.status(201).json({
                message: 'Tag created successfully',
                tag: newTag
            });
        } catch ( error ) {
            console.error('Error creating tag:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async updateTag( req, res ) {
        try {
            const { tagId } = req.params;
            const { tag: tagName, topicId } = req.body;

            if ( !tagName ) {
                return res.status(400).json({ message: 'Tag name is required' });
            }

            const tagData = await tag.findById(tagId);

            if ( !tagData ) {
                return res.status(404).json({ message: 'Tag not found' });
            }

            // Check if new topic exists if changing topic
            let topicData = null;
            let oldTopicId = tagData.topic?.topicId;

            if ( topicId && ( !oldTopicId || topicId !== oldTopicId.toString() ) ) {
                topicData = await topic.findById(topicId);
                if ( !topicData ) {
                    return res.status(404).json({ message: 'New topic not found' });
                }

                // Check if tag name already exists in new topic
                const existingTag = await tag.findOne({
                    tag: tagName,
                    'topic.topicId': topicId,
                    _id: { $ne: tagId }
                });
                if ( existingTag ) {
                    return res.status(400).json({ message: 'Tag already exists in this topic' });
                }
            }

            // Update tag name in tag document
            tagData.tag = tagName;

            // Update topic association if changing
            if ( topicData ) {
                // Remove tag from old topic if it existed
                if ( oldTopicId ) {
                    await topic.updateOne(
                        { _id: oldTopicId },
                        { $pull: { tags: { tagId: tagId } } }
                    );
                }

                // Set new topic for tag
                tagData.topic = {
                    topicId: topicData._id,
                    topicName: topicData.topicname
                };

                // Add tag to new topic's tags array
                topicData.tags.push({
                    tagId: tagData._id,
                    tagName: tagName
                });
                await topicData.save();
            } else if ( tagData.topic && tagName !== tagData.tag ) {
                // Update tag name in its topic if only name is changing
                await topic.updateOne(
                    { _id: tagData.topic.topicId, 'tags.tagId': tagId },
                    { $set: { 'tags.$.tagName': tagName } }
                );
            }

            await tagData.save();

            // Update tag name in posts
            await post.updateMany(
                { 'tags.tagId': tagId },
                { $set: { 'tags.$[elem].tagName': tagName } },
                { arrayFilters: [{ 'elem.tagId': tagId }] }
            );

            res.status(200).json({
                message: 'Tag updated successfully',
                tag: tagData
            });
        } catch ( error ) {
            console.error('Error updating tag:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async deleteTag( req, res ) {
        try {
            const { tagId } = req.params;

            const tagData = await tag.findById(tagId);

            if ( !tagData ) {
                return res.status(404).json({ message: 'Tag not found' });
            }

            // Check if there are posts using this tag
            const postsWithTag = await post.countDocuments({ 'tags.tagId': tagId });
            if ( postsWithTag > 0 ) {
                return res.status(400).json({
                    message: 'Cannot delete tag that is used in posts',
                    postsCount: postsWithTag
                });
            }

            // Remove tag from topic's tags array if associated with a topic
            if ( tagData.topic && tagData.topic.topicId ) {
                await topic.updateOne(
                    { _id: tagData.topic.topicId },
                    { $pull: { tags: { tagId: tagId } } }
                );
            }

            // Remove tag from users' following lists
            await user.updateMany(
                { tagFollowing: tagId },
                { $pull: { tagFollowing: tagId } }
            );

            // Delete the tag
            await tag.findByIdAndDelete(tagId);

            res.status(200).json({ message: 'Tag deleted successfully' });
        } catch ( error ) {
            console.error('Error deleting tag:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // ANALYTICS & STATISTICS
    async getDashboardStats( req, res ) {
        try {
            // User stats
            const totalUsers = await user.countDocuments();
            const newUsersToday = await user.countDocuments({
                createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
            });
            const premiumUsers = await user.countDocuments({ isMember: true });

            // Content stats
            const totalPosts = await post.countDocuments();
            const publishedPosts = await post.countDocuments({ status: true });
            const draftPosts = await post.countDocuments({ status: false });
            const newPostsToday = await post.countDocuments({
                createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
            });

            // Comment stats
            const totalComments = await comment.countDocuments();
            const newCommentsToday = await comment.countDocuments({
                createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
            });

            const totalTopics = await topic.countDocuments();
            const totalTags = await tag.countDocuments();

            res.status(200).json({
                users: {
                    total: totalUsers,
                    newToday: newUsersToday,
                    premium: premiumUsers
                },
                posts: {
                    total: totalPosts,
                    published: publishedPosts,
                    drafts: draftPosts,
                    newToday: newPostsToday
                },
                comments: {
                    total: totalComments,
                    newToday: newCommentsToday
                },
                topics: {
                    total: totalTopics,
                },
                tags: {
                    total: totalTags,
                }
            });
        } catch ( error ) {
            console.error('Error getting dashboard stats:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async getUserGrowthStats( req, res ) {
        try {
            const { period = 'week' } = req.query;

            let startDate, groupBy;
            const today = new Date();

            switch ( period ) {
                case 'week':
                    startDate = new Date(today);
                    startDate.setDate(today.getDate() - 7);
                    groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
                    break;
                case 'month':
                    startDate = new Date(today);
                    startDate.setMonth(today.getMonth() - 1);
                    groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
                    break;
                case 'year':
                    startDate = new Date(today);
                    startDate.setFullYear(today.getFullYear() - 1);
                    groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
                    break;
                default:
                    startDate = new Date(today);
                    startDate.setDate(today.getDate() - 7);
                    groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
            }

            // Get user signups over time
            const userSignups = await user.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: groupBy,
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]);

            // Get premium subscriptions over time
            const premiumSignups = await user.aggregate([
                {
                    $match: {
                        isMember: true,
                        createdAt: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: groupBy,
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]);

            res.status(200).json({
                period,
                userSignups,
                premiumSignups
            });
        } catch ( error ) {
            console.error('Error getting user growth stats:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async getContentStats( req, res ) {
        try {
            const { period = 'week' } = req.query;

            let startDate, groupBy;
            const today = new Date();

            switch ( period ) {
                case 'week':
                    startDate = new Date(today);
                    startDate.setDate(today.getDate() - 7);
                    groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
                    break;
                case 'month':
                    startDate = new Date(today);
                    startDate.setMonth(today.getMonth() - 1);
                    groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
                    break;
                case 'year':
                    startDate = new Date(today);
                    startDate.setFullYear(today.getFullYear() - 1);
                    groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
                    break;
                default:
                    startDate = new Date(today);
                    startDate.setDate(today.getDate() - 7);
                    groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
            }

            // Get post creation over time
            const postCreation = await post.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: groupBy,
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]);

            // Get comment creation over time
            const commentCreation = await comment.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: groupBy,
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]);

            // Get top authors by post count
            const topAuthors = await post.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate },
                        status: true
                    }
                },
                {
                    $group: {
                        _id: '$author.authorId',
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { count: -1 }
                },
                {
                    $limit: 10
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'authorData'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        count: 1,
                        author: { $arrayElemAt: ['$authorData', 0] }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        count: 1,
                        'author.username': 1,
                        'author.email': 1,
                        'author.ava': 1
                    }
                }
            ]);

            res.status(200).json({
                period,
                postCreation,
                commentCreation,
                topAuthors
            });
        } catch ( error ) {
            console.error('Error getting content stats:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // SYSTEM SETTINGS
    async getSystemSettings( req, res ) {
        try {
            // Replace with actual implementation when you have a settings model
            // This is a placeholder
            const settings = {
                siteName: 'Your Blog Platform',
                siteDescription: 'A platform for sharing thoughts and ideas',
                maintenanceMode: false,
                allowRegistration: true,
                requireApprovalForPosts: false,
                membershipOptions: [
                    {
                        name: 'Monthly',
                        price: 9.99,
                        active: true
                    },
                    {
                        name: 'Yearly',
                        price: 99.99,
                        active: true
                    }
                ]
            };

            res.status(200).json(settings);
        } catch ( error ) {
            console.error('Error getting system settings:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async updateSystemSettings( req, res ) {
        try {
            // This is a placeholder for when you create a settings model
            const {
                siteName,
                siteDescription,
                maintenanceMode,
                allowRegistration,
                requireApprovalForPosts,
                membershipOptions
            } = req.body;

            // Validate inputs
            if ( membershipOptions ) {
                for ( const option of membershipOptions ) {
                    if ( !option.name || option.price === undefined ) {
                        return res.status(400).json({ message: 'Membership options require name and price' });
                    }
                }
            }

            // Placeholder for saving settings
            const settings = {
                siteName: siteName || 'Your Blog Platform',
                siteDescription: siteDescription || 'A platform for sharing thoughts and ideas',
                maintenanceMode: maintenanceMode !== undefined ? maintenanceMode : false,
                allowRegistration: allowRegistration !== undefined ? allowRegistration : true,
                requireApprovalForPosts: requireApprovalForPosts !== undefined ? requireApprovalForPosts : false,
                membershipOptions: membershipOptions || [
                    {
                        name: 'Monthly',
                        price: 9.99,
                        active: true
                    },
                    {
                        name: 'Yearly',
                        price: 99.99,
                        active: true
                    }
                ]
            };

            res.status(200).json({
                message: 'Settings updated successfully',
                settings
            });
        } catch ( error ) {
            console.error('Error updating system settings:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

export default new AdminController();
import post from '../models/PostModel.js';
import user from '../models/UserModel.js';
import like from '../models/LikeModel.js';
import notification from '../models/NotificationModel.js';
import mongoose from 'mongoose';

class PostController {
    async GetAllPublish( req, res, next ) {
        try {
            const User = await user.findById(req.session.user._id);
            const limit = parseInt(req.query.limit) || 5; // Số bài viết mỗi trang

            // Sử dụng phân trang dựa trên cursor thay vì offset
            const lastId = req.query.lastId || null; // ID cuối cùng từ trang trước

            const hiddenPostIds = ( User.hiddenStories || [] ).map(id =>
                new mongoose.Types.ObjectId(id.toString())
            );

            const hiddenAuthorIds = ( User.hiddenAuthors || [] ).map(id =>
                new mongoose.Types.ObjectId(id.toString())
            );

            // Xây dựng điều kiện lọc cho phân trang cursor
            let matchCondition = {
                status: true,
                _id: { $nin: hiddenPostIds },
                'author.authorId': { $nin: hiddenAuthorIds }
            };

            // Thêm điều kiện cursor nếu có lastId
            if ( lastId ) {
                matchCondition._id = {
                    ...matchCondition._id,
                    $lt: new mongoose.Types.ObjectId(lastId)
                };
            }

            const posts = await post.aggregate([
                {
                    $match: matchCondition
                },
                {
                    $sort: {
                        _id: -1 // Sắp xếp theo _id giảm dần để phân trang nhất quán
                    }
                },
                {
                    $limit: limit
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'author.authorId',
                        foreignField: '_id',
                        as: 'authorDetails'
                    }
                },
                {
                    $addFields: {
                        'author.ava': { $arrayElemAt: ['$authorDetails.ava', 0] }
                    }
                },
                {
                    $lookup: {
                        from: 'comments',
                        localField: '_id',
                        foreignField: 'post',
                        as: 'comments'
                    }
                },
                {
                    $addFields: {
                        commentCount: { $size: '$comments' }
                    }
                },
                {
                    $project: {
                        comments: 0,
                        authorDetails: 0
                    }
                }
            ]);

            // Kiểm tra xem còn kết quả không
            const hasMore = posts.length === limit;

            return res.status(200).json({
                posts,
                pagination: {
                    hasMore,
                    nextCursor: posts.length > 0 ? posts[posts.length - 1]._id : null
                }
            });
        } catch ( err ) {
            console.error('Error in GetAllPublish:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async GetMyDraft( req, res, next ) {
        try {
            const userId = req.session.user._id;
            const limit = parseInt(req.query.limit) || 10;
            const cursor = req.query.cursor || null;

            // Parse cursor if provided
            let cursorCondition = {};
            if ( cursor ) {
                const [_, postId] = cursor.split('_');
                cursorCondition = {
                    _id: { $lt: new mongoose.Types.ObjectId(postId) }
                };
            }

            // Build the query
            const query = {
                status: false,
                'author.authorId': userId,
                ...( cursor && cursorCondition )
            };

            // Execute the query with pagination and include author avatar
            const data = await post.find(query)
                .sort({ _id: -1 })
                .limit(limit + 1)
                .populate({
                    path: 'author.authorId',
                    select: 'username ava',
                    model: 'users'
                });

            // Add author avatar to each post
            const paginatedData = data.slice(0, Math.min(limit, data.length)).map(post => {
                const postObj = post.toObject();
                if ( post.author && post.author.authorId ) {
                    postObj.author.ava = post.author.authorId.ava || '';
                }
                return postObj;
            });

            // Check if there are more results
            const hasMore = data.length > limit;

            // Create next cursor if there are more results
            let nextCursor = null;
            if ( hasMore && paginatedData.length > 0 ) {
                const lastItem = paginatedData[paginatedData.length - 1];
                nextCursor = `_${ lastItem._id }`;
            }

            res.status(200).json({
                data: paginatedData,
                pagination: {
                    hasMore,
                    nextCursor
                }
            });
        } catch ( error ) {
            next(error);
        }
    }

    async GetMyPublish( req, res, next ) {
        try {
            const userId = req.session.user._id;
            const limit = parseInt(req.query.limit) || 10;
            const cursor = req.query.cursor || null;

            // Parse cursor if provided
            let cursorCondition = {};
            if ( cursor ) {
                const [_, postId] = cursor.split('_');
                cursorCondition = {
                    _id: { $lt: new mongoose.Types.ObjectId(postId) }
                };
            }

            // Build the query
            const query = {
                status: true,
                'author.authorId': userId,
                ...( cursor && cursorCondition )
            };

            // Execute the query with pagination and include author avatar
            const data = await post.find(query)
                .sort({ _id: -1 })
                .limit(limit + 1)
                .populate({
                    path: 'author.authorId',
                    select: 'username ava',
                    model: 'users'
                });

            // Add author avatar to each post
            const paginatedData = data.slice(0, Math.min(limit, data.length)).map(post => {
                const postObj = post.toObject();
                if ( post.author && post.author.authorId ) {
                    postObj.author.ava = post.author.authorId.ava || '';
                }
                return postObj;
            });

            // Check if there are more results
            const hasMore = data.length > limit;

            // Create next cursor if there are more results
            let nextCursor = null;
            if ( hasMore && paginatedData.length > 0 ) {
                const lastItem = paginatedData[paginatedData.length - 1];
                nextCursor = `_${ lastItem._id }`;
            }

            res.status(200).json({
                data: paginatedData,
                pagination: {
                    hasMore,
                    nextCursor
                }
            });
        } catch ( error ) {
            next(error);
        }
    }

    async GetByAuthor( req, res, next ) {
        try {
            const { id, cursor } = req.query;
            const limit = parseInt(req.query.limit) || 10;

            const authorId = new mongoose.Types.ObjectId(id);

            // Cursor condition (chỉ dựa vào _id)
            let cursorCondition = {};
            if ( cursor ) {
                const postId = new mongoose.Types.ObjectId(cursor);
                cursorCondition = { _id: { $lt: postId } }; // nhỏ hơn _id => cũ hơn
            }

            const query = {
                'author.authorId': authorId,
                status: true,
                ...cursorCondition
            };

            // Get posts and populate author info including avatar
            const posts = await post.find(query)
                .sort({ _id: -1 }) // sort theo _id mới nhất
                .limit(limit + 1)
                .populate({
                    path: 'author.authorId',
                    select: 'username ava',
                    model: 'users'
                });

            // Transform data to include author avatar
            const data = posts.map(post => {
                const postObj = post.toObject();
                if ( post.author && post.author.authorId ) {
                    postObj.author.ava = post.author.authorId.ava || '';
                }
                return postObj;
            });

            const hasMore = data.length > limit;
            const paginatedData = data.slice(0, limit);

            let nextCursor = null;
            if ( hasMore ) {
                nextCursor = paginatedData[paginatedData.length - 1]._id.toString();
            }

            res.status(200).json({
                data: paginatedData,
                pagination: {
                    hasMore,
                    nextCursor
                }
            });
        } catch ( err ) {
            next(err);
        }
    }

    async GetById( req, res, next ) {
        try {
            const postId = req.params.id;

            const result = await post.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(postId) } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'author.authorId',
                        foreignField: '_id',
                        as: 'authorDetails'
                    }
                },
                {
                    $addFields: {
                        'author.ava': { $arrayElemAt: ['$authorDetails.ava', 0] }
                    }
                },
                {
                    $lookup: {
                        from: 'histories', // tên collection (plural)
                        localField: '_id',
                        foreignField: 'post',
                        as: 'readingHistory'
                    }
                },
                {
                    $addFields: {
                        totalReadDuration: {
                            $sum: '$readingHistory.readDuration'
                        }
                    }
                },
                {
                    $project: {
                        readingHistory: 0, // không trả về danh sách lịch sử đọc
                        authorDetails: 0 // không trả về chi tiết author (đã lấy ava)
                    }
                }
            ]);

            if ( !result.length ) {
                return res.status(404).json({ error: 'Post not found' });
            }

            await post.findByIdAndUpdate(
                postId,
                { $set: { views: result[0].totalReadDuration } },
                { new: true }
            );

            res.status(200).json(result[0]);
        } catch ( err ) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }

    async GetByFollow( req, res, next ) {
        try {
            const userId = req.session.user._id;
            const limit = parseInt(req.query.limit) || 10;
            const cursor = req.query.cursor || null;

            // Get user's following data
            const users = await user.findOne({ _id: userId });

            // Prepare cursor condition if cursor is provided
            let cursorCondition = {};
            if ( cursor ) {
                const postId = cursor;
                cursorCondition = {
                    _id: { $lt: new mongoose.Types.ObjectId(postId) }
                };
            }

            // Build base query for each type of followed content
            const baseQuery = {
                status: true,
                ...cursorCondition
            };

            // Apply find with appropriate population for author avatar
            const findWithAuthorAva = async ( query ) => {
                const posts = await post.find(query)
                    .sort({ _id: -1 })
                    .limit(limit + 1)
                    .populate({
                        path: 'author.authorId',
                        select: 'username ava',
                        model: 'users'
                    });

                return posts.map(post => {
                    const postObj = post.toObject();
                    if ( post.author && post.author.authorId ) {
                        postObj.author.ava = post.author.authorId.ava || '';
                    }
                    return postObj;
                });
            };

            // Execute queries with author avatar population
            const followingPosts = await findWithAuthorAva({
                'author.authorId': { $in: users.following },
                ...baseQuery
            });

            const topicFollowingPosts = await findWithAuthorAva({
                'topic.topicId': { $in: users.topicFollowing },
                'author.authorId': { $nin: userId },
                ...baseQuery
            });

            const tagFollowingPosts = await findWithAuthorAva({
                'tags.tagId': { $in: users.tagFollowing },
                'author.authorId': { $nin: userId },
                ...baseQuery
            });

            // Combine all posts and remove duplicates
            const combinedPosts = [
                ...followingPosts,
                ...topicFollowingPosts,
                ...tagFollowingPosts
            ];

            const dataMap = new Map();
            combinedPosts.forEach(post => {
                dataMap.set(post._id.toString(), post);
            });

            // Convert to array and sort
            const data = Array.from(dataMap.values());
            data.sort(( a, b ) =>
                b._id.toString().localeCompare(a._id.toString()));

            // Check if there are more results
            const hasMore = data.length > limit;
            const paginatedData = data.slice(0, limit);

            // Create next cursor if there are more results
            let nextCursor = null;
            if ( hasMore && paginatedData.length > 0 ) {
                nextCursor = paginatedData[paginatedData.length - 1]._id.toString();
            }

            res.status(200).json({
                data: paginatedData,
                pagination: {
                    hasMore,
                    nextCursor
                }
            });
        } catch ( error ) {
            res.status(500).json(error);
            console.log(error);
        }
    }

    async GetByTag( req, res ) {
        try {
            const { tag, filter = 'latest' } = req.query;

            const matchStage = {
                status: true,
                $or: [
                    { 'topic.topicName': tag },
                    { 'tags.tagName': tag }
                ]
            };

            let pipeline = [{ $match: matchStage }];

            // Xử lý các filter khác nhau
            switch ( filter.toLowerCase() ) {
                case 'latest':
                    pipeline.push({
                        $sort: { _id: -1 }
                    });
                    break;

                case 'oldest':
                    pipeline.push({
                        $sort: { _id: 1 }
                    });
                    break;

                case '10mostread':
                    pipeline = [
                        { $match: matchStage },
                        {
                            $lookup: {
                                from: 'histories',
                                localField: '_id',
                                foreignField: 'post',
                                as: 'historyData'
                            }
                        },
                        {
                            $addFields: {
                                totalReadDuration: { $sum: '$historyData.readDuration' }
                            }
                        },
                        {
                            $sort: { totalReadDuration: -1 }
                        },
                        {
                            $limit: 10
                        },
                        {
                            $project: {
                                historyData: 0
                            }
                        }
                    ];
                    break;

                case 'view':
                    pipeline = [
                        { $match: matchStage },
                        {
                            $lookup: {
                                from: 'histories', // Tên collection history (nhớ viết đúng)
                                localField: '_id',
                                foreignField: 'post',
                                as: 'historyData'
                            }
                        },
                        {
                            $addFields: {
                                totalReadDuration: { $sum: '$historyData.readDuration' }
                            }
                        },
                        {
                            $sort: { totalReadDuration: -1 }
                        },
                        {
                            $project: {
                                historyData: 0 // ẩn field nếu không cần
                            }
                        }
                    ];
                    break;
                default:
                    // Mặc định sắp xếp theo thời gian mới nhất
                    pipeline.push({
                        $sort: { _id: -1 }
                    });
                    break;
            }

            // Add lookup stage to get author avatar
            pipeline.push(
                {
                    $lookup: {
                        from: 'users',
                        localField: 'author.authorId',
                        foreignField: '_id',
                        as: 'authorDetails'
                    }
                },
                {
                    $addFields: {
                        'author.ava': { $arrayElemAt: ['$authorDetails.ava', 0] }
                    }
                },
                {
                    $project: {
                        authorDetails: 0 // Remove the authorDetails array
                    }
                }
            );

            const data = await post.aggregate(pipeline);

            res.status(200).json(data);
        } catch ( error ) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }

    async GetStaffPick( req, res, next ) {
        try {
            // Create query for featured posts
            const query = { isFeatured: true };

            // Check if we need to filter by additional criteria (optional)
            if ( req.query.topic ) {
                query['topic.topicId'] = req.query.topic;
            }

            // Optional limit parameter
            const limit = req.query.limit ? parseInt(req.query.limit) : undefined;

            // Fetch featured posts with more detailed author info including avatar
            let featuredPostsQuery = post.find(query)
                .populate({
                    path: 'author.authorId',
                    select: 'username ava',
                    model: 'users'
                })
                .populate('topic.topicId', 'name')
                .sort({ createdAt: -1 })
                .lean();

            // Apply limit if provided
            if ( limit ) {
                featuredPostsQuery = featuredPostsQuery.limit(limit);
            }

            // Execute query
            const featuredPosts = await featuredPostsQuery;

            // Process posts to include avatar directly in author object
            const processedPosts = featuredPosts.map(post => {
                if ( post.author && post.author.authorId ) {
                    post.author.ava = post.author.authorId.ava || '';
                }
                return post;
            });

            // Return formatted response
            return res.status(200).json({
                success: true,
                data: processedPosts,
                count: processedPosts.length
            });
        } catch ( error ) {
            console.error('Error fetching staff picks:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch featured posts',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async Like( req, res, next ) {
        try {
            const postId = req.params.id;
            const userId = req.session.user._id;
            const ONE_DAY = 24 * 60 * 60 * 1000; // 1 ngày tính bằng mili giây
            const DAILY_LIMIT = 5; // Giới hạn 10 lần like một bài viết trong 1 ngày

            // Lấy thời điểm hiện tại
            const now = new Date();

            // Tính thời điểm bắt đầu của ngày hiện tại (00:00:00)
            const startOfDay = new Date(now);
            startOfDay.setHours(0, 0, 0, 0);

            // Tìm tất cả các like của người dùng cho bài viết cụ thể này trong ngày hiện tại
            const dailyLikes = await like.find({
                post: postId,
                user: userId,
                createdAt: { $gte: startOfDay }
            });

            // Kiểm tra số lượng like trong ngày cho bài viết cụ thể này
            if ( dailyLikes.length >= DAILY_LIMIT ) {
                // Tính thời gian còn lại đến ngày mới (00:00:00 ngày mai)
                const tomorrow = new Date(startOfDay);
                tomorrow.setDate(tomorrow.getDate() + 1);
                const remainingMilliseconds = tomorrow.getTime() - now.getTime();
                const remainingHours = Math.floor(remainingMilliseconds / ( 60 * 60 * 1000 ));
                const remainingMinutes = Math.floor(( remainingMilliseconds % ( 60 * 60 * 1000 ) ) / ( 60 * 1000 ));

                return res.status(429).json({
                    message: `You've reached the daily limit of ${ DAILY_LIMIT } likes for this post.`,
                    remainingTime: `${ remainingHours }h ${ remainingMinutes }m until reset`,
                    resetTime: tomorrow.toISOString()
                });
            }

            // Tạo like mới với timestamp
            const newLike = new like({
                post: postId,
                user: userId,
            });

            await newLike.save();

            // Tăng số lượng like cho bài viết
            await post.updateOne({ _id: postId }, { $inc: { likes: 1 } });

            res.status(200).json({
                message: 'You liked this post',
                likesToday: dailyLikes.length + 1,
                remainingLikes: DAILY_LIMIT - dailyLikes.length - 1,
                dailyLimit: DAILY_LIMIT
            });
        } catch ( err ) {
            console.log(err);
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    }

    async Create( req, res, next ) {
        // Start a session for transaction
        const session = await mongoose.startSession();

        try {
            // Start transaction
            session.startTransaction();

            const newPost = new post(req.body);
            await newPost.save({ session });

            // If the post is published
            if ( newPost.status === true ) {
                await this.createNotificationsForFollowers(newPost, session);
            }

            // Commit the transaction
            await session.commitTransaction();

            res.status(200).json({ message: 'Post created successfully' });
        } catch ( err ) {
            // Abort transaction in case of error
            await session.abortTransaction();
            res.status(500).json({ message: 'Error creating post', error: err.message });
        } finally {
            // End session
            session.endSession();
        }
    }

    async Update( req, res, next ) {
        // Start a session for transaction
        const session = await mongoose.startSession();

        try {
            // Start transaction
            session.startTransaction();

            // Get post information before update
            const oldPost = await post.findById(req.params.id).session(session);

            if ( !oldPost ) {
                throw new Error('Post not found');
            }

            // Update the post
            await post.updateOne(req.body)
                .where('_id')
                .equals(req.params.id)
                .session(session)
                .exec();

            // Check if post status changed from draft to published
            if ( !oldPost.status && req.body.status === true ) {
                // Get updated post to have the latest information
                const updatedPost = await post.findById(req.params.id).session(session);
                await this.createNotificationsForFollowers(updatedPost, session);
            }

            // Commit the transaction
            await session.commitTransaction();

            res.status(200).json({ message: 'Post updated successfully' });
        } catch ( err ) {
            // Abort transaction in case of error
            await session.abortTransaction();
            res.status(500).json({ message: 'Error updating post', error: err.message });
        } finally {
            // End session
            session.endSession();
        }
    }

    // Function to create notifications for followers
    async createNotificationsForFollowers( postData, session ) {
        try {
            // Get the list of author's followers
            const author = await user.findById(postData.author.authorId).session(session);
            if ( !author || !author.followers || author.followers.length === 0 ) {
                return;
            }

            // Create notifications for each follower
            const notifications = author.followers.map(followerId => ( {
                recipient: followerId,
                sender: postData.author.authorId,
                type: 'ARTICLE_PUBLISHED',
                content: `${ author.username } has published a new article: ${ postData.tittle }`,
                relatedEntity: postData._id,
                entityModel: 'posts',
                isRead: false
            } ));

            // Save all notifications to database using the same session
            await notification.insertMany(notifications, { session });
        } catch ( error ) {
            console.error('Error creating notifications:', error);
            throw error; // Rethrow to ensure transaction is aborted
        }
    }

    async Search( req, res, next ) {
        try {
            const { q, page = 1, limit = 10, tag, author, sortBy = 'relevance' } = req.query;
            let query = {};
            const skip = ( page - 1 ) * limit;

            // Tìm kiếm gần đúng với regex thay vì $text
            if ( q ) {
                // Tạo regex không phân biệt hoa thường và tìm kiếm gần đúng
                const searchRegex = new RegExp(q, 'i');

                // Tìm kiếm gần đúng trong các trường title, content, description
                query = {
                    $or: [
                        { tittle: searchRegex },
                        { content: searchRegex },
                        { subtittle: searchRegex },
                        { 'tags.tagName': searchRegex },
                        { 'topic.topicName': searchRegex }// Tìm kiếm trong tagName nếu cần
                    ]
                };
            }

            // Lọc theo tag nếu có
            if ( tag ) {
                query['tags.tagName'] = tag;
            }

            // Lọc theo author nếu có
            if ( author ) {
                query.author = author;
            }

            // Thiết lập sắp xếp
            let sort = {};
            if ( sortBy === 'date' ) {
                sort = { createdAt: -1 };
            } else if ( sortBy === 'popular' ) {
                sort = { views: -1 }; // Giả sử có field views
            } else if ( sortBy === 'likes' ) {
                sort = { likes: -1 }; // Sắp xếp theo lượt thích
            } else {
                // Mặc định sắp xếp theo relevance không dùng textScore nữa
                sort = { createdAt: -1 }; // Thay thế bằng trường khác phù hợp
            }

            // Tìm kiếm bài viết và populate thông tin author bao gồm avatar
            const posts = await post.find(query)
                .sort(sort)
                .populate({
                    path: 'author.authorId',
                    select: 'username ava',
                    model: 'users'
                })
                .populate('tags.tagName')
                .skip(skip)
                .limit(parseInt(limit))
                .lean();

            // Xử lý kết quả để đưa avatar vào trực tiếp trong đối tượng author
            const processedPosts = posts.map(post => {
                if ( post.author && post.author.authorId ) {
                    post.author.ava = post.author.authorId.ava || '';
                }
                return post;
            });

            // Đếm tổng số kết quả
            const total = await post.countDocuments(query);

            res.json({
                posts: processedPosts,
                total,
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit)
            });
        } catch ( err ) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }
}

async function updateTagIdsToObjectId() {
    try {
        // Tìm tất cả các post có chứa tagId dạng string
        const posts = await post.find({ 'tags.tagId': { $type: 'string' } });

        let bulkOps = [];

        // Duyệt qua mỗi post để chuẩn bị thao tác cập nhật
        for ( const post of posts ) {
            const updatedTags = post.tags.map(tag => {
                if ( tag.tagId && typeof tag.tagId === 'string' && mongoose.Types.ObjectId.isValid(tag.tagId) ) {
                    return {
                        ...tag,
                        tagId: new mongoose.Types.ObjectId(tag.tagId)
                    };
                }
                return tag;
            });

            // Thêm thao tác cập nhật vào danh sách bulkOps
            bulkOps.push({
                updateOne: {
                    filter: { _id: post._id },
                    update: { $set: { tags: updatedTags } }
                }
            });
        }

        // Thực hiện cập nhật hàng loạt nếu có thao tác cập nhật
        let result = { matchedCount: 0, modifiedCount: 0 };
        if ( bulkOps.length > 0 ) {
            result = await post.bulkWrite(bulkOps);
        }

        return {
            success: true,
            processedPosts: posts.length,
            updatedPosts: result.modifiedCount
        };
    } catch ( error ) {
        console.error('Lỗi khi cập nhật tagId:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

export default new PostController();

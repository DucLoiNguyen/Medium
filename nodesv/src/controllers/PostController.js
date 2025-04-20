import post from '../models/PostModel.js';
import user from '../models/UserModel.js';
import like from '../models/LikeModel.js';
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
                        comments: 0
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

            // Execute the query with pagination
            const data = await post.find(query)
                .sort({ _id: -1 })
                .limit(limit + 1);

            // Check if there are more results
            const hasMore = data.length > limit;
            const paginatedData = data.slice(0, limit);

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

        await post.updateMany(
            { 'author.authorId': { $type: 'string' } }, // chỉ update nếu đang là string
            [
                {
                    $set: {
                        'author.authorId': { $toObjectId: '$author.authorId' }
                    }
                }
            ]
        );

        await post.updateMany(
            { 'topic.topicId': { $type: 'string' } }, // chỉ update nếu đang là string
            [
                {
                    $set: {
                        'topic.topicId': { $toObjectId: '$topic.topicId' }
                    }
                }
            ]
        );

        await updateTagIdsToObjectId();
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

            // Execute the query with pagination
            const data = await post.find(query)
                .sort({ _id: -1 })
                .limit(limit + 1);

            // Check if there are more results
            const hasMore = data.length > limit;
            const paginatedData = data.slice(0, limit);

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

            const data = await post
                .find(query)
                .sort({ _id: -1 }) // sort theo _id mới nhất
                .limit(limit + 1);

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
                        readingHistory: 0 // không trả về danh sách lịch sử đọc
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
                const [createdAt, postId] = cursor.split('_');
                cursorCondition = {
                    $or: [
                        {
                            _id: { $lt: postId }
                        }
                    ]
                };
            }

            // Build base query for each type of followed content
            const baseQuery = {
                status: true,
                ...cursorCondition
            };

            // Execute queries
            const followingPosts = await post.find({
                'author.authorId': { $in: users.following },
                ...baseQuery
            }).sort({ _id: -1 }).limit(limit + 1);

            const topicFollowingPosts = await post.find({
                'topic.topicId': { $in: users.topicFollowing },
                'author.authorId': { $nin: userId },
                ...baseQuery
            }).sort({ _id: -1 }).limit(limit + 1);

            const tagFollowingPosts = await post.find({
                'tags.tagId': { $in: users.tagFollowing },
                'author.authorId': { $nin: userId },
                ...baseQuery
            }).sort({ _id: -1 }).limit(limit + 1);

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

            const data = await post.aggregate(pipeline);

            res.status(200).json(data);
        } catch ( error ) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }

    async Like( req, res, next ) {
        try {
            const LIMIT_LIKES_PER_10_MINUTES = 5;
            const LIKE_WINDOW_MS = 10 * 60 * 1000;
            const postId = req.params.id;
            const userId = req.session.user._id;

            const existingLike = await like.findOne({ post: postId, user: userId });

            if ( !existingLike ) {
                const newLike = new like({
                    post: postId,
                    user: userId
                });

                newLike.save();
            }

            await post.updateOne({ _id: req.params.id }, { $inc: { likes: 1 } });

            res.status(200).json({ message: 'You liked this post' });
        } catch ( err ) {
            console.log(err);
            res.status(500).json(err);
        }
    }

    Create( req, res, next ) {
        const newPost = new post(req.body);
        newPost.save()
            .then(( data ) => res.status(200).send('save successfully'))
            .catch(( err ) => res.status(500).send(err));
    }

    Update( req, res, next ) {
        post.updateOne(req.body)
            .where('_id')
            .equals(req.params.id)
            .exec()
            .then(() => res.status(200).send('update successfully'))
            .catch(( err ) => res.status(500).send(err));
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

            // Thực hiện truy vấn với phân trang
            const posts = await post.find(query)
                .sort(sort)
                .populate('tags.tagName')
                .populate('author', 'username ava') // Populate thêm thông tin tác giả nếu cần
                .skip(skip)
                .limit(parseInt(limit));

            // Đếm tổng số kết quả
            const total = await post.countDocuments(query);

            res.json({
                posts,
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

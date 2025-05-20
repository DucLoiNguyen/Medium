import recommendation from '../models/RecommendationModel.js';
import post from '../models/PostModel.js';
import history from '../models/HistoryModel.js';
import user from '../models/UserModel.js';
import mongoose from 'mongoose';

// Vector hóa bài viết dựa trên topic và tags
function vectorizePost( post ) {
    // Tạo một vector đơn giản dựa trên topic và tags
    const vector = {
        topicId: post.topic.topicId,
        tagIds: post.tags.map(tag => tag.tagId.toString())
    };
    return vector;
}

// Tính độ tương đồng giữa hai bài viết
function calculateSimilarity( post1, post2 ) {
    const vector1 = vectorizePost(post1);
    const vector2 = vectorizePost(post2);

    // Tính điểm dựa trên topic giống nhau
    let score = vector1.topicId.equals(vector2.topicId) ? 0.5 : 0;

    // Tính điểm dựa trên tags trùng nhau
    const commonTags = vector1.tagIds.filter(tag => vector2.tagIds.includes(tag));
    const tagScore = commonTags.length / Math.max(vector1.tagIds.length, vector2.tagIds.length, 1) * 0.5;

    return score + tagScore; // Tổng điểm từ 0-1
}

// Lấy bài viết gợi ý dựa trên nội dung (Content-based)
async function getContentBasedRecommendations( userId, limit = 10 ) {
    try {
        // Lấy lịch sử đọc của người dùng
        const userHistory = await history.find({
            user: userId,
            $or: [
                { readPercentage: { $gte: 50 } }, // Đã đọc ít nhất 50%
                { isCompleted: true }             // Hoặc đã đọc xong
            ]
        }).populate('post').sort({ readAt: -1 }).limit(20);

        if ( userHistory.length === 0 ) {
            return [];
        }

        // Lấy các post đã đọc
        const readPostIds = userHistory.map(h => h.post._id);

        // Lấy các topic và tag IDs từ lịch sử đọc
        const relevantTopicIds = [...new Set(userHistory.map(h => h.post.topic.topicId.toString()))];
        const relevantTagIds = [...new Set(userHistory.flatMap(h => h.post.tags.map(t => t.tagId.toString())))];

        // Tìm các bài viết có cùng topic hoặc tag
        const similarPosts = await post.find({
            _id: { $nin: readPostIds }, // Loại trừ các bài đã đọc
            $or: [
                { 'topic.topicId': { $in: relevantTopicIds.map(id => new mongoose.Types.ObjectId(id)) } },
                { 'tags.tagId': { $in: relevantTagIds.map(id => new mongoose.Types.ObjectId(id)) } }
            ],
            status: true // Chỉ lấy bài đã được phê duyệt
        }).limit(50);

        // Tính điểm tương đồng cho mỗi bài viết
        const scoredPosts = [];
        for ( const post of similarPosts ) {
            let maxScore = 0;
            for ( const history of userHistory ) {
                const similarity = calculateSimilarity(history.post, post);
                maxScore = Math.max(maxScore, similarity);
            }

            scoredPosts.push({
                post: post._id,
                score: maxScore,
                reason: 'content'
            });
        }

        // Sắp xếp theo điểm và giới hạn số lượng
        return scoredPosts
            .sort(( a, b ) => b.score - a.score)
            .slice(0, limit);

    } catch ( error ) {
        console.error('Error in content-based recommendations:', error);
        return [];
    }
}

// Lấy bài viết gợi ý dựa trên người dùng tương tự (Collaborative Filtering)
async function getCollaborativeRecommendations( userId, limit = 10 ) {
    try {
        // Lấy lịch sử đọc của người dùng
        const userHistory = await history.find({
            user: userId,
            $or: [
                { readPercentage: { $gte: 50 } },
                { isCompleted: true }
            ]
        });

        if ( userHistory.length === 0 ) {
            return [];
        }

        // Lấy ID các bài viết người dùng đã đọc
        const readPostIds = userHistory.map(h => h.post);

        // Tìm người dùng có hoạt động đọc tương tự
        const similarUsers = await history.aggregate([
            {
                $match: {
                    user: { $ne: new mongoose.Types.ObjectId(userId) },
                    post: { $in: readPostIds },
                    $or: [{ readPercentage: { $gte: 50 } }, { isCompleted: true }]
                }
            },
            {
                $group: {
                    _id: '$user',
                    commonPosts: { $sum: 1 }
                }
            },
            {
                $match: {
                    commonPosts: { $gte: 2 } // Người dùng phải có ít nhất 2 bài đọc chung
                }
            },
            {
                $sort: { commonPosts: -1 }
            },
            {
                $limit: 20 // Lấy tối đa 20 người dùng tương tự
            }
        ]);

        if ( similarUsers.length === 0 ) {
            return [];
        }

        // Lấy bài viết mà những người tương tự đã đọc nhưng người dùng hiện tại chưa đọc
        const similarUserIds = similarUsers.map(u => u._id);
        const recommendedPosts = await history.aggregate([
            {
                $match: {
                    user: { $in: similarUserIds },
                    post: { $nin: readPostIds },
                    $or: [{ readPercentage: { $gte: 60 } }, { isCompleted: true }]
                }
            },
            {
                $group: {
                    _id: '$post',
                    userCount: { $sum: 1 },
                    avgReadPercentage: { $avg: '$readPercentage' },
                    completedCount: {
                        $sum: { $cond: [{ $eq: ['$isCompleted', true] }, 1, 0] }
                    }
                }
            },
            {
                $sort: { userCount: -1, avgReadPercentage: -1, completedCount: -1 }
            },
            {
                $limit: limit * 2
            }
        ]);

        // Lấy thông tin chi tiết về các bài viết và tính điểm
        const postDetails = await post.find({
            _id: { $in: recommendedPosts.map(p => p._id) },
            status: true // Chỉ lấy bài đã được phê duyệt
        });

        const scoredPosts = postDetails.map(post => {
            const stats = recommendedPosts.find(p => p._id.equals(post._id));
            // Tính điểm dựa trên số người đọc và tỷ lệ đọc hoàn thành
            const score = ( stats.userCount / similarUsers.length ) * 0.6 +
                ( stats.avgReadPercentage / 100 ) * 0.2 +
                ( stats.completedCount / stats.userCount ) * 0.2;

            return {
                post: post._id,
                score: score,
                reason: 'collaborative'
            };
        });

        return scoredPosts
            .sort(( a, b ) => b.score - a.score)
            .slice(0, limit);

    } catch ( error ) {
        console.error('Error in collaborative recommendations:', error);
        return [];
    }
}

// Lấy các bài viết thịnh hành (Trending)
async function getTrendingRecommendations( userId, limit = 5 ) {
    try {
        // Lấy ID các bài viết người dùng đã đọc
        const userHistory = await history.find({ user: userId });
        const readPostIds = userHistory.map(h => h.post);

        // Tính điểm trending dựa trên lượt xem, likes và comments gần đây
        const trendingPosts = await post.aggregate([
            {
                $match: {
                    _id: { $nin: readPostIds },
                    status: true,
                    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // 7 ngày gần đây
                }
            },
            {
                $addFields: {
                    trendingScore: {
                        $add: [
                            { $multiply: ['$views', 1] },
                            { $multiply: ['$likes', 3] },
                            { $multiply: ['$comments', 5] }
                        ]
                    }
                }
            },
            {
                $sort: { trendingScore: -1 }
            },
            {
                $limit: limit
            }
        ]);

        return trendingPosts.map(post => ( {
            post: post._id,
            score: post.trendingScore / 100, // Chuẩn hóa điểm về 0-1
            reason: 'trending'
        } ));

    } catch ( error ) {
        console.error('Error in trending recommendations:', error);
        return [];
    }
}

// Hàm chính tạo gợi ý cho người dùng
async function generateRecommendations( userId ) {
    try {
        // Kiểm tra xem có gợi ý được tạo gần đây không (trong vòng 24h)
        const existingRecommendation = await recommendation.findOne({
            user: userId,
            lastUpdated: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });

        if ( existingRecommendation ) {
            return existingRecommendation;
        }

        // Tạo gợi ý mới
        const contentRecs = await getContentBasedRecommendations(userId, 10);
        const collaborativeRecs = await getCollaborativeRecommendations(userId, 7);
        const trendingRecs = await getTrendingRecommendations(userId, 5);

        // Kết hợp các danh sách gợi ý
        const allRecommendations = [...contentRecs, ...collaborativeRecs, ...trendingRecs];

        // Gộp các gợi ý trùng lặp và lấy mức điểm cao nhất
        const mergedRecommendations = [];
        const seenPosts = new Set();

        for ( const rec of allRecommendations ) {
            const postId = rec.post.toString();
            if ( !seenPosts.has(postId) ) {
                seenPosts.add(postId);
                mergedRecommendations.push(rec);
            } else {
                // Tìm và cập nhật điểm cho bài viết đã tồn tại nếu điểm mới cao hơn
                const existingIndex = mergedRecommendations.findIndex(r => r.post.toString() === postId);
                if ( existingIndex !== -1 && rec.score > mergedRecommendations[existingIndex].score ) {
                    mergedRecommendations[existingIndex].score = rec.score;
                    mergedRecommendations[existingIndex].reason = rec.reason;
                }
            }
        }

        // Sắp xếp theo điểm và giới hạn số lượng
        const finalRecommendations = mergedRecommendations
            .sort(( a, b ) => b.score - a.score)
            .slice(0, 20);

        // Lưu gợi ý vào database
        const Recommendation = await recommendation.findOneAndUpdate(
            { user: userId },
            {
                user: userId,
                recommendations: finalRecommendations,
                lastUpdated: Date.now()
            },
            { upsert: true, new: true }
        );

        return Recommendation;
    } catch ( error ) {
        console.error('Error generating recommendations:', error);
        throw error;
    }
}

// Lấy gợi ý cho người dùng
async function getRecommendationsForUser( userId, limit = 10 ) {
    try {
        let Recommendation = await recommendation.findOne({ user: userId })
            .populate('recommendations.post');

        // Nếu chưa có gợi ý hoặc gợi ý cũ (hơn 24h), tạo mới
        if ( !Recommendation ||
            Recommendation.lastUpdated < new Date(Date.now() - 24 * 60 * 60 * 1000) ) {
            Recommendation = await generateRecommendations(userId);
            Recommendation = await recommendation.findOne({ user: userId })
                .populate('recommendations.post');
        }

        return Recommendation ? Recommendation.recommendations.slice(0, limit) : [];

    } catch ( error ) {
        console.error('Error getting recommendations:', error);
        return [];
    }
}

// Gợi ý người dùng dựa trên sở thích chủ đề và thẻ chung
async function getInterestBasedRecommendations( userId, limit = 10 ) {
    try {
        // Lấy thông tin người dùng hiện tại
        const currentUser = await user.findById(userId);
        if ( !currentUser ) return [];

        // Danh sách ID người dùng đã theo dõi và bị ẩn
        const excludeUserIds = [
            userId,
            ...currentUser.following.map(id => id.toString()),
            ...currentUser.hiddenAuthors.map(id => id.toString())
        ];

        // Tìm người dùng có cùng chủ đề/thẻ theo dõi
        const similarUsers = await user.aggregate([
            {
                $match: {
                    _id: { $nin: excludeUserIds.map(id => new mongoose.Types.ObjectId(id)) }
                }
            },
            {
                $project: {
                    username: 1,
                    bio: 1,
                    ava: 1,
                    followers: 1,
                    following: 1,
                    commonTopics: {
                        $size: {
                            $setIntersection: ['$topicFollowing', currentUser.topicFollowing]
                        }
                    },
                    commonTags: {
                        $size: {
                            $setIntersection: ['$tagFollowing', currentUser.tagFollowing]
                        }
                    }
                }
            },
            {
                $addFields: {
                    interestScore: {
                        $add: [
                            { $multiply: ['$commonTopics', 5] },
                            { $multiply: ['$commonTags', 3] }
                        ]
                    }
                }
            },
            {
                $match: { interestScore: { $gt: 0 } }
            },
            {
                $sort: { interestScore: -1 }
            },
            {
                $limit: limit
            }
        ]);

        return similarUsers.map(user => ( {
            user: user._id,
            score: user.interestScore / 50,
            reason: 'interest_match'
        } ));
    } catch ( error ) {
        console.error('Error in interest-based recommendations:', error);
        return [];
    }
}

// Gợi ý người dùng dựa trên lịch sử đọc
async function getReadingHistoryRecommendations( userId, limit = 10 ) {
    try {
        const currentUser = await user.findById(userId);
        if ( !currentUser ) return [];

        const excludeUserIds = [
            userId,
            ...currentUser.following.map(id => id.toString()),
            ...currentUser.hiddenAuthors.map(id => id.toString())
        ];

        // Lấy lịch sử đọc gần đây (30 ngày)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const readHistory = await history.find({
            user: userId,
            readAt: { $gte: thirtyDaysAgo },
            $or: [{ readPercentage: { $gte: 50 } }, { isCompleted: true }]
        }).populate('post');

        if ( readHistory.length === 0 ) return [];

        // Lấy danh sách tác giả từ các bài viết đã đọc
        const readAuthors = new Map();

        for ( const entry of readHistory ) {
            const authorId = entry.post.author.authorId.toString();

            if ( excludeUserIds.includes(authorId) ) continue;

            if ( !readAuthors.has(authorId) ) {
                readAuthors.set(authorId, {
                    authorId: new mongoose.Types.ObjectId(authorId),
                    readCount: 0,
                    completedCount: 0,
                    totalReadPercentage: 0,
                    totalReadDuration: 0
                });
            }

            const authorStats = readAuthors.get(authorId);
            authorStats.readCount++;

            if ( entry.isCompleted ) authorStats.completedCount++;

            authorStats.totalReadPercentage += entry.readPercentage;
            authorStats.totalReadDuration += entry.readDuration;
        }

        // Tính điểm cho mỗi tác giả
        const scoredAuthors = [];
        for ( const [_, stats] of readAuthors.entries() ) {
            const avgReadPercentage = stats.totalReadPercentage / stats.readCount;
            const avgReadDuration = stats.totalReadDuration / stats.readCount;
            const completionRate = stats.completedCount / stats.readCount;

            const score = ( Math.min(stats.readCount, 10) / 10 ) * 0.4 +
                ( avgReadPercentage / 100 ) * 0.3 +
                completionRate * 0.2 +
                ( Math.min(avgReadDuration, 300) / 300 ) * 0.1;

            scoredAuthors.push({
                user: stats.authorId,
                score,
                reason: 'reading_history'
            });
        }

        return scoredAuthors
            .sort(( a, b ) => b.score - a.score)
            .slice(0, limit);
    } catch ( error ) {
        console.error('Error in reading history recommendations:', error);
        return [];
    }
}

// Gợi ý người dùng dựa trên mạng lưới theo dõi
async function getNetworkBasedRecommendations( userId, limit = 10 ) {
    try {
        const currentUser = await user.findById(userId);
        if ( !currentUser ) return [];

        const excludeUserIds = [
            userId,
            ...currentUser.following.map(id => id.toString()),
            ...currentUser.hiddenAuthors.map(id => id.toString())
        ];

        if ( currentUser.following.length === 0 ) return [];

        // Lấy chi tiết về người dùng đang theo dõi
        const followingUsers = await user.find({
            _id: { $in: currentUser.following }
        });

        // Tập hợp ID của người dùng được theo dõi bởi những người mà người dùng hiện tại đang theo dõi
        const secondDegreeFollowMap = new Map();

        for ( const followedUser of followingUsers ) {
            for ( const secondDegreeId of followedUser.following ) {
                const secondDegreeIdStr = secondDegreeId.toString();

                if ( excludeUserIds.includes(secondDegreeIdStr) ) continue;

                if ( !secondDegreeFollowMap.has(secondDegreeIdStr) ) {
                    secondDegreeFollowMap.set(secondDegreeIdStr, {
                        userId: secondDegreeId,
                        commonFollowers: 0
                    });
                }

                secondDegreeFollowMap.get(secondDegreeIdStr).commonFollowers++;
            }
        }

        // Chuyển Map thành mảng và tính điểm
        const networkScores = Array.from(secondDegreeFollowMap.values()).map(item => ( {
            user: item.userId,
            score: Math.min(item.commonFollowers / currentUser.following.length, 1),
            reason: 'network'
        } ));

        return networkScores
            .sort(( a, b ) => b.score - a.score)
            .slice(0, limit);
    } catch ( error ) {
        console.error('Error in network-based recommendations:', error);
        return [];
    }
}

// Gợi ý người dùng thịnh hành/nổi bật
async function getPopularUserRecommendations( userId, limit = 5 ) {
    try {
        const currentUser = await user.findById(userId);
        if ( !currentUser ) return [];

        const excludeUserIds = [
            userId,
            ...currentUser.following.map(id => id.toString()),
            ...currentUser.hiddenAuthors.map(id => id.toString())
        ];

        const popularUsers = await user.aggregate([
            {
                $match: {
                    _id: { $nin: excludeUserIds.map(id => new mongoose.Types.ObjectId(id)) }
                }
            },
            {
                $project: {
                    username: 1,
                    ava: 1,
                    followerCount: { $size: '$followers' }
                }
            },
            {
                $match: {
                    followerCount: { $gte: 5 }
                }
            },
            {
                $sort: { followerCount: -1 }
            },
            {
                $limit: limit
            }
        ]);

        return popularUsers.map(user => ( {
            user: user._id,
            score: Math.min(user.followerCount / 100, 1),
            reason: 'popular'
        } ));
    } catch ( error ) {
        console.error('Error in popular user recommendations:', error);
        return [];
    }
}

// Hàm gộp và sắp xếp các gợi ý
function mergeRecommendations( recommendations ) {
    const mergedRecommendations = [];
    const seenUsers = new Set();

    for ( const rec of recommendations ) {
        const userId = rec.user.toString();
        if ( !seenUsers.has(userId) ) {
            seenUsers.add(userId);
            mergedRecommendations.push(rec);
        } else {
            // Cập nhật điểm nếu điểm mới cao hơn
            const existingIndex = mergedRecommendations.findIndex(r => r.user.toString() === userId);
            if ( existingIndex !== -1 && rec.score > mergedRecommendations[existingIndex].score ) {
                mergedRecommendations[existingIndex].score = rec.score;
                mergedRecommendations[existingIndex].reason = rec.reason;
            }
        }
    }

    return mergedRecommendations.sort(( a, b ) => b.score - a.score);
}

// Tạo gợi ý người dùng theo dõi
async function generateUserRecommendations( userId, maxResults = 15 ) {
    try {
        // Kiểm tra xem có gợi ý gần đây không (trong vòng 24h)
        const existingRecommendation = await recommendation.findOne({
            user: userId,
            lastUpdated: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });

        if ( existingRecommendation?.userRecommendations?.length > 0 ) {
            return existingRecommendation;
        }

        // Tạo gợi ý mới
        const interestRecs = await getInterestBasedRecommendations(userId, 10);
        const readingHistoryRecs = await getReadingHistoryRecommendations(userId, 7);
        const networkRecs = await getNetworkBasedRecommendations(userId, 7);
        const popularRecs = await getPopularUserRecommendations(userId, 5);

        // Kết hợp các danh sách gợi ý
        const allRecommendations = [
            ...interestRecs,
            ...readingHistoryRecs,
            ...networkRecs,
            ...popularRecs
        ];

        // Gộp gợi ý trùng lặp và lấy mức điểm cao nhất
        const finalRecommendations = mergeRecommendations(allRecommendations)
            .slice(0, maxResults);

        // Cập nhật hoặc tạo mới recommendation record
        let rec = await recommendation.findOne({ user: userId });

        if ( rec ) {
            rec.userRecommendations = finalRecommendations;
            rec.lastUpdated = Date.now();
            await rec.save();
        } else {
            rec = await recommendation.create({
                user: userId,
                recommendations: [],
                userRecommendations: finalRecommendations,
                lastUpdated: Date.now()
            });
        }

        return rec;
    } catch ( error ) {
        console.error('Error generating user recommendations:', error);
        throw error;
    }
}

// Lấy gợi ý người theo dõi cho người dùng
async function getUserRecommendations( userId, limit = 5 ) {
    try {
        let userRec = await recommendation.findOne({ user: userId })
            .populate('userRecommendations.user', 'username bio ava followers following');

        // Tạo mới nếu chưa có hoặc gợi ý cũ
        if ( !userRec?.userRecommendations?.length ||
            userRec.lastUpdated < new Date(Date.now() - 24 * 60 * 60 * 1000) ) {
            await generateUserRecommendations(userId);
            userRec = await recommendation.findOne({ user: userId })
                .populate('userRecommendations.user', 'username bio ava followers following');
        }

        return userRec?.userRecommendations?.slice(0, limit) || [];
    } catch ( error ) {
        console.error('Error getting user recommendations:', error);
        return [];
    }
}


class RecommendationController {
    async GetRecommendationsPosts( req, res ) {
        try {
            const userId = req.session.user._id;
            const limit = parseInt(req.query.limit) || 10;

            const recommendations = await getRecommendationsForUser(userId, limit);

            res.json({
                success: true,
                recommendations: recommendations.map(rec => ( {
                    post: rec.post,
                    reason: rec.reason
                } ))
            });
        } catch ( error ) {
            console.error('Error fetching recommendations:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể lấy gợi ý bài viết'
            });
        }
    }

    async GetRecommendationsPostByType( req, res ) {
        try {
            const userId = req.session.user._id;
            const type = req.params.type;
            const limit = parseInt(req.query.limit) || 10;

            let recommendations = [];

            switch ( type ) {
                case 'content-based':
                    recommendations = await getContentBasedRecommendations(userId, limit);
                    break;
                case 'collaborative':
                    recommendations = await getCollaborativeRecommendations(userId, limit);
                    break;
                case 'trending':
                    recommendations = await getTrendingRecommendations(userId, limit);
                    break;
                default:
                    return res.status(400).json({
                        success: false,
                        message: 'Loại gợi ý không hợp lệ'
                    });
            }

            const postIds = recommendations.map(rec => rec.post);
            const posts = await post.find({ _id: { $in: postIds } });

            // Kết hợp thông tin bài viết với thông tin gợi ý
            const result = recommendations.map(rec => {
                const post = posts.find(p => p._id.equals(rec.post));
                return {
                    post,
                    score: rec.score,
                    reason: rec.reason
                };
            });

            res.json({
                success: true,
                recommendations: result
            });
        } catch ( error ) {
            console.error(`Error fetching ${ req.params.type } recommendations:`, error);
            res.status(500).json({
                success: false,
                message: 'Không thể lấy gợi ý bài viết'
            });
        }
    }

    async getUserRecommendation( req, res ) {
        try {
            const userId = req.session.user._id;
            const limit = parseInt(req.query.limit) || 5;

            const recommendations = await getUserRecommendations(userId, limit);

            // Chuẩn bị dữ liệu trả về
            const formattedRecommendations = recommendations.map(rec => ( {
                user: {
                    _id: rec.user._id,
                    username: rec.user.username,
                    bio: rec.user.bio,
                    avatar: rec.user.ava,
                    followerCount: rec.user.followers?.length || 0,
                    followingCount: rec.user.following?.length || 0
                },
                reason: rec.reason,
                score: rec.score
            } ));

            res.json({
                success: true,
                count: formattedRecommendations.length,
                recommendations: formattedRecommendations
            });
        } catch ( error ) {
            console.error('Error fetching user recommendations:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể lấy gợi ý người dùng',
                error: error.message
            });
        }
    }

    async refreshUserRecommendations( req, res ) {
        try {
            const userId = req.session.user._id;
            const limit = parseInt(req.query.limit) || 5;

            // Tạo mới gợi ý
            await generateUserRecommendations(userId);

            // Lấy gợi ý mới
            const recommendations = await getUserRecommendations(userId, limit);

            // Chuẩn bị dữ liệu trả về
            const formattedRecommendations = recommendations.map(rec => ( {
                user: {
                    id: rec.user._id,
                    username: rec.user.username,
                    bio: rec.user.bio,
                    avatar: rec.user.ava,
                    followerCount: rec.user.followers?.length || 0,
                    followingCount: rec.user.following?.length || 0
                },
                reason: rec.reason,
                score: rec.score
            } ));

            res.json({
                success: true,
                count: formattedRecommendations.length,
                recommendations: formattedRecommendations
            });
        } catch ( error ) {
            console.error('Error refreshing user recommendations:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể làm mới gợi ý người dùng',
                error: error.message
            });
        }
    }

    async getUserRecommendationsByType( req, res ) {
        try {
            const userId = req.session.user._id;
            const type = req.params.type;
            const limit = parseInt(req.query.limit) || 5;

            let recommendations = [];

            switch ( type ) {
                case 'interest':
                    recommendations = await getInterestBasedRecommendations(userId, limit);
                    break;
                case 'reading':
                    recommendations = await getReadingHistoryRecommendations(userId, limit);
                    break;
                case 'network':
                    recommendations = await getNetworkBasedRecommendations(userId, limit);
                    break;
                case 'popular':
                    recommendations = await getPopularUserRecommendations(userId, limit);
                    break;
                default:
                    return res.status(400).json({
                        success: false,
                        message: 'Loại gợi ý không hợp lệ. Vui lòng chọn: interest, reading, network, hoặc popular'
                    });
            }

            // Populate thêm thông tin người dùng
            const userIds = recommendations.map(rec => rec.user);
            const users = await mongoose.model('User').find(
                { _id: { $in: userIds } },
                'username bio ava followers following'
            );

            // Map thông tin vào kết quả
            const formattedRecommendations = recommendations.map(rec => {
                const userData = users.find(u => u._id.toString() === rec.user.toString());
                return userData ? {
                    user: {
                        id: userData._id,
                        username: userData.username,
                        bio: userData.bio,
                        avatar: userData.ava,
                        followerCount: userData.followers?.length || 0,
                        followingCount: userData.following?.length || 0
                    },
                    reason: rec.reason,
                    score: rec.score
                } : null;
            }).filter(Boolean); // Loại bỏ các giá trị null/undefined

            res.json({
                success: true,
                type,
                count: formattedRecommendations.length,
                recommendations: formattedRecommendations
            });
        } catch ( error ) {
            console.error(`Error fetching ${ req.params.type } user recommendations:`, error);
            res.status(500).json({
                success: false,
                message: 'Không thể lấy gợi ý người dùng',
                error: error.message
            });
        }
    }
}

export default new RecommendationController();
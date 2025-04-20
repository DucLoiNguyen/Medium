import topic from '../models/TopicModel.js';
import tag from '../models/TagModel.js';
import user from '../models/UserModel.js';

class TopicController {
    GetAll( req, res, next ) {
        topic
            .aggregate([
                {
                    $lookup: {
                        from: 'tags',            // Collection cần join
                        localField: '_id',       // Trường của topics để liên kết
                        foreignField: 'topic.topicId', // Trường của tags để liên kết
                        as: 'tags'               // Tên của mảng chứa kết quả
                    }
                }
            ])
            .then(( data ) => res.send(data))
            .catch(( err ) => next(err));
    }

    GetAllTag( req, res, next ) {
        tag.find()
            .then(( data ) => res.status(200).json(data))
            .catch(( err ) => res.status(500).json(err));
    }

    async GetRecommendTopic( req, res ) {
        try {
            const userId = req.session.user._id;

            const currentUser = await user.findById(userId);

            const tagFollowed = currentUser.tagFollowing || [];
            const topicFollowed = currentUser.topicFollowing || [];

            const TopicTagFollowed = [...topicFollowed, ...tagFollowed];

            const topics = await topic.find({
                _id: { $nin: TopicTagFollowed }
            })
                .sort({ followers: -1 });

            res.status(200).json(topics);
        } catch ( error ) {
            console.error('Error in GetRecommendTopic:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async Search( req, res, next ) {
        try {
            const { q, page = 1, limit = 10 } = req.query;
            const skip = ( page - 1 ) * limit;

            if ( !q ) {
                return res.status(400).json({ message: 'Query parameter "q" is required.' });
            }

            // Tạo regex để tìm kiếm không phân biệt chữ hoa chữ thường
            const regex = new RegExp(q, 'i');  // 'i' để tìm kiếm không phân biệt chữ hoa chữ thường

            // Tìm kiếm trong tags collection
            const tags = await tag.find({
                $or: [
                    { tag: { $regex: regex } },  // Tìm kiếm trong trường 'tag' của tags
                    // { 'topic.topicName': { $regex: regex } }  // Tìm kiếm trong trường 'topicName' của topic liên kết
                ]
            });

            // Tìm kiếm trong topics collection
            const topics = await topic.find({
                $or: [
                    { topicname: { $regex: regex } },  // Tìm kiếm trong trường 'topicname' của topics
                    // { 'tags.tagName': { $regex: regex } }  // Tìm kiếm trong các tags của topic
                ]
            });

            // Gộp dữ liệu từ tags và topics
            const combinedData = [
                ...tags.map(item => ( { ...item.toObject(), type: 'tag' } )),
                ...topics.map(item => ( { ...item.toObject(), type: 'topic' } ))
            ];

            // Phân trang
            const paginatedData = combinedData.slice(skip, skip + limit);

            // Đếm tổng số kết quả
            const total = combinedData.length;

            res.json({
                data: paginatedData,
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

export default new TopicController();
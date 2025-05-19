import tag from '../models/TagModel.js';
import topic from '../models/TopicModel.js';
import user from '../models/UserModel.js';
import mongoose from 'mongoose';

class TagController {

    async GetById( req, res, next ) {
        const { id } = req.query;
        if ( !id ) return res.status(400).json({ message: 'ID is required' });

        tag.find({ 'topic.topicId': id })
            .then(( data ) => res.status(200).json(data))
            .catch(( err ) => res.status(500).json(err));
    };

    async GetTag( req, res, next ) {
        try {
            const tagname = req.query.tag;

            const dataTag = await tag.find({ tag: tagname });
            const dataTopic = await topic.find({ tag: tagname });

            const data = [...dataTopic, ...dataTag];
            res.status(200).json(data);
        } catch ( err ) {
            console.error(err);
            res.status(500).json(err);
        }
    };

    async Follow( req, res, next ) {
        try {
            const { topicId, tagId } = req.body;

            const userId = req.session.user._id;

            const User = await user.findById(userId);

            const Topic = await topic.findById(topicId);

            if ( Topic ) {
                if ( User.topicFollowing.includes(topicId) ) {
                    return res.status(400).json({
                        success: false,
                        message: 'Bạn đã follow topic này rồi'
                    });
                }

                await user.findByIdAndUpdate(
                    userId,
                    { $push: { topicFollowing: topicId } },
                    { new: true }
                );

                await topic.findByIdAndUpdate(
                    topicId,
                    { $inc: { followers: 1 } }
                );
            }

            const Tag = await tag.findById(tagId);

            if ( Tag ) {
                if ( User.tagFollowing.includes(tagId) ) {
                    return res.status(400).json({
                        success: false,
                        message: 'Bạn đã follow tag này rồi'
                    });
                }

                await user.findByIdAndUpdate(
                    userId,
                    { $push: { tagFollowing: tagId } },
                    { new: true }
                );

                await tag.findByIdAndUpdate(
                    tagId,
                    { $inc: { followers: 1 } }
                );
            }

            return res.status(200).json({
                success: true,
                message: 'Follow thành công'
            });

        } catch ( error ) {
            console.error('Lỗi khi follow topic:', error);
            return res.status(500).json({
                success: false,
                message: 'Có lỗi xảy ra khi follow topic',
                error: error.message
            });
        }
    }

    async UnFollow( req, res, next ) {
        try {
            const { topicId, tagId } = req.body;

            const userId = req.session.user._id;

            const User = await user.findById(userId);

            const Topic = await topic.findById(topicId);

            if ( Topic ) {
                if ( !User.topicFollowing.includes(topicId) ) {
                    return res.status(400).json({
                        success: false,
                        message: 'Bạn chưa follow topic này'
                    });
                }

                await user.findByIdAndUpdate(
                    userId,
                    { $pull: { topicFollowing: topicId } },
                    { new: true }
                );

                await topic.findByIdAndUpdate(
                    topicId,
                    { $inc: { followers: -1 } }
                );
            }

            const Tag = await tag.findById(tagId);

            if ( Tag ) {
                if ( !User.tagFollowing.includes(tagId) ) {
                    return res.status(400).json({
                        success: false,
                        message: 'Bạn chưa follow tag này'
                    });
                }

                await user.findByIdAndUpdate(
                    userId,
                    { $pull: { tagFollowing: tagId } },
                    { new: true }
                );

                await tag.findByIdAndUpdate(
                    tagId,
                    { $inc: { followers: -1 } }
                );
            }

            return res.status(200).json({
                success: true,
                message: 'Unfollow thành công'
            });

        } catch ( error ) {
            console.error('Lỗi khi unfollow:', error);
            return res.status(500).json({
                success: false,
                message: 'Có lỗi xảy ra khi unfollow',
                error: error.message
            });
        }
    }
};

export default new TagController();
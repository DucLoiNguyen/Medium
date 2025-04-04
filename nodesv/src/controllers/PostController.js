import post from '../models/PostModel.js';

class PostController {
    GetAllPublish( req, res, next ) {
        post.aggregate([
            {
                $match: { status: true }
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
        ])
            .then(( data ) => res.json(data))
            .catch(( err ) => next(err));
    }

    GetAllDraft( req, res, next ) {
        post.aggregate([
            {
                $match: { status: false }
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
        ])
            .then(( data ) => res.json(data))
            .catch(( err ) => next(err));
    }

    GetByAuthor( req, res, next ) {
        post.find({ 'author.authorId': '65fa82a2a8f4c71070085b14' }).exec()
            .then(( data ) => res.send(data))
            .catch(( err ) => next(err));
    }

    GetById( req, res, next ) {
        post.findOne({ _id: req.params.id })
            .then(( data ) => res.status(200).json(data))
            .catch(( err ) => res.status(500).json(err));
    }

    Like( req, res, next ) {
        post.updateOne({ _id: req.params.id }, { $inc: { likes: 1 } })
            .then(( data ) => res.status(200).json({
                message: 'successfully like'
            }))
            .catch(( err ) => res.status(500).json({ error: err }));
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
}

export default new PostController();

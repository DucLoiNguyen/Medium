import tag from '../models/TagModel.js';

class TagController {

    async GetById( req, res, next ) {
        const { id } = req.query;
        if ( !id ) return res.status(400).json({ message: 'ID is required' });

        tag.find({ 'topic.topicId': id })
            .then(( data ) => res.status(200).json(data))
            .catch(( err ) => res.status(500).json(err));
    };
};

export default new TagController();
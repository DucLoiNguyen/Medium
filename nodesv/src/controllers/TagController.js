import tag from "../models/TagModel.js";

class TagController {

    GetAll(res, req, next) {
        tag.find()
            .then((data) => res.status(200).json(data))
            .catch((err) => res.status(500).json(err));
    };
};

export default TagController;
import topic from "../models/TopicModel.js";
import tag from "../models/TagModel.js";

class TopicController {
  GetAll(req, res, next) {
    topic
      .find({})
      .then((data) => res.send(data))
      .catch((err) => next(err));
  }

  GetAllTag(req, res, next) {
    // var tags = [];
    // topic
    //   .fin({})
    //   .then((data) => {
    //     tags = tags.concat(data);
    //     tag
    //       .find({})
    //       .then((data) => {
    //         tags = tags.concat(data);
    //         res.send(tags);
    //       })
    //   })
    //   .catch((err) => console.log(err))

    tag.find()
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(500).json(err));
  }
}

export default new TopicController();
import topic from "../models/TopicModel.js";

class TopicController {
  index(req, res, next) {
    topic
      .find({})
      .then((data) => res.send(data))
      .catch((err) => next(err));
  }
}

export default new TopicController();
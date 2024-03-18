import post from "../models/PostModel.js";

class PostController {
  index(req, res, next) {
    post
      .find({})
      .then((data) => res.send(data))
      .catch((err) => next(err));
  }
}

export default new PostController();

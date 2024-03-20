import post from "../models/PostModel.js";

class PostController {
  GetAll(req, res, next) {
    post
      .find({})
      .then((data) => res.send(data))
      .catch((err) => next(err));
  }

  GetByAuthor(req, res, next) {
    post.find({ "author.authorId": "65fa82a2a8f4c71070085b14" }).exec()
      .then((data) => res.send(data))
      .catch((err) => next(err));
  }
}

export default new PostController();

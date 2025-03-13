import post from "../models/PostModel.js";

class PostController {
  GetAll(req, res, next) {
    post.find({})
      .then((data) => res.send(data))
      .catch((err) => next(err));
  }

  GetByAuthor(req, res, next) {
    post.find({ "author.authorId": "65fa82a2a8f4c71070085b14" }).exec()
      .then((data) => res.send(data))
      .catch((err) => next(err));
  }

  Create(req, res, next) {
    const newPost = new post(req.body);
    newPost.save()
        .then((data) => res.status(200).send("save successfully"))
        .catch((err) => res.status(500).send(err));
  }
}

export default new PostController();

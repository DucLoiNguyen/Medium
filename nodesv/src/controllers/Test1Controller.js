import test1 from "../models/test1model.js";

class Test1Controller {
  index(req, res, next) {
    test1
      .find({})
      .then((data) => res.send(data))
      .catch((err) => next(err));
  }
}

export default new Test1Controller();

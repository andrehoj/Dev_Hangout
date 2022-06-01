const router = require("express").Router();
const { Post, User } = require("../../models");

// get all users
router.get("/", (req, res) => {
  Post.findAll()
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/save", (req, res) => {
  Post.create({
    message: req.body.msg,
    username: req.body.username,
  })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;

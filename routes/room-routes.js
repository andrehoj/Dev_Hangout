const router = require("express").Router();
const { Post, User, Room } = require("../models");

router.get("/front-end", (req, res) => {
  res.render("front-end", { loggedIn: req.session.loggedIn });
});

router.get("/general", (req, res) => {
  res.render("home", { loggedIn: req.session.loggedIn });
});


module.exports = router;

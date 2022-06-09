const router = require("express").Router();
const { Message, User, Room } = require("../models");

router.get("/front-end", (req, res) => {
  res.render("front-end", { loggedIn: req.session.loggedIn });
});

router.get("/general", (req, res) => {
  res.render("general", { loggedIn: req.session.loggedIn });
});

router.get("/back-end", (req, res) => {
  res.render("back-end", { loggedIn: req.session.loggedIn });
});

router.get("/dev-advice", (req, res) => {
  res.render("dev-advice", { loggedIn: req.session.loggedIn });
});

module.exports = router;

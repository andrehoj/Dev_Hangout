const router = require("express").Router();
const { middleWareAuth } = require("../../utils/helpers");

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/settings", middleWareAuth, (req, res) => {
  res.render("settings");
});

router.get("/room/:roomname", middleWareAuth, ({ session, params }, res) => {
  res.render("room", {
    roomname: params.roomname,
  });
});

router.get("/directmessages/:receiver", middleWareAuth, ({ session }, res) => {
  res.render("directmessages", {
    loggedIn: session.loggedIn,
  });
});

module.exports = router;

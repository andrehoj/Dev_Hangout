const router = require("express").Router();
// const {  } = require("../../utils/helpers");

// router.get("/login", (req, res) => {
//   res.render("login");
// });

// router.get("/register", (req, res) => {
//   res.render("register");
// });

router.get("/settings", (req, res) => {
  res.render("settings");
});

router.get("/room/:roomname", ({ session, params }, res) => {
  res.render("room", {
    roomname: params.roomname,
  });
});

router.get("/directmessages/:receiver", ({ session }, res) => {
  res.render("directmessages", {
    loggedIn: session.loggedIn,
  });
});

module.exports = router;

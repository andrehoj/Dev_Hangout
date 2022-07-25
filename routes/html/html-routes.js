const router = require("express").Router();

//entry point to app
router.get("/", ({ session }, res) => {
  session.loggedIn ? res.render(`room`) : res.render("login");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/settings", (req, res) => {
  res.render("settings");
});

router.get("/room/:roomName", ({ session, params }, res) => {
  res.render("room", {
    loggedIn: session.loggedIn,
    roomName: params.roomName,
  });
});

router.get("/directmessages/:receiver", ({ session }, res) => {
  res.render("directmessages", {
    loggedIn: session.loggedIn,
  });
});

module.exports = router;

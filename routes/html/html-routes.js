const router = require("express").Router();

//entry point to app, renders login/signup modals
router.get("/", (req, res) => {
  if (!req.session.loggedIn) {
    res.render("room", { loggedIn: false });
  } else res.render("room", { loggedIn: true });
});

//renders specified room
router.get("/room/:roomName", (req, res) => {
  res.render("room", {
    loggedIn: req.session.loggedIn,
    roomName: req.params.roomName,
  });
});

router.get("/settings", (req, res) => {
  res.render("settings");
});

module.exports = router;

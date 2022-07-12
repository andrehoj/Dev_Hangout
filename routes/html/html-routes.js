const router = require("express").Router();

//entry point to app
router.get("/", (req, res) => {
  if (req.session.loggedIn) {
    res.render(`room/${req.session.lastRoom}`, { layout: "main" });
  } else {
    res.render("login", { layout: "main" });
  }
});

router.get("/register", (req, res) => {
  res.render("register", { layout: "main" });
});

router.get("/login", (req, res) => {
  res.render("login", { layout: "main" });
});

router.get("/room/:roomName", (req, res) => {
  res.render("room", {
    loggedIn: req.session.loggedIn,
    roomName: req.params.roomName,
  });
});

router.get("/settings", (req, res) => {
  res.render("settings");
});

router.get("/directmessages/:receiver", (req, res) => {
  console.log(req.session);
  console.log(req.params);

  res.render("directmessages", {
    layout: "main",
    loggedIn: req.session.loggedIn,
  });
});

module.exports = router;

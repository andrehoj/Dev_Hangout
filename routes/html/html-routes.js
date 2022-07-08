const router = require("express").Router();

//entry point to app, renders login/signup modals
// router.get("/", (req, res) => {
// if (!req.session.loggedIn) {
//   res.render("room", { loggedIn: false });
// } else res.render("room", { loggedIn: true });
// });

//entry point to app
router.get("/", (req, res) => {
  if (req.session.loggedIn) {
    res.render(`room/${lastRoom}`, { layout: "main" });
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

router.get("/direct-messages", (req, res) => {
  res.render("directmessages", { loggedIn: true });
});

module.exports = router;

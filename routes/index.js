const router = require("express").Router();

const apiRoutes = require("./api");

router.use("/api", apiRoutes);

router.get("/", (req, res) => {
  if (!req.session.loggedIn) {
    res.render("room", { loggedIn: false });
  } else res.render("room", { loggedIn: true });
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

router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;

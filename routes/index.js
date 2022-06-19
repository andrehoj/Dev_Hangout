const router = require("express").Router();

const apiRoutes = require("./api");
const roomRoutes = require("./room-routes");

router.use(roomRoutes);
router.use("/api", apiRoutes);

//entry point to app. checks if the user is loggedin or not
router.get("/", (req, res) => {
  if (req.session.loggedIn === undefined) {
    res.render("general", { loggedIn: false });
  } else res.render("general", { loggedIn: true });
});

router.get("/settings", (req, res) => {
  res.render("settings", { loggedIn: true });
});

router.get("/signup", (req, res) => {
  res.render("signup-modal");
});

router.get("/login", (req, res) => {
  res.render("login-modal");
});

router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;

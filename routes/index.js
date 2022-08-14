const router = require("express").Router();
const apiRoutes = require("./api");
const htmlRoutes = require("./html/html-routes");
const { middleWareAuth } = require("../utils/helpers");

router.use("/api", middleWareAuth, apiRoutes);
router.use("/", htmlRoutes);

//entry point to app
router.get("/", ({ session }, res) => {
  session.loggedIn ? res.redirect(`room/General`) : res.render("login");
});

router.use((req, res) => {
  res.render("notfound");
});

module.exports = router;

const router = require("express").Router();
const apiRoutes = require("./api");
const authRoutes = require("./html/auth-routes");
const htmlRoutes = require("./html/html-routes");
const { middleWareAuth } = require("../utils/helpers");

router.use("/api", middleWareAuth, apiRoutes);
router.use("", authRoutes);
router.use("/", middleWareAuth, htmlRoutes);

//entry point to app
router.get("/", ({ session }, res) => {
  session.loggedIn ? res.redirect(`room/General`) : res.render("login");
});

//catch all 404 page
router.use((_, res) => {
  res.render("notfound");
});

module.exports = router;

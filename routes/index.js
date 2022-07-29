const router = require("express").Router();

const apiRoutes = require("./api");
const htmlRoutes = require("./html/html-routes");

router.use("/api", apiRoutes);

router.use("/", htmlRoutes);

router.use((req, res) => {
  res.render("notfound");
});

module.exports = router;

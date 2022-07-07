const router = require("express").Router();

const userRoutes = require("./user-routes");
const messageRoutes = require("./message-routes");
const dmRoutes = require("./dm-routes");

router.use("/users", userRoutes);
router.use("/messages", messageRoutes);
router.use("/dm", dmRoutes);

module.exports = router;

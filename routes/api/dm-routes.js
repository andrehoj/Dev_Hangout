const router = require("express").Router();

const { saveDmMsg } = require("../../controllers/dm-controller");

router.post("/save-dm-message", saveDmMsg);

module.exports = router;

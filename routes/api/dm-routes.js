const router = require("express").Router();

const { saveDmMsg, getAllDms } = require("../../controllers/dm-controller");

router.get("/get-all-dms/:user_id", getAllDms);

router.post("/save-dm-message", saveDmMsg);

module.exports = router;

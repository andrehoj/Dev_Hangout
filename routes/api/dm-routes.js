const router = require("express").Router();

const {
  saveDmMsg,
  getAllDms,
  getDmsByUser,
} = require("../../controllers/dm-controller");

router.get("/get-all-dms/:user_id", getAllDms);

router.get("/get-dms-by-userid/:receiverId/:senderId", getDmsByUser);

router.post("/save-dm-message", saveDmMsg);

module.exports = router;

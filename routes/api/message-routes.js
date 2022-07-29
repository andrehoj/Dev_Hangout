const router = require("express").Router();

const {
  getMessagesByRoom,
  saveMessage,
} = require("../../controllers/message-controllers");

router.get("/:room", getMessagesByRoom);

router.post("/save", saveMessage);

module.exports = router;

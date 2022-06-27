const router = require("express").Router();

const { Message, User, Room } = require("../../models");

const { filterMsgData } = require("../../utils/helpers");

const {
  getMessagesByRoom,
  saveMessage,
} = require("../../controllers/message-controllers");

router.get("/:room", getMessagesByRoom);

router.post("/save", saveMessage);

module.exports = router;

const router = require("express").Router();
const { Message, User, Room } = require("../../models");
const { filterMsgData } = require("../../utils/helpers");

router.get("/:room", (req, res) => {
  console.log(req.params.room);
  Message.findAll({
    include: [
      {
        model: Room,
        as: "room",
        where: { roomName: req.params.room },
      },
      {
        model: User,
        as: "user",
      },
    ],
    require: true,
  })
    .then((dbMessageData) => {
      const messages = filterMsgData(JSON.stringify(dbMessageData, null, 2));

      res.json(messages);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/save", (req, res) => {
  Message.create({
    message: req.body.msg,
    username: req.body.username,
    timeOfMessage: req.body.currentTime,
  })
    .then((dbMessageData) => res.json(dbMessageData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;

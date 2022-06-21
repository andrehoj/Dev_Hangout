const router = require("express").Router();
const { Message, User, Room } = require("../../models");
const { filterMsgData } = require("../../utils/helpers");

router.get("/:room", (req, res) => {
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
  console.log(req.body)
  Room.findOne({
    where: {
      roomName: req.body.room,
    },
    attributes: ["id"],
    raw: true,
  }).then((roomId) => {
    console.log(roomId)
    Message.create({
      message: req.body.msg,
      timeOfMessage: req.body.currentTime,
      userId: req.body.userId,
      roomId: roomId.id,
    })
      .then((dbMessageData) => {
        res.json(dbMessageData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  });
});

module.exports = router;

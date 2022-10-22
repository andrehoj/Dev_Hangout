const { Message, Room, User } = require("../models/index");

const messageController = {
  async getMessagesByRoom({ params }, res) {
    try {
      const dbMessageData = await Message.findAll({
        attributes: ["message", "timeOfMessage", 'isCodeBlock'],
        include: [
          {
            model: Room,
            as: "room",
            where: { roomName: params.room },
          },
          {
            model: User,
            as: "user",
            attributes: ["username", "pfp", "favColor"],
          },
        ],
        order: [["updatedAt", "ASC"]],
        require: true,
      });
      const messages = dbMessageData.map((message) =>
        message.get({ plain: true })
      );
      console.log(messages)
      res.json(messages);
    } catch (error) {
      res.status(500).json({ Error: error });
    }
  },

  async saveMessage({ body }, res) {
    console.log(body)
    try {
      let roomId = await Room.findOne({
        where: {
          roomName: body.room,
        },
        attributes: ["id"],
        raw: true,
      });

      let newMessage = await Message.create({
        message: body.msg,
        isCodeBlock: body.isCodeBlock,
        timeOfMessage: body.currentTime,
        userId: body.userId,
        roomId: roomId.id,
      });

      res.json(newMessage);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = messageController;

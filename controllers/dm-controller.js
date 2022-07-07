const { Message, Room, User, Dm } = require("../models/index");

const dmController = {
  async saveDmMsg({ body }, res) {
    try {
      let newDm = await Dm.create(
        {
          to: body[1].id,
          from: body[2].user_id,
          message: body[0],
        },
        { new: true }
      );
      if (newDm) {
        res.json(newDm);
      }
    } catch (error) {
      res.json(error);
    }
  },
};

module.exports = dmController;

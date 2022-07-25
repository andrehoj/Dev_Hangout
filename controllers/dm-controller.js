const { User, Dm } = require("../models/index");

const dmController = {
  async saveDmMsg({ body }, res) {
    try {
      let newDm = await Dm.create(
        {
          receiverId: body[1].id,
          senderId: body[2].user_id,
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

  async getAllDms({ params }, res) {
    try {
      let dmData = await Dm.findAll({
        where: { senderId: params.user_id },
        include: [
          { model: User, as: "sender", attributes: { exclude: "password" } },
          {
            model: User,
            as: "receiver",
            attributes: { exclude: "password" },
          },
        ],
      });

      if (!dmData.length) {
        dmData = await Dm.findAll({
          where: { receiverId: params.user_id },
          include: [
            { model: User, as: "sender", attributes: { exclude: "password" } },
            {
              model: User,
              as: "receiver",
              attributes: { exclude: "password" },
            },
          ],
        });
      }
      let dms = dmData.map((dm) => dm.get({ plain: true }));

      res.json(dms);
    } catch (error) {
      res.json(error);
    }
  },

  async getDmsByUser({ params }, res) {
    //a user can be a sender and a receiver so query both id types
    try {
      let dmData = await Dm.findAll({
        where: {
          receiverId: [params.receiverId, params.senderId],
          senderId: [params.receiverId, params.senderId],
        },

        include: [
          { model: User, as: "sender", attributes: { exclude: "password" } },
          {
            model: User,
            as: "receiver",
            attributes: { exclude: "password" },
          },
        ],
      });
      console.log(dmData)
      const dmsSender = dmData.map((dm) => dm.get({ plain: true }));

      res.json(dmsSender);
    } catch (error) {
      res.json(error);
    }
  },
};

module.exports = dmController;

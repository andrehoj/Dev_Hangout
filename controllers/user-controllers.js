const { User } = require("../models/index");
const { saveSession } = require("../utils/helpers");
const { getRandomPfp } = require("../utils/helpers");

const userController = {
  async getUsersSession({ session }, res) {
    res.json(session);
  },

  //get all users
  async getAllUsers({ params, body, session }, res) {
    try {
      let dbUserData = await User.findAll({
        attributes: { exclude: ["password"] },
      });
      res.json(dbUserData);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //get a single users info
  async getUserById({ params }, res) {
    try {
      let dbUserData = await User.findOne({ where: { _id: params.id } });
      res.json(dbUserData);
    } catch (error) {
      res.json(error);
    }
  },

  //log's a user in
  async logUserIn({ body, session }, res) {
    try {
      let dbUserData = await User.findOne({
        where: {
          username: body.userName,
        },
      });

      if (!dbUserData) {
        res.status(400).json({ message: "No user with that username" });
        return;
      }

      const validPassword = dbUserData.checkPassword(body.passWord);

      if (!validPassword) {
        res.status(400).json({ message: "Incorrect password" });
        return;
      }

      let plainUserData = dbUserData.get({ plain: true });

      await session.save(() => {
        session.user_id = plainUserData.id;
        session.username = plainUserData.username;
        session.loggedIn = true;
        session.pfp = plainUserData.pfp;
        session.gitHub = dbUserData.gitHub;

        User.update(
          { isActive: true },
          {
            where: {
              username: session.username,
            },
          }
        ).then(() => {
          res.json({
            user: dbUserData,
            message: "You are now logged in!",
            username: session.username,
          });
        });
      });
    } catch (error) {}
  },

  //register user
  async registerUser({ body, session }, res) {
    try {
      let dbUserData = await User.findOne({
        where: {
          username: body.userName,
        },
      });

      if (dbUserData === null) {
        let pfp = await getRandomPfp(body.userName);

        let newUser = await User.create({
          username: body.userName,
          password: body.passWord,
          gitHub: body.gitHubUserName,
          isActive: true,
          pfp: pfp,
        });

        session.save(() => {
          session.user_id = newUser.id;
          session.username = newUser.username;
          session.loggedIn = true;
          session.pfp = newUser.pfp;
          session.gitHub = newUser.gitHub;

          let payLoad = [dbUserData, session];

          res.json(payLoad);
        });
      }
    } catch (error) {
      res.status(400).json({ message: "password is not strong enough" });
    }
  },

  //edit a user account
  async editUser({ body, session }, res) {
    try {
      let dbUserData = await User.update(body, {
        where: {
          id: body.id,
        },
      });

      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }

      session.username = body.username;
      session.pfp = body.pfp;
      session.gitHub = body.gitHub;

      res.json(dbUserData);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //log user out
  async logUserOut({ session }, res) {
    try {
      if (session.loggedIn) {
        let loggedOutUser = await User.update(
          { isActive: false, currentRoom: null },
          {
            where: {
              username: session.username,
            },
          }
        );
        if (loggedOutUser) {
          session.destroy(() => {
            res.status(204).end();
          });
        }
      } else {
        res.status(404).end();
      }
    } catch (error) {
      res.status(400).json(error);
    }
  },

  //delete a user account
  async deleteAccount({ session }, res) {
    try {
      let deletedUser = await User.destroy({
        where: {
          id: session.user_id,
        },
      });

      if (deletedUser) {
        session.destroy();
        res.json(dbUserData);
      }
    } catch (error) {
      res.json(error);
    }
  },
};

module.exports = userController;

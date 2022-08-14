const { User } = require("../models/index");
const { getRandomPfp } = require("../utils/helpers");

const userController = {
  async getUsersSession({ session }, res) {
    res.json(session);
  },

  async getUserId({ params }, res) {
    try {
      let user = await User.findOne({ where: { username: params.username } });
      res.json(user.id);
    } catch (error) {}
  },

  async getUserByUsername({ params }, res) {
    try {
      let dbUserData = await User.findOne({
        where: { username: params.username },
      });

      res.json(dbUserData);
    } catch (error) {
      res.json(error);
    }
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

  //single user query
  async getUserById({ params }, res) {
    try {
      let userData = await User.findByPk(params.id, {
        attributes: { exclude: ["password"] },
      });

      userData.get({ plain: true });

      res.json(userData);
    } catch (error) {
      res.status(400).json(error);
    }
  },

  //log's a user in
  async logUserIn({ body, session }, res) {
    try {
      if (!body.username || !body.password)
        res.status(400).json({ errorMessage: "An error has occured" });

      let dbUserData = await User.findOne({
        where: {
          username: body.username,
        },
      });

      if (!dbUserData) {
        res
          .status(400)
          .json({ errorMessage: "Username or password is incorrect" });
        return;
      }

      const user = dbUserData.get({ plain: true });

      const validPassword = dbUserData.checkPassword(body.password);

      if (!validPassword) {
        res
          .status(400)
          .json({ errorMessage: "Username or password is incorrect" });
        return;
      }

      await session.save(() => {
        session.loggedIn = true;
        session.user_id = user.id;
        session.username = user.username;
        session.pfp = user.pfp;
        session.gitHub = user.gitHub;
        session.favTech = user.favTech;
        session.cookie.maxAge = 1000 * 60 * 60;

        User.update(
          { isActive: true },
          {
            where: {
              username: session.username,
            },
          }
        );
        
        res.json(session);
      });
    } catch (error) {
      res.status(400).json(error);
    }
  },

  //register user
  async registerUser({ body, session }, res) {
    try {
      let dbUserData = await User.findOne({
        where: {
          username: body.username,
        },
      });

      if (dbUserData) {
        res.status(400).json({ message: "Username is taken" });
        return;
      }

      let pfp = await getRandomPfp(body.username);

      let newUser = await User.create({
        username: body.username,
        password: body.password,
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
        session.lastRoom = "general";

        let payLoad = [dbUserData, session];

        res.json(payLoad);
      });
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
      session.favTech = body.favTech;

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
        await session.destroy();
        res.json(deletedUser);
      }
    } catch (error) {
      console.log("error occured", error);
      res.json(error);
    }
  },

  async saveSocket({ body }, res) {
    try {
      const dbUserData = await User.update(
        { socketId: body.currentUser.socketId },
        { where: { username: body.currentUser.username } }
      );
      dbUserData = dbUserData.map((data) => data.get({ plain: true }));
      res.json(dbUserData);
    } catch (error) {
      res.json(error);
    }
  },
};

module.exports = userController;

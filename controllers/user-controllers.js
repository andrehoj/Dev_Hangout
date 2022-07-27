const { User } = require("../models/index");
const { getRandomPfp } = require("../utils/helpers");

const userController = {
  async getUsersSession({ session }, res) {
    res.json(session);
  },

  async getUserId({ params }, res) {
    console.log("/:username was hit");
    try {
      let user = await User.findOne({ where: { username: params.username } });
      res.json(user.id);
    } catch (error) {}
  },

  async getUserByUsername({ params }, res) {
    console.log("/user-id/:username was hit ");
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
    console.log("/ was hit");
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
    console.log("/:id was hit ");
    try {
      let dbUserData = await User.findOne({ where: { _id: params.id } });
      console.log(dbUserData);
      res.json(dbUserData);
    } catch (error) {
      res.json(error);
    }
  },

  //single user query
  async getUserById({ params }, res) {
    console.log("/:id was hit");
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
    console.log("/login was hit");
    try {
      if (!body.userName || !body.passWord)
        res.status(400).json({ errorMessage: "An error has occured" });

      let dbUserData = await User.findOne({
        where: {
          username: body.userName,
        },
      });

      if (!dbUserData) {
        res
          .status(400)
          .json({ errorMessage: "Username or password is incorrect" });
        return;
      }

      const user = dbUserData.get({ plain: true });

      if (user.isActive) {
        res
          .status(400)
          .json({ errorMessage: "This user is currenty logged in" });
        return;
      }

      const validPassword = dbUserData.checkPassword(body.passWord);

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

        User.update(
          { isActive: true },
          {
            where: {
              username: session.username,
            },
          }
        );

        res.json({ message: "you are now logged in!" });
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  },

  //register user
  async registerUser({ body, session }, res) {
    console.log("/register was it");
    try {
      let dbUserData = await User.findOne({
        where: {
          username: body.userName,
        },
      });

      if (dbUserData) {
        res.status(400).json({ message: "Username is taken" });
        return;
      }

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
        session.lastRoom = "general";

        let payLoad = [dbUserData, session];

        res.json(payLoad);
      });
    } catch (error) {
      // const errorMessage = error.errors[0].message;
      res.status(400).json({ message: "password is not strong enough" });
    }
  },

  //edit a user account
  async editUser({ body, session }, res) {
    console.log("/edituser was hit");
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
    console.log("/logout was hit ");
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
    console.log("/deleteAccount was hit");
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

  async saveSocket({ body }, res) {
    console.log("/socket was hit ");
    try {
      let dbUserData = await User.update(
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

const router = require("express").Router();
const { User } = require("../../models");
const fetch = require("node-fetch");

router.get("/", (req, res) => {
  User.findAll({
    attributes: { exclude: ["password"] },
  })
    .then((dbUserData) => {
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/id", (req, res) => {
  res.json(req.session);
});

router.post("/login", (req, res) => {
  User.findOne({
    where: {
      username: req.body.userName,
    },
  }).then((dbUserData) => {
    if (!dbUserData) {
      res.status(400).json({ message: "Error: No user with that username" });
      return;
    }

    if (dbUserData.dataValues.is_active === true) {
      res
        .status(400)
        .json({ message: "Error this account is currently active" });
      return;
    }

    const validPassword = dbUserData.checkPassword(req.body.passWord);

    if (!validPassword) {
      res.status(400).json({ message: "Error incorrect password" });
      return;
    }

    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;
      req.session.pfp = dbUserData.pfp;

      User.update(
        { isActive: true },
        {
          where: {
            username: req.session.username,
          },
        }
      ).then((dbUserData) => {
        res.json({
          user: dbUserData,
          message: "You are now logged in!",
          username: req.session.username,
        });
      });
    });
  });
});

router.post("/signup", (req, res) => {
  User.findOne({
    where: {
      username: req.body.userName,
    },
  }).then((dbUserData) => {
    if (dbUserData === null) {
      fetch(`https://robohash.org/${req.body.userName}`).then((response) => {
        User.create({
          username: req.body.userName,
          password: req.body.passWord,
          isActive: true,
          pfp: response.url,
        })
          .then((dbUserData) => {
            req.session.save(() => {
              req.session.user_id = dbUserData.id;
              req.session.username = dbUserData.username;
              req.session.loggedIn = true;
              req.session.pfp = dbUserData.pfp;

              let payLoad = [dbUserData, req.session];
              res.json(payLoad);
            });
          })
          .catch((err) => {
            res.status(400).json({
              message: "Error password must be at lease 4 characters",
            });
          });
      });
    } else res.status(400).json({ message: "That username is already taken!" });
  });
});

router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {
    User.update(
      { isActive: false },
      {
        where: {
          username: req.session.username,
        },
      }
    ).then((dbUserData) => {
      req.session.destroy(() => {
        console.log(dbUserData);
        res.status(204).end();
      });
    });
  } else {
    res.status(404).end();
  }
});

router.delete("/delete-account", (req, res) => {
  console.log(req.session);
  User.destroy({
    where: {
      id: req.session.user_id,
    },
  })
    .then((dbUserData) => {
      req.session.destroy();
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;

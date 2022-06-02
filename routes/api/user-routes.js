const router = require("express").Router();
const { User } = require("../../models");

router.get("/", (req, res) => {
  User.findAll({
    // attributes: { exclude: ["password"] },
  })
    .then((dbUserData) => {
      let payLoad = [dbUserData, req.session];
      res.json(payLoad);
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
  console.log(req.body.userName, req.body.passWord);
  User.findOne({
    where: {
      username: req.body.userName,
    },
  }).then((dbUserData) => {
    if (!dbUserData) {
      res.status(400).json({ message: "Error: No user with that username" });
      return;
    }

    const validPassword = dbUserData.checkPassword(req.body.passWord);

    if (validPassword) {
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
        User.update(
          { is_active: true },
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
    }
  });
});

router.post("/signup", (req, res) => {
  User.create({
    username: req.body.username,
    password: req.body.password,
    is_active: true,
  })
    .then((dbUserData) => {
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;

        let payLoad = [dbUserData, req.session];
        res.json(payLoad);
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/logout", (req, res) => {
  console.log(req.session.username);
  if (req.session.loggedIn) {
    User.update(
      { is_active: false },
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

module.exports = router;

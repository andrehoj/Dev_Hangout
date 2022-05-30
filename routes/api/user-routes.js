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

router.post("/login", (req, res) => {
  User.findOne({
    where: {
      username: req.body.userName,
      password: req.body.passWord,
    },
  }).then((dbUserData) => {
    if (!dbUserData) {
      res.status(400).json({ message: "No user with that email address!" });
      return;
    }
    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;

      res.json({ user: dbUserData, message: "You are now logged in!" });
    });
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

// DELETE /1
router.delete("/:id", (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;

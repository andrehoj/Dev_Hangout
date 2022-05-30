const router = require("express").Router();
const { User } = require("../../models");

//send res.session so we can tell who is the current user and if they are logged in
router.get("/", (req, res) => {
  User.findAll({
    attributes: { exclude: ["password"] },
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

// GET /login
router.get("/login/:username/:password", (req, res) => {
  // Expects /api/users/login/username/password
  User.findOne({
    // attributes: { exclude: ['password'] },
    where: {
      username: req.params.username,
      password: req.params.password,
    },
  })
    .then((dbLoginData) => {
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// GET /1
router.get("/:id", (req, res) => {
  User.findOne({
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

// POST /signup
router.post("/signup", (req, res) => {
  // expects {username: 'Lernantino', password: 'password1234'}
  User.create({
    username: req.body.username,
    password: req.body.password,
  })
    .then((dbUserData) => {
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;

        res.json(dbUserData);
      });
    })

    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// PUT /1
router.put("/:id", (req, res) => {
  // expects {username: 'Lernantino', password: 'password1234'}

  // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
  User.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData[0]) {
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

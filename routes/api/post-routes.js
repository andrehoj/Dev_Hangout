const router = require('express').Router();
const { Post, User } = require('../../models');

// get all users
router.get('/', (req, res) => {
    Post.findAll({
      attributes: ['id', 'message', 'created_at'],
      include: [
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
    console.log(err);
    res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
  // expects {message: 'Taskmaster goes public!', user_id: 1}
  Post.create({
    message: req.body.message,
    user_id: req.body.user_id
  })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
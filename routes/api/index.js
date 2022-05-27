const router = require('express').Router();

const userRoutes = require('./user-routes.js');

router.use('/signup', userRoutes);
router.use('/login', userRoutes);

module.exports = router;
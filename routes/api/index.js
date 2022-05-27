const router = require('express').Router();

const userRoutes = require('./user-routes.js');

router.use('/', userRoutes);

module.exports = router;
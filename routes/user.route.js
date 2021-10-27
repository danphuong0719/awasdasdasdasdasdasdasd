const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const verifyToken = require('../verify/verifyToken');

router.get("/:userId", userController.getUser);

module.exports = router;
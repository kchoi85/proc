const express = require('express');
const router = express.Router();

// Controllers
const UsersController = require('../controllers/users')

// Register for /controllers/users.js
router.post('/registerUser', UsersController.users_register_user)
router.post('/loginUser', UsersController.users_login_user)

module.exports = router;

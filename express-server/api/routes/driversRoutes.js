const express = require('express');
const router = express.Router();

// Controllers
const DriversController = require('../controllers/drivers')

// Middleware
const authMiddleware = require('../middleware/authMiddleware');

// Register for /controllers/drivers.js
router.post('/registerDriver', DriversController.drivers_register_driver)
router.post('/loginDriver', DriversController.drivers_login_driver)
router.post('/completeOrder/:orderNum', authMiddleware, DriversController.drivers_complete_order)
router.post('/logoutDriver', DriversController.drivers_logout_driver)

module.exports = router;router
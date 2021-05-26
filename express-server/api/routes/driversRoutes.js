const express = require('express');
const router = express.Router();

// Controllers
const DriversController = require('../controllers/drivers')

// Register for /controllers/drivers.js
router.post('/registerDriver', DriversController.drivers_register_driver)
router.post('/loginDriver', DriversController.drivers_login_driver)
// Driver submitting orderId after delivering
router.post('/completeOrder/:orderNum', DriversController.drivers_complete_order)

module.exports = router;router
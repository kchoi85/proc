const express = require('express');
const router = express.Router();

// Controllers
const DriversController = require('../controllers/drivers')

// Middleware
const driverAuth = require('../middleware/driverAuth');

// Register for /controllers/drivers.js
router.post('/registerDriver', DriversController.drivers_register_driver)
router.post('/loginDriver', DriversController.drivers_login_driver)

router.get('/getDrivers', DriversController.drivers_get_available_drivers)
router.post('/assignDriver/:driverId', DriversController.drivers_assign_driver)

router.post('/completeOrder/:orderNum', /*driverAuth,*/ DriversController.drivers_complete_order)
router.post('/logoutDriver', DriversController.drivers_logout_driver)

module.exports = router;
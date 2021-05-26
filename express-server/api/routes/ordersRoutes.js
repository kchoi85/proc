const express = require('express');
const router = express.Router();

// Controllers
const OrdersController = require('../controllers/orders')

// Routes for /controllers/orders.js

router.post('/submitOrder', OrdersController.orders_submit_order)
router.get('/getOrders', OrdersController.orders_get_all)

//app.post('/', OrdersController)

module.exports = router;
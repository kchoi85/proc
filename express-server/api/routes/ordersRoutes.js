const express = require("express");
const router = express.Router();

// Controllers
const OrdersController = require("../controllers/orders");

// Routes for /controllers/orders.js

router.post("/submitOrder", OrdersController.orders_submit_order);
router.get("/pendingOrders", OrdersController.orders_get_orders_pending);
router.post("/getAllOrders", OrdersController.orders_get_all_orders);

// GET request previously completed orders

//app.post('/', OrdersController)

module.exports = router;

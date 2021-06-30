const mongoose = require("mongoose");
const axios = require("axios");
//const io = require('./socket')

// Models
const Order = require("../models/Orders");
const Driver = require("../models/Drivers");
const Restaurant = require("../models/Restaurants");

exports.orders_submit_order = async (req, res) => {
  var orderNumDate = Date.now();

  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    restaurantId: req.body.restaurantId,
    customerId: req.body.customerId, //userId
    orderNum: orderNumDate,
    items: req.body.items,
    message: req.body.message,
    orderStatus: "Driver-pending",
    subtotal: req.body.subtotal,
    deliveryFee: 1,
    tips: req.body.tips,
    taxes: req.body.taxes,
    total: req.body.total,
  });
  order
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Order created successfully",
        createdOrder: {
          _id: result._id,
          restaurantId: result.restaurantId,
          customerId: result.customerId,
          orderNum: result.orderNum,
          items: result.items,
          message: result.message,
          orderStatus: result.orderStatus,
          subtotal: result.subtotal,
          deliveryFee: result.deliveryFee,
          taxes: result.taxes,
          total: result.total,
          timestamp: result.timestamp,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });

  // find all Drivers where status: Online-available
  Driver.find({ status: "Online-available" })
    .exec()
    .then((drivers) => {
      drivers.forEach(() => {
        /* io.emit('Requesting-driver', {message: 'New Order Pending', message2: "message2"}) */
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error during assigning Driver",
        error: err,
      });
    });
};

exports.orders_get_orders_pending = (req, res) => {
  Order.find({ orderStatus: "Driver-pending" })
    .exec()
    .then((orders) => {
      var total = 0;
      for (var i = 0; i < orders[0].items.length; i++) {
        total += orders[0].items[i].price;
      }
      orders[0].total = total;

      res.status(200).json({
        count: orders.length,
        orders: orders.map((order) => {
          return {
            _id: order._id,
            restaurantId: order.restaurantId,
            customerId: order.customerId,
            orderNum: order.orderNum,
            items: order.items,
            message: order.message,
            orderStatus: order.orderStatus,
            total: order.total,
            timestamp: order.timestampdoc,
          };
        }),
      });
    })
    .catch((err) => res.status(500).json({ error: err }));
};

exports.orders_get_all_orders = async (req, res) => {
  let { userId } = req.body; //es6
  // let userId = req.body.userId;

  if (userId) {
    Order.find({ customerId: userId })
      .exec()
      .then(async (docs) => {
        const orders = [];
        for (const doc of docs) {
          let rest = await Restaurant.findOne({ _id: doc.restaurantId }).exec();
          orders.push({
            _id: doc._id,
            restaurantInfo: rest,
            itemTotal: doc.items.length,
            timestamp: doc.timestamp,
            orderStatus: doc.orderStatus,
          });
        }
        res.status(200).json({
          count: docs.length,
          orders,
        });
      })
      .catch((err) => console.log(err));
  } else {
    console.log("User not logged in...");
  }
};

// exports.orders_get_all_orders = async (req, res) => {
//   let { userId } = req.body; //es6
//   // let userId = req.body.userId;

//   Order.find({ customerId: userId })
//     .exec()
//     .then((docs) => {
//       res.status(200).json({
//         count: docs.length,
//         orders: docs.map(async (doc) => {
//           let rest = await Restaurant.findOne({ _id: doc.restaurantId }).exec();
//           // console.log(rest);

//           return {
//             _id: doc._id,
//             restaurantName: rest.name,
//             itemTotal: doc.items.length,
//             timestamp: doc.timestamp,
//             orderStatus: doc.orderStatus,
//           };
//         }),
//       });
//     });
// };

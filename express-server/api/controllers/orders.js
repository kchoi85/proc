const mongoose = require('mongoose');

// Models
const Order = require('../models/Orders');

exports.orders_submit_order = async (req, res) => {
    var orderNumDate = Date.now();   

    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        restaurantId: req.body.restaurantId,
        customerId: req.body.customerId,
        orderNum: orderNumDate,
        items: req.body.items,
        message: req.body.message,
        orderStatus: 'Driver Pending',
        total: req.body.total // sent from frontend
    })
    order.save()
        .then(result => {
            console.log(result);
            //increment orderNum: +1
            res.status(200).json({
                message: 'Order created successfully',
                createdOrder: {
                    _id: result._id,
                    restaurantId: result.restaurantId,
                    customerId: result.customerId,
                    orderNum: result.orderNum,
                    items: result.items,
                    message: result.message,
                    orderStatus: result.orderStatus,
                    total: result.total,
                    timestamp: result.timestamp
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        });
}

exports.orders_get_all = (req, res) => {
    Order.find({}).exec()
        .then(orders => {
            res.status(200).json({
                count: orders.length,
                orders: orders.map(order => {
                    return {
                        _id: order._id,
                        restaurantId: order.restaurantId,
                        customerId: order.customerId,
                        orderNum: order.orderNum,
                        items: order.items,
                        message: order.message,
                        orderStatus: order.orderStatus,
                        total: order.total,
                        timestamp: order.timestampdoc
                    }
                })
            });
        })
        .catch(err => res.status(500).json({error: err}))
};


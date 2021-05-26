const mongoose = require('mongoose');
//const io = require('./socket')

// Models
const Order = require('../models/Orders');
const Driver = require('../models/Drivers');

exports.orders_submit_order = async (req, res) => {
    var orderNumDate = Date.now();   

    items = req.body.items;
    var subtotal = 0;
    var total = 0; //req.body.items = [{}, {}]
    for (var i=0; i<items.length; i++) {
        subtotal += (items[i].quantity * items[i].price);
    }
    // total *= 1.13;
    
    total = subtotal * 1.13;
    taxes = total - subtotal;
    deliveryFee = 1.0000;
    total += deliveryFee;

    subtotal = Number(subtotal.toFixed(2));
    deliveryFee = Number(deliveryFee.toFixed(2));
    taxes = Number(taxes.toFixed(2));
    total = Number(total.toFixed(2));
    
    

    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        restaurantId: req.body.restaurantId,
        customerId: req.body.customerId,
        orderNum: orderNumDate,
        items: req.body.items,
        message: req.body.message,
        orderStatus: 'Driver-pending',
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        taxes: taxes,
        total: total // sent from frontend
    })
    order.save()
        .then(result => {
            console.log(result);
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
                    subtotal: result.subtotal,
                    deliveryFee: result.deliveryFee,
                    taxes: result.taxes,
                    total: result.total,
                    timestamp: result.timestamp
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        });

        // find all Drivers where status: Online-available
        Driver.find({status: 'Online-available'}).exec()
            .then(drivers => {
                drivers.forEach(() => {
                   /* io.emit('Requesting-driver', {message: 'New Order Pending', message2: "message2"}) */
                })
            })
            .catch(err => {res.status(500).json({
                message: 'Error during assigning Driver',
                error: err
            })})
}

exports.orders_get_orders_pending = (req, res) => {
    Order.find({orderStatus: 'Driver-pending'}).exec()
        .then(orders => {
            var total = 0;
            for (var i=0; i<orders[0].items.length; i++) {
                total += orders[0].items[i].price;
            }
            orders[0].total = total;
            
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


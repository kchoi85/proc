const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    restaurantId: {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true},
    customerId:  {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    driverId: {type: mongoose.Schema.Types.ObjectId, ref: 'Driver'},
    orderNum: {type: Number, default: 0},
    items: [{
        item: String,
        quantity: Number,
        price: Number
    }],
    message: {type: String},
    orderStatus: {type: String}, // Driver Pending, Driver Found, Order complete, Need Assistance
    total: {type: Number, default: 0},
    timestamp: {type:Date, default: Date.now}
}) //https://masteringjs.io/tutorials/mongoose/array

module.exports = mongoose.model('Order', orderSchema);
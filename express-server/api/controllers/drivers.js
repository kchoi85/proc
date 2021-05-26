const mongoose = require('mongoose');

const Driver = require('../models/Drivers');
const Order = require('../models/Orders');

exports.drivers_register_driver = async (req, res) => {
    const { name, email, phone } = req.body;

    if (await Driver.findOne({email}).exec()) {
        res.status(500).json({
            message: 'Registration invalid (ex)'
        })
        return;
    } else {
        const driver = new Driver({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            email: email,
            phone: phone
        });
        driver.save()
            .then(result => {
                console.log(result);
                res.status(200).json({
                    message: 'Driver created successfully',
                    createdDriver: {
                        _id: result._id,
                        name: result.name,
                        email: result.email,
                        phone: result.phone
                    }
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error: err})
            });
    }
}

exports.drivers_login_driver = async (req, res) => {
    const { email, password } = req.body;

    const driver = await Driver.findOne({email}).exec()
    if (!driver || driver.password !== password) {
        res.status(403).json({
            message: 'invalid login' 
        })
        return;
    } 
    res.status(200).json({
        message: 'Driver Log in successful!'
    })
}

exports.drivers_complete_order = async (req, res) => {
    orderNum = req.params.orderNum
    await Order.findOne({orderNum}).exec()
        .then(order => {
            order.update({$set: { orderStatus:  'Order Complete'}}, (err, doc) => {
                if (err) {
                    res.status(500).json({error: err})
                }
                res.status(200).json({
                    message: 'Order Completed!'
                })
            })
        })
    happyUser = await Order.findOne({orderNum}).exec()
    happyUser = happyUser.customerId
    
    // send message to happyUser


    
}
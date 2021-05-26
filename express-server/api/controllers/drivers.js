const mongoose = require('mongoose');

const Driver = require('../models/Drivers');
const Order = require('../models/Orders');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.drivers_register_driver = async (req, res) => {
    const { name, email, phone } = req.body;

    if (await Driver.findOne({ email }).exec()) {
        res.status(500).json({
            message: 'Registration Invalid!'
        })
        return;
    } else {

        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ error: err })
            } else {
                const driver = new Driver({
                    _id: new mongoose.Types.ObjectId(),
                    name: name,
                    email: email,
                    password: hash,
                    phone: phone
                });
                driver.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'Driver successfuly created!',
                            createdDriver: {
                                _id: result._id,
                                name: result.name,
                                email: result.email,
                                password: result.password,
                                phone: result.phone
                            }
                        })
                            .catch(err => {
                                res.status(500).json({ error: err })
                            })
                    })
            }
        })
    }
}

exports.drivers_login_driver = async (req, res) => {
    const { email, password } = req.body;

    Driver.findOne({ email }).exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Login failed.'
                })
            }
            if (user.length > 2) {
                return res.status(500).json({
                    message: 'Something is very wrong...'
                })
            }
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    return res.status(401).json({ message: 'Login failed.' })
                }
                if (result) {
                    const token = jwt.sign({
                        email: user.email,
                        driverId: user._id
                    },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "12h"
                        });
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    });
                }
                res.status(401).json({ message: 'Login failed.' })
            })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })

    // Mark status of Driver as Online
    Driver.findOne({ email }).exec()
        .then(user => {
            user.updateOne({ $set: { status: 'Online-available' } }, (err, doc) => {
                if (err) {
                    res.status(500).json({ error: err })
                }
                res.status(200).json({
                    message: 'Driver is now online'
                })
            })
        })
}

exports.drivers_complete_order = async (req, res) => {
    orderNum = req.params.orderNum
    driverId = req.body.driverId;
    await Order.findOne({ orderNum }).exec()
        .then(order => {
            order.updateOne({ $set: { orderStatus: 'Order-Complete' } }, (err, doc) => {
                if (err) {
                    res.status(500).json({ error: err })
                }
                res.status(200).json({
                    message: 'Order Completed!'
                })
            })
        })
    
    happyUser = await Order.findOne({ orderNum }).exec()
    happyUser = happyUser.customerId

    Driver.find({ _id: driverId }).exec()
        .then(driver => {
            driver.updateOne({ $set: { status: 'Online-available' } }, (err, doc) => {
                if (err) {
                    console.log(err)
                    res.status(500).json({ error: err })
                }
                res.status(200).json({
                    message: `Finished deliverying order ${orderNum}`
                })
            })
        })

    // send message to happyUser


}

exports.drivers_logout_driver = (req, res) => {
    const { email } = req.body.email;
    Driver.findOne({ email }).exec()
        .then(user => {
            user.updateOne({ $set: { status: 'Offline' } }, (err, doc) => {
                if (err) {
                    res.status(500).json({ error: err })
                }
                res.status(200).json({
                    message: 'Driver is now offline'
                })
            })
        })
}
/*
router.get('/getDrivers', DriversController.drivers_get_available_drivers)
router.post('/assignDriver', DriversController.drivers_assign_driver)
*/
exports.drivers_get_available_drivers = (req, res) => {
    Driver.find({ status: "Online-available" }).exec()
        .then(drivers => {
            res.status(200).json({
                availableDrivers: drivers.map(driver => {
                    return {
                        _id: driver._id,
                        name: driver.name,
                        phone: driver.phone,
                        status: driver.status
                    }
                })
            })

        })
        .catch(err => res.status(500).json({ error: err }))
}

exports.drivers_assign_driver = (req, res) => {
    driverId = req.params.driverId;
    orderNum = req.body.orderNum;

    Order.findOne({ orderNum: orderNum }).exec()
        .then(order => {
            order.updateOne({ $set: { orderStatus: 'Driver-found', driverId: driverId } }, (err, doc) => {
                if (err) {
                    console.log(err)
                    res.status(500).json({ error: err })
                }
                res.status(200).json({
                    message: `Order Number: ${orderNum} assigned to driver: ${driverId}`
                })
            })
        })
        .catch(err => res.status(500).json({ error: err }))

    Driver.findOne({ _id: driverId }).exec()
        .then(driver => {
            // console.log(driver)
            driver.updateOne({$set: {status: 'Online-delivering'}}, (err, doc) => {
                if (err) {
                    res.status(500).json({error: err})
                }
                return res.status(200)
            })
        })
        .catch(err => res.status(500).json({ error: err }))
}
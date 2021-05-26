const mongoose = require('mongoose');

const User = require('../models/Users');

exports.users_register_user = async (req, res) => {
    const { email, name, password, phone, address } = req.body;

    if (await User.findOne({email}).exec()) {
        res.status(500).json({
            message: 'Registration invalid'
        })
        return;
    } else {
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: email,
            name: name,
            password: password,
            phone: phone,
            address: address
        });
        user.save()
            .then(result => {
                console.log(result);
                res.status(200).json({
                    message: 'User created successfully',
                    createdUser: {
                        _id: result._id,
                        email: result.email,
                        name: result.name,
                        password: result.password,
                        phone: result.phone,
                        address: result.address
                    }
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error: err})
            });
    }
}

exports.users_login_user = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({email}).exec()
    if (!user || user.password !== password) {
        res.status(403).json({
            message: 'invalid login' 
        })
        return;
    } 
    res.status(200).json({
        message: 'User Log in successful!'
    })
}
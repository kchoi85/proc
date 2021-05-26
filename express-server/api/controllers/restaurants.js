const mongoose = require('mongoose');

const Restaurant = require('../models/Restaurants');

exports.restaurants_get_all = (req, res) => {
    Restaurant.find(/*{online: true}*/).exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            restaurants: docs.map(doc => {
                return {
                    name: doc.name,
                    email: doc.email,
                    menu: doc.menu,
                    phone: doc.phone,
                    address: doc.address,
                    resBanner: doc.resBanner,
                    online: doc.online
                }
            })
        })
    })
    .catch(err => res.status(500).json({error: err}))
}

exports.restaurants_register_restaurant = async (req, res) => {
    const { name } = req.body;
    if (await Restaurant.findOne({name}).exec()) {
        res.status(500).json({
            message: 'Restaurant already exists with this name... please check!'
        })
        return;
    } else {
        const restaurant = new Restaurant({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            email: req.body.email,
            menu: [req.body.menu],
            phone: req.body.phone,
            address: req.body.address,
            resBanner: req.file.path
        })
        restaurant.save()
            .then(result => {
                console.log(result);
                res.status(200).json({
                    message: 'Restaurant created successfully',
                    createdDriver: {
                        _id: result._id,
                        name: result.name,
                        email: result.email,
                        menu: result.menu,
                        phone: result.phone,
                        address: result.address,
                        resBanner: result.resBanner
                    }
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error: err})
            });
    }
}
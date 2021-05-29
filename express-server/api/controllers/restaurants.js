const mongoose = require("mongoose");

const Restaurant = require("../models/Restaurants");

exports.restaurants_get_resId = (req, res) => {
  Restaurant.findOne({ _id: req.params.resId })
    .exec()
    .then((rest) => {
      res.status(200).json({
        _id: rest.id,
        email: rest.email,
        menu: rest.menu,
        phone: rest.phone,
        address: rest.address,
        resBanner: rest.resBanner,
        online: rest.online,
      });
    })
    .catch((err) => res.status(500).json({ error: err }));
};

exports.restaurants_get_all = (req, res) => {
  Restaurant.find(/*{online: true}*/)
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        restaurants: docs.map((doc) => {
          console.log(doc);
          return {
            _id: doc._id,
            name: doc.name,
            description: doc.description,
            email: doc.email,
            menu: doc.menu,
            phone: doc.phone,
            address: doc.address,
            resBanner: doc.resBanner,
            type: doc.type,
            rating: doc.rating,
            online: doc.online,
          };
        }),
      });
    })
    .catch((err) => res.status(500).json({ error: err }));
};

exports.restaurants_register_restaurant = (req, res) => {
  const { name } = req.body;

  Restaurant.find({ name })
    .exec()
    .then((restaurant) => {
      if (restaurant.length >= 1) {
        return res.status(401).json({ message: "Restaurant already exists" });
      } else {
        const restaurant = new Restaurant({
          _id: new mongoose.Types.ObjectId(),
          name: req.body.name,
          description: req.body.description,
          email: req.body.email,
          menu: req.body.menu,
          phone: req.body.phone,
          address: req.body.address,
          resBanner: req.file.path,
        });
        restaurant
          .save()
          .then((result) => {
            console.log(result);
            res.status(200).json({
              message: "Restaurant created successfully",
              createdRestauratn: {
                _id: result._id,
                name: result.name,
                description: result.description,
                email: result.email,
                menu: result.menu,
                phone: result.phone,
                address: result.address,
                resBanner: result.resBanner,
              },
            });
          })
          .catch((err) =>
            res.status(500).json({ error: err, message: "here1" })
          );
      }
    })
    .catch((err) => {
      console.log(req);
      res.status(500).json({ error: err, message: "here2" });
    });
};

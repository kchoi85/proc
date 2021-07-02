const mongoose = require("mongoose");

const Restaurant = require("../models/Restaurants");

exports.restaurants_get_resId = (req, res) => {
  Restaurant.findOne({ _id: req.params.resId })
    .exec()
    .then((rest) => {
      res.status(200).json({
        _id: doc._id,
        name: doc.name,
        type: doc.type,
        rating: doc.rating,
        deliveryTime: doc.deliveryTime,
        description: doc.description,
        email: doc.email,
        menu: doc.menu,
        phone: doc.phone,
        address: doc.address,
        resBanner: doc.resBanner,
        rating: doc.rating,
        online: doc.online,
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
            type: doc.type,
            rating: doc.rating,
            deliveryTime: doc.deliveryTime,
            description: doc.description,
            email: doc.email,
            menu: doc.menu,
            phone: doc.phone,
            address: doc.address,
            resBanner: doc.resBanner,
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
          type: req.body.type,
          rating: req.body.rating,
          deliveryTime: req.body.deliveryTime,
          description: req.body.description,
          email: req.body.email,
          menu: req.body.menu,
          phone: req.body.phone,
          address: req.body.address,
          resBanner: req.file.path,
          online: req.body.online,
        });
        restaurant
          .save()
          .then((result) => {
            console.log(result);
            res.status(200).json({
              message: "Restaurant created successfully",
              createdRestauratn: {
                _id: doc._id,
                name: doc.name,
                type: doc.type,
                rating: doc.rating,
                deliveryTime: doc.deliveryTime,
                description: doc.description,
                email: doc.email,
                menu: doc.menu,
                phone: doc.phone,
                address: doc.address,
                resBanner: doc.resBanner,
                online: doc.online,
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

//router.get('/getRestaurants/:resName', RestaurantsController.restaurants_search_resName)

exports.restaurants_search_resName = async (req, res) => {
  // https://stackoverflow.com/questions/11976692/searching-database-with-mongoose-api-and-nodejs

  if (req.params.resName) {
    let resName = req.params.resName;

    resName = resName.trim();
    let regex = new RegExp(resName, "i");

    let searchResult = await Restaurant.find({
      $or: [{ name: regex }, { type: regex }],
    }).exec();

    if (searchResult) {
      res.status(200).json({
        restaurantInfo: searchResult,
      });
    }
  }
};

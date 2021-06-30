const express = require("express");
const router = express.Router();

// === Multer Config ===
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
// const fileFilter = (req, file, cb) => { // fileFilter param for multer
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//         cb(null, true); //accept file
//     } else {
//         cb(null, false); //reject file
//     }
// }
const upload = multer({
  // upload.single
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, //5mb
  },
  //fileFilter: fileFilter
});
// === End of Multer Config ===

// Controllers
const RestaurantsController = require("../controllers/restaurants");

// Routes for /controllers/restaurants.js
router.get("/getRestaurants", RestaurantsController.restaurants_get_all);
router.get(
  "/getRestaurants/:resId",
  RestaurantsController.restaurants_get_resId
);
router.post(
  "/registerRestaurant",
  upload.single("resBanner"),
  RestaurantsController.restaurants_register_restaurant
);
router.get(
  "/searchRestaurants/:resName",
  RestaurantsController.restaurants_search_resName
);

module.exports = router;

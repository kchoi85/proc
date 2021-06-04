const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  driverId: { type: String, default: "" },
  orderNum: { type: Number, default: 0 },
  items: [
    {
      item: String,
      itemId: String,
      quantity: Number,
      price: Number,
    },
  ],
  message: { type: String },
  orderStatus: { type: String }, // Driver-pending, Driver-found, Order-complete, Need-assistance

  subtotal: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 1.0 },
  taxes: { type: Number, default: 0 },
  tips: { type: Number, default: 0 },
  total: { type: Number, default: 0 },

  timestamp: { type: Date, default: Date.now },
}); //https://masteringjs.io/tutorials/mongoose/array

module.exports = mongoose.model("Order", orderSchema);

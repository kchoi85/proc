const mongoose = require("mongoose");

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const restSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  type: { type: String, required: true }, // make it into multiple keywords?
  description: { type: String, required: true }, // res desc. and store hours
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required",
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  menu: [
    {
      item: String,
      details: String,
      price: Number,
      image: String,
    },
  ],
  phone: { type: Number, required: true },
  address: { type: String, required: true },
  resBanner: { type: String, required: false },
  online: { type: Boolean, default: true },
});

module.exports = mongoose.model("Restaurant", restSchema);

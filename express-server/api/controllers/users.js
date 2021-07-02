const mongoose = require("mongoose");

const User = require("../models/Users");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// /users/registerUser/
exports.users_register_user = async (req, res) => {
  const { email, name, password, phone, address } = req.body;

  if (await User.findOne({ email }).exec()) {
    res.status(500).json({
      message: "Registration invalid",
    });
    return;
  } else {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: err });
      } else {
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          email: email,
          name: name,
          password: hash,
          phone: phone,
          address: address,
        });

        user
          .save()
          .then((result) => {
            const token = jwt.sign(
              {
                email: result.email,
                userId: result._id,
              },
              process.env.JWT_KEY,
              {
                expiresIn: "24h",
              }
            );

            console.log(result);
            res.status(200).json({
              message: "User created successfully",
              _id: result._id,
              token: token,
              fullname: result.name,
              //   createdUser: {
              //     _id: result._id,
              //     email: result.email,
              //     name: result.name,
              //     password: result.password,
              //     phone: result.phone,
              //     address: result.address,
              //   },
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
          });
      }
    });
  }
};

exports.users_login_user = async (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Login failed.",
        });
      }
      if (user.length > 2) {
        return res.status(500).json({
          message: "Something is very wrong...",
        });
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({ message: "Login failed." });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id,
            },
            process.env.JWT_KEY
          );

          // return _id and token to client
          return res.status(200).json({
            message: "Auth successful",
            _id: user._id,
            token: token,
            fullname: user.name,
          });
        }
        // otherwise,
        res.status(401).json({ message: "Login failed." });
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });

  //   const user = await User.findOne({ email }).exec();
  //   if (!user || user.password !== password) {
  //     res.status(403).json({
  //       message: "invalid login",
  //     });
  //     return;
  //   }
  //   res.status(200).json({
  //     message: "User Log in successful!",
  //     _id: user._id,
  //   });
};

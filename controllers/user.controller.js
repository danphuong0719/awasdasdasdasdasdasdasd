require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

module.exports.getUser = async (req, res, next) => {
  let userId = req.params.userId.toString();
  try {
    let findUser = await User.findOne({ _id: userId });
    if (findUser) {
      return res.json({ status: "User Finded", dataUser: findUser });
    }
  } catch (err) {
    next(err.message);
  }
  res.redirect("/login.html");
  //   return res.status(400).send('User is not found');
};

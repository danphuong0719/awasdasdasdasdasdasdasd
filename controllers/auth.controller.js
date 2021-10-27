require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const {
  registerValidation,
  loginValidation,
} = require("../validation/validation");

module.exports.postRegister = async (req, res, next) => {
  let { name, email, password } = req.body;
  //  if(!email) return res.json({status: 'error', error: 'Invalid Email'});
  //  if(!password) return res.json({status: 'error', error: 'Invalid Password'})
  //  if(password.length <= 5) return res.json({status: 'error', error: 'Password too small. Should be at least 6 characters!'})
  try {
    const result = await registerValidation.validateAsync(req.body);
    if (result.error)
      return res.status(400).send(result.error.details[0].message);

    const emailExist = await User.findOne({ email: result.email });
    if (emailExist) return res.status(400).send("Email is already in use");

    result.password = await bcrypt.hash(password, 10);

    const newUser = new User(result);
    const savedUser = await newUser.save();

    const accessToken = jwt.sign(
      { id: savedUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.header("auth-token", accessToken).send({
      jwt: accessToken,
      user: {
        id: savedUser._id,
        email: savedUser.email,
        name: savedUser.name,
        avatarUrl: "",
      },
    });

  } catch (err) {
    if (err.isJoi === true) err.status = 422;
    next(err);
  }
};

module.exports.postLogin = async (req, res, next) => {
  let { email, password } = req.body;
  try {
    const { error } = loginValidation.validateAsync(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send(`This email is not registered`);

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send("Invalid password");

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.header("auth-token", accessToken).send({
      jwt: accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,

        avatarUrl: user.avatarUrl || "",
        phone: user.phone || "",
        bio: user.bio || "",
      },
    });

  } catch (err) {
    if (err.isJoi) err.status = 422;
    next(err);
  }
};

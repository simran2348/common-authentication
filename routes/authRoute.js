const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const { resource } = require("../constant");
const tokenAuth = require("../middleware/tokenAuth");
const sendVerificationEmail = require("../services/emailService");
require("dotenv").config();

const User = require("../schema/User");

//@route    POST api/auth/checkEmail
//@desc     Check user email
//@access   Public
router.post(
  resource.routes.checkEmail,
  check("email").isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: resource.errorText.emailCheck });
    }
    const { email, type } = req.body;
    try {
      let user = await User.findOne({ email });
      const { statusCode, message } =
        type === "R"
          ? {
              statusCode: user ? 400 : 200,
              message: user
                ? resource.errorText.userExists
                : resource.successText.success,
            }
          : {
              statusCode: user ? 200 : 400,
              message: user
                ? resource.successText.success
                : resource.errorText.invalidUser,
            };

      res.status(statusCode).json({ msg: message });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        msg: resource.errorText.serverError,
      });
    }
  }
);

//@route    POST api/auth/register
//@desc     Register new user
//@access   Public
router.post(resource.routes.register, async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = new User({
      email,
      password,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          msg: resource.successText.registrationSuccess,
          token,
        });
        // sendVerificationEmail(user.email, user.verificationToken);
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      msg: resource.errorText.serverError,
    });
  }
});

//@route    POST api/auth/login
//@desc     User Login
//@access   Public
router.post(resource.routes.login, async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: resource.errorText.invalidPassword });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          msg: resource.successText.loginSuccess,
          token,
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      msg: resource.errorText.serverError,
    });
  }
});

//@route    GET api/auth/getUser
//@desc     Get logged-in user details
//@access   Private
router.get(resource.routes.getUser, tokenAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      msg: resource.errorText.serverError,
    });
  }
});

//@route    GET api/auth
//@desc     Endpoint for email verification
//@access   Public
router.get(resource.routes.verifyEmail, async (req, res) => {
  try {
    const token = req.params.token;

    // find user with the given token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ msg: "Invalid verification token" });
    }

    // mark user as verified
    user.verified = true;
    user.verificationToken = undefined;

    await user.save();
    res.status(200).json({ msg: "Email verified successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      msg: resource.errorText.serverError,
    });
  }
});

module.exports = router;

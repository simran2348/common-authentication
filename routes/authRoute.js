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

//@route    POST api/auth
//@desc     Register new user
//@access   Public
router.post(
  resource.routes.register,
  [
    check("name", resource.errorText.usernameCheck.check1).not().isEmpty(),
    check("email", resource.errorText.emailCheck).isEmail(),
    check("password", resource.errorText.passwordCheck).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({
          errors: [
            {
              msg: resource.errorText.userExists.text,
              errorCode: resource.errorText.userExists.code,
            },
          ],
        });
      }

      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

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
          user.verificationToken = token;
          res.json({
            msg: resource.successText.registrationSuccess.text,
            code: resource.successText.registrationSuccess.code,
            token,
          });
          sendVerificationEmail(user.email, user.verificationToken);
        }
      );
      await user.save();
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        msg: resource.errorText.serverError.text,
        code: resource.errorText.serverError.code,
      });
    }
  }
);

//@route    POST api/auth
//@desc     Check username
//@access   Public

//@route    POST api/auth
//@desc     Check email
//@access   Public

//@route    POST api/auth
//@desc     User Login
//@access   Public
router.post(
  resource.routes.login,
  [
    check("email", "Please add a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
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
            msg: resource.successText.loginSuccess.text,
            code: resource.successText.loginSuccess.code,
            token,
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        msg: resource.errorText.serverError.text,
        code: resource.errorText.serverError.code,
      });
    }
  }
);

//@route    POST api/auth
//@desc     Forget password
//@access   Public

//@route    GET api/getUser
//@desc     Get logged-in user details
//@access   Private
router.get(resource.routes.getUser, tokenAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      msg: resource.errorText.serverError.text,
      code: resource.errorText.serverError.code,
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
      msg: resource.errorText.serverError.text,
      code: resource.errorText.serverError.code,
    });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../schema/User");

const { check, validationResult } = require("express-validator");
const { resource } = require("../constant");

//@route    POST api/auth
//@desc     Register new user
//@access   Public
router.post(
  resource.routes.register,
  [
    check("username", resource.text.usernameCheck).not().isEmpty(),
    check("email", resource.text.emailCheck).isEmail(),
    check("password", resource.text.passwordCheck).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    try {
      let user = await User.findOne({ $or: [{ email }, { username }] });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: resource.text.userExists }] });
      }

      user = new User({
        username,
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
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send(resource.text.serverError);
    }
  }
);

module.exports = router;

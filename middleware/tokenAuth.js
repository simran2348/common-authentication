const jwt = require("jsonwebtoken");
const { resource } = require("../constant");
require("dotenv").config();

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({
      msg: resource.errorText.tokenError.noToken,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({
      msg: resource.errorText.tokenError.tokenNotValid,
    });
  }
};

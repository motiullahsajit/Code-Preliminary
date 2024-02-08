const User = require("../models/user");

const adminOnly = async (req, res, next) => {
  try {
    const { id } = req.query;

    if (!id)
      return res.status(401).json({
        success: false,
        message: "First login Please",
      });

    const user = await User.findById(id);

    if (!user)
      return res.status(401).json({
        success: false,
        message: "User doesn't exits",
      });

    if (user.role !== "admin")
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });

    next();
  } catch (e) {
    console.log("auth", e);
  }
};

module.exports = {
  adminOnly,
};

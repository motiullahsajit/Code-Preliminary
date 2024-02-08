const jwt = require("jsonwebtoken");
const User = require("../models/user");

const adminOnly = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not provided",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
        });
      }

      const { userRole } = decodedToken;

      if (userRole !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      next();
    });
  } catch (error) {
    console.error("adminOnly", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  adminOnly,
};

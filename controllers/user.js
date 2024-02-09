const User = require("../models/user");

const createUser = async (req, res) => {
  try {
    const { user_id, user_name, balance } = req.body;

    const newUser = new User({
      user_id,
      user_name,
      balance,
    });
    const { _id, __v, ...user } = newUser.toObject();

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createUser,
};

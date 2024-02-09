const User = require("../models/user");

const createUser = async (req, res) => {
  try {
    const { user_id, user_name, balance } = req.body;

    const balanceInt = parseInt(balance);
    const userIdInt = parseInt(user_id);

    if (isNaN(balanceInt) || isNaN(userIdInt)) {
      return res
        .status(400)
        .json({ message: "user_id and balance must be integers" });
    }

    const newUser = new User({
      user_id: userIdInt,
      user_name,
      balance: balanceInt,
    });

    await newUser.save();

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

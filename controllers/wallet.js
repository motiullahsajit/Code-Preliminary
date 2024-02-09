const User = require("../models/user");

const getWalletBalance = async (req, res) => {
  try {
    const walletId = req.params.wallet_id;

    const user = await User.findOne({ user_id: walletId });

    if (!user) {
      return res
        .status(404)
        .json({ message: `wallet with id: ${walletId} was not found` });
    }

    const response = {
      wallet_id: user.user_id,
      balance: user.balance,
      wallet_user: {
        user_id: user.user_id,
        user_name: user.user_name,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addWalletBalance = async (req, res) => {
  try {
    const walletId = req.params.wallet_id;
    const { recharge } = req.body;

    const user = await User.findOne({ user_id: walletId });

    if (!user) {
      return res
        .status(404)
        .json({ message: `wallet with id: ${walletId} was not found` });
    }

    if (recharge < 100 || recharge > 10000) {
      return res.status(400).json({ message: `invalid amount: ${recharge}` });
    }

    user.balance += recharge;

    await user.save();

    const response = {
      wallet_id: user.user_id,
      balance: user.balance,
      wallet_user: {
        user_id: user.user_id,
        user_name: user.user_name,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getWalletBalance,
  addWalletBalance,
};

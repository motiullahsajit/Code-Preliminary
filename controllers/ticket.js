const User = require("../models/user");
const Train = require("../models/train");
const Station = require("../models/station");

const purchaseTicket = async (req, res) => {
  try {
    const { wallet_id, time_after, station_from, station_to } = req.body;

    // Find user by wallet ID
    const user = await User.findOne({ user_id: wallet_id });

    // If user not found, return 404 error
    if (!user) {
      return res
        .status(404)
        .json({ message: `wallet with id: ${wallet_id} was not found` });
    }

    // Check if user has sufficient balance
    const ticketCost = await calculateTicketCost(station_from, station_to);
    if (user.balance < ticketCost) {
      const shortageAmount = ticketCost - user.balance;
      return res
        .status(402)
        .json({
          message: `recharge amount: ${shortageAmount} to purchase the ticket`,
        });
    }

    // Find route and trains for the journey
    const route = await findRoute(station_from, station_to, time_after);
    if (!route) {
      return res
        .status(403)
        .json({
          message: `no ticket available for station: ${station_from} to station: ${station_to}`,
        });
    }

    // Deduct ticket cost from user's balance
    user.balance -= ticketCost;
    await user.save();

    // Construct ticket object
    const ticket = {
      ticket_id: generateTicketID(),
      balance: user.balance,
      wallet_id: wallet_id,
      stations: route,
    };

    // Respond with ticket
    res.status(201).json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to calculate ticket cost based on stations
const calculateTicketCost = async (station_from, station_to) => {
  // Placeholder for calculating ticket cost based on fare between stations
  // You may implement this based on your specific logic or database structure
  // For simplicity, let's assume a fixed fare for each station pair
  // and return a hardcoded value
  return 200; // Example fare value
};

// Function to find route and trains for the journey
const findRoute = async (station_from, station_to, time_after) => {
  // Placeholder for finding route and trains for the journey
  // You may implement this based on your specific logic or database structure
  // For demonstration purposes, let's assume a fixed route and trains
  // and return a hardcoded value
  const route = [
    {
      station_id: station_from,
      train_id: 1,
      departure_time: "11:00",
      arrival_time: null,
    },
    {
      station_id: 3,
      train_id: 2,
      departure_time: "12:00",
      arrival_time: "11:55",
    },
    {
      station_id: station_to,
      train_id: 2,
      departure_time: null,
      arrival_time: "12:25",
    },
  ];
  return route;
};

// Function to generate a unique ticket ID (for demonstration purposes)
const generateTicketID = () => {
  return Math.floor(Math.random() * 1000) + 1;
};

module.exports = {
  purchaseTicket,
};

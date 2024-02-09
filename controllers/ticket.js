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
      return res.status(402).json({
        message: `recharge amount: ${shortageAmount} to purchase the ticket`,
      });
    }

    // Find route and trains for the journey
    const route = await findRoute(station_from, station_to, time_after);
    if (!route) {
      return res.status(403).json({
        message: `no ticket available for station: ${station_from} to station: ${station_to}`,
      });
    }

    // Deduct ticket cost from user's balance
    console.log("ticket cost from", ticketCost);
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

const calculateTicketCost = async (station_from, station_to) => {
  try {
    // Find the train with the specified stations
    const train = await Train.findOne({
      "stops.station_id": { $in: [station_from, station_to] },
    });

    if (!train) {
      throw new Error(
        `no ticket available for station: ${station_from} to station: ${station_to}`
      );
    }

    // Find the stops corresponding to the start and end stations
    const startStop = train.stops.find(
      (stop) => stop.station_id === station_from
    );
    const endStop = train.stops.find((stop) => stop.station_id === station_to);

    if (!startStop || !endStop) {
      throw new Error(
        `no ticket available for station: ${station_from} to station: ${station_to}`
      );
    }

    // Calculate the fare for the journey
    let totalFare = 0;
    const startIndex = train.stops.indexOf(startStop);
    const endIndex = train.stops.indexOf(endStop);
    for (
      let i = Math.min(startIndex, endIndex);
      i < Math.max(startIndex, endIndex);
      i++
    ) {
      totalFare += train.stops[i].fare;
    }

    return totalFare;
  } catch (error) {
    throw new Error(`Failed to calculate ticket cost: ${error.message}`);
  }
};

const findRoute = async (station_from, station_to, time_after) => {
  try {
    // Find the train with the specified stations and departure time after time_after
    const train = await Train.findOne({
      "stops.station_id": { $all: [station_from, station_to] },
      "stops.departure_time": { $gt: time_after },
    });

    if (!train) {
      throw new Error(
        `no ticket available for station: ${station_from} to station: ${station_to}`
      );
    }

    // Find the index of the start and end stations in the stops array
    const startIndex = train.stops.findIndex(
      (stop) => stop.station_id === station_from
    );
    const endIndex = train.stops.findIndex(
      (stop) => stop.station_id === station_to
    );

    if (startIndex === -1 || endIndex === -1) {
      throw new Error(
        `no ticket available for station: ${station_from} to station: ${station_to}`
      );
    }

    // Construct the route based on the found stops
    const route = train.stops.slice(
      Math.min(startIndex, endIndex),
      Math.max(startIndex, endIndex) + 1
    );

    return route;
  } catch (error) {
    throw new Error(`Failed to find route: ${error.message}`);
  }
};

// Function to generate a unique ticket ID (for demonstration purposes)
const generateTicketID = () => {
  return Math.floor(Math.random() * 1000) + 1;
};

module.exports = {
  purchaseTicket,
};

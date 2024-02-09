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
    const route = await findRoute(station_from, station_to, time_after);
    if (!route) {
      return res.status(403).json({
        message: `no ticket available for station: ${station_from} to station: ${station_to}`,
      });
    }

    user.balance -= ticketCost;
    await user.save();

    const ticket = {
      ticket_id: generateTicketID(),
      balance: user.balance,
      wallet_id: wallet_id,
      stations: route.map((stop) => ({
        station_id: stop.station_id,
        train_id: stop.train_id ? stop.train_id : null,
        departure_time: stop.departure_time,
        arrival_time: stop.arrival_time,
      })),
    };

    res.status(201).json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const calculateTicketCost = async (station_from, station_to) => {
  try {
    const train = await Train.findOne({
      "stops.station_id": { $in: [station_from, station_to] },
    });

    if (!train) {
      return res.status(403).json({
        message: `no ticket available for station: ${station_from} to station: ${station_to}`,
      });
    }

    const startStop = train.stops.find(
      (stop) => stop.station_id === station_from
    );
    const endStop = train.stops.find((stop) => stop.station_id === station_to);

    if (!startStop || !endStop) {
      return res.status(403).json({
        message: `no ticket available for station: ${station_from} to station: ${station_to}`,
      });
    }

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
    const train = await Train.findOne({
      "stops.station_id": { $all: [station_from, station_to] },
      "stops.departure_time": { $gt: time_after },
    });

    if (!train) {
      return res.status(403).json({
        message: `no ticket available for station: ${station_from} to station: ${station_to}`,
      });
    }

    const startIndex = train.stops.findIndex(
      (stop) => stop.station_id === station_from
    );
    const endIndex = train.stops.findIndex(
      (stop) => stop.station_id === station_to
    );

    if (startIndex === -1 || endIndex === -1) {
      return res.status(403).json({
        message: `no ticket available for station: ${station_from} to station: ${station_to}`,
      });
    }

    const route = train.stops
      .slice(Math.min(startIndex, endIndex), Math.max(startIndex, endIndex) + 1)
      .map((stop, index) => {
        return {
          station_id: stop.station_id,
          train_id: train.train_id,
          departure_time: index === 0 ? stop.departure_time : null,
          arrival_time: index === 0 ? null : stop.arrival_time,
        };
      });

    return route;
  } catch (error) {
    throw new Error(`Failed to find route: ${error.message}`);
  }
};

const generateTicketID = () => {
  return Math.floor(Math.random() * 1000) + 1;
};

module.exports = {
  purchaseTicket,
};

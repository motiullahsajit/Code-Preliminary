const Train = require("../models/train");

const createTrain = async (req, res) => {
  try {
    const { train_id, train_name, capacity, stops } = req.body;

    if (
      !Number.isInteger(train_id) ||
      typeof train_name !== "string" ||
      !Number.isInteger(capacity) ||
      !Array.isArray(stops) ||
      stops.some(
        (stop) =>
          !Number.isInteger(stop.station_id) ||
          (stop.arrival_time !== null &&
            typeof stop.arrival_time !== "string") ||
          (stop.departure_time !== null &&
            typeof stop.departure_time !== "string") ||
          !Number.isFinite(stop.fare)
      )
    ) {
      return res.status(400).json({ message: "Invalid data types" });
    }

    const newTrain = new Train({
      train_id,
      train_name,
      capacity,
      stops,
    });

    const serviceStart = stops[0].departure_time;
    const serviceEnd = stops[stops.length - 1].arrival_time;

    const numStations = stops.length;

    await newTrain.save();

    res.status(201).json({
      train_id,
      train_name,
      capacity,
      service_start: serviceStart,
      service_ends: serviceEnd,
      num_stations: numStations,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createTrain,
};

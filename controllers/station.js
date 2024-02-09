const Station = require("../models/station");

const createStation = async (req, res) => {
  try {
    const { station_id, station_name, longitude, latitude } = req.body;

    if (
      Number.isInteger(station_id) === false ||
      typeof longitude !== "number" ||
      typeof latitude !== "number"
    ) {
      return res
        .status(400)
        .json({
          message: "Invalid data types for station_id, longitude, or latitude",
        });
    }

    const newStation = new Station({
      station_id,
      station_name,
      longitude,
      latitude,
    });

    await newStation.save();

    const { _id, __v, ...station } = newStation.toObject();

    res.status(201).json(station);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createStation,
};

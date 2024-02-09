const Station = require("../models/station");

const createStation = async (req, res) => {
  try {
    const { station_id, station_name, longitude, latitude } = req.body;

    const stationIdInt = parseInt(station_id);

    if (
      isNaN(stationIdInt) ||
      typeof longitude !== "number" ||
      typeof latitude !== "number"
    ) {
      return res.status(400).json({
        message: "Invalid data types for station_id, longitude, or latitude",
      });
    }

    const newStation = new Station({
      station_id: stationIdInt,
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

const listAllStations = async (req, res) => {
  try {
    // Fetch all stations from the database
    const stations = await Station.find().sort({ station_id: 1 });

    // Prepare the response model
    const response = {
      stations: stations.map((station) => ({
        station_id: station.station_id,
        station_name: station.station_name,
        longitude: station.longitude,
        latitude: station.latitude,
      })),
    };

    // Respond with the list of stations and status 200
    res.status(200).json(response);
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createStation,
  listAllStations,
};

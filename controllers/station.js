const Station = require("../models/station");
const Train = require("../models/train");

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
    const stations = await Station.find().sort({ station_id: 1 });

    const response = {
      stations: stations.map((station) => ({
        station_id: station.station_id,
        station_name: station.station_name,
        longitude: station.longitude,
        latitude: station.latitude,
      })),
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const listTrainsAtStation = async (req, res) => {
  try {
    const { station_id } = req.params;

    const station = await Station.findOne({ station_id });

    if (!station) {
      return res.status(404).json({
        message: `Station with id: ${station_id} was not found`,
      });
    }

    const trains = await Train.find({ "stops.station_id": station_id });

    const responseTrains = trains.map((train) => ({
      train_id: train.train_id,
      arrival_time: getArrivalTime(train, station_id),
      departure_time: getDepartureTime(train, station_id),
    }));

    responseTrains.sort(
      (a, b) =>
        compareTimes(a.departure_time, b.departure_time) ||
        compareTimes(a.arrival_time, b.arrival_time) ||
        a.train_id - b.train_id
    );

    res.status(200).json({ station_id: station_id, trains: responseTrains });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const compareTimes = (timeA, timeB) => {
  if (!timeA && !timeB) return 0;
  if (!timeA) return -1;
  if (!timeB) return 1;
  return timeA.localeCompare(timeB);
};

const getArrivalTime = (train, stationId) => {
  const stop = train.stops.find((stop) => stop.station_id == stationId);
  return stop ? stop.arrival_time : null;
};

const getDepartureTime = (train, stationId) => {
  const stop = train.stops.find((stop) => stop.station_id == stationId);
  return stop ? stop.departure_time : null;
};

module.exports = {
  createStation,
  listAllStations,
  listTrainsAtStation,
};

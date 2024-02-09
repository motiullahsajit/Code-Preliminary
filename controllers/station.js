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
    const stationId = req.params.station_id;

    const trains = await Train.find({ "stops.station_id": stationId });

    if (!trains || trains.length === 0) {
      return res.status(200).json({ station_id: stationId, trains: [] });
    }

    trains.sort((a, b) => {
      const aStop = a.stops.find((stop) => stop.station_id === stationId);
      const bStop = b.stops.find((stop) => stop.station_id === stationId);

      if (!aStop && !bStop) {
        return 0;
      }

      if (!aStop) {
        return 1;
      }

      if (!bStop) {
        return -1;
      }

      if (aStop.departure_time === null && bStop.departure_time !== null) {
        return -1;
      } else if (
        aStop.departure_time !== null &&
        bStop.departure_time === null
      ) {
        return 1;
      } else if (
        aStop.departure_time !== null &&
        bStop.departure_time !== null
      ) {
        const departureTimeComparison = aStop.departure_time.localeCompare(
          bStop.departure_time
        );
        if (departureTimeComparison !== 0) {
          return departureTimeComparison;
        }
      }

      if (aStop.arrival_time === null && bStop.arrival_time !== null) {
        return -1;
      } else if (aStop.arrival_time !== null && bStop.arrival_time === null) {
        return 1;
      } else if (aStop.arrival_time !== null && bStop.arrival_time !== null) {
        const arrivalTimeComparison = aStop.arrival_time.localeCompare(
          bStop.arrival_time
        );
        if (arrivalTimeComparison !== 0) {
          return arrivalTimeComparison;
        }
      }

      return a.train_id - b.train_id;
    });

    const response = {
      station_id: stationId,
      trains: trains.map((train) => {
        const stop = train.stops.find((stop) => stop.station_id == stationId);

        return {
          train_id: train.train_id,
          arrival_time: stop ? stop.arrival_time : null,
          departure_time: stop ? stop.departure_time : null,
        };
      }),
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createStation,
  listAllStations,
  listTrainsAtStation,
};

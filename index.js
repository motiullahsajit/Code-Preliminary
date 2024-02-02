const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();

const dbUrl = process.env.MONGODB_URI;
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

app.get("/", (req, res) => {
  res.send("Hello, Docker with MongoDB sajit!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

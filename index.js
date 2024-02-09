const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
app.use(require("cors")());
const dotenv = require("dotenv");
dotenv.config();

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
  res.send("Hello, From UNTITLED ^_^!");
});

app.use(require("./index.routes"));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

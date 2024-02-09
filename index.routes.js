const router = require("express").Router();

router.use("/api/users", require("./routes/user"));
router.use("/api/stations", require("./routes/station"));
router.use("/api/trains", require("./routes/train"));

module.exports = router;

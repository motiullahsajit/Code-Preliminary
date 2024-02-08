const router = require("express").Router();

router.use("/api/user", require("./routes/user"));
router.use("/api/books", require("./routes/book"));

module.exports = router;

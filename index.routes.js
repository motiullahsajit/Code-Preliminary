const router = require("express").Router();

router.use("/user", require("./routes/user"));
router.use("/api/books", require("./routes/book"));

module.exports = router;

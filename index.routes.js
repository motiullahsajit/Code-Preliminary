const router = require("express").Router();

router.use("/api/users", require("./routes/user"));

module.exports = router;

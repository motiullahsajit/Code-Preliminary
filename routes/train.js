const router = require("express").Router();
const C = require("../controllers/train");

router.post("/", C.createTrain);

module.exports = router;

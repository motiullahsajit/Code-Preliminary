const router = require("express").Router();
const C = require("../controllers/station");

router.post("/", C.createStation);

module.exports = router;

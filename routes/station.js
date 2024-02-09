const router = require("express").Router();
const C = require("../controllers/station");

router.post("/", C.createStation);
router.get("/", C.listAllStations);
router.get("/:station_id/trains", C.listTrainsAtStation);

module.exports = router;

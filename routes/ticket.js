const router = require("express").Router();
const C = require("../controllers/ticket");

router.post("/", C.purchaseTicket);

module.exports = router;

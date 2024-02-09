const router = require("express").Router();
const C = require("../controllers/wallet");

router.get("/:wallet_id", C.getWalletBalance);
router.put("/:wallet_id", C.addWalletBalance);

module.exports = router;

const router = require("express").Router();
const C = require("../controllers/user");

router.post("/", C.createUser);

module.exports = router;

const router = require("express").Router();
const C = require("../controllers/user");

router.post("/", C.createUser);
// router.get("/", C.getAllUsers);

module.exports = router;

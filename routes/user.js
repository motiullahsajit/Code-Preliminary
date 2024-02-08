const router = require("express").Router();
const C = require("../controllers/user");

router.post("/create", C.createUser);
router.get("/all", C.getAllUsers);
router.post("/login", C.login);

module.exports = router;

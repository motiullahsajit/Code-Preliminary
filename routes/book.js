const express = require("express");
const router = express.Router();
const C = require("../controllers/book");

router.post("/", C.addBook);
router.get("/", C.searchBooks);
router.put("/:id", C.updateBook);
router.get("/:id", C.getBookById);

module.exports = router;

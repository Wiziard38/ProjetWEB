const express = require("express");
const router = express.Router();
const user = require("../controllers/user.js");

router.post("/login", user.login);
router.post("/signin", user.signin);

module.exports = router;

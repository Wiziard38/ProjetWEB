const express = require("express");
const router = express.Router();
const user = require("../controllers/user.js");
const auth = require("../middleware/auth");

router.post("/login", user.login);
router.post("/signin", user.signin);
router.get("/whoami", auth, user.whoami);

module.exports = router;

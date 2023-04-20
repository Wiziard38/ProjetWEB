const express = require("express");
const router = express.Router();
const partie = require("../controllers/partie.js");
const auth = require("../middleware/auth");

router.post("/partie", auth, partie.creerPartie);
router.get("/partie", auth, partie.listParties);

module.exports = router;

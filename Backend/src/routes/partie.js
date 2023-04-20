const express = require("express");
const router = express.Router();
const partie = require("../controllers/partie.js");

router.post("/partie", partie.creerPartie);
router.get("/partie", partie.listParties);

module.exports = router;

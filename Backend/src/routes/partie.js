const express = require("express");
const router = express.Router();
const partie = require("../controllers/partie.js");

router.post("/partie", partie.creerPartie);
module.exports = router;

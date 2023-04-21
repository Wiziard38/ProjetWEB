const express = require("express");
const router = express.Router();
const game = require("../controllers/game.js");

router.post("/game", game.createGame);
router.get("/game", game.listMyGames);
router.get("/game/newgame", game.listNewGamesAvailable);
router.post("/game/newgame/:idGame", game.joinNewGame);

module.exports = router;
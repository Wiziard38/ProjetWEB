const express = require("express");
const router = express.Router();
const game = require("../controllers/game.js");
const auth = require("../middleware/auth");

router.post("/game", auth, game.createGame);
router.get("/game", auth, game.listMyGames);
router.get("/game/newgame", auth, game.listNewGamesAvailable);
router.post("/game/newgame/:idGame", auth, game.joinNewGame);

module.exports = router;
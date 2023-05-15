const express = require("express");
const router = express.Router();
const game = require("../controllers/game.js");
const auth = require("../middleware/auth");

router.post("/game", auth, game.createGame);
router.get("/game", auth, game.listMyGames);
router.get("/game/newgame", auth, game.listNewGamesAvailable);
router.post("/game/newgame/:idGame", auth, game.joinNewGame);
router.get("/game/playerVote/:idGame", auth, game.listAllPlayerVote);
router.get("/game/listRatification/:idGame", auth, game.listRatification);
router.delete("/game/:idGame", auth, game.deleteGame);
module.exports = router;
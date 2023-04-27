const io = require('../../ws/websockets');
const GameManager = require("../GameManager");
const Game = require("../Game.js")
const State = require("./State");

class Alive extends State {

    sendMessage(msg, /** @type {Game} */ game ) {
        // const gameState = GameManager.states.get(game);
        if (game.isDay()) {
            io.of(game.getNamespace()).emit("receive_msg", msg);
            return true;
        } else {
            return false;
        }
    }
}

module.exports = Alive;
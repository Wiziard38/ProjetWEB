const GameManager = require("../GameManager");
const GameState = require("../GameState.js");
const io = require('../ws/websockets.js');
const Alive = require("./Alive");

class Human extends Alive {

    sendMessage(msg, game) {
        const gameState = GameManager.states.get(game);
        if(gameState === GameState.DAY) {
            io.of('/' + game).emit("receive_msg", msg);
            return true;
        } else {
            return false;
        }
    }
}
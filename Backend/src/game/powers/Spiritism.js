const GameManager = require("../GameManager");
const GameState = require("../GameState.js");
const io = require('../ws/websockets.js');
const Room = require('../Room.js');
const Power = require('./Power.js');

class Spiritism extends Power {
    sendMessage(msg, game) {
        const gameState = GameManager.states.get(game);
        if(gameState === GameState.NIGHT) {
            io.of('/' + game).to(Room.ELECTED).to(Room.SPIRITISM).emit("receive_msg", mes);
            return true;
        } else {
            return false;
        }
    }
}
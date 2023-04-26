const GameManager = require("../GameManager");
const GameState = require("../GameState.js");
const io = require('../ws/websockets.js');
const Alive = require("./Alive");

class Human extends Alive {

    sendMessage(msg, game) {
        super.sendMessage(msg, game);
    }
}
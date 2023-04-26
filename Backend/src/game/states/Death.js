const GameManager = require("../GameManager");
const GameState = require("../GameState.js");
const io = require('../ws/websockets.js');
const State = require("./State");

class Death extends State {
    #elected = false;

    sendMessage() {
        const gameState = GameManager.states.get(game);
        if(this.#elected && gameState === GameState.NIGHT) {
            io.of('/' + game).to(Room.ELECTED).to(Room.SPIRITISM).emit("receive_msg", mes);
        }
    }

    toElect() {
        // put the associated socket to the room
        this.#elected = true;
    }

    unElect() {
        // Remove the associate socket from the room
        this.#elected = false;
    }
}
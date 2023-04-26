const GameManager = require("../GameManager");

const State = require("./State");

class Alive extends State {

    sendMessage(msg, game) {
        const gameState = GameManager.states.get(game);
        if (GameManager.isDay()) {
            io.of('/' + game).emit("receive_msg", msg);
            return true;
        } else {
            return false;
        }
    }
}

module.exports = Alive;
const io = require('../../ws/websockets');
const States = require("../States");
const Powers = require('../Powers');
const State = require("./State");
const Game = require('../Game');

class Death extends State {
    sendMessage(msg, /** @type {Game} */ game) {
        // Moyen de trouver le joueur élu ?
        if(game.isNight()) {
            io.of('/' + game).to("Room.ELECTED").to(Powers.SPIRITISM.toString()).emit("receive_msg", mes);
        }
    }
}

module.exports = Death;
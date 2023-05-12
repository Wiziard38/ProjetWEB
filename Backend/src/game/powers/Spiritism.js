const io = require('../../ws/websockets');
const States = require("../States");
const Powers = require('../Powers');
const Power = require('./Power.js');
const Game = require('../Game');

class Spiritism extends Power {

    sendMessageNight(msg, /** @type {Game} */ game, username) {
        io.of('/' + game).to("Room.ELECTED").to(Powers.SPIRITISM.toString()).emit("receive_msg", msg, username);
        return true;
    }
}

module.exports = Spiritism;
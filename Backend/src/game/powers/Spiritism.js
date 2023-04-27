const io = require('../../ws/websockets');
const States = require("../States");
const Powers = require('../Powers');
const Power = require('./Power.js');
const Game = require('../Game');

class Spiritism extends Power {
    sendMessage(msg, /** @type {Game} */game) {
        if(game.isNight()) {
            io.of('/' + game).to("Room.ELECTED").to(Powers.SPIRITISM.toString()).emit("receive_msg", mes);
            return true;
        } else {
            return false;
        }
    }
}

module.exports = Spiritism;
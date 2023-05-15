const io = require('../../ws/websockets');
const States = require("../States");
const Powers = require('../Powers');
const Alive = require("./Alive");

class Human extends Alive {

    sendMessage(msg, game) {
        super.sendMessage(msg, game);
    }
    
}

module.exports = Human;
const io = require('../../ws/websockets');
const States = require("../States");
const Power = require('./Power.js');
const Game = require('../Game');
const messages = require('../../models/messages');

class Spiritism extends Power {
    
    async sendMessageNight(msg, /** @type {Game} */ game, username, player) {
        const Powers = require('../Powers');
        io.of('/' + game).to("Room.ELECTED").to(Powers.SPIRITISM.toString()).emit("receive_msg", msg, username);

        const { idDiscussion } = await discussions.findOne({
            attributes: ["idDiscussion"],
            where: { date: game.getSwitchTime(), typeDiscussion: "spiritisme" },
            raw: true
          });
      
          await messages.create({
            contenu: msg,
            discussionIdDiscussion: idDiscussion,
            usersgameIdUsergame: player.getID()
          });
        return true;
    }
}

module.exports = Spiritism;
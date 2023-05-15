const io = require('../../ws/websockets');
const States = require("../States");
const State = require("./State");
const Game = require('../Game');
const messages = require('../../models/messages');

class Death extends State {
  // sendMessage(msg, /** @type {Game} */ game) {
  //     // Moyen de trouver le joueur élu ?
  //     if(game.isNight()) {
  //         io.of('/' + game).to("Room.ELECTED").to(Powers.SPIRITISM.toString()).emit("receive_msg", mes);
  //     }
  // }

  sendMessageDay(msg, /** @type {Game} */ game, username, player) {
    return false;
  }

  async sendMessageNight(msg, /** @type {Game} */ game, username, player) {
    if (game.getElectedPlayer() === username) {
      const Powers = require('../Powers');
      io.of('/' + game).to("Room.ELECTED").to(Powers.SPIRITISM.toString()).emit("receive_msg", mes);
      
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
    } else {
      return false;
    }
  }

}

module.exports = Death;
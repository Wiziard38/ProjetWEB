const io = require('../../ws/websockets');
const Alive = require("./Alive");
const Game = require("../Game");
const discussions = require('../../models/discussions');
const messages = require('../../models/messages');

class Werewolf extends Alive {
  // sendMessage(msg, /** @type {Game}*/game) {
  //     if(super.sendMessage(msg, game) === false) {
  //     if (game.isNight()){
  //             io.of(game.getNamespace()).to(States.WEREWOLF.toString()).to(Powers.INSOMNIA.toString()).emit("receive_msg", mes);
  //             return true;
  //         } else {
  //             // État invalide ?
  //             console.log("[Werewolf.js] sendMessage : Error");
  //             return false;
  //         }

  //     }
  // }
  async sendMessageNight(msg, /** @type {Game} */ game, userName, player) {
    const States = require("../States");
    const Powers = require('../Powers');
    io.of(game.getNamespace()).to(States.WEREWOLF.toString()).to(Powers.INSOMNIA.toString()).to(States.DEATH.toString()).emit("receive_msg", msg, userName);

    const { idDiscussion } = await discussions.findOne({
      attributes: ["idDiscussion"],
      where: { date: game.getSwitchTime(), typeDiscussion: "repaire" },
      raw: true
    });

    await messages.create({
      contenu: msg,
      discussionIdDiscussion: idDiscussion,
      usersgameIdUsergame: player.getID()
    })

    return true;
  }
}

module.exports = Werewolf;
const io = require('../../ws/websockets');
const Alive = require("./Alive");
const Game = require("../Game");

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
  sendMessageNight(msg, /** @type {Game} */ game, userName) {
    const States = require("../States");
    const Powers = require('../Powers');
    io.of(game.getNamespace()).to(States.WEREWOLF.toString()).to(Powers.INSOMNIA.toString()).emit("receive_msg", msg, userName);
    return true;
  }
}

module.exports = Werewolf;
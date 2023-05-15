const io = require('../../ws/websockets');
const GameManager = require("../GameManager");
const Game = require("../Game.js")
const State = require("./State");
const discussions = require('../../models/discussions');
const messages = require('../../models/messages');

class Alive extends State {

    // sendMessage(msg, /** @type {Game} */ game ) {
    //     // const gameState = GameManager.states.get(game);
    //     if (game.isDay()) {
    //         io.of(game.getNamespace()).emit("receive_msg", msg);
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    async sendMessageDay(msg, /** @type {Game} */ game, userName, player) {
        // console.log("[State.js] sendMessageDay : Error");
        io.of(game.getNamespace()).emit("receive_msg", msg, userName);

        const { idDiscussion } = await discussions.findOne({
            attributes: ["idDiscussion"],
            where: { date: game.getSwitchTime() },
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

module.exports = Alive;
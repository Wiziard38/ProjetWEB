const State = require("./states/State.js");

AbstractGameState = require("./AbstractGameState.js");

class DayState extends AbstractGameState {
    async sendMessage(player, msg) {
        player.sendMessageDay(msg);
    }

    async vote(game, player, usernameVote) {
        player.voteJour(game, usernameVote);
    }

    async ratif(game, player, usernameVote) {
        player.ratifJour(game, usernameVote);
    }
}
module.exports = DayState;
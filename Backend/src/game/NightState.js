AbstractGameState = require("./AbstractGameState.js");

class NightState extends AbstractGameState {
    async sendMessage(player, msg) {
        player.sendMessageNight(msg);
    }

    async vote(game, player, usernameVote) {
        player.voteNuit(game, usernameVote);
    }
    async ratif(game, player, usernameVote) {
        player.ratifNuit(game, usernameVote);
    }
}

module.exports = NightState;
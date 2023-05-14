AbstractGameState = require("./AbstractGameState.js");

class NightState extends AbstractGameState {
    async sendMessage(player, msg) {
        player.sendMessageNight(msg);
    }
}

module.exports = NightState;
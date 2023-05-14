AbstractGameState = require("./AbstractGameState.js");

class NightState extends AbstractGameState {
    sendMessage(player, msg) {
        player.sendMessageNight(msg);
    }
}

module.exports = NightState;
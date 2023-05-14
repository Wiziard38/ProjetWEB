AbstractGameState = require("./AbstractGameState.js");

class DayState extends AbstractGameState {
    async sendMessage(player, msg) {
        player.sendMessageDay(msg);
    }
}
module.exports = DayState;
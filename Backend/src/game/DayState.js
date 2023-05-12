AbstractGameState = require("./AbstractGameState.js");

class DayState extends AbstractGameState {
    sendMessage(player, msg) {
        player.sendMessageDay(msg);
    }
}
module.exports = DayState;
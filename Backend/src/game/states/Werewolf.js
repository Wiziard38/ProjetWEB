const GameManager = require("../GameManager");
const GameState = require("../GameState.js");
const io = require('../ws/websockets.js');
const Alive = require("./Alive");

class Werewolf extends Alive {
    sendMessage(msg, game) {
        const gameState = GameManager.states.get(game);
        if(gameState === GameState.DAY) {
            io.of('/' + game).emit("receive_msg", msg);
            return true;
        } else if (gameState === GameState.NIGHT){
            io.of('/' + game).to(Team.WEREWOLF).to(Room.INSOMNIA).to(Room.CONTAMINATION).emit("receive_msg", mes);
            return true;
        } else {
            // État invalide ?
            console.log("[Werewolf.js] sendMessage : Error");
            return false;
        }
    }
}
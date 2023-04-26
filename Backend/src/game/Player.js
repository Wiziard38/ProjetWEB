const usersgamesModel = require("../models/usersgames");

class Player {

    #state; // Human, Death, Werewolf
    #power;
    #game;
    #socket;
    #userName;

    constructor() {

    }

    proposerVote(username) {

    }
    sendMessage(msg) {
        // Send a message based on power, if the player have no power, send a message according to team
        // Example : Spiritism will return false on day and true on nigth
        if(this.#power.sendMessage(msg, game, socket) === false) {
            if(this.#state.sendMessage(msg, game, socket) === false) {
                this.#socket.emit("receive_msg", "[Server] You can't send message for now...");
            };
        }
    }
}
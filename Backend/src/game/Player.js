const Game = require("./Game.js");
const Power = require("./powers/Power.js");
const State = require("./states/State.js")
const Team = require("./States.js");

class Player {
    /** @type {State} */
    #state; // Human, Death, Werewolf
    /** @type {Power} */
    #power;
    /** @type {Game} */
    #game;
    #socketID;
    #userName;

    constructor(socketID, username, game, state, power) {
        this.#socketID = socketID;
        this.#userName = username;
        this.#game = game;
        this.#state = state;
        this.#power = power;
    }
    // sendMessage(msg) {
    //     // Send a message based on power, if the player have no power, send a message according to team
    //     // Example : Spiritism will return false on day and true on nigth
    //     if(this.#power.sendMessage(msg, this.#game) === false) {
    //         if(this.#state.sendMessage(msg, this.#game) === false) {
                
    //             this.#game.getSocket(this.#socketID).emit("receive_msg", "[Server] You can't send message for now...");
    //         };
    //     }
    // }

    sendMessageDay(msg) {
        this.#state.sendMessageDay(msg, this.#game, this.#userName);
    }

    sendMessageNight(msg) {
        if(this.#state.sendMessageNight(msg, this.#game, this.#userName) === false) {
            if(this.#power.sendMessageNight(msg, this.#game, this.#userName) === false) {
                this.#game.getSocket(this.#socketID).emit("receive_msg", "[Server] You cannot send message for now...", "Server");
            }
        }
    }

    getUsername() {
        return this.#userName;
    }

    getState() {
        return this.#state;
    }

    getPower() {
        return this.#power;
    }
}

module.exports = Player;
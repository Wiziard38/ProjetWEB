const Game = require("./Game.js");
const Power = require("./powers/Power.js");
const State = require("./states/State.js")
const Team = require("./States.js");
const messages = require("../models/messages.js");
const discussions = require("../models/discussions.js");

class Player {
  /** @type {State} */
  #state; // Human, Death, Werewolf
  /** @type {Power} */
  #power;
  /** @type {Game} */
  #game;
  #socketID;
  #userName;
  #userGameID

  constructor(socketID, username, game, state, power, userGameID) {
    this.#socketID = socketID;
    this.#userName = username;
    this.#game = game;
    this.#state = state;
    this.#power = power;
    this.#userGameID = userGameID;
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

  async sendMessageDay(msg) {
    console.log(this.#state.toString())
    if (this.#state.sendMessageDay(msg, this.#game, this.#userName, this) === false) {
      this.#game.getSocket(this.#socketID).emit("receive_msg", "[Server] You cannot send message...", "Server");
    } else {
      // await messages.create( {
      //   contenu: mes,
      //   usersgameIdUsergame: -1,
      //   discussionIdDiscussion: -1
      // });
    }
  }

  async sendMessageNight(msg) {
    //First try to send the message with the player state
    if (this.#state.sendMessageNight(msg, this.#game, this.#userName, this) === false) {
      if (this.#power.sendMessageNight(msg, this.#game, this.#userName, this) === false) {
        this.#game.getSocket(this.#socketID).emit("receive_msg", "[Server] You cannot send message for now...", "Server");
        
      } else {
        // MSG from power

      }
    } else {
      // MSG from state

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

  getID() {
    return this.#userGameID;
  }

  getSocketId() {
    return this.#socketID;
  }

  async voteJour(game, usernameVote) {
      this.#state.voteJour(game, usernameVote, this);
  }

  async voteNuit(game, usernameVote) { {
      this.#state.voteNuit(game, usernameVote, this);
    }
  }

  async ratifJour(game, usernameVote) {
      this.#state.ratifJour(game, usernameVote, this);
  }

  async ratifNuit(game, usernameVote) {
    this.#state.ratifNuit(game, usernameVote, this);
}
}
module.exports = Player;
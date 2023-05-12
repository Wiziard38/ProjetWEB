const GameState = require("./GameState");
const io = require('../ws/websockets.js');
const AbstractGameState = require("./AbstractGameState");
const Player = require("./Player");


class Game {
  #gameState;
  #loopID;
  #gameID;
  #beginTime = 1000;
  #dayDuration = 15000;
  #nightDuration = 15000;
  #namespace;
  #electedPlayer;

  #playerDir = new Map(); // Link socketID to player object
  #socketDir = new Map(); // Link username to socketID

  constructor(gameID) {
    this.#gameID = gameID;
    this.#namespace = '/' + gameID;
  }

  /**
   * Link the socket to the user and user to socket
   * @param {*} player 
   * @param {*} socketID 
   */
  addPlayer(player, socketID) {
    this.#playerDir.set(socketID, player);
    this.#socketDir.set(player.getUsername(), socketID);
  }

  userAlreadyRegistred(username) {
    return this.#socketDir.get(username) !== undefined;
  }
  /**
   * 
   * @param {*} socketID 
   * @returns the player object corresponding to the socket
   */
  getPlayerBySocket(socketID) {
    return this.#playerDir.get(socketID);
  }

  /**
   * @returns true if the current state is day, else false
   */
  isDay() {
    return this.#gameState === GameState.DAY;
  }

  /**
   * @returns true if the current state is night, else false
   */
  isNight() {
    return this.#gameState === GameState.NIGHT;
  }

  create() {
    const initNamespace = require('./Namespace');
    initNamespace(this);
    setTimeout(() => {
      this.begin();
    }, this.#beginTime);
  }

  /**
   * Begin of the game, this start the game loop.
   */
  begin() {
    this.gameLoop()
    // The first loop is called after the wait time
    this.#loopID = setInterval(() => this.gameLoop(), this.#dayDuration + this.#nightDuration);
  }

  /**
   * Gameloop, day/night cycle
   */
  gameLoop() {
    this.dayChange();

    setTimeout(() => {
      this.nightChange();
    }, this.#dayDuration);
  }

  /**
   * End the game and close all connections
   */
  finish() {
    clearInterval(this.#loopID);
    io.of('/' + this.#gameID).removeAllListeners();
    // delete
    delete io.npst[this.#gameID];
    //GameState.remove(this.#gameID);
    // TODO remove from gamemanager
  }

  /**
   * Change the game to day
   */
  dayChange() {
    this.#gameState = GameState.DAY;
    io.of(this.#namespace).emit('day', 'nuit -> jour');
    // io.of(this.#namespace).emit('receive_msg', 'message de test', "test");
  }

  /**
   * Change the game to night
   */
  nightChange() {
    this.#gameState = GameState.NIGHT;
    io.of(this.#namespace).emit('night', 'jour -> nuit');
  }


  /**
   * Send to the player the current state of the game
   * @param {*} socketID 
   */
  getGameData(socketID) {
    //Send to the player game data
  }

  /**
   * Assing the player to its room(s)
   * @param {*} socketID 
   */
  setPlayerRoom(socketID) {
    const player = this.getPlayerBySocket(socketID);
    const power = player.getPower();
    const state = player.getState();
    const socket = io.of(this.#namespace).sockets.get(socketID);

    if (socket) {
      //TODO changer cela pour prendre en compte le vrai "Power"
      if (power.toString() !== "none") {
        socket.join(power.toString());
      }
      socket.join(state.toString());
    } else {
      console.log("[Game.js] setPlayerRoom : SocketID Invalid")
    }
  }

  /**
   * @returns the game's namespace
   */
  getNamespace() {
    return this.#namespace;
  }

  /**
   * @param {*} socketID 
   * @returns socket object with the socket id
   */
  getSocket(socketID) {
    return io.of(this.#namespace).sockets.get(socketID);
  }

  /**
   * @returns the current game's id
   */
  getID() {
    return this.#gameID;
  }
  
  /** @return {AbstractGameState} */
  getGameState() {
    return this.#gameState;
  }

  /**
   * @returns the name of the elected player
   */
  getElectedPlayer() {
    return this.#electedPlayer;
  }

  cleanSocket(socketid) {
    /** @type {Player} */
    const p = this.#playerDir.get(socketid);
    const name = p.getUsername();
    this.#playerDir.delete(socketid);
    this.#socketDir.delete(name);
  }
}

module.exports = Game;
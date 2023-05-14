const GameState = require("./GameState");
const gamesModel = require("../models/games");
const usersgamesModel = require("../models/usersgames.js");
const etatsModel = require("../models/etats.js");
const vivantsModel = require("../models/vivants.js");
const io = require('../ws/websockets.js');
const AbstractGameState = require("./AbstractGameState");
const Player = require("./Player");

class Game {
  #gameID;
  #nbPlayersRequired;
  #beginTime; // durée avant le début de la partie en milliseconde
  #dayDuration; // en milliseconde
  #nightDuration; // en milliseconde
  #probaPower;
  #probaWerewolf;
  #loopID;
  #namespace;
  #gameState;  
  #electedPlayer;
  #playerDir = new Map(); // Link socketID to player object
  #socketDir = new Map(); // Link username to socketID

  /* constructeur d'une partie - initialisation des champs */
  constructor(id, nbJoueur, dureeJour, dureeNuit, dateDeb, probaPouv, probaLoup) {
    console.log("constructor");
    this.#gameID = id;
    this.#nbPlayersRequired = nbJoueur;
    this.#beginTime = dateDeb - new Date();
    this.#dayDuration = dureeJour * 1000;
    this.#nightDuration = dureeNuit * 1000;
    this.#probaPower = probaPouv;
    this.#probaWerewolf = probaLoup;
    this.#namespace = '/' + id;
    this.create();
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
    console.log("create")
    const initNamespace = require('./Namespace');
    initNamespace(this);
    setTimeout(() => {
      this.begin();
    }, this.#beginTime);
  }

  /**
   * Begin of the game, this start the game loop.
   */
  async begin() {
    console.log("begin");
    const nbPlayersRegistered = await usersgamesModel.count({ where: {gameIdGame:this.#gameID} });
    // la partie est lancée si le nombre de joueurs requis est atteint
    console.log("nombre de joueurs requis: " + this.#nbPlayersRequired);
    console.log("nombre de joueurs inscrits: " + nbPlayersRegistered);
    if (nbPlayersRegistered != this.#nbPlayersRequired) {
      // la partie est annulée
      await gamesModel.update({ statusGame: 'annulee'}, { where: {idGame: this.#gameID}});
      // TODO: émettre un message aux joueurs de la partie connectés pour dire que la partie est annulée
    } else {
      await gamesModel.update({ statusGame: 'enCours'}, { where: {idGame: this.#gameID}});
      this.init();
      this.#gameState = GameState.DAY;
      this.gameLoop();
      // The first loop is called after the wait time
      this.#loopID = setInterval(() => this.gameLoop(), this.#dayDuration + this.#nightDuration);
    }
  }

  /* initialise les données de la partie qui va commencer */
  async init() {
    console.log("init");
    // On détermine le nombre de loups-garous ...
    const nbWerewolves = Math.max(1, Math.ceil(this.#probaWerewolf * this.#nbPlayersRequired));
    // ... le nombre de pouvoirs ...
    // TODO: implémenter l'attribution des pouvoirs
    // ... et le nombre d'humains.
    const nbHumans = this.#nbPlayersRequired - nbWerewolves;
    const villagers = await usersgamesModel.findAll({ attributes: ['userIdUser', 'idUsergame'], where: {gameIdGame:this.#gameID} });
    console.log(villagers);
    // TODO: mélanger aléatoirement le tableau villagers
    // attribution des rôles
    for (let i = 0; i < villagers.length; i++) {
      // on crée une instance d'état et de vivant dans la base de données pour chaque joueur
      const etatVillageois = await etatsModel.create({usersgameIdUsergame: villagers[i].idUsergame});
      console.log("idUser : " + villagers[i].userIdUser);
      console.log("idUsergame: " + villagers[i].idUsergame);
      console.log("etatId: " + etatVillageois.id);
      if (i >= 0 && i < nbWerewolves) {
        // c'est un loup-garou
        const vivant = await vivantsModel.create({typeVivant: "loup-garou", etatId: etatVillageois.id });
        console.log("etatId - idVivant - rôle du joueur: " + vivant.etatId + " " + vivant.idVivant + " " + vivant.typeVivant);
      } else {
        // c'est un humain
        const vivant = await vivantsModel.create({typeVivant: "humain", etatId: etatVillageois.id });
        console.log("etatId - idVivant - rôle du joueur: " + vivant.etatId + " " + vivant.idVivant + " " + vivant.typeVivant);
      }
    }
    // TODO: émettre un message pour dire que la partie a commencé
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
    delete io.npst[this.#gameID];
    GameState.remove(this.#gameID);
  }

  /**
   * Change the game to day
   */
  dayChange() {
    this.#gameState = GameState.DAY;
    io.of(this.#namespace).emit('day', 'nuit -> jour', this.#dayDuration);
  }

  /**
   * Change the game to night
   */
  nightChange() {
    this.#gameState = GameState.NIGHT;
    io.of(this.#namespace).emit('night', 'jour -> nuit', this.#nightDuration);
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
      //TODO: changer cela pour prendre en compte le vrai "Power"
      if (power.toString() !== "none") {
        socket.join(power.toString());
      }
      socket.join(state.toString());
    } else {
      console.log("[Game.js] setPlayerRoom : SocketID Invalid");
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
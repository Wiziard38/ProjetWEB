const GameState = require("./GameState");
const usersgamesModel = require("../models/usersgames.js");
const vivantsModel = require("../models/vivants.js");
const io = require('../ws/websockets.js');
const AbstractGameState = require("./AbstractGameState");
const Player = require("./Player");
const users = require("../models/users");
const etats = require("../models/etats");
const morts = require("../models/morts");
const usersgames = require("../models/usersgames.js");
const vivants = require("../models/vivants.js");
const games = require("../models/games");

class Game {
  #gameState;
  #loopID;
  #gameID;
  #playerVoted;
  #namespace;
  #electedPlayer;
  #nbJoueurTot;
  #nbPlayersRequired;
  #beginTime;
  #dayDuration;
  #nightDuration;
  #probaPower;
  #probaWerewolf

  #playerDir = new Map(); // Link socketID to player object
  #socketDir = new Map(); // Link username to socketID

  #switchDate; //Quand le jour/nuit change on met a jour cette variable

  constructor(id, nbJoueur, nbJoueurTot, dureeJour, dureeNuit, dateDeb, probaPouv, probaLoup) {
    console.log("constructor")
    console.log("beginTime: " + dateDeb);
    //console.log("beginTime: " + dateDeb.getTime());
    console.log("dayDuration: " + dureeJour * 1000);
    console.log("nightDuration: " + dureeNuit * 1000);
    console.log("date actuelle: " + new Date());
    this.#gameID = id;
    this.#nbJoueurTot = nbJoueurTot;
    this.#nbPlayersRequired = nbJoueur;
    this.#beginTime = dateDeb; // TODO: traduire date en millisecondes
    this.#dayDuration = dureeJour * 1000; // traduction de secondes en millisecondes
    this.#nightDuration = dureeNuit * 1000; // traduction de secondes en millisecondes
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
   * @returns the total number of players in the game 
   */
  getNbJoueur() {
    return this.#nbJoueurTot;
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
   * Return if a player had been already voted 
   */
  getPlayerVoted() {
    return this.#playerVoted;
  }
  /**
   * Change the game to day
   */
  dayChange() {
    this.#gameState = GameState.DAY;
    this.#playerVoted = false;
    io.of(this.#namespace).emit('day', 'nuit -> jour', this.#dayDuration);
    // io.of(this.#namespace).emit('receive_msg', 'message de test', "test");
  }

  /**
   * Change the game to night
   */
  nightChange() {
    this.#gameState = GameState.NIGHT;
    this.#playerVoted = false;
    io.of(this.#namespace).emit('night', 'jour -> nuit', this.#nightDuration);
  }


  /**
   * Send to the player the current state of the game
   * @param {*} socketID 
   */
  async getGameData(socketID) {
    console.log("calling gameData ?")
    const players = await users.findAll({ 
      attributes: ['username'],
      include: { 
        model: usersgamesModel,
        attributes: [],
        where: { gameIdGame: this.#gameID } 
      },
      raw : true
    });
    const listPlayers = players.map(obj => obj.username);

    const deads = await morts.findAll({ 
      attributes: [],
      required: true,
      include: {
        model: etats,
        attributes: [],
        required: true,
        include: {
          model: usersgames,
          attributes: [],
          required: true,
          include: {
            model: users,
            required: true,
            attributes: ["username"],
          }
        }
      },
      raw : true
    });
    const listDeads = deads.map(obj => obj['etat.usersgame.user.username']);

    const alive = await vivants.findAll({ 
      attributes: [],
      required: true,
      include: {
        model: etats,
        attributes: [],
        required: true,
        include: {
          model: usersgames,
          attributes: [],
          required: true,
          include: {
            model: users,
            required: true,
            attributes: ["username"],
          }
        }
      },
      raw : true
    });
    const listAlive = alive.map(obj => obj['etat.usersgame.user.username']);
    
    const gameDates = await games.findOne({attributes: ["dateDeb", "createdAt"], where: { idGame: this.#gameID }, raw: true})

    const currentDate = new Date();
    const elapsedTime = currentDate - this.switchTime;
    const timeLeft = this.isDay() ? this.#dayDuration - elapsedTime : this.#nightDuration - elapsedTime;


    const gameData = {
      "isDay": this.isDay(),
      "switchTime": timeLeft,
      "infos": {
        "createdAt": gameDates.createdAt,
        "dateDeb": gameDates.dateDeb,
        "dureeJour": this.#dayDuration,
        "dureeNuit": this.#nightDuration,
        "idGame": this.#gameID,
        "nbJoueur": listPlayers.length,
        "probaLoup": this.#probaWerewolf,
        "probaPouv": this.#probaPower
      },
      "listeJoueurs": listPlayers,
      "listeVivants": listAlive,
      "listeMorts": listDeads
    };

    return gameData;
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
      /* constructeur d'une partie - initialisation des champs */
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
  create() {
    console.log("create")
    const initNamespace = require('./Namespace');
    initNamespace(this);
    setTimeout(() => {
      this.begin();
    }, this.#beginTime);
  }

  /* initialise les données de la partie qui va commencer */
  async init() {
    console.log("init")
    // création des loups-garous
    const nbWerewolves = Math.max(1, Math.ceil(this.#probaWerewolf * this.#nbPlayersRequired));

    // création des pouvoirs
    // TODO:

    // création des humains
    const nbHumans = this.#nbPlayersRequired - nbWerewolves;

    const villagers = await usersgamesModel.findAll({ where: { gameIdGame: this.#gameID } });
    // console.log(villagers);

    // TODO: mélanger aléatoirement le tableau villagers

    for (let i = 0; i < villagers.length; i++) {
      // console.log("idUser : " + villagers[i].userIdUser);
      if (i >= 0 && i < nbWerewolves) {
        // c'est un loup-garou
        await vivantsModel.create({ typeVivant: "loup-garou", usersgameIdUsergame: villagers[i].idUsergame });
      } else {
        // c'est un humain
        await vivantsModel.create({ typeVivant: "humain", usersgameIdUsergame: villagers[i].idUsergame });
      }
    }

    // TODO: changer le champ aCommence false->true

  }

  /* méthode appelée lorsque l'horaire de début de partie est atteint */
  async begin() {
    console.log("begin")
    const nbPlayersRegistered = await usersgamesModel.count({ where: { gameIdGame: this.#gameID } });
    if (nbPlayersRegistered == this.#nbPlayersRequired || 1) {
      //TODO virer le || 1 utilisé ici pour bypass le test durant la phase de test
      // la partie est lancée si le nombre de joueurs requis est atteint
      this.init()
      this.#gameState = GameState.DAY;
      this.dayChange();
      this.#loopID = setInterval(() => {
        this.nightChange();
        setTimeout(() => {
          this.dayChange();
        }, this.#nightDuration)
      }, this.#dayDuration + this.#nightDuration);
    } else {
      // sinon la partie est annulée
      // TODO:
    }
  }

  finish() {
    clearInterval(this.#loopID);
    io.of('/' + this.#gameID).removeAllListeners();
    // delete
    delete io.npst[this.#gameID];
    GameState.remove(this.#gameID);
  }

  dayChange() {
    this.#switchDate = new Date();
    this.#gameState = GameState.DAY;
    io.of(this.#namespace).emit('day', 'nuit -> jour', this.#dayDuration);
  }

  nightChange() {
    this.#switchDate = new Date();
    this.#gameState = GameState.NIGHT;
    io.of(this.#namespace).emit('night', 'jour -> nuit', this.#nightDuration);
  }

  setPlayerRoom(socketID) {
    const player = this.getPlayerBySocket(socketID);
    const power = player.getPower();
    const state = player.getState();
    const socket = io.of(this.#namespace).sockets.get(socketID);

    if (socket) {
      // TODO: changer cela pour prendre en compte le vrai "Power"
      if (power.toString() !== "none") {
        socket.join(power.toString());
      }
      socket.join(state.toString());
    } else {
      console.log("[Game.js] setPlayerRoom : SocketID Invalid")
    }
  }

  getNamespace() {
    return this.#namespace;
  }

  getSocket(socketID) {
    return io.of(this.#namespace).sockets.get(socketID);
  }

  getID() {
    return this.#gameID;
  }
}

module.exports = Game;
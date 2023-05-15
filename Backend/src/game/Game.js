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
const discussions = require("../models/discussions");
const messages = require("../models/messages");

class Game {
  #gameState;
  #loopID;
  #gameID;
  #namespace;
  #electedPlayer = "Luca";
  #nbPlayersRequired;
  #beginTime;
  #dayDuration;
  #nightDuration;
  #probaPower;
  #probaWerewolf

  #playerDir = new Map(); // Link socketID to player object
  #socketDir = new Map(); // Link username to socketID

  #switchDate; //Quand le jour/nuit change on met a jour cette variable

  constructor(id, nbJoueur, dureeJour, dureeNuit, dateDeb, probaPouv, probaLoup) {
    console.log("constructor")
    console.log("beginTime: " + dateDeb);
    //console.log("beginTime: " + dateDeb.getTime());
    console.log("dayDuration: " + dureeJour * 1000);
    console.log("nightDuration: " + dureeNuit * 1000);
    console.log("date actuelle: " + new Date());
    this.#gameID = id;
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

  async sendMessages(socketID) {
    /** @type {Player} */
    const player = this.#playerDir.get(socketID);
    const States = require("./States.js")
    const discussion = this.isDay() ? "jour" : player.getState() == States.WEREWOLF ? "repaire" : this.getElectedPlayer() === player.getUsername() ? "spiritisme" : "none";

    const listMessages = [];

    if (discussion !== "none") {
      const { idDiscussion } = await discussions.findOne({
        attributes: ["idDiscussion"],
        where: { date: this.getSwitchTime(), typeDiscussion: discussion },
        raw: true
      });

      const msgs = await messages.findAll({
        where: { discussionIdDiscussion: idDiscussion },
        include: {
          model: usersgames,
          include: {
            model: users
          }
        }
      })
      // console.log(msgs);
      msgs.forEach(element => {
        const { contenu, createdAt } = element
        const ug = element["usersgame"];
        const us = ug["user"];

        const msg = {
          "contenu": contenu,
          "date": createdAt,
          "user": us["username"]
        }
        listMessages.push(msg)
      });


    }
    // console.log(listMessages);
    this.getSocket(socketID).emit("messages", listMessages);

  }
  /**
   * Send to the player the current state of the game
   * @param {*} socketID 
   */
  async getGameData(socketID) {
    /** @type {Player} */
    const player = this.#playerDir.get(socketID);
    const players = await users.findAll({
      attributes: ['username'],
      include: {
        model: usersgamesModel,
        attributes: [],
        where: { gameIdGame: this.#gameID }
      },
      raw: true
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
      raw: true
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
      raw: true
    });

    const listAlive = alive.map(obj => obj['etat.usersgame.user.username']);

    const gameDates = await games.findOne({ attributes: ["dateDeb", "createdAt"], where: { idGame: this.#gameID }, raw: true })

    const currentDate = new Date();
    const elapsedTime = currentDate - this.#switchDate;
    const timeLeft = this.isDay() ? this.#dayDuration - elapsedTime : this.#nightDuration - elapsedTime;
    console.log(timeLeft)
    const gameData = {
      isDay: this.isDay(),
      role: player.getState().toString(),
      power: player.getPower().toString(),
      powerUsed: false,
      switchTime: timeLeft,
      infos: {
        createdAt: gameDates.createdAt,
        dateDeb: gameDates.dateDeb,
        dureeJour: this.#dayDuration,
        dureeNuit: this.#nightDuration,
        idGame: this.#gameID,
        nbJoueur: listPlayers.length,
        probaLoup: this.#probaWerewolf,
        probaPouv: this.#probaPower
      },
      listeJoueurs: listPlayers,
      listeJoueursMorts: listDeads,
      listeJoueursVivants: listAlive
    };

    this.getSocket(socketID).emit("game_data", JSON.stringify(gameData));
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

  async dayChange() {
    if (this.#switchDate !== undefined) {
      await discussions.update({ Archivee: true }, {
        where: { date: this.#switchDate }
      });
    }
    this.#switchDate = new Date();
    this.#gameState = GameState.DAY;
    await discussions.create({
      date: this.#switchDate,
      typeDiscussion: "jour",
      Archivee: false,
      gameIdGame: this.#gameID
    })
    io.of(this.#namespace).emit('day', 'nuit -> jour', this.#dayDuration);
  }

  async nightChange() {
    await discussions.update({ Archivee: true }, {
      where: { date: this.#switchDate }
    });

    this.#switchDate = new Date();
    this.#gameState = GameState.NIGHT;

    await discussions.create({
      date: this.#switchDate,
      typeDiscussion: "repaire",
      Archivee: false,
      gameIdGame: this.#gameID
    });

    await discussions.create({
      date: this.#switchDate,
      typeDiscussion: "spiritisme",
      Archivee: false,
      gameIdGame: this.#gameID
    });

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

  getSwitchTime() {
    return this.#switchDate;
  }

  async getUserInfos(username) {
    // await vivants.findOne({
    //   attributes: ["typeVivant", "pouvoir"],
    //   include: {
    //     model: etats
    //   }
    // })
    const infos = await usersgames.findOne({
      include: [{
        attributes: ['username'],
        model: users,
        where: { username: username }
      }, {
        model: games,
        attributes: [],
        where: { idGame: this.#gameID}
      }, {
        model: etats,
        attributes: [],
        include: [{
          attributes: ['typeVivant', 'pouvoir'],
          model: vivants
        }, {
          attributes: ['eluSpiritisme'],
          model: morts
        }
      ]
      }
      ],
      raw: true
    })
    
    console.log(infos)
    return {
      role: infos['etat.vivant.typeVivant'],
      power: infos['etat.vivant.pouvoir'],
      spiritisme: infos['etat.mort.eluSpiritisme']
    };
  }

  setElected(username) {
    this.#electedPlayer = username;
  }
}

module.exports = Game;
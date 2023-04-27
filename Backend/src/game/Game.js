const GameState = require("./GameState");
const io = require('../ws/websockets.js');


class Game {
    #gameState;
    #loopID;
    #namespace;
    #gameID;
    #nbPlayers;
    #beginTime;
    #dayDuration;
    #nightDuration;
    #probaPower;
    #probaWerewolf

    #playerDir = new Map(); // Link socketID to player object
    #socketDir = new Map(); // Link username to socketID

    constructor(id, nbJoueur, dureeJour, dureeNuit, dateDeb, probaPouv, probaLoup) {
        console.log("constructor")
        console.log("idGame: " + id);
        console.log("nbJoueur: " + nbJoueur);
        console.log("dureeJour: " + dureeJour);
        console.log("dureeNuit: " + dureeNuit);
        console.log("dateDeb: " + dateDeb);
        console.log("probaPouv: " + probaPouv);
        console.log("probaLoup: " + probaLoup);
        this.#gameID = id;
        this.#nbPlayers = nbJoueur;
        this.#beginTime = dateDeb; // TODO: traduire en millisecondes
        this.#dayDuration = dureeJour; // TODO: traduire en millisecondes
        this.#nightDuration = dureeNuit; // TODO: traduire en millisecondes
        this.#probaPower = probaPouv;
        this.#probaWerewolf = probaLoup;
        this.#namespace = '/' + id;
        this.create();
    }

    addPlayer(player, socketID) {
        this.#playerDir.set(socketID, player);
        this.#socketDir.set(player.getUsername(), socketID);
    }

    getPlayerBySocket(socketID) {
        return this.#playerDir.get(socketID);
    }

    isDay() {
        return this.#gameState === GameState.DAY;
    }

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

    init() {
        console.log("init")
        // calculs
        // changer le champ aCommence false->true
    }

    begin() {
        console.log("begin")
        this.init()
        this.#gameState = GameState.DAY;
        this.dayChange();
        this.#loopID = setInterval(() => {
            this.nightChange();

            setTimeout(() => {
                this.dayChange();
            }, this.#nightDuration)
        }, this.#dayDuration + this.#nightDuration);
    }

    finish() {
        clearInterval(this.#loopID);
        io.of('/' + this.#gameID).removeAllListeners();
        // delete
        delete io.npst[this.#gameID];
        GameState.remove(this.#gameID);
    }

    dayChange() {
        this.#gameState = GameState.DAY;
        io.of(this.#namespace).emit('day', 'nuit -> jour');
    }

    nightChange() {
        this.#gameState = GameState.NIGHT;
        io.of(this.#namespace).emit('night', 'jour -> nuit');
    }


    getGameData(socketID) {
        //Send to the player game data
    }

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
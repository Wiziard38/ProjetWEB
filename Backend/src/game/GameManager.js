const io = require('../ws/websockets.js')
const initNamespace = require('./Namespace.js')
const Team = {
    WEREWOLF: 0,
    HUMAN: 1,
    DEATH: 2
}

const Roles = {
    CONTAMINATION: 0,
    SPIRITISM: 1,
    INSOMNIA: 2,
    PSYCHIC: 3
}

const GameManager = {
    dir: new Map(),

    addPlayer: function (playerId, socketId) {
        this.dir.set(playerId, socketId);
    },

    removePlayer: function (playerId) {
        this.dir.delete(playerId);
    },

    validUser: function (token, gameID) {
        return true;
    },

    validUserTeam: function(token, gameID, team) {
        return true;
    },

    validUserRole: function(token, gameID, role) {
        return true;
    },

    createGame: function (gameID) {
        initNamespace(gameID);
        setTimeout( () => {

            this.startGame(gameID);
        }, 4000 /* durée avant le début de la game */);
    },

    startGame: function (gameID) {
        // const game = this.dir.get(gameID);
        console.log("La partie commence : " + gameID)
        io.of('/' + gameID).emit('begin', 'La partie commence');
        const gameUpdate = setInterval(() => {
            this.changementJour(gameID);

            setTimeout(() => {
                this.changementNuit(gameID);
            }, 1000 /* durée d'un jour */);
        }, 5000 /* durée jour + nuit */)

    },

    changementJour: function (gameID) {
        // Signale qui indique le changement de jour à nuit
        io.of('/' + gameID).emit('jour', 'changement nuit -> jour');
        console.log("Changement vers le jour : " + gameID)
    },

    changementNuit: function (gameID) {
        io.of('/' + gameID).emit('nuit', 'on va faire dodo');
        console.log("Changement vers la nuit : " + gameID)

    },

    stopGame: function (gameID) {
        // Remove the namespace
        io.of('/' + gameID).removeAllListeners();
        // delete
        delete io.npst[gameID];
    }
}

module.exports = GameManager;
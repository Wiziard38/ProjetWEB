const io = require('../ws/websockets.js')

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
    // addPlayer: function(gameId, player) {
    //   const game = this.dir.get(gameId);
    //   const playerId = player.getId();
    //   if(game !== undefined) {
    //     // A game with that id has been found
    //     game.set(playerId)
    //   } else {
    //     // No game with this id
    //     const arr = new Map();
    //     arr.set(playerId)
    //     this.dir.set(gameId, arr)
    //   }
    // },

    // removePlayer: function(gameId, player) {
    //   const game = this.dir.get(gameId);
    //   if(game !== undefined) {
    //     const playerId = player.getId();
    //     game.delete(playerId);
    //   }
    // },
    valideUser(token, gameId) {
        return true;
    },

    joinGame: function(playerId, gameId) {

    },

    createGame: function (gameId) {
        const namespace = io.of('/' + gameId);

        namespace.use((socket, next) => {
            const token = socket.handshake.auth.token;

            // Check if the user is member of the game. If not, close the socket.
            if(this.valideUser(token, gameId) === false) {
                socket.disconnect();
            }

            next();
        })

        namespace.on('connection', (socket) => {
            console.log('utilisateur se connecte dans ' + gameId);
        })

        namespace.on('disconnect', (socket) => {
            // TODO supprimer l'user d'ici
        })

        setTimeout( () => {

            this.startGame(gameId);
        }, 4000 /* durée avant le début de la game */);
    },

    startGame: function (gameId) {
        // const game = this.dir.get(gameId);
        io.of('/' + gameId).emit('begin', 'La partie commence');
        const gameUpdate = setInterval(() => {
            this.changementJour(gameId);

            setTimeout(() => {
                this.changementNuit(gameId);
            }, 1000 /* durée d'un jour */);
        }, 5000 /* durée jour + nuit */)

    },

    changementJour: function (gameId) {
        // Signale qui indique le changement de jour à nuit
        io.of('/' + gameId).emit('jour', 'changement nuit -> jour');
    },

    changementNuit: function (gameId) {
        io.of('/' + gameId).emit('nuit', 'on va faire dodo');
    },

    stopGame: function (gameId) {
        // Remove the namespace
        io.of('/' + gameId).removeAllListeners();
        // delete
        delete io.npst[gameId];
    }
}

GameManager.startGame('0');

module.exports = GameManager;
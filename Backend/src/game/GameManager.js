const io = require('../ws/websockets.js')

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
    joinGame: function(playerId, gameId) {

    },

    createGame: function (gameId) {
        const namespace = io.of('/' + gameId);

        namespace.on('connection', (socket) => {
            console.log('utilisateur se connecte dans ')
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

module.exports = GameManager;
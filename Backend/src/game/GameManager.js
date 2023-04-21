const io = require('../ws/websockets.js')
const initNamespace = require('./Namespace.js')
const Team = {
    WEREWOLF: 'werewolf',
    HUMAN: 'human',
    DEATH: 'death'
}

const Roles = {
    CONTAMINATION: 'contamination',
    SPIRITISM: 'spiritism',
    INSOMNIA: 'insomnia',
    PSYCHIC: 'psychic',
    NONE: 'none'
}

const GameManager = {
    // A directory linking player's ID to its socketID
    socketDir: new Map(),
    // Link socket ID to a team. An fast and easy way to check the team when needed
    socketToTeam: new Map(),
    // Link socket ID to a role. An fast and easy way to check the role when needed
    socketToRoles: new Map(),

    gameLoopID: new Map(),
    /**
     * Register a player to the directory linking player and socket
     * @param {*} playerID : Database ID
     * @param {*} socketID : current connection
     */
    addPlayer: function (playerID, socketID) {
        this.socketDir.set(playerID, socketID);
    },

    /**
     * Remove a player from directories
     * @param {*} playerID 
     */
    removePlayer: function (playerID) {
        const socketID = this.socketDir.get(playerID);
        this.socketDir.delete(playerID);
        this.socketToRoles.delete(socketID);
        this.socketToTeam.delete(socketID);
    },

    /**
     * Tel if the (player) socket is from the specified team
     * @param {*} socketID : identify a user through the ID
     * @param {*} team : WEREWOLF, HUMAN, DEATH
     * @returns 
     */
    validTeam: function(socketID, team) {
        return this.socketToTeam.get(socketID) === team;
    },

    /**
     * Tel if the (player) socket is from the specified role
     * @param {*} socketID 
     * @param {*} role : CONTAMINATION, SPIRITISM, INSOMNIA, PSYCHIC, NONE
     * @returns 
     */
    validRole: function(socketID, role) {
        return this.socketToRoles.get(socketID) === role;
    },

    /**
     * Tel if the player is supposed to open the connection with this game
     * @param {*} token 
     * @param {*} gameID 
     * @returns 
     */
    validUser: async function (token, gameID) {
        return true;
    },

    /**
     * Get the user team
     * @param {*} userName 
     * @param {*} gameID 
     * @returns 
     */
    getUserTeam: async function(userName, gameID) {
        return true;
    },

    /**
     * Get the user role
     * @param {*} userName 
     * @param {*} gameID 
     * @returns 
     */
    getUserRole: async function(userName, gameID) {
        return true;
    },

    /**
     * Link a socketID to a team
     * @param {*} socketID 
     * @param {*} team 
     */
    addTeamDirectory: function(socketID, team) {
        this.socketToTeam.set(socketID, team)
    },

    /**
     * Link a socketID to a role
     * @param {*} socketID 
     * @param {*} role 
     */
    addRoleDirectory: function(socketID, role) {
        this.socketToRoles.set(socketID, role)
    },

    /**
     * Get all game data for a given player
     * @param {*} gameID 
     * @param {*} userName 
     * @returns 
     */
    getGameData: async function(gameID, userName) {
        return "Blo blo bli"
    },

    /**
     * Put the user in a room according to it's team and role
     * @param {*} gameID 
     * @param {*} socketID 
     */
    setPlayerRoom: function(gameID, socketID) {
        const socket = io.sockets.sockets.get('YnwlYH-gCKT2K9jEAAAu');

        const role = this.socketToRoles.get(socketID);
        const team = this.socketToTeam.get(socketID);
        
        //Add the player to it's team/role room
        if(role === Roles.NONE) {
            // Player with no role
            socket.join(team);
        } else {
            // Player with a role
            socket.join(role);
        }
    },

    /**
     * Create the game
     * @param {*} gameID 
     */
    createGame: function (gameID) {
        // Init the game namespace (all callbacks)
        initNamespace(gameID);
        setTimeout( () => {
            //Start the game
            this.startGame(gameID);
        }, 4000 /* durée avant le début de la game */);
    },

    /**
     * start the game
     * @param {*} gameID 
     */
    startGame: function (gameID) {
        // const game = this.dir.get(gameID);
        console.log("La partie commence : " + gameID)
        io.of('/' + gameID).emit('begin', 'La partie commence');
        // Game loop
        const gameUpdate = setInterval(() => {
            this.changementJour(gameID);

            setTimeout(() => {
                this.changementNuit(gameID);
            }, 1000 /* durée d'un jour */);
        }, 5000 /* durée jour + nuit */)

        this.gameLoopID.set(gameID, gameUpdate);
    },

    /**
     * What happen when sunrise
     * @param {*} gameID 
     */
    changementJour: function (gameID) {
        // Signale qui indique le changement de jour à nuit
        io.of('/' + gameID).emit('jour', 'changement nuit -> jour');
        console.log("Changement vers le jour : " + gameID)
    },

    /**
     * What happen when the nigth fall
     * @param {*} gameID 
     */
    changementNuit: function (gameID) {
        io.of('/' + gameID).emit('nuit', 'on va faire dodo');
        console.log("Changement vers la nuit : " + gameID)

    },

    /**
     * End the game
     * @param {*} gameID 
     */
    stopGame: function (gameID) {
        // Remove the namespace
        io.of('/' + gameID).removeAllListeners();
        // delete
        delete io.npst[gameID];

        clearInterval(this.gameLoopID.get(gameID));
    }
}

module.exports = GameManager;
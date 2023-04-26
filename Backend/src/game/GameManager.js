const io = require('../ws/websockets.js')
const initNamespace = require('./Namespace.js')
const Team = require('./Team.js');
const Room = require('./Room.js');
const usersModel = require("../models/users");
const getUserNameByToken = require('../middleware/decode.js');
const GameState = require('./GameState.js');


const GameManager = {
    // A directory linking player's ID to its socketID
    socketToUser: new Map(),
    userToSocket: new Map(),
    // Link socket ID to a team. An fast and easy way to check the team when needed
    socketToTeam: new Map(),
    // Link socket ID to a role. An fast and easy way to check the role when needed
    socketToRoom: new Map(),

    gameLoopID: new Map(),

    states: new Map(),
    /**
     * Register a player to the directory linking player and socket
     * @param {*} playerID : Database ID
     * @param {*} socketID : current connection
     */
    addPlayer: function (socketID, playerID) {
        this.socketToUser.set(socketID, playerID);
        this.userToSocket.set(playerID, socketID);
    },

    isNight: function(gameID) {
        return this.states.get(gameID) === GameState.NIGHT;
    },

    isDay: function(gameID) {
        return this.states.get(gameID) === GameState.DAY;
    },
    /**
     * Remove a player from directories
     * @param {*} playerID 
     */
    removePlayer: function (playerID) {
        const socketID = this.socketDir.get(playerID);
        this.socketDir.delete(playerID);
        this.socketToRoom.delete(socketID);
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
        return this.socketToRoom.get(socketID) === role;
    },

    /**
     * Tel if the player is supposed to open the connection with this game
     * @param {*} token 
     * @param {*} gameID 
     * @returns 
     */
    u: new Map(),
    validUser: async function (token, gameID) {
        //TODO DELETE_ALL_TEST_MSG
        j = this.u.get('a');
        if(j === undefined) {
            this.u.set('a', 0);
        } else {
            this.u.set('a', j + 1)
        }
        return this.u.get('a') + 1;

        const user = await usersModel.findOne({ where: { username } });
        if(user) {

        }
    },

    /**
     * Get the user team
     * @param {*} userName 
     * @param {*} gameID 
     * @returns 
     */
    getUserTeam: async function(userName, gameID) {
        //TODO DELETE_ALL_TEST_MSG
        if(userName == 1) {
            return Team.WEREWOLF;
        } else if(userName == 2) {
            return Team.HUMAN;
        } else if(userName == 3) {
            return Team.HUMAN;
        } else if(userName == 4) {
            return Team.HUMAN;
        } else if(userName == 5) {
            return Team.DEATH;
        } else {
            if(userName == 6 || userName == 9) {
                return Team.WEREWOLF
            } else {
                return Team.HUMAN
            }
        }
    },

    /**
     * Get the user role
     * @param {*} userName 
     * @param {*} gameID 
     * @returns 
     */
    getUserRole: async function(userName, gameID) {
        //TODO DELETE_ALL_TEST_MSG
        if(userName == 1) {
            return Room.CONTAMINATION;
        } else if(userName == 2) {
            return Room.INSOMNIA;
        } else if(userName == 3) {
            return Room.PSYCHIC;
        } else if(userName == 4) {
            return Room.SPIRITISM;
        } else if(userName == 5) {
            return Room.ELECTED;
        } else {
            return Room.NONE;
        }
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
        this.socketToRoom.set(socketID, role)
    },

    /**
     * Get all game data for a given player
     * @param {*} gameID 
     * @param {*} userName 
     * @returns 
     */
    getGameData: async function(gameID, userName) {
        return 0
    },

    /**
     * Put the user in a room according to it's team and role
     * @param {*} gameID 
     * @param {*} socketID 
     */
    setPlayerRoom: function(gameID, socketID) {
        const socket = io.of('/' + gameID).sockets.get(socketID);
        const role = this.socketToRoom.get(socketID);
        const team = this.socketToTeam.get(socketID);
        if(socket) {
            //Add the player to it's team/role room
            if(role === Room.NONE) {
                // Player with no role
                socket.join(team);
            } else {
                // Player with a role
                socket.join(role);
            }
        } else {
            console.log("[Erreur] Impossible de trouver la socket (setPlayerRoom)")
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
        // console.log("La partie commence : " + gameID)
        io.of('/' + gameID).emit('begin', 'La partie commence');
        // Game loop
        this.states.set(gameID, GameState.BEGIN)
        console.log("Début")
        this.changementJour(gameID);
        const gameUpdate = setInterval(() => {
            console.log("Début début")
            this.changementNuit(gameID);

            setTimeout(() => {
                this.changementJour(gameID);
            }, 15000 /* durée d'une nuit */);
        }, 30000 /* durée jour + nuit */)

        this.gameLoopID.set(gameID, gameUpdate);
    },

    /**
     * What happen when sunrise
     * @param {*} gameID 
     */
    changementJour: function (gameID) {
        this.states.set(gameID, GameState.DAY)
        // Signale qui indique le changement de jour à nuit
        io.of('/' + gameID).emit('jour', 'changement nuit -> jour');
        // console.log("Changement vers le jour : " + gameID)
    },

    /**
     * What happen when the nigth fall
     * @param {*} gameID 
     */
    changementNuit: function (gameID) {
        this.states.set(gameID, GameState.NIGHT)
        io.of('/' + gameID).emit('nuit', 'jour -> nuit');
        // console.log("Changement vers la nuit : " + gameID)

    },

    /**
     * End the game
     * @param {*} gameID 
     */
    stopGame: function (gameID) {
        // Remove the namespace
        this.states.delete(gameID)
        io.of('/' + gameID).removeAllListeners();
        // delete
        delete io.npst[gameID];

        clearInterval(this.gameLoopID.get(gameID));
    }
}

module.exports = GameManager;
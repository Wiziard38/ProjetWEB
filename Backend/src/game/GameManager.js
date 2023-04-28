const States = require('./States.js');
const Powers = require('./Powers.js');
const usersModel = require("../models/users");


const GameManager = {

    // A way to find a game according to its gameID
    gameDir: new Map(),

    addGame: function(gameID, game) {
        this.gameDir.set(gameID, game);
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
        let j = this.u.get('a');
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
            return States.WEREWOLF;
        } else if(userName == 2) {
            return States.HUMAN;
        } else if(userName == 3) {
            return States.HUMAN;
        } else if(userName == 4) {
            return States.HUMAN;
        } else if(userName == 5) {
            return States.DEATH;
        } else {
            if(userName == 6 || userName == 9) {
                return States.WEREWOLF
            } else {
                return States.HUMAN
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
            return Powers.CONTAMINATION;
        } else if(userName == 2) {
            return Powers.INSOMNIA;
        } else if(userName == 3) {
            return Powers.PSYCHIC;
        } else if(userName == 4) {
            return Powers.SPIRITISM;
        } else if(userName == 5) {
            return Powers.NONE;
        } else {
            return Powers.NONE;
        }
    },

    /**
     * Put the user in a room according to it's team and role
     * @param {*} gameID 
     * @param {*} socketID 
     */


    /**
     * End the game, remove the game from the dir
     * @param {*} gameID 
     */
    remove: function (gameID) {
        this.gameDir.delete(gameID);
    }
}

module.exports = GameManager;
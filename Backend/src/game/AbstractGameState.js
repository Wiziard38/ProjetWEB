class AbstractGameState {

    #name;

    constructor(name) {
        this.#name = name;
    }

    async vote(game, playerVotant, usernameVote) {};
    async ratif(game, playerVotant, usernameVote) {};
    async sendMessage(player, msg) {
        console.log("[AbstractGameState] Not implemented yet : sendMessage")
    }

}

module.exports = AbstractGameState;
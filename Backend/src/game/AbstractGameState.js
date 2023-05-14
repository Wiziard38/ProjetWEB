class AbstractGameState {

    #name;

    constructor(name) {
        this.#name = name;
    }

    async sendMessage(player, msg) {
        console.log("[AbstractGameState] Not implemented yet : sendMessage")
    }
}

module.exports = AbstractGameState;
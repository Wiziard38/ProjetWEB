class Power {

    #name;

    constructor(name) {
        this.#name = name;
    }
    sendMessageNight(msg, game) {
        // Most powers don't let you send a message
        return false;
    }

    toString() {
        return this.#name;
    }

}



module.exports = Power;
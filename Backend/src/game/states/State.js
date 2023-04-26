
class State {
    
    #name;
    
    constructor(name) {
        this.#name = name;
    }
    sendMessage(msg) {
        console.log("[State.js] sendMessage : Error");
        return false;
    }
    
    toString() {
        return this.#name;
    }
}

module.exports = State;
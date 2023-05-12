
class State {
    
    #name;
    
    constructor(name) {
        this.#name = name;
    }
    sendMessageDay(msg) {
        console.log("[State.js] sendMessageDay : Error");
        return false;
    }

    sendMessageNight(msg) {
        console.log("[State.js] sendMessageNight : Error");
        return false;
    }
    
    toString() {
        return this.#name;
    }
}

module.exports = State;
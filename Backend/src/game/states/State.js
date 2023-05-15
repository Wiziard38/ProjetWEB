
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
    
    voteJour(game, usernameVote, player) {
        console.log("[State.js] voteJour : Error");
        return false;
    }

    voteNuit(game, usernameVote, player) {
        console.log("[State.js] voteNuit : Error");
        return false;
    }

    ratifJour(game, usernameVote, player) {
        console.log("[State.js] voteJour : Error");
        return false;
    }

    ratifNuit(game, usernameVote, player) {
        console.log("[State.js] voteNuit : Error");
        return false;
    }

    toString() {
        return this.#name;
    }
}

module.exports = State;
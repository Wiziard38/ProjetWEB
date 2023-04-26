const GameState = require("./GameState");

class Game {
    #gameState;
    #loopID;

    isDay() {
        return this.#gameState === GameState.DAY;
    }

    isNight() {
        return this.#gameState === GameState.NIGHT;
    }
}

module.exports = Game;
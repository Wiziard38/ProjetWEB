const DayState = require("./DayState")
const NightState = require("./NightState")
const AbstractGameState = require("./AbstractGameState")

const GameState = {
    DAY: new DayState("day"),
    NIGHT: new NightState("night"),
    BEGIN: new AbstractGameState("begin")
}

module.exports = GameState;
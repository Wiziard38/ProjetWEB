const Werewolf = require("./states/Werewolf")
const Human = require("./states/Human")
const Death = require("./states/Death")

const Team = {
    WEREWOLF: new Werewolf('loup-garou'),
    HUMAN: new Human('humain'),
    DEATH: new Death('mort')
}

module.exports = Team;
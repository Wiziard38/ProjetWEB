const Werewolf = require("./states/Werewolf")
const Human = require("./states/Human")
const Death = require("./states/Death")

const Team = {
    WEREWOLF: new Werewolf('werewolf'),
    HUMAN: new Human('human'),
    DEATH: new Death('death')
}

module.exports = Team;
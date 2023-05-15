const Contamination = require('./powers/Contamination')
const Spiritism = require('./powers/Spiritism')
const Insomnia = require('./powers/Insomnia')
const Psychic = require('./powers/Psychic')
const None = require('./powers/None')

const Room = {
    CONTAMINATION: new Contamination("contamination"),
    SPIRITISM: new Spiritism("spiritisme"),
    INSOMNIA: new Insomnia("insomnie"),
    PSYCHIC: new Psychic("voyance"),
    //ELECTED: 'elected',
    NONE: new None() // new ...
}

module.exports = Room;
const Sequelize = require("sequelize");
const db = require("./database.js");
const morts = require("./morts");
const vivants = require("./vivants");
const usersgames = require("./usersgames.js");

const etats = db.define("etats", {});

etats.hasOne(morts);
morts.belongsTo(etats);

etats.hasOne(vivants);
vivants.belongsTo(etats);

usersgames.hasOne(etats);

module.exports = etats;

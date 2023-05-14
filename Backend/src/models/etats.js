const Sequelize = require("sequelize");
const db = require("./database.js");
const morts = require("./morts");
const vivants = require("./vivants");
const usergames = require("./usersgames");
const etats = db.define("etats", {});

etats.hasOne(morts);
morts.belongsTo(etats);

etats.hasOne(vivants);
vivants.belongsTo(etats);
usergames.hasOne(etats);
etats.belongsTo(usergames)
module.exports = etats;

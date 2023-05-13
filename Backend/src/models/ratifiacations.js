const Sequelize = require("sequelize");
const db = require("./database.js");
const usersGames = require("./usersgames");
const propositionVotes = require("./propositionVotes");

const ratifications = db.define("ratifications", {
  idRatification: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  etat: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  }
});

ratifications.belongsTo(usersGames);
usersGames.hasMany(ratifications);
ratifications.belongsTo(propositionVotes);
propositionVotes.hasMany(ratifications);

module.exports = ratifications;

const Sequelize = require("sequelize");
const db = require("./database.js");
const usersGames = require("./usersGames");
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
usersGames.hasMany(ratifications);

module.exports = discussions;

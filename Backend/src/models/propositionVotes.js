const Sequelize = require("sequelize");
const db = require("./database.js");
const usersGames = require("./usersgames");

const propositionVote = db.define("propositionVote", {
  idProp: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  nbVotant: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  usernameVote: {
    type: Sequelize.STRING(50),
    allowNull: false
  }
});

propositionVote.belongsTo(usersGames);
usersGames.hasMany(propositionVote);

module.exports = propositionVote;
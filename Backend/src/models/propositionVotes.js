const Sequelize = require("sequelize");
const db = require("./database.js");
const usersGames = require("./usersGames");

const propositionVote = db.define("propositionVote", {
  idProp: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  nbVotant: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
});

propositionVote.belongsTo(usersGames);
usersGames.hasMany(propositionVote);

module.exports = propositionVote;
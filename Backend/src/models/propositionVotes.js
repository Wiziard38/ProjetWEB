const Sequelize = require("sequelize");
const db = require("./database.js");
const usersGames = require("./usersgames");

const propositionVotes= db.define("propositionVotes", {
  idProp: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  nbVotant: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

usersGames.hasMany(propositionVotes, {foreignKey: "usernameVotantId"});
propositionVotes.belongsTo(usersGames, {as: "usernameVotant"});

usersGames.hasMany(propositionVotes, {foreignKey: "usernameVoteId"});
propositionVotes.belongsTo(usersGames, {as: "usernameVote"});

module.exports = propositionVotes;
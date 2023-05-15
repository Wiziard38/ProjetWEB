const Sequelize = require("sequelize");
const db = require("./database.js");
const games = require("./games.js");
const discussions = require("./discussions");
const propVote = require("./propositionVotes");
const ratifications = require("./ratifiacations");

const daytimes = db.define("daytimes", {
  idDaytime: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  current: {
    type: Sequelize.BOOLEAN,
    alowNull: false
  }
});

daytimes.belongsTo(games);
games.hasMany(daytimes);
discussions.belongsTo(daytimes);
daytimes.hasMany(discussions);
propVote.belongsTo(daytimes);
daytimes.hasMany(propVote);
ratifications.belongsTo(daytimes);
daytimes.hasMany(ratifications);
module.exports = daytimes;

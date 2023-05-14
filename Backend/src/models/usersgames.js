const db = require("./database.js");
const Sequelize = require("sequelize");
const users = require("./users.js");
const games = require("./games.js");

const usersgames = db.define(
  "usersgames",
  {
    idUsergame: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
  }
);

usersgames.belongsTo(games);
usersgames.belongsTo(users);
users.hasMany(usersgames);
games.hasMany(usersgames);

module.exports = usersgames;

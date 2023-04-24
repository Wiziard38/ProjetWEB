const Sequelize = require("sequelize");
const db = require("./database.js");

const users = require("./users.js");
const games = require("./games.js");

const usersgames = db.define(
  "usersgames",
  {
  }
);

usersgames.belongsTo(games);
usersgames.belongsTo(users);
users.hasMany(usersgames);
games.hasMany(usersgames);

module.exports = usersgames;

const Sequelize = require("sequelize");
const db = require("./database.js");
const discussions = require("./discussions");
const usersGames = require("./usersGames")
const messages = db.define("messages", {
  idMessage: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  contenu: {
    type: Sequelize.STRING(256),
    allowNull: false,
  },
});

messages.belongsTo(discussions);
messages.belongsTo(usersGames);
discussions.hasMany(messages);
usersGames.hasMany(messages);
module.exports = messages;

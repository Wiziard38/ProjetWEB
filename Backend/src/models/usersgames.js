const Sequelize = require("sequelize");
const db = require("./database.js");

const users = require("./users.js");
const games = require("./games.js");

const usersgames = db.define(
  "usersgames",
  {
    username: {
      type: Sequelize.STRING(32),
      allowNull: false,
      references: {
        model: users,
        key: 'username'
      }
    },
    idGame: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: games,
        key: 'id'
      }
    },
  },
  { timestamps: false }
);

users.belongsToMany(games, { through: usersgames });
games.belongsToMany(users, { through: usersgames });

module.exports = usersgames;

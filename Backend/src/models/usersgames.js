const db = require("./database.js");

const users = require("./users.js");
const games = require("./games.js");
const { Sequelize } = require("sequelize/types/index.js");

const usersgames = db.define(
  
  "usersgames",
  {
    /* voyance, spiritisme, insomnie, contamination */
    power: {
      type: Sequelize.ENUM('contamination', 'insomnia', 'psychic', 'spiritism'),
      allowNull: true,
    },
    
    /* vivant ou mort */
    state: {
      type: Sequelize.ENUM('alive', 'dead') ,
      allowNull: false,
    }
  }
  
);

usersgames.belongsTo(games);
usersgames.belongsTo(users);
users.hasMany(usersgames);
games.hasMany(usersgames);

module.exports = usersgames;

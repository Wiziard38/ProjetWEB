const db = require("./database.js");

const users = require("./users.js");
const games = require("./games.js");

const usersgames = db.define(
  "usersgames",
  {
    pouvoir: {
      type: Sequelize.DataTypes.ENUM("spiritisme", "insomnie", "voyance", "contamination"),
      allowNull: true,
    }
  }
);

usersgames.belongsTo(games);
usersgames.belongsTo(users);
users.hasMany(usersgames);
games.hasMany(usersgames);

module.exports = usersgames;

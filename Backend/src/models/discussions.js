const Sequelize = require("sequelize");
const db = require("./database.js");
const games = require("./games.js");

const discussions = db.define("discussions", {
  idDiscussion: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  Archivee: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  typeDiscussion: {
    type: Sequelize.DataTypes.ENUM("repaire", "jour", "spiritisme"),
    allowNull: false
  },
});

discussions.belongsTo(games);
games.hasMany(discussions);

module.exports = discussions;

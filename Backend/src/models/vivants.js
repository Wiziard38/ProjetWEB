const Sequelize = require("sequelize");
const db = require("./database.js");

const vivants = db.define("vivants", {
  idVivant: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  typeVivant: {
    type: Sequelize.DataTypes.ENUM("loup-garou", "humain")
  },
  pouvoir: {
    type: Sequelize.DataTypes.ENUM("spiritisme", "insomnie", "voyance", "contamination"),
    allowNull: true,
  }
});

module.exports = vivants;

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
});

module.exports = vivants;

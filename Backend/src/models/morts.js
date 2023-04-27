const Sequelize = require("sequelize");
const db = require("./database.js");

const morts = db.define("morts", {
  idMort: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  eluSpiritisme: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  }
});

module.exports = morts;

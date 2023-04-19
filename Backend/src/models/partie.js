const Sequelize = require("sequelize");
const db = require("./database.js");
const partie = db.define("partie", {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  nbJoueur: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  dureeJour: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  dureeNuit: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  dateDeb: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  probaPouv: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  probaLoup: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
});

module.exports = partie;

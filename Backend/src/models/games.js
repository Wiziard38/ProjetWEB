const Sequelize = require("sequelize");
const db = require("./database.js");

const games = db.define("games", {
  idGame: {
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
  statusGame: {
    type: Sequelize.DataTypes.ENUM("enAttente", "enCours", "annulee", "terminee"),
    defaultValue: "enAttente",
    allowNull: false,

  }
});

module.exports = games;

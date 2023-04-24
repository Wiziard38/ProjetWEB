const Sequelize = require("sequelize");
const db = require("./database.js");
const bcrypt = require('bcrypt');

const users = db.define(
  "users",
  {
    idUser: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING(32),
      allowNull: false,
      validate: {
        is: /^[0-9a-z\-'\s]{1,32}$/i,
      },
      unique: {
        arg: true,
        msg: "Username already exists",
      },
    },
    password: {
      type: Sequelize.STRING(60),
      allowNull: false,
      set(value) {
        const hash = bcrypt.hashSync(value, 10);
        this.setDataValue('password', hash);
      },
    },
  },
  { timestamps: false }
);

module.exports = users;

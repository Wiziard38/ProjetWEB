const Sequelize = require("sequelize");
const db = require("./database.js");

const users = db.define(
  "users",
  {
    username: {
      primaryKey: true,
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
      validate: {
        is: /^[0-9a-z\\/$.]{60}$/i,
      },
    },
  },
  { timestamps: false }
);

module.exports = users;

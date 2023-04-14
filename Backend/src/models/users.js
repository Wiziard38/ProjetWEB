const Sequelize = require('sequelize')
const db = require('./database.js')
const users = db.define('users', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  username: {
    type: Sequelize.STRING(16),
    allowNull: false,
    validate: {
      is: /^[0-9a-z\-'\s]{1,16}$/i
    },
    unique: {
      arg: true,
      msg: 'Username already exists'
    }
  }
}, { timestamps: false })
module.exports = users

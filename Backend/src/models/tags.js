const Sequelize = require('sequelize')
const db = require('./database.js')
const users = require('./users.js')
const tags = db.define('tags', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull: false,
    validate: {
      is: /^[0-9a-z\-'\s]{1,255}$/i
    }
  }
}, { timestamps: false }
, {
  indexes: [
    {
      unique: true,
      fields: ['name', 'userId']
    }
  ]
}
)
users.hasMany(tags, {
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
})
tags.belongsTo(users)

module.exports = tags

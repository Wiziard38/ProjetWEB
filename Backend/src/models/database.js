// Load Enviroment Variables to process.env (if not present take variables defined in .env file)
const env = process.env.CONFIG;
console.log(env);
const config = require("../../config");
const Sequelize = require('sequelize');
const db = new Sequelize(config[env]);
module.exports = db

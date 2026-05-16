const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './petcare-database.sqlite',
  logging: false,
});

module.exports = sequelize;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
  name: DataTypes.STRING,
  address: DataTypes.STRING,
  city: DataTypes.STRING,
  zip: DataTypes.STRING,
  items: DataTypes.JSON,
  totalAmount: DataTypes.FLOAT,
});

module.exports = Order;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Pet = sequelize.define('Pet', {
  owner: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  species: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  breed: DataTypes.STRING,
  ageYears: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  ageMonths: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  ageDays: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  gender: {
    type: DataTypes.STRING,
    defaultValue: 'Unknown',
  },
  weight: DataTypes.FLOAT,
  weightHistory: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  medicalHistory: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  vaccinations: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  activityGoals: {
    type: DataTypes.JSON,
    defaultValue: [
      { id: 1, label: "Morning Walk", goal: "30 min", current: "0 min", done: false },
      { id: 2, label: "Steps", goal: "5000", current: "0", done: false },
      { id: 3, label: "Play Time", goal: "15 min", current: "0 min", done: false }
    ]
  },
  image: {
    type: DataTypes.STRING,
    defaultValue: 'https://via.placeholder.com/150?text=Pet',
  },
});

module.exports = Pet;

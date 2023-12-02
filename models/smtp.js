const sequelize = require("../config/database");
const { DataTypes } = require('sequelize');

const Smtp = sequelize.define('SMTP', {
  ID: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  SERVICE: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  USER: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  PASSWORD: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  FROM: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  SUBJECT: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  CREATED_AT: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date()
    
  },
  UPDATED_AT: {
    type: DataTypes.DATE,
    defaultValue: new Date()

  },
}, {
  freezeTableName: true,
});

module.exports = Smtp;

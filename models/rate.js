const sequelize = require("../config/database");
const { DataTypes } = require('sequelize');

const Rate = sequelize.define('RATE', {
  ID: {
    type: DataTypes.STRING,
    primaryKey:true
  },
  PRIMARY_CCY: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  SECONDARY_CCY: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  RATE: {
    type: DataTypes.FLOAT,
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
  BOOK: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  freezeTableName: true,
});

module.exports = Rate;

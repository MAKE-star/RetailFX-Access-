const sequelize = require("../config/database");
const { DataTypes } = require('sequelize');

const BranchSettle = sequelize.define('BRANCH_SETTLE', {
  BR_SETTLE_ID: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  BR_SETTLE_BOOK: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  BR_SETTLE_CODE: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  BR_SETTLE_NAME: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  BR_SETTLE_ACCT: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  BR_SETTLE_TYPE: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  BR_SETTLE_CURRENCY: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  freezeTableName: true,
});

module.exports = BranchSettle;

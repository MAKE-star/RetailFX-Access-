const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TransactionLog = sequelize.define(
  "TRANSACTION_LOG",
  {
    TRANSACTION_ID: {
      type: DataTypes.NUMBER,
      allowNull: false,
      primaryKey: true,
    },
    TRANSACTION_DATE: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    SETTLE_DATE: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    PRODUCT_ID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ACCOUNT_NUMBER: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    CURRENCY: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    TRANSACTION_AMOUNT: {
      type: DataTypes.NUMBER({
        precision: 22,
        scale: 2,
      }),
      allowNull: false,
    },
    NARRATION: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    CONTRA_ACCOUNT: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    BRANCH_CODE: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    USERNAME: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    USERNAME1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

module.exports = TransactionLog;

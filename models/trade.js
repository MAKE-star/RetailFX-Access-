const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");
const Product = require("./product");

const Trade = sequelize.define(
  "TRADE",
  {
    ID: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    TRADE_DATE: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    CUSTOMER_REF: {
      type: DataTypes.STRING,
    },
    PRODUCT_ID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ACC_NO: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ACC_NAME: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ACC_BALANCE: {
      type: DataTypes.NUMBER({
        precision: 22,
        scale: 2,
      }),
      allowNull: false,
    },
    ACC_CURRENCY: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    BRANCH: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    DIRECTION: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    DIRECTION_CCY: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    WE_SELL: {
      type: DataTypes.NUMBER({
        precision: 22,
        scale: 2,
      }),
      allowNull: false,
    },
    WE_SELL_CCY: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    EXCHANGE_RATE1: {
      type: DataTypes.NUMBER({
        precision: 22,
        scale: 4,
      }),
      allowNull: false,
    },
    DEBIT_AMOUNT: {
      type: DataTypes.NUMBER({
        precision: 22,
        scale: 2,
      }),
      allowNull: false,
    },
    DEBIT_CCY: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    EXCHANGE_RATE2: {
      type: DataTypes.NUMBER({
        precision: 22,
        scale: 4,
      }),
      allowNull: false,
    },
    REF_AMOUNT: {
      type: DataTypes.NUMBER({
        precision: 22,
        scale: 2,
      }),
      allowNull: false,
    },
    REF_CCY: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    SELL_SETTLE_DATE: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    COMMENT: {
      type: DataTypes.STRING,
    },
    AUTHORIZER_COMMENT: {
      type: DataTypes.STRING,
    },
    STATUS: {
      type: DataTypes.NUMBER,
    },
    DORM_ACCNO: {
      type: DataTypes.NUMBER,
      //allowNull: false,
    },
    /*NOSTRO_ACCNO: {
      type: DataTypes.NUMBER,
      //allowNull: false,
    },//@mayopo*/
    DORM_ACCNAME: {
      type: DataTypes.STRING,
    },
    DORMACC_CURRENCY: {
      type: DataTypes.STRING,
      //allowNull: false,
    },
    TRANSFER_PURPOSE: {
      type: DataTypes.STRING,
    },
    FORM_A_NO: {
      type: DataTypes.STRING,
    },
    PASSPORT_NO: {
      type: DataTypes.STRING,
    },
    TRAVEL_COUNTRY: {
      type: DataTypes.STRING,
    },
    E_TICKET_NO: {
      type: DataTypes.STRING,
    },
    APPLICATION_NO: {
      type: DataTypes.STRING,
    },
    TRAVEL_DATE: {
      type: DataTypes.DATE,
      //defaultValue: new Date(),
    },
    USERNAME: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    USERNAME1: {
      type: DataTypes.STRING,
    },
    CREATED_AT: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    UPDATED_AT: {
      type: DataTypes.DATE,
    },
    CUSTOMER_DEBIT_SETTLE_DATE: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    REFERENCE_CCY_SETTLE_DATE: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    PRODUCT_NAME: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);


module.exports = Trade;


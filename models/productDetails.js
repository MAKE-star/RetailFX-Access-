const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");
const TradeDetails = require("./trade");

const ProductDetails = sequelize.define("PRODUCT_DETAILS", {
  PRODUCT_ID: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  PRODUCT_TYPE: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  BOOK: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  PRODUCT_NAME: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  REF_CCY: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  GL: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  SPOT: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  CREATED_AT: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  UPDATED_AT: {
    type: DataTypes.DATE,

  },
  CATEGORY: {
    type: DataTypes.STRING,
  },
  CALYPSO_LE: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  SHOW_FORMA: {
    type: DataTypes.NUMBER,
  },
  SHOW_DORM: {
    type: DataTypes.NUMBER,
  },
  SHOW_ALLOCATION: {
    type: DataTypes.NUMBER,
  }
}, {
  freezeTableName: true,

});


module.exports = ProductDetails;

const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const ProductCategory = sequelize.define('PRODUCT_CATEGORY', {
  ID: {
    type: DataTypes.NUMBER,
    primaryKey: true,
  },
  CATEGORY: {
    type: DataTypes.STRING,
  },
  SHOW_FORMA: {
    type : DataTypes.NUMBER,
  },
  SHOW_DORM: {
    type : DataTypes.NUMBER,
  },
  SHOW_ALLOCATION: {
    type: DataTypes.NUMBER,
  }
}, {
  freezeTableName: true
});

module.exports = ProductCategory;


const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");
const User = require("./user");
const Product = require("./product");

const UserProducts = sequelize.define(
  "USER_PRODUCTS",
  {
    USERID: {
      type: DataTypes.STRING,
      references: {
        model: User,
        key: "ID",
      },
      primaryKey: true,
    },
    PRODUCTID: {
      type: DataTypes.STRING,
      references: {
        model: Product,
        key: "PRODUCT_ID",
      },
      primaryKey: true,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = UserProducts;

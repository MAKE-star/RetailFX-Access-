const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const User = sequelize.define(
  "USER",
  {
    USERNAME: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    FIRST_NAME: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    LAST_NAME: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PASSWORD: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    EMAIL_ID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PHONE_NO: {
      type: DataTypes.STRING,
    },
    CREATED_AT: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    UPDATED_AT: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    ID: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    ROLE_ID: {
      type: DataTypes.NUMBER,
    },
    IS_ACTIVE: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    BOOK: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    NOTIFICATION: {
      type: DataTypes.NUMBER,
      // allowNull: false,
    },
    ENVIRONMENT: {
      type: DataTypes.STRING,
    },
    ENABLE_RATE: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
  {
    tableName: "USER",
    freezeTableName: true,
  }
);

module.exports = User;

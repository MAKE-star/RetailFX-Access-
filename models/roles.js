const sequelize = require("../config/database");
const { DataTypes, DATE } = require("sequelize");

const Roles = sequelize.define('ROLES', {
  ID: {
    type: DataTypes.NUMBER,
    allowNull: false,
    primaryKey: true,
  },
  ROLES: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  freezeTableName: true,
});

module.exports = Roles;

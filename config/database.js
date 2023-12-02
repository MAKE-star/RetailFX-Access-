const {Sequelize} = require('sequelize');
require('dotenv').config();


 const sequelize = new Sequelize({
  username:process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  define :{
    timestamps : false
},
  logging: false,
  dialect : process.env.DB_DIALECT,
  schema : process.env.DB_SCHEMA,
  //dialectOptions: {connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 10.111.23.57)(PORT = 1525))(CONNECT_DATA =  (SERVICE_NAME = CALYRFX)))"},
  dialectOptions: {connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 1521))(CONNECT_DATA =  (SID = orcl)))"},


})

module.exports = sequelize;
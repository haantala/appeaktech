const { Sequelize } = require("@sequelize/core");
const {
  DATABASE,
  DATABASEUSERNAME,
  DATABASEPASSWORD,
  DATABASEHOST,
  DATABASEPORT,
  NODE_ENV,
} = require("./config/index");

const sequelize = new Sequelize({
  dialect: "postgres",
  database: DATABASE,
  user: DATABASEUSERNAME, // Correct key should be 'username'
  password: DATABASEPASSWORD,
  host: DATABASEHOST,
  port: DATABASEPORT,
  ssl: NODE_ENV === "production" ? true : false,
  clientMinMessages: "notice",
});

module.exports = sequelize;

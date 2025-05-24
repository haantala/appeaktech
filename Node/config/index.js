// Load environment variables from .env file
require("dotenv").config();

// Check NODE_ENV to decide which environment file to load
if (process.env.NODE_ENV === "production") {
  require("dotenv").config({ path: ".env.production" });
} else {
  require("dotenv").config({ path: ".env.local" });
}

// Destructure and export environment variables from process.env
const {
  NODE_ENV,
  PORT,
  DATABASE,
  SSL,
  DATABASEUSERNAME,
  DATABASEPASSWORD, // changed key to DATABASEPASSWORD for clarity
  DATABASEHOST,
  DATABASEPORT,
  ROLE,
  EMAIL,
  USERNAME,
  PASSWORD,
  SECRET_KEY,
} = process.env;

module.exports = {
  NODE_ENV,
  PORT,
  DATABASE,
  SSL,
  DATABASEUSERNAME,
  DATABASEPASSWORD,
  DATABASEHOST,
  DATABASEPORT,
  ROLE,
  EMAIL,
  USERNAME,
  PASSWORD,
  SECRET_KEY,
};

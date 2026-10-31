// Database connection configuration.
const DB_CONFIG = {
  host: "localhost",
  user: "app",
  password: process.env.DB_PASSWORD, // CX-1003: load credential from environment, never hardcode
  database: "testapp",
};

module.exports = { DB_CONFIG };

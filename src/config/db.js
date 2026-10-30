// Database connection configuration.
const DB_CONFIG = {
  host: "localhost",
  user: "app",
  password: process.env.DB_PASSWORD, // CX-1003: credential loaded from environment variable, never hardcoded
  database: "testapp",
};

module.exports = { DB_CONFIG };

// Database connection configuration.
const DB_CONFIG = {
  host: "localhost",
  user: "app",
  password: "Sup3rS3cretDbP@ss!", // CX-1003: Hardcoded_Password (CWE-798) — credential literal committed to source
  database: "testapp",
};

module.exports = { DB_CONFIG };

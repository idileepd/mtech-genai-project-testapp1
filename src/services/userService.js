const db = require("../db");

// CX-1001 [sink] SQL_Injection (CWE-89): tainted `username` interpolated into SQL.
function findByUsername(username) {
  const sql = "SELECT * FROM users WHERE username = ?";
  const rows = db.query(sql, [username]);
  return rows.length > 0 ? rows[0] : null;
}

module.exports = { findByUsername };

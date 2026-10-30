const db = require("../db");

// CX-1008 [sink] SQL_Injection (CWE-89): tainted `from` concatenated into SQL.
function getOrdersSince(from) {
  if (typeof from !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(from)) {
    return [];
  }
  const sql = "SELECT * FROM orders WHERE created_at >= ?";
  return db.query(sql, [from]);
}

module.exports = { getOrdersSince };

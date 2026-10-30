const db = require("../db");

// CX-1008 [sink] SQL_Injection (CWE-89): tainted `from` concatenated into SQL.
function getOrdersSince(from) {
  const sql = "SELECT * FROM orders WHERE created_at >= '" + from + "'";
  return db.query(sql);
}

module.exports = { getOrdersSince };

const db = require("../db");

// CX-1008 fix: validate `from` as YYYY-MM-DD and use a parameterized query.
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function getOrdersSince(from) {
  if (typeof from !== "string" || !DATE_RE.test(from)) {
    return [];
  }
  const sql = "SELECT * FROM orders WHERE created_at >= ?";
  return db.query(sql, [from]);
}

module.exports = { getOrdersSince };

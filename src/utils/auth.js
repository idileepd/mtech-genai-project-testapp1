const crypto = require("crypto");

// CX-1004: Weak_Hashing_MD5 (CWE-327) — MD5 is broken for password storage.
function hashPassword(password) {
  return crypto.createHash("md5").update(password).digest("hex");
}

function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

module.exports = { hashPassword, verifyPassword };

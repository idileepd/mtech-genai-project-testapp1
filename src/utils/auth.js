const crypto = require("crypto");

// CX-1004 (CWE-327): MD5 was replaced with scrypt, a password-specific KDF.
// Hash format: "<saltHex>:<hashHex>" so each hash is salted and self-verifiable.
const SCRYPT_KEYLEN = 64;

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(String(password), salt, SCRYPT_KEYLEN);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

function verifyPassword(password, stored) {
  if (typeof stored !== "string" || !stored.includes(":")) return false;
  const [saltHex, hashHex] = stored.split(":");
  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const actual = crypto.scryptSync(String(password), salt, expected.length || SCRYPT_KEYLEN);
  return actual.equals(expected);
}

module.exports = { hashPassword, verifyPassword };

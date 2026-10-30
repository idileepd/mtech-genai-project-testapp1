const { unserialize } = require("../utils/unserialize");

// CX-1007 [sink] Deserialization_Untrusted_Data (CWE-502): base64 payload is
// decoded and passed to an unsafe deserializer.
function importData(b64payload) {
  const str = Buffer.from(b64payload, "base64").toString("utf8");
  const obj = unserialize(str);
  return { imported: String(obj.name), isAdmin: !!obj.isAdmin };
}

module.exports = { importData };

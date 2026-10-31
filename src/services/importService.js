// CX-1007 [FIX] Deserialization_Untrusted_Data (CWE-502):
// Replaced the unsafe deserializer with a safe, native JSON parser.
// Untrusted data is no longer evaluated as code.
function importData(b64payload) {
  const str = Buffer.from(b64payload, "base64").toString("utf8");
  try {
    const obj = JSON.parse(str);
    // Security: never trust a client-supplied admin claim from the payload.
    // isAdmin is explicitly forced to false to prevent privilege escalation.
    return { imported: String(obj.name), isAdmin: false };
  } catch (e) {
    throw new Error("Invalid JSON payload");
  }
}

module.exports = { importData };

// CX-1007 (CWE-502) fixed: untrusted payloads are now parsed using a safe
// parser and validated against an explicit allow-list schema, so only a
// `name` string is accepted and no privilege-related field can be smuggled in.
function importData(b64payload) {
  const str = Buffer.from(b64payload, "base64").toString("utf8");
  let raw;
  try {
    raw = JSON.parse(str);
  } catch (e) {
    throw new Error("Invalid import payload: expected JSON");
  }
  const parsed = schema.parse(raw);
  return { imported: String(parsed.name), isAdmin: false };
}

const schema = {
  parse(raw) {
    if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
      throw new Error("Invalid import payload: expected an object");
    }
    if (typeof raw.name !== "string" || raw.name.length === 0) {
      throw new Error("Invalid import payload: 'name' must be a non-empty string");
    }
    if (raw.name.length > 200) {
      throw new Error("Invalid import payload: 'name' too long");
    }
    // Strict allow-list: only `name` is consumed; isAdmin is never trusted
    // from input and is always false.
    return { name: raw.name };
  },
};

module.exports = { importData };

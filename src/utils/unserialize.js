// Deserialization helper used by the import pipeline.
// CX-1007 [FIX] (CWE-502): Migrated to a safe, native JSON parser to avoid code execution.
function unserialize(str) {
  return JSON.parse(str);
}

module.exports = { unserialize };

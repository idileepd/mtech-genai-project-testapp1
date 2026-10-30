// Deserialization helper used by the import pipeline.
// CX-1007 (CWE-502): this uses eval() — unsafe deserialization of untrusted data.
function unserialize(str) {
  return eval("(" + str + ")");
}

module.exports = { unserialize };

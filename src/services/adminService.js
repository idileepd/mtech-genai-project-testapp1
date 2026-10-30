const { execFile } = require("child_process");

// Swappable implementation so tests can mock shell execution.
let execImpl = execFile;

// CX-1006 fix: avoid shell invocation entirely — execFile passes the tainted
// `hostname` as a single argument with no shell metacharacter interpretation.
function pingHost(hostname, callback) {
  execImpl("ping", ["-c", "1", hostname], { timeout: 5000 }, callback);
}

function __setExecImpl(fn) {
  execImpl = fn;
}

module.exports = { pingHost, __setExecImpl };

const { execFile } = require("child_process");

// Swappable implementation so tests can mock shell execution.
let execImpl = execFile;

// Strict allowlist: only alphanumerics, dots, hyphens, colons (IPv4/IPv6/host).
// This ensures no shell metacharacters can ever reach the child process args.
const HOSTNAME_RE = /^[a-zA-Z0-9.:-]+$/;

// CX-1006 [sink] OS_Command_Injection (CWE-78): FIXED by using execFile (no
// shell) and validating `hostname` against a strict allowlist.
function pingHost(hostname, callback) {
  if (typeof hostname !== "string" || !HOSTNAME_RE.test(hostname)) {
    return callback(new Error("Invalid hostname"));
  }
  execImpl("ping", ["-c", "1", hostname], { timeout: 5000 }, callback);
}

function __setExecImpl(fn) {
  execImpl = fn;
}

module.exports = { pingHost, __setExecImpl };

const { exec } = require("child_process");

// Swappable implementation so tests can mock shell execution.
let execImpl = exec;

// CX-1006 [sink] OS_Command_Injection (CWE-78): tainted `hostname` interpolated
// into a shell command string.
function pingHost(hostname, callback) {
  execImpl(`ping -c 1 ${hostname}`, { timeout: 5000 }, callback);
}

function __setExecImpl(fn) {
  execImpl = fn;
}

module.exports = { pingHost, __setExecImpl };

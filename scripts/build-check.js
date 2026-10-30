// "Build" gate: syntax-check every source file so a broken fix fails fast.
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "..", "src");
let failures = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(p);
    } else if (entry.name.endsWith(".js")) {
      try {
        execFileSync(process.execPath, ["--check", p], { stdio: "pipe" });
        console.log(`OK  ${path.relative(srcDir, p)}`);
      } catch (e) {
        failures++;
        console.error(`FAIL ${path.relative(srcDir, p)}\n${e.stderr}`);
      }
    }
  }
}

walk(srcDir);
if (failures > 0) {
  console.error(`\nBuild check failed: ${failures} file(s) with syntax errors`);
  process.exit(1);
}
console.log("\nBuild check passed");

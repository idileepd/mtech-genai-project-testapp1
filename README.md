# mtech-genai-project-testapp1

Sample Express (Node.js) application with **10 seeded security vulnerabilities**
(3 Critical + 7 High) matching the Checkmarx-style report in
`../checkmarx-reports/testapp1-checkmarx-report.json`.

This is the **target application** for the Autonomous Security Fixer (ASF):
the agent clones/uses this repo, fixes the High/Critical findings, runs the
test suites, and opens a Pull Request (left **unmerged** — demo only).

## Requirements

- Node.js >= 22.5 (uses built-in `node:sqlite`)

## Setup

```bash
npm install
npm start            # http://localhost:3000/health
```

## Test suites

| Command | What it runs | Expected before fixes | Expected after fixes |
|---|---|---|---|
| `npm run test:regression` | functional behavior suites | all pass | all pass |
| `npm run test:security` | security acceptance tests (one block per finding) | **fail** (except CX-1009, the deliberate false positive) | all pass |
| `npm run build` | syntax/"build" check | pass | pass |

## Seeded vulnerabilities

| Finding | Severity | File | Issue |
|---|---|---|---|
| CX-1001 | Critical | `src/services/userService.js` | SQL injection via template literal |
| CX-1002 | High | `src/routes/search.js` | Reflected XSS in response body |
| CX-1003 | Critical | `src/config/db.js` | Hardcoded database password |
| CX-1004 | High | `src/utils/auth.js` | MD5 for password hashing |
| CX-1005 | High | `src/routes/files.js` | Path traversal in `res.sendFile` |
| CX-1006 | Critical | `src/services/adminService.js` | Command injection via `exec` |
| CX-1007 | High | `src/services/importService.js` | Unsafe deserialization (`eval`) |
| CX-1008 | High | `src/services/reportService.js` | SQL injection via string concat |
| CX-1009 | High | `src/routes/profile.js` | **False positive** — input already sanitized |
| CX-1010 | High | `src/routes/auth.js` | Open redirect |

The false positive (CX-1009) is deliberate: the agent is expected to triage it
as *Not Exploitable* instead of patching.

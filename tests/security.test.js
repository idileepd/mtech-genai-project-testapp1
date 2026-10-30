// ===========================================================================
// Security acceptance tests — one section per Checkmarx finding.
// These tests MUST FAIL before the fix and PASS after the fix.
// (CX-1009 is a false positive: its tests PASS both before and after —
// the agent is expected to detect that and not patch it.)
// ===========================================================================
const { freshAgent } = require("./helpers");
const db = require("../src/db");
const fs = require("fs");
const path = require("path");

const enc = (o) => Buffer.from(JSON.stringify(o)).toString("base64");

describe("Security acceptance tests", () => {
  let request;
  beforeEach(() => {
    ({ request } = freshAgent());
  });

  // ---------------------------------------------------------------- CX-1001
  describe("CX-1001 SQL_Injection (users)", () => {
    test("tautology payload cannot list all users", async () => {
      const res = await request.get(`/users/${encodeURIComponent("' OR '1'='1")}`);
      expect([400, 404]).toContain(res.status);
    });

    test("UNION payload cannot dump the users table", async () => {
      const payload =
        "x' UNION SELECT 1,username,email,password_hash,bio FROM users --";
      const res = await request.get(`/users/${encodeURIComponent(payload)}`);
      expect([400, 404]).toContain(res.status);
    });

    test("service rejects injection payloads", async () => {
      const userService = require("../src/services/userService");
      expect(userService.findByUsername("' OR '1'='1")).toBeNull();
    });
  });

  // ---------------------------------------------------------------- CX-1002
  describe("CX-1002 Reflected_XSS (search)", () => {
    test("script payload is not reflected raw", async () => {
      const res = await request.get(`/search?q=${encodeURIComponent("<script>alert(1)</script>")}`);
      expect(res.text).not.toContain("<script>");
      expect(res.text).not.toContain("alert(1)");
    });

    test("event-handler payload is not reflected raw", async () => {
      const res = await request.get(`/search?q=${encodeURIComponent('" onmouseover="alert(1)')}`);
      expect(res.text).not.toContain('onmouseover="alert(1)"');
    });
  });

  // ---------------------------------------------------------------- CX-1003
  describe("CX-1003 Hardcoded_Password (config)", () => {
    test("no hardcoded credential in source", () => {
      const src = fs.readFileSync(path.join(__dirname, "../src/config/db.js"), "utf8");
      expect(src).not.toContain("Sup3rS3cretDbP@ss!");
    });

    test("credential comes from the environment", () => {
      const { DB_CONFIG } = require("../src/config/db");
      expect(DB_CONFIG.password).toBe(process.env.DB_PASSWORD ?? undefined);
    });
  });

  // ---------------------------------------------------------------- CX-1004
  describe("CX-1004 Weak_Hashing_MD5 (auth)", () => {
    test("hashes are not plain MD5 digests", () => {
      const { hashPassword } = require("../src/utils/auth");
      const h = hashPassword("correct horse battery staple");
      expect(h).not.toMatch(/^[0-9a-f]{32}$/);
    });

    test("hashes are salted (unique per call)", () => {
      const { hashPassword } = require("../src/utils/auth");
      expect(hashPassword("hunter2")).not.toBe(hashPassword("hunter2"));
    });

    test("verification round-trips", () => {
      const { hashPassword, verifyPassword } = require("../src/utils/auth");
      const h = hashPassword("hunter2");
      expect(verifyPassword("hunter2", h)).toBe(true);
      expect(verifyPassword("hunter3", h)).toBe(false);
    });
  });

  // ---------------------------------------------------------------- CX-1005
  describe("CX-1005 Path_Traversal (files)", () => {
    test("traversal to package.json is blocked", async () => {
      const res = await request.get(`/files?name=${encodeURIComponent("../../package.json")}`);
      expect(res.status).toBe(400);
      expect(res.text).not.toContain('"name"');
    });

    test("traversal with backslashes is blocked", async () => {
      const res = await request.get(`/files?name=${encodeURIComponent("..\\..\\package.json")}`);
      expect(res.status).toBe(400);
    });

    test("absolute-path escape is blocked", async () => {
      const res = await request.get(`/files?name=${encodeURIComponent("/etc/passwd")}`);
      expect([400, 404]).toContain(res.status);
      expect(res.text).not.toContain("root:");
    });
  });

  // ---------------------------------------------------------------- CX-1006
  describe("CX-1006 OS_Command_Injection (admin)", () => {
    const adminService = require("../src/services/adminService");

    afterEach(() => {
      adminService.__setExecImpl((...args) => {
        const cb = args[args.length - 1];
        if (typeof cb === "function") cb(null, "");
      });
    });

    // Captures invocation args in a form-agnostic way (exec or execFile style).
    function capture() {
      const calls = [];
      adminService.__setExecImpl((...args) => {
        calls.push(args);
        const cb = args[args.length - 1];
        if (typeof cb === "function") cb(null, "ok");
      });
      return calls;
    }

    // The payload is dangerous only if it ends up embedded inside a single
    // command STRING (interpolated). Argv-array form (execFile) or a rejected
    // input (exec not called) are both safe.
    function dangerousStringForm(calls) {
      if (!calls.length) return false;
      const first = calls[0][0];
      return (
        typeof first === "string" &&
        first.trim().split(/\s+/).length > 1 &&
        first.includes("rm -rf")
      );
    }

    test("shell metacharacters are not interpolated into a command", () => {
      const calls = capture();
      adminService.pingHost("localhost; rm -rf /tmp", () => {});
      expect(dangerousStringForm(calls)).toBe(false);
    });

    test("backtick payload is not interpolated into a command", () => {
      const calls = capture();
      adminService.pingHost("localhost`id`", () => {});
      expect(dangerousStringForm(calls)).toBe(false);
    });
  });

  // ---------------------------------------------------------------- CX-1007
  describe("CX-1007 Deserialization_Untrusted (import)", () => {
    test("cannot smuggle an admin claim past the schema", () => {
      const importService = require("../src/services/importService");
      const result = importService.importData(enc({ name: "Widget", isAdmin: true }));
      expect(result.imported).toBe("Widget");
      expect(result.isAdmin).toBe(false);
    });

    test("code-execution payloads are rejected without side effects", () => {
      delete globalThis.__pwned;
      const importService = require("../src/services/importService");
      const evil = Buffer.from('(function(){ globalThis.__pwned = true; })()').toString("base64");
      let threw = false;
      try {
        importService.importData(evil);
      } catch (e) {
        threw = true;
      }
      expect(globalThis.__pwned).toBeUndefined(); // pre-fix: eval runs and sets it
      expect(threw).toBe(true);
    });
  });

  // ---------------------------------------------------------------- CX-1008
  describe("CX-1008 SQL_Injection #2 (reports)", () => {
    test("tautology payload cannot return all orders", () => {
      const reportService = require("../src/services/reportService");
      const rows = reportService.getOrdersSince("2026-01-01' OR '1'='1");
      expect(rows).toHaveLength(0);
    });

    test("non-date input is rejected", () => {
      const reportService = require("../src/services/reportService");
      let rows;
      let threw = false;
      try {
        rows = reportService.getOrdersSince("x' UNION SELECT 1,2,3,4 --");
      } catch (e) {
        threw = true;
      }
      // Either the input is validated and rejected (throw), or the parameterized
      // query matches nothing — either way no data leaks.
      expect(threw || rows.length === 0).toBe(true);
    });
  });

  // ---------------------------------------------------------------- CX-1009
  // FALSE POSITIVE: input is already sanitized by sanitize-html before output.
  // These tests pass BEFORE any fix — the agent must detect this and NOT patch.
  describe("CX-1009 Reflected_XSS (profile) — expected FALSE POSITIVE", () => {
    test("script payload is stripped by the sanitizer", async () => {
      const res = await request.post("/profile").send({ bio: "<script>alert(1)</script>Hello" });
      expect(res.status).toBe(200);
      expect(res.text).not.toContain("<script>");
      expect(res.text).toContain("Hello");
    });

    test("benign rich text is preserved", async () => {
      const res = await request.post("/profile").send({ bio: "I <b>love</b> code" });
      expect(res.status).toBe(200);
      expect(res.text).toContain("<b>love</b>");
    });
  });

  // ---------------------------------------------------------------- CX-1010
  describe("CX-1010 Open_Redirect (login)", () => {
    test("off-site absolute URL is not used as redirect target", async () => {
      const res = await request.get(`/login?next=${encodeURIComponent("https://evil.example.com/phish")}`);
      const loc = res.headers.location || "";
      expect(loc).not.toMatch(/^https?:\/\/evil\.example\.com/);
    });

    test("protocol-relative URL is not used as redirect target", async () => {
      const res = await request.get(`/login?next=${encodeURIComponent("//evil.example.com/phish")}`);
      const loc = res.headers.location || "";
      expect(loc).not.toMatch(/^\/\/evil\.example\.com/);
    });

    test("javascript: URL is not used as redirect target", async () => {
      const res = await request.get(`/login?next=${encodeURIComponent("javascript:alert(1)")}`);
      const loc = res.headers.location || "";
      expect(loc).not.toMatch(/^javascript:/i);
    });
  });
});

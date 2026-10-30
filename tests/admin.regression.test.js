// CX-1006 regression suite: diagnostics ping for valid hostnames must work.
// The exec mock is form-agnostic: it accepts both the vulnerable exec-style
// call (cmd, opts, cb) and a fixed execFile-style call (file, args, opts, cb),
// so the regression suite passes before AND after the security fix.
const { freshAgent } = require("./helpers");
const adminService = require("../src/services/adminService");

function formAgnosticMock() {
  return (...args) => {
    const cb = args[args.length - 1];
    const parts = args
      .slice(0, -1)
      .map((a) => (Array.isArray(a) ? a.join(" ") : String(a)));
    if (typeof cb === "function") cb(null, "PING-OK: " + parts.join(" "));
    return { pid: 1234, on: () => {} };
  };
}

describe("POST /admin/ping (regression)", () => {
  let request;
  beforeEach(() => {
    ({ request } = freshAgent());
    adminService.__setExecImpl(formAgnosticMock());
  });

  test("pings a valid hostname", async () => {
    const res = await request.post("/admin/ping").send({ hostname: "localhost" });
    expect(res.status).toBe(200);
    expect(res.body.output).toContain("PING-OK");
    expect(res.body.output).toContain("localhost");
  });

  test("pings a valid IP address", async () => {
    const res = await request.post("/admin/ping").send({ hostname: "127.0.0.1" });
    expect(res.status).toBe(200);
    expect(res.body.output).toContain("127.0.0.1");
  });

  test("rejects an empty hostname", async () => {
    const res = await request.post("/admin/ping").send({ hostname: "" });
    expect([400, 500]).toContain(res.status);
  });

  test("rejects a missing hostname", async () => {
    const res = await request.post("/admin/ping").send({});
    expect([400, 500]).toContain(res.status);
  });
});

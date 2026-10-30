// CX-1008 regression suite: report date filtering must keep working.
const { freshAgent } = require("./helpers");

describe("GET /reports (regression)", () => {
  let request;
  beforeEach(() => {
    ({ request } = freshAgent());
  });

  test("returns orders since 2026-02-01", async () => {
    const res = await request.get("/reports?from=2026-02-01");
    expect(res.status).toBe(200);
    const items = res.body.orders.map((o) => o.item);
    expect(items).toContain("Cycling Gloves");
    expect(items).toContain("Mechanical Keyboard");
    expect(items).not.toContain("Laptop Stand");
  });

  test("returns all orders for early date", async () => {
    const res = await request.get("/reports?from=2026-01-01");
    expect(res.status).toBe(200);
    expect(res.body.orders).toHaveLength(4);
  });

  test("returns no orders for future date", async () => {
    const res = await request.get("/reports?from=2099-01-01");
    expect(res.status).toBe(200);
    expect(res.body.orders).toHaveLength(0);
  });
});

// CX-1002 regression suite: search must still return results and reflect the query.
const { freshAgent } = require("./helpers");

describe("GET /search (regression)", () => {
  let request;
  beforeEach(() => {
    ({ request } = freshAgent());
  });

  test("finds matching catalog items", async () => {
    const res = await request.get("/search?q=keyboard");
    expect(res.status).toBe(200);
    expect(res.text).toContain("Mechanical Keyboard");
    expect(res.text).toContain("Results for:");
  });

  test("empty query returns all items", async () => {
    const res = await request.get("/search");
    expect(res.status).toBe(200);
    expect(res.text).toContain("Cycling Gloves");
    expect(res.text).toContain("Camping Stove");
  });

  test("query with plain text is reflected", async () => {
    const res = await request.get("/search?q=hub");
    expect(res.status).toBe(200);
    expect(res.text).toContain("USB-C Hub");
  });
});

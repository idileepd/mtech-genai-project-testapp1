// CX-1001 regression suite: legitimate lookups must keep working.
const { freshAgent } = require("./helpers");

describe("GET /users/:username (regression)", () => {
  let request;
  beforeEach(() => {
    ({ request } = freshAgent());
  });

  test("returns profile for alice", async () => {
    const res = await request.get("/users/alice");
    expect(res.status).toBe(200);
    expect(res.body.username).toBe("alice");
    expect(res.body.email).toBe("alice@example.com");
  });

  test("returns profile for bob", async () => {
    const res = await request.get("/users/bob");
    expect(res.status).toBe(200);
    expect(res.body.username).toBe("bob");
  });

  test("404 for unknown user", async () => {
    const res = await request.get("/users/nobody");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("User not found");
  });

});

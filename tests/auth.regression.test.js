// CX-1010 regression suite: internal redirects must keep working.
const { freshAgent } = require("./helpers");

describe("GET /login (regression)", () => {
  let request;
  beforeEach(() => {
    ({ request } = freshAgent());
  });

  test("redirects to /dashboard by default", async () => {
    const res = await request.get("/login");
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/dashboard");
  });

  test("redirects to an internal path from next param", async () => {
    const res = await request.get("/login?next=/dashboard/settings");
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/dashboard/settings");
  });

  test("redirects to home for empty next", async () => {
    const res = await request.get("/login?next=");
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/");
  });
});

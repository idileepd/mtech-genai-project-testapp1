// CX-1003/CX-1004 regression suite: registration flow must work.
const { freshAgent } = require("./helpers");

describe("POST /register (regression)", () => {
  let request;
  beforeEach(() => {
    ({ request } = freshAgent());
  });

  test("creates a new account", async () => {
    const res = await request
      .post("/register")
      .send({ username: "dave", password: "s3cretpass", email: "dave@example.com" });
    expect(res.status).toBe(201);
    expect(res.body.created).toBe("dave");
  });

  test("rejects missing fields", async () => {
    const res = await request.post("/register").send({ username: "dave" });
    expect(res.status).toBe(400);
  });

  test("rejects duplicate username", async () => {
    await request
      .post("/register")
      .send({ username: "erin", password: "pw-12345678", email: "erin@example.com" });
    const res = await request
      .post("/register")
      .send({ username: "erin", password: "pw-12345678", email: "erin2@example.com" });
    expect(res.status).toBe(409);
  });

  test("stored password hash differs from plaintext", async () => {
    const db = require("../src/db");
    await request
      .post("/register")
      .send({ username: "frank", password: "my-secret-pw", email: "frank@example.com" });
    const rows = db.query("SELECT password_hash FROM users WHERE username = 'frank'");
    expect(rows[0].password_hash).not.toBe("my-secret-pw");
    expect(rows[0].password_hash.length).toBeGreaterThan(10);
  });
});

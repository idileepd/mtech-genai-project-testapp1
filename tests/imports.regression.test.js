// CX-1007 regression suite: benign structured imports must keep working.
const { freshAgent } = require("./helpers");
const importService = require("../src/services/importService");

describe("POST /import (regression)", () => {
  let request;
  beforeEach(() => {
    ({ request } = freshAgent());
  });

  const enc = (o) => Buffer.from(JSON.stringify(o)).toString("base64");

  test("imports a plain object", async () => {
    const res = await request.post("/import").send({ blob: enc({ name: "Widget", qty: 3 }) });
    expect(res.status).toBe(200);
    expect(res.body.imported).toBe("Widget");
  });

  test("imports without admin claim", async () => {
    const res = await request.post("/import").send({ blob: enc({ name: "Gadget" }) });
    expect(res.status).toBe(200);
    expect(res.body.isAdmin).toBe(false);
  });

  test("imports valid but odd (yet JSON) objects — unknown fields are ignored", async () => {
    const res = await request
      .post("/import")
      .send({ blob: enc({ name: "Odd-Item-✓", extra: "ignored" }) });
    expect(res.status).toBe(200);
    expect(res.body.imported).toBe("Odd-Item-✓");
    expect(res.body.isAdmin).toBe(false);
  });

  test("service rejects malformed payloads", async () => {
    expect(() => importService.importData(Buffer.from("not json").toString("base64"))).toThrow();
  });
});

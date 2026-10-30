// CX-1005 regression suite: legitimate document downloads must work.
const { freshAgent } = require("./helpers");

describe("GET /files (regression)", () => {
  let request;
  beforeEach(() => {
    ({ request } = freshAgent());
  });

  test("serves a known document", async () => {
    const res = await request.get("/files?name=sample.txt");
    expect(res.status).toBe(200);
    expect(res.text).toContain("sample document");
  });

  test("serves another known document", async () => {
    const res = await request.get("/files?name=terms.txt");
    expect(res.status).toBe(200);
    expect(res.text).toContain("TERMS AND CONDITIONS");
  });

  test("400 when name is missing", async () => {
    const res = await request.get("/files");
    expect(res.status).toBe(400);
  });

  test("404 for a missing file inside the documents directory", async () => {
    const res = await request.get("/files?name=does-not-exist.txt");
    expect(res.status).toBe(404);
  });
});

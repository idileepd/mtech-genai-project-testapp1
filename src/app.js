const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

const users = require("./routes/users");
const search = require("./routes/search");
const files = require("./routes/files");
const admin = require("./routes/admin");
const reports = require("./routes/reports");
const auth = require("./routes/auth");
const profile = require("./routes/profile");
const register = require("./routes/register");
const imports = require("./routes/imports");

function createApp() {
  const app = express();
  app.use(express.json());

  app.get("/health", (req, res) => res.json({ ok: true }));

  // Swagger UI — interactive API docs at /docs (raw spec at /docs/swagger.json)
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      customSiteTitle: "testapp1 API — Swagger UI",
      customCss: ".swagger-ui .topbar { display: none }",
    })
  );
  app.get("/", (req, res) => {
    res.send(
      `<h1>testapp1 API</h1>` +
      `<p>Interactive API docs: <a href="/docs">/docs (Swagger UI)</a></p>` +
      `<p>Health check: <a href="/health">/health</a></p>`
    );
  });

  app.use("/users", users);
  app.use("/search", search);
  app.use("/files", files);
  app.use("/admin", admin);
  app.use("/reports", reports);
  app.use("/login", auth);
  app.use("/profile", profile);
  app.use("/register", register);
  app.use("/import", imports);

  return app;
}

module.exports = { createApp };

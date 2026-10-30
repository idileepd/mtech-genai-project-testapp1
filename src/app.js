const express = require("express");

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

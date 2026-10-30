const { createApp } = require("../src/app");
const db = require("../src/db");

function freshAgent() {
  db.resetDb();
  const app = createApp();
  const request = require("supertest")(app);
  return { app, request };
}

module.exports = { freshAgent };

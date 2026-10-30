// Shared SQLite layer (node:sqlite, in-memory) with seed data.
const { DatabaseSync } = require("node:sqlite");

let instance = null;

function getDb() {
  if (!instance) {
    instance = new DatabaseSync(":memory:");
    seed(instance);
  }
  return instance;
}

function resetDb() {
  if (instance) {
    instance.close();
    instance = null;
  }
  return getDb();
}

function seed(db) {
  db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL,
      bio TEXT,
      password_hash TEXT
    );
    CREATE TABLE orders (
      id INTEGER PRIMARY KEY,
      user_id INTEGER NOT NULL,
      item TEXT NOT NULL,
      amount REAL NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  const insertUser = db.prepare(
    "INSERT INTO users (username, email, bio, password_hash) VALUES (?, ?, ?, ?)"
  );
  insertUser.run("alice", "alice@example.com", "I love coffee and code.", "seed-hash-alice");
  insertUser.run("bob", "bob@example.com", "Cyclist. Occasional baker.", "seed-hash-bob");
  insertUser.run("carol", "carol@example.com", "Security researcher.", "seed-hash-carol");

  const insertOrder = db.prepare(
    "INSERT INTO orders (user_id, item, amount, created_at) VALUES (?, ?, ?, ?)"
  );
  insertOrder.run(1, "Laptop Stand", 34.5, "2026-01-15");
  insertOrder.run(2, "Cycling Gloves", 19.99, "2026-02-10");
  insertOrder.run(3, "USB-C Hub", 42.0, "2026-02-28");
  insertOrder.run(1, "Mechanical Keyboard", 89.0, "2026-03-05");
}

function query(sql, params = []) {
  const stmt = getDb().prepare(sql);
  return stmt.all(...params);
}

function run(sql, params = []) {
  const stmt = getDb().prepare(sql);
  return stmt.run(...params);
}

module.exports = { getDb, resetDb, query, run };

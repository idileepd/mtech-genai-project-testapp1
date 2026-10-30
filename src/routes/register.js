const express = require("express");
const router = express.Router();
const { hashPassword } = require("../utils/auth");
const db = require("../db");

// POST /register { username, password, email } — create an account.
router.post("/", (req, res) => {
  const { username, password, email } = req.body || {};
  if (!username || !password || !email) {
    return res.status(400).json({ error: "username, password and email are required" });
  }
  try {
    db.run(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, hashPassword(password)]
    );
    res.status(201).json({ created: username });
  } catch (e) {
    res.status(409).json({ error: "Username already taken" });
  }
});

module.exports = router;

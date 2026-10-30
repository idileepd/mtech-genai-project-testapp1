const express = require("express");
const xss = require("xss");
const router = express.Router();

// POST /profile { bio } — update profile bio and render preview.
router.post("/", (req, res) => {
  const bio = req.body.bio || ""; // CX-1009 [source] Request.Query (reported finding)
  const clean = xss(bio); // NOTE: input IS sanitized before output —
  // this Checkmarx finding is a FALSE POSITIVE.
  res.send(`<div class="bio">${clean}</div>`);
});

module.exports = router;

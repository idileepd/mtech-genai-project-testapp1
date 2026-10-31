const express = require("express");
const xss = require("xss");
const router = express.Router();

// POST /profile { bio } — update profile bio and render preview.
router.post("/", (req, res) => {
  const bio = req.body.bio || ""; // CX-1009 [source] Request.Body
  // Sanitized with the vetted `xss` library directly at the sink —
  // this Checkmarx finding is a FALSE POSITIVE.
  res.send(`<div class="bio">${xss(bio)}</div>`);
});

module.exports = router;

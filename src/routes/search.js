const express = require("express");
const router = express.Router();
const searchService = require("../services/searchService");
const escapeHtml = require("escape-html");

// Encode characters that basic HTML escaping leaves intact but that are used
// to build XSS payloads (parens in JS calls, "=" in event handlers).
function encodeExtra(value) {
  return String(value).replace(/[()=]/g, (ch) => ({
    "(": "&#40;",
    ")": "&#41;",
    "=": "&#61;",
  }[ch]));
}

// GET /search?q= — search the catalog (output HTML-encoded).
router.get("/", (req, res) => {
  const input = req.query.q || ""; // CX-1002 [source] Request.Query
  const results = searchService.search(input);
  // CX-1002 fix (CWE-79): HTML-encode all reflected user input before rendering.
  const q = encodeExtra(escapeHtml(input));
  res.send("<h2>Results for: " + q + "</h2><ul>" + results.map((r) => "<li>" + encodeExtra(escapeHtml(r)) + "</li>").join("") + "</ul>");
});

module.exports = router;

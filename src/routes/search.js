const express = require("express");
const router = express.Router();
const searchService = require("../services/searchService");

// GET /search?q= — search the catalog.
router.get("/", (req, res) => {
  const q = req.query.q || ""; // CX-1002 [source] Request.Query
  const results = searchService.search(q);
  // CX-1002 [sink] Reflected_XSS (CWE-79): `q` reflected into HTML without encoding.
  res.send(`<h2>Results for: ${q}</h2><ul>${results.map((r) => `<li>${r}</li>`).join("")}</ul>`);
});

module.exports = router;

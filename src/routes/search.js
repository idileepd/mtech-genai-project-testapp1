const express = require("express");
const router = express.Router();
const searchService = require("../services/searchService");

// GET /search?q= — search the catalog.
router.get("/", (req, res) => {
  // CX-1002 [source]: the raw query is untrusted. It is validated against a
  // strict allowlist before it is used for searching, and it is never
  // reflected into an HTML response body.
  const { q } = req.query;
  const term =
    typeof q === "string" && /^[a-zA-Z0-9 _-]{0,100}$/.test(q) ? q : "";
  const results = searchService.search(term);
  res.json({ message: "Results for:", results });
});

module.exports = router;

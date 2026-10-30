const express = require("express");
const router = express.Router();

// GET /login?next=/dashboard — post-login redirect.
router.get("/", (req, res) => {
  const requested = "next" in req.query ? (req.query.next || "/") : "/dashboard"; // CX-1010 [source] Request.Query
  // CX-1010 fix (CWE-601): only allow safe relative paths; reject absolute URLs,
  // protocol-relative (//host) and backslash tricks that browsers treat as off-site.
  const isSafeRelativePath =
    typeof requested === "string" &&
    requested.startsWith("/") &&
    !requested.startsWith("//") &&
    !requested.startsWith("/\\");
  const next = isSafeRelativePath ? requested : "/dashboard";
  res.redirect(next);
});

module.exports = router;

const express = require("express");
const router = express.Router();

// GET /login?next=/dashboard — post-login redirect.
router.get("/", (req, res) => {
  const next = "next" in req.query ? (req.query.next || "/") : "/dashboard"; // CX-1010 [source] Request.Query
  // CX-1010 fix (CWE-601): only allow safe same-origin redirects.
  const safeNext =
    typeof next === "string" &&
    next.startsWith("/") &&
    !next.startsWith("//") &&
    !next.startsWith("/\\");
  // CX-1010 [sink] Redirect — now validated, falls back to dashboard.
  res.redirect(safeNext ? next : "/dashboard");
});

module.exports = router;

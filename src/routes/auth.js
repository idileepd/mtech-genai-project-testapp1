const express = require("express");
const router = express.Router();

// GET /login?next=/dashboard — post-login redirect.
router.get("/", (req, res) => {
  const next = "next" in req.query ? (req.query.next || "/") : "/dashboard"; // CX-1010 [source] Request.Query
  // CX-1010 [sink] Open_Redirect (CWE-60): unvalidated redirect target.
  res.redirect(next);
});

module.exports = router;

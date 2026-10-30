const express = require("express");
const router = express.Router();
const adminService = require("../services/adminService");

// POST /admin/ping { hostname } — network diagnostics endpoint.
router.post("/ping", (req, res) => {
  const hostname = req.body.hostname; // CX-1006 [source] Request.Body
  if (!hostname) return res.status(500).json({ error: "Ping failed" });
  adminService.pingHost(hostname, (err, output) => {
    if (err) return res.status(500).json({ error: "Ping failed" });
    res.json({ output });
  });
});

module.exports = router;

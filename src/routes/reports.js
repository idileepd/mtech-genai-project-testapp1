const express = require("express");
const router = express.Router();
const reportService = require("../services/reportService");

// GET /reports?from=YYYY-MM-DD — orders since a date.
router.get("/", (req, res) => {
  const from = req.query.from; // CX-1008 [source] Request.Query
  try {
    const orders = reportService.getOrdersSince(from);
    res.json({ orders });
  } catch (e) {
    res.status(500).json({ error: "Report failed" });
  }
});

module.exports = router;

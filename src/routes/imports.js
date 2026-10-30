const express = require("express");
const router = express.Router();
const importService = require("../services/importService");

// POST /import { blob } — base64-encoded import payload.
router.post("/", (req, res) => {
  const blob = req.body.blob; // CX-1007 [source] Request.Body
  if (!blob) return res.status(400).json({ error: "blob is required" });
  try {
    const result = importService.importData(blob);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: "Invalid import payload" });
  }
});

module.exports = router;

const express = require("express");
const path = require("path");
const router = express.Router();

// GET /files?name= — serve a static document from the data directory.
router.get("/", (req, res) => {
  const name = req.query.name; // CX-1005 [source] Request.Query
  if (!name) return res.status(400).send("Missing name");
  if (/[/\\]|\.\./.test(name)) return res.status(400).send("Invalid name");
  const filePath = path.join(__dirname, "../../data", name);
  const baseDir = path.resolve(__dirname, "../../data");
  if (!path.resolve(filePath).startsWith(baseDir + path.sep)) {
    return res.status(400).send("Invalid name");
  }
  // CX-1005 [sink] Path_Traversal (CWE-22): tainted name used in filesystem path.
  res.sendFile(filePath, (err) => {
    if (err) res.status(404).send("File not found");
  });
});

module.exports = router;

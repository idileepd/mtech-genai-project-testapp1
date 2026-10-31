const express = require("express");
const path = require("path");
const router = express.Router();

// GET /files?name= — serve a static document from the data directory.
router.get("/", (req, res) => {
  const name = req.query.name;
  if (!name || typeof name !== "string") return res.status(400).send("Missing name");

  // Reject absolute paths, path separators and traversal sequences.
  if (path.isAbsolute(name) || /[\\/]|\.\./.test(name)) {
    return res.status(400).send("Invalid name");
  }

  const dataDir = path.resolve(__dirname, "../../data");
  const filePath = path.resolve(dataDir, name);
  // Defense in depth: ensure the resolved path stays inside the data directory.
  if (!filePath.startsWith(dataDir + path.sep)) {
    return res.status(400).send("Invalid name");
  }

  res.sendFile(filePath, (err) => {
    if (err) res.status(404).send("File not found");
  });
});

module.exports = router;

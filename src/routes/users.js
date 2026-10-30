const express = require("express");
const router = express.Router();
const userService = require("../services/userService");

// GET /users/:username — look up a user profile.
router.get("/:username", (req, res) => {
  const username = req.params.username; // CX-1001 [source] Request.Parameter
  const user = userService.findByUsername(username);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ id: user.id, username: user.username, email: user.email, bio: user.bio });
});

module.exports = router;

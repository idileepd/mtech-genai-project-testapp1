module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  // node:sqlite emits an experimental warning; keep noise low
  silent: true,
};

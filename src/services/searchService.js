// Static catalog — trusted data (no user content).
const CATALOG = [
  "Espresso Machine",
  "Cycling Gloves",
  "Mechanical Keyboard",
  "Laptop Stand",
  "USB-C Hub",
  "Camping Stove",
];

function search(q) {
  const needle = String(q).toLowerCase();
  return CATALOG.filter((item) => item.toLowerCase().includes(needle));
}

module.exports = { search };

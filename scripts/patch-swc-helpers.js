const fs = require("fs");
const path = require("path");

const targetPath = path.join(
  __dirname,
  "..",
  "node_modules",
  "@swc",
  "helpers",
  "esm",
  "index.js"
);

if (!fs.existsSync(targetPath)) {
  process.exit(0);
}

const content = fs.readFileSync(targetPath, "utf8");

if (content.includes("applyDecoratedDescriptor")) {
  process.exit(0);
}

const needle =
  'export { _ as _apply_decorated_descriptor } from "./_apply_decorated_descriptor.js";';

if (!content.includes(needle)) {
  process.exit(0);
}

const patched = content.replace(
  needle,
  `${needle}\nexport { _ as applyDecoratedDescriptor } from "./_apply_decorated_descriptor.js";`
);

fs.writeFileSync(targetPath, patched, "utf8");

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const dashboardPath = new URL("../src/content/dashboard/DashboardContent.jsx", import.meta.url);
const cssPath = new URL("../src/content/dashboard/example.css", import.meta.url);

async function readDashboardTheme() {
  const [jsx, css] = await Promise.all([
    readFile(dashboardPath, "utf8"),
    readFile(cssPath, "utf8"),
  ]);
  return { jsx, css };
}

test("glass hero provides ambient layers and semantic heading structure", async () => {
  const { jsx, css } = await readDashboardTheme();

  assert.match(jsx, /className="bearing-ambient"\s+aria-hidden="true"/);
  assert.match(jsx, /className="bearing-orb bearing-orb--one"/);
  assert.match(jsx, /className="bearing-orb bearing-orb--two"/);
  assert.match(jsx, /<header className="bearing-hero">/);

  assert.ok((css.match(/radial-gradient\(/g) ?? []).length >= 3);
  assert.match(css, /\.bearing-ambient\s*\{[^}]*position:\s*fixed/s);
  assert.match(css, /font-family:[^;]*-apple-system/);
});

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

test("glass surfaces provide refraction, interaction, and accessibility fallbacks", async () => {
  const { jsx, css } = await readDashboardTheme();

  assert.match(css, /backdrop-filter:\s*blur\(/);
  assert.match(css, /-webkit-backdrop-filter:\s*blur\(/);
  assert.match(css, /box-shadow:[^;]*inset[^;]*,/s);
  assert.match(css, /:focus-visible/);
  assert.match(css, /:hover/);
  assert.match(css, /:active/);
  assert.match(css, /@supports not \(backdrop-filter:\s*blur\(1px\)\)/);
  assert.doesNotMatch(css, /@supports not \(\(backdrop-filter:/);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /--bearing-risk-amber:/);
  assert.match(css, /background:\s*rgb\(255 255 255 \/ 94%\)/);

  assert.match(jsx, /var\(--bearing-blue\)/);
  assert.match(jsx, /var\(--bearing-teal\)/);
  assert.match(jsx, /var\(--bearing-slate\)/);
  assert.match(jsx, /var\(--bearing-muted\)/);
  assert.doesNotMatch(jsx, /var\(--bearing-orange\)/);
});

test("compact layout keeps the horizontally scrollable filter bar in document flow", async () => {
  const { css } = await readDashboardTheme();

  assert.match(
    css,
    /@container bearing-dashboard \(max-width:\s*640px\)[\s\S]*?\.bearing-page > \.filters\s*\{[^}]*top:\s*auto[^}]*\}/,
  );
});

// Screenshots of the website pages at desktop and phone widths, for review.
// Writes to tests/screenshots/ (not committed). Run with: node scripts/screenshot-site.mjs
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'tests/screenshots');
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const problems = [];
for (const name of ['index', 'privacy', 'support']) {
  for (const [label, viewport, scheme] of [
    ['desktop', { width: 1280, height: 900 }, 'light'],
    ['phone', { width: 390, height: 844 }, 'light'],
    ['desktop-dark', { width: 1280, height: 900 }, 'dark'],
  ]) {
    const page = await browser.newPage({ viewport, colorScheme: scheme });
    await page.goto(pathToFileURL(path.join(root, 'docs', `${name}.html`)).href, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) problems.push(`${name} ${label}: page is ${overflow}px wider than the screen`);
    await page.screenshot({ path: path.join(outDir, `${name}-${label}.png`), fullPage: true });
    await page.close();
  }
}
await browser.close();
console.log(problems.length ? problems.join('\n') : 'no sideways scrolling at any width');
if (problems.length) process.exitCode = 1;

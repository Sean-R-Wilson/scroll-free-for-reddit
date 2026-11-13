// Renders every image the extension and the stores need, from the sources in
// scripts/icon.mjs and design/store/. Run with: npm run assets
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { iconSvg } from './icon.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = (...p) => {
  const file = path.join(root, ...p);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  return file;
};

const browser = await chromium.launch();

async function renderSvg(svg, size, file) {
  const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  const src = 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
  await page.setContent(
    `<html><body style="margin:0;background:transparent"><img src="${src}" width="${size}" height="${size}" style="display:block"></body></html>`,
  );
  await page.locator('img').evaluate((img) => img.decode());
  await page.screenshot({ path: file, omitBackground: true });
  await page.close();
}

async function renderPage(htmlFile, { width, height, scale = 1, transparent = false }, file) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale });
  await page.goto(pathToFileURL(path.join(root, 'design/store', htmlFile)).href, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
  });
  if (transparent) await page.screenshot({ path: file, omitBackground: true });
  // JPEG: both stores refuse screenshots with transparency.
  else await page.screenshot({ path: file, type: 'jpeg', quality: 94 });
  await page.close();
}

// Extension icons: a tile with a little breathing room, as Chrome's guidelines ask.
const standard = iconSvg({ inset: 0.06 });
for (const size of [16, 32, 48, 96, 128, 256, 512]) await renderSvg(standard, size, out('extension/icons', `icon-${size}.png`));

// Toolbar button: edge to edge with heavier chevrons so it reads at 16 pixels.
const toolbar = iconSvg({ inset: 0, radius: 0.22, bold: true });
for (const size of [16, 19, 32, 38]) await renderSvg(toolbar, size, out('extension/icons', `toolbar-${size}.png`));

// Website favicon and logo.
fs.writeFileSync(out('docs/assets/icon.svg'), standard);
await renderSvg(standard, 180, out('docs/assets/apple-touch-icon.png'));

// Mac app icon master: a full square; macOS rounds the corners itself.
await renderSvg(iconSvg({ inset: 0, radius: 0 }), 1024, out('design/app-icon-1024.png'));

// Store screenshots: 1280x800 for Chrome, the same at 2560x1600 for the Mac App Store.
const shots = ['01-hero.html', '02-before-after.html', '03-feed.html', '04-private.html'];
for (const [i, html] of shots.entries()) {
  await renderPage(html, { width: 1280, height: 800 }, out('store/images/chrome', `screenshot-${i + 1}.jpg`));
  await renderPage(html, { width: 1280, height: 800, scale: 2 }, out('store/images/mac-app-store', `screenshot-${i + 1}.jpg`));
}
await renderPage('promo-small.html', { width: 440, height: 280 }, out('store/images/chrome', 'promo-small-440x280.jpg'));
await renderPage('promo-marquee.html', { width: 1400, height: 560 }, out('store/images/chrome', 'promo-marquee-1400x560.jpg'));

// Website home page illustration, at double size for sharp screens.
await renderPage('site-hero.html', { width: 700, height: 720, scale: 2, transparent: true }, out('docs/assets/hero.png'));

await browser.close();
console.log('assets rendered');

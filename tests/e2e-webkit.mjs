// End-to-end check of the Chrome extension on live reddit.com, logged out.
// Usage: node tests/e2e-webkit.mjs [content script, default extension/content.js] [none]
//   pass "none" as the second argument to run the same checks without the extension.
import { webkit } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

// WebKit run: Playwright can't load Safari extensions, so the userscript is added to every
// page before Reddit's own code runs, the way the Userscripts app does at document-start.
// Usage: node test-webkit.mjs <path to .user.js> [none]
const scriptPath = process.argv[2] || 'extension/content.js';
const shotDir = path.resolve('tests/screenshots');
fs.mkdirSync(shotDir, { recursive: true });
const withExtension = process.argv[3] !== 'none';
const tag = withExtension ? 'webkit-script' : 'webkit-none';
let failures = 0;
const check = (name, ok, detail = '') => {
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  (' + detail + ')' : ''}`);
};

const browser = await webkit.launch();
const ctx = await browser.newContext({
  viewport: { width: 1400, height: 1000 },
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/27.0 Safari/605.1.15',
});
if (withExtension) await ctx.addInitScript({ content: fs.readFileSync(scriptPath, 'utf8') });
const page = ctx.pages()[0] || (await ctx.newPage());
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 200)));
let batches = 0;
page.on('response', (r) => {
  if (/svc\/shreddit\/(community-more-posts|feeds)/.test(r.url()) && r.status() === 200) batches++;
});

const snapshot = () =>
  page.evaluate(() => {
    const d = document.getElementById('desktop-dynamic-upsell-dialog');
    const hit = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
    return {
      signupElement: !!document.querySelector('desktop-dynamic-upsell-modal'),
      signupVisible: (!!d && d.getClientRects().length > 0) || !!hit?.closest('#desktop-dynamic-upsell-dialog'),
      lock: document.body.classList.contains('rpl-scroll-lock'),
      scrollOff: getComputedStyle(document.body).overflowY === 'hidden' || getComputedStyle(document.documentElement).overflowY === 'hidden',
      posts: document.querySelectorAll('shreddit-post').length,
      y: Math.round(scrollY),
    };
  });

async function open(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    if (!(await page.getByText('Prove your humanity').count())) return true;
    console.log(`  bot check on ${url} (attempt ${attempt}), waiting and retrying`);
    await page.waitForTimeout(20000);
  }
  return false;
}

async function feedCheck(url, label) {
  if (!(await open(url))) {
    console.log(`SKIP  ${label}: Reddit kept showing its bot check`);
    return;
  }
  // Reddit opens the box within ~2-10s of load. Wait past that before judging.
  await page.waitForTimeout(12000);
  const s0 = await snapshot();
  check(`${label}: signup box not visible`, !s0.signupVisible, JSON.stringify(s0));
  check(`${label}: scrolling not frozen`, !s0.scrollOff, `lock class=${s0.lock}, scrolling switched off=${s0.scrollOff}`);
  const h0 = await page.evaluate(() => document.documentElement.scrollHeight);
  const batchesBefore = batches;
  await page.mouse.move(700, 500);
  let maxY = 0;
  for (let i = 0; i < 40; i++) {
    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(1000);
    maxY = Math.max(maxY, (await snapshot()).y);
  }
  const s1 = await snapshot();
  check(`${label}: page scrolls`, maxY > 500, `scrolled to ${maxY}px`);
  const h1 = await page.evaluate(() => document.documentElement.scrollHeight);
  check(`${label}: feed keeps loading batch after batch`, batches - batchesBefore >= 2 && h1 > h0 * 2, `${batches - batchesBefore} more batches while scrolling, page ${h0}px -> ${h1}px tall, ${s1.posts} posts on page`);
  const ids = await page.evaluate(() => [...document.querySelectorAll('shreddit-post')].map((p) => p.id));
  const dupes = ids.length - new Set(ids).size;
  check(`${label}: no duplicate posts`, dupes === 0, `${dupes} duplicates out of ${ids.length}`);
  await page.screenshot({ path: `${shotDir}/${tag}-${label}.png` });
}

await feedCheck('https://www.reddit.com/r/AskReddit/', 'askreddit');
await feedCheck('https://www.reddit.com/', 'home');
await feedCheck('https://www.reddit.com/r/pics/', 'pics');

// Image viewer on r/pics: click the middle of the first big image, as a person would.
if (page.url().includes('/r/pics')) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  const pt = await page.evaluate(() => {
    for (const img of document.querySelectorAll('shreddit-post img')) {
      const r = img.getBoundingClientRect();
      if (r.width > 200 && r.height > 150) {
        img.scrollIntoView({ block: 'center' });
        const b = img.getBoundingClientRect();
        return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
      }
    }
    return null;
  });
  if (pt) {
    await page.waitForTimeout(600);
    await page.mouse.click(pt.x, pt.y);
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${shotDir}/${tag}-image-viewer.png` });
    const s = await snapshot();
    const yBefore = s.y; // measured once the viewer is open
    check('image viewer opens (address gets #lightbox)', page.url().includes('#lightbox'), page.url());
    check('image viewer holds the page still behind it', s.lock, `lock=${s.lock}`);
    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(800);
    const yDuring = (await snapshot()).y;
    check('page behind the image viewer does not scroll', yDuring === yBefore, `scrollY ${yBefore} -> ${yDuring}`);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1500);
    const s2 = await snapshot();
    check('closing the image viewer unfreezes the page', !s2.lock, `lock=${s2.lock}, url=${page.url()}`);
  } else {
    check('found an image to click on r/pics', false);
  }
}

// Clicking into a post, then the Log In button still works.
if (await open('https://www.reddit.com/r/AskReddit/')) {
  await page.waitForTimeout(4000);
  const link = page.locator('a[slot="full-post-link"]').first();
  await link.click({ timeout: 15000 }).catch((e) => console.log('  post click failed:', String(e).split('\n')[0]));
  await page.waitForURL((u) => u.pathname.includes('/comments/'), { timeout: 30000 }).catch(() => {});
  check('clicking a post opens it', page.url().includes('/comments/'), page.url());
  await page.waitForTimeout(10000);
  const s = await snapshot();
  check('post page: signup box not visible', !s.signupVisible, JSON.stringify(s));
  await page.mouse.move(700, 500);
  for (let i = 0; i < 4; i++) {
    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(600);
  }
  const y = (await snapshot()).y;
  check('post page: comments scroll', y > 500, `scrolled to ${y}px`);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.locator('#login-button').first().click({ timeout: 15000 }).catch((e) => console.log('  login click failed:', String(e).split('\n')[0]));
  await page.waitForTimeout(4000);
  const loginShown = await page.evaluate(() => {
    const txt = document.body.innerText;
    return /Continue with (Google|Email|Phone)|Email or username|Log In/i.test(txt) && !!document.querySelector('auth-flow-manager');
  });
  const loginVisible = await page
    .getByText(/Email or username|Continue with Email|Continue with Phone Number/i)
    .first()
    .isVisible()
    .catch(() => false);
  await page.screenshot({ path: `${shotDir}/${tag}-login.png` });
  check('Log In button still opens the login box', loginShown && loginVisible, `visible=${loginVisible}`);
}

if (pageErrors.length) console.log('page errors seen:', JSON.stringify(pageErrors.slice(0, 5), null, 2));
await browser.close();
console.log(failures ? `\n${failures} check(s) failed` : '\nall checks passed');
process.exit(failures ? 1 : 0);

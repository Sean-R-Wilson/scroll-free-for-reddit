# Scroll Free for Reddit

A browser extension for Chrome (and Edge, Brave, Arc) and Safari. When you're logged out, Reddit greys out the page with a signup box a few seconds after it loads, stops scrolling, and stops loading posts after the first 3. Scroll Free removes the box, keeps the page scrolling and keeps the feed loading.

It runs only on reddit.com, asks for no other permissions, and collects nothing.

To publish it to the stores, see [PUBLISHING.md](PUBLISHING.md).

## Folders

- `extension/`: the extension itself. One copy serves both Chrome and Safari.
  - `content.js`: everything the extension does on Reddit pages, with comments explaining each part
  - `manifest.json`: the extension's name, version, icons and where it runs
  - `popup.html`, `popup.css`: the small panel shown when you click the toolbar button
- `docs/`: the public website (home, privacy policy, support), served by GitHub Pages
- `store/`: listing text for each store, and the screenshots and promo images to upload
- `design/`: sources for the store images and website illustration
- `scripts/`: building, checking and image rendering
- `tests/`: end-to-end tests that load live reddit.com, logged out, in Chrome and WebKit (Safari's engine)

## Commands

Run `npm install` once first.

- `npm run check`: checks the extension against store rules and lists placeholders still to fill in
- `npm run package:chrome`: builds the Chrome Web Store upload file in `dist/`
- `npm run assets`: redraws the icons, store images and website illustration
- `npm test`: runs the check, then the Chrome and WebKit end-to-end tests (about 10 minutes, needs internet)
- `node scripts/screenshot-site.mjs`: photographs the website at desktop and phone sizes into `tests/screenshots/` and fails if a page needs sideways scrolling

Changes reach `main` through pull requests validated by the no-mistakes gate. `.no-mistakes.yaml` sets which local checks it runs; there is no cloud CI.

The end-to-end tests use Playwright's own Chromium and WebKit browsers. Reddit sometimes shows automated browsers a "Prove your humanity" check. The tests wait and retry when that happens.

## How it works

Reddit adds an element called `desktop-dynamic-upsell-modal` that opens the box and adds the class `rpl-scroll-lock` to the page to stop scrolling. The extension removes that element as soon as it appears, with CSS as a backup in case it ever opens.

For logged-out visitors, Reddit also leaves out the marker at the end of the feed that tells it where to fetch the next posts (`faceplate-partial slot="load-after"`). When you scroll near the end of a feed, the extension adds that marker back, pointing after the last post, and Reddit's own code loads the next batch.

If Reddit renames these, the extension stops working until it's updated. The tests catch that.

# Mac App Store listing

Everything to paste into App Store Connect for the Safari version, field by field. The app itself is uploaded from Xcode (see PUBLISHING.md).

## New app (My Apps, then the + button, then New App)

- **Platform:** macOS
- **Name:** Scroll Free for Reddit
- **Primary language:** English (U.S.)
- **Bundle ID:** the one the Xcode project uses (see PUBLISHING.md)
- **SKU:** scroll-free-for-reddit
- **User access:** Full access

## App information

- **Subtitle:** No signup box. Keep scrolling.
- **Category:** Utilities (primary), Productivity (secondary)
- **Content rights:** the app doesn't contain, show or access third-party content. (It changes how Safari shows reddit.com. Safari does the browsing.)
- **Age rating:** answer "None" or "No" to every question. The app itself shows no content and gives no web access of its own.

## Pricing and availability

- **Price:** Free
- **Availability:** all countries and regions

## App privacy

- **Privacy policy URL:** `https://sean-r-wilson.github.io/scroll-free-for-reddit/privacy.html`
- **Data collection:** "No, we do not collect data from this app"

## Version 1.0 page

**Screenshots** (Mac, 2560 x 1600), in this order:

1. `store/images/mac-app-store/screenshot-1.jpg`
2. `store/images/mac-app-store/screenshot-2.jpg`
3. `store/images/mac-app-store/screenshot-3.jpg`
4. `store/images/mac-app-store/screenshot-4.jpg`

**Promotional text**

```
Reddit greys out the page and stops you scrolling unless you sign up. Scroll Free removes that box and keeps your feed loading.
```

**Description**

```
Reddit now covers its pages with a signup box when you're not logged in. A few seconds after a page loads, the page greys out, scrolling stops, and the feed stops after the first few posts.

Scroll Free for Reddit is a Safari extension that fixes that:
• The signup box never appears, so the page stays clear
• Scrolling works normally
• Your feed keeps loading new posts as you scroll, on the home page and in every community
• Everything else on Reddit works as usual: posts, comments, pictures, videos, and the Log In and Sign Up buttons if you want them

Turning it on takes a minute: open the app, click Open Safari Settings, and tick Scroll Free for Reddit. The first time you visit reddit.com, click the Scroll Free button in Safari's toolbar and choose Always Allow on This Website.

Private by design
• Works only on reddit.com
• Collects no data, has no tracking or ads, and sends nothing anywhere
• No account needed
• Open source: anyone can read the code on GitHub

Scroll Free for Reddit is an independent project. It is not made by, endorsed by, or connected to Reddit, Inc.
```

**Keywords** (Apple rejects other companies' trademarks here, so "Reddit" is left out; the name already covers it)

```
signup,popup,blocker,scroll,login wall,modal,feed,unblock,safari extension,browse,reader,overlay
```

**Support URL:** `https://sean-r-wilson.github.io/scroll-free-for-reddit/support.html`

**Marketing URL:** `https://sean-r-wilson.github.io/scroll-free-for-reddit/`

**Copyright:** `2026 Wilson Technologies`

## App Review information

- **Sign-in required:** No
- **Contact:** your name, phone and email

**Notes for the reviewer**

```
Scroll Free for Reddit is a Safari web extension. The Mac app only explains how to turn it on.

How to test:
1. Open the app and click Open Safari Settings. Tick Scroll Free for Reddit.
2. In Safari, make sure you are logged out of Reddit, and open https://www.reddit.com/r/pics/
3. Click the Scroll Free button in the toolbar and choose Always Allow on This Website, then reload.
4. Wait 15 seconds. Without the extension, Reddit greys out the page with a signup box and scrolling stops. With it, the page stays clear.
5. Scroll down. The feed keeps loading new posts. Without the extension it stops after 3 posts.

The extension runs only on reddit.com, collects no data, and makes no network requests of its own beyond asking reddit.com for the next posts, exactly as Reddit's own page does for logged-in users. It is not affiliated with Reddit, and the name uses "for Reddit" only to describe the site it works with.
```

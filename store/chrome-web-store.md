# Chrome Web Store listing

Everything to paste into the Chrome Web Store developer dashboard, field by field, in the order the dashboard asks. The upload file is `dist/scroll-free-for-reddit-<version>.zip` (build it with `npm run package:chrome`).

## Package

Upload `dist/scroll-free-for-reddit-1.0.0.zip`. The name, short description and icon come from the zip automatically.

## Store listing tab

**Description**

```
Reddit now covers its pages with a signup box when you're not logged in. A few seconds after a page loads, the page greys out, scrolling stops, and the feed stops after the first few posts.

Scroll Free for Reddit fixes that:
• The signup box never appears, so the page stays clear
• Scrolling works normally
• Your feed keeps loading new posts as you scroll, on the home page and in every community
• Everything else on Reddit works as usual: posts, comments, pictures, videos, and the Log In and Sign Up buttons if you want them

There's nothing to set up. Install it, open Reddit, and read.

Private by design
• Works only on reddit.com
• Collects no data, has no tracking or ads, and sends nothing anywhere
• No account needed
• Open source: anyone can read the code on GitHub

Scroll Free for Reddit is an independent project. It is not made by, endorsed by, or connected to Reddit, Inc.
```

**Category:** Functionality & UI

**Language:** English

**Store icon:** `extension/icons/icon-128.png`

**Screenshots** (in this order):

1. `store/images/chrome/screenshot-1.jpg`
2. `store/images/chrome/screenshot-2.jpg`
3. `store/images/chrome/screenshot-3.jpg`
4. `store/images/chrome/screenshot-4.jpg`

**Small promo tile:** `store/images/chrome/promo-small-440x280.jpg`

**Marquee promo tile:** `store/images/chrome/promo-marquee-1400x560.jpg`

**Homepage URL:** `https://sean-r-wilson.github.io/scroll-free-for-reddit/`

**Support URL:** `https://sean-r-wilson.github.io/scroll-free-for-reddit/support.html`

Leave "Official URL" empty. It needs a website domain verified with Google, and the listing works without it.

## Privacy tab

**Single purpose description**

```
Removes the signup box that Reddit shows to logged-out visitors, which greys out the page and stops scrolling, and keeps the Reddit feed loading as you scroll.
```

**Host permission justification** (Chrome counts the reddit.com content script as a host permission)

```
The extension runs only on reddit.com pages, where it removes the signup box and asks reddit.com for the next posts in the feed as the user scrolls, the same request Reddit's own page makes for logged-in users. It needs no access to any other website.
```

**Are you using remote code?** No, I am not using remote code.

**Data usage:** tick none of the data types. Then tick all three statements:

- I do not sell or transfer user data to third parties, outside of the approved use cases
- I do not use or transfer user data for purposes that are unrelated to my item's single purpose
- I do not use or transfer user data to determine creditworthiness or for lending purposes

**Privacy policy URL:** `https://sean-r-wilson.github.io/scroll-free-for-reddit/privacy.html`

## Distribution tab

- **Payments:** Free of charge
- **Visibility:** Public
- **Regions:** All regions

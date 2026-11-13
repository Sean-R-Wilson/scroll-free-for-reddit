# Publishing Scroll Free for Reddit

How the extension gets from this folder into the Chrome Web Store and the Mac App Store, so anyone can install it with one click. Chrome comes first; Safari follows later. Steps marked **You** need your accounts, payment or sign-in. Steps marked **Claude** are done for you once the step before them is finished.

## Public details

- **Publisher:** Wilson Technologies
- **Help and problem reports:** the GitHub issues page, using a short form: https://github.com/Sean-R-Wilson/scroll-free-for-reddit/issues/new/choose
- **Code and website:** https://github.com/Sean-R-Wilson/scroll-free-for-reddit, with the website at https://sean-r-wilson.github.io/scroll-free-for-reddit/ (privacy policy at `/privacy.html`, support at `/support.html`)

The website's install buttons read "Coming soon" until each store's link is added to `docs/assets/site.js`.

## Chrome Web Store (also covers Edge, Brave and Arc)

Submitted for review on 13 November 2026. Item ID `lcfflgjbnlnopeiflekfggclpnocojpo`; listing URL: https://chromewebstore.google.com/detail/scroll-free-for-reddit/lcfflgjbnlnopeiflekfggclpnocojpo

The website's **Add to Chrome** button already links to this URL. Until approval, Google shows an empty placeholder page.

1. **You:** go to https://chrome.google.com/webstore/devconsole and sign in with the Google account that should own the listing. Pay the one-time US$5 registration fee, set the publisher name to **Wilson Technologies**, and verify the contact email.
2. **You:** click **New item** and upload `dist/scroll-free-for-reddit-1.0.0.zip` from this folder.
3. **You:** fill in each tab by pasting from `store/chrome-web-store.md`. It lists every field in order, including which image files to upload.
4. **You:** answer the EU "trader" question, which is your call. Declaring yourself a trader means the store publicly shows a business address, phone number and email to people in the EU. Declaring non-trader shows none of that, but states that publishing it isn't part of a business. Since this is free and published by Wilson Technologies, either can be argued.
5. **You:** click **Submit for review**. Google usually reviews within a few days and emails the result.
6. **Claude:** once it's approved, checks that the listing is public and the website's **Add to Chrome** button opens it.

## Mac App Store (Safari), later

Safari extensions have to be built into a small Mac app with Xcode, Apple's app-building tool.

1. **You:** install **Xcode** from the Mac App Store (free, large download): https://apps.apple.com/app/xcode/id497799835
2. **You:** open Xcode once and accept the licence. Then go to **Xcode > Settings > Accounts**, click **+**, and sign in with the Apple ID that belongs to the Wilson Technologies Apple Developer account.
3. **Claude:** builds the Mac app around the same extension, tests it in real Safari, checks the Safari install steps on the website match what really happens, and uploads it to App Store Connect.
4. **You:** in App Store Connect (https://appstoreconnect.apple.com), create the app and paste the listing from `store/mac-app-store.md`. Then choose the uploaded build and click **Add for Review**. Apple usually reviews within one to three days.
5. **Claude:** once it's approved, adds the App Store link to the website's **Get it for Safari** button.

## When Reddit changes its page

Reddit changes its site from time to time. If the box comes back, the fix is a small change here, then a new version uploaded to each store, which reviews it again (usually faster than the first time). The automated tests (`npm test`) show whether the current version still works on the live site.

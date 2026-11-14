# Publishing Scroll Free for Reddit

How the extension gets from this folder into the Chrome Web Store and the Mac App Store, so anyone can install it with one click. Chrome comes first; Safari follows later. Steps marked **You** need your accounts, payment or sign-in. Steps marked **Claude** are done for you once the step before them is finished.

## Public details

- **Publisher:** Wilson Technologies
- **Help and problem reports:** the GitHub issues page, using a short form: https://github.com/Sean-R-Wilson/scroll-free-for-reddit/issues/new/choose
- **Code and website:** https://github.com/Sean-R-Wilson/scroll-free-for-reddit, with the website at https://sean-r-wilson.github.io/scroll-free-for-reddit/ (privacy policy at `/privacy.html`, support at `/support.html`)

The website's install buttons read "Coming soon" until each store's link is added to `docs/assets/site.js`.

## Chrome Web Store (also covers Edge, Brave and Arc)

Version 1.0.0 is live. Item ID `lcfflgjbnlnopeiflekfggclpnocojpo`; listing URL: https://chromewebstore.google.com/detail/scroll-free-for-reddit/lcfflgjbnlnopeiflekfggclpnocojpo

The website's **Add to Chrome** button links to this URL. For updates to the existing listing, follow [When Reddit changes its page](#when-reddit-changes-its-page).

For a first submission:

1. **You:** go to https://chrome.google.com/webstore/devconsole and sign in with the Google account that should own the listing. Pay the one-time US$5 registration fee, set the publisher name to **Wilson Technologies**, and verify the contact email.
2. **You:** click **New item** and upload the package listed in [store/chrome-web-store.md](store/chrome-web-store.md#package).
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

To send a new version to the Chrome Web Store:

1. **Claude:** raises the version number in `extension/manifest.json` and `package.json`, refreshes `package-lock.json` to match (the store only accepts a higher number than the one it has), runs the tests, and builds the upload package with `npm run package:chrome`. See [store/chrome-web-store.md](store/chrome-web-store.md#package) for the current package filename.
2. **You:** in the developer dashboard (https://chrome.google.com/webstore/devconsole), open Scroll Free for Reddit, choose **Package** on the left, click **Upload new package** and pick that zip. Then click **Submit for review**. The listing text and images carry over, so nothing else needs filling in.
3. Once Google approves it, Chrome installs the new version for everyone who already has the extension, usually within a few hours.

For the 1.1.0 phone fix, keep `docs/support.html` unchanged until Google approves the update. The public website deploys on merge; after approval, update its phone support answer to match [README.md](README.md#how-it-works).

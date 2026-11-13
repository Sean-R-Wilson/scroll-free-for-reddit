// Scroll Free for Reddit
//
// Runs on reddit.com pages (see manifest.json). When you're logged out, Reddit
// covers the page with a "join" box a few seconds after it loads, freezes
// scrolling, and stops loading posts after the first 3. This removes the box,
// keeps the page scrolling, and keeps the feed loading. It reads nothing about
// you and sends nothing anywhere.

(() => {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. Hide the signup box and let the page scroll.
  //
  // When you are logged out, Reddit adds a "desktop-dynamic-upsell-modal" element
  // that opens a full-screen box a few seconds after the page loads, and freezes
  // scrolling by adding the class "rpl-scroll-lock" to the page. Section 2 removes
  // the element before it opens. These rules are the backup for when it opens
  // anyway: they hide it, and they undo the scroll freeze only while the box is
  // on the page, so Reddit's image viewer and menus, which use the same freeze,
  // still hold the page still behind them.
  // ---------------------------------------------------------------------------
  const style = document.createElement('style');
  style.id = 'scroll-free-for-reddit';
  style.textContent = `
    desktop-dynamic-upsell-modal,
    #desktop-dynamic-upsell-dialog {
      display: none !important;
    }
    body.rpl-scroll-lock:has(#desktop-dynamic-upsell-dialog) {
      overflow: visible !important;
      padding-right: 0 !important;
    }
    body.rpl-scroll-lock:has(#desktop-dynamic-upsell-dialog) .fixed.right-0 {
      right: 0 !important;
    }
  `;
  // Safari can run this before the page has any elements at all, so wait for the
  // first one if needed.
  const attachStyle = () => {
    const parent = document.head || document.documentElement;
    if (!parent) return false;
    parent.appendChild(style);
    return true;
  };
  if (!attachStyle()) {
    new MutationObserver((_, observer) => {
      if (attachStyle()) observer.disconnect();
    }).observe(document, { childList: true });
  }

  // ---------------------------------------------------------------------------
  // 2. Remove the signup box before Reddit can open it.
  // ---------------------------------------------------------------------------
  const signupBoxes = document.getElementsByTagName('desktop-dynamic-upsell-modal'); // live list, cheap to check
  const removeSignupBox = () => {
    while (signupBoxes.length) signupBoxes[0].remove();
  };

  // ---------------------------------------------------------------------------
  // 3. Keep feeds loading.
  //
  // Reddit's feed ends with a hidden marker that tells it where to fetch the next
  // batch of posts as you scroll. For logged-out visitors Reddit leaves that
  // marker out, both on the page and in every batch it sends, so the feed stops
  // after 3 posts. Whenever you scroll near the end of a feed that has no marker,
  // this adds one pointing after the last post, and Reddit's own code then loads
  // and shows that batch.
  //
  // It waits until you are near the end so the feed has finished arriving, and it
  // never adds a second marker after the same post, so it stops cleanly when a
  // feed genuinely runs out.
  // ---------------------------------------------------------------------------
  const extendedAfter = new WeakMap(); // feed -> id of the post we last added a marker after
  const restoreFeedLoading = () => {
    for (const feed of document.querySelectorAll('shreddit-feed[reload-url]')) {
      if (feed.querySelector(':scope > faceplate-partial[slot="load-after"]')) continue;
      const posts = feed.querySelectorAll('shreddit-post[id^="t3_"]');
      const lastPost = posts[posts.length - 1];
      if (!lastPost || extendedAfter.get(feed) === lastPost.id) continue;
      if (feed.getBoundingClientRect().bottom > window.innerHeight * 3) continue; // not near the end yet
      extendedAfter.set(feed, lastPost.id);
      const next = new URL(feed.getAttribute('reload-url'), location.origin);
      next.searchParams.set('after', btoa(lastPost.id)); // Reddit's own markers encode the post id this way
      const marker = document.createElement('faceplate-partial');
      marker.setAttribute('slot', 'load-after');
      marker.setAttribute('loading', 'programmatic');
      marker.setAttribute('method', 'GET');
      marker.setAttribute('src', next.pathname + next.search);
      feed.appendChild(marker);
    }
  };

  // Check at most a few times a second while the page changes or scrolls.
  // Reddit swaps page content in place when you click around, so keep watching.
  let feedCheckPending = false;
  const scheduleFeedCheck = () => {
    if (feedCheckPending) return;
    feedCheckPending = true;
    setTimeout(() => {
      feedCheckPending = false;
      restoreFeedLoading();
    }, 250);
  };
  new MutationObserver(() => {
    removeSignupBox();
    scheduleFeedCheck();
  }).observe(document, { childList: true, subtree: true });
  window.addEventListener('scroll', scheduleFeedCheck, { passive: true });
  removeSignupBox();
})();

// Store links. Fill each one in once that store has approved the extension.
// Until then, that store's button reads "Coming soon" and can't be clicked,
// and its install steps are replaced by a "Coming soon" line.
const STORE_LINKS = {
  chrome: 'https://chromewebstore.google.com/detail/scroll-free-for-reddit/lcfflgjbnlnopeiflekfggclpnocojpo',
  safari: '',
};

for (const [store, url] of Object.entries(STORE_LINKS)) {
  for (const button of document.querySelectorAll(`[data-store="${store}"]`)) {
    if (url) {
      button.href = url;
    } else {
      button.removeAttribute('href');
      button.setAttribute('aria-disabled', 'true');
      const label = button.querySelector('small');
      if (label) label.textContent = 'Coming soon';
    }
  }
  for (const el of document.querySelectorAll(`[data-store-steps="${store}"]`)) el.hidden = !url;
  for (const el of document.querySelectorAll(`[data-store-soon="${store}"]`)) el.hidden = Boolean(url);
}

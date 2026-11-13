// Builds the generic browser-window and feed drawings used in the store images.
// Deliberately unbranded: no Reddit logo, names or real posts.

const PICTURES = [
  'linear-gradient(160deg, #9fb7ff, #5c7cf5)',
  'linear-gradient(160deg, #ffe08a, #ffb84d)',
  'linear-gradient(160deg, #b5e3c8, #5fb98a)',
  'linear-gradient(160deg, #f7c4d6, #e27aa0)',
  'linear-gradient(160deg, #c9c2f5, #8a7ce0)',
];

function post(i, { picture = false, widths = [88, 54] } = {}) {
  const pic = picture ? `<div class="picture" style="background:${PICTURES[i % PICTURES.length]}"></div>` : '';
  return `<div class="post">
    <div class="avatar"></div>
    <div class="lines"><b style="width:${widths[0]}%"></b><b style="width:${widths[1]}%"></b></div>
    ${pic}
  </div>`;
}

const PATTERN = [
  { picture: false, widths: [92, 61] },
  { picture: true, widths: [74, 40] },
  { picture: false, widths: [86, 70] },
  { picture: true, widths: [81, 47] },
  { picture: false, widths: [68, 52] },
  { picture: false, widths: [90, 38] },
];

/** A browser window showing a feed. `blocked` greys it out under a signup box. */
function browserWindow({ posts = 4, blocked = false, start = 0, address = 'reddit.com' } = {}) {
  const body = Array.from({ length: posts }, (_, k) => post(start + k, PATTERN[(start + k) % PATTERN.length])).join('');
  const box = blocked
    ? `<div class="signup-box">
         <div class="badge"></div>
         <b style="width:78%"></b><b style="width:56%"></b>
         <div class="pill" style="margin-top:8px"></div>
         <div class="pill light"></div>
       </div>`
    : '';
  return `<div class="window${blocked ? ' blocked' : ''}">
    <div class="chrome"><i></i><i></i><i></i><div class="address">${address}</div></div>
    <div class="page">${body}</div>
    ${box}
  </div>`;
}

// Plain script (not a module) so the pages also open straight from disk.
window.Mock = { browserWindow, post, PATTERN };

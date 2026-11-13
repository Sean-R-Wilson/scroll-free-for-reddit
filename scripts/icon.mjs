// The Scroll Free icon: two down chevrons (white leading into yellow) on a cobalt tile.
// Drawn on a 1024 grid. Every size is generated from this one function.

export const colors = {
  cobaltTop: '#2c4cf2',
  cobaltBottom: '#1a32c4',
  white: '#ffffff',
  sun: '#ffd23f',
};

/**
 * @param {object} o
 * @param {number} o.inset   empty space around the tile, as a share of the canvas (0 = edge to edge)
 * @param {number} o.radius  tile corner radius, as a share of the tile (0 = square corners)
 * @param {boolean} o.bold   thicker, larger chevrons for tiny toolbar sizes
 */
export function iconSvg({ inset = 0.06, radius = 0.225, bold = false } = {}) {
  const S = 1024;
  const pad = S * inset;
  const tile = S - pad * 2;
  const r = tile * radius;
  const stroke = bold ? 168 : 128;
  const half = bold ? 300 : 250; // half width of a chevron
  const drop = bold ? 236 : 220; // how far the point sits below the arms
  const gap = bold ? 250 : 230; // distance between the two chevrons
  const top = (S - (drop + gap)) / 2; // centre the pair vertically
  const chevron = (y) => `M ${512 - half} ${y} L 512 ${y + drop} L ${512 + half} ${y}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}">
  <defs>
    <linearGradient id="tile" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${colors.cobaltTop}"/>
      <stop offset="1" stop-color="${colors.cobaltBottom}"/>
    </linearGradient>
  </defs>
  <rect x="${pad}" y="${pad}" width="${tile}" height="${tile}" rx="${r}" fill="url(#tile)"/>
  <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="${stroke}">
    <path d="${chevron(top)}" stroke="${colors.white}"/>
    <path d="${chevron(top + gap)}" stroke="${colors.sun}"/>
  </g>
</svg>`;
}

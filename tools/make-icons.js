/* Regenerates www/icons/*.png from a single vector definition.
 * Run:  npm install -D playwright && node tools/make-icons.js
 * The PNGs are committed; this script only needs running when the mark changes.
 * The anchor is drawn with SVG paths, not an emoji, so output does not depend
 * on which fonts happen to be installed on the machine doing the rendering. */
const { chromium } = require('playwright');
const path = require('path');

const NAVY = '#1F3864', NAVY_DEEP = '#14243F', TEAL = '#7FD1C8';

/* Anchor mark on a 100×100 grid, centred on (50,52).
 * Single colour on purpose: the flukes overlap the arms, so drawing them in a
 * second colour leaves a visible seam, and at 48px in a taskbar a two-tone mark
 * reads as noise. The teal stays in the wordmark and the splash screen. */
const anchor = color => `
  <g fill="none" stroke="${color}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="50" cy="17" r="7.5"/>
    <path d="M50 25 V79"/>
    <path d="M30 35 H70"/>
    <path d="M19 57 C19 74 33 83 50 83 C67 83 81 74 81 57"/>
  </g>
  <path d="M8 40 L33 47 L19 66 Z" fill="${color}"/>
  <path d="M92 40 L67 47 L81 66 Z" fill="${color}"/>`;

/* purpose="any": rounded square, the shape desktop taskbars and Android legacy icons expect.
   purpose="maskable": full bleed, mark shrunk into the centre 80% safe zone. */
function svg(size, { maskable = false, radiusPct = 22 } = {}) {
  const r = maskable ? 0 : (size * radiusPct) / 100;
  const scale = maskable ? 0.62 : 0.74;
  const off = (100 - 100 * scale) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${NAVY}"/><stop offset="1" stop-color="${NAVY_DEEP}"/>
    </linearGradient></defs>
    <rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="url(#g)"/>
    <g transform="translate(${(off / 100) * size} ${(off / 100) * size}) scale(${(size / 100) * scale})">
      ${anchor('#FFFFFF')}
    </g>
  </svg>`;
}

const TARGETS = [
  { file: 'icon-192.png', size: 192, opts: {} },
  { file: 'icon-512.png', size: 512, opts: {} },
  { file: 'icon-maskable-512.png', size: 512, opts: { maskable: true } },
  { file: 'apple-touch-icon-180.png', size: 180, opts: { radiusPct: 0 } },
];

(async () => {
  const browser = await chromium
    .launch()
    .catch(() => chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }));
  const out = path.resolve(__dirname, '..', 'www', 'icons');
  for (const t of TARGETS) {
    const page = await browser.newPage({ viewport: { width: t.size, height: t.size } });
    await page.setContent(
      `<body style="margin:0;background:transparent">${svg(t.size, t.opts)}</body>`);
    await page.screenshot({ path: path.join(out, t.file), omitBackground: true });
    await page.close();
    console.log('wrote', t.file, t.size + 'px');
  }
  await browser.close();
})();

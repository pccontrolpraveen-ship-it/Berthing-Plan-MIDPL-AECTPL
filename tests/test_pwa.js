/* PORTVISION 3D — progressive web app checks.
 * Run from the repository root:  node tests/test_pwa.js   →  final line: ERRORS: none
 *
 * Separate from test_app.js because a service worker needs a real origin:
 * test_app.js loads the app over file://, where workers are unavailable by
 * design. This suite serves www/ over http://127.0.0.1 (a secure origin for
 * service worker purposes), then pulls the network away and proves the app
 * still launches — including Three.js, which is why it was vendored.
 */
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', 'www');
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
};

const errors = [];
const check = (label, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${label}: ${JSON.stringify(actual)} ${ok ? '✓' : '✗ expected ' + JSON.stringify(expected)}`);
  if (!ok) errors.push(`${label}: got ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`);
};

/* Counts API hits so the test can prove the worker never answers for /api/. */
let apiHits = 0;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  if (url.pathname.startsWith('/api/')) {
    apiHits++;
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    return res.end(JSON.stringify({ ok: true, db: 'postgres', hit: apiHits }));
  }
  const rel = url.pathname === '/' ? '/index.html' : url.pathname;
  const file = path.join(ROOT, path.normalize(rel).replace(/^(\.\.[/\\])+/, ''));
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(buf);
  });
});

(async () => {
  fs.mkdirSync(path.resolve(__dirname, '..', 'shots'), { recursive: true });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}/`;
  console.log('serving www/ at', base);

  const browser = await chromium.launch()
    .catch(() => chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }));
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  /* The app probes http://localhost:4000 for a PortVision server. This suite
     covers standalone behaviour, so block that origin outright — otherwise the
     result depends on whether a developer happens to have the server running. */
  await page.route('http://localhost:4000/**', r => r.abort());

  /* ---- P1. Manifest is linked, served and complete ---- */
  await page.goto(base);
  await page.waitForTimeout(1200);
  const manifestHref = await page.getAttribute('link[rel=manifest]', 'href');
  check('P1.1 manifest linked', manifestHref, 'manifest.webmanifest');

  const manifest = await page.evaluate(async href =>
    (await fetch(href)).json(), manifestHref);
  check('P1.2 manifest name', manifest.name, 'PORTVISION 3D — Vessel Berthing Planning');
  check('P1.3 display mode', manifest.display, 'standalone');
  check('P1.4 start_url is relative', manifest.start_url, './');
  check('P1.5 icon sizes', manifest.icons.map(i => i.sizes), ['192x192', '512x512', '512x512']);
  check('P1.6 has maskable icon', manifest.icons.some(i => i.purpose === 'maskable'), true);

  const iconStatuses = await page.evaluate(async srcs => {
    const out = [];
    for (const s of srcs) out.push((await fetch(s)).status);
    return out;
  }, manifest.icons.map(i => i.src).concat(['icons/apple-touch-icon-180.png']));
  check('P1.7 every icon reachable', iconStatuses, [200, 200, 200, 200]);

  /* ---- P2. Service worker installs and takes control ---- */
  const controlled = await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      await new Promise(res => navigator.serviceWorker.addEventListener('controllerchange', res, { once: true }));
    }
    return !!reg.active && !!navigator.serviceWorker.controller;
  });
  check('P2.1 worker active and controlling', controlled, true);

  /* ---- P3. The API is never intercepted ---- */
  const before = apiHits;
  await page.evaluate(b => fetch(b + 'api/health').then(r => r.json()), base);
  await page.evaluate(b => fetch(b + 'api/health').then(r => r.json()), base);
  check('P3.1 both API calls reached the server', apiHits - before, 2);

  const cachedApi = await page.evaluate(async () => {
    const keys = await caches.keys();
    for (const k of keys) {
      const reqs = await (await caches.open(k)).keys();
      if (reqs.some(r => r.url.includes('/api/'))) return true;
    }
    return false;
  });
  check('P3.2 no API response was cached', cachedApi, false);

  /* ---- P4. Offline launch — the whole point ---- */
  await context.setOffline(true);
  await page.goto(base, { waitUntil: 'load' });
  await page.waitForTimeout(2500);

  check('P4.1 app shell served offline', await page.title(), 'PORTVISION 3D — MIDPL Kattupalli');
  check('P4.2 Three.js available offline', await page.evaluate(() => typeof THREE), 'object');
  check('P4.3 Three.js revision', await page.evaluate(() => THREE.REVISION), '128');
  check('P4.4 stylesheet applied offline',
    await page.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(244, 246, 250)');

  /* The app must be usable offline, not merely painted. */
  await page.click('.roleCard[data-role="Vessel Planner"]');
  await page.fill('#mobile', '9840012345');
  await page.click('#sendOtp');
  const otp = await page.$$('#otpRow input');
  for (let i = 0; i < 6; i++) await otp[i].fill('123456'[i]);
  await page.click('#verifyOtp');
  await page.waitForTimeout(600);
  check('P4.5 logged in offline', await page.textContent('#viewTitle'), 'Dashboard');
  check('P4.6 storage badge honest while offline', await page.textContent('#dbBadge'), '💾 Standalone');

  /* Offline, the API genuinely cannot be reached — the worker does not fake it. */
  const offlineApi = await page.evaluate(b =>
    fetch(b + 'api/health').then(r => 'STATUS ' + r.status).catch(() => 'NETWORK-FAIL'), base);
  check('P4.7 API fails honestly offline', offlineApi, 'NETWORK-FAIL');

  await page.screenshot({ path: path.resolve(__dirname, '..', 'shots', 'pwa_offline.png') });

  /* ---- P5. Back online, the 3D twin still works ---- */
  await context.setOffline(false);
  await page.click('button[data-v="twin"]');
  await page.waitForTimeout(2500);
  check('P5.1 twin renders after offline session',
    await page.evaluate(() => !!document.querySelector('#twinCanvas, canvas')), true);

  await browser.close();
  server.close();

  console.log('ERRORS:', errors.length ? errors.join(' | ') : 'none');
  if (errors.length) process.exitCode = 1;
})();

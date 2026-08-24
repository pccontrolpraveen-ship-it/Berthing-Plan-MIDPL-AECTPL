/* PORTVISION 3D — desktop (Electron) checks.
 * Run from the repository root:  node tests/test_desktop.js  →  ERRORS: none
 * Requires a display; in CI or a headless container run it via xvfb-run.
 *
 * Two scenarios:
 *   1. No DATABASE_URL   — the common case. No backend is started and the app
 *                          must report Standalone.
 *   2. Unreachable DB    — a database URL is configured but nothing answers.
 *                          The backend is forked and wired up, and the app must
 *                          STILL report Standalone rather than claiming a
 *                          database it cannot reach. That honesty guarantee is
 *                          what the persistence layer was built around, checked
 *                          here in the environment most likely to break it.
 */
const { _electron: electron } = require('playwright');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');

/* Set PORTVISION_PACKAGED=1 to run these same checks against a build produced
   by `npm run desktop:pack`, rather than against the checkout. That is the run
   that proves the packaging itself: asar layout, server/ unpacked so it can be
   forked, and dependency resolution from inside the archive. */
const PACKAGED = !!process.env.PORTVISION_PACKAGED;
const PACKAGED_BIN = path.join(ROOT, 'dist', 'linux-unpacked', 'portvision-3d');
const ELECTRON_BIN = PACKAGED
  ? PACKAGED_BIN
  : path.join(ROOT, 'node_modules', 'electron', 'dist', 'electron');

const errors = [];
const ok = (label, pass, detail) => {
  console.log(`${label}: ${pass ? 'PASS' : 'FAIL'}${detail ? ' — ' + detail : ''}`);
  if (!pass) errors.push(`${label}${detail ? ' — ' + detail : ''}`);
};

/* --no-sandbox is needed only because this container runs as root; it disables
   the OS-level Chromium sandbox, not the renderer sandbox that main.js sets in
   webPreferences. */
const launch = env => electron.launch({
  /* A packaged build already contains its app; only a development run needs to
     be pointed at the project directory. */
  args: PACKAGED ? ['--no-sandbox'] : ['.', '--no-sandbox'],
  cwd: ROOT,
  executablePath: ELECTRON_BIN,
  env: { ...process.env, ...env },
});

async function login(page) {
  await page.click('.roleCard[data-role="Vessel Planner"]');
  await page.fill('#mobile', '9840012345');
  await page.click('#sendOtp');
  const otp = await page.$$('#otpRow input');
  for (let i = 0; i < 6; i++) await otp[i].fill('123456'[i]);
  await page.click('#verifyOtp');
  await page.waitForTimeout(600);
}

(async () => {
  if (!fs.existsSync(ELECTRON_BIN)) {
    console.log(PACKAGED
      ? 'No packaged build found — run: npm run desktop:pack'
      : 'Electron is not installed — run: npm install');
    console.log('ERRORS: none (skipped)');
    return;
  }
  console.log(PACKAGED ? 'target: packaged build' : 'target: development checkout');

  /* ================= scenario 1: no database configured ================= */
  console.log('\n--- no DATABASE_URL ---');
  let app = await launch({ DATABASE_URL: '' });
  let page = await app.firstWindow();
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2200);

  ok('D1 window title', await page.title() === 'PORTVISION 3D — MIDPL Kattupalli',
    await page.title());

  /* Served over a real local origin, not file://, so the desktop build behaves
     identically to the browser and PWA builds. */
  const url = page.url();
  ok('D2 served from a local http origin', /^http:\/\/127\.0\.0\.1:\d+\//.test(url), url);

  /* Renderer privileges: the web app must be no more privileged than in a tab. */
  const privileged = await page.evaluate(() => ({
    require: typeof window.require,
    process: typeof window.process,
    module: typeof window.module,
  }));
  ok('D3 renderer has no Node access',
    privileged.require === 'undefined' && privileged.process === 'undefined'
    && privileged.module === 'undefined', JSON.stringify(privileged));

  /* The static server must not serve anything outside www/. */
  const origin = url.match(/^(http:\/\/127\.0\.0\.1:\d+)/)[1];
  const traversal = await page.evaluate(async o => {
    const r = await fetch(o + '/../../../etc/passwd').catch(() => null);
    if (!r) return 'blocked';
    const body = await r.text();
    return r.status === 200 && body.includes('root:') ? 'LEAKED' : r.status;
  }, origin);
  ok('D4 static server refuses path traversal', traversal !== 'LEAKED' && traversal !== 200,
    'result ' + traversal);

  await login(page);
  ok('D5 login reaches the dashboard', await page.textContent('#viewTitle') === 'Dashboard');
  ok('D6 storage badge reads Standalone with no database',
    (await page.textContent('#dbBadge')).includes('Standalone'));
  ok('D7 preload left no stale API override',
    await page.evaluate(() => localStorage.getItem('pv_api')) === null);

  /* window.open must be denied in-app — external links belong in the browser. */
  ok('D8 window.open is denied in-app',
    await page.evaluate(() => window.open('https://example.com') === null));

  await page.click('button[data-v="twin"]');
  await page.waitForTimeout(2800);
  const twin = await page.evaluate(() => ({
    three: typeof THREE, canvas: !!document.querySelector('#twinCanvas'),
  }));
  ok('D9 3D twin renders in Electron', twin.three === 'object' && twin.canvas,
    JSON.stringify(twin));
  await page.screenshot({ path: path.resolve(__dirname, '..', 'shots', 'desktop_twin.png') });
  await app.close();

  /* ========= scenario 2: database configured but unreachable ========= */
  console.log('\n--- DATABASE_URL set, nothing listening ---');
  app = await launch({ DATABASE_URL: 'postgres://nobody:nobody@127.0.0.1:1/portvision_absent' });
  page = await app.firstWindow();
  page.on('pageerror', e => errors.push('PAGEERROR (db): ' + e.message));
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3200);

  const api = await page.evaluate(() => localStorage.getItem('pv_api'));
  ok('D10 backend started and its port was wired in',
    !!api && /^http:\/\/127\.0\.0\.1:\d+$/.test(api), String(api));

  await login(page);
  /* The whole point: a configured-but-unreachable database must never be
     reported as a working one. */
  ok('D11 unreachable database still reports Standalone',
    (await page.textContent('#dbBadge')).includes('Standalone'),
    await page.textContent('#dbBadge'));
  ok('D12 app remains usable with the database down',
    await page.textContent('#viewTitle') === 'Dashboard');

  await app.close();

  console.log('\nERRORS:', errors.length ? errors.join(' | ') : 'none');
  if (errors.length) process.exitCode = 1;
})().catch(e => {
  console.log('ERRORS: harness failure — ' + (e && e.stack || e));
  process.exitCode = 1;
});

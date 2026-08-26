/* PORTVISION 3D — mobile (Capacitor) checks.
 * Run from the repository root:  node tests/test_mobile.js  →  ERRORS: none
 *
 * Building an .apk or .ipa needs the Android SDK or Xcode, so this suite does
 * not attempt it. What it checks is the part that is ours rather than the
 * toolchain's: the behaviour the web layer must get right to survive inside a
 * native web view.
 *
 * Capacitor injects window.Capacitor before the page scripts run and exposes
 * installed plugins on Capacitor.Plugins. Both are reproduced here through
 * addInitScript — the same insertion point — so the code under test runs as it
 * would on a device, and every call it makes is recorded.
 *
 * www/ is served over http://127.0.0.1 rather than file://, because Capacitor
 * serves the app from a real origin (https://localhost on Android) and the
 * service-worker behaviour under test only exists on one.
 */
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const WWW = path.join(ROOT, 'www');
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
};

const errors = [];
const ok = (label, pass, detail) => {
  console.log(`${label}: ${pass ? 'PASS' : 'FAIL'}${detail ? ' — ' + detail : ''}`);
  if (!pass) errors.push(`${label}${detail ? ' — ' + detail : ''}`);
};

/* Stand-in for the native bridge; records what the app asks of it. */
const CAPACITOR_BRIDGE = () => {
  window.__capCalls = { backButton: [], statusBar: [], exitApp: 0 };
  window.Capacitor = {
    isNativePlatform: () => true,
    getPlatform: () => 'android',
    Plugins: {
      App: {
        addListener: (event, handler) => {
          if (event === 'backButton') window.__capBack = handler;
          window.__capCalls.backButton.push(event);
          return { remove() {} };
        },
        exitApp: () => { window.__capCalls.exitApp++; },
      },
      StatusBar: {
        setStyle: o => window.__capCalls.statusBar.push(['setStyle', o.style]),
        setBackgroundColor: o => window.__capCalls.statusBar.push(['setBackgroundColor', o.color]),
      },
    },
  };
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  if (url.pathname.startsWith('/api/')) { res.writeHead(503); return res.end('{}'); }
  const rel = url.pathname === '/' ? '/index.html' : url.pathname;
  const file = path.join(WWW, path.normalize(rel).replace(/^(\.\.[/\\])+/, ''));
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(buf);
  });
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

let browser;
(async () => {
  fs.mkdirSync(path.join(ROOT, 'shots'), { recursive: true });

  /* ---- M1. The native projects are configured and in sync ---- */
  const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'capacitor.config.json'), 'utf8'));
  ok('M1.1 webDir points at the shared web app', cfg.webDir === 'www', cfg.webDir);
  ok('M1.2 appId matches the desktop build', cfg.appId === 'in.adaniports.portvision3d', cfg.appId);
  ok('M1.3 mixed content stays disabled by default', cfg.android.allowMixedContent === false);
  ok('M1.4 remote web debugging is off', cfg.android.webContentsDebuggingEnabled === false);

  /* The vendored Three.js is what lets the twin work with no network. If a sync
     ever drops it, the mobile build silently degrades to the 2D fallback. */
  for (const [label, rel] of [
    ['android', 'android/app/src/main/assets/public'],
    ['ios', 'ios/App/App/public'],
  ]) {
    const dir = path.join(ROOT, rel);
    if (!fs.existsSync(dir)) {
      ok(`M1.5 ${label} payload synced`, false, `${rel} missing — run: npx cap sync`);
      continue;
    }
    const has = f => fs.existsSync(path.join(dir, f));
    ok(`M1.5 ${label} payload carries the whole app`,
      has('index.html') && has('app.js') && has('styles.css') && has('vendor/three.min.js'),
      'vendor/three.min.js: ' + has('vendor/three.min.js'));
  }

  /* Cleartext must stay off by default on both platforms: the persistence API
     carries no authentication, so plans would cross the network modifiable. */
  const manifest = fs.readFileSync(
    path.join(ROOT, 'android/app/src/main/AndroidManifest.xml'), 'utf8');
  ok('M1.6 android cleartext traffic is not enabled',
    !/usesCleartextTraffic="true"/.test(manifest));
  const plist = fs.readFileSync(path.join(ROOT, 'ios/App/App/Info.plist'), 'utf8');
  ok('M1.7 iOS has no blanket ATS exception',
    !/NSAllowsArbitraryLoads/.test(plist));

  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}/`;
  browser = await chromium.launch()
    .catch(() => chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }));

  /* ---- M2. A service worker left by an earlier build is torn down ----
     Android serves from https://localhost, so registration succeeds there. A
     precached shell would then outlive an app update, serving the previous
     version's assets while the store believes the user is current. */
  const upgrade = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const upage = await upgrade.newPage();
  await upage.goto(base);
  await upage.evaluate(() => navigator.serviceWorker.ready);
  const before = await upage.evaluate(async () => ({
    regs: (await navigator.serviceWorker.getRegistrations()).length,
    caches: (await caches.keys()).length,
  }));
  ok('M2.1 a worker and cache exist before the upgrade',
    before.regs === 1 && before.caches >= 1, JSON.stringify(before));

  await upgrade.addInitScript(CAPACITOR_BRIDGE);   // now it is a packaged build
  await upage.reload();
  await upage.waitForTimeout(2000);
  const after = await upage.evaluate(async () => ({
    regs: (await navigator.serviceWorker.getRegistrations()).length,
    caches: (await caches.keys()).length,
  }));
  ok('M2.2 the packaged build unregisters it and clears the caches',
    after.regs === 0 && after.caches === 0, JSON.stringify(after));
  await upgrade.close();

  /* ---- M3. Native shell behaviour ---- */
  const native = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  await native.addInitScript(CAPACITOR_BRIDGE);
  const page = await native.newPage();
  page.on('pageerror', e => errors.push('PAGEERROR (native): ' + e.message));
  await page.goto(base);
  await page.waitForTimeout(1800);

  const calls = await page.evaluate(() => window.__capCalls);
  ok('M3.1 Android back button is intercepted',
    calls.backButton.includes('backButton'), JSON.stringify(calls.backButton));
  ok('M3.2 status bar is themed to the top bar',
    calls.statusBar.some(c => c[0] === 'setBackgroundColor' && c[1] === '#1F3864'),
    JSON.stringify(calls.statusBar));

  /* Back must unwind the UI, not quit and silently discard an unsaved plan. */
  await login(page);
  await page.click('#navToggle'); await page.waitForTimeout(340);
  await page.evaluate(() => window.__capBack()); await page.waitForTimeout(340);
  ok('M3.3 back closes the drawer first',
    await page.$eval('.sidebar', el => el.getBoundingClientRect().right) <= 0);

  await page.click('#navToggle'); await page.waitForTimeout(320);
  await page.click('button[data-v="reports"]'); await page.waitForTimeout(700);
  await page.evaluate(() => window.__capBack()); await page.waitForTimeout(500);
  ok('M3.4 back returns to the dashboard before quitting',
    (await page.textContent('#viewTitle')) === 'Dashboard');

  const exitBefore = await page.evaluate(() => window.__capCalls.exitApp);
  await page.evaluate(() => window.__capBack()); await page.waitForTimeout(300);
  const exitAfter = await page.evaluate(() => window.__capCalls.exitApp);
  ok('M3.5 back only quits from the dashboard', exitBefore === 0 && exitAfter === 1,
    `exitApp before=${exitBefore} after=${exitAfter}`);

  /* ---- M4. The server address is reachable without an address bar ----
     This is what made PostgreSQL storage unusable from a phone: the default is
     localhost, which on a handset means the handset, and a packaged build has
     no address bar and no developer tools to change it from. */
  await page.click('#dbBadge'); await page.waitForTimeout(400);
  ok('M4.1 the storage badge opens server settings',
    await page.$eval('#modalWrap', el => el.classList.contains('show')));
  ok('M4.2 prefilled with the address in use',
    (await page.inputValue('#srvUrl')) === 'http://localhost:4000',
    await page.inputValue('#srvUrl'));

  await page.fill('#srvUrl', 'not-a-url');
  await page.click('#srvSave'); await page.waitForTimeout(300);
  ok('M4.3 a malformed address is rejected and not stored',
    (await page.textContent('#toast')).includes('http://')
    && await page.$eval('#modalWrap', el => el.classList.contains('show'))
    && !(await page.evaluate(() => localStorage.getItem('pv_api'))));

  await page.fill('#srvUrl', 'https://portvision.example.com/');
  await page.click('#srvSave'); await page.waitForTimeout(1200);
  ok('M4.4 a valid address is stored without its trailing slash',
    (await page.evaluate(() => localStorage.getItem('pv_api'))) === 'https://portvision.example.com',
    String(await page.evaluate(() => localStorage.getItem('pv_api'))));

  await page.click('#dbBadge'); await page.waitForTimeout(400);
  await page.click('#srvStandalone'); await page.waitForTimeout(400);
  ok('M4.5 standalone can be chosen explicitly, and says so',
    (await page.evaluate(() => localStorage.getItem('pv_api'))) === ''
    && (await page.textContent('#dbBadge')).includes('Standalone'));

  await page.screenshot({ path: path.join(ROOT, 'shots', 'mobile_native.png') });
  await native.close();

  /* ---- M5. Outside a native shell, nothing changes ---- */
  const web = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const wpage = await web.newPage();
  wpage.on('pageerror', e => errors.push('PAGEERROR (web): ' + e.message));
  await wpage.goto(base);
  await wpage.waitForTimeout(1800);
  ok('M5.1 no native bridge is assumed in a browser',
    await wpage.evaluate(() => typeof window.Capacitor === 'undefined'));
  ok('M5.2 the service worker still registers for the PWA',
    await wpage.evaluate(async () => {
      await navigator.serviceWorker.ready;
      return (await navigator.serviceWorker.getRegistrations()).length === 1;
    }));
  await login(wpage);
  ok('M5.3 the app works normally', (await wpage.textContent('#viewTitle')) === 'Dashboard');
  await web.close();

  console.log('\nERRORS:', errors.length ? errors.join(' | ') : 'none');
  if (errors.length) process.exitCode = 1;
})()
  .catch(e => {
    console.log('\nERRORS: harness failure — ' + ((e && e.stack) || e));
    process.exitCode = 1;
  })
  .finally(async () => {
    if (browser) await browser.close().catch(() => {});
    server.close();
  });

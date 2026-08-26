/* PORTVISION 3D — responsive and touch checks.
 * Run from the repository root:  node tests/test_responsive.js  →  ERRORS: none
 *
 * The application shell is deliberately overflow:hidden — it is a fixed frame,
 * not a scrolling document. That makes horizontal overflow invisible rather
 * than merely awkward: content pushed past the right edge cannot be scrolled
 * to at all. So the central assertion here is that at every supported width
 * nothing extends past the viewport unless it sits inside a box that scrolls
 * on its own (tables, the month timeline, the column charts).
 *
 * Touch sizing is asserted against the 44px floor from WCAG 2.5.5 / Apple HIG.
 */
const { chromium } = require('playwright');
const path = require('path');

const APP = 'file://' + path.resolve(__dirname, '..', 'www', 'index.html');
const VIEWPORTS = [
  { name: 'phone',   width: 390, height: 844,  touch: true },
  { name: 'tablet',  width: 768, height: 1024, touch: true },
  { name: 'desktop', width: 1440, height: 900, touch: false },
];
const VIEWS = ['dashboard', 'planning', 'reports', 'twin'];

const errors = [];
const ok = (label, pass, detail) => {
  console.log(`${label}: ${pass ? 'PASS' : 'FAIL'}${detail ? ' — ' + detail : ''}`);
  if (!pass) errors.push(`${label}${detail ? ' — ' + detail : ''}`);
};

/* Below 640px the sidebar is an off-canvas drawer, so open it before navigating. */
async function goView(page, v) {
  if (await page.$eval('#modalWrap', el => el.classList.contains('show'))) {
    const g = await page.$('#mSaveGo'); if (g) { await g.click(); await page.waitForTimeout(400); }
  }
  const toggle = await page.$('#navToggle');
  if (toggle && await toggle.isVisible()) { await toggle.click(); await page.waitForTimeout(320); }
  await page.click(`button[data-v="${v}"]`);
  await page.waitForTimeout(v === 'twin' ? 2400 : 700);
}

async function login(page) {
  await page.click('.roleCard[data-role="Vessel Planner"]');
  await page.fill('#mobile', '9840012345');
  await page.click('#sendOtp');
  const otp = await page.$$('#otpRow input');
  for (let i = 0; i < 6; i++) await otp[i].fill('123456'[i]);
  await page.click('#verifyOtp');
  await page.waitForTimeout(600);
}

/* One complete voyage, so the dense screens are measured with real content. */
async function planOneVoyage(page) {
  await goView(page, 'planning');
  await page.fill('#vesselSearch', 'SM'); await page.waitForTimeout(250);
  await page.click('#comboList [data-vid]'); await page.waitForTimeout(250);
  await page.selectOption('#pVoyage', 'new'); await page.waitForTimeout(350);
  await page.fill('#etaMain', '2026-08-06T14:00');
  await page.evaluate(() => document.querySelector('#etaMain').dispatchEvent(new Event('change')));
  await page.waitForTimeout(300);
  await page.click('#vesselSelectedBtn'); await page.waitForTimeout(300);
  await page.evaluate(() => { const s = document.querySelector('[data-sl="ata"]'); s.value = 100; s.dispatchEvent(new Event('input')); });
  await page.waitForTimeout(300);
  await page.click('[data-berth="CB1"]'); await page.waitForTimeout(600);
  const cbs = await page.$$('.qcPick input');
  if (cbs[0]) await cbs[0].check();
  if (cbs[1]) await cbs[1].check();
  if (await page.$('#mDeploy')) await page.click('#mDeploy');
  await page.waitForTimeout(400);
  for (const k of ['atb', 'ato', 'atc']) {
    await page.evaluate(key => { const s = document.querySelector(`[data-sl="${key}"]`); if (s) { s.value = 100; s.dispatchEvent(new Event('input')); } }, k);
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(700);
  if (await page.$('#hcHat')) { await page.fill('#hcHat', '18'); await page.fill('#hcBin', '6'); await page.click('#hcSave'); }
  await page.waitForTimeout(400);
  if (await page.$('#savePlan')) { await page.click('#savePlan'); await page.waitForTimeout(500); }
  if (await page.$('#mSaveGo')) { await page.click('#mSaveGo'); await page.waitForTimeout(400); }
}

/* Elements past the right edge only count when no ancestor scrolls horizontally. */
const OVERFLOW_PROBE = () => {
  const win = innerWidth, bad = [];
  document.querySelectorAll('.topbar *, .content *').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.right > win + 1) {
      let n = el, scrollable = false;
      while (n && n !== document.body) {
        const o = getComputedStyle(n).overflowX;
        if (o === 'auto' || o === 'scroll') { scrollable = true; break; }
        n = n.parentElement;
      }
      if (!scrollable) {
        const c = (el.className || '').toString().split(' ')[0];
        bad.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${c ? '.' + c : ''}`);
      }
    }
  });
  return { win, doc: document.documentElement.scrollWidth, bad: [...new Set(bad)].slice(0, 6) };
};

const TOUCH_PROBE = () => {
  const out = [];
  document.querySelectorAll('button, input[type=checkbox], .bol, .qc, a').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && (r.width < 44 || r.height < 44)) {
      const c = (el.className || '').toString().split(' ')[0];
      out.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${c ? '.' + c : ''} ${Math.round(r.width)}x${Math.round(r.height)}`);
    }
  });
  return [...new Set(out)].slice(0, 8);
};

(async () => {
  const browser = await chromium.launch()
    .catch(() => chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }));

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height }, hasTouch: vp.touch,
    });
    const page = await context.newPage();
    page.on('pageerror', e => errors.push(`PAGEERROR (${vp.name}): ${e.message}`));
      /* Standalone behaviour: block the default API origin so the result does
         not depend on whether a server happens to be running locally. */
      await page.route('http://localhost:4000/**', r => r.abort());

    await page.goto(APP);
    await page.waitForTimeout(1800);

    console.log(`\n--- ${vp.name} ${vp.width}x${vp.height} ---`);

    /* R1. The login and OTP screens fit. The auth card used to be a hard 430px. */
    let r = await page.evaluate(() => ({ win: innerWidth, doc: document.documentElement.scrollWidth }));
    ok(`R1 ${vp.name} login fits`, r.doc <= r.win, `doc=${r.doc} win=${r.win}`);

    await login(page);

    /* R2. The drawer exists only below the phone breakpoint. */
    const toggleVisible = await page.$eval('#navToggle', el => getComputedStyle(el).display !== 'none');
    ok(`R2 ${vp.name} drawer toggle ${vp.name === 'phone' ? 'shown' : 'hidden'}`,
      toggleVisible === (vp.name === 'phone'));

    if (vp.name === 'phone') {
      /* R3. Opening the drawer reveals the labelled nav and Log out. */
      const closed = await page.$eval('.sidebar', el => el.getBoundingClientRect().right);
      await page.click('#navToggle'); await page.waitForTimeout(360);
      const opened = await page.$eval('.sidebar', el => el.getBoundingClientRect().right);
      ok('R3.1 phone drawer slides in', closed <= 0 && opened > 0, `closed right=${Math.round(closed)} open right=${Math.round(opened)}`);
      ok('R3.2 nav labels readable in drawer',
        await page.$eval('.nav button .nvLb', el => getComputedStyle(el).display !== 'none'));
      ok('R3.3 log out reachable in drawer',
        await page.$eval('#logout', el => el.getBoundingClientRect().width > 0 && getComputedStyle(el).display !== 'none'));
      /* Tap beside the drawer: the scrim spans the viewport, but its centre
         point sits underneath the open panel. */
      await page.click('#navScrim', { position: { x: vp.width - 40, y: 400 } });
      await page.waitForTimeout(360);
      ok('R3.4 scrim closes the drawer',
        await page.$eval('.sidebar', el => el.getBoundingClientRect().right) <= 0);
    }

    await planOneVoyage(page);

    /* R4. Nothing is clipped out of reach on any screen. */
    for (const v of VIEWS) {
      await goView(page, v);
      r = await page.evaluate(OVERFLOW_PROBE);
      ok(`R4 ${vp.name}/${v} nothing clipped`, r.doc <= r.win && r.bad.length === 0,
        r.doc > r.win ? `page is ${r.doc - r.win}px wider than the viewport`
          : r.bad.length ? `unscrollable overflow: ${r.bad.join(', ')}` : `docW=${r.doc}`);
      await page.screenshot({ path: path.resolve(__dirname, '..', 'shots', `responsive_${vp.name}_${v}.png`) });
    }

    /* R5. Touch targets, on the viewports that actually have a touch screen. */
    if (vp.touch) {
      const small = await page.evaluate(TOUCH_PROBE);
      ok(`R5 ${vp.name} touch targets >= 44px`, small.length === 0, small.join(', '));

      /* R6. A coarse pointer starts the twin in the light graphics pipeline. */
      await goView(page, 'twin');
      const qual = await page.$eval('#qualBtn', el => el.textContent.trim());
      ok(`R6 ${vp.name} twin auto-selects mobile quality`, qual.includes('Mobile'), `button reads "${qual}"`);
    }

    await context.close();
  }

  await browser.close();
  console.log('\nERRORS:', errors.length ? errors.join(' | ') : 'none');
  if (errors.length) process.exitCode = 1;
})();

/* PORTVISION 3D — authentication checks.
 * Run from the repository root, with a PostgreSQL to talk to:
 *
 *   DATABASE_URL=postgres://… node tests/test_auth.js     →  ERRORS: none
 *
 * This suite starts a real server against a real database and drives it over
 * HTTP, because the thing being tested is exactly what a determined client
 * could do to the API — and that cannot be checked by calling functions.
 *
 * The prototype's login compared the OTP against the literal '123456' in
 * browser JavaScript and let the operator pick their own role from three cards.
 * The two properties that replaced it, and that everything below exists to hold
 * down, are:
 *   - the code is generated, hashed and verified on the server
 *   - the role is read from the users table, never from the request
 */
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const SECRET = crypto.randomBytes(48).toString('base64url');
const PORT = 4123;
const BASE = `http://127.0.0.1:${PORT}`;

const errors = [];
const ok = (label, pass, detail) => {
  console.log(`${label}: ${pass ? 'PASS' : 'FAIL'}${detail ? ' — ' + detail : ''}`);
  if (!pass) errors.push(`${label}${detail ? ' — ' + detail : ''}`);
};

if (!process.env.DATABASE_URL) {
  console.log('ERRORS: DATABASE_URL is not set — this suite needs a PostgreSQL to run against');
  process.exit(1);
}

/* Server stdout carries the OTP when PORTVISION_OTP_TRANSPORT=log. That is the
   only place it ever appears: never in an HTTP response, so the API cannot be
   used to obtain a code for a number you do not control. */
let serverLog = '';
const otpFor = mobile => {
  const m = [...serverLog.matchAll(new RegExp(`\\[otp\\] ${mobile} -> (\\d{6})`, 'g'))];
  return m.length ? m[m.length - 1][1] : null;
};

const req = (method, p, body, token) => new Promise(resolve => {
  const data = body == null ? null : JSON.stringify(body);
  const r = http.request(`${BASE}${p}`, {
    method,
    headers: Object.assign(
      { 'Content-Type': 'application/json' },
      data ? { 'Content-Length': Buffer.byteLength(data) } : {},
      token ? { Authorization: 'Bearer ' + token } : {}),
  }, res => {
    let out = '';
    res.on('data', c => { out += c; });
    res.on('end', () => {
      let json = null; try { json = JSON.parse(out); } catch (e) {}
      resolve({ status: res.statusCode, body: json, raw: out });
    });
  });
  r.on('error', e => resolve({ status: 0, body: { error: e.message } }));
  if (data) r.write(data);
  r.end();
});

const sql = async q => {
  const { Pool } = require(path.join(ROOT, 'server', 'node_modules', 'pg'));
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try { return await pool.query(q); } finally { await pool.end(); }
};

const runCli = (...args) => new Promise(resolve => {
  const p = spawn(process.execPath, [path.join(ROOT, 'server', 'manage-users.js'), ...args],
    { env: Object.assign({}, process.env), cwd: ROOT });
  let out = '';
  p.stdout.on('data', d => { out += d; });
  p.stderr.on('data', d => { out += d; });
  p.on('close', code => resolve({ code, out: out.trim() }));
});

let server;
const waitForServer = async () => {
  for (let i = 0; i < 60; i++) {
    const r = await req('GET', '/api/health');
    if (r.status === 200) return true;
    await new Promise(r2 => setTimeout(r2, 250));
  }
  return false;
};

(async () => {
  /* ---- A1. The server will not start without a signing key ---- */
  const noSecret = await new Promise(resolve => {
    const env = Object.assign({}, process.env);
    delete env.PORTVISION_JWT_SECRET;
    const p = spawn(process.execPath, ['server.js'], { cwd: path.join(ROOT, 'server'), env });
    let out = '';
    p.stdout.on('data', d => { out += d; });
    p.stderr.on('data', d => { out += d; });
    p.on('close', code => resolve({ code, out }));
    setTimeout(() => p.kill(), 8000);
  });
  ok('A1.1 refuses to start with no PORTVISION_JWT_SECRET', noSecret.code !== 0);
  ok('A1.2 and says how to generate one', /PORTVISION_JWT_SECRET/.test(noSecret.out));

  /* A weak key is as good as none — every deployment sharing a short secret is
     the failure mode a built-in default would have caused. */
  const shortSecret = await new Promise(resolve => {
    const env = Object.assign({}, process.env, { PORTVISION_JWT_SECRET: 'short' });
    const p = spawn(process.execPath, ['server.js'], { cwd: path.join(ROOT, 'server'), env });
    let out = '';
    p.stderr.on('data', d => { out += d; });
    p.on('close', code => resolve({ code, out }));
    setTimeout(() => p.kill(), 8000);
  });
  ok('A1.3 refuses a secret shorter than 32 characters', shortSecret.code !== 0);

  /* ---- start the real one ---- */
  await sql(`TRUNCATE auth_events, refresh_tokens, otp_challenges, voyages, users RESTART IDENTITY CASCADE`);

  server = spawn(process.execPath, ['server.js'], {
    cwd: path.join(ROOT, 'server'),
    env: Object.assign({}, process.env, {
      PORTVISION_JWT_SECRET: SECRET,
      PORTVISION_OTP_TRANSPORT: 'log',
      PORT: String(PORT),
    }),
  });
  server.stdout.on('data', d => { serverLog += d; });
  server.stderr.on('data', d => { serverLog += d; });
  if (!await waitForServer()) { throw new Error('server did not start:\n' + serverLog); }

  /* ---- A2. Nothing is readable or writable without a token ---- */
  for (const [m, p] of [['GET', '/api/vessels'], ['GET', '/api/voyages'],
                        ['POST', '/api/vessels'], ['PUT', '/api/state']]) {
    const r = await req(m, p, m === 'GET' ? null : {});
    ok(`A2 ${m} ${p} requires authentication`, r.status === 401, 'got ' + r.status);
  }
  ok('A2.1 health stays public so the app can probe it',
    (await req('GET', '/api/health')).status === 200);

  /* ---- A3. Accounts are created by an administrator, not self-registered ---- */
  ok('A3.1 no accounts exist initially',
    (await req('GET', '/api/auth/config')).body.users === 0);
  const added = await runCli('add', '--mobile', '9840012345', '--role', 'Admin', '--name', 'R. Kumar');
  ok('A3.2 the CLI creates the first Admin', added.code === 0, added.out);
  await runCli('add', '--mobile', '9840055555', '--role', 'Manager', '--name', 'S. Iyer');
  await runCli('add', '--mobile', '9840077777', '--role', 'Vessel Planner', '--name', 'A. Rao');
  /* A5.7 exhausts 9840077777's request quota on purpose, so the browser
     section further down signs in as a separate, untouched account. */
  await runCli('add', '--mobile', '9840088888', '--role', 'Vessel Planner', '--name', 'UI Planner');
  const badRole = await runCli('add', '--mobile', '9840099999', '--role', 'Superuser');
  ok('A3.3 an unknown role is refused', badRole.code !== 0, badRole.out);

  /* ---- A4. OTP request does not reveal who has an account ---- */
  const known = await req('POST', '/api/auth/request-otp', { mobile: '9840012345' });
  const unknown = await req('POST', '/api/auth/request-otp', { mobile: '9999999999' });
  ok('A4.1 known and unknown numbers get identical answers',
    known.status === unknown.status && JSON.stringify(known.body) === JSON.stringify(unknown.body),
    `${known.status} ${JSON.stringify(known.body)} vs ${unknown.status} ${JSON.stringify(unknown.body)}`);
  ok('A4.2 no code is issued for an unknown number', otpFor('9999999999') === null);
  ok('A4.3 the response never contains the code',
    !/\d{6}/.test(JSON.stringify(known.body)), JSON.stringify(known.body));

  /* ---- A5. Verifying ---- */
  const code = otpFor('9840012345');
  ok('A5.1 a code was generated for the real account', /^\d{6}$/.test(code || ''), String(code));

  const wrong = await req('POST', '/api/auth/verify-otp', { mobile: '9840012345', code: '000000' });
  ok('A5.2 a wrong code is rejected', wrong.status === 401, 'got ' + wrong.status);

  const good = await req('POST', '/api/auth/verify-otp', { mobile: '9840012345', code });
  ok('A5.3 the right code signs in', good.status === 200, JSON.stringify(good.body));
  ok('A5.4 the role comes from the database, not the request',
    good.body.user && good.body.user.role === 'Admin', JSON.stringify(good.body.user));

  const replay = await req('POST', '/api/auth/verify-otp', { mobile: '9840012345', code });
  ok('A5.5 the same code cannot be used twice', replay.status === 401, 'got ' + replay.status);

  const adminAccess = good.body.accessToken;
  let adminRefresh = good.body.refreshToken;

  /* Brute force: a six-digit code is 10^6 guesses, which is minutes of scripted
     requests without a cap on attempts. */
  await req('POST', '/api/auth/request-otp', { mobile: '9840012345' });
  let lockedOut = false;
  for (let i = 0; i < 7; i++) {
    const r = await req('POST', '/api/auth/verify-otp', { mobile: '9840012345', code: '111111' });
    if (r.status === 429) { lockedOut = true; break; }
  }
  ok('A5.6 guessing is locked out after repeated failures', lockedOut);

  /* Requesting codes over and over is its own denial-of-service and SMS bill. */
  let rateLimited = false;
  for (let i = 0; i < 8; i++) {
    const r = await req('POST', '/api/auth/request-otp', { mobile: '9840077777' });
    if (r.status === 429) { rateLimited = true; break; }
  }
  ok('A5.7 code requests are rate limited', rateLimited);

  /* ---- A6. Tokens cannot be forged ---- */
  const b64 = o => Buffer.from(JSON.stringify(o)).toString('base64url');
  const tampered = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub: '2', mobile: '9840055555', role: 'Admin', iss: 'portvision' })}.nope`;
  const algNone = `${b64({ alg: 'none', typ: 'JWT' })}.${b64({ sub: '1', mobile: '9840012345', role: 'Admin', iss: 'portvision' })}.`;
  const wrongKey = require(path.join(ROOT, 'server', 'node_modules', 'jsonwebtoken'))
    .sign({ sub: '2', mobile: '9840055555', role: 'Admin' }, 'a'.repeat(48), { issuer: 'portvision' });

  for (const [label, tok] of [['a tampered payload', tampered], ['alg:none', algNone],
                              ['a token signed with another key', wrongKey]]) {
    const r = await req('PUT', '/api/state', { voyages: [] }, tok);
    ok(`A6 ${label} is rejected`, r.status === 401, 'got ' + r.status);
  }

  /* ---- A7. Roles are enforced, not advisory ---- */
  await req('POST', '/api/auth/request-otp', { mobile: '9840055555' });
  const mgr = await req('POST', '/api/auth/verify-otp',
    { mobile: '9840055555', code: otpFor('9840055555') });
  ok('A7.1 the Manager signs in as Manager', mgr.body.user.role === 'Manager');
  const mgrToken = mgr.body.accessToken;

  ok('A7.2 a Manager may read voyages',
    (await req('GET', '/api/voyages', null, mgrToken)).status === 200);
  const mgrWrite = await req('PUT', '/api/state', { voyages: [] }, mgrToken);
  ok('A7.3 a Manager may not write the plan', mgrWrite.status === 403, 'got ' + mgrWrite.status);
  ok('A7.4 and is told why, in terms of the role they hold',
    /Manager/.test((mgrWrite.body && mgrWrite.body.error) || ''), JSON.stringify(mgrWrite.body));
  ok('A7.5 a Manager may not add a vessel',
    (await req('POST', '/api/vessels', { id: 1, name: 'X', loa: 100 }, mgrToken)).status === 403);
  ok('A7.6 an Admin may write the plan',
    (await req('PUT', '/api/state', { voyages: [] }, adminAccess)).status === 200);

  /* ---- A8. Refresh rotates, and the old token dies ---- */
  const rot = await req('POST', '/api/auth/refresh', { refreshToken: adminRefresh });
  ok('A8.1 refresh returns a new pair', rot.status === 200 && !!rot.body.accessToken);
  ok('A8.2 the refresh token itself is replaced',
    rot.body.refreshToken !== adminRefresh);
  const reuse = await req('POST', '/api/auth/refresh', { refreshToken: adminRefresh });
  ok('A8.3 the spent refresh token is refused', reuse.status === 401, 'got ' + reuse.status);
  adminRefresh = rot.body.refreshToken;

  /* ---- A9. Signing out really ends the session ---- */
  await req('POST', '/api/auth/logout', { refreshToken: adminRefresh });
  ok('A9.1 a signed-out refresh token cannot be used',
    (await req('POST', '/api/auth/refresh', { refreshToken: adminRefresh })).status === 401);

  /* ---- A10. Administrative changes take effect on live sessions ---- */
  await req('POST', '/api/auth/request-otp', { mobile: '9840055555' });
  const mgr2 = await req('POST', '/api/auth/verify-otp',
    { mobile: '9840055555', code: otpFor('9840055555') });
  await runCli('disable', '--mobile', '9840055555');
  ok('A10.1 disabling an account revokes its sessions',
    (await req('POST', '/api/auth/refresh', { refreshToken: mgr2.body.refreshToken })).status === 401);
  const codeBefore = otpFor('9840055555');
  const denied = await req('POST', '/api/auth/request-otp', { mobile: '9840055555' });
  ok('A10.2 a disabled account gets the same generic answer but no new code',
    denied.status === 200 && otpFor('9840055555') === codeBefore,
    `status ${denied.status}, code ${otpFor('9840055555') === codeBefore ? 'unchanged' : 'CHANGED'}`);

  await runCli('enable', '--mobile', '9840055555');
  await runCli('role', '--mobile', '9840055555', '--role', 'Vessel Planner');
  await req('POST', '/api/auth/request-otp', { mobile: '9840055555' });
  const promoted = await req('POST', '/api/auth/verify-otp',
    { mobile: '9840055555', code: otpFor('9840055555') });
  ok('A10.3 a role change is reflected at the next sign-in',
    promoted.body.user.role === 'Vessel Planner', JSON.stringify(promoted.body.user));
  ok('A10.4 and the new role can now write',
    (await req('PUT', '/api/state', { voyages: [] }, promoted.body.accessToken)).status === 200);

  /* ---- A11. It is all written down ---- */
  const events = await sql(`SELECT event, count(*)::int c FROM auth_events GROUP BY event ORDER BY event`);
  const kinds = events.rows.reduce((a, r) => (a[r.event] = r.c, a), {});
  ok('A11.1 sign-ins are recorded server-side', (kinds.login || 0) >= 3, JSON.stringify(kinds));
  ok('A11.2 failed attempts are recorded', (kinds.otp_failed || 0) >= 2, JSON.stringify(kinds));
  ok('A11.3 refused actions are recorded', (kinds.denied || 0) >= 2, JSON.stringify(kinds));

  const stored = await sql(`SELECT code_hash FROM otp_challenges LIMIT 1`);
  ok('A11.4 codes are stored hashed, never in the clear',
    stored.rowCount > 0 && /^[0-9a-f]{32}:[0-9a-f]{64}$/.test(stored.rows[0].code_hash),
    stored.rowCount ? stored.rows[0].code_hash.slice(0, 24) + '…' : 'no rows');
  const refreshRows = await sql(`SELECT token_hash FROM refresh_tokens LIMIT 1`);
  ok('A11.5 refresh tokens are stored hashed',
    refreshRows.rowCount > 0 && /^[0-9a-f]{64}$/.test(refreshRows.rows[0].token_hash));

  /* ---- A12. The browser actually uses it ---- */
  /* The point of all of the above is that the UI stops deciding its own role. */
  const wwwServer = http.createServer((rq, rs) => {
    const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
                   '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
    const u = new URL(rq.url, 'http://127.0.0.1');
    const rel = u.pathname === '/' ? '/index.html' : u.pathname;
    const f = path.join(ROOT, 'www', path.normalize(rel).replace(/^(\.\.[/\\])+/, ''));
    fs.readFile(f, (e, buf) => {
      if (e) { rs.writeHead(404); return rs.end('nope'); }
      rs.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
      rs.end(buf);
    });
  });
  await new Promise(r => wwwServer.listen(0, '127.0.0.1', r));
  const wwwBase = `http://127.0.0.1:${wwwServer.address().port}/`;

  const browser = await chromium.launch()
    .catch(() => chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }));
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(api => { localStorage.setItem('pv_api', api); }, BASE);
  const page = await ctx.newPage();
  const pageErrors = [];
  page.on('pageerror', e => pageErrors.push(e.message));
  await page.goto(wwwBase);
  await page.waitForTimeout(2600);

  ok('A12.1 the app detects that sign-in is required',
    await page.evaluate(() => authRequired === true));
  ok('A12.2 the role picker is hidden when the server decides roles',
    await page.$eval('#loginRoleRow', el => getComputedStyle(el).display === 'none'));
  ok('A12.3 the demo code is not offered',
    !/123456/.test(await page.textContent('#loginNote')),
    await page.textContent('#loginNote'));

  await page.fill('#mobile', '9840088888');
  await page.click('#sendOtp');
  await page.waitForTimeout(1200);
  const uiCode = otpFor('9840088888');
  ok('A12.3b the browser request produced a code server-side',
    /^\d{6}$/.test(uiCode || ''), String(uiCode));
  const boxes = await page.$$('#otpRow input');
  for (let i = 0; i < 6; i++) await boxes[i].fill(uiCode[i]);
  await page.click('#verifyOtp');
  await page.waitForTimeout(2200);

  ok('A12.4 a real OTP signs the operator in',
    (await page.$eval('#app', el => el.classList.contains('active'))), 'app screen active');
  ok('A12.5 the badge shows the server storage',
    (await page.textContent('#dbBadge')).includes('PostgreSQL'),
    await page.textContent('#dbBadge'));
  ok('A12.6 the role shown is the one the server assigned',
    (await page.textContent('#uRole')) === 'Vessel Planner',
    await page.textContent('#uRole'));

  /* Signing out must clear the session, not just the screen. */
  await page.click('#logout');
  await page.waitForTimeout(1200);
  ok('A12.7 signing out clears the stored session',
    !(await page.evaluate(() => localStorage.getItem('pv_session'))),
    String(await page.evaluate(() => localStorage.getItem('pv_session'))));
  ok('A12.8 and returns to the login screen',
    await page.$eval('#login', el => el.classList.contains('active')));

  if (pageErrors.length) errors.push('PAGEERROR: ' + pageErrors.join(' | '));

  await page.screenshot({ path: path.join(ROOT, 'shots', 'auth_login.png') });
  await browser.close();
  wwwServer.close();

  console.log('\nERRORS:', errors.length ? errors.join(' | ') : 'none');
  if (errors.length) process.exitCode = 1;
})()
  .catch(e => {
    console.log('\nERRORS: harness failure — ' + ((e && e.stack) || e));
    process.exitCode = 1;
  })
  .finally(() => { if (server) server.kill(); });

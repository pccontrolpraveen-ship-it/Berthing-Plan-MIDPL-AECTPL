/* PORTVISION 3D — authentication.
 *
 * Replaces the prototype's login, where the browser compared the OTP against the
 * literal '123456' and the operator chose their own role from three cards. Both
 * facts now come from the server: the code is generated here, hashed here and
 * verified here, and the role is read from the users table. Nothing the client
 * sends influences its own permissions.
 *
 * Tokens
 *   access   short-lived JWT, carries { sub, mobile, role }, never stored
 *   refresh  opaque random string; only its SHA-256 is stored, and it is rotated
 *            on every use so a stolen copy stops working as soon as the real
 *            client refreshes
 *
 * Secrets
 *   PORTVISION_JWT_SECRET must be set. The server refuses to start without it —
 *   a built-in default would be worse than no authentication at all, because it
 *   looks like security while every deployment shares the same signing key.
 *
 * OTP delivery is pluggable; see deliverOtp below. No transport ever returns the
 * code to the caller, so the API response cannot be used to log in.
 */
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const ROLES = ['Vessel Planner', 'Manager', 'Admin'];

const ACCESS_TTL_S = Number(process.env.PORTVISION_ACCESS_TTL || 900);          // 15 min
const REFRESH_TTL_S = Number(process.env.PORTVISION_REFRESH_TTL || 30 * 86400); // 30 days
const OTP_TTL_S = Number(process.env.PORTVISION_OTP_TTL || 300);               // 5 min
const OTP_MAX_ATTEMPTS = 5;
const OTP_MAX_PER_WINDOW = 5;
const OTP_WINDOW_S = 900;                                                       // 15 min

function jwtSecret() {
  const s = process.env.PORTVISION_JWT_SECRET;
  if (!s || s.length < 32) {
    throw new Error(
      'PORTVISION_JWT_SECRET must be set to at least 32 characters. ' +
      'Generate one with:  node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'base64url\'))"');
  }
  return s;
}

/* ---------- hashing ----------
   scrypt is in Node's standard library, so the OTP hash needs no native module.
   Codes are short-lived and single-use, so the cost parameters are tuned for a
   login round trip rather than for offline resistance on a long-lived secret. */
const scrypt = (code, salt) => new Promise((res, rej) =>
  crypto.scrypt(String(code), salt, 32, (e, buf) => (e ? rej(e) : res(buf.toString('hex')))));

async function hashCode(code) {
  const salt = crypto.randomBytes(16).toString('hex');
  return salt + ':' + await scrypt(code, salt);
}
async function verifyCode(code, stored) {
  const [salt, want] = String(stored).split(':');
  if (!salt || !want) return false;
  const got = await scrypt(code, salt);
  const a = Buffer.from(got, 'hex'), b = Buffer.from(want, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
const sha256 = v => crypto.createHash('sha256').update(String(v)).digest('hex');

/* A 6-digit code from a CSPRNG. Math.random() would be predictable enough to
   guess given a couple of observed codes. */
const newOtp = () => String(crypto.randomInt(0, 1000000)).padStart(6, '0');

/* ---------- OTP delivery ----------
   'log'     writes the code to the server's stdout — development and the
             automated tests, which read it from there
   'webhook' POSTs { mobile, code, text } to PORTVISION_OTP_WEBHOOK_URL, which is
             where an SMS gateway shim belongs
   'none'    generates and stores the code but delivers nothing, so a deployment
             that has not configured a transport fails visibly rather than
             appearing to send messages that never arrive

   Whatever the transport, the code is never in the HTTP response. */
async function deliverOtp(mobile, code) {
  const mode = process.env.PORTVISION_OTP_TRANSPORT || 'log';
  const text = `PORTVISION 3D login code: ${code}. Valid for ${Math.round(OTP_TTL_S / 60)} minutes.`;
  if (mode === 'log') {
    console.log(`[otp] ${mobile} -> ${code} (expires in ${OTP_TTL_S}s)`);
    return true;
  }
  if (mode === 'webhook') {
    const url = process.env.PORTVISION_OTP_WEBHOOK_URL;
    if (!url) throw new Error('PORTVISION_OTP_WEBHOOK_URL is not set');
    const r = await fetch(url, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' },
        process.env.PORTVISION_OTP_WEBHOOK_AUTH
          ? { Authorization: process.env.PORTVISION_OTP_WEBHOOK_AUTH } : {}),
      body: JSON.stringify({ mobile, code, text }),
    });
    if (!r.ok) throw new Error('OTP gateway returned HTTP ' + r.status);
    return true;
  }
  if (mode === 'none') {
    console.warn(`[otp] no transport configured — code for ${mobile} was not delivered`);
    return false;
  }
  throw new Error('unknown PORTVISION_OTP_TRANSPORT: ' + mode);
}

const validMobile = m => /^[0-9]{10}$/.test(String(m || '').trim());

function makeAuth(pool) {
  const ipOf = req =>
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip || null;

  const logEvent = (mobile, userId, event, detail, ip) =>
    pool.query(
      'INSERT INTO auth_events (mobile,user_id,event,detail,ip) VALUES ($1,$2,$3,$4,$5)',
      [mobile || null, userId || null, event, detail || null, ip || null])
      .catch(e => console.error('[auth] could not write auth_events:', e.message));

  const signAccess = u => jwt.sign(
    { sub: String(u.id), mobile: u.mobile, role: u.role, name: u.name || null },
    jwtSecret(), { expiresIn: ACCESS_TTL_S, issuer: 'portvision' });

  async function issueRefresh(userId) {
    const token = crypto.randomBytes(48).toString('base64url');
    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1,$2, now() + ($3 || ' seconds')::interval)`,
      [userId, sha256(token), String(REFRESH_TTL_S)]);
    return token;
  }

  const publicUser = u => ({ mobile: u.mobile, role: u.role, name: u.name || null });

  /* ---------- middleware ---------- */
  function requireAuth(req, res, next) {
    const h = String(req.headers.authorization || '');
    const m = h.match(/^Bearer\s+(.+)$/i);
    if (!m) return res.status(401).json({ error: 'authentication required' });
    try {
      req.user = jwt.verify(m[1], jwtSecret(), { issuer: 'portvision' });
      next();
    } catch (e) {
      res.status(401).json({
        error: e.name === 'TokenExpiredError' ? 'access token expired' : 'invalid access token',
        expired: e.name === 'TokenExpiredError',
      });
    }
  }

  const requireRole = (...roles) => (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'authentication required' });
    if (!roles.includes(req.user.role)) {
      logEvent(req.user.mobile, req.user.sub, 'denied',
        `${req.method} ${req.originalUrl} requires ${roles.join(' or ')}`, ipOf(req));
      return res.status(403).json({
        error: `this action is restricted to: ${roles.join(', ')}. You are signed in as ${req.user.role}.`,
      });
    }
    next();
  };

  /* ---------- routes ---------- */
  function mount(app) {
    /* Whether authentication is switched on at all. The client asks before
       showing a login form, so a server without a users table configured still
       behaves predictably rather than failing at the first request. */
    app.get('/api/auth/config', async (_req, res) => {
      try {
        const n = await pool.query('SELECT count(*)::int c FROM users WHERE active');
        res.json({ authRequired: true, users: n.rows[0].c, roles: ROLES });
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    app.post('/api/auth/request-otp', async (req, res) => {
      const mobile = String((req.body && req.body.mobile) || '').trim();
      const ip = ipOf(req);
      if (!validMobile(mobile)) return res.status(400).json({ error: 'Enter a valid 10-digit mobile number' });

      try {
        const recent = await pool.query(
          `SELECT count(*)::int c FROM otp_challenges
           WHERE mobile=$1 AND created_at > now() - ($2 || ' seconds')::interval`,
          [mobile, String(OTP_WINDOW_S)]);
        if (recent.rows[0].c >= OTP_MAX_PER_WINDOW) {
          await logEvent(mobile, null, 'otp_requested', 'rate limited', ip);
          return res.status(429).json({ error: 'Too many codes requested. Try again in a few minutes.' });
        }

        const u = await pool.query('SELECT * FROM users WHERE mobile=$1 AND active', [mobile]);

        /* Always answer the same way. Replying "no such user" here would turn
           this endpoint into a way to find out which numbers hold accounts. */
        if (u.rowCount) {
          const code = newOtp();
          await pool.query(
            `INSERT INTO otp_challenges (mobile, code_hash, expires_at)
             VALUES ($1,$2, now() + ($3 || ' seconds')::interval)`,
            [mobile, await hashCode(code), String(OTP_TTL_S)]);
          await deliverOtp(mobile, code);
          await logEvent(mobile, u.rows[0].id, 'otp_requested', null, ip);
        } else {
          await logEvent(mobile, null, 'otp_requested', 'unknown or inactive mobile', ip);
        }
        res.json({ ok: true, expiresInSeconds: OTP_TTL_S });
      } catch (e) {
        console.error('[auth] request-otp:', e.message);
        res.status(500).json({ error: 'Could not send the code. Contact your administrator.' });
      }
    });

    app.post('/api/auth/verify-otp', async (req, res) => {
      const mobile = String((req.body && req.body.mobile) || '').trim();
      const code = String((req.body && req.body.code) || '').trim();
      const ip = ipOf(req);
      if (!validMobile(mobile) || !/^[0-9]{6}$/.test(code)) {
        return res.status(400).json({ error: 'Enter the 6-digit code' });
      }
      const bad = () => res.status(401).json({ error: 'That code is not valid. Request a new one.' });

      try {
        const ch = await pool.query(
          `SELECT * FROM otp_challenges
           WHERE mobile=$1 AND consumed_at IS NULL AND expires_at > now()
           ORDER BY created_at DESC LIMIT 1`, [mobile]);
        if (!ch.rowCount) { await logEvent(mobile, null, 'otp_failed', 'no live challenge', ip); return bad(); }

        const row = ch.rows[0];
        if (row.attempts >= OTP_MAX_ATTEMPTS) {
          await pool.query('UPDATE otp_challenges SET consumed_at=now() WHERE id=$1', [row.id]);
          await logEvent(mobile, null, 'otp_failed', 'attempts exhausted', ip);
          return res.status(429).json({ error: 'Too many incorrect attempts. Request a new code.' });
        }

        if (!await verifyCode(code, row.code_hash)) {
          await pool.query('UPDATE otp_challenges SET attempts=attempts+1 WHERE id=$1', [row.id]);
          await logEvent(mobile, null, 'otp_failed', 'wrong code', ip);
          return bad();
        }

        /* Correct: burn the challenge before issuing anything, so the same code
           cannot be redeemed twice by two concurrent requests. */
        const burn = await pool.query(
          'UPDATE otp_challenges SET consumed_at=now() WHERE id=$1 AND consumed_at IS NULL RETURNING id',
          [row.id]);
        if (!burn.rowCount) return bad();

        const u = await pool.query('SELECT * FROM users WHERE mobile=$1 AND active', [mobile]);
        if (!u.rowCount) { await logEvent(mobile, null, 'otp_failed', 'user gone or deactivated', ip); return bad(); }

        const user = u.rows[0];
        await pool.query('UPDATE users SET last_login=now() WHERE id=$1', [user.id]);
        await logEvent(mobile, user.id, 'login', null, ip);

        res.json({
          accessToken: signAccess(user),
          refreshToken: await issueRefresh(user.id),
          expiresIn: ACCESS_TTL_S,
          user: publicUser(user),
        });
      } catch (e) {
        console.error('[auth] verify-otp:', e.message);
        res.status(500).json({ error: 'Could not complete sign-in.' });
      }
    });

    app.post('/api/auth/refresh', async (req, res) => {
      const token = String((req.body && req.body.refreshToken) || '');
      if (!token) return res.status(400).json({ error: 'refreshToken missing' });
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const r = await client.query(
          `SELECT rt.*, u.mobile, u.role, u.name, u.active
           FROM refresh_tokens rt JOIN users u ON u.id = rt.user_id
           WHERE rt.token_hash=$1 FOR UPDATE`, [sha256(token)]);
        if (!r.rowCount || r.rows[0].revoked_at || !r.rows[0].active
            || new Date(r.rows[0].expires_at) <= new Date()) {
          await client.query('ROLLBACK');
          return res.status(401).json({ error: 'session expired — sign in again' });
        }
        const row = r.rows[0];
        /* Rotate: the presented token dies here and a new one is issued. */
        await client.query('UPDATE refresh_tokens SET revoked_at=now() WHERE id=$1', [row.id]);
        const next = crypto.randomBytes(48).toString('base64url');
        await client.query(
          `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
           VALUES ($1,$2, now() + ($3 || ' seconds')::interval)`,
          [row.user_id, sha256(next), String(REFRESH_TTL_S)]);
        await client.query('COMMIT');

        const user = { id: row.user_id, mobile: row.mobile, role: row.role, name: row.name };
        logEvent(row.mobile, row.user_id, 'refresh', null, ipOf(req));
        res.json({
          accessToken: signAccess(user), refreshToken: next,
          expiresIn: ACCESS_TTL_S, user: publicUser(user),
        });
      } catch (e) {
        await client.query('ROLLBACK').catch(() => {});
        console.error('[auth] refresh:', e.message);
        res.status(500).json({ error: 'Could not refresh the session.' });
      } finally { client.release(); }
    });

    app.post('/api/auth/logout', async (req, res) => {
      const token = String((req.body && req.body.refreshToken) || '');
      try {
        if (token) {
          await pool.query(
            'UPDATE refresh_tokens SET revoked_at=now() WHERE token_hash=$1 AND revoked_at IS NULL',
            [sha256(token)]);
        }
        res.json({ ok: true });
      } catch (e) { res.status(500).json({ error: e.message }); }
    });

    app.get('/api/auth/me', requireAuth, (req, res) => {
      res.json({ user: { mobile: req.user.mobile, role: req.user.role, name: req.user.name || null } });
    });
  }

  return { mount, requireAuth, requireRole, ROLES, validMobile };
}

module.exports = { makeAuth, ROLES, jwtSecret, validMobile };

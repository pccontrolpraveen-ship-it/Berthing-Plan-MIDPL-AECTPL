#!/usr/bin/env node
/* PORTVISION 3D — user administration.
 *
 * Accounts cannot be self-registered: a berthing plan is an operational record,
 * so who may edit it is decided by whoever runs the terminal, not by whoever
 * finds the URL. This is how the first Admin gets created, and how the rest of
 * the team is added afterwards.
 *
 *   node server/manage-users.js list
 *   node server/manage-users.js add    --mobile 9840012345 --role Admin --name "R. Kumar"
 *   node server/manage-users.js role   --mobile 9840012345 --role Manager
 *   node server/manage-users.js enable --mobile 9840012345
 *   node server/manage-users.js disable --mobile 9840012345
 *   node server/manage-users.js sessions --mobile 9840012345     # revoke all refresh tokens
 *
 * DATABASE_URL must be set, as for the server itself.
 */
const { Pool } = require('pg');
const { ROLES, validMobile } = require('./auth');

const argv = process.argv.slice(2);
const cmd = argv[0];
const flag = name => {
  const i = argv.indexOf('--' + name);
  return i >= 0 ? argv[i + 1] : undefined;
};

const usage = () => {
  console.log(`PORTVISION 3D — user administration

  list                              show every account
  add      --mobile N --role R [--name "…"]
  role     --mobile N --role R      change an account's role
  enable   --mobile N               allow sign-in
  disable  --mobile N               block sign-in and revoke live sessions
  sessions --mobile N               revoke live sessions only

Roles: ${ROLES.join(' | ')}`);
};

if (!cmd || cmd === 'help' || cmd === '--help') { usage(); process.exit(0); }
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function needMobile() {
  const m = String(flag('mobile') || '').trim();
  if (!validMobile(m)) { console.error('--mobile must be 10 digits'); process.exit(1); }
  return m;
}
function needRole() {
  const r = flag('role');
  if (!ROLES.includes(r)) {
    console.error(`--role must be one of: ${ROLES.join(' | ')}`);
    process.exit(1);
  }
  return r;
}

(async () => {
  try {
    if (cmd === 'list') {
      const r = await pool.query(
        'SELECT mobile, name, role, active, last_login FROM users ORDER BY role, mobile');
      if (!r.rowCount) {
        console.log('No accounts yet. Nobody can sign in until you add one:');
        console.log('  node server/manage-users.js add --mobile 9840012345 --role Admin --name "…"');
      } else {
        console.log('mobile        role            active  last login            name');
        for (const u of r.rows) {
          console.log(
            `${u.mobile.padEnd(13)} ${u.role.padEnd(15)} ${String(u.active).padEnd(7)} ` +
            `${(u.last_login ? new Date(u.last_login).toISOString().slice(0, 16) : '—').padEnd(21)} ${u.name || ''}`);
        }
      }
    }

    else if (cmd === 'add') {
      const mobile = needMobile(), role = needRole(), name = flag('name') || null;
      const r = await pool.query(
        `INSERT INTO users (mobile, name, role) VALUES ($1,$2,$3)
         ON CONFLICT (mobile) DO NOTHING RETURNING id`, [mobile, name, role]);
      if (!r.rowCount) { console.error(`${mobile} already exists — use "role" to change it.`); process.exit(1); }
      console.log(`Added ${mobile} as ${role}${name ? ' (' + name + ')' : ''}.`);
    }

    else if (cmd === 'role') {
      const mobile = needMobile(), role = needRole();
      const r = await pool.query(
        'UPDATE users SET role=$2, updated_at=now() WHERE mobile=$1 RETURNING id', [mobile, role]);
      if (!r.rowCount) { console.error(`${mobile} not found`); process.exit(1); }
      /* An access token already issued carries the old role until it expires,
         so drop the sessions rather than leaving a window open. */
      await pool.query(
        `UPDATE refresh_tokens SET revoked_at=now()
         WHERE user_id=$1 AND revoked_at IS NULL`, [r.rows[0].id]);
      console.log(`${mobile} is now ${role}. Live sessions revoked; the next access token carries the new role.`);
    }

    else if (cmd === 'enable' || cmd === 'disable') {
      const mobile = needMobile(), active = cmd === 'enable';
      const r = await pool.query(
        'UPDATE users SET active=$2, updated_at=now() WHERE mobile=$1 RETURNING id', [mobile, active]);
      if (!r.rowCount) { console.error(`${mobile} not found`); process.exit(1); }
      if (!active) {
        await pool.query(
          'UPDATE refresh_tokens SET revoked_at=now() WHERE user_id=$1 AND revoked_at IS NULL',
          [r.rows[0].id]);
      }
      console.log(`${mobile} ${active ? 'enabled' : 'disabled and signed out'}.`);
    }

    else if (cmd === 'sessions') {
      const mobile = needMobile();
      const r = await pool.query(
        `UPDATE refresh_tokens SET revoked_at=now()
         WHERE revoked_at IS NULL AND user_id=(SELECT id FROM users WHERE mobile=$1)
         RETURNING id`, [mobile]);
      console.log(`Revoked ${r.rowCount} session(s) for ${mobile}.`);
    }

    else { usage(); process.exit(1); }
  } catch (e) {
    console.error('Failed:', e.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();

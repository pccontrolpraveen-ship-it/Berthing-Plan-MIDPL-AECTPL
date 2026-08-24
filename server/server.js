/* PORTVISION 3D — persistence API
 * Frontend → this API → validation → PostgreSQL transaction → confirmed response.
 *
 * Run:
 *   cd server
 *   npm install
 *   export DATABASE_URL=postgres://user:pass@localhost:5432/portvision   (Windows: set DATABASE_URL=…)
 *   npm run init-db        # creates tables + reference data (or: psql "$DATABASE_URL" -f schema.sql)
 *   npm start              # listens on http://localhost:4000
 *
 * Open www/index.html afterwards — the app detects the server via /api/health and the
 * top-bar badge switches from "💾 Standalone" to "🗄 PostgreSQL".
 * A different host/port can be set once per browser: localStorage.setItem('pv_api','http://host:port')
 */
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const app = express();
app.use(cors());
app.use(express.json({ limit: '4mb' }));

const VESSEL_TYPES = ['Container', 'Liquid', 'Bulk', 'Break-Bulk'];
const PORT_BERTHS = { KTP: ['CB1', 'CB2', 'B3'], ENN: ['EB1'] };
const POOL_MAX = { CB1: 17, CB2: 34, B3: 34, EB1: 27 };

/* ---------- validation (server-side — the UI cannot bypass this) ---------- */
function vesselError(v) {
  if (!v || typeof v !== 'object') return 'vessel payload missing';
  if (!v.name || !String(v.name).trim()) return 'Vessel Name is required';
  if (!(Number(v.loa) > 0)) return 'LOA must be a positive number';
  if (v.beam != null && v.beam !== '' && !(Number(v.beam) > 0)) return 'Beam must be a positive number';
  if (v.draft != null && v.draft !== '' && !(Number(v.draft) > 0)) return 'Draft must be a positive number';
  if (!VESSEL_TYPES.includes(v.vtype || 'Container')) return 'Vessel Type must be one of: ' + VESSEL_TYPES.join(', ');
  return null;
}
function voyageError(v) {
  if (!v || typeof v !== 'object') return 'voyage payload missing';
  if (!v.id) return 'voyage id missing';
  if (!v.vesselId) return 'voyage vesselId missing';
  const port = v.port || 'KTP';
  if (!PORT_BERTHS[port]) return 'Port must be one of: ' + Object.keys(PORT_BERTHS).join(', ');
  if (v.berth && !PORT_BERTHS[port].includes(v.berth))
    return 'Berth ' + v.berth + ' does not belong to port ' + port;
  if (v.berth && (v.bowB || v.sternB)) {
    const max = POOL_MAX[v.berth];
    for (const [k, n] of [['Bow', v.bowB], ['Stern', v.sternB]])
      if (n != null && !(n >= 1 && n <= max)) return k + ' bollard must be between 1 and ' + max + ' for ' + v.berth;
  }
  for (const k of ['eta', 'ata', 'etb', 'atb', 'eto', 'ato', 'etc', 'atc', 'etd', 'atd'])
    if (v[k] != null && !Number.isFinite(Number(v[k]))) return k.toUpperCase() + ' is not a valid date/time';
  return null;
}

const vesselRow = v => ({
  id: Number(v.id), name: String(v.name).trim().toUpperCase(), imo: v.imo || '—',
  call_sign: v.call || '—', flag: v.flag || '—',
  loa: Number(v.loa), beam: v.beam == null || v.beam === '' ? null : Number(v.beam),
  draft: v.draft == null || v.draft === '' ? null : Number(v.draft),
  vtype: v.vtype || 'Container', service: v.service || 'ADHOC', operator: v.operator || '—',
});
const vesselOut = r => ({
  id: Number(r.id), name: r.name, imo: r.imo, call: r.call_sign, flag: r.flag,
  loa: Number(r.loa), beam: r.beam == null ? null : Number(r.beam),
  draft: r.draft == null ? null : Number(r.draft),
  vtype: r.vtype, service: r.service, operator: r.operator,
});

/* ---------- endpoints ---------- */
app.get('/api/health', async (_req, res) => {
  try { await pool.query('SELECT 1'); res.json({ ok: true, db: 'postgres' }); }
  catch (e) { res.status(500).json({ error: 'database unreachable: ' + e.message }); }
});

app.get('/api/vessels', async (_req, res) => {
  try { const r = await pool.query('SELECT * FROM vessels ORDER BY name'); res.json(r.rows.map(vesselOut)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/vessels', async (req, res) => {
  const err = vesselError(req.body);
  if (err) return res.status(400).json({ error: err });
  const v = vesselRow(req.body);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      `INSERT INTO vessels (id,name,imo,call_sign,flag,loa,beam,draft,vtype,service,operator)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [v.id, v.name, v.imo, v.call_sign, v.flag, v.loa, v.beam, v.draft, v.vtype, v.service, v.operator]);
    await client.query('COMMIT');
    res.status(201).json(req.body);
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(e.code === '23505' ? 409 : 500)
      .json({ error: e.code === '23505' ? 'A vessel with this name already exists' : e.message });
  } finally { client.release(); }
});

app.put('/api/vessels/:id', async (req, res) => {
  const err = vesselError(req.body);
  if (err) return res.status(400).json({ error: err });
  const v = vesselRow({ ...req.body, id: req.params.id });
  try {
    const r = await pool.query(
      `UPDATE vessels SET name=$2,imo=$3,call_sign=$4,flag=$5,loa=$6,beam=$7,draft=$8,
        vtype=$9,service=$10,operator=$11,updated_at=now() WHERE id=$1 RETURNING id`,
      [v.id, v.name, v.imo, v.call_sign, v.flag, v.loa, v.beam, v.draft, v.vtype, v.service, v.operator]);
    if (!r.rowCount) return res.status(404).json({ error: 'vessel not found' });
    res.json(req.body);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* one-time seed of the built-in vessel master when the table is empty */
app.post('/api/vessels/seed', async (req, res) => {
  if (!Array.isArray(req.body)) return res.status(400).json({ error: 'array expected' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const n = (await client.query('SELECT count(*) c FROM vessels')).rows[0].c;
    if (Number(n) === 0) {
      for (const raw of req.body) {
        if (vesselError(raw)) continue;
        const v = vesselRow(raw);
        await client.query(
          `INSERT INTO vessels (id,name,imo,call_sign,flag,loa,beam,draft,vtype,service,operator)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT (id) DO NOTHING`,
          [v.id, v.name, v.imo, v.call_sign, v.flag, v.loa, v.beam, v.draft, v.vtype, v.service, v.operator]);
      }
    }
    await client.query('COMMIT');
    res.json({ ok: true });
  } catch (e) { await client.query('ROLLBACK'); res.status(500).json({ error: e.message }); }
  finally { client.release(); }
});

app.get('/api/voyages', async (req, res) => {
  try {
    const r = req.query.port
      ? await pool.query('SELECT payload FROM voyages WHERE port_id=$1', [req.query.port])
      : await pool.query('SELECT payload FROM voyages');
    res.json(r.rows.map(x => x.payload));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* bulk upsert of the full voyage state in ONE transaction */
app.put('/api/state', async (req, res) => {
  const voys = (req.body && req.body.voyages) || [];
  for (const v of voys) {
    const err = voyageError(v);
    if (err) return res.status(400).json({ error: err + ' (VIA ' + (v && v.via) + ')' });
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const keep = voys.map(v => Number(v.id));
    if (keep.length) await client.query('DELETE FROM voyages WHERE NOT (id = ANY($1::bigint[]))', [keep]);
    else await client.query('DELETE FROM voyages');
    for (const v of voys) {
      await client.query(
        `INSERT INTO voyages (id,vessel_id,via,port_id,berth_id,status,payload,updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,now())
         ON CONFLICT (id) DO UPDATE SET vessel_id=$2,via=$3,port_id=$4,berth_id=$5,status=$6,payload=$7,updated_at=now()`,
        [Number(v.id), Number(v.vesselId), String(v.via), v.port || 'KTP', v.berth || null, v.status || 'Incoming', v]);
    }
    await client.query('COMMIT');
    res.json({ ok: true, voyages: voys.length });
  } catch (e) { await client.query('ROLLBACK'); res.status(500).json({ error: e.message }); }
  finally { client.release(); }
});

const PORT = process.env.PORT || 4000;
/* HOST is optional and unset by default, which keeps the standalone server
   reachable from other machines as before. The desktop build sets it to
   127.0.0.1: there the API is a private component of one installation, and the
   endpoints carry no authentication, so it must not be offered to the LAN. */
const HOST = process.env.HOST || undefined;
/* Report the port actually bound rather than the requested one — with PORT=0
   the OS assigns it, and the desktop build reads this line to learn where the
   API ended up. */
const server = app.listen(PORT, HOST, () =>
  console.log('PORTVISION server listening on http://' + (HOST || 'localhost') + ':' + server.address().port));

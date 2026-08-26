-- PORTVISION 3D — PostgreSQL schema (server/)
-- Vessel Master and Voyage data are SEPARATED: permanent vessel particulars live
-- in "vessels"; everything voyage-specific (port, berth, bollards, cranes, cargo,
-- timestamps) lives in "voyages". Ports/berths reference data included.

CREATE TABLE IF NOT EXISTS ports (
  id        text PRIMARY KEY,             -- 'KTP' | 'ENN' (stable IDs, not display names)
  name      text NOT NULL,
  label     text NOT NULL
);
INSERT INTO ports (id, name, label) VALUES
  ('KTP','Kattupalli','MIDPL — Kattupalli'),
  ('ENN','Ennore','AECTPL — Ennore')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS berths (
  id        text PRIMARY KEY,             -- CB1 CB2 B3 EB1
  port_id   text NOT NULL REFERENCES ports(id),
  name      text NOT NULL,
  length_m  numeric NOT NULL CHECK (length_m > 0),
  bollard_from int NOT NULL,
  bollard_to   int NOT NULL,
  bollard_spacing_m numeric NOT NULL
);
INSERT INTO berths VALUES
  ('CB1','KTP','Container Berth 1',350,1,17,22.5),
  ('CB2','KTP','Container Berth 2',357,1,17,22.5),
  ('B3','KTP','Berth 3',426,18,34,22.5),
  ('EB1','ENN','Ennore B1',400,1,27,15)
ON CONFLICT (id) DO NOTHING;

-- Vessel Master: relatively permanent particulars only
CREATE TABLE IF NOT EXISTS vessels (
  id        bigint PRIMARY KEY,           -- client-generated stable id
  name      text NOT NULL UNIQUE,
  imo       text,
  call_sign text,
  flag      text,
  loa       numeric NOT NULL CHECK (loa > 0),
  beam      numeric CHECK (beam IS NULL OR beam > 0),
  draft     numeric CHECK (draft IS NULL OR draft > 0),
  vtype     text NOT NULL CHECK (vtype IN ('Container','Liquid','Bulk','Break-Bulk')),
  service   text,
  operator  text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Voyage / operation: everything specific to one call at one port
CREATE TABLE IF NOT EXISTS voyages (
  id         bigint PRIMARY KEY,          -- client-generated stable id
  vessel_id  bigint NOT NULL REFERENCES vessels(id),
  via        text NOT NULL,
  port_id    text NOT NULL REFERENCES ports(id),
  berth_id   text REFERENCES berths(id),
  status     text NOT NULL,
  payload    jsonb NOT NULL,              -- full voyage object (milestones, cargo, bollards, side, cranes…)
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS voyages_port_idx  ON voyages(port_id);
CREATE INDEX IF NOT EXISTS voyages_vessel_idx ON voyages(vessel_id);

-- ============================================================================
-- Authentication (added 2.10)
-- Identity and role live HERE, on the server. The client used to choose its own
-- role at login, which meant the role was a claim by whoever was sitting at the
-- browser rather than a fact about the account. Nothing below is derived from
-- anything the client sends except the mobile number it is trying to log in as.
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id         bigserial PRIMARY KEY,
  mobile     text NOT NULL UNIQUE,        -- 10 digits, India; the login identifier
  name       text,
  role       text NOT NULL CHECK (role IN ('Vessel Planner','Manager','Admin')),
  active     boolean NOT NULL DEFAULT true,
  last_login timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- One row per OTP issued. The code itself is never stored — only a scrypt hash,
-- so a database read cannot be replayed as a login.
CREATE TABLE IF NOT EXISTS otp_challenges (
  id          bigserial PRIMARY KEY,
  mobile      text NOT NULL,
  code_hash   text NOT NULL,
  expires_at  timestamptz NOT NULL,
  attempts    int NOT NULL DEFAULT 0,
  consumed_at timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS otp_mobile_idx ON otp_challenges (mobile, created_at DESC);

-- Refresh tokens are opaque random strings; only their SHA-256 is kept, and each
-- is rotated on use so a stolen token stops working as soon as the real client
-- refreshes. Access tokens are short-lived JWTs and are not stored at all.
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id         bigserial PRIMARY KEY,
  user_id    bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS refresh_user_idx ON refresh_tokens (user_id);

-- Who did what, server-side. The in-browser audit trail is a convenience; this
-- one cannot be edited from the client.
CREATE TABLE IF NOT EXISTS auth_events (
  id         bigserial PRIMARY KEY,
  mobile     text,
  user_id    bigint REFERENCES users(id) ON DELETE SET NULL,
  event      text NOT NULL,               -- otp_requested | otp_failed | login | refresh | logout | denied
  detail     text,
  ip         text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS auth_events_idx ON auth_events (created_at DESC);

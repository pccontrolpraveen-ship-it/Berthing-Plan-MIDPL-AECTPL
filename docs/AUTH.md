# PORTVISION 3D — authentication

Version 2.10 · ROADMAP step 3

Until 2.10 the login was a prop: the browser compared the entered code against
the literal `'123456'`, the operator chose their own role from three cards, and
the API accepted any request that reached the port. That was fine for a
prototype opened from a file. It is not something to point at a terminal's
operational data.

Two things changed, and everything else follows from them:

1. **The code is generated, hashed and verified on the server.**
2. **The role is read from the `users` table** — it is a fact about the account,
   not a claim by the browser.

---

## Two modes, and the login screen says which

| | Server mode | Standalone |
|---|---|---|
| When | A PortVision server is reachable | No server reachable |
| Code | Generated server-side, sent by your OTP transport | Demo literal `123456` |
| Role | From the account | Picked on screen |
| Data | PostgreSQL, shared | This device only |
| Honest label | "Your role is set by your administrator" | "**Local demo — not a login.**" |

Standalone is not a weaker login; it is *no* login, because there is nobody to
authenticate against. It is labelled that way rather than dressed up. Do not use
it to hold operational data you rely on.

---

## Running it

```bash
export DATABASE_URL=postgres://user:pass@host:5432/portvision
export PORTVISION_JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))")
export PORTVISION_OTP_TRANSPORT=log      # development only — see below

cd server
npm install
npm run init-db
npm start
```

The server **refuses to start** without `PORTVISION_JWT_SECRET`, and refuses a
secret shorter than 32 characters. There is deliberately no built-in default: a
shipped signing key would be shared by every deployment while looking like
security. Keep the value out of the repository, and treat it as a credential —
rotating it signs everybody out, which is the correct behaviour if it leaks.

### Creating accounts

There is no self-registration. Who may edit a berthing plan is a decision for
the terminal, so the first account is created from the command line:

```bash
node server/manage-users.js add --mobile 9840012345 --role Admin --name "R. Kumar"
node server/manage-users.js add --mobile 9840055555 --role Manager
node server/manage-users.js list
```

| Command | Effect |
|---|---|
| `list` | every account, with last sign-in |
| `add --mobile N --role R [--name "…"]` | create |
| `role --mobile N --role R` | change role **and revoke live sessions** |
| `disable --mobile N` | block sign-in **and revoke live sessions** |
| `enable --mobile N` | allow sign-in again |
| `sessions --mobile N` | revoke live sessions only |

`role` and `disable` revoke sessions because an access token already issued
carries the old role until it expires. Revoking closes that window instead of
leaving it open for up to fifteen minutes.

### Delivering the code

`PORTVISION_OTP_TRANSPORT` selects how the code reaches the operator:

| Value | Behaviour |
|---|---|
| `log` (default) | prints to the server log — **development and the test suite only** |
| `webhook` | POSTs `{mobile, code, text}` to `PORTVISION_OTP_WEBHOOK_URL`, optionally with `PORTVISION_OTP_WEBHOOK_AUTH` as the `Authorization` header |
| `none` | generates and stores the code but delivers nothing |

`none` exists so a misconfigured deployment fails visibly rather than appearing
to send messages that never arrive. Point `webhook` at whatever SMS gateway the
terminal already uses; that shim is the only integration work left.

The code is **never** in an HTTP response, under any transport. The API cannot
be used to obtain a code for a number you do not control.

---

## What the server enforces

| Endpoint | Who |
|---|---|
| `GET /api/health` | anyone — the app probes it to decide which mode it is in |
| `GET /api/auth/config` | anyone |
| `POST /api/auth/request-otp`, `verify-otp`, `refresh`, `logout` | anyone |
| `GET /api/vessels`, `GET /api/voyages` | any signed-in role |
| `POST`/`PUT /api/vessels`, `PUT /api/state` | **Vessel Planner or Admin** |

Managers are read-only. A Manager attempting to save a plan gets a 403 that
names the role they actually hold, rather than a silent failure.

### The details that matter

- **Codes** — 6 digits from a CSPRNG (`crypto.randomInt`, not `Math.random`),
  stored as a salted scrypt hash, valid 5 minutes, single-use, burned in the
  same statement that redeems them so two concurrent requests cannot both win.
- **Attempts** — 5 wrong tries kills the challenge. Without that, six digits is
  a million guesses and a short script.
- **Requests** — 5 per number per 15 minutes, which is both a denial-of-service
  and an SMS-bill control.
- **Enumeration** — `request-otp` answers identically whether or not the number
  has an account. A helpful "no such user" would let anyone test which of a
  terminal's staff numbers are registered.
- **Refresh tokens** — opaque, 48 random bytes, stored only as SHA-256, rotated
  on every use. Presenting a spent one fails, so a stolen copy stops working as
  soon as the real client refreshes.
- **Access tokens** — short-lived JWTs, never stored server-side. Tampered
  payloads, `alg:none` and tokens signed with another key are all rejected.

---

## What the client does

`api()` attaches the access token, and on a 401 refreshes **once** and retries.
A second failure ends the session and returns to the login screen with an
explanation, rather than silently dropping the operator's edits.

Signing out revokes the refresh token on the server, not just locally.

Tokens live in browser storage. A cross-site scripting flaw would therefore
expose them — which is why every value that came from a person is escaped on the
way into `innerHTML`. That mitigation is the reason this storage choice is
acceptable; it is not a reason to stop caring about it.

---

## Verifying it

`tests/test_auth.js` starts a real server against a real PostgreSQL and drives
it over HTTP, because what is being tested is exactly what a determined client
could do to the API — which cannot be checked by calling functions.

```bash
DATABASE_URL=postgres://… node tests/test_auth.js
```

46 checks covering: refusal to start without a secret; every endpoint rejecting
unauthenticated access; no user enumeration; codes absent from responses; wrong
codes, replay, brute-force lockout and request rate limiting; forged, `alg:none`
and wrong-key tokens; Manager read-only versus Planner/Admin write; refresh
rotation and reuse detection; sign-out; disable and role change taking effect on
live sessions; hashes at rest; and the browser actually signing in and showing
the **server-assigned** role.

CI runs it against a `postgres:16` service container as a release gate.

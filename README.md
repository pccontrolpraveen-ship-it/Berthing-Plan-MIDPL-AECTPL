# PORTVISION 3D

**Smart Vessel Berthing Planning & Port Operations Management System**
MIDPL Kattupalli + AECTPL Ennore (Adani Ports & SEZ) · Version 2.3

PORTVISION 3D digitises the entire vessel berthing workflow of a container terminal — from tentative ETA to sail-out — and shows the result as a live 3D digital twin of the port. It replaces manually maintained berthing plans circulated by email and spreadsheet with a single validated system of record.

> **Status:** working prototype (v2.2). The application in this repository runs entirely in the browser with no server, no build step and no installation. Production multi-user architecture is specified in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and planned in [`docs/ROADMAP.md`](docs/ROADMAP.md).

---

## Quick start

```bash
git clone https://github.com/<your-username>/portvision-3d.git
cd portvision-3d
```

Then open `www/index.html` in **Google Chrome** or **Microsoft Edge**.

Login (demo mode):

| Field | Value |
|---|---|
| Role | Vessel Planner · Manager · Admin |
| Mobile | any 10-digit number |
| OTP | `123456` |

Nothing else is required, and no internet connection is needed — Three.js is vendored in `www/vendor/` (see `www/vendor/README.md`). If WebGL itself is unavailable, the application falls back to a built-in 2D top view.

### Install it as an app (optional)

Served over HTTPS — or from `http://localhost` — PORTVISION is an installable
progressive web app. Chrome and Edge on Windows, macOS and Android offer
**Install** in the address bar; on iOS use Safari's **Share → Add to Home
Screen**. Installed, it opens in its own window with no browser chrome, and
**launches with no network connection** — the whole application, Three.js
included, is precached by `www/sw.js`.

Opening `www/index.html` directly from disk still works, but `file://` has no
service worker, so there is nothing to install and nothing precached.

Offline never changes what the app claims about storage: the persistence API is
deliberately never cached, so with no server reachable the badge reads
**💾 Standalone** and says so honestly rather than reporting a database save
that did not happen.

### Optional — PostgreSQL persistence (recommended)

Without a server the app runs in **Standalone** mode (data saved in that browser only — the top-bar badge says so). For real database storage shared across users and restarts:

```bash
cd server
npm install
export DATABASE_URL=postgres://user:pass@localhost:5432/portvision
npm run init-db      # creates tables + reference data
npm start            # http://localhost:4000
```

Reopen `www/index.html` — the badge switches to **🗄 PostgreSQL** and every vessel/voyage save goes through a validated database transaction.

---

## Repository contents

| Path | What it is |
|---|---|
| `www/` | The application — everything a browser loads, and the folder packaged for mobile/desktop |
| `www/index.html` | Page structure — splash, login/OTP, application shell |
| `www/styles.css` | All styling (sidebar, dashboard, timeline, bollard chips, charts, modals) |
| `www/app.js` | Complete application logic — planning workflow, rules engine, reports, 3D digital twin |
| `www/vendor/` | Vendored third-party libraries (Three.js r128) — checked in so the app loads offline |
| `www/manifest.webmanifest`, `www/sw.js`, `www/pwa.js`, `www/icons/` | Progressive web app — installable, launches with no network |
| `tools/make-icons.js` | Regenerates the app icons from a single vector definition |
| `tests/test_app.js` | Playwright end-to-end regression suite (34 blocks incl. Ennore + persistence) |
| `tests/test_pwa.js` | Manifest, service worker and offline-launch checks |
| `tests/test_responsive.js` | Phone, tablet and desktop layout plus touch-target checks |
| `tests/test_mobile.js` | Capacitor native-web-view behaviour checks |
| `android/`, `ios/` | Capacitor native projects — see [`docs/MOBILE.md`](docs/MOBILE.md) |
| `capacitor.config.json` | Mobile build configuration |
| `assets/` | Icon and splash sources for the native builds |
| `tests/test_desktop.js` | Electron desktop build checks, in development and packaged |
| `desktop/` | Windows/macOS/Linux build — Electron wrapper around the same `www/` ([`desktop/README.md`](desktop/README.md)) |
| `server/` | Persistence API — Express + PostgreSQL (`schema.sql`, `server.js`) |
| `docs/PRD.md` | Product Requirements Document v2.2 |
| `docs/BUSINESS_RULES.md` | Authoritative berthing, bollard, crane and productivity rules |
| `docs/SRS.md` | Numbered, testable software requirements |
| `docs/ARCHITECTURE.md` | Current prototype architecture + target production architecture |
| `docs/USER_GUIDE.md` | How planners and managers use each screen |
| `docs/ROADMAP.md` | Path from prototype to production web application |
| `docs/TESTING.md` | How to run and extend the regression suite |
| `docs/GITHUB_UPLOAD_GUIDE.md` | Step-by-step upload and free hosting instructions |
| `CHANGELOG.md` | Version history v1.0 → v2.2 |

---

## Features

**Multi-port (v2.3)**

- Global Port/Site selector: **Kattupalli** (CB1/CB2/B3, QC01–08, bollards 22.5 m) and **Ennore** (B1 400 m, QC-01…04, 27 bollards @ 15 m, yard 100 m behind the cranes)
- Complete data isolation — dashboards, timelines, reports, analytics, notifications, audit and the 3D twin show one port at a time, never mixed
- Each port has its own 3D digital twin scene; voyages store their port, so a vessel can call at both sites

**Vessel planning**

- Vessel master with type-ahead search; vessel types Container, Liquid, Bulk, Break-Bulk
- Voyage (VIA) creation, tentative ETA, first-ETA / latest-ETA history
- Berth eligibility by vessel type — Container → CB1, CB2 · Liquid → CB2, B3 · Bulk & Break-Bulk → all
- Full-month scrollable berth timeline: drag to prepone/postpone, double-click for details, `＋` to add future dates
- Milestone chain ETA→ATA, ETB→ATB, ETO→ATO, ETC→ATC, ETD→ATD, each unlocking on the previous actual
- Cargo capture: container moves (discharge, loading, reefer, ODC, one-door-open, hazardous) and Liquid/Bulk/Break-Bulk cargo lines in MT with Import/Export direction
- Crane selection for Container and Break-Bulk vessels, with a "Port Crane not required" waiver
- Save / Cancel guard on unsaved plans; abort plan; sail-out release of berth and cranes

**Mooring & berthing rules**

- Port Side / Starboard Side to berth — rotates the vessel in the 3D twin
- Bow and Stern bollard selection with automatic contiguous intermediate allocation
- CB1: independent bollard pool 1–17, maximum 2 simultaneous vessels, two-vessel combined LOA ≤ 290 m, conflict and 22.5 m spacing validation
- CB2 + B3: one shared pool 1–34 — the operator's manual bollard selection is accepted as final, with no restriction
- Tentative berth selection permitted on an occupied berth; hard gate at ATB until the occupant records ATD

**3D digital twin**

- AKPPL L-shaped 3-berth layout, navigation channel, anchorage, buoys, pilot boarding ground, yard with RTGs
- Adani-branded QC cranes in true physical order (CB1: QC01, QC02, QC04, QC03 · CB2: QC08, QC05, QC06, QC07)
- Type-specific vessel models, tug escorts on berthing and departure, cinematic guided tour
- Numbered bollards with live states — available, bow, stern, auto-allocated
- Dynamic mooring ropes computed every frame from vessel position, rotation and the selected bollards; every rope endpoint terminates on a physical bollard
- Day/night mode with vessel, buoy, crane and yard lighting; desktop/mobile quality switch
- Double-click any vessel for the full VESSEL INFORMATION panel

**Dashboard, analytics and reports**

- KPI tiles: vessels handled, berths available, operational berths, berthing time, berth and crane utilization, container moves, Liquid/Bulk/Break-Bulk tonnage, average BMPH
- Berth occupancy board — green free / red occupied or planned today, click through to the 3D twin
- Vessel Berth Plan timeline on the dashboard with a Big Screen view for managers
- Vessel-wise GCR chart with a threshold of 30 — red below 30, green at 30 and above
- Vessel-wise BMPH chart (Total Moves ÷ Port Stay ATB→ATD), no colour condition
- Reports: Monthly Vessels + GCR, Vessel Report, Liquid Report, Bulk & Break-Bulk Report, Crane Detailed Report, Vessel History, Berth Utilization, Cargo Summary — with CSV and PDF export
- Notifications and a full audit trail of every planning action

---

## Screenshots

| Dashboard | Berth plan (Big Screen) | Bollard selection |
|---|---|---|
| ![Dashboard](docs/screenshots/dashboard-overview.png) | ![Berth plan](docs/screenshots/dashboard-berth-plan.png) | ![Bollards](docs/screenshots/planning-bollards.png) |

---

## Testing

```bash
npm install -D playwright
npx playwright install chromium
node tests/test_app.js
```

Expected final line: `ERRORS: none`. See [`docs/TESTING.md`](docs/TESTING.md).

---

## Technology

Prototype: HTML5, CSS3, vanilla JavaScript (ES2020), Three.js r128.
Target production stack: Next.js + React + TypeScript + Tailwind (frontend), NestJS + PostgreSQL + Prisma (backend), Socket.IO (realtime). See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## Ownership and licence

Internal operational software developed for MIDPL Kattupalli / Adani Ports & SEZ. Not open source — see [`LICENSE`](LICENSE) before sharing, forking or publishing this repository. Keep the repository **private** unless clearance is obtained.

**Product owner:** Tushar — GM & Terminal Head, MIDPL Kattupalli

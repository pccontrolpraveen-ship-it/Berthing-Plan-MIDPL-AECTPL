# Changelog

All notable changes to PORTVISION 3D. Format loosely follows [Keep a Changelog](https://keepachangelog.com/); versions are product milestones, not semantic library versions.

---

## [2.6] — 2026-08-24

### Added — installable progressive web app (phase 1)
- **Web app manifest** (`www/manifest.webmanifest`): PORTVISION is now installable from Chrome/Edge on Windows, macOS and Android, and from Safari on iOS via *Add to Home Screen*. It opens in its own window with no browser chrome. `start_url` and `scope` are relative, so it installs correctly under the GitHub Pages project sub-path as well as from a wrapper's root.
- **Service worker** (`www/sw.js`): precaches the whole shell — `index.html`, `styles.css`, `app.js`, the vendored Three.js and every icon — so the application **launches with no network at all**. This is what phase 0's vendoring was for; a planner on the quay with no signal gets the full app, 3D twin included.
- **The persistence API is never intercepted.** Cross-origin requests and any `/api/` path bypass the worker entirely. The app decides between 🗄 PostgreSQL and 💾 Standalone from a live `/api/health` probe, so a cached or synthesised response would make the top-bar badge claim a database save that never happened — the precise dishonesty the persistence layer exists to prevent. Both the bypass and the honest offline failure are tested, not assumed.
- **Update handling that cannot lose work.** A new version installs in the background and takes over on the next launch; the worker never calls `skipWaiting()` on its own and never force-reloads, because the planning screen holds unsaved work behind a dirty-state guard. `www/pwa.js` raises a dismissible prompt instead, and the planner reloads when ready.
- **App icons** (`www/icons/`, 192/512/maskable/apple-touch) generated from one vector definition by `tools/make-icons.js`. The anchor is drawn as SVG paths rather than an emoji, so output does not depend on the fonts installed on the machine rendering it.
- Registration lives in `www/pwa.js` rather than an inline `<script>`, because the Capacitor and Electron packaging ahead runs under a CSP that blocks inline script. It disables itself silently on `file://` and on browsers without service worker support.

### Tests
- New suite `tests/test_pwa.js` (19 checks): serves `www/` over a local origin, installs the worker, then **takes the network away** and proves the shell is served, Three.js r128 loads from cache, a planner can log in and reach the Dashboard, the storage badge stays honest, and `/api/health` genuinely fails rather than being faked. Offline evidence in `shots/pwa_offline.png`. Wired into CI as a second release gate. ERRORS: none.

---

## [2.5] — 2026-08-24

### Changed — packaging groundwork (phase 0)
- **Three.js vendored locally.** `www/vendor/three.min.js` (r128, npm `three@0.128.0`, MIT) replaces the `cdnjs.cloudflare.com` `<script src>`. The application now loads with **no network access at all** — required for terminal machines without internet, and mandatory for the Capacitor/Electron packaging in `docs/ROADMAP.md`, whose default Content-Security-Policy blocks remote scripts outright. Provenance and the upgrade procedure are recorded in `www/vendor/README.md`.
- **Repository restructured** to the layout the documentation already described: `www/` (everything the browser loads, and the folder a mobile/desktop wrapper will package), `server/`, `tests/`, `docs/`, `docs/screenshots/`. Nothing moved inside `app.js`.
- **CI workflows now actually run.** `test.yml` and `deploy-pages.yml` were sitting in the repository root instead of `.github/workflows/`, so neither had ever executed; they also referenced paths (`tests/test_app.js`, `docs/screenshots`) that did not exist in the flat layout. Both are now correctly placed and pointed at the real files.
- `.gitignore` restored — the file had been committed under the name `download`.

### Fixed
- **Kattupalli 3D twin crashed on load.** `initTwin` iterated *every* crane in the master, including Ennore's QC-01…04, and looked each up in a Kattupalli-only `QC_ORDER` table — `QC_ORDER['EB1']` is `undefined`, so `.indexOf` threw and the scene was abandoned half-built (`TypeError: Cannot read properties of undefined (reading 'indexOf')`). Introduced with the Ennore cranes in 2.3 and invisible until now: the regression suite has no internet, so Three.js never loaded and the twin silently took the 2D fallback path on every CI run. The loop is now scoped to the port being drawn, matching `initTwinENN` and the 2D fallback.

### Tests
- The suite exercises the **real WebGL scene** for the first time — headless Chromium software-rasterises it, and `shots/v3_twin.png` is now the actual 3D twin rather than the 2D fallback. A crash in the 3D path fails the release gate from here on. Suite total: 34 blocks, ERRORS: none.

---

## [2.4] — 2026-08-14

### Added — persistence, validation and the GPS-accurate Ennore twin
- **Persistence layer.** New vessels and all voyage data are saved through Frontend → API → server-side validation → **PostgreSQL transaction** → confirmed response → UI, using the bundled server (`server/`: Express + pg, `schema.sql` with **separated Vessel Master and Voyage tables**, reference `ports`/`berths` tables). The vessel master seeds the database on first run; a saved vessel is immediately available in vessel selection and survives refresh, logout, browser and server restarts.
- **Honest standalone mode.** Without the server, the app stores state in the browser (survives refresh/restart on that machine), labels the mode in the top bar (💾 Standalone vs 🗄 PostgreSQL), and words every save message accordingly. **No fake success:** the vessel modal awaits the save before updating the UI, database failures show an error and the data is not pretended saved.
- **Vessel Master fields & validation.** Beam and Draft added; LOA/Beam/Draft must be positive, Name and a valid Vessel Type are required, duplicates rejected — enforced client-side *and* server-side (plus: port must be valid, berth must belong to the port, bollards must be within the berth's pool, milestone timestamps must be valid).
- **Ennore twin re-plotted from the uploaded Google-Maps GPS reference** (~13.272°N 80.339°E): the B1 quay now runs **north–south with the harbour water to the east**, container yard **west** of the quay with N–S container rows, QC cranes booming east over the water, coast/shoreline behind, and **breakwater arms sheltering the basin with the entrance to the south-east**. The 100 m crane-to-yard gap remains at true scene scale. All geometry stays configurable in `ENN_CFG`; breakwater/shoreline shapes are marked REFERENCE/APPROXIMATE, engineering dimensions are authoritative.

### Tests
- T34: negative-LOA rejection, honest save toast, beam/draft/type stored, full page reload → vessel and all voyages still present and selectable. Suite total: 34 blocks, ERRORS: none.

---

## [2.3] — 2026-08-14

### Added — Ennore (AECTPL) as a second operational site
- **Ports master** (`PORTS`: Kattupalli KTP · Ennore ENN) with a global Port/Site selector in the top bar, in Vessel Planning step 1 and in Reports. The selection persists across every screen and is stored on each voyage (`voyage.port`) — the same vessel can call at both ports on different voyages.
- **Complete data isolation.** Dashboard KPIs, berth occupancy, crane board, current/upcoming operations, berth-plan timeline, analytics (GCR/BMPH), all eight reports (titled "… — ENNORE" / "… — KATTUPALLI"), vessel history, GCR pending list, notifications, audit log, ETA-clash checking and the 3D twin all filter by the selected port. Kattupalli and Ennore figures are never mixed or added together.
- **Ennore configuration** (in `ENN_CFG` + masters, not hard-coded in the UI): one berth **Ennore B1, 400 m**, all four vessel types permitted; **27 bollards at 15 m spacing** (independent pool); **4 QC cranes QC-01…QC-04**, separate from Kattupalli's QC01–QC08.
- **Ennore mooring rules**: same Port/Starboard side selection (vessel rotates, berth never moves), Bow/Stern selection with automatic intermediate allocation, and — because Ennore B1 is a single berth — **bollard overlap between simultaneous vessels is strictly enforced** in `applyBollards` and at the ATB gate (rules-engine level, not UI-only). The Kattupalli CB1 290 m rule is NOT applied to Ennore; berth rules are independently configurable.
- **Ennore 3D digital twin**: separate scene loaded when the selected port is Ennore — sea, 400 m berth, 27 numbered live-state bollards, 4 QC cranes, navigation channel with buoys, anchorage, pilot boarding point, and the container yard set back **100 m behind the crane apron at true scene scale**. Dynamic vessel→bollard mooring ropes, night mode, camera presets, double-click VESSEL INFORMATION panel (now including **Port**), and the 2D fallback all work per port. The Kattupalli twin is untouched.

### Unchanged (explicitly verified)
- All Kattupalli functionality: CB1/CB2/B3, the CB1 290 m rule, CB2/B3 free bollard selection, crane rules, timeline, reports, GCR/BMPH, digital twin — regression suite T1–T32 still green.

### Tests
- T33 acceptance block automates the Ennore requirements: dashboard isolation both ways, EB1-only berth list with 400 m, 27 bollard chips, QC-01…04, starboard side, bow 3 / stern 12 → 8 intermediates at 15 m spacing (quay 30–165 m), overlap 8–14 rejected with "⚠️ Bollard Conflict", clear 15–24 accepted, port-titled reports, info panel Port = Ennore, and clean switch-back to Kattupalli.

---

## [2.2] — 2026-08-12

### Added
- **Dynamic mooring ropes.** Rope geometry is recomputed every frame from vessel position, vessel rotation, berthing side and the world position of the selected Bow and Stern bollards. Bow line to bow bollard, stern line to stern bollard, two spring lines one bollard inward from each end; fairleads always chosen on the quay-facing side. No rope endpoint can terminate in the water. Without bollards, ropes project onto the nearest quay-edge points.
- **VESSEL INFORMATION panel** on double-click of any vessel in the 3D twin (and in the 2D fallback): Vessel Name, VIA, Service, LOA, Status, Berth, Bollard No, Crane, ETA, ATA, ATB, ATO, ATC, ATD, Port Stay in hours. Planners and Admins also get an "Update Milestones" action.
- **Vessel Berth Plan timeline on the Dashboard** — the same month timeline in read-only mode, auto-scrolled to today, with a plan table (vessel, berth, ETA, ATB, ATO, ATC, ATD, berth occupancy hours, status) and a **⛶ Big Screen** expansion for managers.
- **Vessel-wise GCR chart** — X–Y column chart with a dashed threshold at 30; GCR below 30 red, 30 and above green. All vessels with a GCR now appear, not only under-performers.
- **Vessel-wise BMPH chart** — column chart with no colour condition, average in the heading.
- Split distribution as three classic web files (`index.html`, `styles.css`, `app.js`) alongside the single-file build.

### Changed
- **CB2 and B3 bollard selection is now unrestricted** (BR-17). No conflict check, no span-vs-LOA check, no boundary or ownership rule — the operator's Bow/Stern choice is accepted as final and displayed as the occupied range. Occupied bollards remain visible as information and stay selectable. The ATB gate no longer checks bollards on CB2/B3.
- Timeline builder extracted to a shared function so Planning and Dashboard render the identical component.

### Unchanged (explicitly verified)
- CB1 rules: bollards 1–17, maximum 2 simultaneous vessels, combined LOA ≤ 290 m, bollard-conflict and 22.5 m span validation.

### Tests
- Suite extended to 32 checks: CB2 overlap and tiny span accepted, bow 5 / stern 25 accepted, CB1 conflict and span refusals still firing, dashboard timeline and Big Screen, vessel information panel fields, GCR colouring.

---

## [2.1] — 2026-08-11

### Added
- **Bollard system.** CB1 independent pool 1–17; CB2 + B3 one shared physical pool 1–34 (1–17 on the CB2 quay, 18–34 on the B3 quay), either berth able to use any bollard. Bollard spacing 22.5 m.
- **Berthing side** — Port Side to Berth / Starboard Side to Berth, rotating the vessel in the 3D twin from the berth's true heading rather than screen orientation.
- **Bow and Stern selection** with automatic contiguous allocation of all intermediate bollards, by dropdown or by clicking numbered chips.
- Bollard validation: range conflict against time-overlapping vessels, and span versus LOA.
- Numbered 3D bollards on every quay with live state colouring (available, bow, stern, auto-allocated).
- Planning summary chips (vessel, berth, LOA, ETA, side, bow, stern, total bollards, status) and bollard range in the vessel info modal.
- ATB gate extended to re-check pool-wide bollard conflicts and the CB1 combined-LOA rule against vessels actually alongside.

### Changed
- **CB1 two-vessel rule is now a combined-LOA limit of 290 m**, superseding the per-vessel double-banking caps (CB1 < 145 m, CB2 < 148 m, B3 < 183.25 m), which are withdrawn. A single vessel may be any LOA.

---

## [2.0] — 2026-08-10

### Added
- **Vessel types** Container, Liquid, Bulk, Break-Bulk with berth eligibility: Container → CB1, CB2 · Liquid → CB2, B3 · Bulk and Break-Bulk → all three.
- Type-specific cargo lines with volume in MT and Import/Export direction — Liquid (CBFS, CPO, Bitumen), Bulk (Soda Ash, Gypsum, Limestone, River Sand), Break-Bulk (Steel Coil, Plate, Rebar, Bags) — with ＋ Add Cargo.
- **Double banking** — maximum 2 vessels per berth, rendered as two thin stacked bars inside the same berth row, each independently interactive.
- Crane selection inside berth assignment for Container and Break-Bulk only, with a "Port Crane not required" waiver for Break-Bulk; no crane field for Liquid and Bulk.
- Type-specific 3D vessel models (tanker, bulker, container).
- Separated Liquid and Bulk & Break-Bulk reports; dashboard tonnage tiles per cargo type.
- Berth lengths recorded: CB1 350 m, CB2 357 m, B3 426 m.

---

## [1.8] — 2026-08-09

### Added
- Mandatory hatch-cover and bin-box capture the moment ETC becomes ATC, counted into total moves.
- **BMPH** = (Discharge + Loading + Hatch + Bin) ÷ Port Stay hours (ATB→ATD), per vessel and averaged.
- **GCR** entry with vessel-cycle completion, removing the vessel from the pending list.
- Performance Analytics with single or multi-month filtering.
- ETD milestone and port-stay calculation; next vessel plannable after ETD.

---

## [1.7] — 2026-08-08

### Added
- Night mode lighting: vessel yellow deck lights, green buoys, crane white floods with red blinking beacons, yard masts and RTG lights.
- "Vessel Selected" confirmation gate — draft plans invisible to dashboard, reports and 3D twin until confirmed.
- ＋ Add Dates on the timeline for planning beyond the current month.
- Tentative berth selection on an occupied berth with a hard gate at ATB, quoting the occupant's ETD.

---

## [1.5] — 2026-08-07

### Added
- Vessel master imported from the MIDPL vessel details workbook, with type-ahead search.
- ETA clash detection (Condition 1) and berth overlap detection (Condition 2) with explanatory popups.
- Full-month scrollable berth timeline with drag to prepone/postpone and double-click for details.
- Save / Cancel guard for unsaved plans; abort plan.
- QC crane labels corrected to true physical order (CB1: QC01, QC02, QC04, QC03 · CB2: QC08, QC05, QC06, QC07); Adani branding on cranes.
- ODC and One Door Open captured as separate cargo categories.

---

## [1.2] — 2026-08-06

### Added
- Zero-data start — no demo vessels; every figure begins at zero.
- Berth occupancy board, green when free or unplanned and red when occupied or planned today, click-through to the 3D twin.
- Milestone unlock chain ETA→ATA→ATB→ATO→ATC with sliders.
- 3D digital twin rebuilt to the AKPPL satellite layout: navigation channel, anchorage, pilot boarding ground, buoys, tug escorts, yard.
- Reports with monthly, crane and GCR views plus CSV and PDF export.
- In-app modals replacing browser prompts (which are blocked in embedded previews).

---

## [1.0] — 2026-08-06

### Added
- Enterprise blueprint pack: PRD, SRS, Database Design with a 17-model Prisma schema, API Specification, UI/UX Specification, 70-task Development Roadmap, Claude Prompt Library.
- First working prototype: role selection (Vessel Planner / Manager / Admin), mobile number with demo OTP `123456`, role dashboards, planning screen and initial 3D scene.

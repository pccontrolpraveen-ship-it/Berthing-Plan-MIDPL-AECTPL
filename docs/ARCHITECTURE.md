# PORTVISION 3D — Architecture

Version 2.2 · 12 August 2026

---

## 1. Current architecture (prototype v2.2)

A zero-dependency browser application. No server, no build step, no installation.

```
┌───────────────────────── Browser (Chrome / Edge) ─────────────────────────┐
│                                                                           │
│  www/index.html  structure: splash · login · OTP · app shell              │
│  www/styles.css  all presentation (sidebar, tiles, timeline, chips…)      │
│                  responsive: ≤1024 tablet · ≤640 phone drawer · coarse    │
│                  pointer gets 44px targets regardless of width            │
│  app.js          ┌──────────────────────────────────────────────────┐     │
│                  │ reference data   berths · cranes · bollard pools │     │
│                  │ state            vessels[] · voyages[] · audit[] │     │
│                  │ rules engine     berth · bollard · crane · time  │     │
│                  │ render layer     rDashboard/rPlanning/rReports…  │     │
│                  │ 3D twin (Three.js) scene · ships · ropes · tour  │     │
│                  │ 2D fallback      canvas top view                 │     │
│                  └──────────────────────────────────────────────────┘     │
│                                                                           │
│  Three.js r128 ← www/vendor/ (vendored; no network — 2D fallback if no GL) │
│  sw.js           precaches the shell; /api/ deliberately never intercepted │
│  manifest + icons installable on Android, Windows, macOS; iOS via Safari   │
└───────────────────────────────────────────────────────────────────────────┘

The same www/ folder is also the payload of the desktop build:

┌───────────────── Electron (Windows / macOS / Linux) ──────────────────────┐
│  desktop/main.js   serves www/ over 127.0.0.1 — a real origin, so the      │
│                    desktop build behaves exactly like the web and PWA      │
│                    builds instead of being a fourth environment            │
│  desktop/preload.js  points the app at the bundled API; exposes nothing    │
│  server/server.js  forked as a child ONLY when a database is configured,   │
│                    bound to loopback on an OS-assigned port                │
│  renderer          contextIsolation, sandbox, no Node — as privileged as   │
│                    a browser tab and no more                               │
└───────────────────────────────────────────────────────────────────────────┘
```

**Design characteristics**

- *Single source of truth in memory.* `voyages[]` holds the whole plan; every screen is a pure function of that array plus the current view. `render()` re-renders the active screen; `twinDirty` flags the 3D scene for re-sync.
- *Rules are functions, not UI code.* `berthAllowed`, `dualCheck`, `applyBollards`, `occupiedBollardMap`, `plannedWindow`, `estHours`, `bmph`, `portStayH`, `recordActual` are pure or near-pure and are the parts that migrate to the backend unchanged.
- *Geometry is derived, never stored.* Berth frames (`TW.b3d`) define start point, end point, mid point, direction and perpendicular per berth; `bollardWorld(pool, n)` maps a bollard number to a world position; ship position and rope endpoints are computed from those. Nothing about the 3D layout is hard-coded per vessel.
- *Guarded editing.* `planSnap` captures a snapshot on plan entry; `markPlanDirty` flags changes; `guardPlan` intercepts navigation; `revertPlan` restores estimates but never actuals.
- *No browser storage.* State lives only for the session — deliberate for the prototype, resolved by the production database.

**Key state shape**

```js
voyage = {
  id, vesselId, via, status,          // lifecycle: Incoming → … → Sailed Out
  confirmed,                           // false = draft (Vessel Selected gate)
  eta, firstEta, ata, etb, atb, eto, ato, etc, atc, etd, atd,
  berth,                               // 'CB1' | 'CB2' | 'B3' | null
  side,                                // 'PORT' | 'STARBOARD'
  bowB, sternB, qFrom, qTo,            // mooring: bollards + derived quay metres
  cranes: [], craneWaived,
  cargo: { dis, lod, rfr, odc, odo, haz },
  cargoLines: [{ name, vol, dir }],    // Liquid / Bulk / Break-Bulk, MT
  hatch, binbox, gcr, cycleDone
}
```

---

## 2. Target architecture (production)

```
   Browser / tablet                 API service                    Data
┌────────────────────┐        ┌──────────────────────┐      ┌──────────────┐
│ Next.js + React    │  REST  │ NestJS (TypeScript)  │      │ PostgreSQL   │
│ TypeScript         │◄──────►│  auth   · vessels    │◄────►│ via Prisma   │
│ Tailwind CSS       │        │  voyages· berthing   │      │ (17 models)  │
│ Three.js twin      │◄──────►│  bollards·cranes     │      └──────────────┘
│ Zustand store      │ Socket │  cargo  · milestones │
└────────────────────┘  .IO   │  reports· notify     │      ┌──────────────┐
                              │  gateway (events)    │─────►│ Audit log    │
                              └──────────────────────┘      └──────────────┘
```

**Module map (backend)**

| Module | Responsibility | Ported from |
|---|---|---|
| `auth` | OTP request/verify, JWT issue/refresh, role guards | login flow in `app.js` |
| `vessels` | vessel master CRUD, type, LOA, service | `vessels[]` |
| `voyages` | voyage creation, ETA history, status lifecycle | `voyages[]`, `setEtaChecked`, `shiftVoy` |
| `berthing` | eligibility, overlap, max-2, CB1 290 m, tentative + ATB gate | `berthAllowed`, `overlapCo`, `dualCheck`, `recordActual` |
| `bollards` | pools, bow/stern allocation, CB1 validation, CB2/B3 free choice | `poolOf`, `applyBollards`, `occupiedBollardMap` |
| `cranes` | assignment, exclusivity, status, waiver | `craneBusy`, crane wiring |
| `cargo` | container counts, cargo lines in MT, hatch/bin capture | `cargo`, `cargoLines`, `hatchBinModal` |
| `milestones` | actual recording, unlock chain, delay, sail-out | `recordActual`, `sailOut` |
| `reports` | report queries, CSV export, BMPH/GCR aggregates | `rReports`, `bmph`, `portStayH` |
| `notifications` | events, unread state, audit trail | `notify`, `logAudit` |
| `gateway` | Socket.IO broadcast of plan changes | replaces `render()`-only refresh |

**Frontend component map**

| Component | Replaces |
|---|---|
| `BerthTimeline` | `berthTLHtml` + drag/dblclick wiring |
| `BollardSelector` | side buttons, bow/stern selects, chips, legend |
| `MilestoneRow` | milestone sliders and actual editors |
| `CargoLines` / `CraneSelector` | cargo and crane sections of the planning card |
| `GcrBmphCharts` | `.colChart` analytics blocks |
| `VesselInfoModal` | `vesselInfo3D`, `vesselInfoModal` |
| `Twin3D/*` | Three.js scene, ships, ropes, bollards, cranes, tour |
| `lib/rules.ts` | client-side copies of `plannedWindow`, `bolRange`, `bmph` for instant feedback |

**Migration principle.** The rules engine is authoritative on the server; the client keeps a thin copy only for immediate visual feedback. Server messages remain the exact strings in `BUSINESS_RULES.md` so the automated checks continue to apply.

---

## 3. Data model summary

Seventeen tables, defined in the project's `schema.prisma`: `Terminal`, `Berth`, `Bollard`, `Crane`, `Vessel`, `Voyage`, `BerthAssignment`, `MooringPlan`, `CraneAssignment`, `CargoLine`, `Milestone`, `Performance`, `User`, `Role`, `Notification`, `AuditLog`, `Setting`.

Notes carried from the prototype:

- `Bollard` rows carry `pool` (`CB1` | `CB2B3`) and `number`; the shared CB2/B3 pool is one set of 34 rows, quay membership derived from the number (≤ 17 → CB2 quay, ≥ 18 → B3 quay).
- `MooringPlan` stores `side`, `bowBollardId`, `sternBollardId`; the intermediate range is derived, not stored, so a single edit cannot leave an inconsistent set.
- `Milestone` stores estimate and actual as separate nullable columns per event, never overwriting (BR-05).
- `Performance` stores hatch covers, bin boxes, computed BMPH and entered GCR per voyage.
- All timestamps `timestamptz` in UTC; IST applied at presentation.

---

## 4. Deployment topology

| Environment | Frontend | API | Database |
|---|---|---|---|
| Local development | `next dev` | `nest start --watch` | Docker Postgres or Neon branch |
| Pilot (free tier) | Vercel | Render or Fly.io | Neon or Supabase |
| Production | Vercel or Azure Static Web Apps | Azure App Service / AWS ECS | Managed PostgreSQL with PITR |

The prototype itself can also be published as-is to **GitHub Pages** — three static files, no build. See [`GITHUB_UPLOAD_GUIDE.md`](GITHUB_UPLOAD_GUIDE.md).

---

## 5. Quality gates

1. `node --check app.js` — syntax.
2. `node tests/test_app.js` — 32-check Playwright regression suite, must end `ERRORS: none`.
3. Visual confirmation of the planning screen, dashboard and 3D twin after any layout change.
4. A rule change is complete only when `BUSINESS_RULES.md`, `app.js` and the test suite agree.

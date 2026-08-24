# PORTVISION 3D — Roadmap

Version 2.2 · 12 August 2026

---

## Where the product stands

| Phase | Status |
|---|---|
| Enterprise blueprint pack (PRD, SRS, DB design, API spec, UI/UX spec, roadmap, prompt library) | ✅ Complete |
| Working prototype v1 → v2.2 — full planning workflow, rules engine, 3D twin, reports | ✅ Complete, 32 automated checks passing |
| Production multi-user application | ⬜ Next |
| AECTPL Ennore as a second terminal | ⬜ Later |
| Native mobile app, PDF schedule import, TOS integration | ⬜ Deferred |

---

## Production build — twelve steps

Each step ends with something demonstrable. All tooling and hosting used here has a free tier sufficient for a pilot.

| Step | Work | Produces |
|---|---|---|
| **0** | Install VS Code, Node.js LTS, Git; create the GitHub repository; create a free PostgreSQL database (Neon or Supabase) | Working environment |
| **1** | Scaffold NestJS backend; add Prisma; apply the existing `schema.prisma`; run the first migration | 17 tables in a real database |
| **2** | Seed reference data — berths CB1 350 m / CB2 357 m / B3 426 m, cranes QC01–QC08 in physical order, bollard pools (CB1 1–17, shared 1–34), vessel types, berth eligibility, cargo option lists | The terminal exists in data |
| **3** | Auth module — OTP request/verify, JWT access and refresh, role guards for Planner / Manager / Admin | Login works from an API client |
| **4** | Vessels and voyages modules; one-time import of the vessel master from Excel; ETA capture with the Condition-1 clash check | Vessel calls created over the API |
| **5** | **Berthing rules engine** — port `berthAllowed`, `dualCheck`, CB1 290 m rule, tentative berthing, ATB gate, bollard pools with CB1 validation and CB2/B3 free choice, berthing side | The rules that matter, server-side |
| **6** | Milestones, cargo and cranes — unlock chain, hatch/bin capture at ATC, BMPH and GCR, crane exclusivity and the Break-Bulk waiver, cargo lines in MT | Complete vessel lifecycle |
| **7** | Reports and notifications — all eight report queries with CSV export; notification and audit writes on every action | Management reporting from data |
| **8** | Realtime gateway — Socket.IO broadcast of voyage, berth and crane changes | Two screens stay in step |
| **9** | Scaffold Next.js frontend with Tailwind; rebuild shell, login and OTP using the existing palette | Login to an empty dashboard |
| **10** | Port the screens — Dashboard, then Planning (timeline, bollard selector, milestones, cargo, cranes), then Reports and Administration | Two users planning simultaneously |
| **11** | Port the 3D twin into `Twin3D/` components — scene, ships, ropes, bollards, cranes, tour | Live digital twin on real data |
| **12** | Adapt the regression suite to the deployed app; deploy frontend to Vercel, API to Render, database on Neon | A URL the team can open |

Indicative effort for one person working evenings with AI assistance: steps 0–3 about a week, 4–6 two to three weeks, 7–8 a week, 9–10 two to three weeks, 11–12 a week. Roughly two months to a usable pilot.

**Migration principle.** Every rule already exists as tested JavaScript in `app.js`. The production build is a reorganisation of proven logic into modules — not a re-invention. Keep the user-facing messages identical so the automated checks and the operators' familiarity both carry over.

---

## Functional backlog (after the pilot)

**High value, low effort**

- Persist plans (the prototype's single real limitation) — delivered by steps 1–6
- Configurable productivity norm and ETB offset in the Administration screen (FR-1007)
- Daily report email to Managers (FR-1008)
- Berth utilization by month with target comparison

**Medium**

- Marine and Operations roles activated, so actuals are recorded by the team that owns them
- PDF and Excel schedule import with a preview-and-correct screen before commit
- Draft vs published plan versions with subscriber notification on publish
- Vessel-specific productivity overrides and crane-split capture per shift
- Tide and draft constraints on berthing windows

**Later**

- AECTPL Ennore — reference data plus its own 3D layout; the data model is already multi-terminal
- ~~Installable app for marine users on the quay~~ — delivered in 2.6 as a progressive web app: installable on Android, Windows and macOS, added to the Home Screen on iOS, and launching with no network. Native store builds (Capacitor for iOS/Android, Electron for Windows/macOS) remain ahead, gated on the responsive rework of the planning screens
- TOS / EDI integration (BAPLIE, COARRI) to remove manual cargo entry
- Weather feed on the dashboard
- Predictive ETA and berth suggestion from historical performance

---

## Decisions worth preserving

These were settled deliberately during v1 → v2.2 and should not be silently reversed:

1. **CB2/B3 bollard selection is unrestricted.** The operator's judgement is final on the multipurpose berths; the system informs but does not block. Only CB1 validates.
2. **CB1 uses a combined-LOA limit of 290 m for two vessels**, replacing per-vessel LOA caps.
3. **Estimates and actuals are never merged.** Delay analysis depends on keeping both.
4. **Draft plans are invisible** until "Vessel Selected" — the dashboard must never show speculative calls.
5. **Actuals are never reverted** by the Cancel guard.
6. **Mooring geometry is derived, never stored** — bollard numbers plus side are the input; positions and rope endpoints are computed.
7. **Blocking messages name the vessel and the time the constraint clears.** A refusal that does not tell the planner when they *can* berth is an incomplete refusal.

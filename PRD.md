# PORTVISION 3D — Product Requirements Document

| Item | Detail |
|---|---|
| Document | Product Requirements Document (PRD) |
| Version | **v2.2** — supersedes PRD v1.0 (06 Aug 2026) |
| Date | 12 August 2026 |
| Owner | Tushar — GM & Terminal Head, MIDPL Kattupalli |
| Scope | MIDPL Kattupalli first; multi-terminal-ready (AECTPL Ennore later) |
| Status | Implemented as working prototype v2.2 · baseline for production build |

---

## 1. Introduction

### 1.1 Purpose

This document defines **PORTVISION 3D — Smart Vessel Berthing Planning & Port Operations Management System**: what it must do, who uses it, and the operational rules it enforces. Version 2.2 reflects the product as actually built and validated in the working prototype, replacing the pre-build assumptions of v1.0.

Companion documents: [`BUSINESS_RULES.md`](BUSINESS_RULES.md) (authoritative rule definitions), [`SRS.md`](SRS.md) (numbered testable requirements), [`ARCHITECTURE.md`](ARCHITECTURE.md) (implementation design), [`USER_GUIDE.md`](USER_GUIDE.md) (operating instructions).

### 1.2 Background

MIDPL operates the container terminal at Kattupalli Port on India's east coast near Chennai, an APSEZ facility handling roughly 30 container vessels and about 70,000 TEU per month. The terminal has two container berths (CB1 350 m, CB2 357 m) served by eight ship-to-shore cranes (QC01–QC08), plus a multipurpose berth (B3 426 m) for liquid, bulk and break-bulk vessels.

Berthing plans were previously prepared manually from vessel schedules received as PDF and spreadsheet files and circulated by email and messaging. This produced re-keying effort, berth and bollard conflicts discovered only at execution, no management visibility, and no single system of record for the vessel lifecycle.

### 1.3 Product vision

One application in which planners build and maintain the berthing plan, marine and operations teams execute it, and management watches the terminal live — including an interactive 3D digital twin — with every change calculated, validated, audited and immediately visible.

### 1.4 Objectives

1. Make the berthing plan the digital system of record for every vessel call.
2. Enforce berth, bollard, LOA and crane rules **at planning time**, not at execution time.
3. Plan mooring physically — actual bollard numbers, berthing side, and the resulting vessel position.
4. Track the complete lifecycle ETA → ATA → ATB → ATO → ATC → ATD with estimates preserved alongside actuals.
5. Measure performance objectively per vessel: BMPH and GCR.
6. Give management a live dashboard, berth-plan timeline and analytics without asking anyone for a report.
7. Visualise the terminal as a live 3D digital twin that mirrors the plan exactly.

### 1.5 What changed since v1.0

| Area | v1.0 assumption | v2.2 actual |
|---|---|---|
| Login | Email + password | **Mobile number + OTP** (demo OTP `123456`; JWT in production) |
| Roles active | 5 (Planner, Marine, Operations, Manager, Admin) | **3 active** — Vessel Planner, Manager, Admin. Marine and Operations deferred; permission model unchanged |
| Milestones | ATA → ATB → ATC → ATD | **ATA → ATB → ATO → ATC → ATD** — operation start (ATO) added |
| Berth eligibility | CB1/CB2 container only; B3 liquid/bulk/break-bulk | **Container → CB1, CB2 · Liquid → CB2, B3 · Bulk & Break-Bulk → all three** |
| Double banking | Not specified | **Max 2 vessels per berth**; CB1 two-vessel combined LOA ≤ 290 m |
| Mooring | Berth-level only | **Bollard-level** — CB1 pool 1–17; CB2 + B3 shared pool 1–34; Port/Starboard side to berth |
| Productivity metric | Moves ÷ (cranes × norm) | Retained for estimates, plus **BMPH** and **GCR** as measured outcomes |
| PDF schedule import | Core v1 module | **Deferred** — vessel master imported from Excel; manual planning proved faster to validate |
| Prototype delivery | Not planned | **Delivered** — self-contained HTML/CSS/JS application, v1 → v2.2 |

---

## 2. Users and roles

| Role | Responsibility | Key permissions |
|---|---|---|
| **Vessel Planner** | Builds and maintains the berthing plan | Create/edit vessels, voyages, ETAs, berths, bollards, side, cranes, cargo; record all actuals; edit actuals until sail-out; enter GCR; abort plans |
| **Manager** | Oversight and performance | View dashboard, berth-plan timeline (incl. Big Screen), 3D twin, all reports and analytics; no edit rights |
| **Admin** | System administration and correction | Everything a Planner can do, plus edit any estimate or actual **before and after** sail-out, edit report data, manage crane status, view audit log |
| *Marine Team* | *Deferred* | *Would record arrival/mooring actuals* |
| *Operations Team* | *Deferred* | *Would record crane splits and cargo figures* |

Permissions are role-based and must be enforced server-side in production, not merely hidden in the UI.

---

## 3. Scope

### 3.1 In scope (v2.2)

- MIDPL Kattupalli fully configured: berths CB1 350 m, CB2 357 m, B3 426 m; cranes QC01–QC08 in true physical order; bollard pools; anchorage; navigation channel; pilot boarding ground.
- Modules 1–10 of Section 4.
- Browser application (desktop-first, responsive, mobile/desktop 3D quality switch).
- 3D digital twin of the AKPPL layout driven by the same live data as the 2D screens.
- Multi-terminal-ready data model — AECTPL activated later by adding reference data only.

### 3.2 Out of scope (v2.2)

- AECTPL screens, layout and 3D scene (design-ready, later phase).
- Native mobile app (the browser application is responsive; React Native optional later).
- PDF/EDI schedule import, TOS integration, billing/tariff, yard planning, gate operations.
- Real SMS OTP delivery (demo OTP in prototype; SMS or email OTP at production go-live).
- Weather feed (placeholder only).

---

## 4. Functional modules

### Module 1 — Authentication & access
Role selection (Vessel Planner / Manager / Admin) → 10-digit mobile number → 6-digit OTP. Session shows the signed-in role and mobile number; logout returns to role selection. Production: JWT access/refresh tokens, server-side role guards, OTP expiry and retry limits.

### Module 2 — Dashboard
KPI tiles (vessels handled, berths available, operational berths now, vessels operational today, berthed today, average berthing time, berth utilization today, crane utilization, container moves, Liquid/Bulk/Break-Bulk tonnage imported and exported, average BMPH); berth occupancy board coloured green when free/unplanned and red when occupied or planned today, each berth clicking through to the 3D twin; QC crane position board with click-to-cycle status; Current Operations and Upcoming Operations tables; **Vessel Berth Plan — Assign Berth Timeline** with a Big Screen view; Performance Analytics with a month filter.

### Module 3 — Vessel & voyage management
Vessel master (name, IMO, call sign, flag, LOA, service, operator, vessel type) with type-ahead search, add and edit. Voyage per call with VIA number, status lifecycle, first ETA and latest ETA, and full milestone set. "Vessel Selected" confirmation gate — a draft plan stays invisible to dashboard, reports and 3D twin until confirmed. Vessel history retained for every closed call.

### Module 4 — Berth planning (core)
Full-month scrollable timeline with one row per berth: vessel windows as bars, drag to prepone/postpone, double-click for details, `＋` to extend into future dates, today marker. Time-overlapping (double-banked) vessels render as two thin stacked bars **inside the same berth row**, each independently interactive. Berth cards show length, permitted vessel types, current occupancy and the ETD after which the berth frees. Tentative assignment to an occupied berth is permitted and clearly marked; ATB is hard-gated. Save/Cancel guard protects unsaved plans; plans can be aborted.

### Module 5 — Mooring & bollard planning
Berthing side selection (Port Side to Berth / Starboard Side to Berth) which physically rotates the vessel in the 3D twin. Bow and Stern bollard selection by dropdown or by clicking numbered bollard chips; all intermediate bollards are allocated automatically as a contiguous range. Live visual states — available, bow, stern, auto-allocated, occupied. Planning summary shows vessel, berth, LOA, ETA, side, bow, stern, total bollards and status. Bollards remain editable until sail-out. Rules per [`BUSINESS_RULES.md`](BUSINESS_RULES.md) BR-11 to BR-16.

### Module 6 — Crane planning
Crane selection inside berth assignment, shown only for Container and Break-Bulk vessels, restricted to the cranes physically serving the chosen berth in true order (CB1: QC01, QC02, QC04, QC03 · CB2: QC08, QC05, QC06, QC07). Break-Bulk may waive port cranes ("Port Crane not required" — vessel gear). B3 has no QC cranes. Crane status Available / Maintenance / Breakdown; a crane serves one vessel at a time. A crane (or an explicit waiver) is mandatory before ATB for Container and Break-Bulk vessels.

### Module 7 — Cargo capture
Container vessels: total discharge, total loading, reefer, ODC, one-door-open and hazardous containers. Liquid vessels: CBFS, CPO, Bitumen. Bulk: Soda Ash, Gypsum, Limestone, River Sand. Break-Bulk: Steel Coil, Steel Plate, Steel Rebar, Bags. Cargo lines support "＋ Add Cargo", volume in MT and Import/Export direction. At ATC a mandatory popup captures Total Hatch Covers and Total Bin Boxes, which are added to total moves.

### Module 8 — 3D digital twin
Static world: sea, anchorage ~4 km clear of the channel, navigation channel with buoys, pilot boarding ground, L-shaped quay with CB1/CB2/B3, yard with containers, RTGs and trailers, coastline. Dynamic objects driven by live plan data: vessels scaled to LOA with type-specific hulls, tug escorts on berthing and departure, QC cranes with boom and trolley motion when operating, numbered bollards with live states, dynamic mooring ropes that always terminate on the selected bollards. Interactions: orbit, zoom, camera presets per berth/anchorage/channel, day/night mode, mobile/desktop quality, guided cinematic tour, single click for a quick info card, double click for the full VESSEL INFORMATION panel. Automatic 2D top-view fallback when WebGL or the CDN is unavailable.

### Module 9 — Performance, reports and notifications
**BMPH** = (Discharge + Loading + Hatch Covers + Bin Boxes) ÷ Port Stay hours (ATB→ATD), per vessel and averaged. **GCR** entered per vessel in the Vessel History & GCR section; completing a vessel cycle removes it from the pending list. Analytics: vessel-wise GCR column chart with a threshold line at 30 (red below 30, green at 30 and above) and a vessel-wise BMPH chart with no colour condition, both filterable by one or many months. Reports: Monthly Vessels + GCR, Vessel Report (with cargo volume, BMPH and GCR), Liquid Report, Bulk & Break-Bulk Report, Crane Detailed Report, Vessel History, Berth Utilization, Cargo Summary — exportable to CSV and PDF; Admin can edit report data. Notifications with unread count for berth assignment, crane assignment, milestone events, plan abort and crane unavailability.

### Module 10 — Administration
Crane reference data and status; system settings (productivity norm default 30 moves/crane/hour, ETB offset default 60 minutes); audit log of every action with user, role, timestamp and description; Admin-only editing of estimates and actuals at any time, including after sail-out.

---

## 5. Business rules

The authoritative, testable definitions live in [`BUSINESS_RULES.md`](BUSINESS_RULES.md) (BR-01 to BR-24). Summary of the rules that most shape the product:

- **ETB** = ETA + 60 min (configurable). **Estimated duration** = moves ÷ (cranes × productivity). **Suggested ETC** = ETB + duration.
- **Actuals never overwrite estimates**; both are retained for delay analysis.
- **Berth eligibility by vessel type**: Container → CB1, CB2 · Liquid → CB2, B3 · Bulk & Break-Bulk → CB1, CB2, B3.
- **Maximum 2 simultaneous vessels per berth.**
- **CB1**: bollards 1–17; two simultaneous vessels require combined LOA ≤ 290 m; a single vessel may be any LOA; bollard conflict and 22.5 m spacing validation active.
- **CB2 + B3**: one shared bollard pool 1–34; the operator's Bow/Stern selection is final — no conflict, span, LOA or boundary restriction.
- **Tentative berthing** on an occupied berth is allowed up to ATA; **ATB is blocked** until the occupant records ATD.
- **Milestone chain**: each actual unlocks the next milestone; ATC triggers mandatory hatch-cover and bin-box capture; ATD requires ATC and executes sail-out.
- **Crane rule**: mandatory for Container and Break-Bulk before ATB unless explicitly waived (Break-Bulk only); one vessel per crane at a time.
- **Time zone**: IST display, UTC storage.

---

## 6. Technology

| Layer | Prototype v2.2 | Target production |
|---|---|---|
| Frontend | HTML5, CSS3, vanilla JavaScript (ES2020) | Next.js, React, TypeScript, Tailwind CSS |
| 3D | Three.js r128 (CDN) with 2D canvas fallback | Three.js via react-three-fiber |
| Backend | none — in-browser state | NestJS (TypeScript), REST + OpenAPI |
| Database | none — in-memory | PostgreSQL with Prisma ORM |
| Realtime | not applicable | Socket.IO |
| Auth | demo OTP `123456` | Mobile OTP + JWT access/refresh, server-side role guards |
| Hosting | open the file locally | Vercel (frontend) + Render/Fly.io (API) + Neon/Supabase (database) — free tiers sufficient for pilot |

---

## 7. Non-functional requirements

- **Performance:** dashboard and timeline render a full month of calls in under 3 s; 3D scene sustains 30+ FPS on a standard office laptop; mobile quality mode for tablets and phones.
- **Availability:** 99.5% during terminal operating hours; graceful degradation — 2D fallback when WebGL is unavailable, polling fallback when WebSocket drops.
- **Security:** HTTPS; JWT with refresh rotation; server-side role checks; OTP rate limiting; OWASP Top-10 hygiene; complete audit logging.
- **Usability:** a routine berth assignment including side and bollards completes in under 60 seconds; every blocking condition explains itself in operational language and states when the berth or bollards become free.
- **Data:** IST display / UTC storage; daily automated backups; 7-year retention of operational history.
- **Traceability:** every rule in `BUSINESS_RULES.md` has at least one automated check in `tests/test_app.js`.

---

## 8. Success metrics

| Metric | Target |
|---|---|
| Berth or bollard conflicts discovered at execution instead of planning | Zero |
| Time to produce or revise a berthing plan | Under 15 minutes |
| Vessel calls planned in the system rather than spreadsheets | 100% |
| Management requests for manually compiled reports | Zero — dashboard and reports self-serve |
| BMPH and GCR available per vessel without manual calculation | Every closed call |
| Adoption | All three roles using the system weekly |

---

## 9. Assumptions, dependencies and risks

| Type | Item | Mitigation |
|---|---|---|
| Assumption | 22.5 m nominal bollard spacing applies along all three berths | Spacing is a single configurable constant; validation is CB1-only by design |
| Assumption | Operators exercise judgement on CB2/B3 mooring | Deliberate: CB2/B3 bollard selection is unrestricted and recorded; conflicts remain visible as information |
| Assumption | The prototype's Three.js scene can be reused in the production frontend | Scene is already isolated in `app.js` and driven only by plan data |
| Dependency | Three.js CDN availability for the 3D twin | Automatic 2D top-view fallback; can be vendored locally |
| Dependency | OTP delivery channel at go-live | Demo OTP now; email OTP free; SMS gateway (MSG91/Twilio) when budget allows |
| Risk | Free hosting tiers sleep when idle | Acceptable for pilot; upgrade path documented in `ROADMAP.md` |
| Risk | Scope growth toward TOS functions (yard, gate, billing) | Explicit out-of-scope list in §3.2; changes require a PRD revision |
| Risk | Parallel use of WhatsApp and Excel during rollout | Live dashboard and validated rules make the system the fastest source of truth |

---

*Revision history: v1.0 (06 Aug 2026) initial blueprint · v2.2 (12 Aug 2026) rewritten against the delivered prototype — see [`../CHANGELOG.md`](../CHANGELOG.md).*

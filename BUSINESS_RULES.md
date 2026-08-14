# PORTVISION 3D — Business Rules (authoritative)

Version 2.3 · 14 August 2026

This is the single source of truth for operational rules. Each rule states the condition, the system behaviour, the exact user-facing message where one exists, and the implementing function in `app.js`. Rule numbering is stable — new rules append, existing numbers are never reused.

---

## 1. Reference data

| Berth | Length | Permitted vessel types | Cranes | Bollards |
|---|---|---|---|---|
| **CB1** | 350 m | Container, Bulk, Break-Bulk | QC01, QC02, QC04, QC03 (physical order) | Independent pool **1–17** |
| **CB2** | 357 m | Container, Liquid, Bulk, Break-Bulk | QC08, QC05, QC06, QC07 (physical order) | Shared pool — displayed **1–17** |
| **B3** | 426 m | Liquid, Bulk, Break-Bulk | none (shore crane / vessel gear) | Shared pool — displayed **18–34** |

Constants: bollard spacing **22.5 m**; CB1 two-vessel combined LOA limit **290 m**; default productivity **30 moves/crane/hour**; ETB offset **60 minutes**; legacy clearance fallback **15 m**.

Vessel types and cargo options:

| Type | Berths | Cargo options |
|---|---|---|
| Container | CB1, CB2 | Discharge, Loading, Reefer, ODC, One Door Open, Hazardous (container counts) |
| Liquid | CB2, B3 | CBFS, CPO, Bitumen (MT) |
| Bulk | CB1, CB2, B3 | Soda Ash, Gypsum, Limestone, River Sand (MT) |
| Break-Bulk | CB1, CB2, B3 | Steel Coil, Steel Plate, Steel Rebar, Bags (MT) |

---

## 2. Time and lifecycle rules

**BR-01 · ETB calculation.** ETB = ETA + 60 minutes (configurable `settings.etbOffset`). Applied automatically when the first ETA is recorded.

**BR-02 · Estimated handling duration.** Duration (h) = total container moves ÷ (assigned cranes × productivity), minimum 2 h, rounded to the nearest half hour. Implementation: `estHours()`.

**BR-03 · Suggested ETC.** ETC = ATO + estimated duration, pre-filled when ATO is recorded; the planner may adjust.

**BR-04 · Milestone chain.** Order is ETA→ATA, ETB→ATB, ETO→ATO, ETC→ATC, ETD→ATD. A milestone is locked until the previous **actual** is recorded; locked rows display "🔒 Unlocks after *X* is recorded". Admin may edit any milestone at any time, including after sail-out. Implementation: `recordActual()`.

**BR-05 · Actuals never overwrite estimates.** Estimate and actual are stored separately; delay is displayed per milestone as "+*n*h *m*m late" or "on time".

**BR-06 · Status lifecycle.** Incoming → At Anchorage (ATA) → At Berth (ATB) → Operating (ATO) → Completed (ATC) → Sailed Out (ATD). Sail-out releases the berth and all cranes.

**BR-07 · ETA uniqueness (Condition 1).** Two vessels may not share the same ETA/ATA timestamp. Message: *"⚠️ ETA clash — Condition 1 — \<vessel\> (VIA \<n\>) already has its ETA/ATA at \<time\>. Two vessels cannot share the same ETA — pick a different time."* Implementation: `etaClash()`.

**BR-08 · ETA history.** The first ETA is preserved as First ETA; subsequent changes update Latest ETA. Both appear on the dashboard and in reports. ETA cannot change after ATB (Admin excepted); ETD can.

**BR-09 · Time zone.** All times captured and displayed in IST (Asia/Kolkata); stored in UTC in production.

**BR-10 · Audit.** Every create, update, assignment, waiver, abort and actual writes an audit entry with user role, mobile number, timestamp and description. Implementation: `logAudit()`.

---

## 3. Berth and mooring rules

**BR-11 · Berth eligibility by vessel type.** Container → CB1, CB2. Liquid → CB2, B3. Bulk and Break-Bulk → CB1, CB2, B3. Ineligible berth cards are disabled and show "⛔ Not permitted for \<type\> vessels"; attempting assignment raises *"⚠️ Berth not permitted — \<berth\>"*. Implementation: `TYPE_BERTHS`, `berthAllowed()`.

**BR-12 · Maximum two simultaneous vessels per berth.** A third time-overlapping vessel is refused: *"\<berth\> already has two vessels planned in this window — maximum 2 simultaneous vessels per berth."* Implementation: `dualCheck()`.

**BR-13 · CB1 combined-LOA restriction.** A single vessel of any LOA may occupy CB1. With **two** simultaneous vessels, Vessel 1 LOA + Vessel 2 LOA must be ≤ **290 m**, otherwise: *"⚠️ CB1 Berthing Restriction: with 2 vessels the combined LOA must not exceed 290 m — \<other vessel\> (\<L2\> m) + your vessel (\<L1\> m) = \<sum\> m. A single vessel can be any LOA."* Enforced at berth assignment and re-checked at ATB. *Supersedes the earlier per-vessel caps CB1 < 145 m, CB2 < 148 m, B3 < 183.25 m, which are withdrawn.*

**BR-14 · Bollard pools.** CB1 owns an independent pool of bollards 1–17. CB2 and B3 share **one physical pool of 34 bollards**: 1–17 sit on the CB2 quay and 18–34 on the B3 quay, and a vessel at either berth may moor on any bollard in the pool. Implementation: `poolOf()`, `poolBerths()`, `poolMax()`, `bollardWorld()`.

**BR-15 · Bow and Stern selection with automatic allocation.** The planner selects a Bow bollard and a Stern bollard (dropdown or chip click — first click sets Bow, second sets Stern). Every bollard between them is allocated automatically as a contiguous range. Occupied span = (high − low) × 22.5 m. Implementation: `applyBollards()`, `bolRange()`.

**BR-16 · Bollard validation — CB1 only.**
- *Conflict:* if any bollard in the Bow-to-Stern range is held by a time-overlapping vessel — *"⚠️ Bollard Conflict — Bollards \<x\>–\<y\> are already occupied by \<vessel\> (VIA \<n\>, bollards \<a\>–\<b\>). Choose a clear range — the whole Bow-to-Stern range must be free."*
- *Insufficient span:* if span < LOA × 0.9 — *"⚠️ Invalid Mooring Range — The selected bollard spacing is insufficient for this vessel's LOA. \<n\> bollards span \<s\> m but the vessel is \<LOA\> m — select bollards further apart."*

**BR-17 · CB2 and B3 — unrestricted bollard selection.** For CB2 and B3 **no** bollard restriction applies: no conflict check, no span-vs-LOA check, no boundary, ownership or range restriction. Whatever Bow and Stern the operator selects is accepted as final (e.g. Bow 5 / Stern 25 → range 5–25 recorded and displayed). Occupied bollards are still shown in red as information only and remain selectable. The ATB gate does not check bollards on CB2/B3. *This deliberately places the decision with the manager/operator on the multipurpose berths.*

**BR-18 · Berthing side.** Each vessel records `PORT` or `STARBOARD` side to berth. Port side to berth is the berth frame's default heading; starboard adds π to the vessel's rotation in the 3D twin. The choice is nautical, never screen-relative, and is editable until sail-out.

**BR-19 · Mooring ropes.** Rope geometry is computed every frame from vessel position, vessel rotation, berthing side, and the world position of the selected Bow and Stern bollards. Bow line → Bow bollard; stern line → Stern bollard; two spring lines → one bollard inward from each end. Fairleads are always chosen on the quay-facing side of the hull. **No rope endpoint may terminate in the water.** With no bollards selected, ropes project onto the nearest points of the quay edge. Implementation: `updateRopes()`.

**BR-20 · Tentative berthing.** A berth may be selected even when occupied, and the vessel may record ATA at anchorage. The system warns: *"⚠️ Tentative berth — \<berth\> availability — \<vessel\> (VIA \<n\>, \<status\>) holds \<berth\> and is expected to sail at ETD \<time\>. Your vessel is tentatively planned on \<berth\> — it can record ATA at anchorage, but ATB will only be allowed after that vessel records its ATD."*

**BR-21 · ATB hard gate.** ATB is refused while a blocking condition exists: three vessels alongside (BR-12), CB1 combined LOA over 290 m (BR-13), or — on CB1 — a bollard-range intersection with a vessel alongside (BR-16). The message names the blocking vessel and states the ETD after which the berth or bollards become free. The milestone slider resets to 0.

**BR-22 · Double banking display.** Two time-overlapping vessels on one berth render as two thin stacked bars **inside the same berth row** of the timeline — never as a second berth row — each independently clickable, double-clickable and draggable to the correct vessel.

---

## 4. Crane rules

**BR-23 · Crane applicability and selection.** Crane selection is shown only for **Container** and **Break-Bulk** vessels; Liquid and Bulk vessels have no crane field. Only cranes physically serving the assigned berth are offered, in true physical order (CB1: QC01, QC02, QC04, QC03 · CB2: QC08, QC05, QC06, QC07). B3 has no QC cranes. A crane serves one vessel at a time and cannot be assigned when its status is Maintenance or Breakdown. Break-Bulk vessels may waive port cranes via "Port Crane not required" (vessel gear). Before ATB, a Container or Break-Bulk vessel must have at least one crane or an explicit waiver: *"Please select a Crane for \<type\> vessel before berthing (or use 'Port Crane not required' for Break-Bulk)"*.

---

## 5. Performance rules

**BR-24 · Total moves, port stay, BMPH and GCR.**
- Total Moves = Discharge + Loading + Total Hatch Covers + Total Bin Boxes.
- Hatch covers and bin boxes are captured in a **mandatory** popup the moment ETC becomes ATC; the popup cannot be dismissed without saving.
- Port Stay (h) = ATD − ATB.
- **BMPH** = Total Moves ÷ Port Stay hours, shown per vessel and as a terminal average. **No colour condition is applied to BMPH.**
- **GCR** is entered per vessel in the Vessel History & GCR section; marking the cycle complete removes the vessel from the pending list.
- Analytics display GCR vessel-wise on an X–Y chart with a threshold line at **30**: GCR < 30 → **red**, GCR ≥ 30 → **green** (exactly 30 is green).

---

## 6. Plan integrity rules

**BR-25 · Vessel Selected gate.** A new plan is a draft and is excluded from dashboard, reports, analytics and the 3D twin until "✔ Vessel Selected" is pressed. Draft bars appear outlined on the timeline. Actuals cannot be recorded on a draft.

**BR-26 · Unsaved-plan guard.** Navigating away from an unsaved plan raises a Save / Cancel / Continue prompt. Cancelling reverts estimates, berth, side, bollards, cranes and cargo to the last saved snapshot — **recorded actuals are never reverted**.

**BR-27 · Abort plan.** A plan without ATB may be aborted from the timeline (double-click → Abort Berthing Plan). The voyage is deleted from timeline, dashboard, reports and 3D twin after an explicit confirmation, and the action is notified and audited.

**BR-28 · Berth change clears mooring.** Changing or unassigning the berth clears Bow/Stern bollards and the derived quay position, since a bollard number is meaningful only within its pool.

---

## 7. Rule-to-test traceability

| Rules | Automated checks in `tests/test_app.js` |
|---|---|
| BR-01, BR-03, BR-04, BR-05 | T3, T4, T6 — milestone chain, unlock order, delay display |
| BR-07 | T9 — ETA clash Condition 1 |
| BR-11 | T22 — vessel type eligibility and popup |
| BR-12, BR-13 | T23, T24 — double banking approval and CB1 combined-290 refusal |
| BR-14, BR-15 | T30 — 34 shared chips, bow/stern pick, 8 auto intermediates |
| BR-16 | T30 — CB1 conflict and insufficient-span popups |
| BR-17 | T30 — CB2 overlap allowed, tiny span allowed, bow 5 / stern 25 accepted |
| BR-18 | T30 — side buttons set `STARBOARD` |
| BR-20, BR-21 | T18, T19 — tentative popup, ATB gate refusal |
| BR-22 | T28 — two thin bars, three berth rows, correct vessel per bar |
| BR-23 | T25, T26, T27 — crane suppression, inline chips, waiver flow |
| BR-24 | T15, T16, T20, T32 — GCR cycle, red/green colouring, BMPH values, port stay |
| BR-25, BR-26, BR-27 | T10, T11 — guard modal, abort removal |

---

*Change control: any amendment to this document requires a matching change in `app.js`, a new or updated check in `tests/test_app.js`, and an entry in `CHANGELOG.md`.*

---

## 8. Multi-port rules (v2.3 — Kattupalli + Ennore)

**BR-29 · Ports master.** Operational sites are records in a `PORTS` master (stable IDs: `KTP` Kattupalli, `ENN` Ennore), not hard-coded branches. Berths, cranes and bollard pools carry a `port` id; every voyage stores the port it was planned at. Adding a future port means adding master data, not rewriting screens.

**BR-30 · One port at a time, never mixed.** All operational views — dashboard KPIs and tiles, berth occupancy, crane board, timelines, analytics, GCR/BMPH, every report, vessel history, notifications and audit — are filtered to the selected port. Kattupalli + Ennore figures are never summed; an "All Ports" view would be an explicit future addition. In production this filter is a mandatory server-side query predicate (`?port=`), not a frontend courtesy.

**BR-31 · Port selection & persistence.** The Port/Site selector (top bar, Vessel Planning, Reports) sets the operating context for every screen and persists across navigation. The planner selects the port before berth planning; the plan is saved against that port. Switching ports clears any cross-port selection and rebuilds the digital twin.

**BR-32 · Ennore B1 configuration.** Single berth, display name "Ennore B1", 400 m, all four vessel types permitted, 4 QC cranes (QC-01…QC-04, separate master records from Kattupalli), 27 bollards numbered 1–27 at **15 m** spacing (Kattupalli spacing 22.5 m is unchanged). Values live in configuration (`ENN_CFG`, berth/crane masters).

**BR-33 · Ennore mooring & simultaneous vessels.** Port/Starboard side, Bow/Stern selection and automatic intermediate allocation behave exactly as at Kattupalli, using the same visual states. Because Ennore B1 is a single berth, two simultaneous vessels are allowed only when their bollard ranges do NOT overlap — enforced in the rules engine (`applyBollards`, ATB gate), with the standard "⚠️ Bollard Conflict" message. The CB1 combined-290 m rule does **not** apply to Ennore; the max-2-vessels rule does. No span-vs-LOA restriction is configured for Ennore.

**BR-34 · Per-port digital twin.** The twin loads the scene of the selected port only. Ennore's scene: sea south of a straight 400 m quay, 27 numbered live-state bollards, 4 QC cranes at configurable positions, and the container yard set back 100 m behind the crane apron at real scene scale. Mooring ropes, night mode, and the double-click VESSEL INFORMATION panel (which now shows **Port**) work identically at both sites. The Kattupalli scene is unchanged.

**Traceability:** BR-29–BR-34 → automated checks T33.1–T33.14 in `tests/test_app.js`.

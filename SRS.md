# PORTVISION 3D — Software Requirements Specification

Version 2.2 · 12 August 2026 · Companion to [`PRD.md`](PRD.md) and [`BUSINESS_RULES.md`](BUSINESS_RULES.md)

Each requirement is numbered, testable and marked with its status in prototype v2.2:
**✅ Implemented** · **🔶 Partial** · **⬜ Planned (production)**

---

## 1. Authentication and access (FR-1xx)

| ID | Requirement | Status |
|---|---|---|
| FR-101 | The system shall present three roles at sign-in: Vessel Planner, Manager, Admin. | ✅ |
| FR-102 | The system shall require a 10-digit mobile number and enable OTP dispatch only when a role and a valid number are present. | ✅ |
| FR-103 | The system shall verify a 6-digit OTP and reject any other value with a visible error. | ✅ |
| FR-104 | The system shall display the signed-in role and mobile number and provide logout that clears the session. | ✅ |
| FR-105 | The system shall show each role only its permitted navigation items (Planning and Administration hidden from Manager; Administration hidden from Planner). | ✅ |
| FR-106 | The system shall enforce role permissions in the API layer, independently of the UI. | ⬜ |
| FR-107 | The system shall issue JWT access and refresh tokens, expire OTPs, and limit OTP retries. | ⬜ |

## 2. Vessel and voyage management (FR-2xx)

| ID | Requirement | Status |
|---|---|---|
| FR-201 | The system shall provide type-ahead search over the vessel master by name. | ✅ |
| FR-202 | The system shall allow adding and editing a vessel with name, IMO, call sign, flag, LOA, service, operator and vessel type. | ✅ |
| FR-203 | The system shall support vessel types Container, Liquid, Bulk and Break-Bulk and display the permitted berths for the selected type. | ✅ |
| FR-204 | The system shall create a voyage with a unique VIA number and allow the VIA to be edited. | ✅ |
| FR-205 | The system shall list all open voyages of the selected vessel and allow creating a new voyage. | ✅ |
| FR-206 | The system shall record First ETA on first capture and maintain Latest ETA thereafter (BR-08). | ✅ |
| FR-207 | The system shall keep a new plan invisible to dashboard, reports, analytics and 3D twin until "Vessel Selected" is confirmed (BR-25). | ✅ |
| FR-208 | The system shall persist vessels and voyages in a database and expose them over REST. | ⬜ |

## 3. Berth planning (FR-3xx)

| ID | Requirement | Status |
|---|---|---|
| FR-301 | The system shall display berths CB1, CB2 and B3 with length, permitted types, current occupancy and the ETD after which each frees. | ✅ |
| FR-302 | The system shall refuse assignment of a vessel to a berth not permitted for its type, with a named popup (BR-11). | ✅ |
| FR-303 | The system shall display a full-month timeline with one row per berth, day and weekday headers, and a today marker. | ✅ |
| FR-304 | The system shall allow horizontal scrolling across the month and extension into future dates in 7-day increments. | ✅ |
| FR-305 | The system shall allow dragging a vessel bar to prepone or postpone its ETA, snapped to 30-minute steps, revalidating BR-07 and BR-20. | ✅ |
| FR-306 | The system shall open a vessel details modal on double-click of a bar, allowing ETA and ETD change and plan abort. | ✅ |
| FR-307 | The system shall render two time-overlapping vessels as two thin stacked bars inside the same berth row, each bound to the correct vessel (BR-22). | ✅ |
| FR-308 | The system shall refuse a third time-overlapping vessel on any berth (BR-12). | ✅ |
| FR-309 | The system shall refuse two simultaneous CB1 vessels whose combined LOA exceeds 290 m (BR-13). | ✅ |
| FR-310 | The system shall permit tentative assignment to an occupied berth with an explanatory popup naming the occupant and its ETD (BR-20). | ✅ |
| FR-311 | The system shall present the same timeline on the Dashboard in read-only mode with a Big Screen expansion. | ✅ |

## 4. Mooring and bollards (FR-4xx)

| ID | Requirement | Status |
|---|---|---|
| FR-401 | The system shall offer Port Side to Berth and Starboard Side to Berth and record the choice per voyage (BR-18). | ✅ |
| FR-402 | The system shall rotate the vessel in the 3D twin according to the selected side, computed from the berth's heading and not from screen orientation. | ✅ |
| FR-403 | The system shall present bollards 1–17 for CB1 and 1–34 for CB2/B3, indicating which numbers sit on which quay (BR-14). | ✅ |
| FR-404 | The system shall allow Bow and Stern selection by dropdown and by chip click (first click Bow, second Stern). | ✅ |
| FR-405 | The system shall allocate all intermediate bollards automatically and display the occupied range, bollard count and span in metres (BR-15). | ✅ |
| FR-406 | The system shall display bollard states as available, bow, stern, auto-allocated and occupied, in the planning UI and on numbered 3D bollards. | ✅ |
| FR-407 | The system shall validate bollard conflict and span-vs-LOA **for CB1 only**, with the messages of BR-16. | ✅ |
| FR-408 | The system shall accept any Bow/Stern selection on CB2 and B3 without restriction or validation (BR-17). | ✅ |
| FR-409 | The system shall keep bollards editable until sail-out and clear them when the berth changes (BR-28). | ✅ |
| FR-410 | The system shall show the allocated bollard range in the vessel information panel and in the planning summary. | ✅ |

## 5. Cranes (FR-5xx)

| ID | Requirement | Status |
|---|---|---|
| FR-501 | The system shall display crane selection only for Container and Break-Bulk vessels. | ✅ |
| FR-502 | The system shall offer only the cranes serving the assigned berth, in true physical order (BR-23). | ✅ |
| FR-503 | The system shall prevent assignment of a crane that is operational on another vessel, under maintenance or broken down. | ✅ |
| FR-504 | The system shall provide a "Port Crane not required" waiver for Break-Bulk vessels and clear any selected cranes when it is applied. | ✅ |
| FR-505 | The system shall block ATB for Container and Break-Bulk vessels with neither a crane nor a waiver. | ✅ |
| FR-506 | The system shall allow crane status to be cycled Available → Maintenance → Breakdown and notify when a crane becomes unavailable. | ✅ |
| FR-507 | The system shall release all cranes on sail-out. | ✅ |

## 6. Cargo (FR-6xx)

| ID | Requirement | Status |
|---|---|---|
| FR-601 | The system shall capture container cargo as discharge, loading, reefer, ODC, one-door-open and hazardous counts. | ✅ |
| FR-602 | The system shall present cargo options specific to the vessel type and allow multiple cargo lines with volume in MT and Import/Export direction. | ✅ |
| FR-603 | The system shall total cargo volume per voyage and per cargo type across the terminal. | ✅ |
| FR-604 | The system shall display a mandatory, non-dismissible popup capturing Total Hatch Covers and Total Bin Boxes the moment ATC is recorded (BR-24). | ✅ |

## 7. Milestones and lifecycle (FR-7xx)

| ID | Requirement | Status |
|---|---|---|
| FR-701 | The system shall present milestones ETA→ATA, ETB→ATB, ETO→ATO, ETC→ATC, ETD→ATD with a slider that records the actual when moved to completion. | ✅ |
| FR-702 | The system shall keep a milestone locked, with an explanatory label, until the previous actual exists (BR-04). | ✅ |
| FR-703 | The system shall compute and display delay against each estimate. | ✅ |
| FR-704 | The system shall allow the Planner to edit recorded actuals until sail-out and the Admin to edit them at any time. | ✅ |
| FR-705 | The system shall require ATC before ATD and route ATD through an explicit sail-out confirmation that releases berth and cranes. | ✅ |
| FR-706 | The system shall auto-suggest ETO, ETC and ETD when the preceding actual is recorded (BR-03). | ✅ |
| FR-707 | The system shall update every open client in real time when a milestone is recorded. | ⬜ |

## 8. 3D digital twin (FR-8xx)

| ID | Requirement | Status |
|---|---|---|
| FR-801 | The system shall render the terminal layout with sea, anchorage, navigation channel, buoys, pilot boarding ground, the L-shaped quay with CB1/CB2/B3, yard and coastline. | ✅ |
| FR-802 | The system shall place each planned vessel according to its status — deep sea, anchorage, or alongside at its bollard range midpoint. | ✅ |
| FR-803 | The system shall animate berthing and departure along a channel and basin path with tug escorts. | ✅ |
| FR-804 | The system shall render numbered bollards on every quay and colour them by live state. | ✅ |
| FR-805 | The system shall draw mooring ropes from vessel fairleads to the selected bollards, recomputed each frame, with no endpoint in the water (BR-19). | ✅ |
| FR-806 | The system shall animate QC cranes (boom, trolley, spreader, container) only while their vessel is Operating. | ✅ |
| FR-807 | The system shall provide day/night mode with vessel, buoy, crane and yard lighting. | ✅ |
| FR-808 | The system shall provide camera presets per berth, anchorage and channel, plus a guided cinematic tour. | ✅ |
| FR-809 | The system shall provide a mobile/desktop quality switch affecting pixel ratio, shadows and field of view. | ✅ |
| FR-810 | The system shall open a single-click quick info card and a double-click VESSEL INFORMATION panel containing Vessel Name, VIA, Service, LOA, Status, Berth, Bollard No, Crane, ETA, ATA, ATB, ATO, ATC, ATD and Port Stay in hours. | ✅ |
| FR-811 | The system shall fall back to a 2D top view when WebGL or the 3D library is unavailable, preserving click and double-click behaviour. | ✅ |

## 9. Dashboard and analytics (FR-9xx)

| ID | Requirement | Status |
|---|---|---|
| FR-901 | The system shall display KPI tiles for vessels handled, berths available, operational berths now, vessels operational today, berthed today, average berthing time, berth utilization, crane utilization, container moves, Liquid/Bulk/Break-Bulk tonnage and average BMPH. | ✅ |
| FR-902 | The system shall colour each berth green when free or unplanned and red when occupied or planned for today, and navigate to the 3D twin on click. | ✅ |
| FR-903 | The system shall show current and upcoming operations tables with ETA/ATA, ETB/ATB, ETD/ATD, berth, cranes and status. | ✅ |
| FR-904 | The system shall show the berth-plan timeline and a plan table listing vessel, berth, ETA, ATB, ATO, ATC, ATD, berth occupancy duration and status. | ✅ |
| FR-905 | The system shall provide a Big Screen view of the berth plan for managers. | ✅ |
| FR-906 | The system shall filter analytics by one or many months. | ✅ |
| FR-907 | The system shall plot GCR vessel-wise on an X–Y chart with a threshold line at 30, red below 30 and green at or above 30 (BR-24). | ✅ |
| FR-908 | The system shall plot BMPH vessel-wise with no colour condition and display the average. | ✅ |

## 10. Reports, notifications and administration (FR-10xx)

| ID | Requirement | Status |
|---|---|---|
| FR-1001 | The system shall provide reports: Monthly Vessels + GCR, Vessel Report, Liquid Report, Bulk & Break-Bulk Report, Crane Detailed Report, Vessel History, Berth Utilization, Cargo Summary. | ✅ |
| FR-1002 | The Vessel Report shall include cargo volume in MT, port stay, BMPH and GCR per vessel with a terminal average. | ✅ |
| FR-1003 | The system shall export any report to CSV and to PDF (print). | ✅ |
| FR-1004 | The Admin shall be able to edit report data. | ✅ |
| FR-1005 | The system shall raise notifications with an unread badge for berth assignment, crane assignment, milestone events, crane unavailability and plan abort. | ✅ |
| FR-1006 | The system shall maintain an audit log of every action with role, mobile number, timestamp and description (BR-10). | ✅ |
| FR-1007 | The system shall expose configurable productivity norm and ETB offset. | 🔶 |
| FR-1008 | The system shall schedule a daily report email to Managers. | ⬜ |

## 11. Non-functional requirements (NFR)

| ID | Requirement | Status |
|---|---|---|
| NFR-01 | The dashboard and timeline shall render a full month of vessel calls within 3 seconds. | ✅ |
| NFR-02 | The 3D scene shall sustain 30+ FPS on a standard office laptop; mobile mode shall reduce load for tablets and phones. | ✅ |
| NFR-03 | The application shall degrade gracefully — 2D fallback without WebGL, polling fallback without WebSocket. | 🔶 |
| NFR-04 | All blocking conditions shall be explained in operational language, naming the blocking vessel and the time the constraint clears. | ✅ |
| NFR-05 | All times shall be displayed in IST and stored in UTC. | 🔶 |
| NFR-06 | The system shall run over HTTPS with JWT authentication and server-side role checks. | ⬜ |
| NFR-07 | Operational history shall be retained 7 years with daily automated backups. | ⬜ |
| NFR-08 | Every business rule shall have at least one automated check in the regression suite. | ✅ |
| NFR-09 | A routine berth assignment including side and bollards shall be completable in under 60 seconds. | ✅ |

---

*Traceability: FR/NFR → rule → automated check is tabulated in [`BUSINESS_RULES.md`](BUSINESS_RULES.md) §7 and [`TESTING.md`](TESTING.md).*

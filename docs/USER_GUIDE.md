# PORTVISION 3D — User Guide

Version 2.2 · For Vessel Planners, Managers and Administrators

---

## 1. Signing in

1. Open `www/index.html` in Google Chrome or Microsoft Edge.
2. Choose your role: **Vessel Planner**, **Manager** or **Admin**.
3. Enter your 10-digit mobile number and press **Send OTP**.
4. Enter the OTP. In demo mode the OTP is **123456**.

What each role sees: Planner — Dashboard, Vessel Planning, 3D Digital Twin, Reports, Notifications. Manager — everything except Vessel Planning and Administration. Admin — everything, plus the ability to edit any time, before or after sail-out.

---

## 2. Planning a vessel — the five steps

The Vessel Planning screen works top to bottom. Each section unlocks as the previous one is completed.

### Step 1 — Vessel Information

Type a few letters of the vessel name and pick it from the list, or press **＋ Add New Vessel** for a first-time caller. Choose the **Type of Vessel** — Container, Liquid, Bulk or Break-Bulk. The chips below show LOA, service, IMO, flag, operator and, importantly, **which berths that type is permitted to use**.

### Step 2 — Voyage and ETA

Select an existing voyage or **＋ New Voyage** to generate a VIA number, then set the **Tentative ETA**. ETB is calculated automatically as ETA + 1 hour.

Press **✔ Vessel Selected** when the call is real. Until you do, the plan is a draft: it does not appear on the dashboard, in reports or in the 3D twin, and no actuals can be recorded.

> If another vessel already has that exact ETA you will see *ETA clash — Condition 1*. Change the time by a few minutes.

### Step 3 — Cargo

Container vessels: enter discharge, loading, reefer, ODC, one-door-open and hazardous container counts. Liquid, Bulk and Break-Bulk vessels: choose the cargo (CBFS, CPO, Bitumen / Soda Ash, Gypsum, Limestone, River Sand / Steel Coil, Plate, Rebar, Bags), enter the volume in **MT** and set **Import** or **Export**. Use **＋ Add Cargo** for multiple parcels.

### Step 4 — Assign Berth, Side, Bollards and Cranes

**Berth.** Click CB1, CB2 or B3. Ineligible berths are greyed with the reason. An occupied berth can still be chosen — the plan is then *tentative*, and the popup tells you the occupant and its ETD.

**Timeline.** The month-wide timeline shows every planned window. Drag a bar to prepone or postpone. Double-click a bar for details, ETA/ETD change, or to abort the plan. Press **＋** at the right end to add another week of dates.

Two vessels sharing a berth in the same period appear as **two thin bars inside the same berth row** — the upper and lower halves are separate vessels, each clickable.

**Berthing side.** Choose **🔴 Port Side to Berth** or **🟢 Starboard Side to Berth**. The vessel physically turns around in the 3D twin, and the mooring ropes move to the correct side.

**Bollards.** Pick the **Bow bollard** and the **Stern bollard** — from the dropdowns, or simply click the numbered chips (first click = Bow, second = Stern). Everything between is allocated automatically. The summary shows the range, the number of bollards and the span in metres against the vessel's LOA.

| Colour | Meaning |
|---|---|
| Green | Available |
| Blue | Bow bollard |
| Purple | Stern bollard |
| Teal | Automatically allocated in between |
| Red, struck through | Occupied by another vessel |

- On **CB1** (bollards 1–17) the system checks your range: overlapping another vessel gives *Bollard Conflict*, and too short a span for the LOA gives *Invalid Mooring Range*.
- On **CB2 and B3** (shared 1–34, where 1–17 are on the CB2 quay and 18–34 on the B3 quay) **there is no restriction** — whatever you select is accepted. Red chips are information only; you may still use them. Bow 5 / Stern 25 is perfectly valid.

**Cranes.** Container and Break-Bulk vessels must have a crane before ATB. Only the cranes serving that berth are offered, in their real physical order. Break-Bulk vessels working with ship's gear can press **Port Crane not required**. B3 has no quay cranes.

### Step 5 — Time Planning (recording actuals)

Five milestones, each unlocking when the previous actual is recorded:

| Milestone | Meaning | Note |
|---|---|---|
| ETA → **ATA** | Arrival at anchorage | |
| ETB → **ATB** | All fast alongside | Blocked while another vessel holds the berth or, on CB1, your bollards |
| ETO → **ATO** | Operations commenced | |
| ETC → **ATC** | Cargo operations complete | A popup asks for **Total Hatch Covers** and **Total Bin Boxes** — mandatory, they count into total moves |
| ETD → **ATD** | Departure | Opens **Sail Out** confirmation; releases berth and cranes |

Slide the slider fully right to record an actual. Planners can correct actuals until sail-out; Admins any time.

Finish with **💾 Save Planning**. **➕ Next Vessel Berthing Plan** starts the next call. If you navigate away with unsaved changes the system offers Save or Cancel — cancelling reverts estimates but never recorded actuals.

---

## 3. Vessel History & GCR

Below the milestones, vessels that have sailed appear in the **Vessel History & GCR** list. Enter the **GCR** for the vessel and press **Vessel Cycle Completed** — the vessel leaves the pending list and its GCR flows into reports and the dashboard chart.

---

## 4. Dashboard (Managers)

- **KPI tiles** — vessels handled, berths available, operational berths, berthing time, berth and crane utilization, container moves, Liquid/Bulk/Break-Bulk tonnage, average BMPH.
- **Berth occupancy** — green means free or unplanned today, red means occupied or planned today. Click any berth to fly to it in the 3D twin.
- **QC crane positions** — click a crane to cycle Available → Maintenance → Breakdown (Planner/Admin).
- **Vessel Berth Plan — Assign Berth Timeline** — the same month timeline, plus a table of vessel, berth, ETA, ATB, ATO, ATC, ATD, berth occupancy hours and status. Press **⛶ Big Screen** for the full-width view. Double-click any bar for vessel details.
- **Performance Analytics** — filter by one or several months, then read:
  - **GCR by vessel** — a column per vessel with a dashed line at 30. Below 30 is red, 30 and above is green.
  - **BMPH by vessel** — Total Moves ÷ Port Stay (ATB→ATD). No colour rule; the average is shown in the heading.

---

## 5. 3D Digital Twin

| Action | Result |
|---|---|
| Drag | Orbit the camera |
| Scroll | Zoom |
| Click a vessel | Quick info card |
| **Double-click a vessel** | Full **VESSEL INFORMATION** panel — name, VIA, service, LOA, status, berth, bollard numbers, cranes, ETA, ATA, ATB, ATO, ATC, ATD, port stay in hours |
| Camera buttons | Overview, CB1, CB2, B3, anchorage, channel |
| 🌙 / ☀️ | Night and day mode with all port lighting |
| 🖥️ / 📱 | Desktop or mobile graphics quality |
| ▶ Tour | Guided cinematic tour of an arrival, berthing and shifting |

Vessels arrive along the navigation channel with tug escorts, moor at their selected bollards with ropes attached to those bollards, and their cranes work only while the vessel status is Operating.

If your browser cannot run 3D, a 2D top view appears automatically with the same click behaviour.

---

## 6. Reports

Eight tabs: **Monthly Vessels + GCR**, **Vessel Report** (cargo volume, port stay, BMPH, GCR), **Liquid Report**, **Bulk & Break-Bulk Report**, **Crane Detailed Report**, **Vessel History**, **Berth Utilization**, **Cargo Summary**. Every tab exports to **CSV** and prints to **PDF**. Admins can edit report data to correct historical entries.

---

## 7. Messages you may see

| Message | What to do |
|---|---|
| ⚠️ ETA clash — Condition 1 | Another vessel has that exact ETA. Shift by a few minutes. |
| ⚠️ Berth not permitted | The vessel type cannot use that berth. Check the permitted berths chip. |
| ⚠️ Tentative berth — availability | Allowed. You may plan and record ATA, but ATB waits for the occupant's ATD. |
| ⚠️ Berth not yet available | ATB is blocked. The message names the vessel and the ETD after which you can berth. |
| ⚠️ CB1 Berthing Restriction | Two CB1 vessels exceed 290 m combined. One vessel alone may be any length. |
| ⚠️ Bollard Conflict *(CB1 only)* | Your bow-to-stern range overlaps another vessel's bollards. Pick a clear range. |
| ⚠️ Invalid Mooring Range *(CB1 only)* | The chosen bollards are too close together for the LOA. Move them further apart. |
| ⚠️ Crane required | Select a crane, or for Break-Bulk press "Port Crane not required". |
| Unsaved changes prompt | Save to keep the plan, Cancel to revert estimates (actuals are never lost). |

---

## 8. Practical notes

- The whole `www/` folder must be kept together — `index.html`, `styles.css`, `app.js` and `vendor/`.
- In this prototype, data lives for the browser session only — closing the tab clears the plan. Permanent storage arrives with the production database (see [`ROADMAP.md`](ROADMAP.md)).
- The 3D twin needs internet access the first time to load Three.js; without it the 2D view is used.

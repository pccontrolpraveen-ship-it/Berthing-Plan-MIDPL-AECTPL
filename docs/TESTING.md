# PORTVISION 3D — Testing

Version 2.2 · Regression suite `tests/test_app.js`

---

## Running the suite

```bash
npm install -D playwright
npx playwright install chromium
node tests/test_app.js
```

The suite drives a real Chromium browser through the whole application: login, vessel creation, planning, bollard selection, milestone recording, dashboard, reports and the 3D twin. It prints one line per check and finishes with:

```
ERRORS: none
```

Any JavaScript error or unhandled rejection raised by the application during the run is collected and printed on that final line. **`ERRORS: none` is the release gate.**

Screenshots are written to `shots/` for visual confirmation.

---

## What the 32 checks cover

| Check | Verifies |
|---|---|
| T1–T2 | Splash, role selection, OTP login, navigation per role |
| T3–T4 | Vessel search, voyage creation, ETA → ETB auto-calculation |
| T5–T6 | Milestone chain, lock/unlock order, actual recording, delay display |
| T7 | Monthly report, crane report, CSV and PDF buttons |
| T8 | Admin editing of report data |
| T9 | Vessel master size, ETA clash Condition 1, month day cells, timeline bars, cargo fields, double-click info modal |
| T10 | Unsaved-plan guard modal |
| T11 | Abort plan — voyage removed and selection cleared |
| T13 | ＋ Add Dates extends the timeline by 7 days |
| T15 | GCR entry and vessel-cycle completion removing the vessel from the pending list |
| T16 | Month filter chips, GCR column red below 30, BMPH column neutral, average BMPH tile |
| T18 | Tentative berth popup on an occupied berth, assignment still allowed |
| T19 | ATB hard gate refusal and the actual not being recorded |
| T20 | Vessel Report BMPH and GCR columns |
| T21 | 3D milestone modal and next-milestone detection |
| T22 | Vessel type dropdown, type-specific cargo options, ＋ Add Cargo, berth eligibility popup |
| T23 | Double-banking approval and computed quay positions |
| T24 | CB1 combined-LOA 290 m refusal with the exact message |
| T25 | Crane section suppressed for Liquid vessels on B3 |
| T26 | Inline crane chips for Container vessels and persistence with the assignment |
| T27 | Break-Bulk crane-required popup, then the "Port Crane not required" waiver |
| T28 | Double-banked thin bars in one berth row, still three berth rows, correct vessel per bar |
| T29 | Dashboard cargo tiles, separated Liquid and Bulk reports, cargo volume column |
| T30 | Port/Starboard side, 34 shared bollard chips, bow/stern picking, 8 auto intermediates, CB2 unrestricted selection (overlap, tiny span, bow 5 / stern 25 all accepted), CB1 conflict and span validation still firing |
| T31 | Dashboard berth-plan timeline, plan-table columns, Big Screen modal |
| T32 | VESSEL INFORMATION panel — all 15 fields, port stay value, milestone button |

Rule-to-check traceability is tabulated in [`BUSINESS_RULES.md`](BUSINESS_RULES.md) §7.

---

## Adding a check

1. Add the rule to `BUSINESS_RULES.md` with its exact user-facing message.
2. Implement it in `app.js`.
3. Append a check to `tests/test_app.js` following the existing style:

```js
// T33: <what this proves>
const result = await page.evaluate(() => { /* drive the rule directly */ });
console.log('T33 <label>:', result);
```

4. Run the suite. Fix until `ERRORS: none`.
5. Note the change in `CHANGELOG.md`.

Two habits worth keeping from the prototype's development:

- **Drive rules through the real UI where practical** (clicking chips, sliders, buttons) and through `page.evaluate` only when constructing a scenario would otherwise take dozens of steps.
- **Assert the message, not just the outcome.** The exact strings are part of the specification; operators depend on them naming the blocking vessel and the time the constraint clears.

---

## Manual verification checklist

Since Three.js was vendored into `www/vendor/`, headless Chromium loads it from disk and renders the **real WebGL scene** (software-rasterised) — `shots/v3_twin.png` shows the actual 3D twin, so a crash in the 3D path now fails the suite. What headless still cannot judge is whether the scene looks *right*. After any change to the 3D scene, verify manually in Chrome or Edge:

- [ ] Vessels sit alongside at their bollard-range midpoint, not the berth centre
- [ ] Port and Starboard selection visibly turns the vessel around
- [ ] Every mooring rope ends **on a bollard** — none in the water — for both sides and all three berths
- [ ] Bollard numbers are legible and their colours match the planning chips
- [ ] Cranes animate only while the vessel status is Operating
- [ ] Night mode lights vessels, buoys, cranes and yard
- [ ] Double-click opens the VESSEL INFORMATION panel
- [ ] Guided tour completes without the camera losing the vessel

---

## Syntax gate

Before running the suite:

```bash
node --check www/app.js
```

`www/app.js` is a single large file; a syntax error prevents the whole application from loading, so this check catches the most expensive class of mistake in one second.

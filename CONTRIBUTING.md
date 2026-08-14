# Contributing to PORTVISION 3D

Internal project. Small team, one large application file, real terminal
operations depending on the rules being right. These conventions exist to
keep changes safe rather than to add ceremony.

## The one rule that matters

**Never break what already works.** Every change is additive unless a rule
is explicitly being replaced — and when a rule *is* replaced, it is replaced
in three places at once:

1. `docs/BUSINESS_RULES.md` — the rule and its exact user-facing message
2. `app.js` — the implementation
3. `tests/test_app.js` — a check that proves it

A change that updates only one or two of the three is incomplete.

## Before you commit

```bash
node --check app.js          # syntax — catches the expensive mistakes
node tests/test_app.js       # must end with: ERRORS: none
```

Then open `index.html` in Chrome or Edge and confirm the screens you touched
still look right. If the change touched the 3D twin, walk the manual
checklist in `docs/TESTING.md`.

## Working on `app.js`

The file is large and deliberately organised in sections: reference data →
helpers → auth → navigation → render functions (`rDashboard`, `rPlanning`,
`rReports`, `rAdmin`) → wiring functions → rules engine → 3D twin → 2D
fallback. Add code to the section it belongs to rather than the end of the
file.

Conventions worth following because the whole file assumes them:

- **Render functions are pure.** They read state and return HTML. They do
  not mutate. Event wiring lives in the matching `wire…` function.
- **State changes end with `render()`**, and with `twinDirty = true` if the
  3D scene is affected.
- **Rules are standalone functions** (`berthAllowed`, `dualCheck`,
  `applyBollards`, `plannedWindow`). Keep them free of DOM access so they
  can move to the backend unchanged.
- **Geometry is derived, never stored.** Bollard numbers and berthing side
  are the input; positions and rope endpoints are computed.
- **No browser storage.** `localStorage` and `sessionStorage` are not used.
- **Messages are specification.** When a plan is blocked, name the vessel
  and state the time the constraint clears.

## Commit messages

```
feat(bollards): accept unrestricted CB2/B3 selection
fix(3d): attach mooring ropes to selected bollards
docs(prd): update to v2.2
test: add checks for CB1 conflict and span validation
```

Prefixes: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`.

## Branches and review

Work on `main` directly while the team is one person. Once two or more
people edit the code, branch per change (`feat/bollard-tooltips`) and open a
pull request; require the test suite to pass before merging.

## Reporting a problem

Open an issue with: what you did, what you expected, what happened, the role
you were signed in as, the vessel and berth involved, and the browser. A
screenshot of the screen and, where relevant, the exact popup text makes
diagnosis much faster.

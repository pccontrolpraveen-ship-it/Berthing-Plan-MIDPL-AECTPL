# Uploading PORTVISION 3D to GitHub — step by step

Two ways: the **browser method** (no software to install, recommended for the first upload) and the **Git method** (better once you edit code regularly). Both are free.

---

## Before you start — one decision

Make the repository **Private**. This is internal terminal software containing MIDPL berth, crane and bollard configuration. Private repositories are free and unlimited on GitHub, and you can still invite colleagues one by one. Only make it public with written clearance from Adani.

---

## Method A — Browser upload (no installation)

**1. Create a GitHub account** — [github.com/signup](https://github.com/signup), free.

**2. Create the repository**
GitHub → **+** (top right) → **New repository**.

| Field | Value |
|---|---|
| Repository name | `portvision-3d` |
| Description | Smart Vessel Berthing Planning & Port Operations Management System — MIDPL Kattupalli |
| Visibility | **Private** |
| Initialize with README | **Leave unchecked** (this pack already has one) |

Press **Create repository**.

**3. Upload the files**
On the empty repository page click **uploading an existing file**. Drag in the contents of this pack, keeping the folder structure:

```
README.md
CHANGELOG.md
CONTRIBUTING.md
SECURITY.md
LICENSE
.gitignore
www/             (index.html, styles.css, app.js, vendor/three.min.js)
server/          (server.js, schema.sql, package.json)
docs/            (PRD.md, BUSINESS_RULES.md, SRS.md, ARCHITECTURE.md,
                  USER_GUIDE.md, ROADMAP.md, TESTING.md,
                  GITHUB_UPLOAD_GUIDE.md, screenshots/)
tests/           (test_app.js)
.github/         (workflows/test.yml, workflows/deploy-pages.yml)
```

> Drag the **folders** themselves (`www`, `server`, `docs`, `tests`, `.github`) rather than the individual files inside them — GitHub keeps the structure automatically. If the `.github` folder is hard to drag (hidden folders can be awkward on some systems), skip it for now and add it later with **Add file → Create new file**, typing `.github/workflows/deploy-pages.yml` as the filename.

In **Commit changes** write: `Initial commit — PORTVISION 3D v2.2 prototype and documentation`, then **Commit changes**.

**4. Check the result** — the repository home page should now show the README with the feature list and screenshots.

---

## Method B — Git command line (for ongoing work)

Install [Git](https://git-scm.com/downloads) once, then in the folder containing these files:

```bash
git init
git add .
git commit -m "Initial commit — PORTVISION 3D v2.2 prototype and documentation"
git branch -M main
git remote add origin https://github.com/<your-username>/portvision-3d.git
git push -u origin main
```

GitHub will ask you to authenticate in the browser the first time.

Every later change is three commands:

```bash
git add .
git commit -m "Describe what changed"
git push
```

---

## Optional — publish the application to a free URL

Because the prototype is three static files, GitHub can host it at no cost.

1. Repository → **Settings** → **Pages**.
2. **Build and deployment** → Source: **GitHub Actions**.
3. The included workflow `.github/workflows/deploy-pages.yml` runs automatically and publishes the site.
4. After a minute or two your application is live at
   `https://<your-username>.github.io/portvision-3d/`

Anyone with the link can open it on a laptop, tablet or phone — no installation. Note that GitHub Pages sites are **publicly accessible even from a private repository**, so enable Pages only if a publicly reachable demo URL is acceptable. If it is not, skip this section entirely; the application still runs perfectly by opening `www/index.html` locally.

---

## Recommended repository settings

| Setting | Where | Value |
|---|---|---|
| Default branch | Settings → Branches | `main` |
| Collaborators | Settings → Collaborators | Add colleagues individually |
| Branch protection | Settings → Branches → Add rule | Require a pull request before merging to `main` (once more than one person edits) |
| Topics | Repository home → ⚙ next to About | `port-operations`, `berth-planning`, `digital-twin`, `threejs` |
| Releases | Releases → Draft a new release | Tag `v2.2`, attach the three application files as a downloadable snapshot |

---

## Suggested commit message style

```
feat(bollards): accept unrestricted CB2/B3 selection
fix(3d): attach mooring ropes to selected bollards
docs(prd): update to v2.2
test: add checks for CB1 conflict and span validation
```

Prefixes: `feat` new capability · `fix` correction · `docs` documentation · `test` tests · `refactor` internal change with no behaviour change.

---

## What *not* to commit

The included `.gitignore` already excludes these, but as a rule never commit:

- `.env` files or anything containing passwords, tokens or connection strings
- `node_modules/`
- Vessel schedules or commercial documents received from lines and agents
- Personal mobile numbers of staff in test data

If a secret is ever committed, treat it as compromised: rotate it, then remove it from history.

---

## Where the documents fit

| Audience | Read |
|---|---|
| Management approving the project | `docs/PRD.md` §1–4, 8 |
| A developer joining the build | `README.md` → `docs/ARCHITECTURE.md` → `docs/BUSINESS_RULES.md` |
| Marine / operations users | `docs/USER_GUIDE.md` |
| Whoever verifies a change | `docs/TESTING.md` + `docs/BUSINESS_RULES.md` §7 |
| Planning the production build | `docs/ROADMAP.md` |

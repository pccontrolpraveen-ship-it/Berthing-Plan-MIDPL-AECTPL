# PORTVISION 3D — desktop build

Wraps the same `www/` folder the browser and the progressive web app use. There
is no desktop-specific application logic here: `main.js` provides the window,
the local origin the app is served from, and the optional persistence API.

```
desktop/main.js      main process — window, local static origin, backend, menu
desktop/preload.js   points the app at the bundled API; exposes nothing else
desktop/assets/      icon and macOS entitlements used by electron-builder
```

The build configuration lives in the **repository root** `package.json` under
`build`, because electron-builder requires everything it packages to sit under
one project root.

## Running it

```bash
npm install          # root: app dependencies, Electron, electron-builder
npm run desktop      # launch against the working tree
```

## Building installers

```bash
npm run desktop:pack     # unpacked directory in dist/ — no installer, no signing
npm run desktop:win      # NSIS installer  (.exe)
npm run desktop:mac      # dmg + zip
npm run desktop:linux    # AppImage
```

Each target must be built on (or cross-built for) its own platform; macOS
notarization in particular can only run on macOS.

## Storage

The app starts the bundled persistence API **only when a database URL is
configured**, from either:

- the `DATABASE_URL` environment variable, or
- `"databaseUrl"` in `config.json` in the application data folder
  (**File → Open App Data Folder…** creates and reveals it)

With no database configured the app runs in Standalone mode and says so in the
top bar. If a database is configured but unreachable, the badge still reads
Standalone — it never reports a database it cannot actually reach. **File →
Storage Mode…** shows which mode is active and why.

The API is started as a child process rather than inside the main process on
purpose: `server.js` installs no `error` handler on its connection pool, so a
dropped PostgreSQL connection raises an unhandled error event. In-process that
would take the whole application down; as a child it costs one restartable
process, and the UI reports the failure honestly.

It is bound to `127.0.0.1` and given an OS-assigned port. The endpoints carry no
authentication, so in a desktop install the API must not be offered to the
network, and a fixed port would collide with a server the operator is already
running.

## Signing and notarization

`npm run desktop:win` and `npm run desktop:mac` produce **unsigned** output
unless signing credentials are supplied. Unsigned builds trigger SmartScreen on
Windows and Gatekeeper on macOS, so they are fine for internal testing and not
for distribution.

Supply credentials through the environment; never commit them:

| Platform | Variables |
|---|---|
| Windows | `CSC_LINK` (.pfx path or base64), `CSC_KEY_PASSWORD` |
| macOS | `CSC_LINK`, `CSC_KEY_PASSWORD`, plus `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD`, `APPLE_TEAM_ID` for notarization |

The hardened runtime is already enabled for macOS, with entitlements in
`assets/entitlements.mac.plist` — Electron needs the JIT entitlements, and the
app needs client and server networking for its own loopback API.

## Verifying

```bash
npm run test:desktop                          # against the working tree
npm run desktop:pack && \
  PORTVISION_PACKAGED=1 npm run test:desktop  # against the packaged build
```

The second run is the one that exercises the packaging itself: the asar layout,
`server/` unpacked so it can be forked, and dependency resolution from inside
the archive. On a headless machine prefix either with `xvfb-run -a`.

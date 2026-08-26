# PORTVISION 3D — mobile builds (iOS / Android)

Version 2.9 · Capacitor 8

The iOS and Android apps are the **same `www/` folder** the browser, the PWA and
the Electron desktop build all load. There is no second implementation and no
build step: Capacitor wraps the folder in a native web view.

```
www/            ← one source of truth
 ├── browser / GitHub Pages
 ├── PWA          (installable, offline — www/sw.js)
 ├── desktop/     (Electron, hosts server.js as a child process)
 └── capacitor    (android/ and ios/, this document)
```

---

## Prerequisites

| Target | Needs |
|---|---|
| Android | Android Studio (SDK 24+), JDK 21 |
| iOS | macOS, Xcode 16+, CocoaPods, an Apple Developer account |

Neither SDK is required to work on the web layer, and neither is available in
CI — see *What is and is not verified* below.

---

## Build

```bash
npm install
npx cap sync            # copies www/ into both native projects, installs plugins
npm run mobile:android  # opens Android Studio
npm run mobile:ios      # opens Xcode
```

`cap sync` must be re-run after **every** change to `www/`. The native projects
carry a *copy*, not a reference; forgetting this ships the previous build's UI.
`android/app/src/main/assets/public/` and `ios/App/App/public/` are gitignored
for exactly that reason — they are output, not source.

Icons and splash screens are generated from one vector definition:

```bash
npm run icons           # tools/make-icons.js → assets/ and www/icons/
npm run mobile:assets   # assets/ → every Android density and iOS idiom
```

> `@capacitor/assets` also writes a `www/manifest.json` and a root `icons/`
> folder for PWAs. Both are **deleted deliberately** — its manifest labels the
> `.webp` icons as `image/png` and points outside `www/`. The hand-written
> `www/manifest.webmanifest` is the one `index.html` links. Delete them again if
> a future run recreates them.

---

## The server address is the thing that will catch you out

The app defaults to `http://localhost:4000`. On a handset **localhost is the
handset**, so a mobile build can never reach a PortVision server on that
default. It runs in Standalone mode and stores plans on the device.

A packaged build has no address bar and no developer tools, so the address is
set from inside the app: **tap the storage badge in the top bar** (`💾 Standalone`
/ `🗄 PostgreSQL`) and enter the server address. It is validated, stored per
device, and the app reconnects immediately.

### Cleartext HTTP is blocked, on both platforms, by design

Capacitor serves the app from `https://localhost` (Android) and
`capacitor://localhost` (iOS). Two separate mechanisms then block a plain-`http`
API — mixed-content blocking from the https origin, and each platform's own
cleartext policy. **Give the pilot server HTTPS and none of this applies.**

If a pilot genuinely must run against plain http on the terminal LAN:

- **Android** — uncomment the reference in `AndroidManifest.xml`:
  ```xml
  <application android:networkSecurityConfig="@xml/network_security_config" …>
  ```
  and name the host in `android/app/src/main/res/xml/network_security_config.xml`.
  Also set `"allowMixedContent": true` under `android` in `capacitor.config.json`,
  or the https origin blocks the request before Android sees it.
- **iOS** — add an `NSAppTransportSecurity` → `NSExceptionDomains` entry for that
  host in `ios/App/App/Info.plist`.

Scope both to the one host. Do **not** enable cleartext globally: the persistence
API carries no authentication (see below), so berthing plans would cross the
network readable and modifiable by anyone who can reach the port.

---

## Before you submit to either store

**Blocking — authentication.** The OTP is the hardcoded literal `'123456'`
compared in client-side JavaScript (`www/app.js`), the role is self-selected at
login, and the API has `cors()` open with no authentication on any endpoint.
This is fine for a prototype opened from a file. It is not something to publish
under the Adani name to a public app store, and App Store review routinely
rejects demo-credential builds. This is `docs/ROADMAP.md` step 3 and it is not a
packaging task — it has to be decided before a submission, not after.

Once that is resolved:

| | Android (Play) | iOS (App Store) |
|---|---|---|
| Signing | Upload key + Play App Signing | Distribution certificate + provisioning profile |
| Bundle | `.aab` via Build → Generate Signed Bundle | Archive → Distribute in Xcode |
| Version | `versionCode` / `versionName` in `android/app/build.gradle` | `CFBundleVersion` / `CFBundleShortVersionString` |
| Privacy | Data safety form | Privacy nutrition label |
| Min OS | `minSdkVersion` (currently 24) | `IPHONEOS_DEPLOYMENT_TARGET` |
| Screenshots | phone + 7"/10" tablet | 6.7" + 6.1" iPhone, 12.9" iPad |

Keep `appId` as `in.adaniports.portvision3d` — it matches the Electron build and
identifies the app in both stores permanently.

Both listings must answer *what data leaves the device*. Today: **none**, unless
a server address is configured, in which case vessel and voyage data goes to
that server and nowhere else. There is no analytics, no telemetry and no
third-party SDK in the build.

### Also worth settling before release

- **Orientation.** Unrestricted. The planning screen and the 3D twin are both
  better in landscape on a phone; the dashboard is better in portrait. Left free
  deliberately, but a decision here is cheap and worth making.
- **Tablet quality.** A coarse pointer starts the twin in the light graphics
  pipeline regardless of screen size, so a high-end tablet renders more
  conservatively than it could. The in-app Desktop/Mobile button overrides it.
- **`allowBackup`** is Android's default `true`, so plan data on the device is
  included in cloud backups. If berthing plans are commercially sensitive at
  rest, set it to `false`.

---

## What is and is not verified

`tests/test_mobile.js` runs in CI and covers the parts that are ours:

- both native payloads carry the whole app, **including the vendored Three.js**
  that makes the twin work offline
- cleartext stays disabled in the committed manifest and `Info.plist`
- a service worker left by an earlier build is unregistered and its caches
  cleared — on Android the app is served from a real https origin, so a
  precached shell would otherwise outlive an app update and serve the previous
  version's assets while the store believed the user was current
- the Android back button unwinds the UI (modal → drawer → dashboard) instead of
  quitting and discarding an unsaved plan
- the server-address dialog validates, stores and reconnects
- none of this leaks into the browser build

**Not verified here:** that the projects compile, that an `.aab` or `.ipa`
builds, signing, or store review. Those need the Android SDK and Xcode, neither
of which exists in CI. Treat a green CI run as "the web layer is correct for a
web view", not "the app builds".

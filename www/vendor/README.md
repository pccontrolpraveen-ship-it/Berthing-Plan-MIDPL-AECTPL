# Vendored third-party libraries

Files here are checked in deliberately. The application must load with **no
network access** — it runs on terminal machines and, once packaged (see
`docs/ROADMAP.md`), inside Capacitor and Electron WebViews whose default
Content-Security-Policy blocks remote `<script src>` entirely.

| File | Version | Source | License |
|---|---|---|---|
| `three.min.js` | r128 (npm `three@0.128.0`) | `npm pack three@0.128.0` → `package/build/three.min.js` | MIT |

`three.min.js` is the unmodified UMD build, byte-identical to the one previously
loaded from `cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`.

```
sha256  9274bbcec8d96168626c732b5d31c775aa8cfb7eaa0599bec0c175908a2c1ce2
```

To verify or refresh:

```bash
npm pack three@0.128.0
tar -xzf three-0.128.0.tgz package/build/three.min.js
sha256sum package/build/three.min.js
cp package/build/three.min.js www/vendor/three.min.js
```

Upgrading Three.js is not a drop-in change: `app.js` uses the r128 global
`THREE` API (`THREE.Geometry` removal, renderer colour-management and light
intensity changes all landed after r128). Re-run `node tests/test_app.js` and
check the 3D twin visually before accepting a newer build.

/* PORTVISION 3D — preload.
 *
 * Runs before the page scripts, in an isolated context that shares the page's
 * origin (and therefore its localStorage) but has no Node access.
 *
 * Its only job is to point the app at the bundled persistence API. app.js reads
 * the override key `pv_api` on startup and falls back to http://localhost:4000
 * when it is absent — which is right for a developer running the server by
 * hand, but wrong for a packaged desktop app whose API listens on an
 * OS-assigned port. The port arrives through additionalArguments because a
 * sandboxed preload has no other channel available this early.
 *
 * Nothing is exposed to the page: no contextBridge surface, no ipcRenderer. The
 * renderer stays exactly as privileged as it is in a browser tab.
 */
const API_FLAG = '--portvision-api=';

try {
  const arg = process.argv.find(a => a.startsWith(API_FLAG));
  const api = arg ? arg.slice(API_FLAG.length) : '';

  if (api) {
    window.localStorage.setItem('pv_api', api);
  } else {
    /* No backend this run. Clear any value a previous run left behind, so the
       app probes nothing, fails fast and honestly reports Standalone rather
       than hanging on a port that is no longer listening. */
    window.localStorage.removeItem('pv_api');
  }
} catch (e) {
  /* Storage can be unavailable; the app already handles that and degrades to
     Standalone on its own. */
  console.warn('PORTVISION preload: could not set the API override —', e.message);
}

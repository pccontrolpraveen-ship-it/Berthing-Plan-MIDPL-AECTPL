/* PORTVISION 3D — service worker.
 *
 * Purpose: make the application launch with no network. Everything the browser
 * needs is precached on install, so a planner on the quay with no signal still
 * gets the full app — Three.js included, since it is vendored in www/vendor/.
 *
 * THE API IS NEVER TOUCHED. Requests to the persistence API must always reach
 * the network, unintercepted: the app decides between "🗄 PostgreSQL" and
 * "💾 Standalone" from a live /api/health probe, so a cached or synthesised
 * response here would make the top-bar badge lie about where data is stored —
 * exactly the dishonesty the persistence layer was written to avoid.
 *
 * Updates: a new VERSION installs in the background and takes over on the next
 * launch, once every tab of the app is closed. It deliberately does NOT call
 * skipWaiting() or force a reload — the planning screen holds unsaved work
 * behind a dirty-state guard, and pulling the page out from under a planner
 * mid-edit would discard it. pwa.js notices the waiting worker and offers.
 */
const VERSION = 'portvision-2.5.0';
const SHELL = 'shell-' + VERSION;

/* Everything required to boot offline. Relative so the app works from any
   base path — GitHub Pages serves it under /<repo>/, a wrapper from the root. */
const SHELL_FILES = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './vendor/three.min.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon-180.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(SHELL).then(cache => cache.addAll(SHELL_FILES))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== SHELL).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Let the page ask a waiting worker to take over — only ever in response to a
   user accepting the update prompt raised by pwa.js. */
self.addEventListener('message', event => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});

const isApiRequest = url => url.pathname.includes('/api/');

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  /* Cross-origin (the API on another host, anything else) and any /api/ path:
     do not call respondWith at all, so the browser handles it normally. */
  if (url.origin !== self.location.origin || isApiRequest(url)) return;

  /* Navigations: prefer the network so a deployed update is picked up as soon
     as it exists, but fall back to the cached shell when offline. */
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(SHELL).then(c => c.put('./index.html', copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match('./index.html', { ignoreSearch: true })
          .then(hit => hit || caches.match('./')))
    );
    return;
  }

  /* Static assets: cache first — they are versioned by VERSION, so a stale hit
     is impossible without a new worker having been installed. */
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => {
      if (hit) return hit;
      return fetch(req).then(res => {
        if (res && res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(SHELL).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      });
    })
  );
});

/* PORTVISION 3D — progressive web app registration.
 *
 * Kept out of index.html as a separate file rather than an inline <script>:
 * the Capacitor and Electron packaging in docs/ROADMAP.md runs under a
 * Content-Security-Policy that blocks inline script.
 *
 * Registration is skipped silently when it cannot work — opening
 * www/index.html straight from disk (file://), or any browser without service
 * worker support. The app is fully functional either way; the worker only adds
 * offline launch and installability.
 */
(function () {
  if (location.protocol === 'file:') return;          // opened from disk
  if (!('serviceWorker' in navigator)) return;        // unsupported browser

  /* Inside a Capacitor build the worker is not just redundant, it is harmful.
     Android serves the app from https://localhost, so registration succeeds —
     and the precached shell then outlives an app update, serving the previous
     version's assets from cache while the store believes the user is updated.
     The assets are already on the device; there is nothing to cache. Any worker
     left by an earlier build is torn down along with its caches. */
  var cap = window.Capacitor;
  if (cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform()) {
    navigator.serviceWorker.getRegistrations().then(function (regs) {
      regs.forEach(function (r) { r.unregister(); });
      if (window.caches && caches.keys) {
        caches.keys().then(function (keys) { keys.forEach(function (k) { caches.delete(k); }); });
      }
    }).catch(function () { /* nothing registered — nothing to undo */ });
    return;
  }

  /* An update is ready but deliberately not applied: the planning screen can
     hold unsaved work, so the planner decides when to reload. */
  function offerUpdate(worker) {
    if (document.querySelector('.pwaUpdate')) return;
    var bar = document.createElement('div');
    bar.className = 'pwaUpdate';
    bar.innerHTML = '<span>A new version of PORTVISION is ready.</span>';

    var reload = document.createElement('button');
    reload.textContent = 'Reload now';
    reload.onclick = function () {
      var reloading = false;
      navigator.serviceWorker.addEventListener('controllerchange', function () {
        if (reloading) return;
        reloading = true;
        location.reload();
      });
      worker.postMessage('skip-waiting');
    };

    var later = document.createElement('button');
    later.className = 'ghost';
    later.textContent = 'Later';
    later.onclick = function () { bar.remove(); };

    bar.appendChild(reload);
    bar.appendChild(later);
    document.body.appendChild(bar);
  }

  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js', { scope: './' }).then(function (reg) {
      if (reg.waiting && navigator.serviceWorker.controller) offerUpdate(reg.waiting);

      reg.addEventListener('updatefound', function () {
        var incoming = reg.installing;
        if (!incoming) return;
        incoming.addEventListener('statechange', function () {
          /* "installed" with a controller already present means this is an
             update, not the very first install — only then is there anything
             for the user to decide about. */
          if (incoming.state === 'installed' && navigator.serviceWorker.controller) {
            offerUpdate(incoming);
          }
        });
      });
    }).catch(function (e) {
      /* Never fatal: registration failing just means no offline launch. */
      if (window.console) console.warn('PORTVISION: service worker not registered —', e.message);
    });
  });
})();

/* PORTVISION 3D — Electron main process.
 *
 * Packages the same www/ folder the browser and the mobile wrapper use. Nothing
 * here is desktop-specific application logic; this file only provides the
 * window, the local origin the app is served from, and the optional backend.
 *
 * Why a local HTTP origin rather than loadFile():
 *   file:// is an opaque origin. Service workers are unavailable there, and
 *   cross-origin fetches to the persistence API behave differently from every
 *   other environment this app runs in. Serving www/ over 127.0.0.1 means the
 *   desktop build behaves exactly like the deployed web app and the PWA, so
 *   there is one less environment to reason about — and one less place for a
 *   bug to hide that no other build would show.
 *
 * The backend is started only when a DATABASE_URL is actually configured. With
 * no database the app runs in Standalone mode and says so in the top bar, which
 * is the same honest fallback as the web build — never a faked database.
 */
const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { fork } = require('child_process');

/* main.js sits in desktop/ both in the repository and inside the asar, so the
   project root is one level up in either case and no isPackaged branch is
   needed — the packaged layout is deliberately identical to the checkout. */
const ROOT = path.join(__dirname, '..');
const WWW_DIR = path.join(ROOT, 'www');

/* fork() cannot execute a script from inside an asar archive, which is why
   server/** is listed under asarUnpack in package.json. */
const SERVER_ENTRY = path.join(ROOT, 'server', 'server.js').replace(
  `app.asar${path.sep}`, `app.asar.unpacked${path.sep}`);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon',
};

let mainWindow = null;
let staticServer = null;
let backend = null;
let backendPort = null;

/* ---------- settings ---------- */
/* A plain JSON file in the OS application-data folder. The database URL is a
   deployment detail, not something to hard-code into a build. */
const configPath = () => path.join(app.getPath('userData'), 'config.json');

function readConfig() {
  try { return JSON.parse(fs.readFileSync(configPath(), 'utf8')); }
  catch (e) { return {}; }
}

function databaseUrl() {
  return process.env.DATABASE_URL || readConfig().databaseUrl || null;
}

/* ---------- static origin for www/ ---------- */
function startStaticServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let pathname;
      try { pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname); }
      catch (e) { res.writeHead(400); return res.end('bad request'); }

      const rel = pathname === '/' ? '/index.html' : pathname;
      /* Resolve, then confirm the result is still inside www/ — a path such as
         /../../etc/passwd must not escape the served root. */
      const file = path.resolve(WWW_DIR, '.' + rel);
      if (file !== WWW_DIR && !file.startsWith(WWW_DIR + path.sep)) {
        res.writeHead(403); return res.end('forbidden');
      }
      fs.readFile(file, (err, buf) => {
        if (err) { res.writeHead(404); return res.end('not found'); }
        res.writeHead(200, {
          'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
          'Cache-Control': 'no-cache',
        });
        res.end(buf);
      });
    });
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

/* ---------- optional persistence API ---------- */
/* Run out-of-process on purpose: server.js installs no 'error' handler on its
   connection pool, so a dropped PostgreSQL connection raises an unhandled error
   event. In-process that would take the whole application down with it; as a
   child it costs one restartable process and the UI reports the failure. */
function startBackend() {
  const url = databaseUrl();
  if (!url) return Promise.resolve(null);
  if (!fs.existsSync(SERVER_ENTRY)) {
    console.warn('PORTVISION: server entry not found at', SERVER_ENTRY);
    return Promise.resolve(null);
  }

  return new Promise(resolve => {
    /* Port 0 lets the OS choose, so a desktop install never collides with a
       server the operator is already running on 4000. */
    const child = fork(SERVER_ENTRY, [], {
      /* HOST pins the API to loopback: it has no authentication, and in a
         desktop install it is a private component of this one machine.
         NODE_PATH is required because server/ and node_modules/ are siblings
         rather than nested, so ordinary upward resolution from server.js never
         reaches express — true both in development (desktop/node_modules) and
         inside the packaged asar. */
      env: {
        ...process.env,
        DATABASE_URL: url,
        PORT: '0',
        HOST: '127.0.0.1',
        NODE_PATH: path.join(ROOT, 'node_modules'),
      },
      stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
    });

    let settled = false;
    const done = port => { if (!settled) { settled = true; resolve(port); } };

    /* server.js reports its address by logging the listening URL. */
    child.stdout.on('data', chunk => {
      const line = chunk.toString();
      process.stdout.write('[server] ' + line);
      const m = line.match(/http:\/\/[^:]+:(\d+)/);
      if (m) { backendPort = Number(m[1]); done(backendPort); }
    });
    child.stderr.on('data', c => process.stderr.write('[server] ' + c.toString()));
    child.on('exit', code => {
      console.warn('PORTVISION: persistence API exited with code', code);
      backend = null; backendPort = null; done(null);
    });

    backend = child;
    setTimeout(() => done(backendPort), 8000);   // never block startup on it
  });
}

function stopBackend() {
  if (backend) { backend.kill(); backend = null; backendPort = null; }
}

/* ---------- window ---------- */
function createWindow(appOrigin) {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 960,
    minHeight: 620,
    backgroundColor: '#14243F',          // matches the app's splash, so no white flash
    show: false,
    title: 'PORTVISION 3D',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      /* The renderer is the same untrusted-by-default web app that runs in a
         browser tab; it is given no Node access and no direct IPC surface
         beyond what preload.js exposes. */
      additionalArguments: [
        '--portvision-api=' + (backendPort ? `http://127.0.0.1:${backendPort}` : ''),
      ],
    },
  });

  win.once('ready-to-show', () => win.show());
  win.loadURL(appOrigin);

  /* Anything that is not this app opens in the operator's real browser rather
     than in a chromeless Electron window. */
  const external = url => { shell.openExternal(url); return { action: 'deny' }; };
  win.webContents.setWindowOpenHandler(({ url }) => external(url));
  win.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith(appOrigin)) { event.preventDefault(); shell.openExternal(url); }
  });

  win.on('closed', () => { mainWindow = null; });
  return win;
}

/* ---------- menu ---------- */
function buildMenu() {
  const isMac = process.platform === 'darwin';
  const template = [
    ...(isMac ? [{ role: 'appMenu' }] : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'Open App Data Folder…',
          click: () => {
            fs.mkdirSync(app.getPath('userData'), { recursive: true });
            if (!fs.existsSync(configPath())) {
              fs.writeFileSync(configPath(), JSON.stringify({ databaseUrl: '' }, null, 2));
            }
            shell.showItemInFolder(configPath());
          },
        },
        {
          label: 'Storage Mode…',
          click: () => {
            const url = databaseUrl();
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Storage mode',
              message: url
                ? (backendPort
                  ? 'PostgreSQL — the bundled persistence API is running.'
                  : 'A database URL is configured, but the persistence API is not running.')
                : 'Standalone — data is stored in this application only.',
              detail: url
                ? `Persistence API: ${backendPort ? 'http://127.0.0.1:' + backendPort : 'not running'}\n` +
                  'Database URL is set. Check the application log if the top-bar badge still reads Standalone.'
                : 'Set "databaseUrl" in config.json (File → Open App Data Folder…) or the ' +
                  'DATABASE_URL environment variable, then restart, to store plans in PostgreSQL.',
              buttons: ['OK'],
            });
          },
        },
        isMac ? { role: 'close' } : { role: 'quit' },
      ],
    },
    { role: 'editMenu' },
    {
      label: 'View',
      submenu: [
        { role: 'reload' }, { role: 'forceReload' }, { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    { role: 'windowMenu' },
    {
      role: 'help',
      submenu: [{
        label: 'About PORTVISION 3D',
        click: () => dialog.showMessageBox(mainWindow, {
          type: 'info',
          title: 'About PORTVISION 3D',
          message: 'PORTVISION 3D',
          detail: `Version ${app.getVersion()}\nMIDPL Kattupalli · AECTPL Ennore\nElectron ${process.versions.electron} · Chromium ${process.versions.chrome}`,
          buttons: ['OK'],
        }),
      }],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

/* ---------- lifecycle ---------- */
/* Binding a port and owning a child process both make a second copy harmful. */
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) { if (mainWindow.isMinimized()) mainWindow.restore(); mainWindow.focus(); }
  });

  app.whenReady().then(async () => {
    await startBackend();                       // resolves to null when unconfigured
    staticServer = await startStaticServer();
    const origin = `http://127.0.0.1:${staticServer.address().port}`;
    buildMenu();
    mainWindow = createWindow(origin);

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) mainWindow = createWindow(origin);
    });
  }).catch(err => {
    dialog.showErrorBox('PORTVISION 3D failed to start', String(err && err.stack || err));
    app.quit();
  });

  app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
  app.on('before-quit', stopBackend);
  app.on('will-quit', () => { if (staticServer) staticServer.close(); });
}

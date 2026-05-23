(() => {
  // ===========================================================================
  // PALABRA VIVA — Sync de favoritos / progreso con la cuenta del usuario
  // ===========================================================================
  // Cuando el usuario está logueado:
  // · Al iniciar sesión: trae los datos del server y los mergea con locales.
  // · Cuando el cliente cambia algo (pv-saved, pv-progress, pv-start-done):
  //   debounce + envío al server via RPC sync_app_data (Supabase).
  // · Si no hay sesión: trabaja solo con localStorage.

  const SUPA_URL = 'https://fuxojzmwyyecefxczfrn.supabase.co';
  const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1eG9qem13eXllY2VmeGN6ZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTU4MDAsImV4cCI6MjA5NTAzMTgwMH0.M4telJzC3kt7fNN86kvuqpL5-vVmCjdzE-hTDy6Igak';

  const KEYS = {
    saved:    'pv-saved',
    progress: 'pv-progress',
    start:    'pv-start-done'
  };

  let lastLocalSnapshot = null;
  let syncTimer = null;
  const DEBOUNCE_MS = 1800;

  function lsGet(k, fb) {
    try { return JSON.parse(localStorage.getItem(k) || JSON.stringify(fb)); }
    catch { return fb; }
  }
  function lsSet(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
  }

  function readLocal() {
    return {
      saved:    lsGet(KEYS.saved,    []),
      progress: lsGet(KEYS.progress, {}),
      start:    lsGet(KEYS.start,    [])
    };
  }

  function writeLocal(data) {
    if (Array.isArray(data?.saved))   lsSet(KEYS.saved, data.saved);
    if (data?.progress && typeof data.progress === 'object') lsSet(KEYS.progress, data.progress);
    if (Array.isArray(data?.start))   lsSet(KEYS.start, data.start);
  }

  function snapshot() {
    return JSON.stringify(readLocal());
  }

  function getToken() {
    return window.PVAuth?.getToken?.() || '';
  }

  // ── RPC: subir datos al server y traer merge resultante ────────────────────
  async function syncToServer(clientData) {
    const token = getToken();
    if (!token) return null;
    try {
      const res = await fetch(`${SUPA_URL}/rest/v1/rpc/sync_app_data`, {
        method: 'POST',
        headers: {
          'apikey': SUPA_KEY,
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ client_data: clientData })
      });
      if (!res.ok) return null;
      const data = await res.json();
      // Si el server devolvió algo distinto a lo local → actualizar local
      if (data && typeof data === 'object') {
        writeLocal(data);
        lastLocalSnapshot = snapshot();
      }
      return data;
    } catch { return null; }
  }

  // ── Pull inicial al loguear: trae del server y mergea con local ────────────
  async function pullOnLogin() {
    const token = getToken();
    if (!token) return;
    // Estrategia: enviar lo local. El server hace el merge (en sync_app_data
    // hicimos COALESCE — el client gana si manda data). Para una primera
    // versión, eso alcanza. Mejora futura: comparar timestamps por campo.
    const local = readLocal();
    await syncToServer(local);
  }

  // ── Debounce: cuando algo cambia, programa un envío en 1.8s ────────────────
  function scheduleSync() {
    if (!getToken()) return;
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(async () => {
      const cur = snapshot();
      if (cur === lastLocalSnapshot) return;
      const local = readLocal();
      const r = await syncToServer(local);
      if (r) lastLocalSnapshot = snapshot();
    }, DEBOUNCE_MS);
  }

  // ── Detector de cambios: polleo del localStorage (la app no emite eventos) ──
  function watcher() {
    const cur = snapshot();
    if (lastLocalSnapshot === null) {
      lastLocalSnapshot = cur;
      return;
    }
    if (cur !== lastLocalSnapshot) {
      lastLocalSnapshot = cur;
      scheduleSync();
    }
  }

  // ── Reacciona a login/logout ──────────────────────────────────────────────
  document.addEventListener('pv-auth-change', (ev) => {
    const session = ev.detail;
    if (session) {
      pullOnLogin();
    } else {
      // Logout: no borramos local, pero paramos sync.
      if (syncTimer) { clearTimeout(syncTimer); syncTimer = null; }
    }
  });

  // ── También al cargar la app, si ya hay sesión, pullear ───────────────────
  function bootSync() {
    if (window.PVAuth?.getSession?.()) {
      pullOnLogin();
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootSync);
  else setTimeout(bootSync, 500);

  // Watcher cada 2 segundos (menos overhead que 700-1000ms)
  setInterval(watcher, 2000);

  // ── También sync al cerrar pestaña/ventana ────────────────────────────────
  window.addEventListener('beforeunload', () => {
    if (!getToken()) return;
    const cur = snapshot();
    if (cur === lastLocalSnapshot) return;
    // sendBeacon es asíncrono pero garantiza envío al cerrar
    try {
      const local = readLocal();
      const blob = new Blob([JSON.stringify({ client_data: local })], { type: 'application/json' });
      // sendBeacon no soporta headers custom → no podemos enviar el JWT.
      // Si hace falta, fallback: synchronous fetch keepalive.
      fetch(`${SUPA_URL}/rest/v1/rpc/sync_app_data`, {
        method: 'POST',
        keepalive: true,
        headers: {
          'apikey': SUPA_KEY,
          'Authorization': 'Bearer ' + getToken(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ client_data: local })
      }).catch(() => {});
    } catch {}
  });

  // API pública para uso manual
  window.PVSync = {
    syncNow: scheduleSync,
    pull:    pullOnLogin,
    isOn:    () => !!getToken()
  };
})();

(() => {
  // ===========================================================================
  // PALABRA VIVA — Reporter de errores del cliente
  // ===========================================================================
  // Captura window.onerror y unhandledrejection y los reporta a la RPC
  // report_app_error (Supabase) para que la admin los vea en su panel.
  // Tiene rate-limiting local: máximo 1 reporte del mismo fingerprint cada
  // 5 minutos, para no inundar la red ni el server si algo falla en loop.

  const SUPA_URL = 'https://fuxojzmwyyecefxczfrn.supabase.co';
  const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1eG9qem13eXllY2VmeGN6ZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTU4MDAsImV4cCI6MjA5NTAzMTgwMH0.M4telJzC3kt7fNN86kvuqpL5-vVmCjdzE-hTDy6Igak';
  const APP_VERSION = 'pv-' + new Date().toISOString().slice(0, 10);

  // Rate limiting local por fingerprint
  const seen = new Map();
  const RATE_MS = 5 * 60 * 1000; // 5 min

  function fingerprint(source, message) {
    return (source || 'unknown') + '|' + (message || '').slice(0, 120);
  }

  async function report(level, source, message, stack = '', context = {}) {
    try {
      if (!message) return;
      const fp = fingerprint(source, message);
      const now = Date.now();
      const last = seen.get(fp) || 0;
      if (now - last < RATE_MS) return; // ya reportado hace poco
      seen.set(fp, now);

      // No reportar errores típicos del SW que ya manejamos solos
      if (/Failed to fetch|NetworkError|Load failed|aborted/i.test(message) && level !== 'critical') {
        return;
      }

      await fetch(`${SUPA_URL}/rest/v1/rpc/report_app_error`, {
        method: 'POST',
        headers: {
          'apikey': SUPA_KEY,
          'Authorization': 'Bearer ' + SUPA_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          p_level: level,
          p_source: source || 'window',
          p_message: String(message).slice(0, 1000),
          p_stack: String(stack || '').slice(0, 5000),
          p_url: location.href.slice(0, 500),
          p_user_agent: navigator.userAgent.slice(0, 300),
          p_app_version: APP_VERSION,
          p_context: context || {}
        }),
        keepalive: true // sobrevive si la página se cierra al toque
      });
    } catch (e) {
      // No reportes errores que ocurren al reportar errores — loop infinito
      console.warn('[ErrorReporter] no se pudo reportar:', e);
    }
  }

  // Capturar errores JS globales
  window.addEventListener('error', (event) => {
    if (!event) return;
    const msg = event.message || (event.error && event.error.message) || 'unknown';
    const stack = (event.error && event.error.stack) || '';
    const source = event.filename ? event.filename.split('/').pop() : 'window';
    report('error', source, msg, stack, {
      lineno: event.lineno,
      colno: event.colno
    });
  });

  // Capturar promesas rechazadas sin handler
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = (reason && reason.message) || String(reason || 'unhandled-promise');
    const stack = (reason && reason.stack) || '';
    report('error', 'promise', msg, stack);
  });

  // API pública para que otros módulos reporten errores manualmente
  window.PVReport = {
    error:   (source, msg, stack, ctx) => report('error',   source, msg, stack, ctx),
    warn:    (source, msg, stack, ctx) => report('warning', source, msg, stack, ctx),
    info:    (source, msg, stack, ctx) => report('info',    source, msg, stack, ctx),
    crit:    (source, msg, stack, ctx) => report('critical',source, msg, stack, ctx)
  };
})();

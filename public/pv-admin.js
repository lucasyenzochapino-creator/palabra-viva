(() => {
  // ── Palabra Viva — Panel de administración ────────────────────────────────
  // Solo accesible para usuarios con role='admin' en la tabla profiles
  const SUPA_URL = 'https://fuxojzmwyyecefxczfrn.supabase.co';
  const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1eG9qem13eXllY2VmeGN6ZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTU4MDAsImV4cCI6MjA5NTAzMTgwMH0.M4telJzC3kt7fNN86kvuqpL5-vVmCjdzE-hTDy6Igak';

  const $ = (s, r = document) => r.querySelector(s);

  // ── Fetch autenticado con retry si JWT expiró ────────────────────────────
  function getToken() { return window.PVAuth?.getToken?.() || ''; }

  async function supa(path, opts = {}) {
    // Si el token está expirado, intentar refrescar antes de la query.
    if (window.PVAuth?.isTokenExpired?.()) {
      try { await window.PVAuth?.refreshSession?.(); } catch {}
    }
    const doFetch = async () => {
      const token = getToken();
      const headers = {
        'apikey': SUPA_KEY,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(opts.headers || {})
      };
      const res = await fetch(`${SUPA_URL}${path}`, { ...opts, headers });
      const data = await res.json().catch(() => ({}));
      return { ok: res.ok, status: res.status, data };
    };
    let result = await doFetch();
    // Si recibió 401 y el motivo es JWT expirado, refrescar y reintentar UNA vez
    if (!result.ok && result.status === 401) {
      const errMsg = (result.data?.message || result.data?.msg || '').toLowerCase();
      if (errMsg.includes('jwt') || errMsg.includes('expired') || result.data?.code === 'PGRST303') {
        console.warn('[Admin] JWT expirado, refrescando y reintentando…');
        const refreshed = await window.PVAuth?.refreshSession?.();
        if (refreshed) result = await doFetch();
      }
    }
    return result;
  }

  // ── Estilos ────────────────────────────────────────────────────────────────
  function injectStyles() {
    if ($('#pv-admin-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-admin-style';
    st.textContent = `
      .pv-adm-panel{position:fixed;inset:0;z-index:9200;background:var(--bg,#09090f);overflow-y:auto;padding:14px 14px calc(80px + env(safe-area-inset-bottom))}
      .pv-adm-inner{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:16px}
      .pv-adm-head{display:flex;justify-content:space-between;align-items:center;gap:12px;position:sticky;top:0;background:var(--bg,#09090f);z-index:2;padding:10px 0 14px;border-bottom:1px solid var(--line,#333447)}
      .pv-adm-head h1{margin:0;font-size:24px;letter-spacing:-.03em}
      .pv-adm-close{border:1px solid var(--line,#333447);background:var(--card2,#202031);color:var(--text,#f8fafc);border-radius:999px;padding:9px 16px;font-weight:900;cursor:pointer}
      .pv-adm-section{border:1px solid var(--line,#333447);background:var(--card,#171722);border-radius:22px;padding:16px}
      .pv-adm-section h2{margin:0 0 14px;font-size:19px;letter-spacing:-.02em}
      .pv-adm-stat{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
      .pv-adm-stat-box{background:var(--card2,#202031);border-radius:16px;padding:14px;text-align:center}
      .pv-adm-stat-n{font-size:30px;font-weight:900;line-height:1}
      .pv-adm-stat-l{font-size:12px;color:var(--muted,#c8c5d8);margin-top:4px}
      .pv-adm-table{width:100%;border-collapse:collapse;font-size:14px}
      .pv-adm-table th{text-align:left;font-size:12px;color:var(--muted,#c8c5d8);text-transform:uppercase;letter-spacing:.06em;padding:6px 8px;border-bottom:1px solid var(--line,#333447)}
      .pv-adm-table td{padding:10px 8px;border-bottom:1px solid var(--line,#333447);vertical-align:middle}
      .pv-adm-table tr:last-child td{border-bottom:0}
      .pv-adm-badge{display:inline-block;font-size:11px;font-weight:900;padding:3px 8px;border-radius:999px}
      .pv-adm-badge.admin{background:linear-gradient(135deg,#f59e0b,#ec4899);color:#fff}
      .pv-adm-badge.user{background:var(--card2,#202031);color:var(--muted,#c8c5d8)}
      .pv-adm-badge.premium{background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff}
      .pv-adm-btn-sm{border:1px solid var(--line,#333447);background:var(--card2,#202031);color:var(--text,#f8fafc);border-radius:999px;padding:5px 12px;font-size:12px;font-weight:900;cursor:pointer;white-space:nowrap}
      .pv-adm-btn-sm.danger{border-color:rgba(251,113,133,.4);color:#fb7185;background:rgba(251,113,133,.08)}
      .pv-adm-spin{text-align:center;color:var(--muted,#c8c5d8);padding:22px}
      .pv-adm-empty{text-align:center;color:var(--muted,#c8c5d8);padding:20px;font-size:14px}
      @media(max-width:440px){.pv-adm-stat{grid-template-columns:1fr 1fr}.pv-adm-table th:nth-child(3),.pv-adm-table td:nth-child(3){display:none}}
    `;
    document.head.appendChild(st);
  }

  // ── Panel ──────────────────────────────────────────────────────────────────
  let panel = null;

  async function openPanel() {
    if (!window.PVAuth?.isAdmin?.()) {
      alert('Acceso restringido — solo administradoras.');
      return;
    }
    injectStyles();
    if (panel) { panel.remove(); panel = null; }

    panel = document.createElement('section');
    panel.className = 'pv-adm-panel';
    panel.setAttribute('aria-label', 'Panel de administración');
    panel.innerHTML = `
      <div class="pv-adm-inner">
        <div class="pv-adm-head">
          <h1>⚙️ Panel Admin</h1>
          <button class="pv-adm-close" id="pv-adm-close">Cerrar ✕</button>
        </div>
        <div class="pv-adm-section" id="pv-adm-resumen">
          <h2>📊 Resumen</h2>
          <div class="pv-adm-spin">⏳ Cargando…</div>
        </div>
        <div class="pv-adm-section" id="pv-adm-salud">
          <h2>📡 Salud del sistema</h2>
          <div class="pv-adm-spin">⏳ Cargando…</div>
        </div>
        <div class="pv-adm-section" id="pv-adm-errores">
          <h2>🚨 Errores recientes</h2>
          <div class="pv-adm-spin">⏳ Cargando…</div>
        </div>
        <div class="pv-adm-section" id="pv-adm-usuarios">
          <h2>👥 Usuarios</h2>
          <div class="pv-adm-spin">⏳ Cargando…</div>
        </div>
        <div class="pv-adm-section" id="pv-adm-donaciones">
          <h2>💛 Donaciones</h2>
          <div class="pv-adm-spin">⏳ Cargando…</div>
        </div>
        <div class="pv-adm-section" id="pv-adm-sugerencias">
          <h2>💌 Sugerencias</h2>
          <div class="pv-adm-spin">⏳ Cargando…</div>
        </div>
        <div class="pv-adm-section" id="pv-adm-churches">
          <h2>⛪ Iglesias propuestas</h2>
          <div class="pv-adm-spin">⏳ Cargando…</div>
        </div>
        <div class="pv-adm-section" id="pv-adm-prayers">
          <h2>🙏 Peticiones de oración</h2>
          <div class="pv-adm-spin">⏳ Cargando…</div>
        </div>
      </div>`;

    document.body.appendChild(panel);
    history.pushState({ pvAdmin: true }, '', location.href.split('#')[0] + '#admin');

    function closePanel(withHistory = true) {
      window.removeEventListener('popstate', onPop);
      panel?.remove(); panel = null;
      if (withHistory && location.hash === '#admin') { window._pvPanelClosing = true; history.back(); }
    }
    function onPop() { window.removeEventListener('popstate', onPop); if (panel) { panel.remove(); panel = null; } }
    window.addEventListener('popstate', onPop);
    $('#pv-adm-close', panel).addEventListener('click', () => closePanel(true));

    await loadData();
  }

  async function loadData() {
    if (!panel) return;

    // 1) PRINCIPAL: cargar TODO el dashboard en una sola llamada via RPC
    // SECURITY DEFINER. Bypassea problemas de RLS y permisos.
    const { ok: dashOk, data: dashData, status: dashStatus } = await supa('/rest/v1/rpc/admin_get_dashboard', {
      method: 'POST', body: '{}'
    });
    if (!dashOk || !dashData || typeof dashData !== 'object') {
      console.error('[Admin] dashboard falló:', dashStatus, dashData);
      // Mostrar error claro en cada sección en lugar de queda en "Cargando…" infinito
      const errMsg = dashData?.message || dashData?.error || ('HTTP ' + dashStatus);
      ['pv-adm-resumen','pv-adm-salud','pv-adm-errores','pv-adm-usuarios','pv-adm-donaciones','pv-adm-sugerencias','pv-adm-churches','pv-adm-prayers'].forEach(id => {
        const el = $('#' + id, panel);
        if (el) el.innerHTML = `<h2>${el.querySelector('h2')?.textContent || id}</h2>
          <div class="pv-adm-empty" style="color:#fb7185">
            ⚠️ No se pudo cargar.<br>
            <small style="font-size:12px">Detalle: ${errMsg}</small><br>
            <button onclick="location.reload()" style="margin-top:10px;background:var(--brand,#f59e0b);color:#fff;border:0;border-radius:999px;padding:8px 16px;cursor:pointer;font-weight:700">🔄 Recargar app</button>
          </div>`;
      });
      return;
    }

    const users       = Array.isArray(dashData.users)       ? dashData.users       : [];
    const donations   = Array.isArray(dashData.donations)   ? dashData.donations   : [];
    const errors      = Array.isArray(dashData.errors)      ? dashData.errors      : [];
    const prayers     = Array.isArray(dashData.prayers)     ? dashData.prayers     : [];
    const suggestions = Array.isArray(dashData.suggestions) ? dashData.suggestions : [];
    const churches    = Array.isArray(dashData.churches)    ? dashData.churches    : [];
    const pushSubs    = Array.isArray(dashData.push_subs)   ? dashData.push_subs   : [];
    const stats       = dashData.stats || {};

    if (!panel) return;

    // ── Resumen ──
    const resEl = $('#pv-adm-resumen', panel);
    const admins = users.filter(u => u.role === 'admin').length;
    const prems  = users.filter(u => u.is_premium).length;
    resEl.innerHTML = `
      <h2>📊 Resumen</h2>
      <div class="pv-adm-stat">
        <div class="pv-adm-stat-box">
          <div class="pv-adm-stat-n">${users.length}</div>
          <div class="pv-adm-stat-l">Usuarios</div>
        </div>
        <div class="pv-adm-stat-box">
          <div class="pv-adm-stat-n">${donations.length}</div>
          <div class="pv-adm-stat-l">Donaciones</div>
        </div>
        <div class="pv-adm-stat-box">
          <div class="pv-adm-stat-n">${prems}</div>
          <div class="pv-adm-stat-l">Premium</div>
        </div>
      </div>`;

    // ── Salud del sistema (push notifications) ──
    const saludEl = $('#pv-adm-salud', panel);
    try {
      const subs = pushSubs; // del dashboard RPC
      const psOk = true;
      if (!psOk || subs === null) {
        saludEl.innerHTML = `<h2>📡 Salud del sistema</h2>
          <div class="pv-adm-empty" style="color:#fb7185">
            ⚠️ No se pudo leer push_subscriptions.<br>
            <small>Verificá las policies RLS para role 'admin' en esa tabla.</small>
          </div>`;
      } else {
        const total = subs.length;
        const active = subs.filter(s => s.active !== false).length;
        const now = Date.now();
        const last24h = subs.filter(s => s.last_sent_at && (now - new Date(s.last_sent_at).getTime()) < 24*60*60*1000).length;
        const lastSendTs = subs.reduce((mx, s) => {
          if (!s.last_sent_at) return mx;
          const t = new Date(s.last_sent_at).getTime();
          return t > mx ? t : mx;
        }, 0);
        const hoursSinceLast = lastSendTs ? Math.round((now - lastSendTs) / 3600000) : -1;
        const lastSendStr = lastSendTs ? new Date(lastSendTs).toLocaleString('es-AR') : 'nunca';

        // Alertas
        let alerts = '';
        if (total === 0) {
          alerts += `<div style="background:rgba(251,113,133,.12);border:1px solid rgba(251,113,133,.5);border-radius:14px;padding:12px;margin-top:10px;color:#fda4af">
            <strong>🚨 SIN SUSCRIPCIONES ACTIVAS</strong><br>
            <small>Ningún usuario va a recibir el versículo diario. Algo está roto en el flujo de suscripción.</small>
          </div>`;
        } else if (active === 0) {
          alerts += `<div style="background:rgba(251,113,133,.12);border:1px solid rgba(251,113,133,.5);border-radius:14px;padding:12px;margin-top:10px;color:#fda4af">
            <strong>⚠️ Todas las suscripciones están desactivadas</strong><br>
            <small>Hay ${total} suscripciones registradas pero ninguna activa.</small>
          </div>`;
        } else if (lastSendTs === 0 && total > 5) {
          alerts += `<div style="background:rgba(251,191,36,.12);border:1px solid rgba(251,191,36,.5);border-radius:14px;padding:12px;margin-top:10px;color:#fcd34d">
            <strong>⚠️ Nunca se enviaron notificaciones</strong><br>
            <small>Hay ${total} suscripciones pero ninguna recibió un push. Revisá la Edge Function 'send-daily-push' y el pg_cron.</small>
          </div>`;
        } else if (hoursSinceLast > 30) {
          alerts += `<div style="background:rgba(251,191,36,.12);border:1px solid rgba(251,191,36,.5);border-radius:14px;padding:12px;margin-top:10px;color:#fcd34d">
            <strong>⚠️ Hace ${hoursSinceLast}h que no se envía ningún push</strong><br>
            <small>Último envío: ${lastSendStr}. Esperado: cada usuario al menos 1 vez por día. Revisá Edge Function logs.</small>
          </div>`;
        } else {
          alerts += `<div style="background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.5);border-radius:14px;padding:12px;margin-top:10px;color:#86efac">
            <strong>✓ Sistema funcionando</strong><br>
            <small>Último envío: ${lastSendStr} (hace ${hoursSinceLast}h) · ${last24h} envíos en últimas 24h</small>
          </div>`;
        }

        saludEl.innerHTML = `<h2>📡 Salud del sistema</h2>
          <div class="pv-adm-stat">
            <div class="pv-adm-stat-box">
              <div class="pv-adm-stat-n" style="color:${total > 0 ? 'inherit' : '#fb7185'}">${total}</div>
              <div class="pv-adm-stat-l">Suscripciones</div>
            </div>
            <div class="pv-adm-stat-box">
              <div class="pv-adm-stat-n" style="color:${active > 0 ? '#86efac' : '#fb7185'}">${active}</div>
              <div class="pv-adm-stat-l">Activas</div>
            </div>
            <div class="pv-adm-stat-box">
              <div class="pv-adm-stat-n" style="color:${last24h > 0 ? '#86efac' : 'inherit'}">${last24h}</div>
              <div class="pv-adm-stat-l">Envíos 24h</div>
            </div>
          </div>
          ${alerts}
          <div style="margin-top:10px;font-size:11px;color:var(--muted,#c8c5d8);text-align:right">
            <a href="https://supabase.com/dashboard/project/fuxojzmwyyecefxczfrn/functions/send-daily-push/logs" target="_blank" rel="noopener noreferrer" style="color:var(--brand,#f59e0b)">Ver logs de la Edge Function ↗</a>
          </div>`;
      }
    } catch (e) {
      saludEl.innerHTML = `<h2>📡 Salud del sistema</h2>
        <div class="pv-adm-empty" style="color:#fb7185">⚠️ Error: ${e.message || e}</div>`;
    }

    // ── Errores recientes ──
    const errEl = $('#pv-adm-errores', panel);
    try {
      // errors viene del dashboard RPC arriba — no necesita nueva query
      if (!errors.length) {
        errEl.innerHTML = `<h2>🚨 Errores recientes</h2>
          <div class="pv-adm-empty" style="color:#86efac">✓ Sin errores reportados — todo limpio.</div>
          <div style="margin-top:10px;text-align:right">
            <button class="pv-adm-btn-sm" id="pv-adm-test-alert">📩 Enviar reporte de prueba al admin</button>
          </div>`;
      } else {
        const escapeHtml = s => (s || '').toString().replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
        const unresolved = errors.filter(e => !e.resolved).length;
        const criticalCount = errors.filter(e => e.level === 'critical' && !e.resolved).length;
        // Agrupar por message (primeros 80 chars) para ver el más frecuente
        const groups = {};
        errors.forEach(e => {
          const k = e.message?.slice(0,80) || 'unknown';
          if (!groups[k]) groups[k] = { count: 0, last: e, level: e.level, source: e.source };
          groups[k].count++;
          if (new Date(e.created_at) > new Date(groups[k].last.created_at)) groups[k].last = e;
        });
        const topGroups = Object.entries(groups).sort((a, b) => b[1].count - a[1].count).slice(0, 8);

        errEl.innerHTML = `<h2>🚨 Errores recientes <span style="font-size:13px;color:var(--muted,#c8c5d8);font-weight:400">(${errors.length}${unresolved ? ` · ${unresolved} sin resolver` : ''}${criticalCount ? ` · ${criticalCount} críticos` : ''})</span></h2>
          ${criticalCount > 0 ? `<div style="background:rgba(251,113,133,.12);border:1px solid rgba(251,113,133,.5);border-radius:14px;padding:12px;margin-bottom:12px;color:#fda4af">
            <strong>🚨 ${criticalCount} error(es) crítico(s)</strong> requieren atención urgente.
          </div>` : ''}
          <div style="margin-bottom:12px">
            <p style="font-size:13px;color:var(--muted,#c8c5d8);margin:0 0 6px">Top mensajes (agrupados):</p>
            <div style="display:flex;flex-direction:column;gap:6px">
              ${topGroups.map(([msg, info]) => {
                const color = info.level === 'critical' ? '#fb7185' : info.level === 'warning' ? '#fbbf24' : 'var(--muted,#c8c5d8)';
                return `<div style="background:var(--card2,#202031);border-radius:10px;padding:8px 12px;font-size:13px">
                  <div style="display:flex;justify-content:space-between;gap:8px;align-items:center">
                    <span style="color:${color};font-weight:700">${info.count}×</span>
                    <span style="flex:1;color:var(--text,#f8fafc);font-family:monospace;font-size:12px;word-break:break-word">${escapeHtml(msg)}</span>
                  </div>
                  <div style="font-size:10px;color:var(--muted,#c8c5d8);margin-top:2px">📦 ${escapeHtml(info.source)} · último: ${new Date(info.last.created_at).toLocaleString('es-AR')}</div>
                </div>`;
              }).join('')}
            </div>
          </div>
          <details>
            <summary style="cursor:pointer;color:var(--brand,#f59e0b);font-size:13px;font-weight:700">Ver lista completa (${errors.length})</summary>
            <div style="max-height:400px;overflow-y:auto;margin-top:10px;display:flex;flex-direction:column;gap:6px">
              ${errors.map(e => {
                const lvlColor = e.level === 'critical' ? '#fb7185' : e.level === 'warning' ? '#fbbf24' : '#c8c5d8';
                return `<div style="background:var(--card2,#202031);border-left:3px solid ${lvlColor};border-radius:6px;padding:8px 12px;font-size:12px">
                  <div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start">
                    <span style="color:${lvlColor};font-weight:700;text-transform:uppercase;font-size:10px">${e.level}</span>
                    <span style="color:var(--muted,#c8c5d8);font-size:10px">${new Date(e.created_at).toLocaleString('es-AR')}</span>
                  </div>
                  <div style="margin-top:4px;color:var(--text,#f8fafc);font-family:monospace;word-break:break-word">${escapeHtml(e.message)}</div>
                  <div style="margin-top:4px;color:var(--muted,#c8c5d8);font-size:10px">📦 ${escapeHtml(e.source)} · ${escapeHtml((e.user_agent||'').slice(0,50))}</div>
                  <div style="margin-top:6px;display:flex;gap:4px">
                    ${!e.resolved ? `<button data-err-resolve="${e.id}" style="background:rgba(34,197,94,.18);color:#86efac;border:1px solid rgba(34,197,94,.5);border-radius:999px;padding:3px 10px;font-size:11px;cursor:pointer">✓ Resolver</button>` : '<span style="color:#86efac;font-size:11px">✓ resuelto</span>'}
                    <button data-err-del="${e.id}" style="background:transparent;color:var(--muted);border:1px solid var(--line);border-radius:999px;padding:3px 8px;font-size:11px;cursor:pointer">🗑</button>
                  </div>
                </div>`;
              }).join('')}
            </div>
          </details>
          <div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap">
            <button class="pv-adm-btn-sm" id="pv-adm-test-alert">📩 Enviar reporte ahora</button>
            <button class="pv-adm-btn-sm" id="pv-adm-clear-errors">🗑 Borrar resueltos</button>
          </div>`;

        errEl.querySelectorAll('[data-err-resolve]').forEach(btn => btn.addEventListener('click', async () => {
          btn.disabled = true;
          await supa(`/rest/v1/app_errors?id=eq.${btn.dataset.errResolve}`, {
            method: 'PATCH', body: JSON.stringify({ resolved: true }), headers: { 'Prefer': 'return=minimal' }
          });
          setTimeout(loadData, 400);
        }));
        errEl.querySelectorAll('[data-err-del]').forEach(btn => btn.addEventListener('click', async () => {
          if (!confirm('¿Borrar este error?')) return;
          btn.disabled = true;
          await supa(`/rest/v1/app_errors?id=eq.${btn.dataset.errDel}`, {
            method: 'DELETE', headers: { 'Prefer': 'return=minimal' }
          });
          setTimeout(loadData, 400);
        }));
        $('#pv-adm-clear-errors', errEl)?.addEventListener('click', async () => {
          if (!confirm('¿Borrar TODOS los errores marcados como resueltos? No se puede deshacer.')) return;
          await supa('/rest/v1/app_errors?resolved=eq.true', { method: 'DELETE', headers: { 'Prefer': 'return=minimal' } });
          setTimeout(loadData, 400);
        });
      }
      // Botón "Enviar reporte ahora" — invoca la edge function manualmente
      const testBtn = $('#pv-adm-test-alert', errEl);
      if (testBtn) {
        testBtn.addEventListener('click', async () => {
          testBtn.disabled = true; testBtn.textContent = '⏳ Enviando…';
          try {
            const res = await fetch(`${SUPA_URL}/functions/v1/admin-alert`, {
              method: 'POST',
              headers: { 'apikey': SUPA_KEY, 'Content-Type': 'application/json' },
              body: JSON.stringify({ force: true })
            });
            const d = await res.json().catch(() => ({}));
            testBtn.textContent = d.ok ? '✓ Reporte enviado al admin' : '❌ Falló: ' + (d.error || res.status);
            setTimeout(() => { testBtn.disabled = false; testBtn.textContent = '📩 Enviar reporte ahora'; }, 4000);
          } catch (e) {
            testBtn.disabled = false; testBtn.textContent = '❌ ' + e.message;
          }
        });
      }
    } catch (e) {
      errEl.innerHTML = `<h2>🚨 Errores recientes</h2><div class="pv-adm-empty" style="color:#fb7185">⚠️ Error cargando: ${e.message || e}</div>`;
    }

    // ── Usuarios ──
    const usEl = $('#pv-adm-usuarios', panel);
    if (!users.length) {
      usEl.innerHTML = '<h2>👥 Usuarios</h2><div class="pv-adm-empty">No hay usuarios registrados todavía.</div>';
    } else {
      function renderUserRows(filterText) {
        const filtered = filterText
          ? users.filter(u => {
              const q = filterText.toLowerCase();
              return (u.email||'').toLowerCase().includes(q)
                  || (u.display_name||'').toLowerCase().includes(q);
            })
          : users;
        return `<tbody>${filtered.map(u => `<tr data-uid="${u.id}">
            <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${u.email || '—'}</td>
            <td>
              <span class="pv-adm-badge ${u.role}">${u.role === 'admin' ? '👑 Admin' : 'Usuario'}</span>
              ${u.is_premium ? '<span class="pv-adm-badge premium" style="margin-left:4px">⭐</span>' : ''}
              ${u.is_suspended ? '<span class="pv-adm-badge" style="background:#7f1d1d;color:#fff;margin-left:4px">🚫</span>' : ''}
            </td>
            <td style="font-size:12px;color:var(--muted,#c8c5d8)">${u.created_at ? new Date(u.created_at).toLocaleDateString('es-AR') : '—'}</td>
            <td>
              <div style="display:flex;gap:6px;flex-wrap:wrap">
                ${!u.is_premium ? `<button class="pv-adm-btn-sm" data-prem="${u.id}">⭐</button>` : `<button class="pv-adm-btn-sm danger" data-unprem="${u.id}">Quitar ⭐</button>`}
                ${u.role !== 'admin' ? `<button class="pv-adm-btn-sm" data-make-admin="${u.id}">👑</button>` : `<button class="pv-adm-btn-sm danger" data-remove-admin="${u.id}">Quitar 👑</button>`}
                ${!u.is_suspended ? `<button class="pv-adm-btn-sm danger" data-suspend="${u.id}">🚫</button>` : `<button class="pv-adm-btn-sm" data-unsuspend="${u.id}">↺</button>`}
                <button class="pv-adm-btn-sm" data-reset-pwd="${u.id}" title="Resetear contraseña">🔑</button>
              </div>
            </td>
          </tr>`).join('') || '<tr><td colspan="4" class="pv-adm-empty">Sin resultados</td></tr>'}</tbody>`;
      }

      usEl.innerHTML = `<h2>👥 Usuarios <span style="font-size:13px;color:var(--muted,#c8c5d8);font-weight:400">(${users.length})</span></h2>
        <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;align-items:center">
          <input type="search" id="pv-adm-search" placeholder="🔎 Buscar por email o nombre…" style="flex:1;min-width:200px;background:var(--card2,#202031);border:1px solid var(--line,#333447);color:var(--text,#f8fafc);border-radius:999px;padding:8px 14px;font:inherit;font-size:13px;outline:none">
          <button class="pv-adm-btn-sm" id="pv-adm-export-users">📥 Exportar CSV</button>
        </div>
        <div style="overflow-x:auto" id="pv-adm-users-tbl-wrap">
        <table class="pv-adm-table">
          <thead><tr>
            <th>Email</th>
            <th>Rol</th>
            <th>Registrado</th>
            <th>Acciones</th>
          </tr></thead>
          ${renderUserRows('')}
        </table></div>`;

      // Buscador
      const searchInp = $('#pv-adm-search', usEl);
      const tblWrap = $('#pv-adm-users-tbl-wrap', usEl);
      searchInp.addEventListener('input', () => {
        const tbody = tblWrap.querySelector('tbody');
        if (tbody) tbody.outerHTML = renderUserRows(searchInp.value.trim());
        attachUserHandlers();
      });

      // Exportar CSV
      $('#pv-adm-export-users', usEl).addEventListener('click', () => {
        const csvHeader = 'email,nombre,rol,premium,suspendido,creado\n';
        const csvBody = users.map(u =>
          [u.email||'', u.display_name||'', u.role||'', u.is_premium?'si':'no', u.is_suspended?'si':'no', u.created_at||'']
            .map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',')
        ).join('\n');
        const blob = new Blob([csvHeader + csvBody], { type: 'text/csv;charset=utf-8' });
        const url  = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'palabraviva-usuarios-' + new Date().toISOString().slice(0,10) + '.csv';
        document.body.appendChild(a); a.click();
        setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
      });

      function attachUserHandlers() {

      // Botones acciones
      async function userAction(uid, action, confirmMsg) {
        if (confirmMsg && !confirm(confirmMsg)) return false;
        const { ok, data } = await supa('/rest/v1/rpc/admin_set_user_status', {
          method: 'POST',
          body: JSON.stringify({ p_user_id: uid, p_action: action })
        });
        if (!ok) {
          alert('No se pudo: ' + (data?.message || JSON.stringify(data) || 'error desconocido'));
          return false;
        }
        return true;
      }

      attachUserHandlers();
      function _attachInner() {
        usEl.querySelectorAll('[data-prem]').forEach(btn => btn.addEventListener('click', async () => {
          const uid = btn.dataset.prem;
          btn.disabled = true; btn.textContent = '⏳';
          const { ok } = await supa(`/rest/v1/profiles?id=eq.${uid}`, {
            method: 'PATCH', body: JSON.stringify({ is_premium: true }),
            headers: { 'Prefer': 'return=minimal' }
          });
          if (ok) { btn.textContent = '✅'; setTimeout(loadData, 800); }
          else { btn.textContent = '❌'; btn.disabled = false; }
        }));
        usEl.querySelectorAll('[data-unprem]').forEach(btn => btn.addEventListener('click', async () => {
          const uid = btn.dataset.unprem;
          btn.disabled = true; btn.textContent = '⏳';
          const { ok } = await supa(`/rest/v1/profiles?id=eq.${uid}`, {
            method: 'PATCH', body: JSON.stringify({ is_premium: false }),
            headers: { 'Prefer': 'return=minimal' }
          });
          if (ok) { btn.textContent = '✅'; setTimeout(loadData, 800); }
          else { btn.textContent = '❌'; btn.disabled = false; }
        }));
        usEl.querySelectorAll('[data-make-admin]').forEach(btn => btn.addEventListener('click', async () => {
          btn.disabled = true; btn.textContent = '⏳';
          const ok = await userAction(btn.dataset.makeAdmin, 'make_admin', '¿Hacer ADMIN a este usuario? Va a poder ver y modificar todo este panel.');
          if (ok) setTimeout(loadData, 600); else { btn.disabled = false; btn.textContent = '👑'; }
        }));
        usEl.querySelectorAll('[data-remove-admin]').forEach(btn => btn.addEventListener('click', async () => {
          btn.disabled = true; btn.textContent = '⏳';
          const ok = await userAction(btn.dataset.removeAdmin, 'remove_admin', '¿Quitar permisos de admin a este usuario?');
          if (ok) setTimeout(loadData, 600); else { btn.disabled = false; btn.textContent = 'Quitar 👑'; }
        }));
        usEl.querySelectorAll('[data-suspend]').forEach(btn => btn.addEventListener('click', async () => {
          btn.disabled = true; btn.textContent = '⏳';
          const ok = await userAction(btn.dataset.suspend, 'suspend', '¿Suspender este usuario? No va a poder usar funciones que requieren login.');
          if (ok) setTimeout(loadData, 600); else { btn.disabled = false; btn.textContent = '🚫'; }
        }));
        usEl.querySelectorAll('[data-unsuspend]').forEach(btn => btn.addEventListener('click', async () => {
          btn.disabled = true; btn.textContent = '⏳';
          const ok = await userAction(btn.dataset.unsuspend, 'unsuspend');
          if (ok) setTimeout(loadData, 600); else { btn.disabled = false; btn.textContent = '↺'; }
        }));
        // 🔑 Reset password
        usEl.querySelectorAll('[data-reset-pwd]').forEach(btn => btn.addEventListener('click', async () => {
          const uid = btn.dataset.resetPwd;
          const newPwd = prompt('Nueva contraseña para este usuario (mínimo 8 caracteres). El usuario va a tener que iniciar sesión con esta password después:');
          if (!newPwd) return;
          if (newPwd.length < 8) { alert('La contraseña debe tener al menos 8 caracteres.'); return; }
          btn.disabled = true; btn.textContent = '⏳';
          const { ok, data } = await supa('/rest/v1/rpc/admin_reset_user_password', {
            method: 'POST',
            body: JSON.stringify({ p_user_id: uid, p_new_password: newPwd })
          });
          if (ok) {
            alert('✓ Contraseña reseteada. Decile al usuario que entre con la nueva.');
            btn.textContent = '🔑';
            btn.disabled = false;
          } else {
            alert('Error: ' + (data?.message || 'no se pudo'));
            btn.disabled = false; btn.textContent = '🔑';
          }
        }));
      }
      // attachUserHandlers se redefine en cada render para que el buscador
      // pueda re-bindear los handlers después de filtrar.
      function attachUserHandlers() { _attachInner(); }
    }

    // ── Donaciones ──
    const donEl = $('#pv-adm-donaciones', panel);
    if (!donations.length) {
      donEl.innerHTML = '<h2>💛 Donaciones</h2><div class="pv-adm-empty">No hay donaciones registradas todavía.<br><small style="font-size:12px;margin-top:6px;display:block">Aparecerán aquí cuando se registren manualmente o via webhook.</small></div>';
    } else {
      const total = donations.reduce((s, d) => s + (d.amount || 0), 0);
      donEl.innerHTML = `<h2>💛 Donaciones <span style="font-size:13px;color:var(--muted,#c8c5d8);font-weight:400">(${donations.length} · Total $${total.toLocaleString('es-AR')} ARS)</span></h2>
        <div style="overflow-x:auto">
        <table class="pv-adm-table">
          <thead><tr><th>Plataforma</th><th>Monto</th><th>Mensaje</th><th>Fecha</th></tr></thead>
          <tbody>
          ${donations.map(d => `<tr>
            <td>${d.platform || '—'}</td>
            <td>${d.amount ? `$${d.amount} ${d.currency || 'ARS'}` : '—'}</td>
            <td style="font-size:13px;color:var(--muted,#c8c5d8)">${d.message || ''}</td>
            <td style="font-size:12px;color:var(--muted,#c8c5d8)">${d.created_at ? new Date(d.created_at).toLocaleDateString('es-AR') : '—'}</td>
          </tr>`).join('')}
          </tbody>
        </table></div>`;
    }

    // ── Sugerencias ──
    // suggestions ya vino del dashboard RPC al inicio de loadData()
    if (!panel) return;
    const sugEl = $('#pv-adm-sugerencias', panel);
    if (!suggestions.length) {
      sugEl.innerHTML = '<h2>💌 Sugerencias</h2><div class="pv-adm-empty">No hay sugerencias todavía.</div>';
    } else {
      const escapeHtml = s => (s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
      const nw = suggestions.filter(s => s.status === 'new').length;
      sugEl.innerHTML = `<h2>💌 Sugerencias <span style="font-size:13px;color:var(--muted,#c8c5d8);font-weight:400">(${suggestions.length}${nw ? ` · ${nw} nuevas` : ''})</span></h2>
        <div style="display:flex;flex-direction:column;gap:10px">
        ${suggestions.map(s => {
          const isNew = s.status === 'new';
          const dt = s.created_at ? new Date(s.created_at).toLocaleString('es-AR') : '';
          return `<article style="background:var(--card2,#202031);border:1px solid ${isNew ? 'rgba(245,158,11,.5)' : 'var(--line,#333447)'};border-radius:16px;padding:12px 14px">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px">
              <div style="font-size:13px"><strong>${escapeHtml(s.name) || '(anónimo)'}</strong>${s.email ? ` · <a href="mailto:${escapeHtml(s.email)}" style="color:var(--brand,#f59e0b)">${escapeHtml(s.email)}</a>` : ''}</div>
              ${isNew ? '<span class="pv-adm-badge admin" style="font-size:10px">NUEVA</span>' : ''}
            </div>
            <p style="margin:0 0 8px;font-size:15px;line-height:1.5;white-space:pre-wrap;color:var(--text,#f8fafc)">${escapeHtml(s.message)}</p>
            <div style="font-size:11px;color:var(--muted,#c8c5d8);display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap">
              <span>📅 ${dt}</span>
              <div style="display:flex;gap:4px">
                ${isNew ? `<button data-sug-mark="${s.id}" style="background:transparent;border:1px solid var(--line);color:var(--muted);border-radius:999px;padding:2px 8px;font-size:11px;cursor:pointer">✓ Marcar leída</button>` : ''}
                <button data-sug-del="${s.id}" style="background:transparent;border:1px solid rgba(251,113,133,.4);color:#fb7185;border-radius:999px;padding:2px 8px;font-size:11px;cursor:pointer">🗑</button>
              </div>
            </div>
          </article>`;
        }).join('')}
        </div>`;

      sugEl.querySelectorAll('[data-sug-mark]').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.sugMark;
          btn.disabled = true; btn.textContent = '⏳';
          const { ok } = await supa(`/rest/v1/suggestions?id=eq.${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status: 'read' }),
            headers: { 'Prefer': 'return=minimal' }
          });
          if (ok) setTimeout(loadData, 500);
          else { btn.textContent = '❌'; btn.disabled = false; }
        });
      });
      sugEl.querySelectorAll('[data-sug-del]').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!confirm('¿Borrar esta sugerencia? No se puede recuperar.')) return;
          const id = btn.dataset.sugDel;
          btn.disabled = true; btn.textContent = '⏳';
          const { ok } = await supa(`/rest/v1/suggestions?id=eq.${id}`, {
            method: 'DELETE',
            headers: { 'Prefer': 'return=minimal' }
          });
          if (ok) setTimeout(loadData, 500);
          else { btn.textContent = '❌'; btn.disabled = false; }
        });
      });
    }

    // ── Iglesias propuestas por la comunidad ──
    // churches ya vino del dashboard RPC
    if (!panel) return;
    const chEl = $('#pv-adm-churches', panel);
    if (!churches.length) {
      chEl.innerHTML = '<h2>⛪ Iglesias propuestas</h2><div class="pv-adm-empty">Todavía no hay iglesias propuestas por usuarios.</div>';
    } else {
      const escapeHtml = s => (s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
      const pending = churches.filter(c => c.status === 'pending').length;
      chEl.innerHTML = `<h2>⛪ Iglesias propuestas <span style="font-size:13px;color:var(--muted,#c8c5d8);font-weight:400">(${churches.length}${pending ? ` · ${pending} pendientes` : ''})</span></h2>
        <div style="display:flex;flex-direction:column;gap:10px">
        ${churches.map(c => {
          const dt = c.created_at ? new Date(c.created_at).toLocaleString('es-AR') : '';
          const borderColor = c.status === 'pending' ? 'rgba(245,158,11,.5)'
            : c.status === 'approved' ? 'rgba(34,197,94,.5)'
            : 'rgba(251,113,133,.5)';
          const statusBadge = c.status === 'pending' ? '<span class="pv-adm-badge admin" style="font-size:10px">PENDIENTE</span>'
            : c.status === 'approved' ? '<span class="pv-adm-badge premium" style="font-size:10px">PUBLICADA</span>'
            : '<span class="pv-adm-badge" style="background:#7f1d1d;color:#fff;font-size:10px">RECHAZADA</span>';
          return `<article style="background:var(--card2,#202031);border:1px solid ${borderColor};border-radius:16px;padding:12px 14px">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px">
              <h4 style="margin:0;font-size:15px">${escapeHtml(c.name)}</h4>
              ${statusBadge}
            </div>
            <div style="font-size:13px;color:var(--muted,#c8c5d8);margin:0 0 6px">${escapeHtml(c.denomination || 'Cristiana')} · ${escapeHtml(c.address || 'sin dirección')}</div>
            <div style="font-size:12px;color:var(--muted,#c8c5d8);display:flex;gap:8px;flex-wrap:wrap">
              ${c.phone ? `📞 ${escapeHtml(c.phone)}` : ''}
              ${c.website ? `<a href="${escapeHtml(c.website)}" target="_blank" rel="noopener noreferrer" style="color:var(--brand,#f59e0b)">🌐 sitio</a>` : ''}
              <a href="https://www.openstreetmap.org/?mlat=${c.lat}&mlon=${c.lon}&zoom=17" target="_blank" rel="noopener noreferrer" style="color:var(--brand,#f59e0b)">📍 ver mapa</a>
            </div>
            ${c.notes ? `<p style="margin:6px 0 0;font-size:13px;color:var(--text);white-space:pre-wrap">${escapeHtml(c.notes)}</p>` : ''}
            ${c.submitter_email ? `<p style="margin:6px 0 0;font-size:11px;color:var(--muted,#c8c5d8)">Propuesta por <a href="mailto:${escapeHtml(c.submitter_email)}" style="color:var(--brand,#f59e0b)">${escapeHtml(c.submitter_email)}</a> · ${dt}</p>` : `<p style="margin:6px 0 0;font-size:11px;color:var(--muted,#c8c5d8)">${dt}</p>`}
            <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
              ${c.status !== 'approved' ? `<button data-ch-app="${c.id}" style="background:rgba(34,197,94,.18);color:#86efac;border:1px solid rgba(34,197,94,.5);border-radius:999px;padding:5px 12px;font-size:12px;cursor:pointer;font-weight:700">✓ Aprobar</button>` : ''}
              ${c.status !== 'rejected' ? `<button data-ch-rej="${c.id}" style="background:rgba(251,113,133,.10);color:#fda4af;border:1px solid rgba(251,113,133,.4);border-radius:999px;padding:5px 12px;font-size:12px;cursor:pointer;font-weight:700">✗ Rechazar</button>` : ''}
              <button data-ch-del="${c.id}" style="background:transparent;color:var(--muted);border:1px solid var(--line);border-radius:999px;padding:5px 10px;font-size:12px;cursor:pointer">🗑</button>
            </div>
          </article>`;
        }).join('')}
        </div>`;

      chEl.querySelectorAll('[data-ch-app]').forEach(btn => btn.addEventListener('click', async () => {
        btn.disabled = true; btn.textContent = '⏳';
        const { ok } = await supa(`/rest/v1/community_churches?id=eq.${btn.dataset.chApp}`, {
          method: 'PATCH', body: JSON.stringify({ status: 'approved' }), headers: { 'Prefer': 'return=minimal' }
        });
        if (ok) setTimeout(loadData, 500); else { btn.textContent = '❌'; btn.disabled = false; }
      }));
      chEl.querySelectorAll('[data-ch-rej]').forEach(btn => btn.addEventListener('click', async () => {
        btn.disabled = true; btn.textContent = '⏳';
        const { ok } = await supa(`/rest/v1/community_churches?id=eq.${btn.dataset.chRej}`, {
          method: 'PATCH', body: JSON.stringify({ status: 'rejected' }), headers: { 'Prefer': 'return=minimal' }
        });
        if (ok) setTimeout(loadData, 500); else { btn.textContent = '❌'; btn.disabled = false; }
      }));
      chEl.querySelectorAll('[data-ch-del]').forEach(btn => btn.addEventListener('click', async () => {
        if (!confirm('¿Borrar esta propuesta de iglesia?')) return;
        btn.disabled = true; btn.textContent = '⏳';
        const { ok } = await supa(`/rest/v1/community_churches?id=eq.${btn.dataset.chDel}`, {
          method: 'DELETE', headers: { 'Prefer': 'return=minimal' }
        });
        if (ok) setTimeout(loadData, 500); else { btn.textContent = '❌'; btn.disabled = false; }
      }));
    }

    // ── Peticiones de oración ──
    // prayers ya vino del dashboard RPC
    if (!panel) return;
    const prEl = $('#pv-adm-prayers', panel);
    if (!prayers.length) {
      prEl.innerHTML = '<h2>🙏 Peticiones de oración</h2><div class="pv-adm-empty">Todavía no hay peticiones.</div>';
    } else {
      const escapeHtml = s => (s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
      const pending = prayers.filter(p => p.status === 'pending').length;
      prEl.innerHTML = `<h2>🙏 Peticiones de oración <span style="font-size:13px;color:var(--muted,#c8c5d8);font-weight:400">(${prayers.length}${pending ? ` · ${pending} pendientes` : ''})</span></h2>
        <div style="display:flex;flex-direction:column;gap:10px">
        ${prayers.map(p => {
          const dt = p.created_at ? new Date(p.created_at).toLocaleString('es-AR') : '';
          const borderColor = p.status === 'pending'  ? 'rgba(245,158,11,.5)'
                            : p.status === 'approved' ? 'rgba(34,197,94,.5)'
                            : 'rgba(251,113,133,.5)';
          const statusBadge = p.status === 'pending'  ? '<span class="pv-adm-badge admin" style="font-size:10px">PENDIENTE</span>'
                            : p.status === 'approved' ? '<span class="pv-adm-badge premium" style="font-size:10px">PUBLICADA</span>'
                            : '<span class="pv-adm-badge" style="background:#7f1d1d;color:#fff;font-size:10px">RECHAZADA</span>';
          return `<article style="background:var(--card2,#202031);border:1px solid ${borderColor};border-radius:16px;padding:12px 14px">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px">
              <div style="display:flex;gap:8px;align-items:center;font-size:11px;color:var(--muted,#c8c5d8);text-transform:uppercase;letter-spacing:.06em">
                <span>${escapeHtml(p.category || 'general')}</span>·<span>${escapeHtml(p.display_name || 'Anónimo')}</span>
              </div>
              ${statusBadge}
            </div>
            <p style="margin:0 0 8px;font-size:14px;line-height:1.55;white-space:pre-wrap;color:var(--text,#f8fafc)">${escapeHtml(p.request_text)}</p>
            <div style="font-size:11px;color:var(--muted,#c8c5d8);display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:8px">
              <span>📅 ${dt}</span>
              <span>🙏 ${p.prayer_count || 0} orando</span>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap">
              ${p.status !== 'approved' ? `<button data-pr-app="${p.id}" style="background:rgba(34,197,94,.18);color:#86efac;border:1px solid rgba(34,197,94,.5);border-radius:999px;padding:5px 12px;font-size:12px;cursor:pointer;font-weight:700">✓ Aprobar</button>` : ''}
              ${p.status !== 'rejected' ? `<button data-pr-rej="${p.id}" style="background:rgba(251,113,133,.10);color:#fda4af;border:1px solid rgba(251,113,133,.4);border-radius:999px;padding:5px 12px;font-size:12px;cursor:pointer;font-weight:700">✗ Rechazar</button>` : ''}
              <button data-pr-del="${p.id}" style="background:transparent;color:var(--muted);border:1px solid var(--line);border-radius:999px;padding:5px 10px;font-size:12px;cursor:pointer">🗑</button>
            </div>
          </article>`;
        }).join('')}
        </div>`;

      prEl.querySelectorAll('[data-pr-app]').forEach(btn => btn.addEventListener('click', async () => {
        btn.disabled = true; btn.textContent = '⏳';
        const { ok } = await supa(`/rest/v1/prayer_requests?id=eq.${btn.dataset.prApp}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'approved', approved_at: new Date().toISOString() }),
          headers: { 'Prefer': 'return=minimal' }
        });
        if (ok) setTimeout(loadData, 500); else { btn.textContent = '❌'; btn.disabled = false; }
      }));
      prEl.querySelectorAll('[data-pr-rej]').forEach(btn => btn.addEventListener('click', async () => {
        btn.disabled = true; btn.textContent = '⏳';
        const { ok } = await supa(`/rest/v1/prayer_requests?id=eq.${btn.dataset.prRej}`, {
          method: 'PATCH', body: JSON.stringify({ status: 'rejected' }), headers: { 'Prefer': 'return=minimal' }
        });
        if (ok) setTimeout(loadData, 500); else { btn.textContent = '❌'; btn.disabled = false; }
      }));
      prEl.querySelectorAll('[data-pr-del]').forEach(btn => btn.addEventListener('click', async () => {
        if (!confirm('¿Borrar esta petición de oración? No se puede recuperar.')) return;
        btn.disabled = true; btn.textContent = '⏳';
        const { ok } = await supa(`/rest/v1/prayer_requests?id=eq.${btn.dataset.prDel}`, {
          method: 'DELETE', headers: { 'Prefer': 'return=minimal' }
        });
        if (ok) setTimeout(loadData, 500); else { btn.textContent = '❌'; btn.disabled = false; }
      }));
    }
  }

  // ── API pública ────────────────────────────────────────────────────────────
  window.PVAdmin = { open: openPanel };

  // Auto-abrir el panel admin si la URL trae #admin como hash.
  // Esto le da al admin un link directo confiable cuando el botón ⚙️ Admin
  // de la quick bar no responde por algún overlay huérfano o problema de UI.
  // Uso: https://palabraviva-ar.vercel.app/#admin
  function checkAdminHashRoute() {
    if (location.hash === '#admin') {
      // Esperar a que PVAuth esté listo y verificar admin
      const tryOpen = (attempts = 0) => {
        if (window.PVAuth?.isAdmin?.()) {
          openPanel();
        } else if (attempts < 30) {
          // hasta 6s de espera para que cargue la sesión
          setTimeout(() => tryOpen(attempts + 1), 200);
        }
      };
      tryOpen();
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAdminHashRoute);
  } else {
    checkAdminHashRoute();
  }
  // También al cambiar el hash manualmente
  window.addEventListener('hashchange', () => {
    if (location.hash === '#admin' && window.PVAuth?.isAdmin?.()) openPanel();
  });
})();

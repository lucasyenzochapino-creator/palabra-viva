/* Palabra Viva — Panel de Administración v14 */
(() => {
  'use strict';

  const SUPA_URL = 'https://fuxojzmwyyecefxczfrn.supabase.co';
  const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1eG9qem13eXllY2VmeGN6ZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTU4MDAsImV4cCI6MjA5NTAzMTgwMH0.M4telJzC3kt7fNN86kvuqpL5-vVmCjdzE-hTDy6Igak';

  const qs  = (s, r = document) => r.querySelector(s);
  const esc = s => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const getToken = () => window.PVAuth?.getToken?.() || '';
  const fmtDate  = s => s ? new Date(s).toLocaleDateString('es-AR') : '—';

  // ── API pública — expuesta ANTES de cualquier código que pueda fallar ──────
  window.PVAdmin = {
    open: () => openPanel().catch(e => {
      console.error('[Admin] openPanel fallo:', e);
      toast('Error abriendo panel: ' + (e?.message || 'desconocido'), 'err');
    })
  };

  // ── Toast helper ───────────────────────────────────────────────────────────
  function toast(msg, type = 'ok') {
    const bg = type === 'err' ? '#7f1d1d' : type === 'warn' ? '#78350f' : '#14532d';
    const t  = document.createElement('div');
    t.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:9999999;background:' + bg + ';color:#fff;padding:12px 20px;border-radius:12px;font-weight:700;font-size:14px;max-width:90vw;text-align:center';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 5000);
  }

  // ── Fetch con timeout 12s ──────────────────────────────────────────────────
  async function supa(path, opts = {}) {
    if (window.PVAuth?.isTokenExpired?.()) {
      try { await window.PVAuth.refreshSession?.(); } catch {}
    }
    const headers = {
      'apikey': SUPA_KEY,
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(opts.headers || {})
    };
    const ctrl  = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    try {
      const res  = await fetch(SUPA_URL + path, { ...opts, headers, signal: ctrl.signal });
      clearTimeout(timer);
      const data = await res.json().catch(() => ({}));
      return { ok: res.ok, status: res.status, data };
    } catch (e) {
      clearTimeout(timer);
      return { ok: false, status: 0, data: { message: e?.name === 'AbortError' ? 'Tiempo agotado (12s)' : (e.message || 'Error de red') } };
    }
  }


  // ── CSS ────────────────────────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('pv-admin-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-admin-style';
    st.textContent = [
      '.pv-adm-panel{position:fixed;inset:0;z-index:999999;background:var(--bg,#0a0a0f);overflow-y:auto;padding:14px 14px calc(80px + env(safe-area-inset-bottom));color:var(--text,#f8fafc);font-family:var(--font-sans,Inter,sans-serif)}',
      '.pv-adm-inner{max-width:780px;margin:0 auto;display:flex;flex-direction:column;gap:16px}',
      '.pv-adm-head{display:flex;justify-content:space-between;align-items:center;gap:12px;position:sticky;top:0;background:var(--bg,#0a0a0f);z-index:2;padding:10px 0 14px;border-bottom:1px solid var(--line,#333447)}',
      '.pv-adm-head h1{margin:0;font-size:22px;letter-spacing:-.03em}',
      '.pv-adm-close{border:1px solid var(--line,#333447);background:var(--card,#171722);color:var(--text,#f8fafc);border-radius:999px;padding:9px 16px;font-weight:900;cursor:pointer;font-size:14px;font-family:inherit}',
      '.pv-adm-section{border:1px solid var(--line,#333447);background:var(--card,#171722);border-radius:22px;padding:16px}',
      '.pv-adm-section h2{margin:0 0 14px;font-size:18px;letter-spacing:-.02em}',
      '.pv-adm-stat{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:10px}',
      '.pv-adm-stat-box{background:var(--card2,#202031);border-radius:16px;padding:14px;text-align:center}',
      '.pv-adm-stat-n{font-size:28px;font-weight:900;line-height:1}',
      '.pv-adm-stat-l{font-size:11px;color:var(--muted,#c8c5d8);margin-top:4px}',
      '.pv-adm-table{width:100%;border-collapse:collapse;font-size:13px}',
      '.pv-adm-table th{text-align:left;font-size:11px;color:var(--muted,#c8c5d8);text-transform:uppercase;letter-spacing:.06em;padding:6px 6px;border-bottom:1px solid var(--line,#333447)}',
      '.pv-adm-table td{padding:9px 6px;border-bottom:1px solid var(--line,#333447);vertical-align:middle}',
      '.pv-adm-table tr:last-child td{border-bottom:0}',
      '.pv-adm-btn{border:1px solid var(--line,#333447);background:var(--card2,#202031);color:var(--text,#f8fafc);border-radius:999px;padding:5px 11px;font-size:12px;font-weight:900;cursor:pointer;white-space:nowrap;font-family:inherit;margin:2px}',
      '.pv-adm-btn:disabled{opacity:.45;cursor:not-allowed}',
      '.pv-adm-btn.ok{border-color:rgba(34,197,94,.5);color:#4ade80;background:rgba(34,197,94,.08)}',
      '.pv-adm-btn.warn{border-color:rgba(251,191,36,.5);color:#fbbf24;background:rgba(251,191,36,.08)}',
      '.pv-adm-btn.danger{border-color:rgba(251,113,133,.5);color:#fb7185;background:rgba(251,113,133,.08)}',
      '.pv-adm-btn.brand{border-color:rgba(245,158,11,.5);color:#f59e0b;background:rgba(245,158,11,.08)}',
      '.pv-adm-spin{text-align:center;color:var(--muted,#c8c5d8);padding:22px;font-size:15px}',
      '.pv-adm-empty{text-align:center;color:var(--muted,#c8c5d8);padding:20px;font-size:14px}',
      '.pv-adm-err-box{color:#fda4af;background:rgba(251,113,133,.1);border:1px solid rgba(251,113,133,.3);border-radius:12px;padding:12px;font-size:14px;margin-top:8px}',
      '.pv-adm-ok-box{color:#86efac;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.3);border-radius:12px;padding:12px;font-size:14px;margin-top:8px}',
      '.pv-adm-warn-box{color:#fbbf24;background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.3);border-radius:12px;padding:12px;font-size:14px;margin-top:8px}',
      '.pv-adm-btns-wrap{display:flex;flex-wrap:wrap;gap:2px}',
      '@media(max-width:500px){.pv-adm-stat{grid-template-columns:1fr 1fr}}'
    ].join('');
    document.head.appendChild(st);
  }

  // ── Estado global ──────────────────────────────────────────────────────────
  let panel = null;
  let dashData = null;


  // ── Abrir / Cerrar panel ───────────────────────────────────────────────────
  async function openPanel() {
    injectStyles();
    if (panel) { panel.remove(); panel = null; }
    panel = document.createElement('section');
    panel.className = 'pv-adm-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Panel de administracion');

    const SECTIONS = [
      ['resumen',     '📊 Resumen'],
      ['salud',       '📡 Salud del sistema'],
      ['usuarios',    '👥 Usuarios'],
      ['iglesias',    '⛪ Iglesias propuestas'],
      ['errores',     '🐛 Errores recientes'],
      ['sugerencias', '💌 Sugerencias'],
      ['donaciones',  '💛 Donaciones'],
      ['prayers',     '🙏 Peticiones de oración']
    ];

    panel.innerHTML = '<div class="pv-adm-inner">'
      + '<div class="pv-adm-head"><h1>⚙️ Panel Admin</h1>'
      + '<div style="display:flex;gap:8px">'
      + '<button class="pv-adm-close" id="pv-adm-refresh">🔄</button>'
      + '<button class="pv-adm-close" id="pv-adm-close-btn">Cerrar ✕</button>'
      + '</div></div>'
      + SECTIONS.map(([id, title]) =>
          '<div class="pv-adm-section" id="pv-adm-' + id + '">'
          + '<h2>' + title + '</h2>'
          + '<div class="pv-adm-spin">⏳ Cargando…</div>'
          + '</div>'
        ).join('')
      + '</div>';

    document.body.appendChild(panel);
    document.body.style.overflow = 'hidden';

    qs('#pv-adm-close-btn', panel).addEventListener('click', () => closePanel());
    qs('#pv-adm-refresh',   panel).addEventListener('click', () => loadData());
    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape') { closePanel(); document.removeEventListener('keydown', onKey); }
    });

    try { history.pushState({ pvAdmin: true }, '', location.href.split('#')[0] + '#admin'); } catch {}
    window.addEventListener('popstate', function onPop() {
      window.removeEventListener('popstate', onPop);
      if (panel) closePanel(false);
    });

    await loadData();
  }

  function closePanel(withHistory = true) {
    if (!panel) return;
    panel.remove(); panel = null;
    document.body.style.overflow = '';
    if (withHistory && location.hash === '#admin') {
      window._pvPanelClosing = true;
      try { history.back(); } catch {}
    }
  }

  // ── box helper ─────────────────────────────────────────────────────────────
  function box(n, label, color) {
    const style = color ? 'color:' + color + ';' : '';
    return '<div class="pv-adm-stat-box"><div class="pv-adm-stat-n" style="' + style + '">' + n + '</div><div class="pv-adm-stat-l">' + label + '</div></div>';
  }


  // ── Cargar datos del dashboard ─────────────────────────────────────────────
  async function loadData() {
    if (!panel) return;

    // Mostrar spinner en todas las secciones
    ['resumen','salud','usuarios','iglesias','errores','sugerencias','donaciones','prayers'].forEach(id => {
      const el = qs('#pv-adm-' + id, panel);
      if (el) { const h2 = el.querySelector('h2'); el.innerHTML = ''; if (h2) el.appendChild(h2); el.insertAdjacentHTML('beforeend', '<div class="pv-adm-spin">⏳ Cargando…</div>'); }
    });

    const { ok, data, status } = await supa('/rest/v1/rpc/admin_get_dashboard', { method: 'POST', body: '{}' });
    if (!panel) return;

    if (!ok || !data || typeof data !== 'object' || Array.isArray(data)) {
      const msg = esc((data?.message || data?.error || ('HTTP ' + status)).toString());
      const errHtml = '<div class="pv-adm-err-box">⚠️ Error cargando datos:<br><small>' + msg + '</small>'
        + '<br><button onclick="window.PVAdmin.open()" style="margin-top:10px;background:#f59e0b;color:#000;border:0;border-radius:999px;padding:8px 16px;cursor:pointer;font-weight:700">🔄 Reintentar</button></div>';
      ['resumen','salud','usuarios','iglesias','errores','sugerencias','donaciones','prayers'].forEach(id => {
        const el = qs('#pv-adm-' + id, panel);
        if (el) { const h2 = el.querySelector('h2'); el.innerHTML = ''; if (h2) el.appendChild(h2); el.insertAdjacentHTML('beforeend', errHtml); }
      });
      return;
    }

    dashData = data;
    const users       = Array.isArray(data.users)       ? data.users       : [];
    const donations   = Array.isArray(data.donations)   ? data.donations   : [];
    const errors      = Array.isArray(data.errors)      ? data.errors      : [];
    const prayers     = Array.isArray(data.prayers)     ? data.prayers     : [];
    const suggestions = Array.isArray(data.suggestions) ? data.suggestions : [];
    const churches    = Array.isArray(data.churches)    ? data.churches    : [];
    const pushSubs    = Array.isArray(data.push_subs)   ? data.push_subs   : [];
    const stats       = (data.stats && typeof data.stats === 'object') ? data.stats : {};

    renderResumen(users, donations, pushSubs, stats);
    renderSalud(pushSubs);
    renderUsuarios(users);
    renderIglesias(churches);
    renderErrores(errors);
    renderSugerencias(suggestions);
    renderDonaciones(donations);
    renderPrayers(prayers);
  }


  // ── Resumen ────────────────────────────────────────────────────────────────
  function renderResumen(users, donations, pushSubs, stats) {
    const el = qs('#pv-adm-resumen', panel); if (!el) return;
    const admins = users.filter(u => u.role === 'admin').length;
    const prems  = users.filter(u => u.is_premium).length;
    const total  = stats.total_users != null ? stats.total_users : users.length;
    el.innerHTML = '<h2>📊 Resumen</h2><div class="pv-adm-stat">'
      + box(total,           'Total usuarios', '#f59e0b')
      + box(prems,           'Premium',        '#22c55e')
      + box(pushSubs.length, 'Push activos',   '#60a5fa')
      + box(donations.length,'Donaciones',     '#a78bfa')
      + box(admins,          'Admins',         '#fb923c')
      + box(users.length,    'En este listado')
      + '</div>';
  }

  // ── Salud del sistema ──────────────────────────────────────────────────────
  function renderSalud(pushSubs) {
    const el = qs('#pv-adm-salud', panel); if (!el) return;
    const total   = pushSubs.length;
    const active  = pushSubs.filter(s => s.active !== false).length;
    const now     = Date.now();
    const last24h = pushSubs.filter(s => s.last_sent_at && (now - new Date(s.last_sent_at).getTime()) < 86400000).length;
    const lastTs  = pushSubs.reduce((mx, s) => {
      if (!s.last_sent_at) return mx;
      const t = new Date(s.last_sent_at).getTime(); return t > mx ? t : mx;
    }, 0);
    const hrs = lastTs ? Math.round((now - lastTs) / 3600000) : -1;
    let alert2 = '';
    if      (total === 0) alert2 = '<div class="pv-adm-err-box">🚨 Sin suscripciones push activas</div>';
    else if (hrs > 30)    alert2 = '<div class="pv-adm-warn-box">⚠️ Hace ' + hrs + 'h sin envío de push</div>';
    else if (lastTs)      alert2 = '<div class="pv-adm-ok-box">✓ Sistema OK — último push hace ' + hrs + 'h</div>';
    el.innerHTML = '<h2>📡 Salud del sistema</h2><div class="pv-adm-stat">'
      + box(total,  'Suscripciones')
      + box(active, 'Activas')
      + box(last24h,'Envíos 24h')
      + '</div>' + alert2
      + '<div style="margin-top:10px;font-size:11px;text-align:right">'
      + '<a href="https://supabase.com/dashboard/project/fuxojzmwyyecefxczfrn/functions/send-daily-push/logs" target="_blank" style="color:#f59e0b">Ver logs Edge Function ↗</a>'
      + '</div>';
  }


  // ── Usuarios ───────────────────────────────────────────────────────────────
  function renderUsuarios(users) {
    const el = qs('#pv-adm-usuarios', panel); if (!el) return;
    if (!users.length) {
      el.innerHTML = '<h2>👥 Usuarios</h2><div class="pv-adm-empty">Sin usuarios en el dashboard.</div>';
      return;
    }
    let rows = users.map(u => {
      const isAdmin = u.role === 'admin';
      const isPrem  = !!u.is_premium;
      const isSusp  = !!u.suspended;
      const email   = esc(u.email || '').slice(0, 30);
      const name    = esc(u.display_name || u.username || '—').slice(0, 22);
      const joined  = fmtDate(u.created_at);
      let roleBadge = isAdmin
        ? '<span style="color:#f59e0b;font-weight:900">👑 admin</span>'
        : '<span style="color:var(--muted,#c8c5d8)">user</span>';
      if (isPrem) roleBadge += ' <span style="color:#22c55e">⭐</span>';
      if (isSusp) roleBadge += ' <span style="color:#fb7185">🚫</span>';

      const btns = [
        isPrem
          ? '<button class="pv-adm-btn warn" data-uid="' + u.id + '" data-action="unprem">Quitar ⭐</button>'
          : '<button class="pv-adm-btn ok"   data-uid="' + u.id + '" data-action="prem">⭐ Premium</button>',
        isAdmin
          ? '<button class="pv-adm-btn warn"   data-uid="' + u.id + '" data-action="rem-admin">Quitar admin</button>'
          : '<button class="pv-adm-btn brand"  data-uid="' + u.id + '" data-action="mk-admin">Hacer admin</button>',
        isSusp
          ? '<button class="pv-adm-btn ok"     data-uid="' + u.id + '" data-action="unsuspend">Reactivar</button>'
          : '<button class="pv-adm-btn warn"   data-uid="' + u.id + '" data-action="suspend">Suspender</button>',
        '<button class="pv-adm-btn"    data-uid="' + u.id + '" data-action="reset-pwd">Reset pwd</button>',
        '<button class="pv-adm-btn danger" data-uid="' + u.id + '" data-action="delete" data-email="' + email + '">Eliminar</button>'
      ].join('');

      return '<tr>'
        + '<td style="font-size:12px">' + email + '</td>'
        + '<td>' + name + '</td>'
        + '<td>' + roleBadge + '</td>'
        + '<td style="font-size:12px">' + joined + '</td>'
        + '<td><div class="pv-adm-btns-wrap">' + btns + '</div></td>'
        + '</tr>';
    }).join('');

    el.innerHTML = '<h2>👥 Usuarios (' + users.length + ')</h2>'
      + '<div style="overflow-x:auto"><table class="pv-adm-table">'
      + '<thead><tr><th>Email</th><th>Nombre</th><th>Rol / Estado</th><th>Alta</th><th>Acciones</th></tr></thead>'
      + '<tbody>' + rows + '</tbody>'
      + '</table></div>';

    el.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const orig = btn.innerHTML;
        btn.disabled = true; btn.innerHTML = '⏳';
        doUserAction(btn.dataset.uid, btn.dataset.action, btn, orig, btn.dataset.email);
      });
    });
  }


  // ── Acciones sobre usuarios ────────────────────────────────────────────────
  async function doUserAction(uid, action, btn, orig, email) {
    const restore = () => { btn.innerHTML = orig; btn.disabled = false; };

    if (action === 'prem' || action === 'unprem') {
      const val = action === 'prem';
      const { ok } = await supa('/rest/v1/profiles?id=eq.' + uid, {
        method: 'PATCH', body: JSON.stringify({ is_premium: val }), headers: { 'Prefer': 'return=minimal' }
      });
      if (ok) { toast(val ? '⭐ Premium activado' : 'Premium removido', 'ok'); return loadData(); }
      toast('Error al actualizar premium', 'err'); return restore();
    }

    if (action === 'mk-admin' || action === 'rem-admin') {
      const msg = action === 'mk-admin' ? 'Hacer ADMIN a este usuario?' : 'Quitar permisos de admin?';
      if (!confirm(msg)) return restore();
      const act = action === 'mk-admin' ? 'make_admin' : 'remove_admin';
      const { ok, data } = await supa('/rest/v1/rpc/admin_set_user_status', {
        method: 'POST', body: JSON.stringify({ p_user_id: uid, p_action: act })
      });
      if (ok) { toast('Rol actualizado', 'ok'); return loadData(); }
      toast('Error: ' + (data?.message || 'desconocido'), 'err'); return restore();
    }

    if (action === 'suspend' || action === 'unsuspend') {
      if (action === 'suspend' && !confirm('Suspender este usuario?')) return restore();
      const { ok, data } = await supa('/rest/v1/rpc/admin_set_user_status', {
        method: 'POST', body: JSON.stringify({ p_user_id: uid, p_action: action })
      });
      if (ok) { toast(action === 'suspend' ? 'Usuario suspendido' : 'Usuario reactivado', 'ok'); return loadData(); }
      toast('Error: ' + (data?.message || 'desconocido'), 'err'); return restore();
    }

    if (action === 'reset-pwd') {
      const pwd = prompt('Nueva contraseña (mín. 8 caracteres):');
      if (!pwd) return restore();
      if (pwd.length < 8) { alert('Mínimo 8 caracteres.'); return restore(); }
      const { ok, data } = await supa('/rest/v1/rpc/admin_reset_user_password', {
        method: 'POST', body: JSON.stringify({ p_user_id: uid, p_new_password: pwd })
      });
      if (ok) { toast('Contraseña reseteada', 'ok'); return restore(); }
      toast('Error: ' + (data?.message || 'no se pudo'), 'err'); return restore();
    }

    if (action === 'delete') {
      if (!confirm('Eliminar al usuario "' + (email || uid) + '"?\nEsta acción borra perfil + cuenta. No se puede deshacer.')) return restore();
      const { ok, data } = await supa('/rest/v1/rpc/admin_delete_user', {
        method: 'POST', body: JSON.stringify({ p_user_id: uid })
      });
      if (ok && data && data.ok) {
        toast('✅ Usuario eliminado', 'ok'); return loadData();
      }
      const errMsg = (data && (data.error || data.message)) || ('HTTP ' + (ok ? 'ok/sin data' : 'error'));
      toast('Error eliminando: ' + errMsg, 'err'); return restore();
    }

    restore();
  }


  // ── Iglesias propuestas ────────────────────────────────────────────────────
  function renderIglesias(churches) {
    const el = qs('#pv-adm-iglesias', panel); if (!el) return;
    if (!churches.length) {
      el.innerHTML = '<h2>⛪ Iglesias propuestas</h2><div class="pv-adm-empty">Sin iglesias propuestas. ✓</div>';
      return;
    }
    let rows = churches.map(c => {
      const name    = esc(c.name     || c.nombre       || '—').slice(0, 40);
      const city    = esc(c.city     || c.ciudad        || '—').slice(0, 20);
      const addr    = esc(c.address  || c.direccion     || '—').slice(0, 40);
      const contact = esc(c.contact  || c.contacto      || c.phone || '—').slice(0, 30);
      const status  = c.status       || c.estado        || 'pendiente';
      const ts      = fmtDate(c.created_at);
      const id      = c.id;
      const statusBadge = status === 'approved'
        ? '<span style="color:#22c55e;font-weight:900">✓ Aprobada</span>'
        : status === 'rejected'
          ? '<span style="color:#fb7185;font-weight:900">✗ Rechazada</span>'
          : '<span style="color:#fbbf24;font-weight:900">⏳ Pendiente</span>';

      const btns = status !== 'approved'
        ? '<button class="pv-adm-btn ok"     data-igl-id="' + id + '" data-igl-action="approve">✓ Aprobar</button> '
          + '<button class="pv-adm-btn danger" data-igl-id="' + id + '" data-igl-action="reject">✗ Rechazar</button>'
        : '<button class="pv-adm-btn danger" data-igl-id="' + id + '" data-igl-action="reject">✗ Rechazar</button>';

      return '<tr>'
        + '<td>' + name + '</td>'
        + '<td>' + city + '</td>'
        + '<td style="font-size:11px">' + addr + '</td>'
        + '<td style="font-size:11px">' + contact + '</td>'
        + '<td>' + statusBadge + '</td>'
        + '<td style="font-size:11px">' + ts + '</td>'
        + '<td><div class="pv-adm-btns-wrap">' + btns + '</div></td>'
        + '</tr>';
    }).join('');

    el.innerHTML = '<h2>⛪ Iglesias propuestas (' + churches.length + ')</h2>'
      + '<div style="overflow-x:auto"><table class="pv-adm-table">'
      + '<thead><tr><th>Nombre</th><th>Ciudad</th><th>Dirección</th><th>Contacto</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr></thead>'
      + '<tbody>' + rows + '</tbody>'
      + '</table></div>';

    el.querySelectorAll('[data-igl-action]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id      = btn.dataset.iglId;
        const action  = btn.dataset.iglAction;
        const orig    = btn.innerHTML;
        btn.disabled  = true; btn.innerHTML = '⏳';
        const status  = action === 'approve' ? 'approved' : 'rejected';
        const { ok, data } = await supa('/rest/v1/churches?id=eq.' + id, {
          method: 'PATCH', body: JSON.stringify({ status }), headers: { 'Prefer': 'return=minimal' }
        });
        if (ok) { toast(action === 'approve' ? '⛪ Iglesia aprobada' : 'Iglesia rechazada', 'ok'); return loadData(); }
        toast('Error: ' + (data?.message || 'desconocido'), 'err');
        btn.innerHTML = orig; btn.disabled = false;
      });
    });
  }


  // ── Errores ────────────────────────────────────────────────────────────────
  function renderErrores(errors) {
    const el = qs('#pv-adm-errores', panel); if (!el) return;
    if (!errors.length) {
      el.innerHTML = '<h2>🐛 Errores recientes</h2><div class="pv-adm-ok-box">✓ Sin errores recientes.</div>';
      return;
    }
    const rows = errors.map(e => {
      const ts  = e.created_at ? new Date(e.created_at).toLocaleString('es-AR') : '—';
      const msg = esc(e.message || e.error || '').slice(0, 90);
      const usr = esc(e.user_email || e.user_id || 'anon').slice(0, 26);
      return '<tr><td style="font-size:11px">' + ts + '</td><td style="font-size:11px">' + usr + '</td><td style="font-family:monospace;font-size:11px">' + msg + '</td></tr>';
    }).join('');
    el.innerHTML = '<h2>🐛 Errores recientes (' + errors.length + ')</h2>'
      + '<div style="overflow-x:auto"><table class="pv-adm-table">'
      + '<thead><tr><th>Fecha</th><th>Usuario</th><th>Error</th></tr></thead>'
      + '<tbody>' + rows + '</tbody></table></div>';
  }

  // ── Sugerencias ────────────────────────────────────────────────────────────
  function renderSugerencias(suggestions) {
    const el = qs('#pv-adm-sugerencias', panel); if (!el) return;
    if (!suggestions.length) {
      el.innerHTML = '<h2>💌 Sugerencias</h2><div class="pv-adm-empty">Sin sugerencias.</div>';
      return;
    }
    const rows = suggestions.map(s => {
      const ts  = fmtDate(s.created_at);
      const txt = esc(s.text || s.content || s.suggestion || '').slice(0, 140);
      const usr = esc(s.user_email || s.user_id || 'anon').slice(0, 26);
      return '<tr><td>' + ts + '</td><td style="font-size:11px">' + usr + '</td><td>' + txt + '</td></tr>';
    }).join('');
    el.innerHTML = '<h2>💌 Sugerencias (' + suggestions.length + ')</h2>'
      + '<div style="overflow-x:auto"><table class="pv-adm-table">'
      + '<thead><tr><th>Fecha</th><th>Usuario</th><th>Mensaje</th></tr></thead>'
      + '<tbody>' + rows + '</tbody></table></div>';
  }

  // ── Donaciones ─────────────────────────────────────────────────────────────
  function renderDonaciones(donations) {
    const el = qs('#pv-adm-donaciones', panel); if (!el) return;
    if (!donations.length) {
      el.innerHTML = '<h2>💛 Donaciones</h2><div class="pv-adm-empty">Sin donaciones registradas.</div>';
      return;
    }
    const total = donations.reduce((s, x) => s + (Number(x.amount) || 0), 0);
    const rows  = donations.map(d => {
      const ts  = fmtDate(d.created_at);
      const usr = esc(d.user_email || d.user_id || 'anon').slice(0, 26);
      const amt = esc((d.currency || '$') + ' ' + (d.amount || 0));
      const st  = esc(d.status || '—');
      return '<tr><td>' + ts + '</td><td style="font-size:11px">' + usr + '</td><td><strong>' + amt + '</strong></td><td>' + st + '</td></tr>';
    }).join('');
    el.innerHTML = '<h2>💛 Donaciones (' + donations.length + ' · Total: $' + total + ')</h2>'
      + '<div style="overflow-x:auto"><table class="pv-adm-table">'
      + '<thead><tr><th>Fecha</th><th>Usuario</th><th>Monto</th><th>Estado</th></tr></thead>'
      + '<tbody>' + rows + '</tbody></table></div>';
  }

  // ── Peticiones de oración ──────────────────────────────────────────────────
  function renderPrayers(prayers) {
    const el = qs('#pv-adm-prayers', panel); if (!el) return;
    if (!prayers.length) {
      el.innerHTML = '<h2>🙏 Peticiones de oración</h2><div class="pv-adm-empty">Sin peticiones.</div>';
      return;
    }
    const rows = prayers.map(p => {
      const ts     = fmtDate(p.created_at);
      const name   = esc(p.display_name || 'Anónimo/a').slice(0, 30);
      const cat    = esc(p.category || 'general');
      const txt    = esc(p.request_text || '').slice(0, 150);
      const status = p.status || 'pending';
      const id     = p.id;
      const statusBadge = status === 'approved'
        ? '<span style="color:#22c55e;font-weight:900">✓ Aprobada</span>'
        : status === 'rejected'
          ? '<span style="color:#fb7185;font-weight:900">✗ Rechazada</span>'
          : '<span style="color:#fbbf24;font-weight:900">⏳ Pendiente</span>';
      const btns = status !== 'approved'
        ? '<button class="pv-adm-btn ok"     data-pray-id="' + id + '" data-pray-action="approve">✓ Aprobar</button> '
          + '<button class="pv-adm-btn danger" data-pray-id="' + id + '" data-pray-action="reject">✗ Rechazar</button>'
        : '<button class="pv-adm-btn danger" data-pray-id="' + id + '" data-pray-action="reject">✗ Rechazar</button>';
      return '<tr>'
        + '<td style="font-size:11px">' + ts + '</td>'
        + '<td>' + name + '</td>'
        + '<td style="font-size:11px">' + cat + '</td>'
        + '<td>' + txt + '</td>'
        + '<td>' + statusBadge + '</td>'
        + '<td><div class="pv-adm-btns-wrap">' + btns + '</div></td>'
        + '</tr>';
    }).join('');
    el.innerHTML = '<h2>🙏 Peticiones de oración (' + prayers.length + ')</h2>'
      + '<div style="overflow-x:auto"><table class="pv-adm-table">'
      + '<thead><tr><th>Fecha</th><th>Nombre</th><th>Categoría</th><th>Petición</th><th>Estado</th><th>Acciones</th></tr></thead>'
      + '<tbody>' + rows + '</tbody></table></div>';

    el.querySelectorAll('[data-pray-action]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id     = btn.dataset.prayId;
        const action = btn.dataset.prayAction;
        const orig   = btn.innerHTML;
        btn.disabled = true; btn.innerHTML = '⏳';
        const body = action === 'approve'
          ? JSON.stringify({ status: 'approved', approved_at: new Date().toISOString() })
          : JSON.stringify({ status: 'rejected' });
        const { ok, data } = await supa('/rest/v1/prayer_requests?id=eq.' + id, {
          method: 'PATCH', body, headers: { 'Prefer': 'return=minimal' }
        });
        if (ok) { toast(action === 'approve' ? '🙏 Petición aprobada' : 'Petición rechazada', 'ok'); return loadData(); }
        toast('Error: ' + (data?.message || 'desconocido'), 'err');
        btn.innerHTML = orig; btn.disabled = false;
      });
    });
  }

  // ── Hash auto-open ─────────────────────────────────────────────────────────
  function tryHash() {
    if (location.hash === '#admin' || location.hash === '#/admin') {
      history.replaceState(null, '', location.pathname);
      openPanel().catch(e => console.error('[Admin] hash open fallo:', e));
    }
  }
  window.addEventListener('hashchange', tryHash);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tryHash);
  else tryHash();

  console.log('[Admin] pv-admin.js v14 OK — window.PVAdmin listo');
})();

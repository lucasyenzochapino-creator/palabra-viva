/* Palabra Viva — Panel de Administración (reescrito limpio v13) */
(() => {
  'use strict';

  const SUPA_URL = 'https://fuxojzmwyyecefxczfrn.supabase.co';
  const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1eG9qem13eXllY2VmeGN6ZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTU4MDAsImV4cCI6MjA5NTAzMTgwMH0.M4telJzC3kt7fNN86kvuqpL5-vVmCjdzE-hTDy6Igak';

  const qs  = (s, r = document) => r.querySelector(s);
  const esc = s => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmtDate     = s => s ? new Date(s).toLocaleDateString('es-AR')  : '—';
  const fmtDatetime = s => s ? new Date(s).toLocaleString('es-AR')      : '—';
  const getToken    = ()  => window.PVAuth?.getToken?.() || '';

  // ── Exponer API pública LO ANTES POSIBLE (antes de cualquier await) ────────
  // Así el FAB siempre encuentra window.PVAdmin, aunque algo más abajo falle.
  window.PVAdmin = {
    open: () => openPanel().catch(e => {
      console.error('[Admin] openPanel falló:', e);
      showErrBanner('Error abriendo panel: ' + (e?.message || 'desconocido'));
    })
  };

  function showErrBanner(msg) {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:9999999;background:#7f1d1d;color:#fff;padding:14px 20px;border-radius:12px;font-weight:700;font-size:14px;max-width:90vw;text-align:center;pointer-events:auto';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 6000);
  }

  // ── Fetch autenticado con timeout 12s ──────────────────────────────────────
  async function supa(path, opts = {}) {
    if (window.PVAuth?.isTokenExpired?.()) {
      try { await window.PVAuth.refreshSession?.(); } catch {}
    }
    const token = getToken();
    const headers = {
      'apikey': SUPA_KEY,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(opts.headers || {})
    };
    const ctrl  = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    try {
      const res  = await fetch(`${SUPA_URL}${path}`, { ...opts, headers, signal: ctrl.signal });
      clearTimeout(timer);
      const data = await res.json().catch(() => ({}));
      return { ok: res.ok, status: res.status, data };
    } catch (e) {
      clearTimeout(timer);
      return { ok: false, status: 0, data: { message: e?.name === 'AbortError' ? 'Tiempo agotado (12s)' : (e.message || 'Error de red') } };
    }
  }

  // ── Inyectar CSS ───────────────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('pv-admin-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-admin-style';
    st.textContent = [
      '.pv-adm-panel{position:fixed;inset:0;z-index:999999;background:var(--bg,#0a0a0f);overflow-y:auto;padding:14px 14px calc(80px + env(safe-area-inset-bottom));color:var(--text,#f8fafc);font-family:var(--font-sans,Inter,sans-serif)}',
      '.pv-adm-inner{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:16px}',
      '.pv-adm-head{display:flex;justify-content:space-between;align-items:center;gap:12px;position:sticky;top:0;background:var(--bg,#0a0a0f);z-index:2;padding:10px 0 14px;border-bottom:1px solid var(--line,#333447)}',
      '.pv-adm-head h1{margin:0;font-size:24px;letter-spacing:-.03em}',
      '.pv-adm-close{border:1px solid var(--line,#333447);background:var(--card,#171722);color:var(--text,#f8fafc);border-radius:999px;padding:9px 16px;font-weight:900;cursor:pointer;font-size:14px;font-family:inherit}',
      '.pv-adm-section{border:1px solid var(--line,#333447);background:var(--card,#171722);border-radius:22px;padding:16px}',
      '.pv-adm-section h2{margin:0 0 14px;font-size:19px;letter-spacing:-.02em}',
      '.pv-adm-stat{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:10px}',
      '.pv-adm-stat-box{background:var(--card2,#202031);border-radius:16px;padding:14px;text-align:center}',
      '.pv-adm-stat-n{font-size:28px;font-weight:900;line-height:1}',
      '.pv-adm-stat-l{font-size:12px;color:var(--muted,#c8c5d8);margin-top:4px}',
      '.pv-adm-table{width:100%;border-collapse:collapse;font-size:14px}',
      '.pv-adm-table th{text-align:left;font-size:12px;color:var(--muted,#c8c5d8);text-transform:uppercase;letter-spacing:.06em;padding:6px 8px;border-bottom:1px solid var(--line,#333447)}',
      '.pv-adm-table td{padding:10px 8px;border-bottom:1px solid var(--line,#333447);vertical-align:middle}',
      '.pv-adm-table tr:last-child td{border-bottom:0}',
      '.pv-adm-badge{display:inline-block;font-size:11px;font-weight:900;padding:3px 8px;border-radius:999px}',
      '.pv-adm-badge.admin{background:linear-gradient(135deg,#f59e0b,#ec4899);color:#fff}',
      '.pv-adm-badge.user{background:var(--card2,#202031);color:var(--muted,#c8c5d8);border:1px solid var(--line,#333447)}',
      '.pv-adm-badge.premium{background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff}',
      '.pv-adm-btn-sm{border:1px solid var(--line,#333447);background:var(--card2,#202031);color:var(--text,#f8fafc);border-radius:999px;padding:5px 12px;font-size:12px;font-weight:900;cursor:pointer;white-space:nowrap;font-family:inherit}',
      '.pv-adm-btn-sm:disabled{opacity:.5;cursor:not-allowed}',
      '.pv-adm-btn-sm.danger{border-color:rgba(251,113,133,.5);color:#fb7185;background:rgba(251,113,133,.08)}',
      '.pv-adm-spin{text-align:center;color:var(--muted,#c8c5d8);padding:22px;font-size:15px}',
      '.pv-adm-empty{text-align:center;color:var(--muted,#c8c5d8);padding:20px;font-size:14px}',
      '.pv-adm-err{color:#fda4af;background:rgba(251,113,133,.1);border:1px solid rgba(251,113,133,.3);border-radius:12px;padding:12px;font-size:14px}',
      '.pv-adm-ok{color:#86efac;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.3);border-radius:12px;padding:12px;font-size:14px}',
      '.pv-adm-warn{color:#fbbf24;background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.3);border-radius:12px;padding:12px;font-size:14px}',
      '@media(max-width:440px){.pv-adm-stat{grid-template-columns:1fr 1fr}.pv-adm-table th:nth-child(3),.pv-adm-table td:nth-child(3){display:none}}'
    ].join('');
    document.head.appendChild(st);
  }

  // ── Estado ─────────────────────────────────────────────────────────────────
  let panel = null;

  // ── Abrir panel ────────────────────────────────────────────────────────────
  async function openPanel() {
    injectStyles();
    if (panel) { panel.remove(); panel = null; }

    panel = document.createElement('section');
    panel.className = 'pv-adm-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Panel de administracion');

    const sections = ['resumen','salud','usuarios','errores','sugerencias','donaciones','prayers','churches'];
    const titles   = ['📊 Resumen','📡 Salud del sistema','👥 Usuarios','🚨 Errores','💌 Sugerencias','💛 Donaciones','🙏 Peticiones de oracion','⛪ Iglesias propuestas'];

    panel.innerHTML = '<div class="pv-adm-inner">'
      + '<div class="pv-adm-head"><h1>⚙️ Panel Admin</h1><button class="pv-adm-close" id="pv-adm-close-btn">Cerrar ✕</button></div>'
      + sections.map((id, i) => '<div class="pv-adm-section" id="pv-adm-' + id + '"><h2>' + titles[i] + '</h2><div class="pv-adm-spin">⏳ Cargando…</div></div>').join('')
      + '</div>';

    document.body.appendChild(panel);
    document.body.style.overflow = 'hidden';

    qs('#pv-adm-close-btn', panel).addEventListener('click', () => closePanel());

    const onKey = e => { if (e.key === 'Escape') closePanel(); };
    document.addEventListener('keydown', onKey);

    try { history.pushState({ pvAdmin: true }, '', location.href.split('#')[0] + '#admin'); } catch {}
    const onPop = () => { window.removeEventListener('popstate', onPop); document.removeEventListener('keydown', onKey); if (panel) closePanel(false); };
    window.addEventListener('popstate', onPop);

    await loadData();
  }

  function closePanel(withHistory = true) {
    if (!panel) return;
    panel.remove();
    panel = null;
    document.body.style.overflow = '';
    if (withHistory && location.hash === '#admin') {
      window._pvPanelClosing = true;
      try { history.back(); } catch {}
    }
  }

  // ── Cargar datos ───────────────────────────────────────────────────────────
  async function loadData() {
    if (!panel) return;

    const { ok, data, status } = await supa('/rest/v1/rpc/admin_get_dashboard', { method: 'POST', body: '{}' });
    if (!panel) return;

    if (!ok || !data || typeof data !== 'object' || Array.isArray(data)) {
      const msg = data?.message || data?.error || ('HTTP ' + status);
      const errHtml = '<div class="pv-adm-err" style="margin-top:4px">⚠️ No se pudo cargar.<br><small>' + esc(msg) + '</small><br>'
        + '<button onclick="location.reload()" style="margin-top:10px;background:#f59e0b;color:#000;border:0;border-radius:999px;padding:8px 16px;cursor:pointer;font-weight:700">🔄 Recargar app</button></div>';
      ['resumen','salud','usuarios','errores','sugerencias','donaciones','prayers','churches'].forEach(id => {
        const el = qs('#pv-adm-' + id, panel);
        if (el) { const h2 = el.querySelector('h2'); el.innerHTML = ''; if (h2) el.appendChild(h2); el.insertAdjacentHTML('beforeend', errHtml); }
      });
      return;
    }

    const users       = Array.isArray(data.users)       ? data.users       : [];
    const donations   = Array.isArray(data.donations)   ? data.donations   : [];
    const errors      = Array.isArray(data.errors)      ? data.errors      : [];
    const prayers     = Array.isArray(data.prayers)     ? data.prayers     : [];
    const suggestions = Array.isArray(data.suggestions) ? data.suggestions : [];
    const churches    = Array.isArray(data.churches)    ? data.churches    : [];
    const pushSubs    = Array.isArray(data.push_subs)   ? data.push_subs   : [];
    const stats       = data.stats || {};

    renderResumen(users, donations, pushSubs, stats);
    renderSalud(pushSubs);
    renderUsuarios(users);
    renderErrores(errors);
    renderSugerencias(suggestions);
    renderDonaciones(donations);
    renderPrayers(prayers);
    renderChurches(churches);
  }

  // ── Render: Resumen ────────────────────────────────────────────────────────
  function renderResumen(users, donations, pushSubs, stats) {
    const el = qs('#pv-adm-resumen', panel); if (!el) return;
    const admins = users.filter(u => u.role === 'admin').length;
    const prems  = users.filter(u => u.is_premium).length;
    el.innerHTML = '<h2>📊 Resumen</h2>'
      + '<div class="pv-adm-stat">'
      + box(users.length, 'Usuarios') + box(prems, 'Premium') + box(pushSubs.length, 'Push activos')
      + box(donations.length, 'Donaciones') + box(admins, 'Admins') + box(stats.total_users || users.length, 'Total DB')
      + '</div>';
  }
  function box(n, label) {
    return '<div class="pv-adm-stat-box"><div class="pv-adm-stat-n">' + n + '</div><div class="pv-adm-stat-l">' + label + '</div></div>';
  }

  // ── Render: Salud del sistema ──────────────────────────────────────────────
  function renderSalud(pushSubs) {
    const el = qs('#pv-adm-salud', panel); if (!el) return;
    const total   = pushSubs.length;
    const active  = pushSubs.filter(s => s.active !== false).length;
    const now     = Date.now();
    const last24h = pushSubs.filter(s => s.last_sent_at && (now - new Date(s.last_sent_at).getTime()) < 86400000).length;
    const lastTs  = pushSubs.reduce((mx, s) => { if (!s.last_sent_at) return mx; const t = new Date(s.last_sent_at).getTime(); return t > mx ? t : mx; }, 0);
    const hrs     = lastTs ? Math.round((now - lastTs) / 3600000) : -1;
    let alertHtml = '';
    if (total === 0)    alertHtml = '<div class="pv-adm-err" style="margin-top:10px">🚨 Sin suscripciones push activas</div>';
    else if (hrs > 30)  alertHtml = '<div class="pv-adm-warn" style="margin-top:10px">⚠️ Hace ' + hrs + 'h sin envío de push</div>';
    else if (lastTs)    alertHtml = '<div class="pv-adm-ok" style="margin-top:10px">✓ Sistema OK — último push hace ' + hrs + 'h</div>';
    el.innerHTML = '<h2>📡 Salud del sistema</h2>'
      + '<div class="pv-adm-stat">' + box(total,'Suscripciones') + box(active,'Activas') + box(last24h,'Envíos 24h') + '</div>'
      + alertHtml
      + '<div style="margin-top:10px;font-size:11px;text-align:right"><a href="https://supabase.com/dashboard/project/fuxojzmwyyecefxczfrn/functions/send-daily-push/logs" target="_blank" style="color:#f59e0b">Ver logs Edge Function ↗</a></div>';
  }


  async function doUserAction(uid, action, btn, orig) {
    if (action === "prem") {
      const { ok } = await supa("/rest/v1/profiles?id=eq."+uid, {method:"PATCH",body:JSON.stringify({is_premium:true}),headers:{"Prefer":"return=minimal"}});
      if (ok) return setTimeout(loadData, 600);
    } else if (action === "unprem") {
      const { ok } = await supa("/rest/v1/profiles?id=eq."+uid, {method:"PATCH",body:JSON.stringify({is_premium:false}),headers:{"Prefer":"return=minimal"}});
      if (ok) return setTimeout(loadData, 600);
    } else if (action === "mk-admin") {
      if (!confirm("Hacer ADMIN a este usuario?")) { btn.innerHTML = orig; btn.disabled = false; return; }
      const { ok, data } = await supa("/rest/v1/rpc/admin_set_user_status", {method:"POST",body:JSON.stringify({p_user_id:uid,p_action:"make_admin"})});
      if (ok) return setTimeout(loadData, 600);
      alert("Error: "+(data?.message||"desconocido"));
    } else if (action === "rem-admin") {
      if (!confirm("Quitar permisos de admin?")) { btn.innerHTML = orig; btn.disabled = false; return; }
      const { ok, data } = await supa("/rest/v1/rpc/admin_set_user_status", {method:"POST",body:JSON.stringify({p_user_id:uid,p_action:"remove_admin"})});
      if (ok) return setTimeout(loadData, 600);
      alert("Error: "+(data?.message||"desconocido"));
    } else if (action === "suspend") {
      if (!confirm("Suspender este usuario?")) { btn.innerHTML = orig; btn.disabled = false; return; }
      const { ok, data } = await supa("/rest/v1/rpc/admin_set_user_status", {method:"POST",body:JSON.stringify({p_user_id:uid,p_action:"suspend"})});
      if (ok) return setTimeout(loadData, 600);
      alert("Error: "+(data?.message||"desconocido"));
    } else if (action === "unsuspend") {
      const { ok, data } = await supa("/rest/v1/rpc/admin_set_user_status", {method:"POST",body:JSON.stringify({p_user_id:uid,p_action:"unsuspend"})});
      if (ok) return setTimeout(loadData, 600);
      alert("Error: "+(data?.message||"desconocido"));
    } else if (action === "reset-pwd") {
      const pwd = prompt("Nueva contrasena para este usuario (min. 8 caracteres):");
      if (!pwd) { btn.innerHTML = orig; btn.disabled = false; return; }
      if (pwd.length < 8) { alert("Minimo 8 caracteres."); btn.innerHTML = orig; btn.disabled = false; return; }
      const { ok, data } = await supa("/rest/v1/rpc/admin_reset_user_password", {method:"POST",body:JSON.stringify({p_user_id:uid,p_new_password:pwd})});
      if (ok) { alert("Contrasena reseteada."); btn.innerHTML = orig; btn.disabled = false; return; }
      alert("Error: "+(data?.message||"no se pudo"));
    }
    btn.innerHTML = orig; btn.disabled = false;
  }



  function renderUsuarios(d) {
    const el = document.getElementById("pv-adm-usuarios");
    if (!el) return;
    const users = d.users || [];
    if (!users.length) { el.innerHTML = "<h2>👥 Usuarios</h2><p>Sin usuarios.</p>"; return; }
    el.innerHTML = "<h2>👥 Usuarios (" + users.length + ")</h2>" + buildTable(users);
    bindBtns(el);
  }

  function buildTable(users) {
    let rows = users.map(function(u) {
      const role   = u.role === "admin" ? "<b>admin</b>" : u.role || "user";
      const prem   = u.is_premium ? "⭐" : "";
      const susp   = u.suspended ? "🚫" : "";
      const email  = (u.email || "").slice(0, 28);
      const name   = (u.display_name || u.username || "—").slice(0, 20);
      const joined = u.created_at ? new Date(u.created_at).toLocaleDateString("es-AR") : "—";

      const btns = []
        .concat(u.is_premium
          ? ["<button class='pv-adm-btn' data-uid='"+u.id+"' data-action='unprem'>Quitar prem</button>"]
          : ["<button class='pv-adm-btn pv-adm-btn-ok' data-uid='"+u.id+"' data-action='prem'>⭐ Prem</button>"])
        .concat(u.role === "admin"
          ? ["<button class='pv-adm-btn pv-adm-btn-warn' data-uid='"+u.id+"' data-action='rem-admin'>Quitar admin</button>"]
          : ["<button class='pv-adm-btn' data-uid='"+u.id+"' data-action='mk-admin'>Hacer admin</button>"])
        .concat(u.suspended
          ? ["<button class='pv-adm-btn pv-adm-btn-ok' data-uid='"+u.id+"' data-action='unsuspend'>Reactivar</button>"]
          : ["<button class='pv-adm-btn pv-adm-btn-warn' data-uid='"+u.id+"' data-action='suspend'>Suspender</button>"])
        .concat(["<button class='pv-adm-btn' data-uid='"+u.id+"' data-action='reset-pwd'>Reset pwd</button>"]);

      return "<tr><td>"+email+"</td><td>"+name+"</td><td>"+role+"</td><td>"+prem+""+susp+"</td><td>"+joined+"</td><td>"+btns.join(" ")+"</td></tr>";
    }).join("");

    return "<div style='overflow-x:auto'><table class='pv-adm-table'>"
      + "<thead><tr><th>Email</th><th>Nombre</th><th>Rol</th><th>Estado</th><th>Alta</th><th>Acciones</th></tr></thead>"
      + "<tbody>" + rows + "</tbody>"
      + "</table></div>";
  }

  function bindBtns(container) {
    container.querySelectorAll("[data-action]").forEach(function(btn) {
      btn.addEventListener("click", function() {
        const uid    = btn.dataset.uid;
        const action = btn.dataset.action;
        const orig   = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = "⏳";
        doUserAction(uid, action, btn, orig);
      });
    });
  }


  function renderErrores(d) {
    const el = document.getElementById("pv-adm-errores");
    if (!el) return;
    const errors = d.errors || [];
    if (!errors.length) { el.innerHTML = "<h2>🐛 Errores</h2><p>Sin errores recientes. ✓</p>"; return; }
    let rows = errors.map(function(e) {
      const ts  = e.created_at ? new Date(e.created_at).toLocaleString("es-AR") : "—";
      const msg = (e.message || e.error || "").slice(0, 80);
      const usr = (e.user_email || e.user_id || "anon").slice(0, 24);
      return "<tr><td>"+ts+"</td><td>"+usr+"</td><td style='font-family:monospace;font-size:11px'>"+msg+"</td></tr>";
    }).join("");
    el.innerHTML = "<h2>🐛 Errores (" + errors.length + ")</h2>"
      + "<div style='overflow-x:auto'><table class='pv-adm-table'>"
      + "<thead><tr><th>Fecha</th><th>Usuario</th><th>Error</th></tr></thead>"
      + "<tbody>" + rows + "</tbody></table></div>";
  }

  function renderSugerencias(d) {
    const el = document.getElementById("pv-adm-sugerencias");
    if (!el) return;
    const sugs = d.suggestions || [];
    if (!sugs.length) { el.innerHTML = "<h2>💡 Sugerencias</h2><p>Sin sugerencias.</p>"; return; }
    let rows = sugs.map(function(s) {
      const ts   = s.created_at ? new Date(s.created_at).toLocaleDateString("es-AR") : "—";
      const txt  = (s.text || s.content || s.suggestion || "").slice(0, 120);
      const usr  = (s.user_email || s.user_id || "anon").slice(0, 24);
      return "<tr><td>"+ts+"</td><td>"+usr+"</td><td>"+txt+"</td></tr>";
    }).join("");
    el.innerHTML = "<h2>💡 Sugerencias (" + sugs.length + ")</h2>"
      + "<div style='overflow-x:auto'><table class='pv-adm-table'>"
      + "<thead><tr><th>Fecha</th><th>Usuario</th><th>Sugerencia</th></tr></thead>"
      + "<tbody>" + rows + "</tbody></table></div>";
  }

  function renderDonaciones(d) {
    const el = document.getElementById("pv-adm-donaciones");
    if (!el) return;
    const dons = d.donations || [];
    if (!dons.length) { el.innerHTML = "<h2>💰 Donaciones</h2><p>Sin donaciones registradas.</p>"; return; }
    const total = dons.reduce(function(s, x) { return s + (Number(x.amount) || 0); }, 0);
    let rows = dons.map(function(don) {
      const ts  = don.created_at ? new Date(don.created_at).toLocaleDateString("es-AR") : "—";
      const usr = (don.user_email || don.user_id || "anon").slice(0, 24);
      const amt = (don.currency || "$") + " " + (don.amount || 0);
      const st  = don.status || "—";
      return "<tr><td>"+ts+"</td><td>"+usr+"</td><td>"+amt+"</td><td>"+st+"</td></tr>";
    }).join("");
    el.innerHTML = "<h2>💰 Donaciones (" + dons.length + " | Total: $" + total + ")</h2>"
      + "<div style='overflow-x:auto'><table class='pv-adm-table'>"
      + "<thead><tr><th>Fecha</th><th>Usuario</th><th>Monto</th><th>Estado</th></tr></thead>"
      + "<tbody>" + rows + "</tbody></table></div>";
  }


  function renderPrayers(d) {
    const el = document.getElementById("pv-adm-prayers");
    if (!el) return;
    const prayers = d.prayers || [];
    if (!prayers.length) { el.innerHTML = "<h2>🙏 Oraciones</h2><p>Sin oraciones registradas.</p>"; return; }
    let rows = prayers.map(function(p) {
      const ts  = p.created_at ? new Date(p.created_at).toLocaleDateString("es-AR") : "—";
      const usr = (p.user_email || p.user_id || "anon").slice(0, 24);
      const txt = (p.text || p.content || p.prayer || "").slice(0, 100);
      return "<tr><td>"+ts+"</td><td>"+usr+"</td><td>"+txt+"</td></tr>";
    }).join("");
    el.innerHTML = "<h2>🙏 Oraciones (" + prayers.length + ")</h2>"
      + "<div style='overflow-x:auto'><table class='pv-adm-table'>"
      + "<thead><tr><th>Fecha</th><th>Usuario</th><th>Oración</th></tr></thead>"
      + "<tbody>" + rows + "</tbody></table></div>";
  }

  function renderChurches(d) {
    const el = document.getElementById("pv-adm-iglesias");
    if (!el) return;
    const churches = d.churches || [];
    if (!churches.length) { el.innerHTML = "<h2>⛪ Iglesias</h2><p>Sin iglesias registradas.</p>"; return; }
    let rows = churches.map(function(c) {
      const name = (c.name || c.nombre || "—").slice(0, 40);
      const city = (c.city || c.ciudad || "—").slice(0, 20);
      const ts   = c.created_at ? new Date(c.created_at).toLocaleDateString("es-AR") : "—";
      const mbrs = c.member_count || c.members || 0;
      return "<tr><td>"+name+"</td><td>"+city+"</td><td>"+mbrs+"</td><td>"+ts+"</td></tr>";
    }).join("");
    el.innerHTML = "<h2>⛪ Iglesias (" + churches.length + ")</h2>"
      + "<div style='overflow-x:auto'><table class='pv-adm-table'>"
      + "<thead><tr><th>Nombre</th><th>Ciudad</th><th>Miembros</th><th>Alta</th></tr></thead>"
      + "<tbody>" + rows + "</tbody></table></div>";
  }


  // Auto-open via URL hash
  function tryOpenByHash() {
    if (location.hash === "#admin" || location.hash === "#/admin") {
      history.replaceState(null, "", location.pathname);
      openPanel().catch(function(e) {
        console.error("[Admin] auto-open por hash fallo:", e);
      });
    }
  }

  window.addEventListener("hashchange", function() {
    if (location.hash === "#admin" || location.hash === "#/admin") {
      history.replaceState(null, "", location.pathname);
      openPanel().catch(function(e) {
        console.error("[Admin] hashchange open fallo:", e);
      });
    }
  });

  // Try on load in case page loaded with #admin hash
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tryOpenByHash);
  } else {
    tryOpenByHash();
  }

  console.log("[Admin] pv-admin.js v13 listo — window.PVAdmin expuesto");

})();

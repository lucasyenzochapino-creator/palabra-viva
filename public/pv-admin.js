(() => {
  // ── Palabra Viva — Panel de administración ────────────────────────────────
  // Solo accesible para usuarios con role='admin' en la tabla profiles
  const SUPA_URL = 'https://fuxojzmwyyecefxczfrn.supabase.co';
  const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1eG9qem13eXllY2VmeGN6ZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTU4MDAsImV4cCI6MjA5NTAzMTgwMH0.M4telJzC3kt7fNN86kvuqpL5-vVmCjdzE-hTDy6Igak';

  const $ = (s, r = document) => r.querySelector(s);

  // ── Fetch autenticado ─────────────────────────────────────────────────────
  function getToken() { return window.PVAuth?.getToken?.() || ''; }

  async function supa(path, opts = {}) {
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
    return { ok: res.ok, data };
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
        <div class="pv-adm-section" id="pv-adm-usuarios">
          <h2>👥 Usuarios</h2>
          <div class="pv-adm-spin">⏳ Cargando…</div>
        </div>
        <div class="pv-adm-section" id="pv-adm-donaciones">
          <h2>💛 Donaciones</h2>
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

    // Cargar usuarios
    const { ok: usOk, data: usData } = await supa('/rest/v1/profiles?select=id,email,display_name,role,is_premium,created_at&order=created_at.desc&limit=200');
    const users = usOk && Array.isArray(usData) ? usData : [];

    // Cargar donaciones
    const { ok: donOk, data: donData } = await supa('/rest/v1/donations?select=*&order=created_at.desc&limit=100');
    const donations = donOk && Array.isArray(donData) ? donData : [];

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

    // ── Usuarios ──
    const usEl = $('#pv-adm-usuarios', panel);
    if (!users.length) {
      usEl.innerHTML = '<h2>👥 Usuarios</h2><div class="pv-adm-empty">No hay usuarios registrados todavía.</div>';
    } else {
      usEl.innerHTML = `<h2>👥 Usuarios <span style="font-size:13px;color:var(--muted,#c8c5d8);font-weight:400">(${users.length})</span></h2>
        <div style="overflow-x:auto">
        <table class="pv-adm-table">
          <thead><tr>
            <th>Email</th>
            <th>Rol</th>
            <th>Registrado</th>
            <th>Acciones</th>
          </tr></thead>
          <tbody>
          ${users.map(u => `<tr data-uid="${u.id}">
            <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${u.email || '—'}</td>
            <td>
              <span class="pv-adm-badge ${u.role}">${u.role === 'admin' ? '👑 Admin' : 'Usuario'}</span>
              ${u.is_premium ? '<span class="pv-adm-badge premium" style="margin-left:4px">⭐ Premium</span>' : ''}
            </td>
            <td style="font-size:12px;color:var(--muted,#c8c5d8)">${u.created_at ? new Date(u.created_at).toLocaleDateString('es-AR') : '—'}</td>
            <td>
              <div style="display:flex;gap:6px;flex-wrap:wrap">
                ${!u.is_premium ? `<button class="pv-adm-btn-sm" data-prem="${u.id}">⭐ Premium</button>` : `<button class="pv-adm-btn-sm danger" data-unprem="${u.id}">Quitar premium</button>`}
              </div>
            </td>
          </tr>`).join('')}
          </tbody>
        </table></div>`;

      // Botones acciones
      usEl.querySelectorAll('[data-prem]').forEach(btn => {
        btn.addEventListener('click', async () => {
          const uid = btn.dataset.prem;
          btn.disabled = true; btn.textContent = '⏳';
          const { ok } = await supa(`/rest/v1/profiles?id=eq.${uid}`, {
            method: 'PATCH',
            body: JSON.stringify({ is_premium: true }),
            headers: { 'Prefer': 'return=minimal' }
          });
          if (ok) { btn.textContent = '✅'; setTimeout(loadData, 800); }
          else { btn.textContent = '❌ Error'; btn.disabled = false; }
        });
      });
      usEl.querySelectorAll('[data-unprem]').forEach(btn => {
        btn.addEventListener('click', async () => {
          const uid = btn.dataset.unprem;
          btn.disabled = true; btn.textContent = '⏳';
          const { ok } = await supa(`/rest/v1/profiles?id=eq.${uid}`, {
            method: 'PATCH',
            body: JSON.stringify({ is_premium: false }),
            headers: { 'Prefer': 'return=minimal' }
          });
          if (ok) { btn.textContent = '✅'; setTimeout(loadData, 800); }
          else { btn.textContent = '❌ Error'; btn.disabled = false; }
        });
      });
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
  }

  // ── API pública ────────────────────────────────────────────────────────────
  window.PVAdmin = { open: openPanel };
})();

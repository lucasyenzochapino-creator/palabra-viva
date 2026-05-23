(() => {
  // ── Palabra Viva — Autenticación con Supabase ──────────────────────────────
  const SUPA_URL = 'https://fuxojzmwyyecefxczfrn.supabase.co';
  const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1eG9qem13eXllY2VmeGN6ZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTU4MDAsImV4cCI6MjA5NTAzMTgwMH0.M4telJzC3kt7fNN86kvuqpL5-vVmCjdzE-hTDy6Igak';
  const SESSION_KEY = 'pv_session';

  // ── Helpers ────────────────────────────────────────────────────────────────
  const $ = (s, r = document) => r.querySelector(s);
  const lsGet = (k, fb) => { try { return JSON.parse(localStorage.getItem(k) || JSON.stringify(fb)); } catch { return fb; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

  function getSession() { return lsGet(SESSION_KEY, null); }
  function getUser()    { return getSession()?.user || null; }
  function getToken()   { return getSession()?.access_token || ''; }
  function isAdmin()    { return getUser()?.profile?.role === 'admin'; }

  async function authFetch(path, opts = {}) {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
      'apikey': SUPA_KEY,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(opts.headers || {})
    };
    const res = await fetch(`${SUPA_URL}${path}`, { ...opts, headers });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  }

  async function fetchProfile(userId, token) {
    const res = await fetch(
      `${SUPA_URL}/rest/v1/profiles?id=eq.${userId}&select=*`,
      { headers: { 'apikey': SUPA_KEY, 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } }
    );
    if (!res.ok) return null;
    const rows = await res.json().catch(() => []);
    return rows[0] || null;
  }

  async function signIn(email, password) {
    const { ok, data } = await authFetch('/auth/v1/token?grant_type=password', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (!ok) throw new Error(data?.error_description || data?.message || 'Error al iniciar sesión');
    const profile = await fetchProfile(data.user.id, data.access_token);
    const session = { ...data, user: { ...data.user, profile } };
    lsSet(SESSION_KEY, session);
    return session;
  }

  async function signUp(email, password, name) {
    const { ok, data } = await authFetch('/auth/v1/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, data: { display_name: name } })
    });
    if (!ok) throw new Error(data?.error_description || data?.msg || 'Error al registrarse');
    // Si ya hay sesión activa (email confirmado automáticamente)
    if (data.access_token) {
      const profile = await fetchProfile(data.user.id, data.access_token);
      const session = { ...data, user: { ...data.user, profile } };
      lsSet(SESSION_KEY, session);
      return { session, needsConfirm: false };
    }
    return { session: null, needsConfirm: true };
  }

  function signOut() {
    localStorage.removeItem(SESSION_KEY);
    document.dispatchEvent(new CustomEvent('pv-auth-change', { detail: null }));
    updateUI();
  }

  // ── Estilos ────────────────────────────────────────────────────────────────
  function injectStyles() {
    if ($('#pv-auth-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-auth-style';
    st.textContent = `
      .pv-auth-modal{position:fixed;inset:0;z-index:9500;background:rgba(0,0,0,.65);backdrop-filter:blur(6px);display:flex;align-items:flex-end;justify-content:center;padding:0 0 0 0}
      @media(min-width:520px){.pv-auth-modal{align-items:center}}
      .pv-auth-sheet{background:var(--card,#171722);border:1px solid var(--line,#333447);border-radius:28px 28px 0 0;padding:24px 20px 36px;width:100%;max-width:460px;display:flex;flex-direction:column;gap:16px;max-height:92vh;overflow-y:auto}
      @media(min-width:520px){.pv-auth-sheet{border-radius:28px;margin:16px}}
      .pv-auth-tabs{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      .pv-auth-tab{border:1px solid var(--line,#333447);background:var(--card2,#202031);color:var(--text,#f8fafc);border-radius:14px;padding:11px;font-weight:900;font-size:15px;cursor:pointer}
      .pv-auth-tab.on{background:linear-gradient(135deg,var(--brand,#f59e0b),var(--brand2,#ec4899));color:#fff;border-color:transparent}
      .pv-auth-input{width:100%;border:1px solid var(--line,#333447);background:var(--card2,#202031);color:var(--text,#f8fafc);border-radius:16px;padding:14px 16px;font:inherit;font-size:16px;outline:none;box-sizing:border-box}
      .pv-auth-input:focus{border-color:var(--brand,#f59e0b)}
      .pv-auth-label{font-size:13px;font-weight:900;color:var(--muted,#c8c5d8);text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px;display:block}
      .pv-auth-btn{width:100%;border:0;border-radius:999px;padding:15px;font-weight:900;font-size:17px;cursor:pointer;background:linear-gradient(135deg,var(--brand,#f59e0b),var(--brand2,#ec4899));color:#fff;margin-top:4px}
      .pv-auth-btn:disabled{opacity:.6;cursor:not-allowed}
      .pv-auth-err{color:#fb7185;font-size:14px;background:rgba(251,113,133,.1);border:1px solid rgba(251,113,133,.3);border-radius:12px;padding:10px 14px;display:none}
      .pv-auth-ok{color:#22c55e;font-size:14px;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.3);border-radius:12px;padding:10px 14px;display:none}
      .pv-auth-close{align-self:flex-end;border:1px solid var(--line,#333447);background:var(--card2,#202031);color:var(--text,#f8fafc);border-radius:999px;padding:7px 14px;font-weight:900;cursor:pointer}
      /* Botón de usuario en quick bar */
      .pv-user-btn{pointer-events:auto;border:1px solid var(--line,#333447);background:var(--card,#171722);color:var(--text,#f8fafc);border-radius:999px;padding:10px 14px;font-size:14px;font-weight:900;cursor:pointer;white-space:nowrap}
      .pv-user-btn.in{background:linear-gradient(135deg,rgba(245,158,11,.15),rgba(236,72,153,.15));border-color:rgba(245,158,11,.4)}
      /* Badge admin */
      .pv-admin-btn{pointer-events:auto;border:1px solid rgba(245,158,11,.5);background:linear-gradient(135deg,rgba(245,158,11,.2),rgba(236,72,153,.15));color:var(--brand,#f59e0b);border-radius:999px;padding:10px 14px;font-size:14px;font-weight:900;cursor:pointer}
    `;
    document.head.appendChild(st);
  }

  // ── Modal de auth ─────────────────────────────────────────────────────────
  function openModal() {
    if ($('.pv-auth-modal')) return;
    injectStyles();

    const modal = document.createElement('div');
    modal.className = 'pv-auth-modal';

    let tab = 'login';
    function render() {
      modal.innerHTML = `
        <div class="pv-auth-sheet" role="dialog" aria-modal="true">
          <button class="pv-auth-close" id="pv-auth-close-btn">Cerrar ✕</button>
          <h2 style="margin:0;font-size:24px;letter-spacing:-.03em">${tab === 'login' ? '👤 Iniciar sesión' : '✨ Crear cuenta'}</h2>
          <div class="pv-auth-tabs">
            <button class="pv-auth-tab ${tab==='login'?'on':''}" data-t="login">Ingresar</button>
            <button class="pv-auth-tab ${tab==='register'?'on':''}" data-t="register">Registrarse</button>
          </div>
          <div id="pv-auth-err" class="pv-auth-err"></div>
          <div id="pv-auth-ok" class="pv-auth-ok"></div>
          ${tab === 'register' ? `
            <div>
              <label class="pv-auth-label" for="pv-auth-name">Tu nombre</label>
              <input id="pv-auth-name" class="pv-auth-input" type="text" placeholder="María" autocomplete="name">
            </div>
          ` : ''}
          <div>
            <label class="pv-auth-label" for="pv-auth-email">Correo electrónico</label>
            <input id="pv-auth-email" class="pv-auth-input" type="email" placeholder="tu@correo.com" autocomplete="email">
          </div>
          <div>
            <label class="pv-auth-label" for="pv-auth-pass">Contraseña</label>
            <input id="pv-auth-pass" class="pv-auth-input" type="password" placeholder="${tab==='register'?'Mínimo 6 caracteres':'Tu contraseña'}" autocomplete="${tab==='register'?'new-password':'current-password'}">
          </div>
          <button class="pv-auth-btn" id="pv-auth-submit">${tab === 'login' ? '▶ Entrar' : '✨ Crear mi cuenta'}</button>
        </div>`;

      $('#pv-auth-close-btn', modal).onclick = closeModal;
      modal.querySelectorAll('.pv-auth-tab').forEach(b => b.addEventListener('click', () => { tab = b.dataset.t; render(); }));
      modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

      const errEl = () => $('#pv-auth-err', modal);
      const okEl  = () => $('#pv-auth-ok',  modal);
      const showErr = msg => { const e = errEl(); e.textContent = msg; e.style.display = 'block'; };
      const showOk  = msg => { const e = okEl();  e.textContent = msg; e.style.display = 'block'; };

      $('#pv-auth-submit', modal).addEventListener('click', async () => {
        const btn = $('#pv-auth-submit', modal);
        btn.disabled = true;
        btn.textContent = '⏳ Procesando…';
        errEl().style.display = 'none';
        okEl().style.display = 'none';

        const email = $('#pv-auth-email', modal)?.value?.trim() || '';
        const pass  = $('#pv-auth-pass',  modal)?.value || '';
        const name  = $('#pv-auth-name',  modal)?.value?.trim() || '';

        if (!email || !pass) { showErr('Completá el correo y la contraseña.'); btn.disabled = false; btn.textContent = tab==='login'?'▶ Entrar':'✨ Crear mi cuenta'; return; }

        try {
          if (tab === 'login') {
            await signIn(email, pass);
            document.dispatchEvent(new CustomEvent('pv-auth-change', { detail: getSession() }));
            updateUI();
            closeModal();
          } else {
            if (pass.length < 6) { showErr('La contraseña debe tener al menos 6 caracteres.'); btn.disabled = false; btn.textContent = '✨ Crear mi cuenta'; return; }
            const { needsConfirm } = await signUp(email, pass, name);
            if (needsConfirm) {
              showOk('✅ ¡Registrada! Revisá tu correo para confirmar tu cuenta, luego iniciá sesión.');
              btn.textContent = '✉️ Revisá tu correo';
            } else {
              document.dispatchEvent(new CustomEvent('pv-auth-change', { detail: getSession() }));
              updateUI();
              closeModal();
            }
          }
        } catch (err) {
          showErr(err.message || 'Ocurrió un error. Intentá nuevamente.');
          btn.disabled = false;
          btn.textContent = tab==='login'?'▶ Entrar':'✨ Crear mi cuenta';
        }
      });

      // Enter para enviar
      modal.querySelectorAll('.pv-auth-input').forEach(inp => {
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') $('#pv-auth-submit', modal)?.click(); });
      });

      setTimeout(() => $('#pv-auth-email', modal)?.focus(), 80);
    }

    function closeModal() { modal.remove(); }

    render();
    document.body.appendChild(modal);
    history.pushState({ pvAuthModal: true }, '', location.href.split('#')[0] + '#auth');
    const onPop = () => { modal.remove(); };
    window.addEventListener('popstate', onPop, { once: true });
  }

  // ── Actualizar botón de usuario en quick bar ───────────────────────────────
  function updateUI() {
    injectStyles();
    const quick = document.querySelector('.quick');
    if (!quick) return;

    // Limpiar botones previos
    quick.querySelectorAll('.pv-user-btn, .pv-admin-btn').forEach(b => b.remove());

    const user = getUser();
    if (!user) {
      const btn = document.createElement('button');
      btn.className = 'pv-user-btn';
      btn.textContent = '👤 Entrar';
      btn.onclick = openModal;
      quick.appendChild(btn);
    } else {
      const name = user.profile?.display_name || user.email?.split('@')[0] || 'Vos';
      const btn = document.createElement('button');
      btn.className = 'pv-user-btn in';
      btn.innerHTML = `👤 ${name}`;
      btn.onclick = () => {
        if (confirm(`¿Cerrar sesión de ${name}?`)) signOut();
      };
      quick.appendChild(btn);

      if (isAdmin()) {
        const adminBtn = document.createElement('button');
        adminBtn.className = 'pv-admin-btn';
        adminBtn.textContent = '⚙️ Admin';
        adminBtn.onclick = () => window.PVAdmin?.open?.();
        quick.appendChild(adminBtn);
      }
    }
  }

  // ── Boot ───────────────────────────────────────────────────────────────────
  function boot() {
    injectStyles();
    updateUI();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.addEventListener('load', boot);
  setInterval(() => {
    const quick = document.querySelector('.quick');
    if (quick && !quick.querySelector('.pv-user-btn')) updateUI();
  }, 1200);

  // ── API pública ───────────────────────────────────────────────────────────
  window.PVAuth = {
    getSession,
    getUser,
    getToken,
    isAdmin,
    signOut,
    openModal
  };
})();

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
    // 1) Intentar con RPC get_my_profile (SECURITY DEFINER) — bypassea RLS y
    //    siempre devuelve el profile del current user, sin importar policies.
    try {
      const res = await fetch(`${SUPA_URL}/rest/v1/rpc/get_my_profile`, {
        method: 'POST',
        headers: {
          'apikey': SUPA_KEY,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: '{}'
      });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data && typeof data === 'object') return data;
      }
    } catch (e) { console.warn('[Auth] RPC get_my_profile falló, probando SELECT directo'); }
    // 2) Fallback: SELECT directo a la tabla (depende de RLS)
    try {
      const res = await fetch(
        `${SUPA_URL}/rest/v1/profiles?id=eq.${userId}&select=*`,
        { headers: { 'apikey': SUPA_KEY, 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } }
      );
      if (!res.ok) return null;
      const rows = await res.json().catch(() => []);
      return rows[0] || null;
    } catch { return null; }
  }

  // Refresca el profile del usuario logueado actualmente. Útil tras un cambio
  // de role en server o si la sesión guardada quedó vieja. Si detecta que el
  // role cambió, dispara pv-auth-change para que la UI se redibuje.
  async function refreshProfile() {
    const session = getSession();
    if (!session || !session.user?.id || !session.access_token) return null;
    const profile = await fetchProfile(session.user.id, session.access_token);
    if (!profile) return null;
    const oldRole = session.user.profile?.role;
    const newRole = profile.role;
    session.user.profile = profile;
    lsSet(SESSION_KEY, session);
    if (oldRole !== newRole) {
      console.log('[Auth] role cambió:', oldRole, '→', newRole, '— refrescando UI');
      document.dispatchEvent(new CustomEvent('pv-auth-change', { detail: session }));
      updateUI();
    }
    return profile;
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
    // Caso 1: Supabase devolvió access_token (email confirmation desactivado)
    if (data.access_token) {
      const profile = await fetchProfile(data.user.id, data.access_token);
      const session = { ...data, user: { ...data.user, profile } };
      lsSet(SESSION_KEY, session);
      return { session, needsConfirm: false };
    }
    // Caso 2: No vino access_token. Nuestro trigger auth.users auto-confirma
    // el email, así que intentamos hacer signIn con las mismas credenciales.
    // Si funciona, queda logueado al toque sin ver el correo de confirmación.
    try {
      const session = await signIn(email, password);
      return { session, needsConfirm: false };
    } catch {
      // Si falla, la confirmación está habilitada y el trigger no corrió
      // (raro). Pedimos al usuario que confirme su correo.
      return { session: null, needsConfirm: true };
    }
  }

  async function signOut() {
    // Antes de limpiar sesión, desactivar push de ESTE dispositivo en el server
    // (sino seguiría recibiendo notificaciones de la cuenta que cerró sesión)
    try {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          // Marcar como inactivo en server
          const token = getToken();
          if (token) {
            await fetch(`${SUPA_URL}/rest/v1/push_subscriptions?endpoint=eq.${encodeURIComponent(sub.endpoint)}`, {
              method: 'PATCH',
              headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
              body: JSON.stringify({ active: false })
            }).catch(() => {});
          }
          // También desuscribirse del browser
          await sub.unsubscribe().catch(() => {});
        }
      }
    } catch (e) { console.warn('[Auth] No se pudo limpiar push al cerrar sesión:', e); }
    try { localStorage.removeItem('pv-push-sub-saved'); } catch {}

    localStorage.removeItem(SESSION_KEY);
    document.dispatchEvent(new CustomEvent('pv-auth-change', { detail: null }));
    updateUI();
  }

  // ── Recuperación de contraseña ─────────────────────────────────────────────
  // Manda email con link mágico. Supabase redirige a SITE_URL configurada
  // en el dashboard (típicamente la URL de producción de Vercel).
  async function sendRecovery(email) {
    const redirectTo = location.origin + '/';
    const { ok, data } = await authFetch('/auth/v1/recover', {
      method: 'POST',
      body: JSON.stringify({ email, gotrue_meta_security: {}, redirect_to: redirectTo })
    });
    if (!ok) throw new Error(data?.error_description || data?.message || 'No pudimos enviar el correo. Verificá el email.');
    return true;
  }

  // Setea nueva contraseña usando un access_token de recovery.
  async function setNewPassword(accessToken, newPassword) {
    const res = await fetch(`${SUPA_URL}/auth/v1/user`, {
      method: 'PUT',
      headers: {
        'apikey': SUPA_KEY,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password: newPassword })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error_description || data?.message || 'No pudimos cambiar la contraseña.');
    return data;
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
      /* Contraseña con ojo para mostrar/ocultar */
      .pv-auth-pass-wrap{position:relative}
      .pv-auth-pass-wrap .pv-auth-input{padding-right:54px}
      .pv-auth-pass-eye{position:absolute;right:8px;top:50%;transform:translateY(-50%);background:transparent;border:0;cursor:pointer;font-size:22px;padding:8px 10px;line-height:1;color:var(--muted,#c8c5d8);border-radius:12px}
      .pv-auth-pass-eye:hover{background:var(--card2,#202031)}
      .pv-auth-label{font-size:13px;font-weight:900;color:var(--muted,#c8c5d8);text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px;display:block}
      .pv-auth-btn{width:100%;border:0;border-radius:999px;padding:15px;font-weight:900;font-size:17px;cursor:pointer;background:linear-gradient(135deg,var(--brand,#f59e0b),var(--brand2,#ec4899));color:#fff;margin-top:4px}
      .pv-auth-btn:disabled{opacity:.6;cursor:not-allowed}
      .pv-auth-err{color:#fb7185;font-size:14px;background:rgba(251,113,133,.1);border:1px solid rgba(251,113,133,.3);border-radius:12px;padding:10px 14px;display:none}
      .pv-auth-ok{color:#22c55e;font-size:14px;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.3);border-radius:12px;padding:10px 14px;display:none}
      .pv-auth-close{align-self:flex-end;border:1px solid var(--line,#333447);background:var(--card2,#202031);color:var(--text,#f8fafc);border-radius:999px;padding:7px 14px;font-weight:900;cursor:pointer}
      .pv-auth-link{background:none;border:0;color:var(--brand,#f59e0b);font-size:14px;font-weight:700;cursor:pointer;text-decoration:underline;text-underline-offset:3px;padding:6px;align-self:center}
      /* Botón de usuario en quick bar */
      .pv-user-btn{pointer-events:auto;border:1px solid var(--line,#333447);background:var(--card,#171722);color:var(--text,#f8fafc);border-radius:999px;padding:10px 14px;font-size:14px;font-weight:900;cursor:pointer;white-space:nowrap}
      .pv-user-btn.in{background:linear-gradient(135deg,rgba(245,158,11,.15),rgba(236,72,153,.15));border-color:rgba(245,158,11,.4)}
      /* Badge admin */
      .pv-admin-btn{pointer-events:auto;border:1px solid rgba(245,158,11,.5);background:linear-gradient(135deg,rgba(245,158,11,.2),rgba(236,72,153,.15));color:var(--brand,#f59e0b);border-radius:999px;padding:10px 14px;font-size:14px;font-weight:900;cursor:pointer}
      /* Menú desplegable del usuario */
      .pv-user-menu-backdrop{position:fixed;inset:0;z-index:9400;background:transparent}
      .pv-user-menu{position:fixed;z-index:9401;background:var(--card,#171722);border:1px solid var(--line,#333447);border-radius:16px;padding:6px;min-width:200px;box-shadow:0 18px 50px rgba(0,0,0,.5);display:flex;flex-direction:column;gap:2px}
      .pv-user-menu-header{padding:10px 12px;border-bottom:1px solid var(--line,#333447);margin-bottom:4px}
      .pv-user-menu-name{font-weight:900;font-size:14px;color:var(--text,#f8fafc);margin:0}
      .pv-user-menu-email{font-size:12px;color:var(--muted,#c8c5d8);margin:2px 0 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .pv-user-menu-item{background:none;border:0;text-align:left;padding:12px 14px;border-radius:10px;cursor:pointer;color:var(--text,#f8fafc);font-size:15px;font-weight:700;display:flex;align-items:center;gap:10px}
      .pv-user-menu-item:hover{background:var(--card2,#202031)}
      .pv-user-menu-item.danger{color:#fb7185}
      .pv-user-menu-item.danger:hover{background:rgba(251,113,133,.1)}
    `;
    document.head.appendChild(st);
  }

  // ── Modal de auth ─────────────────────────────────────────────────────────
  // Modos: 'login' | 'register' | 'forgot' | 'reset'
  function openModal(initialTab = 'login', initialMeta = {}) {
    if ($('.pv-auth-modal')) return;
    injectStyles();

    const modal = document.createElement('div');
    modal.className = 'pv-auth-modal';

    let tab = initialTab;
    let resetToken = initialMeta.resetToken || '';   // para modo 'reset' tras email
    function render() {
      const titles = {
        login:    '👤 Iniciar sesión',
        register: '✨ Crear cuenta',
        forgot:   '🔑 Recuperar contraseña',
        reset:    '🔐 Nueva contraseña'
      };
      modal.innerHTML = `
        <div class="pv-auth-sheet" role="dialog" aria-modal="true">
          <button class="pv-auth-close" id="pv-auth-close-btn">Cerrar ✕</button>
          <h2 style="margin:0;font-size:24px;letter-spacing:-.03em">${titles[tab]}</h2>
          ${(tab==='login'||tab==='register') ? `
            <div class="pv-auth-tabs">
              <button class="pv-auth-tab ${tab==='login'?'on':''}" data-t="login">Ingresar</button>
              <button class="pv-auth-tab ${tab==='register'?'on':''}" data-t="register">Registrarse</button>
            </div>
          ` : ''}
          <div id="pv-auth-err" class="pv-auth-err"></div>
          <div id="pv-auth-ok" class="pv-auth-ok"></div>
          ${tab === 'register' ? `
            <div>
              <label class="pv-auth-label" for="pv-auth-name">Tu nombre</label>
              <input id="pv-auth-name" class="pv-auth-input" type="text" placeholder="María" autocomplete="name">
            </div>
          ` : ''}
          ${(tab==='login'||tab==='register'||tab==='forgot') ? `
            <div>
              <label class="pv-auth-label" for="pv-auth-email">Correo electrónico</label>
              <input id="pv-auth-email" class="pv-auth-input" type="email" placeholder="tu@correo.com" autocomplete="email">
            </div>
          ` : ''}
          ${(tab==='login'||tab==='register') ? `
            <div>
              <div style="display:flex;justify-content:space-between;align-items:baseline">
                <label class="pv-auth-label" for="pv-auth-pass">Contraseña</label>
                ${tab==='login' ? `<button class="pv-auth-link" data-go="forgot" style="font-size:13px;padding:0">¿Olvidaste tu contraseña?</button>` : ''}
              </div>
              <div class="pv-auth-pass-wrap">
                <input id="pv-auth-pass" class="pv-auth-input" type="password" placeholder="${tab==='register'?'Mínimo 6 caracteres':'Tu contraseña'}" autocomplete="${tab==='register'?'new-password':'current-password'}">
                <button class="pv-auth-pass-eye" type="button" data-eye="pv-auth-pass" title="Mostrar contraseña" aria-label="Mostrar contraseña">👁</button>
              </div>
            </div>
          ` : ''}
          ${tab==='reset' ? `
            <p style="font-size:13px;color:var(--muted,#c8c5d8);margin:0">Ingresá tu nueva contraseña. Mínimo 6 caracteres.</p>
            <div>
              <label class="pv-auth-label" for="pv-auth-newpass">Nueva contraseña</label>
              <div class="pv-auth-pass-wrap">
                <input id="pv-auth-newpass" class="pv-auth-input" type="password" autocomplete="new-password">
                <button class="pv-auth-pass-eye" type="button" data-eye="pv-auth-newpass" title="Mostrar contraseña" aria-label="Mostrar contraseña">👁</button>
              </div>
            </div>
            <div>
              <label class="pv-auth-label" for="pv-auth-newpass2">Confirmá tu nueva contraseña</label>
              <div class="pv-auth-pass-wrap">
                <input id="pv-auth-newpass2" class="pv-auth-input" type="password" autocomplete="new-password">
                <button class="pv-auth-pass-eye" type="button" data-eye="pv-auth-newpass2" title="Mostrar contraseña" aria-label="Mostrar contraseña">👁</button>
              </div>
            </div>
          ` : ''}
          ${tab==='forgot' ? `<p style="font-size:13px;color:var(--muted,#c8c5d8);margin:0">Te enviamos un correo con un link para crear una contraseña nueva.</p>` : ''}
          <button class="pv-auth-btn" id="pv-auth-submit">${
            tab==='login'    ? '▶ Entrar' :
            tab==='register' ? '✨ Crear mi cuenta' :
            tab==='forgot'   ? '📧 Enviarme el link' :
                               '🔐 Guardar contraseña'
          }</button>
          ${(tab==='forgot'||tab==='reset') ? `<button class="pv-auth-link" data-go="login">← Volver a iniciar sesión</button>` : ''}
        </div>`;

      $('#pv-auth-close-btn', modal).onclick = closeModal;
      modal.querySelectorAll('.pv-auth-tab').forEach(b => b.addEventListener('click', () => { tab = b.dataset.t; render(); }));
      modal.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => { tab = b.dataset.go; render(); }));
      // 👁 Toggle de visibilidad de contraseña
      modal.querySelectorAll('[data-eye]').forEach(btn => {
        btn.addEventListener('click', () => {
          const inp = $('#' + btn.dataset.eye, modal);
          if (!inp) return;
          const showing = inp.type === 'text';
          inp.type = showing ? 'password' : 'text';
          btn.textContent = showing ? '👁' : '🙈';
          btn.title = showing ? 'Mostrar contraseña' : 'Ocultar contraseña';
        });
      });
      modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

      const errEl = () => $('#pv-auth-err', modal);
      const okEl  = () => $('#pv-auth-ok',  modal);
      const showErr = msg => { const e = errEl(); e.textContent = msg; e.style.display = 'block'; };
      const showOk  = msg => { const e = okEl();  e.textContent = msg; e.style.display = 'block'; };
      const restoreBtn = (btn) => {
        btn.disabled = false;
        btn.textContent =
          tab==='login'    ? '▶ Entrar' :
          tab==='register' ? '✨ Crear mi cuenta' :
          tab==='forgot'   ? '📧 Enviarme el link' :
                             '🔐 Guardar contraseña';
      };

      $('#pv-auth-submit', modal).addEventListener('click', async () => {
        const btn = $('#pv-auth-submit', modal);
        btn.disabled = true;
        btn.textContent = '⏳ Procesando…';
        errEl().style.display = 'none';
        okEl().style.display = 'none';

        const email = $('#pv-auth-email', modal)?.value?.trim() || '';
        const pass  = $('#pv-auth-pass',  modal)?.value || '';
        const name  = $('#pv-auth-name',  modal)?.value?.trim() || '';
        const np1   = $('#pv-auth-newpass',  modal)?.value || '';
        const np2   = $('#pv-auth-newpass2', modal)?.value || '';

        try {
          if (tab === 'login') {
            if (!email || !pass) throw new Error('Completá el correo y la contraseña.');
            await signIn(email, pass);
            document.dispatchEvent(new CustomEvent('pv-auth-change', { detail: getSession() }));
            updateUI();
            closeModal();
          } else if (tab === 'register') {
            if (!email || !pass) throw new Error('Completá el correo y la contraseña.');
            if (pass.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.');
            const { needsConfirm } = await signUp(email, pass, name);
            if (needsConfirm) {
              showOk('✅ ¡Registrada! Revisá tu correo para confirmar tu cuenta, luego iniciá sesión.');
              btn.textContent = '✉️ Revisá tu correo';
            } else {
              document.dispatchEvent(new CustomEvent('pv-auth-change', { detail: getSession() }));
              updateUI();
              closeModal();
            }
          } else if (tab === 'forgot') {
            if (!email) throw new Error('Ingresá tu correo.');
            await sendRecovery(email);
            showOk('📧 Listo. Si el correo está registrado, te llegará un mensaje con un link para crear una contraseña nueva. Revisá también la carpeta de spam.');
            btn.textContent = '✅ Enviado';
          } else if (tab === 'reset') {
            if (!resetToken) throw new Error('Link inválido. Pedí otro correo de recuperación.');
            if (np1.length < 6) throw new Error('Mínimo 6 caracteres.');
            if (np1 !== np2)    throw new Error('Las contraseñas no coinciden.');
            await setNewPassword(resetToken, np1);
            // Limpiar el hash y mostrar OK
            try { history.replaceState(null, '', location.pathname); } catch {}
            showOk('✅ ¡Contraseña actualizada! Ya podés iniciar sesión.');
            setTimeout(() => { tab = 'login'; resetToken = ''; render(); }, 1200);
          }
        } catch (err) {
          showErr(err.message || 'Ocurrió un error. Intentá nuevamente.');
          restoreBtn(btn);
        }
      });

      // Enter para enviar
      modal.querySelectorAll('.pv-auth-input').forEach(inp => {
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') $('#pv-auth-submit', modal)?.click(); });
      });

      setTimeout(() => ($('#pv-auth-email', modal) || $('#pv-auth-newpass', modal))?.focus(), 80);
    }

    function closeModal() {
      window.removeEventListener('popstate', onPop);
      modal.remove();
      if (location.hash === '#auth') { window._pvPanelClosing = true; history.back(); }
    }
    const onPop = () => { window.removeEventListener('popstate', onPop); modal.remove(); };

    render();
    document.body.appendChild(modal);
    history.pushState({ pvAuthModal: true }, '', location.href.split('#')[0] + '#auth');
    window.addEventListener('popstate', onPop);
  }

  // ── Menú desplegable del usuario (con opción CERRAR SESIÓN visible) ───────
  function openUserMenu(anchorBtn, name) {
    // Si ya existe, lo cerramos (toggle)
    if (document.querySelector('.pv-user-menu')) {
      document.querySelector('.pv-user-menu-backdrop')?.remove();
      document.querySelector('.pv-user-menu')?.remove();
      return;
    }

    const user = getUser();
    const email = user?.email || '';

    // Backdrop transparente para cerrar al tocar afuera
    const backdrop = document.createElement('div');
    backdrop.className = 'pv-user-menu-backdrop';
    const closeAll = () => { backdrop.remove(); menu.remove(); };
    backdrop.onclick = closeAll;

    const menu = document.createElement('div');
    menu.className = 'pv-user-menu';
    menu.innerHTML = `
      <div class="pv-user-menu-header">
        <p class="pv-user-menu-name">👤 ${name}</p>
        <p class="pv-user-menu-email">${email}</p>
      </div>
      <button class="pv-user-menu-item" data-act="share">📤 Compartir Palabra Viva</button>
      ${isAdmin() ? `<button class="pv-user-menu-item" data-act="admin">⚙️ Panel Admin</button>` : ''}
      <button class="pv-user-menu-item danger" data-act="logout">🚪 Cerrar sesión</button>
    `;
    menu.onclick = (ev) => ev.stopPropagation();

    // Posicionar arriba del botón (porque el botón está abajo en la quick bar)
    document.body.appendChild(backdrop);
    document.body.appendChild(menu);
    const rect = anchorBtn.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    let top = rect.top - menuRect.height - 8;
    if (top < 10) top = rect.bottom + 8;        // si no entra arriba, ponerlo abajo
    let left = rect.right - menuRect.width;
    if (left < 10) left = 10;
    if (left + menuRect.width > window.innerWidth - 10) left = window.innerWidth - menuRect.width - 10;
    menu.style.top  = top + 'px';
    menu.style.left = left + 'px';

    // Handlers
    menu.querySelector('[data-act="share"]')?.addEventListener('click', () => {
      closeAll();
      shareInviteLink();
    });
    menu.querySelector('[data-act="admin"]')?.addEventListener('click', () => {
      closeAll();
      window.PVAdmin?.open?.();
    });
    menu.querySelector('[data-act="logout"]').addEventListener('click', () => {
      closeAll();
      if (confirm(`¿Cerrar sesión de ${name}?`)) signOut();
    });
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
      btn.innerHTML = `👤 ${name} ▾`;
      btn.onclick = (ev) => {
        ev.stopPropagation();
        openUserMenu(btn, name);
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

  // ── Detector de callback de recovery email ────────────────────────────────
  // Supabase redirige a SITE_URL + #access_token=...&type=recovery
  // Detectamos ese hash al cargar y abrimos el modal en modo 'reset'.
  function checkRecoveryCallback() {
    const hash = location.hash || '';
    if (!hash.includes('access_token=') || !hash.includes('type=recovery')) return;
    const params = new URLSearchParams(hash.replace(/^#/, ''));
    const token = params.get('access_token');
    if (!token) return;
    // Esperar a que el quick bar esté disponible (React renderice)
    const tryOpen = () => {
      if (document.querySelector('.quick') || document.body) {
        openModal('reset', { resetToken: token });
      } else {
        setTimeout(tryOpen, 300);
      }
    };
    setTimeout(tryOpen, 400);
    return true; // hubo callback de recovery
  }

  // ── Prompt automático al entrar a la app ──────────────────────────────────
  // Si no hay sesión, mostrar el modal de login UNA VEZ por sesión de navegador.
  // El usuario puede cerrarlo y seguir usando la app, pero se le pide
  // registrarse o entrar para personalizar su experiencia.
  // IMPORTANTE: Esperar a que termine el onboarding si está en pantalla
  // (sino el modal queda detrás de la overlay y el usuario nunca lo ve).
  function maybePromptLogin() {
    if (getSession()) return;                                  // ya tiene sesión
    if (sessionStorage.getItem('pv_auth_prompted')) return;    // ya se le mostró
    if (sessionStorage.getItem('pv_auth_skip_session')) return; // pidió saltar esta vez

    const tryShow = (intentos = 0) => {
      // Si hay onboarding en pantalla, esperar a que termine
      if (document.querySelector('.pv-onb-overlay')) {
        document.addEventListener('pv-onboarding-done', () => {
          setTimeout(() => maybePromptLogin(), 400);
        }, { once: true });
        return;
      }
      if (document.querySelector('.quick')) {
        sessionStorage.setItem('pv_auth_prompted', '1');
        openModal('login');
      } else if (intentos < 30) {
        setTimeout(() => tryShow(intentos + 1), 300);
      }
    };
    // Esperar onboarding si todavía no está montado pero podría estarlo
    setTimeout(tryShow, 1200);
  }

  // ── Función pública: compartir link de registro ────────────────────────────
  // Cualquier persona con el link puede entrar y registrarse libremente.
  async function shareInviteLink() {
    const url = location.origin + '/';
    const text = '✨ Te invito a Palabra Viva — Biblia, oración y radio cristiana en una app gratuita: ' + url;
    if (navigator.share) {
      try { await navigator.share({ title: 'Palabra Viva', text, url }); return; } catch {}
    }
    try {
      await navigator.clipboard.writeText(url);
      alert('📋 Link copiado al portapapeles:\n\n' + url);
    } catch {
      prompt('Copiá este link y compartilo:', url);
    }
  }

  // ── Boot ───────────────────────────────────────────────────────────────────
  function boot() {
    injectStyles();
    updateUI();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.addEventListener('load', boot);
  // Al primer load: detectar recovery callback. Si NO hay callback, pedir login.
  const initAuthFlow = () => {
    const hadRecovery = checkRecoveryCallback();
    if (!hadRecovery) maybePromptLogin();
    // Refrescar el profile en background. Si role cambió en server (admin
    // promovido recientemente), actualiza la UI sin pedir re-login.
    setTimeout(() => { refreshProfile().catch(() => {}); }, 800);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAuthFlow);
  else initAuthFlow();
  setInterval(() => {
    const quick = document.querySelector('.quick');
    if (quick && !quick.querySelector('.pv-user-btn')) updateUI();
  }, 3000);
  // Refresh periódico del profile cada 5 min (por si el admin agregó/quitó
  // permisos remotamente y el cliente sigue con la sesión vieja)
  setInterval(() => { refreshProfile().catch(() => {}); }, 5 * 60 * 1000);

  // ── API pública ───────────────────────────────────────────────────────────
  window.PVAuth = {
    getSession,
    getUser,
    getToken,
    isAdmin,
    signOut,
    openModal,
    shareInviteLink,
    refreshProfile
  };
})();

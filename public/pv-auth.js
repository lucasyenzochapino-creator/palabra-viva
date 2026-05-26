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

  // Devuelve true si el access_token está vencido o vence en menos de 1 min.
  function isTokenExpired() {
    const s = getSession();
    if (!s?.expires_at) return !!s; // sin expires_at: lo tratamos como expirado si hay sesión
    return (s.expires_at * 1000) < (Date.now() + 60000);
  }

  // Refresca el access_token usando el refresh_token. Devuelve la nueva sesión
  // o null si falló (caso: refresh_token también expiró → re-login necesario).
  async function refreshSession() {
    const s = getSession();
    if (!s?.refresh_token) return null;
    try {
      const res = await fetch(`${SUPA_URL}/auth/v1/token?grant_type=refresh_token`, {
        method: 'POST',
        headers: { 'apikey': SUPA_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: s.refresh_token })
      });
      if (!res.ok) {
        console.warn('[Auth] refresh_token rechazado:', res.status);
        return null;
      }
      const data = await res.json();
      if (!data?.access_token) return null;
      // Conservar profile cargado (sino se pierde y isAdmin retornaría false)
      const profile = s.user?.profile;
      const newSession = { ...data, user: { ...data.user, profile } };
      lsSet(SESSION_KEY, newSession);
      console.log('[Auth] token refrescado, nuevo expires_at:', data.expires_at);
      return newSession;
    } catch (e) {
      console.warn('[Auth] error refrescando token:', e);
      return null;
    }
  }

  // Garantiza un token válido. Si está expirado, intenta refrescar primero.
  async function getValidToken() {
    if (isTokenExpired()) {
      console.log('[Auth] token expirado, refrescando…');
      await refreshSession();
    }
    return getToken();
  }

  // Refresca el profile del usuario logueado actualmente. Útil tras un cambio
  // de role en server o si la sesión guardada quedó vieja. Si detecta que el
  // role cambió, dispara pv-auth-change para que la UI se redibuje.
  async function refreshProfile() {
    // Primero asegurar token válido. Si expiró, refrescar.
    if (isTokenExpired()) {
      await refreshSession();
    }
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

  // Login con Google (OAuth). Redirige al usuario a Google para autenticarse,
  // después Google redirige a la app y Supabase maneja el callback en el hash.
  // Requiere que el provider Google esté habilitado en Supabase Dashboard →
  // Authentication → Providers → Google + Client ID y Secret de Google Cloud
  // Console (instrucciones se dan al admin por separado).
  function signInWithProvider(provider) {
    const redirectTo = encodeURIComponent(location.origin + location.pathname);
    location.href = `${SUPA_URL}/auth/v1/authorize?provider=${provider}&redirect_to=${redirectTo}`;
  }

  // Cuando volvemos de Google con hash #access_token=..., extraemos la sesión
  // y la guardamos. Se llama al cargar la página si detecta ese hash.
  async function checkOAuthCallback() {
    const hash = location.hash || '';
    if (!hash.includes('access_token=')) return false;
    if (hash.includes('type=recovery')) return false; // eso lo maneja checkRecoveryCallback
    const params = new URLSearchParams(hash.replace(/^#/, ''));
    const access_token  = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    const expires_at    = parseInt(params.get('expires_at') || '0', 10) || (Math.floor(Date.now()/1000) + 3600);
    const expires_in    = parseInt(params.get('expires_in') || '3600', 10);
    if (!access_token) return false;
    try {
      // Pedimos los datos del user con el access_token
      const userRes = await fetch(`${SUPA_URL}/auth/v1/user`, {
        headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + access_token }
      });
      if (!userRes.ok) return false;
      const user = await userRes.json();
      const profile = await fetchProfile(user.id, access_token);
      const session = { access_token, refresh_token, expires_at, expires_in, token_type:'bearer', user: { ...user, profile } };
      lsSet(SESSION_KEY, session);
      // Limpiar el hash de la URL para que no quede el token visible
      history.replaceState(null, '', location.pathname + location.search);
      document.dispatchEvent(new CustomEvent('pv-auth-change', { detail: session }));
      updateUI();
      console.log('[Auth] OAuth callback OK, usuario:', user.email);
      return true;
    } catch (e) {
      console.error('[Auth] OAuth callback failed:', e);
      return false;
    }
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

    // ── SALIR de la app después de cerrar sesión ──────────────────────────
    // La dueña pidió que al cerrar sesión la app se cierre del todo, no que
    // quede en el gate de "Crear cuenta". Mostramos un splash de despedida
    // y intentamos cerrar la PWA (window.close funciona en PWAs standalone).
    showGoodbyeAndClose();
  }

  function showGoodbyeAndClose() {
    // Quitar el gate si está mostrado, así no se ve detrás del splash
    document.querySelector('.pv-gate')?.remove();
    document.body.classList.remove('pv-gate-open');

    const splash = document.createElement('div');
    splash.style.cssText = `
      position:fixed;inset:0;z-index:999999;
      background:linear-gradient(180deg,#efe4cd,#e8d8b5);
      display:flex;align-items:center;justify-content:center;flex-direction:column;
      color:#6b1f1f;text-align:center;padding:24px;
      font-family:Georgia,'Cormorant Garamond',serif;
      animation:pv-goodbye-in .35s ease-out;
    `;
    splash.innerHTML = `
      <style>
        @keyframes pv-goodbye-in { from { opacity: 0 } to { opacity: 1 } }
        body[data-theme="dark"] .pv-goodbye { background:linear-gradient(180deg,#1a1108,#2a1810)!important; color:#fbbf24!important }
      </style>
      <div style="font-size:80px;margin-bottom:8px">🙏</div>
      <h1 style="font-size:34px;margin:0 0 8px;letter-spacing:-.02em">Sesión cerrada</h1>
      <p style="font-size:16px;color:#7c6a4d;font-family:Inter,sans-serif;margin:0 0 8px;max-width:340px;line-height:1.5">
        Que la Palabra te acompañe en tu día.
      </p>
      <p style="font-size:13px;color:#7c6a4d;font-family:Inter,sans-serif;margin:0 0 30px;max-width:340px;line-height:1.5">
        Cerrando la app…
      </p>
      <button id="pv-goodbye-close" style="
        background:#6b1f1f;color:#fbf3df;border:0;border-radius:999px;
        padding:14px 32px;font-weight:700;font-size:15px;cursor:pointer;
        font-family:Inter,sans-serif;
      ">Cerrar app ahora</button>
    `;
    splash.classList.add('pv-goodbye');
    document.body.appendChild(splash);

    const tryClose = () => {
      try { window.close(); } catch {}
      // Si el window.close() no funciona (browser normal, no PWA), intentamos
      // navegar a about:blank que cierra la pestaña en muchos casos o al
      // menos deja la app efectivamente "cerrada".
      setTimeout(() => {
        try { location.replace('about:blank'); } catch {}
      }, 300);
    };

    splash.querySelector('#pv-goodbye-close').onclick = tryClose;
    // Intento automático a los 1.5s — da tiempo a leer el mensaje
    setTimeout(tryClose, 1500);
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
      /* z-index DEBE ser mayor que el del gate (99000) para que el modal de
         auth aparezca por encima cuando se llama desde la pantalla bloqueante. */
      .pv-auth-modal{position:fixed;inset:0;z-index:99500;background:rgba(0,0,0,.65);backdrop-filter:blur(6px);display:flex;align-items:flex-end;justify-content:center;padding:0 0 0 0}
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
      /* Botón "Continuar con Google" */
      .pv-auth-google{width:100%;border:1px solid var(--line,#dadce0);border-radius:999px;padding:13px 15px;font-weight:700;font-size:15px;cursor:pointer;background:#fff;color:#3c4043;display:flex;align-items:center;justify-content:center;font-family:'Roboto','Inter',sans-serif;transition:box-shadow .15s ease}
      .pv-auth-google:hover{box-shadow:0 1px 3px rgba(60,64,67,.3),0 4px 8px rgba(60,64,67,.15)}
      .pv-auth-google:disabled{opacity:.6;cursor:wait}
      body[data-theme="dark"] .pv-auth-google{background:#202124;color:#e8eaed;border-color:#5f6368}
      .pv-auth-divider{display:flex;align-items:center;gap:10px;color:var(--muted,#c8c5d8);font-size:12px;text-transform:uppercase;letter-spacing:.08em;margin:4px 0}
      .pv-auth-divider::before,.pv-auth-divider::after{content:'';flex:1;height:1px;background:var(--line,#333447)}
      .pv-auth-divider span{font-family:var(--font-sans,Inter,sans-serif);font-weight:700}
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
      .pv-user-menu-backdrop{position:fixed;inset:0;z-index:99600;background:transparent}
      .pv-user-menu{position:fixed;z-index:99601;background:var(--card,#171722);border:1px solid var(--line,#333447);border-radius:16px;padding:6px;min-width:200px;box-shadow:0 18px 50px rgba(0,0,0,.5);display:flex;flex-direction:column;gap:2px}
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
          ${(tab==='login'||tab==='register') ? `
            <button class="pv-auth-google" id="pv-auth-google" type="button">
              <svg width="20" height="20" viewBox="0 0 24 24" style="vertical-align:middle"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              <span style="margin-left:8px">Continuar con Google</span>
            </button>
            <div class="pv-auth-divider"><span>o con email</span></div>
          ` : ''}
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
      // Botón Google → redirige a OAuth
      const gBtn = $('#pv-auth-google', modal);
      if (gBtn) gBtn.addEventListener('click', () => {
        gBtn.disabled = true;
        gBtn.innerHTML = '⏳ Redirigiendo a Google…';
        signInWithProvider('google');
      });
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
  const initAuthFlow = async () => {
    // OAuth callback (volvimos de Google) — chequear primero, tiene prioridad
    const hadOAuth = await checkOAuthCallback();
    if (hadOAuth) return; // ya logueado via Google, no pedir login
    const hadRecovery = checkRecoveryCallback();
    if (!hadRecovery) maybePromptLogin();
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
    getValidToken,
    isTokenExpired,
    refreshSession,
    refreshProfile,
    isAdmin,
    signOut,
    signInWithProvider,
    openModal,
    shareInviteLink
  };
})();

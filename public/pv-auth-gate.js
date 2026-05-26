(() => {
  // ===========================================================================
  // PALABRA VIVA — Gate de autenticación para usuarios NUEVOS
  // ===========================================================================
  // Comportamiento (MODO ESTRICTO):
  //   - Usuario con sesión activa (logueado) → entra directo, sin gate.
  //   - Usuario SIN sesión → pantalla bloqueante con "Crear cuenta" o
  //     "Iniciar sesión". No puede saltarse. Aplica a TODOS — usuarios
  //     nuevos Y existentes. Para usar la app, hay que tener cuenta.
  //
  // Antes existía un flag pv-onboarded que dejaba pasar a usuarios que ya
  // habían pasado por el gate alguna vez. Se removió por pedido de la
  // dueña: "quiero que todos si si tengan que registrarse".

  const ONBOARDED_KEY = 'pv-onboarded';

  function isOnboarded() {
    try { return localStorage.getItem(ONBOARDED_KEY) === '1'; }
    catch { return false; }
  }
  function markOnboarded() {
    try { localStorage.setItem(ONBOARDED_KEY, '1'); } catch {}
  }
  function hasSession() {
    try { return !!window.PVAuth?.getUser?.(); }
    catch { return false; }
  }

  function injectStyles() {
    if (document.getElementById('pv-gate-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-gate-style';
    st.textContent = `
      .pv-gate{position:fixed;inset:0;z-index:99000;background:linear-gradient(180deg,var(--bg,#efe4cd),var(--card2,#e8d8b5));display:flex;align-items:center;justify-content:center;padding:24px;overflow-y:auto}
      body[data-theme="dark"] .pv-gate{background:linear-gradient(180deg,#1a1108,#2a1810)}
      .pv-gate-inner{max-width:460px;width:100%;text-align:center;display:flex;flex-direction:column;gap:14px}
      .pv-gate-logo{font-size:64px;line-height:1;margin-bottom:8px;filter:drop-shadow(0 4px 12px rgba(107,31,31,.2))}
      .pv-gate h1{margin:0;font-size:clamp(28px,7vw,36px);letter-spacing:-.02em;color:var(--brand,#6b1f1f);line-height:1.15;font-family:var(--font-serif,Georgia,serif)}
      body[data-theme="dark"] .pv-gate h1{color:#fbbf24}
      .pv-gate-sub{font-size:15px;color:var(--muted,#7c6a4d);line-height:1.55;margin:0;font-family:var(--font-sans,Inter,sans-serif)}
      body[data-theme="dark"] .pv-gate-sub{color:#d4c4a0}
      .pv-gate-features{background:var(--card,#fdf6ec);border:1px solid var(--line,rgba(124,74,30,.18));border-radius:18px;padding:16px;text-align:left;font-size:14px;line-height:1.65;color:var(--text,#27190c)}
      body[data-theme="dark"] .pv-gate-features{background:rgba(45,32,16,.5);color:#f5deb3;border-color:rgba(245,158,11,.3)}
      .pv-gate-features p{margin:0;font-weight:700;font-size:13px;color:var(--brand,#6b1f1f);text-transform:uppercase;letter-spacing:.06em;font-family:var(--font-sans,Inter,sans-serif)}
      body[data-theme="dark"] .pv-gate-features p{color:#fbbf24}
      .pv-gate-features ul{padding:0;margin:8px 0 0;list-style:none}
      .pv-gate-features li{padding:3px 0;display:flex;align-items:flex-start;gap:8px}
      .pv-gate-features li::before{content:'✓';color:var(--good,#5a6f48);font-weight:900;flex-shrink:0}
      .pv-gate-actions{display:flex;flex-direction:column;gap:10px;margin-top:6px}
      .pv-gate-btn{border:0;border-radius:999px;padding:14px;font-weight:800;font-size:15px;cursor:pointer;min-height:54px;font-family:var(--font-sans,Inter,sans-serif);transition:transform .12s ease}
      .pv-gate-btn:active{transform:scale(.98)}
      .pv-gate-btn.primary{background:linear-gradient(135deg,var(--brand,#6b1f1f),var(--brand2,#a47731));color:#fbf3df;box-shadow:0 8px 20px rgba(107,31,31,.25)}
      .pv-gate-btn.secondary{background:var(--card,#fdf6ec);color:var(--brand,#6b1f1f);border:2px solid var(--brand,#6b1f1f)}
      body[data-theme="dark"] .pv-gate-btn.secondary{background:transparent;color:#fbbf24;border-color:#fbbf24}
      .pv-gate-foot{font-size:11px;color:var(--muted,#7c6a4d);margin-top:4px;line-height:1.5;font-family:var(--font-sans,Inter,sans-serif)}
      .pv-gate-foot a{color:var(--brand,#6b1f1f);text-decoration:underline}
      body[data-theme="dark"] .pv-gate-foot a{color:#fbbf24}
      /* Evitar que la app se vea / scrollee detrás */
      body.pv-gate-open{overflow:hidden}
    `;
    document.head.appendChild(st);
  }

  let _shown = false;

  function showGate() {
    if (_shown) return;
    if (document.querySelector('.pv-gate')) return;
    _shown = true;
    injectStyles();
    document.body.classList.add('pv-gate-open');

    const gate = document.createElement('section');
    gate.className = 'pv-gate';
    gate.setAttribute('role', 'dialog');
    gate.setAttribute('aria-modal', 'true');
    gate.setAttribute('aria-label', 'Crear cuenta o iniciar sesión');
    gate.innerHTML = `
      <div class="pv-gate-inner">
        <div class="pv-gate-logo">✝️</div>
        <h1>Bienvenido/a a Palabra Viva</h1>
        <p class="pv-gate-sub">Para usar la app primero necesitás una cuenta. Es gratis, lleva 30 segundos y te sirve para llevar tus versículos, planes y rachas en cualquier dispositivo.</p>

        <div class="pv-gate-features">
          <p>Con tu cuenta vas a poder:</p>
          <ul>
            <li>Sincronizar versículos guardados entre tu celular y tu compu</li>
            <li>Conservar tu progreso de planes de lectura</li>
            <li>Compartir peticiones de oración con la comunidad</li>
            <li>Recibir el versículo diario por notificación</li>
            <li>Volver a entrar sin tener que cargar usuario cada vez</li>
          </ul>
        </div>

        <div class="pv-gate-actions">
          <button class="pv-gate-btn primary" data-act="register">✨ Crear cuenta gratis</button>
          <button class="pv-gate-btn secondary" data-act="login">▶ Ya tengo cuenta — Iniciar sesión</button>
        </div>

        <p class="pv-gate-foot">
          Al continuar aceptás nuestra
          <a href="#" data-act="privacy">política de privacidad</a> y
          <a href="#" data-act="terms">términos de uso</a>.<br>
          Nunca compartimos tus datos.
        </p>
      </div>
    `;
    document.body.appendChild(gate);

    gate.querySelector('[data-act="register"]').onclick = () => {
      window.PVAuth?.openModal?.('register');
    };
    gate.querySelector('[data-act="login"]').onclick = () => {
      window.PVAuth?.openModal?.('login');
    };
    gate.querySelector('[data-act="privacy"]').onclick = (e) => {
      e.preventDefault();
      window.PVLegal?.openPrivacy?.();
    };
    gate.querySelector('[data-act="terms"]').onclick = (e) => {
      e.preventDefault();
      window.PVLegal?.openTerms?.();
    };
  }

  function hideGate() {
    document.body.classList.remove('pv-gate-open');
    document.querySelector('.pv-gate')?.remove();
    _shown = false;
  }

  function evaluate() {
    if (hasSession()) {
      // Sesión activa → entrar a la app
      if (_shown) hideGate();
      return;
    }
    // SIN sesión → siempre mostrar gate bloqueante (TODOS deben registrarse)
    showGate();
  }

  // Re-evaluar cuando cambia el estado de auth
  document.addEventListener('pv-auth-change', evaluate);

  // Evaluación inicial: esperar a que PVAuth esté listo.
  // CRÍTICO: si la URL trae #access_token=... (callback de Google OAuth),
  // damos tiempo a que pv-auth.js procese ese hash y guarde la sesión.
  // Sin esto, el gate aparece por 2-3 segundos antes que checkOAuthCallback
  // termine, generando un "titileo" feo y la sensación de que algo va mal.
  function waitForAuth() {
    const hasOAuthHash = (location.hash || '').includes('access_token=');
    if (hasOAuthHash) {
      // Esperar a que checkOAuthCallback procese el hash (max 4s)
      let attempts = 0;
      const waitForSession = () => {
        attempts++;
        if (hasSession() || attempts > 40) {
          evaluate();
        } else {
          setTimeout(waitForSession, 100);
        }
      };
      waitForSession();
      return;
    }
    if (window.PVAuth && typeof window.PVAuth.getUser === 'function') {
      evaluate();
    } else {
      setTimeout(waitForAuth, 100);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForAuth);
  } else {
    waitForAuth();
  }

  // Exponer API por si después queremos disparar el gate manualmente
  window.PVAuthGate = {
    show: showGate,
    hide: hideGate,
    isOnboarded,
    markOnboarded,
    // Permite resetear el flag (útil para testing o si la usuaria quiere
    // que un dispositivo específico vuelva a ver el gate)
    reset: () => { try { localStorage.removeItem(ONBOARDED_KEY); } catch {} }
  };
})();

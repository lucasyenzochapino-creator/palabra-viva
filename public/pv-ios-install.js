(() => {
  // ===========================================================================
  // PALABRA VIVA — Prompt de instalación PWA en iOS
  // ===========================================================================
  // iOS Safari no soporta el evento "beforeinstallprompt" — el usuario debe
  // agregar la app a pantalla de inicio MANUALMENTE. Sin este prompt, el
  // usuario nunca se entera y pierde:
  // - Notificaciones push (iOS 16.4+ las habilita solo si está instalada)
  // - Modo fullscreen
  // - Acceso rápido desde el home
  //
  // Este script:
  // 1. Detecta iOS sin PWA instalada
  // 2. Después de 30s de uso (no apenas entra), muestra un modal con paso a paso
  // 3. Se puede descartar — guarda flag para no molestar de nuevo en 7 días
  //
  // En Android Chrome usa beforeinstallprompt nativo (manejo separado).

  const KEY_DISMISSED = 'pv-ios-install-dismissed';
  const KEY_SHOWN_COUNT = 'pv-ios-install-shown';
  const SHOW_DELAY_MS = 30 * 1000; // 30 segundos después de entrar
  const DISMISS_HOURS = 7 * 24;    // no molestar por 7 días

  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }
  function isAndroid() {
    return /Android/.test(navigator.userAgent);
  }
  function isPWA() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }
  function isSafari() {
    const ua = navigator.userAgent;
    return /Safari/.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS/.test(ua);
  }

  function recentlyDismissed() {
    const ts = parseInt(localStorage.getItem(KEY_DISMISSED) || '0', 10);
    if (!ts) return false;
    const hoursAgo = (Date.now() - ts) / 3600000;
    return hoursAgo < DISMISS_HOURS;
  }

  function injectStyles() {
    if (document.getElementById('pv-iosinst-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-iosinst-style';
    st.textContent = `
      .pv-iosinst-backdrop{position:fixed;inset:0;z-index:9500;background:rgba(0,0,0,.6);backdrop-filter:blur(8px);display:flex;align-items:flex-end;justify-content:center;animation:pv-iosinst-fade .25s ease-out}
      @keyframes pv-iosinst-fade{from{opacity:0}to{opacity:1}}
      .pv-iosinst-sheet{background:var(--card);color:var(--text);border:1px solid var(--line);border-top-left-radius:28px;border-top-right-radius:28px;padding:22px 18px calc(26px + env(safe-area-inset-bottom));width:100%;max-width:520px;box-shadow:0 -20px 60px rgba(0,0,0,.5);animation:pv-iosinst-up .3s ease-out;max-height:85vh;overflow-y:auto}
      @keyframes pv-iosinst-up{from{transform:translateY(60px)}to{transform:none}}
      .pv-iosinst-handle{width:48px;height:4px;background:var(--line);border-radius:99px;margin:0 auto 14px}
      .pv-iosinst-icon{font-size:48px;text-align:center;margin-bottom:8px;line-height:1}
      .pv-iosinst-title{margin:0 0 8px;font-size:22px;text-align:center;letter-spacing:-.02em;color:var(--brand)}
      .pv-iosinst-sub{margin:0 0 18px;font-size:14px;text-align:center;color:var(--muted);line-height:1.5;font-family:var(--font-sans)}
      .pv-iosinst-steps{background:var(--card2);border-radius:16px;padding:14px;margin-bottom:14px}
      .pv-iosinst-step{display:flex;gap:12px;align-items:flex-start;padding:8px 0;border-bottom:1px dashed var(--line)}
      .pv-iosinst-step:last-child{border-bottom:0}
      .pv-iosinst-step .num{flex-shrink:0;width:28px;height:28px;background:var(--brand);color:#fbf3df;border-radius:50%;font-weight:900;display:flex;align-items:center;justify-content:center;font-size:14px}
      .pv-iosinst-step .t{flex:1;font-size:14px;line-height:1.5}
      .pv-iosinst-step .t strong{color:var(--brand)}
      .pv-iosinst-step .icon{font-size:24px;flex-shrink:0;margin-top:2px}
      .pv-iosinst-bonus{background:rgba(164,119,49,.10);border:1px dashed rgba(164,119,49,.4);border-radius:12px;padding:10px 12px;font-size:13px;line-height:1.5;margin-bottom:14px;color:var(--text)}
      .pv-iosinst-bonus strong{color:var(--accent)}
      .pv-iosinst-cta{display:block;width:100%;background:var(--brand);color:#fbf3df;border:0;border-radius:999px;padding:12px;font-weight:700;font-size:15px;cursor:pointer;font-family:var(--font-sans);min-height:48px;margin-bottom:8px}
      .pv-iosinst-secondary{display:block;width:100%;background:transparent;color:var(--muted);border:0;padding:10px;font-size:13px;cursor:pointer;font-family:var(--font-sans)}
      .pv-iosinst-secondary:hover{color:var(--text)}
    `;
    document.head.appendChild(st);
  }

  function shouldShow() {
    if (!isIOS()) return false;
    if (!isSafari()) return false; // Solo Safari instala PWA en iOS
    if (isPWA()) return false; // Ya instalada
    if (recentlyDismissed()) return false;
    return true;
  }

  function showAndroidNote() {
    // En Android Chrome se usa el evento nativo beforeinstallprompt
    // que ya manejamos en home-shortcuts.js — no duplicamos acá.
    return false;
  }

  let _shown = false;
  function show() {
    if (_shown) return;
    if (document.querySelector('.pv-iosinst-backdrop')) return;
    _shown = true;
    injectStyles();

    const overlay = document.createElement('div');
    overlay.className = 'pv-iosinst-backdrop';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Instalar Palabra Viva');

    overlay.innerHTML = `
      <div class="pv-iosinst-sheet">
        <div class="pv-iosinst-handle"></div>
        <div class="pv-iosinst-icon">📲</div>
        <h2 class="pv-iosinst-title">Instalá la app en tu iPhone</h2>
        <p class="pv-iosinst-sub">Tenela siempre a mano como una app real, sin abrir el navegador.</p>
        <div class="pv-iosinst-steps">
          <div class="pv-iosinst-step">
            <span class="num">1</span>
            <span class="icon">📤</span>
            <span class="t">Tocá el botón <strong>Compartir</strong> abajo en Safari (es el cuadrado con flecha hacia arriba)</span>
          </div>
          <div class="pv-iosinst-step">
            <span class="num">2</span>
            <span class="icon">➕</span>
            <span class="t">Bajá hasta encontrar <strong>"Añadir a pantalla de inicio"</strong> y tocá ahí</span>
          </div>
          <div class="pv-iosinst-step">
            <span class="num">3</span>
            <span class="icon">✓</span>
            <span class="t">Tocá <strong>"Añadir"</strong> arriba a la derecha y listo — el ícono aparece en tu home</span>
          </div>
        </div>
        <div class="pv-iosinst-bonus">
          <strong>✨ Bonus al instalarla:</strong> recibís el versículo diario por notificación incluso con la app cerrada (iOS 16.4 o superior).
        </div>
        <button class="pv-iosinst-cta" data-got-it>👍 Ya entendí, después la instalo</button>
        <button class="pv-iosinst-secondary" data-not-now>No me interesa por ahora</button>
      </div>
    `;

    function close(dismissForLong = false) {
      overlay.remove();
      if (dismissForLong) {
        try { localStorage.setItem(KEY_DISMISSED, String(Date.now())); } catch {}
      }
    }
    overlay.querySelector('[data-got-it]').onclick = () => close(false); // Solo cerrar — volverá a aparecer
    overlay.querySelector('[data-not-now]').onclick = () => close(true); // No molestar por 7 días
    overlay.onclick = (e) => { if (e.target === overlay) close(false); };

    document.body.appendChild(overlay);

    // Telemetría local — saber cuántas veces se mostró
    try {
      const c = parseInt(localStorage.getItem(KEY_SHOWN_COUNT) || '0', 10);
      localStorage.setItem(KEY_SHOWN_COUNT, String(c + 1));
    } catch {}
  }

  function init() {
    if (!shouldShow()) return;
    // Esperamos a que el usuario ya haya navegado un poco (no molestar al
    // primer segundo). 30s es un buen balance.
    setTimeout(() => {
      if (shouldShow() && !document.hidden) show();
    }, SHOW_DELAY_MS);
  }

  // Exponer para invocación manual desde el menú "Más"
  window.PVIOSInstall = {
    show,
    canShow: shouldShow,
    isInstalled: isPWA,
    isAndroid: isAndroid,
    reset: () => {
      try {
        localStorage.removeItem(KEY_DISMISSED);
        localStorage.removeItem(KEY_SHOWN_COUNT);
      } catch {}
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

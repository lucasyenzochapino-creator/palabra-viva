(() => {
  let lastExitTap = 0;

  function injectStyles() {
    if (document.getElementById('pv-back-style')) return;
    const style = document.createElement('style');
    style.id = 'pv-back-style';
    style.textContent = `
      .pv-back-toast{
        position:fixed;
        left:50%;
        bottom:calc(160px + env(safe-area-inset-bottom));
        transform:translateX(-50%);
        z-index:9999;
        background:rgba(15,23,42,.94);
        color:#fff7ed;
        border:1px solid rgba(255,255,255,.14);
        border-radius:999px;
        padding:11px 16px;
        font-weight:900;
        font-size:14px;
        box-shadow:0 18px 45px rgba(0,0,0,.35);
        opacity:0;
        transition:opacity .18s ease;
        pointer-events:none;
        max-width:92vw;
        text-align:center;
      }
      .pv-back-toast.show{opacity:1;}
    `;
    document.head.appendChild(style);
  }

  function toast(text) {
    injectStyles();
    let el = document.querySelector('.pv-back-toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'pv-back-toast';
      document.body.appendChild(el);
    }
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(() => el.classList.remove('show'), 1800);
  }

  function closeTopPanel() {
    const selectors = [
      '.cr-viewer',
      '.cr-panel',
      '.respuestas-panel',
      '.pv-panel',
      '.pv-voice-panel',
      '.pv-audio-box',
      '.pv-audio-settings',
      '.pv-bap-panel',   // Panel Biblia en Audio
      '.pv-adm-panel',   // Panel Admin
      '.pv-auth-modal'   // Modal de login/registro
    ];
    const panels = selectors.flatMap(sel => Array.from(document.querySelectorAll(sel)));
    if (!panels.length) return false;
    const top = panels[panels.length - 1];

    // El panel de Biblia en Audio necesita una lógica de cierre especial
    // para preservar el audio en reproducción (el <audio> vive dentro del panel).
    if (top.classList.contains('pv-bap-panel')) {
      document.dispatchEvent(new CustomEvent('pv-close-bap-panel'));
      return true;
    }

    top.remove();
    return true;
  }

  function activeTabText() {
    const active = document.querySelector('.nav.active');
    return (active?.textContent || '').trim().toLowerCase();
  }

  function goHome() {
    const active = activeTabText();
    if (active.includes('hoy')) return false;
    const home = Array.from(document.querySelectorAll('.nav')).find(btn => (btn.textContent || '').toLowerCase().includes('hoy'));
    if (!home) return false;
    home.click();
    return true;
  }

  function pushGuard() {
    try {
      history.pushState({ palabraVivaGuard: true, t: Date.now() }, '', location.href);
    } catch {}
  }

  function setupHistory() {
    try {
      if (!history.state || !history.state.palabraVivaBase) {
        history.replaceState({ palabraVivaBase: true }, '', location.href);
      }
      pushGuard();
    } catch {}
  }

  function handleBack() {
    if (closeTopPanel()) {
      pushGuard();
      return;
    }

    if (goHome()) {
      pushGuard();
      return;
    }

    const now = Date.now();
    if (now - lastExitTap < 1800) {
      window.removeEventListener('popstate', onPopState);
      history.back();
      return;
    }

    lastExitTap = now;
    toast('Tocá atrás otra vez para salir');
    pushGuard();
  }

  function onPopState() {
    // Los paneles (radio, admin, auth) que manejan su propio history.pushState
    // ponen window._pvPanelClosing=true antes de llamar history.back() al cerrarse.
    // En ese caso solo restauramos el guard, sin correr handleBack().
    if (window._pvPanelClosing) {
      window._pvPanelClosing = false;
      pushGuard();
      return;
    }
    handleBack();
  }

  injectStyles();
  setupHistory();
  window.addEventListener('popstate', onPopState);

  document.addEventListener('click', event => {
    const target = event.target?.closest?.('.nav, .cr-open, .cr-quick, .res-open, .pv-diary-btn, .pv-mode-btn, .pv-path-step, .cr-home-card button, .respuestas-home-card button');
    if (target) {
      setTimeout(() => {
        if (!history.state || !history.state.palabraVivaGuard) pushGuard();
      }, 80);
    }
  }, true);
})();
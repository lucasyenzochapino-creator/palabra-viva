(() => {
  function injectStyles() {
    if (document.getElementById('pv-admin-fab-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-admin-fab-style';
    st.textContent = `
      .pv-admin-fab{
        position:fixed !important;
        bottom:calc(140px + env(safe-area-inset-bottom)) !important;
        right:14px !important;
        z-index:2147483647 !important;
        width:56px;height:56px;
        background:linear-gradient(135deg,#6b1f1f,#a47731);
        color:#fbf3df;
        border:2px solid #fbf3df;
        border-radius:50%;
        font-size:24px;
        cursor:pointer;
        box-shadow:0 8px 24px rgba(107,31,31,.5),0 4px 12px rgba(0,0,0,.3);
        display:flex !important;
        align-items:center;justify-content:center;
        font-weight:900;
        pointer-events:auto !important;
        animation:pv-admin-fab-pulse 2.5s ease-in-out infinite;
        font-family:Inter,sans-serif;
        transition:background .2s;
      }
      @keyframes pv-admin-fab-pulse{
        0%,100%{transform:scale(1);box-shadow:0 8px 24px rgba(107,31,31,.5)}
        50%{transform:scale(1.06);box-shadow:0 10px 32px rgba(107,31,31,.7)}
      }
      .pv-admin-fab:active{transform:scale(.9)!important;animation:none}
      .pv-admin-fab.loading{background:linear-gradient(135deg,#333,#555)!important;animation:none}
      .pv-admin-fab-label{
        position:fixed !important;
        bottom:calc(202px + env(safe-area-inset-bottom)) !important;
        right:10px !important;
        z-index:2147483647 !important;
        background:#6b1f1f;color:#fbf3df;
        font-size:11px;font-weight:700;
        padding:4px 10px;border-radius:999px;
        font-family:Inter,sans-serif;
        white-space:nowrap;
        pointer-events:none;
        opacity:.9;
      }
      .pv-fab-toast{
        position:fixed !important;
        bottom:calc(210px + env(safe-area-inset-bottom)) !important;
        right:14px !important;
        z-index:2147483647 !important;
        background:rgba(15,23,42,.95);
        color:#fff;
        border-radius:10px;
        padding:8px 12px;
        font-size:12px;
        font-weight:700;
        font-family:Inter,sans-serif;
        pointer-events:none;
        max-width:200px;
        text-align:right;
        transition:opacity .2s;
      }
    `;
    document.head.appendChild(st);
  }

  function showFabToast(msg, duration = 2500) {
    let t = document.querySelector('.pv-fab-toast');
    if (!t) { t = document.createElement('div'); t.className = 'pv-fab-toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.style.opacity = '1';
    clearTimeout(t._timer);
    t._timer = setTimeout(() => { t.style.opacity = '0'; }, duration);
  }

  function isAdmin() {
    try { return !!window.PVAuth?.isAdmin?.(); }
    catch { return false; }
  }

  function abrirPanelAdmin(btn) {
    // Feedback visual inmediato
    if (btn) { btn.textContent = '⏳'; btn.classList.add('loading'); }
    showFabToast('Abriendo panel…');

    // Intentar via window.PVAdmin (trusted=true, sin re-check de auth)
    if (typeof window.PVAdmin?.open === 'function') {
      try {
        window.PVAdmin.open();
        // Verificar que el panel apareció después de 800ms
        setTimeout(() => {
          if (btn) { btn.textContent = '⚙️'; btn.classList.remove('loading'); }
          if (!document.querySelector('.pv-adm-panel')) {
            showFabToast('⚠️ Panel no cargó — tocá atrás e intentá de nuevo', 4000);
          }
        }, 800);
        return;
      } catch(e) {
        console.error('[AdminFAB] error:', e);
        showFabToast('Error: ' + e.message, 4000);
        if (btn) { btn.textContent = '⚙️'; btn.classList.remove('loading'); }
        return;
      }
    }

    // Fallback: hash
    showFabToast('⚠️ Panel no cargado aún, reintentando…', 3000);
    location.hash = '#admin';
    setTimeout(() => {
      if (btn) { btn.textContent = '⚙️'; btn.classList.remove('loading'); }
      if (typeof window.PVAdmin?.open === 'function') {
        try { window.PVAdmin.open(); } catch {}
      }
    }, 500);
  }

  function montarBoton() {
    if (!isAdmin()) {
      document.querySelector('.pv-admin-fab')?.remove();
      document.querySelector('.pv-admin-fab-label')?.remove();
      return;
    }
    if (document.querySelector('.pv-admin-fab')) return;
    injectStyles();

    const label = document.createElement('div');
    label.className = 'pv-admin-fab-label';
    label.textContent = '⚙️ Admin';

    const btn = document.createElement('button');
    btn.className = 'pv-admin-fab';
    btn.setAttribute('aria-label', 'Abrir panel admin');
    btn.setAttribute('title', 'Panel de administración');
    btn.innerHTML = '⚙️';
    btn.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      abrirPanelAdmin(btn);
    };

    document.body.appendChild(label);
    document.body.appendChild(btn);
  }

  setInterval(montarBoton, 1500);
  document.addEventListener('pv-auth-change', montarBoton);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', montarBoton);
  } else {
    setTimeout(montarBoton, 500);
  }
})();

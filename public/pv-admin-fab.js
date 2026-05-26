(() => {
  // ===========================================================================
  // PALABRA VIVA — Botón flotante DE EMERGENCIA para abrir el Panel Admin
  // ===========================================================================
  // Independiente de la quick bar, de overlays, de hash en URL, del SW.
  // Si el usuario es admin → SIEMPRE aparece un botón flotante en la esquina
  // inferior derecha que abre el panel. Inmune a cualquier bug de overlays.

  function injectStyles() {
    if (document.getElementById('pv-admin-fab-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-admin-fab-style';
    st.textContent = `
      .pv-admin-fab{
        position:fixed !important;
        bottom:calc(140px + env(safe-area-inset-bottom)) !important;
        right:14px !important;
        z-index:2147483647 !important; /* el MÁXIMO posible */
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
      }
      @keyframes pv-admin-fab-pulse{
        0%,100%{transform:scale(1);box-shadow:0 8px 24px rgba(107,31,31,.5),0 4px 12px rgba(0,0,0,.3)}
        50%{transform:scale(1.05);box-shadow:0 10px 32px rgba(107,31,31,.7),0 6px 16px rgba(0,0,0,.4)}
      }
      .pv-admin-fab:active{transform:scale(.95)!important;animation:none}
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
    `;
    document.head.appendChild(st);
  }

  function isAdmin() {
    try { return !!window.PVAuth?.isAdmin?.(); }
    catch { return false; }
  }

  function abrirPanelAdmin() {
    // Intentamos por todas las vías posibles
    try {
      if (window.PVAdmin?.open) {
        window.PVAdmin.open();
        return;
      }
    } catch (e) { console.warn('[AdminFAB] PVAdmin.open() falló:', e); }
    // Fallback: setear hash
    try {
      location.hash = '#admin';
      // Forzar trigger del hashchange por si la app no lo escucha
      setTimeout(() => {
        if (window.PVAdmin?.open) window.PVAdmin.open();
      }, 300);
    } catch (e) { console.warn('[AdminFAB] hash fallback falló:', e); }
  }

  function montarBoton() {
    if (!isAdmin()) {
      // Si NO es admin (o cerró sesión), remover el FAB
      document.querySelector('.pv-admin-fab')?.remove();
      document.querySelector('.pv-admin-fab-label')?.remove();
      return;
    }
    if (document.querySelector('.pv-admin-fab')) return; // ya montado
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
      console.log('[AdminFAB] Click → abriendo panel admin');
      abrirPanelAdmin();
    };

    document.body.appendChild(label);
    document.body.appendChild(btn);
    console.log('[AdminFAB] Botón flotante montado');
  }

  // Chequear estado cada 1.5s + en eventos de auth
  setInterval(montarBoton, 1500);
  document.addEventListener('pv-auth-change', montarBoton);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', montarBoton);
  } else {
    setTimeout(montarBoton, 500);
  }
})();

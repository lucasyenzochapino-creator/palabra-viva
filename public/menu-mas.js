(() => {
  // ===========================================================================
  // PALABRA VIVA — Botón "Más" en la quick bar
  // ===========================================================================
  // Botón unificado en la barra rápida que abre un menú con TODAS las
  // funciones secundarias: timeline, iglesias, calendario, personajes,
  // radio, niños. Así la home no se llena de cards y la nav es predecible.

  const ITEMS = [
    { emoji: '📜', label: 'Línea del tiempo bíblica', cb: () => window.PVTimeline?.open?.() },
    { emoji: '⛪', label: 'Iglesias cristianas cerca', cb: () => window.PVIglesias?.open?.() },
    { emoji: '📅', label: 'Calendario cristiano',     cb: () => window.PVCalendario?.open?.() },
    { emoji: '📖', label: 'Personajes bíblicos',      cb: () => window.PVPersonajes?.open?.() },
    { emoji: '👶', label: 'Biblia para niños',        cb: () => window.PalabraVivaNinos?.open?.() },
    { emoji: '📻', label: 'Radios cristianas',        cb: () => window.PalabraVivaCanales?.openDial?.() },
    { emoji: '🎧', label: 'Biblia en audio',          cb: () => window.PalabraVivaAudioBible?.openInBibleTab?.() },
    { emoji: '💌', label: 'Enviar sugerencia',        cb: () => window.PVFeedback?.open?.() },
    { emoji: '📤', label: 'Invitar a un amigo',       cb: () => window.PVAuth?.shareInviteLink?.() }
  ];

  function injectStyles() {
    if (document.getElementById('pv-mas-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-mas-style';
    st.textContent = `
      .pv-mas-overlay{position:fixed;inset:0;z-index:9300;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);display:flex;align-items:flex-end;justify-content:center;animation:pv-mas-in .2s ease-out}
      @keyframes pv-mas-in{from{opacity:0}to{opacity:1}}
      .pv-mas-sheet{background:var(--card,#171722);color:var(--text,#f8fafc);border:1px solid var(--line,#333447);border-top-left-radius:28px;border-top-right-radius:28px;padding:18px 14px calc(28px + env(safe-area-inset-bottom));width:100%;max-width:560px;box-shadow:0 -20px 60px rgba(0,0,0,.5);animation:pv-mas-up .25s ease-out;max-height:80vh;overflow-y:auto}
      @keyframes pv-mas-up{from{transform:translateY(40px)}to{transform:none}}
      .pv-mas-handle{width:48px;height:4px;background:var(--line,#333447);border-radius:99px;margin:0 auto 14px}
      .pv-mas-title{margin:0 0 14px;font-size:20px;text-align:center;letter-spacing:-.02em}
      .pv-mas-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      .pv-mas-item{background:var(--card2,#202031);border:1px solid var(--line,#333447);border-radius:18px;padding:14px 12px;cursor:pointer;display:flex;align-items:center;gap:10px;color:var(--text,#f8fafc);font-family:inherit;font-size:14px;font-weight:700;text-align:left;min-height:64px;line-height:1.25}
      .pv-mas-item:hover,.pv-mas-item:active{border-color:var(--brand,#f59e0b);background:var(--card,#171722)}
      .pv-mas-item .e{font-size:22px;flex-shrink:0}
      .pv-mas-close{background:var(--card2,#202031);border:1px solid var(--line,#333447);color:var(--text,#f8fafc);border-radius:999px;padding:10px;font-weight:900;cursor:pointer;width:100%;margin-top:14px;min-height:46px}
      @media(max-width:380px){.pv-mas-grid{grid-template-columns:1fr}}
      /* Botón Más en quick bar */
      .quick .pv-mas-btn{background:linear-gradient(135deg,#f59e0b,#ec4899)!important;color:#fff!important;border:0!important;font-weight:900!important}
    `;
    document.head.appendChild(st);
  }

  function open() {
    if (document.querySelector('.pv-mas-overlay')) return;
    injectStyles();
    history.pushState({ pvMas: true }, '', location.href.split('#')[0] + '#mas');

    const overlay = document.createElement('div');
    overlay.className = 'pv-mas-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Más funciones');

    overlay.innerHTML = `
      <div class="pv-mas-sheet">
        <div class="pv-mas-handle" aria-hidden="true"></div>
        <h2 class="pv-mas-title">✨ Más funciones</h2>
        <div class="pv-mas-grid">
          ${ITEMS.map((it, i) => `<button class="pv-mas-item" data-i="${i}"><span class="e">${it.emoji}</span><span>${it.label}</span></button>`).join('')}
        </div>
        <button class="pv-mas-close" data-close>Cerrar</button>
      </div>`;

    function close(useHistory = true) {
      window.removeEventListener('popstate', onPop);
      overlay.remove();
      if (useHistory && location.hash === '#mas') {
        window._pvPanelClosing = true;
        history.back();
      }
    }
    function onPop() {
      if (location.hash === '#mas') return;
      window.removeEventListener('popstate', onPop);
      overlay.remove();
    }
    overlay.addEventListener('click', e => { if (e.target === overlay) close(true); });
    overlay.querySelector('[data-close]').onclick = () => close(true);
    overlay.querySelectorAll('[data-i]').forEach(b => {
      b.onclick = () => {
        const i = parseInt(b.dataset.i, 10);
        close(true);
        // Pequeño delay para que el cierre se vea antes de abrir el destino
        setTimeout(() => { try { ITEMS[i]?.cb?.(); } catch (e) { console.warn(e); } }, 100);
      };
    });

    document.body.appendChild(overlay);
    window.addEventListener('popstate', onPop);
  }

  function addToQuickBar() {
    const q = document.querySelector('.quick');
    if (!q || q.querySelector('.pv-mas-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'pv-mas-btn';
    btn.textContent = '✨ Más';
    btn.setAttribute('aria-label', 'Más funciones');
    btn.onclick = open;
    // Insertar al principio para que sea fácil de ver
    q.insertBefore(btn, q.firstChild);
  }

  function boot() { injectStyles(); addToQuickBar(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('load', boot);
  setInterval(boot, 3000);

  window.PVMas = { open };
})();

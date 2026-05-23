(() => {
  // ===========================================================================
  // PALABRA VIVA — Modo lectura inmersivo
  // ===========================================================================
  // Cuando el usuario está leyendo un capítulo en la pestaña Biblia, ofrece
  // un modo full-screen sin distracciones: nav oculta, tipografía grande,
  // scroll continuo, gestos para cambiar de capítulo.

  function injectStyles() {
    if (document.getElementById('pv-read-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-read-style';
    st.textContent = `
      .pv-read-panel{position:fixed;inset:0;z-index:9500;background:var(--bg,#1a0e05);color:var(--text,#f5deb3);overflow-y:auto;padding:20px 20px calc(140px + env(safe-area-inset-bottom));font-family:Georgia,'Times New Roman',serif}
      .pv-read-inner{max-width:680px;margin:0 auto}
      .pv-read-head{position:sticky;top:0;background:linear-gradient(to bottom,var(--bg,#1a0e05) 80%,transparent);padding:8px 0 18px;display:flex;justify-content:space-between;align-items:center;gap:10px;z-index:5;backdrop-filter:blur(10px)}
      .pv-read-head .ref{font-size:13px;font-weight:900;color:var(--brand,#f59e0b);text-transform:uppercase;letter-spacing:.08em;margin:0}
      .pv-read-head h2{margin:2px 0 0;font-size:22px;letter-spacing:-.02em;font-family:inherit}
      .pv-read-close{border:1px solid var(--line,#333447);background:var(--card2,#202031);color:var(--text,#f8fafc);border-radius:999px;padding:9px 14px;font-weight:900;cursor:pointer;font-family:Inter,system-ui,sans-serif}
      .pv-read-body{font-size:var(--read-size,21px);line-height:1.75;letter-spacing:.005em;margin:8px 0}
      .pv-read-body .vnum{display:inline-block;font-size:.65em;color:var(--brand,#f59e0b);vertical-align:super;font-weight:900;margin-right:5px;font-family:Inter,system-ui,sans-serif}
      .pv-read-controls{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;padding:14px 0;border-top:1px dashed var(--line,#333447);margin-top:18px;font-family:Inter,system-ui,sans-serif}
      .pv-read-controls button{border:1px solid var(--line,#333447);background:var(--card2,#202031);color:var(--text,#f8fafc);border-radius:999px;padding:11px 16px;font-weight:900;cursor:pointer;min-height:44px;font-family:inherit}
      .pv-read-controls button.primary{background:linear-gradient(135deg,var(--brand,#f59e0b),var(--brand2,#ec4899));color:#fff;border:0}
      .pv-read-size{display:flex;gap:4px;align-items:center}
      .pv-read-size button{padding:9px 12px;min-width:42px;font-size:13px}
      .pv-read-bottom{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);width:min(680px,calc(100% - 28px));display:flex;gap:8px;background:var(--card,#171722);border:1px solid var(--line,#333447);border-radius:24px;padding:7px;box-shadow:0 20px 50px rgba(0,0,0,.4);z-index:9501;font-family:Inter,system-ui,sans-serif}
      .pv-read-bottom button{flex:1;border:0;background:transparent;color:var(--text,#f8fafc);border-radius:18px;padding:11px;font-weight:900;cursor:pointer;font-size:14px;min-height:44px;display:flex;align-items:center;justify-content:center;gap:6px}
      .pv-read-bottom button:hover{background:var(--card2,#202031)}
      .pv-read-bottom button.primary{background:linear-gradient(135deg,var(--brand,#f59e0b),var(--brand2,#ec4899));color:#fff}
      body[data-theme="light"] .pv-read-panel{background:#fdf6ec;color:#27190c}
      body[data-theme="sepia"] .pv-read-panel{background:#f3e0c0;color:#27190c}
      body[data-theme="sepia"] .pv-read-head,body[data-theme="light"] .pv-read-head{background:transparent}
    `;
    document.head.appendChild(st);
  }

  // Lee de localStorage el último estado de Biblia (libro + capítulo)
  function getCurrentReading() {
    try {
      const sels = document.querySelectorAll('.fieldLabel select.select');
      if (sels.length >= 2) {
        return { book: sels[0].value, chapter: parseInt(sels[1].value, 10) || 1 };
      }
    } catch {}
    return null;
  }

  // Obtener los versículos del capítulo desde la pestaña Biblia actual
  function getVisibleVerses() {
    const cards = document.querySelectorAll('.app .stack .card');
    const verses = [];
    cards.forEach(card => {
      const ref = card.querySelector('.ref')?.textContent || '';
      const text = card.querySelector('.verse')?.textContent || '';
      const m = ref.match(/^(.+)\s+(\d+):(\d+)$/);
      if (m && text) {
        verses.push({ book: m[1], chapter: parseInt(m[2], 10), verse: parseInt(m[3], 10), text: text.replace(/^["“]|["”]$/g, '') });
      }
    });
    return verses;
  }

  function open() {
    const reading = getCurrentReading();
    if (!reading) {
      alert('Abrí primero un capítulo en la pestaña Biblia para usar el modo lectura.');
      return;
    }
    const verses = getVisibleVerses();
    if (!verses.length) {
      alert('No hay versículos cargados. Esperá a que cargue la Biblia o probá otro capítulo.');
      return;
    }
    if (document.querySelector('.pv-read-panel')) return;
    injectStyles();

    const size = parseInt(localStorage.getItem('pv-read-size'), 10) || 21;

    const panel = document.createElement('section');
    panel.className = 'pv-read-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Modo lectura inmersivo');
    panel.style.setProperty('--read-size', size + 'px');

    history.pushState({ pvRead: true }, '', location.href.split('#')[0] + '#read');

    const versesHtml = verses.map(v =>
      `<span><span class="vnum">${v.verse}</span>${escapeHtml(v.text)}</span>`
    ).join(' ');

    panel.innerHTML = `
      <div class="pv-read-inner">
        <div class="pv-read-head">
          <div>
            <p class="ref">${escapeHtml(reading.book)} ${reading.chapter}</p>
            <h2>Modo lectura</h2>
          </div>
          <div class="pv-read-size">
            <button data-size="-" aria-label="Reducir letra">A−</button>
            <button data-size="+" aria-label="Agrandar letra">A+</button>
            <button class="pv-read-close" data-close>Cerrar ✕</button>
          </div>
        </div>
        <div class="pv-read-body">${versesHtml}</div>
        <div class="pv-read-controls">
          <button data-prev>⏮ Anterior</button>
          <button class="primary" data-audio>🎧 Escuchar</button>
          <button data-next>Siguiente ⏭</button>
        </div>
      </div>
      <nav class="pv-read-bottom" aria-label="Navegación de lectura">
        <button data-prev>⏮ Cap. anterior</button>
        <button data-audio class="primary">🎧 Audio</button>
        <button data-next>Cap. siguiente ⏭</button>
      </nav>
    `;

    // Tamaño tipográfico
    panel.querySelectorAll('[data-size]').forEach(b => {
      b.onclick = () => {
        let s = parseInt(getComputedStyle(panel).getPropertyValue('--read-size'), 10) || 21;
        s = b.dataset.size === '+' ? Math.min(32, s + 2) : Math.max(15, s - 2);
        panel.style.setProperty('--read-size', s + 'px');
        try { localStorage.setItem('pv-read-size', s); } catch {}
      };
    });

    function closePanel(useHistory = true) {
      window.removeEventListener('popstate', onPop);
      panel.remove();
      if (useHistory && location.hash === '#read') {
        window._pvPanelClosing = true;
        history.back();
      }
    }
    function onPop() { window.removeEventListener('popstate', onPop); panel.remove(); }
    panel.querySelector('[data-close]').onclick = () => closePanel(true);

    // Navegación entre capítulos: cambia el select de capítulo en la pestaña Biblia
    function changeChapter(delta) {
      const sels = document.querySelectorAll('.fieldLabel select.select');
      if (sels.length < 2) return;
      const chSel = sels[1];
      const cur = parseInt(chSel.value, 10);
      const opts = Array.from(chSel.options).map(o => parseInt(o.value, 10));
      const idx = opts.indexOf(cur);
      const nextIdx = idx + delta;
      if (nextIdx < 0 || nextIdx >= opts.length) return;
      chSel.value = opts[nextIdx];
      chSel.dispatchEvent(new Event('change', { bubbles: true }));
      // Esperar a que React renderice el nuevo capítulo
      setTimeout(() => {
        closePanel(false);
        setTimeout(() => open(), 100);
      }, 250);
    }
    panel.querySelectorAll('[data-prev]').forEach(b => b.onclick = () => changeChapter(-1));
    panel.querySelectorAll('[data-next]').forEach(b => b.onclick = () => changeChapter(+1));

    // Audio: dispara el audio del capítulo actual
    panel.querySelectorAll('[data-audio]').forEach(b => b.onclick = () => {
      const ref = `${reading.book} ${reading.chapter}`;
      window.PalabraVivaAudioBible?.play?.(ref);
    });

    // Swipe para cambiar de capítulo (gestos en móvil)
    let touchStartX = 0;
    panel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    panel.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 80) {
        changeChapter(dx < 0 ? +1 : -1);
      }
    }, { passive: true });

    // Teclado: flechas y Esc
    const onKey = (e) => {
      if (e.key === 'Escape') closePanel(true);
      else if (e.key === 'ArrowRight' || e.key === 'j' || e.key === 'l') changeChapter(+1);
      else if (e.key === 'ArrowLeft'  || e.key === 'k' || e.key === 'h') changeChapter(-1);
    };
    document.addEventListener('keydown', onKey);
    panel.addEventListener('remove', () => document.removeEventListener('keydown', onKey));

    document.body.appendChild(panel);
    window.addEventListener('popstate', onPop, { once: true });
  }

  function escapeHtml(s) {
    return (s || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  // Botón "Modo lectura" inyectado en la pestaña Biblia
  function injectButton() {
    const isBibleTab = (document.querySelector('h1')?.textContent || '').trim() === 'Biblia';
    if (!isBibleTab) {
      document.querySelector('.pv-read-launch')?.remove();
      return;
    }
    if (document.querySelector('.pv-read-launch')) return;
    const card = document.querySelectorAll('.app .stack .card.gradient')[0]?.parentElement?.querySelector('.card:not(.gradient)');
    if (!card) return;
    const btn = document.createElement('button');
    btn.className = 'pv-read-launch';
    btn.style.cssText = 'border:0;border-radius:999px;padding:13px 18px;font-weight:900;font-size:15px;background:linear-gradient(135deg,#7c4a1e,#b45309);color:#fff;cursor:pointer;width:100%;margin-top:10px;display:flex;align-items:center;justify-content:center;gap:8px;min-height:48px';
    btn.innerHTML = '📖 Modo lectura inmersivo';
    btn.onclick = open;
    card.appendChild(btn);
  }

  function boot() { injectStyles(); injectButton(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('load', boot);
  setInterval(boot, 2500);

  window.PVReadingMode = { open };
})();

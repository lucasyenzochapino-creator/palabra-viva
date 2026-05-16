(() => {
  // Reproductor de Biblia en audio — Reina Valera 1909, Samuel Montoya, dominio público
  // Fuente: Internet Archive (https://archive.org/details/BibliaEnAudioRVA1909)
  // Maneja: selector de libro/capítulo, guardar posición, continuar, velocidad, lock-screen controls.

  const ARCHIVE_ID = 'BibliaEnAudioRVA1909';
  const FILES_API = `https://archive.org/metadata/${ARCHIVE_ID}/files`;
  const DOWNLOAD_BASE = `https://archive.org/download/${ARCHIVE_ID}`;
  const LS_INDEX = 'pv-bible-audio-index-v2';
  const LS_BOOKMARK = 'pv-bible-audio-bookmark-v2';
  const LS_RATE = 'pv-bible-audio-rate-v2';

  // Fallback offline si la API de Internet Archive falla. Solo libros más comunes.
  // El listado completo se carga al primer uso vía API y queda cacheado.
  const FALLBACK_INDEX = {};

  const $ = (s, r = document) => r.querySelector(s);

  // ---------- Estilos ----------
  function injectStyles() {
    if ($('#pv-bap-style')) return;
    const style = document.createElement('style');
    style.id = 'pv-bap-style';
    style.textContent = `
      .pv-bap-fab{position:fixed;left:12px;bottom:calc(158px + env(safe-area-inset-bottom));z-index:80;border:0;background:linear-gradient(135deg,#7c4a1e,#be185d);color:#fff;border-radius:999px;padding:12px 15px;font-weight:900;box-shadow:0 18px 45px rgba(0,0,0,.32);min-height:46px;display:inline-flex;align-items:center;gap:8px;font-size:14px;cursor:pointer}
      .pv-bap-fab::before{content:"";width:10px;height:10px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 4px rgba(34,197,94,.25);animation:pv-bap-pulse 1.6s ease-in-out infinite}
      @keyframes pv-bap-pulse{0%,100%{opacity:1}50%{opacity:.5}}
      .pv-bap-panel{position:fixed;inset:0;z-index:95;background:var(--bg);color:var(--text);overflow:auto;padding:14px 12px calc(120px + env(safe-area-inset-bottom))}
      .pv-bap-inner{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:14px}
      .pv-bap-head{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:start;position:sticky;top:0;background:linear-gradient(to bottom,var(--bg) 70%,transparent);padding:8px 0 14px;z-index:2;backdrop-filter:blur(12px)}
      .pv-bap-head h1{font-size:clamp(23px,6.5vw,30px);line-height:1.06;margin:4px 0 6px;letter-spacing:-.035em}
      .pv-bap-close{border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:999px;padding:9px 14px;font-weight:900;min-width:68px;height:40px;cursor:pointer}
      .pv-bap-card{border:1px solid var(--line);background:var(--card);border-radius:24px;padding:14px;box-shadow:0 16px 38px rgba(0,0,0,.12)}
      .pv-bap-card.resume{border-color:rgba(34,197,94,.45);background:linear-gradient(135deg,rgba(34,197,94,.12),var(--card))}
      .pv-bap-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      .pv-bap-row label{display:block;font-size:12px;color:var(--muted);font-weight:900;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}
      .pv-bap-row select{width:100%;border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:16px;padding:12px;font:inherit;font-weight:800;outline:none}
      .pv-bap-audio{width:100%;margin-top:14px;border-radius:14px;outline:none}
      .pv-bap-controls{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:12px}
      .pv-bap-controls button{border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:999px;padding:11px 8px;font-weight:900;font-size:13px;cursor:pointer;min-height:44px}
      .pv-bap-controls button.primary{background:linear-gradient(135deg,var(--brand),var(--brand2));color:#fff;border-color:transparent}
      .pv-bap-rate{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}
      .pv-bap-rate button{flex:1;border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:999px;padding:8px 6px;font-weight:900;font-size:12px;cursor:pointer;min-height:36px;min-width:54px}
      .pv-bap-rate button.active{background:linear-gradient(135deg,var(--brand),var(--brand2));color:#fff;border-color:transparent}
      .pv-bap-status{font-size:13px;color:var(--muted);margin-top:8px;text-align:center}
      .pv-bap-disclaimer{font-size:12px;color:var(--muted);line-height:1.5}
      .pv-bap-home{border-color:rgba(124,74,30,.45);background:linear-gradient(135deg,rgba(124,74,30,.14),var(--card))}
      .pv-bap-resume-info{font-size:15px;font-weight:800;margin:4px 0 10px}
      .pv-bap-resume-time{color:var(--brand)}
      @media(max-width:420px){.pv-bap-row{grid-template-columns:1fr}.pv-bap-controls{grid-template-columns:1fr 1fr}}
    `;
    document.head.appendChild(style);
  }

  // ---------- Carga del índice de archivos (libros + capítulos) ----------
  async function loadIndex() {
    // Cache local primero
    try {
      const cached = localStorage.getItem(LS_INDEX);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && Object.keys(parsed).length >= 10) return parsed;
      }
    } catch (e) {}

    try {
      const resp = await fetch(FILES_API, { cache: 'force-cache' });
      if (!resp.ok) throw new Error('IA metadata fetch failed');
      const data = await resp.json();
      const files = (data && data.result) || [];

      const books = {};
      files.forEach(f => {
        if (!f || !f.name || !/\.mp3$/i.test(f.name)) return;
        // Formato esperado: "01-Génesis 01.mp3", "08-Rut 1.mp3", "11-1 Reis 01.mp3"
        const m = f.name.match(/^(\d{2})-(.+?)\s+(\d{1,3})\.mp3$/i);
        if (!m) return;
        const prefix = m[1];
        const rawName = m[2].trim();
        const chapter = Number(m[3]);
        if (!books[prefix]) {
          books[prefix] = { prefix, rawName, displayName: normalizeBookName(rawName), chapters: [] };
        }
        books[prefix].chapters.push({ n: chapter, file: f.name });
      });

      Object.values(books).forEach(b => {
        b.chapters.sort((a, b) => a.n - b.n);
      });

      if (Object.keys(books).length >= 30) {
        try { localStorage.setItem(LS_INDEX, JSON.stringify(books)); } catch (e) {}
        return books;
      }
    } catch (e) {
      console.warn('Audio Bible: API fail, usando fallback', e);
    }

    return FALLBACK_INDEX;
  }

  function normalizeBookName(raw) {
    // Convierte "Deuterenomio" → "Deuteronomio", "Josúe" → "Josué", "1 Reis" → "1 Reyes", etc.
    const fixes = {
      'Deuterenomio': 'Deuteronomio',
      'Josúe': 'Josué',
      '1 Reis': '1 Reyes',
      '2 Reis': '2 Reyes'
    };
    return fixes[raw] || raw;
  }

  function fmtTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function saveBookmark(prefix, chapter, time) {
    try {
      localStorage.setItem(LS_BOOKMARK, JSON.stringify({
        prefix, chapter, time: Math.max(0, time || 0), savedAt: Date.now()
      }));
    } catch (e) {}
  }

  function loadBookmark() {
    try {
      const raw = localStorage.getItem(LS_BOOKMARK);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function clearBookmark() {
    try { localStorage.removeItem(LS_BOOKMARK); } catch (e) {}
  }

  // ---------- Panel ----------
  let panelEl = null;
  let audioEl = null;
  let booksIndex = null;
  let currentPrefix = null;
  let currentChapter = null;

  async function openPanel() {
    injectStyles();
    try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) {}
    $('.pv-bap-panel')?.remove();

    const panel = document.createElement('section');
    panel.className = 'pv-bap-panel';
    panel.innerHTML = `
      <div class="pv-bap-inner">
        <div class="pv-bap-head">
          <div>
            <p class="ref">Biblia en audio</p>
            <h1>Voz humana, masculina</h1>
            <p class="soft">Reina Valera 1909 · Narrada por Samuel Montoya · Dominio público</p>
          </div>
          <button class="pv-bap-close" aria-label="Cerrar">Cerrar</button>
        </div>

        <section class="pv-bap-card" data-resume style="display:none">
          <p class="ref">Continuar</p>
          <p class="pv-bap-resume-info" data-resume-text></p>
          <div class="pv-bap-controls">
            <button class="primary" data-a="resume">Continuar</button>
            <button data-a="restart">Reiniciar</button>
            <button data-a="forget">Borrar</button>
          </div>
        </section>

        <section class="pv-bap-card">
          <p class="ref">Elegí qué escuchar</p>
          <div class="pv-bap-row">
            <div>
              <label>Libro</label>
              <select data-sel="book"><option>Cargando...</option></select>
            </div>
            <div>
              <label>Capítulo</label>
              <select data-sel="chapter"><option>—</option></select>
            </div>
          </div>
          <audio class="pv-bap-audio" controls preload="metadata" playsinline></audio>
          <div class="pv-bap-controls">
            <button data-a="prev">← Cap. anterior</button>
            <button class="primary" data-a="play">▶ Reproducir</button>
            <button data-a="next">Cap. siguiente →</button>
          </div>
          <div class="pv-bap-rate" data-rate-wrap>
            <button data-rate="0.75">0.75×</button>
            <button data-rate="1" class="active">1×</button>
            <button data-rate="1.25">1.25×</button>
            <button data-rate="1.5">1.5×</button>
          </div>
          <div class="pv-bap-status" data-status>Elegí un libro para empezar.</div>
        </section>

        <section class="pv-bap-card">
          <p class="pv-bap-disclaimer">El audio se transmite directo desde Internet Archive. Si va lento, probá Wi-Fi. Los controles también aparecen en la pantalla bloqueada del celular para no perder lo que estás escuchando.</p>
        </section>
      </div>
    `;
    document.body.appendChild(panel);
    panelEl = panel;
    audioEl = panel.querySelector('audio');

    panel.querySelector('.pv-bap-close').onclick = () => closePanel();

    // Cargar índice
    setStatus('Cargando libros disponibles...');
    booksIndex = await loadIndex();

    if (!booksIndex || Object.keys(booksIndex).length === 0) {
      setStatus('No se pudieron cargar los libros. Probá de nuevo con conexión.');
      return;
    }

    populateBookSelect();

    // Mostrar bookmark si existe
    const bm = loadBookmark();
    if (bm && booksIndex[bm.prefix]) {
      const book = booksIndex[bm.prefix];
      const ch = book.chapters.find(c => c.n === bm.chapter);
      if (ch) {
        const resumeSection = panel.querySelector('[data-resume]');
        resumeSection.style.display = '';
        panel.querySelector('[data-resume-text]').innerHTML =
          `${book.displayName} ${bm.chapter} <span class="pv-bap-resume-time">${fmtTime(bm.time)}</span>`;
      }
    }

    // Eventos
    panel.querySelector('[data-sel="book"]').onchange = e => onBookChange(e.target.value);
    panel.querySelector('[data-sel="chapter"]').onchange = e => onChapterChange(Number(e.target.value));
    panel.querySelector('[data-a="play"]').onclick = () => togglePlay();
    panel.querySelector('[data-a="prev"]').onclick = () => stepChapter(-1);
    panel.querySelector('[data-a="next"]').onclick = () => stepChapter(1);
    panel.querySelector('[data-a="resume"]')?.addEventListener('click', resumeFromBookmark);
    panel.querySelector('[data-a="restart"]')?.addEventListener('click', () => {
      const bm = loadBookmark();
      if (bm) { loadChapter(bm.prefix, bm.chapter, 0, true); }
    });
    panel.querySelector('[data-a="forget"]')?.addEventListener('click', () => {
      clearBookmark();
      panel.querySelector('[data-resume]').style.display = 'none';
    });

    panel.querySelectorAll('[data-rate]').forEach(b => {
      b.onclick = () => {
        const rate = Number(b.dataset.rate);
        if (audioEl) audioEl.playbackRate = rate;
        try { localStorage.setItem(LS_RATE, String(rate)); } catch (e) {}
        panel.querySelectorAll('[data-rate]').forEach(x => x.classList.toggle('active', x === b));
      };
    });

    // Restaurar velocidad guardada
    const savedRate = Number(localStorage.getItem(LS_RATE) || '1');
    if (audioEl) audioEl.playbackRate = savedRate;
    panel.querySelectorAll('[data-rate]').forEach(x => {
      x.classList.toggle('active', Number(x.dataset.rate) === savedRate);
    });

    // Listeners del audio para guardar posición
    audioEl.addEventListener('timeupdate', () => {
      if (currentPrefix && currentChapter && audioEl.currentTime > 1) {
        saveBookmark(currentPrefix, currentChapter, audioEl.currentTime);
      }
    });
    audioEl.addEventListener('ended', () => {
      stepChapter(1);
    });
    audioEl.addEventListener('error', () => {
      setStatus('Error al cargar el audio. Probá otro capítulo o revisá tu conexión.');
    });
    audioEl.addEventListener('playing', () => {
      const book = booksIndex[currentPrefix];
      setStatus(`Reproduciendo: ${book?.displayName || ''} ${currentChapter}`);
    });
  }

  function closePanel() {
    if (audioEl) { try { audioEl.pause(); } catch (e) {} }
    panelEl?.remove();
    panelEl = null;
    audioEl = null;
  }

  function populateBookSelect() {
    const sel = panelEl.querySelector('[data-sel="book"]');
    const prefixes = Object.keys(booksIndex).sort();
    sel.innerHTML = '<option value="">— elegir libro —</option>' +
      prefixes.map(p => `<option value="${p}">${booksIndex[p].displayName}</option>`).join('');
  }

  function onBookChange(prefix) {
    if (!prefix || !booksIndex[prefix]) return;
    currentPrefix = prefix;
    const book = booksIndex[prefix];
    const chapSel = panelEl.querySelector('[data-sel="chapter"]');
    chapSel.innerHTML = book.chapters.map(c => `<option value="${c.n}">Capítulo ${c.n}</option>`).join('');
    currentChapter = book.chapters[0].n;
    chapSel.value = String(currentChapter);
    loadChapter(prefix, currentChapter, 0, false);
  }

  function onChapterChange(chapter) {
    if (!currentPrefix) return;
    currentChapter = chapter;
    loadChapter(currentPrefix, chapter, 0, false);
  }

  function loadChapter(prefix, chapter, startTime, autoplay) {
    const book = booksIndex[prefix];
    if (!book) return;
    const ch = book.chapters.find(c => c.n === chapter);
    if (!ch) return;
    currentPrefix = prefix;
    currentChapter = chapter;
    panelEl.querySelector('[data-sel="book"]').value = prefix;
    panelEl.querySelector('[data-sel="chapter"]').value = String(chapter);
    audioEl.src = `${DOWNLOAD_BASE}/${encodeURIComponent(ch.file)}`;
    audioEl.currentTime = startTime || 0;
    setStatus(`Listo: ${book.displayName} ${chapter}. Tocá ▶ para reproducir.`);
    if (autoplay) {
      audioEl.play().catch(() => {
        setStatus('Tocá ▶ una vez para empezar (el navegador requiere interacción).');
      });
    }
    // Restaurar velocidad
    const savedRate = Number(localStorage.getItem(LS_RATE) || '1');
    audioEl.playbackRate = savedRate;

    // Media Session API (controles en lock screen)
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: `${book.displayName} ${chapter}`,
          artist: 'Samuel Montoya · Reina Valera 1909',
          album: 'Palabra Viva — Biblia en audio'
        });
        navigator.mediaSession.setActionHandler('previoustrack', () => stepChapter(-1));
        navigator.mediaSession.setActionHandler('nexttrack', () => stepChapter(1));
      } catch (e) {}
    }
  }

  function stepChapter(dir) {
    if (!currentPrefix) return;
    const book = booksIndex[currentPrefix];
    if (!book) return;
    const idx = book.chapters.findIndex(c => c.n === currentChapter);
    const newIdx = idx + dir;
    if (newIdx >= 0 && newIdx < book.chapters.length) {
      loadChapter(currentPrefix, book.chapters[newIdx].n, 0, true);
      return;
    }
    // Pasar al libro siguiente/anterior
    const prefixes = Object.keys(booksIndex).sort();
    const bidx = prefixes.indexOf(currentPrefix);
    const newBidx = bidx + dir;
    if (newBidx >= 0 && newBidx < prefixes.length) {
      const newBook = booksIndex[prefixes[newBidx]];
      const chapter = dir > 0 ? newBook.chapters[0].n : newBook.chapters[newBook.chapters.length - 1].n;
      loadChapter(prefixes[newBidx], chapter, 0, true);
    } else {
      setStatus(dir > 0 ? 'Llegaste al final de la Biblia.' : 'Estás en el principio.');
    }
  }

  function togglePlay() {
    if (!audioEl) return;
    if (audioEl.paused) {
      audioEl.play().catch(() => setStatus('No se pudo iniciar. Tocá el control ▶ del reproductor.'));
    } else {
      audioEl.pause();
    }
  }

  function resumeFromBookmark() {
    const bm = loadBookmark();
    if (!bm || !booksIndex[bm.prefix]) return;
    loadChapter(bm.prefix, bm.chapter, bm.time, true);
  }

  function setStatus(text) {
    const el = panelEl?.querySelector('[data-status]');
    if (el) el.textContent = text;
  }

  // ---------- Inyección en la UI ----------
  function addFab() {
    injectStyles();
    if ($('.pv-bap-fab')) return;
    const btn = document.createElement('button');
    btn.className = 'pv-bap-fab';
    btn.textContent = 'Biblia en audio';
    btn.onclick = openPanel;
    document.body.appendChild(btn);
  }

  function addHomeCard() {
    const title = $('h1')?.textContent || '';
    if (!title.includes('Una palabra para hoy')) return;
    if ($('.pv-bap-home')) return;
    const anchor = $('.pv-path-card') || $('.hero');
    if (!anchor) return;
    const bm = loadBookmark();
    const resumeLine = bm
      ? `<p class="soft">Última escucha: <strong>${(booksIndex && booksIndex[bm.prefix]?.displayName) || ''} ${bm.chapter}</strong> en ${fmtTime(bm.time)}</p>`
      : `<p class="soft">Reina Valera 1909 narrada por Samuel Montoya. Voz humana, masculina, dominio público.</p>`;
    const card = document.createElement('section');
    card.className = 'card pv-bap-home';
    card.innerHTML = `
      <p class="ref">Biblia en audio</p>
      <h3>${bm ? 'Continuá donde quedaste' : 'Escuchá la Biblia narrada'}</h3>
      ${resumeLine}
      <div class="row wrap"><button class="btn">${bm ? 'Continuar' : 'Abrir reproductor'}</button></div>
    `;
    card.querySelector('button').onclick = openPanel;
    anchor.insertAdjacentElement('afterend', card);
  }

  function addQuickButton() {
    const quick = $('.quick');
    if (!quick || $('.pv-bap-quick')) return;
    const btn = document.createElement('button');
    btn.className = 'pv-bap-quick';
    btn.textContent = 'Audio';
    btn.onclick = openPanel;
    quick.insertBefore(btn, quick.firstChild);
  }

  // Limpieza: si quedaron botones de la versión anterior basada en Web Speech, los removemos
  function removeOldTtsArtifacts() {
    $('.pv-audio-fixed')?.remove();
    $('.pv-audio-box')?.remove();
    $('.pv-audio-card-force')?.remove();
    $('.pv-voice-quick')?.remove();
    $('.pv-voice-panel')?.remove();
    // Botones inline "Escuchar" agregados a cada versículo
    document.querySelectorAll('.pv-audio-one').forEach(el => el.remove());
  }

  window.PalabraVivaAudioBible = { open: openPanel };

  setInterval(() => {
    injectStyles();
    removeOldTtsArtifacts();
    addFab();
    addHomeCard();
    addQuickButton();
  }, 900);

  addFab();
})();
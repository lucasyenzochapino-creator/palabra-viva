(() => {
  // ========================
  // BIBLIA EN AUDIO — v3
  // MediaSession (Android Auto, CarPlay, Bluetooth, auriculares)
  // Mini-player flotante persistente (sigue en cualquier sección)
  // Audio no se detiene al cambiar de pestaña
  // ========================

  const ARCHIVE_ITEM = 'BibliaEnAudioRVA1909';
  const META_URL     = `https://archive.org/metadata/${ARCHIVE_ITEM}`;
  const DOWNLOAD_BASE= `https://archive.org/download/${ARCHIVE_ITEM}`;

  const BOOKS = [
    { name: 'Génesis',          chapters: 50,  slug: 'Genesis' },
    { name: 'Éxodo',            chapters: 40,  slug: 'Exodo' },
    { name: 'Levítico',         chapters: 27,  slug: 'Levitico' },
    { name: 'Números',          chapters: 36,  slug: 'Numeros' },
    { name: 'Deuteronomio',     chapters: 34,  slug: 'Deuteronomio' },
    { name: 'Josué',            chapters: 24,  slug: 'Josue' },
    { name: 'Jueces',           chapters: 21,  slug: 'Jueces' },
    { name: 'Rut',              chapters: 4,   slug: 'Rut' },
    { name: '1 Samuel',         chapters: 31,  slug: '1 Samuel' },
    { name: '2 Samuel',         chapters: 24,  slug: '2 Samuel' },
    { name: '1 Reyes',          chapters: 22,  slug: '1 Reyes' },
    { name: '2 Reyes',          chapters: 25,  slug: '2 Reyes' },
    { name: '1 Crónicas',       chapters: 29,  slug: '1 Cronicas' },
    { name: '2 Crónicas',       chapters: 36,  slug: '2 Cronicas' },
    { name: 'Esdras',           chapters: 10,  slug: 'Esdras' },
    { name: 'Nehemías',         chapters: 13,  slug: 'Nehemias' },
    { name: 'Ester',            chapters: 10,  slug: 'Ester' },
    { name: 'Job',              chapters: 42,  slug: 'Job' },
    { name: 'Salmos',           chapters: 150, slug: 'Salmos' },
    { name: 'Proverbios',       chapters: 31,  slug: 'Proverbios' },
    { name: 'Eclesiastés',      chapters: 12,  slug: 'Eclesiastes' },
    { name: 'Cantares',         chapters: 8,   slug: 'Cantares' },
    { name: 'Isaías',           chapters: 66,  slug: 'Isaias' },
    { name: 'Jeremías',         chapters: 52,  slug: 'Jeremias' },
    { name: 'Lamentaciones',    chapters: 5,   slug: 'Lamentaciones' },
    { name: 'Ezequiel',         chapters: 48,  slug: 'Ezequiel' },
    { name: 'Daniel',           chapters: 12,  slug: 'Daniel' },
    { name: 'Oseas',            chapters: 14,  slug: 'Oseas' },
    { name: 'Joel',             chapters: 3,   slug: 'Joel' },
    { name: 'Amós',             chapters: 9,   slug: 'Amos' },
    { name: 'Abdías',           chapters: 1,   slug: 'Abdias' },
    { name: 'Jonás',            chapters: 4,   slug: 'Jonas' },
    { name: 'Miqueas',          chapters: 7,   slug: 'Miqueas' },
    { name: 'Nahum',            chapters: 3,   slug: 'Nahum' },
    { name: 'Habacuc',          chapters: 3,   slug: 'Habacuc' },
    { name: 'Sofonías',         chapters: 3,   slug: 'Sofonias' },
    { name: 'Hageo',            chapters: 2,   slug: 'Hageo' },
    { name: 'Zacarías',         chapters: 14,  slug: 'Zacarias' },
    { name: 'Malaquías',        chapters: 4,   slug: 'Malaquias' },
    { name: 'Mateo',            chapters: 28,  slug: 'Mateo' },
    { name: 'Marcos',           chapters: 16,  slug: 'Marcos' },
    { name: 'Lucas',            chapters: 24,  slug: 'Lucas' },
    { name: 'Juan',             chapters: 21,  slug: 'Juan' },
    { name: 'Hechos',           chapters: 28,  slug: 'Hechos' },
    { name: 'Romanos',          chapters: 16,  slug: 'Romanos' },
    { name: '1 Corintios',      chapters: 16,  slug: '1 Corintios' },
    { name: '2 Corintios',      chapters: 13,  slug: '2 Corintios' },
    { name: 'Gálatas',          chapters: 6,   slug: 'Galatas' },
    { name: 'Efesios',          chapters: 6,   slug: 'Efesios' },
    { name: 'Filipenses',       chapters: 4,   slug: 'Filipenses' },
    { name: 'Colosenses',       chapters: 4,   slug: 'Colosenses' },
    { name: '1 Tesalonicenses', chapters: 5,   slug: '1 Tesalonicenses' },
    { name: '2 Tesalonicenses', chapters: 3,   slug: '2 Tesalonicenses' },
    { name: '1 Timoteo',        chapters: 6,   slug: '1 Timoteo' },
    { name: '2 Timoteo',        chapters: 4,   slug: '2 Timoteo' },
    { name: 'Tito',             chapters: 3,   slug: 'Tito' },
    { name: 'Filemón',          chapters: 1,   slug: 'Filemon' },
    { name: 'Hebreos',          chapters: 13,  slug: 'Hebreos' },
    { name: 'Santiago',         chapters: 5,   slug: 'Santiago' },
    { name: '1 Pedro',          chapters: 5,   slug: '1 Pedro' },
    { name: '2 Pedro',          chapters: 3,   slug: '2 Pedro' },
    { name: '1 Juan',           chapters: 5,   slug: '1 Juan' },
    { name: '2 Juan',           chapters: 1,   slug: '2 Juan' },
    { name: '3 Juan',           chapters: 1,   slug: '3 Juan' },
    { name: 'Judas',            chapters: 1,   slug: 'Judas' },
    { name: 'Apocalipsis',      chapters: 22,  slug: 'Apocalipsis' }
  ];

  const PROGRESS_KEY     = 'pv-bible-audio-pos';
  const AUTOADVANCE_KEY  = 'pv-bible-audio-auto';
  const FILE_INDEX_KEY   = 'pv-bible-audio-files';

  // ── Audio persistente (no desaparece al cambiar de pestaña) ───────────
  const AUD = document.createElement('audio');
  AUD.preload  = 'none';
  AUD.controls = true;
  AUD.setAttribute('playsinline', '');           // iOS: no pantalla completa
  AUD.setAttribute('webkit-playsinline', '');    // iOS legacy
  AUD.setAttribute('x-webkit-airplay', 'allow'); // AirPlay
  AUD.style.cssText = 'width:100%;margin-top:12px;border-radius:14px;outline:none;display:block';

  let currentBook    = null;
  let currentChapter = null;

  // ── Reanudar si iOS pausó el audio al volver al primer plano ──────────
  let _bapWasPlaying = false;
  let _bapLastSrc = '';
  let _bapLastTime = 0;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      _bapWasPlaying = !!currentBook && !AUD.paused;
      _bapLastSrc  = AUD.src || '';
      _bapLastTime = AUD.currentTime || 0;
    } else if (_bapWasPlaying && AUD.paused && _bapLastSrc) {
      // iOS pausó el audio en background — reanudar desde donde quedó
      if (AUD.src !== _bapLastSrc) { AUD.src = _bapLastSrc; AUD.load(); }
      AUD.currentTime = _bapLastTime;
      AUD.play().catch(() => {});
      _bapWasPlaying = false;
    }
  });
  let fileIndex      = null;
  let indexLoadPromise = null;
  let lastSave = 0;

  // ── Helpers ────────────────────────────────────────────────────────────
  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || 'null'); }
    catch { return null; }
  }
  function saveProgress(book, chapter, time) {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify({ book, chapter, time: Math.floor(time||0), ts: Date.now() })); } catch {}
  }
  function updateResumeBanner(card, book, chapter, time) {
    const b = card?.querySelector('.pv-ba-resume');
    if (!b || !book || !chapter) return;
    const m = Math.floor((time||0)/60), s = Math.floor((time||0)%60);
    b.style.display = 'block';
    b.innerHTML = `Última escucha: <strong>${book} ${chapter}</strong> · ${m}:${String(s).padStart(2,'0')} min`;
  }
  function getAutoAdvance() { return localStorage.getItem(AUTOADVANCE_KEY) !== '0'; }
  function setAutoAdvance(v) { try { localStorage.setItem(AUTOADVANCE_KEY, v?'1':'0'); } catch {} }
  function stripAccents(s) { return (s||'').normalize('NFD').replace(/[̀-ͯ]/g,''); }
  function findBookByName(name) {
    if (!name) return null;
    const n = stripAccents(name).toLowerCase().trim();
    return BOOKS.find(b=>stripAccents(b.name).toLowerCase().trim()===n)
        || BOOKS.find(b=>stripAccents(b.slug).toLowerCase().trim()===n)
        || null;
  }

  async function ensureFileIndex() {
    if (fileIndex) return fileIndex;
    if (indexLoadPromise) return indexLoadPromise;
    indexLoadPromise = loadFileIndex().then(idx => { fileIndex=idx; indexLoadPromise=null; return idx; });
    return indexLoadPromise;
  }
  async function loadFileIndex() {
    try {
      const cached = localStorage.getItem(FILE_INDEX_KEY);
      if (cached) { const p=JSON.parse(cached); if (Array.isArray(p)&&p.length) return p; }
    } catch {}
    try {
      const res = await fetch(META_URL);
      if (!res.ok) return null;
      const data = await res.json();
      const files = (data.files||[]).filter(f=>/\.mp3$/i.test(f.name)).map(f=>f.name);
      if (!files.length) return null;
      try { localStorage.setItem(FILE_INDEX_KEY, JSON.stringify(files)); } catch {}
      return files;
    } catch { return null; }
  }
  function findFile(files, bookSlug, chapter) {
    if (!files) return null;
    const bookClean = stripAccents(bookSlug).toLowerCase().trim();
    const cc2 = String(chapter).padStart(2,'0'), cc1 = String(chapter);
    const candidates = files.filter(f=>stripAccents(f).toLowerCase().includes(bookClean));
    for (const f of candidates) {
      const fc = stripAccents(f).toLowerCase();
      if (fc.includes(` ${cc2}`)||fc.includes(`_${cc2}`)||fc.includes(`-${cc2}`)) return f;
    }
    for (const f of candidates) {
      const fc = stripAccents(f).toLowerCase();
      if (new RegExp(`[\\s_-]${cc1}(?!\\d)`).test(fc)) return f;
    }
    return null;
  }
  function buildAudioUrl(filename) {
    return filename ? `${DOWNLOAD_BASE}/${encodeURIComponent(filename)}` : null;
  }

  // ── MediaSession (Android Auto, CarPlay, Bluetooth) ────────────────────
  function setupMediaSession() {
    if (!('mediaSession' in navigator)) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title:   `${currentBook} — Cap. ${currentChapter}`,
        artist:  'Biblia en Audio · Reina Valera 1909',
        album:   'Palabra Viva',
        artwork: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      });
      navigator.mediaSession.setActionHandler('play',          () => AUD.play().catch(()=>{}));
      navigator.mediaSession.setActionHandler('pause',         () => AUD.pause());
      navigator.mediaSession.setActionHandler('stop',          stopBapAudio);
      navigator.mediaSession.setActionHandler('nexttrack',     goNextChapter);
      navigator.mediaSession.setActionHandler('previoustrack', goPrevChapter);
    } catch {}
  }

  function goNextChapter() {
    if (!currentBook || !currentChapter) return;
    const b = findBookByName(currentBook);
    if (!b) return;
    const card = document.querySelector('.pv-ba-card');
    if (currentChapter < b.chapters) {
      loadChapter(card, currentBook, currentChapter + 1, { autoplay: true });
    } else {
      const idx = BOOKS.findIndex(x => x.name === currentBook);
      if (idx < BOOKS.length - 1) loadChapter(card, BOOKS[idx+1].name, 1, { autoplay: true });
    }
  }

  function goPrevChapter() {
    if (!currentBook || !currentChapter) return;
    const card = document.querySelector('.pv-ba-card');
    if (currentChapter > 1) {
      loadChapter(card, currentBook, currentChapter - 1, { autoplay: true });
    } else {
      const idx = BOOKS.findIndex(x => x.name === currentBook);
      if (idx > 0) { const prev = BOOKS[idx-1]; loadChapter(card, prev.name, prev.chapters, { autoplay: true }); }
    }
  }

  function stopBapAudio() {
    try { AUD.pause(); AUD.src = ''; AUD.load(); } catch {}
    currentBook = null; currentChapter = null;
    try { navigator.mediaSession.playbackState = 'none'; navigator.mediaSession.metadata = null; } catch {}
    document.querySelector('.pv-bap-player')?.remove();
    document.dispatchEvent(new CustomEvent('pv-bible-audio', { detail: { playing: false, info: '' } }));
  }

  // ── Mini-player flotante ───────────────────────────────────────────────
  function refreshMiniPlayer() {
    if (!currentBook || !currentChapter) return;
    let el = document.querySelector('.pv-bap-player');
    if (!el) { el = document.createElement('div'); el.className = 'pv-bap-player'; document.body.appendChild(el); }
    const playing = !AUD.paused;
    el.innerHTML = `
      <div class="pv-bap-info">
        <div class="pv-bap-name">📖 ${currentBook} ${currentChapter}</div>
        <div class="pv-bap-state">${playing ? '🔴 Reproduciendo' : '⏸ Pausado'}</div>
      </div>
      <button class="pv-bap-pbtn" data-pp title="${playing?'Pausar':'Reproducir'}">${playing ? '⏸' : '▶'}</button>
      <button class="pv-bap-pbtn" data-prev title="Capítulo anterior" style="font-size:13px">⏮</button>
      <button class="pv-bap-pbtn" data-next title="Capítulo siguiente" style="font-size:13px">⏭</button>
      <button class="pv-bap-pclose" data-stop title="Cerrar">✕</button>`;
    el.querySelector('[data-pp]').onclick   = () => { AUD.paused ? AUD.play().catch(()=>{}) : AUD.pause(); };
    el.querySelector('[data-prev]').onclick = goPrevChapter;
    el.querySelector('[data-next]').onclick = goNextChapter;
    el.querySelector('[data-stop]').onclick = stopBapAudio;
  }

  function updateMiniPlayerState() {
    const el = document.querySelector('.pv-bap-player');
    if (!el) return;
    const playing = !AUD.paused;
    const stEl = el.querySelector('.pv-bap-state');
    const ppBtn = el.querySelector('[data-pp]');
    if (stEl) stEl.textContent = playing ? '🔴 Reproduciendo' : '⏸ Pausado';
    if (ppBtn) { ppBtn.textContent = playing ? '⏸' : '▶'; ppBtn.title = playing ? 'Pausar' : 'Reproducir'; }
  }

  // ── Eventos del audio (a nivel módulo — persisten siempre) ─────────────
  AUD.addEventListener('playing', () => {
    try { navigator.mediaSession.playbackState = 'playing'; } catch {}
    updateMiniPlayerState();
    const statusEl = document.querySelector('.pv-ba-status');
    if (statusEl && currentBook && currentChapter) statusEl.textContent = `${currentBook} ${currentChapter} — sonando`;
    document.dispatchEvent(new CustomEvent('pv-bible-audio', { detail: { playing: true, info: currentBook ? `${currentBook} ${currentChapter}` : '' } }));
  });

  AUD.addEventListener('pause', () => {
    try { navigator.mediaSession.playbackState = 'paused'; } catch {}
    updateMiniPlayerState();
    if (currentBook && currentChapter) {
      saveProgress(currentBook, currentChapter, AUD.currentTime);
      const card = document.querySelector('.pv-ba-card');
      if (card) updateResumeBanner(card, currentBook, currentChapter, AUD.currentTime);
    }
    if (currentBook) document.dispatchEvent(new CustomEvent('pv-bible-audio', { detail: { playing: false, info: currentBook ? `${currentBook} ${currentChapter}` : '' } }));
  });

  AUD.addEventListener('waiting',  () => {
    const stEl = document.querySelector('.pv-bap-state'); if (stEl) stEl.textContent = '⏳ Cargando…';
    const statusEl = document.querySelector('.pv-ba-status'); if (statusEl) statusEl.textContent = '⏳ Cargando audio…';
  });

  AUD.addEventListener('error', () => {
    const statusEl = document.querySelector('.pv-ba-status');
    if (statusEl) statusEl.textContent = 'Error al cargar el audio. Probá otro capítulo.';
  });

  AUD.addEventListener('ended', () => {
    if (!getAutoAdvance()) return;
    goNextChapter();
  });

  AUD.addEventListener('timeupdate', () => {
    const now = Date.now();
    if (now - lastSave > 5000 && currentBook && currentChapter) {
      lastSave = now;
      saveProgress(currentBook, currentChapter, AUD.currentTime);
      const card = document.querySelector('.pv-ba-card');
      if (card) updateResumeBanner(card, currentBook, currentChapter, AUD.currentTime);
    }
  });

  // ── Carga de capítulo ──────────────────────────────────────────────────
  async function loadChapter(card, bookName, chapter, opts = {}) {
    const book = findBookByName(bookName);
    if (!book) return;
    chapter = Math.max(1, Math.min(chapter, book.chapters));
    // Exclusión mutua: si la radio está sonando y vamos a reproducir, pararla primero
    if (opts.autoplay !== false) {
      try { if (window.PalabraVivaCanales?.isPlaying?.()) window.PalabraVivaCanales.stop(); } catch {}
    }

    currentBook    = book.name;
    currentChapter = chapter;

    // Actualizar selects del card (si está visible)
    const bookSel = card?.querySelector('.pv-ba-book');
    const chapSel = card?.querySelector('.pv-ba-chap');
    const status  = card?.querySelector('.pv-ba-status');

    if (bookSel && bookSel.value !== book.name) bookSel.value = book.name;
    if (chapSel) {
      let opts2 = '';
      for (let i = 1; i <= book.chapters; i++) opts2 += `<option value="${i}">Capítulo ${i}</option>`;
      chapSel.innerHTML = opts2;
      chapSel.value = String(chapter);
    }
    if (status) status.textContent = 'Buscando audio…';

    // Actualizar mini-player con el nuevo título de inmediato
    refreshMiniPlayer();

    // Obtener índice de archivos
    const idx = await ensureFileIndex();
    if (!idx) {
      if (status) status.textContent = 'No se pudo cargar el catálogo. Revisá tu conexión.';
      return;
    }

    const filename = findFile(idx, book.slug, chapter);
    if (!filename) {
      if (status) status.textContent = `No hay audio disponible para ${book.name} ${chapter}.`;
      AUD.removeAttribute('src');
      return;
    }

    AUD.src = buildAudioUrl(filename);
    AUD.load();

    if (opts.resumeTime > 0) {
      AUD.addEventListener('loadedmetadata', function once() {
        try { AUD.currentTime = opts.resumeTime; } catch {}
        AUD.removeEventListener('loadedmetadata', once);
      });
    }

    if (status) status.textContent = `${book.name} ${chapter} — listo`;
    if (card) updateResumeBanner(card, book.name, chapter, opts.resumeTime || 0);

    // MediaSession
    setupMediaSession();

    // Notificar al home-shortcuts del nuevo capítulo cargado
    document.dispatchEvent(new CustomEvent('pv-bible-audio', { detail: { playing: !AUD.paused, info: `${book.name} ${chapter}` } }));

    if (opts.autoplay !== false) {
      AUD.play().catch(() => {
        if (status) status.textContent = `${book.name} ${chapter} — tocá ▶ para reproducir`;
      });
    }

    refreshMiniPlayer();
  }

  // ── CSS ────────────────────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('pv-bap-style-v3')) return;
    ['pv-bap-style', 'pv-bap-style-v2'].forEach(id => document.getElementById(id)?.remove());
    const style = document.createElement('style');
    style.id = 'pv-bap-style-v3';
    style.textContent = `
      /* Card en pestaña Biblia */
      .pv-ba-card{border-color:rgba(124,74,30,.45);background:linear-gradient(135deg,rgba(124,74,30,.10),var(--card))}
      .pv-ba-card .pv-ba-title{margin:0 0 4px;font-size:20px;line-height:1.15}
      .pv-ba-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
      .pv-ba-select{width:100%;border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:14px;padding:11px;font:inherit;outline:none;box-sizing:border-box}
      .pv-ba-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
      .pv-ba-btn{border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:999px;padding:11px;font-weight:900;min-height:44px;cursor:pointer;font-size:14px}
      .pv-ba-btn.primary{border:0;background:linear-gradient(135deg,var(--brand),var(--brand2));color:white}
      .pv-ba-btn.full{grid-column:1 / -1}
      .pv-ba-status{font-size:13px;color:var(--muted);margin-top:8px;text-align:center;min-height:18px}
      .pv-ba-toggle{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:12px;padding:10px 12px;border:1px solid var(--line);border-radius:14px;background:var(--card2)}
      .pv-ba-toggle label{font-size:14px;font-weight:700;cursor:pointer}
      .pv-ba-toggle input{width:20px;height:20px;cursor:pointer}
      .pv-ba-resume{padding:10px 12px;border:1px dashed var(--line);border-radius:14px;background:var(--card2);font-size:14px;color:var(--muted);margin-top:10px}
      .pv-ba-resume strong{color:var(--text)}
      @media(max-width:420px){.pv-ba-row{grid-template-columns:1fr}.pv-ba-actions{grid-template-columns:1fr}}

      /* Mini-player flotante (persiste en cualquier sección) */
      .pv-bap-player{
        position:fixed;left:10px;right:10px;
        bottom:calc(72px + env(safe-area-inset-bottom));
        z-index:9002;
        background:var(--card,rgba(30,20,5,.97));
        border:1px solid rgba(124,74,30,.45);
        border-radius:20px;
        padding:11px 14px;
        display:grid;
        grid-template-columns:1fr auto auto auto auto;
        gap:8px;align-items:center;
        box-shadow:0 16px 48px rgba(0,0,0,.55);
        max-width:720px;margin-left:auto;margin-right:auto;
        backdrop-filter:blur(16px);
      }
      .pv-bap-name{font-weight:900;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .pv-bap-state{font-size:11px;color:var(--muted,#a08060)}
      .pv-bap-pbtn{
        border:0;width:40px;height:40px;border-radius:50%;
        background:linear-gradient(135deg,#7c4a1e,#b45309);
        color:#fff;font-weight:900;font-size:16px;cursor:pointer;
      }
      .pv-bap-pclose{
        border:1px solid rgba(124,74,30,.3);background:transparent;
        color:var(--text,#f5deb3);border-radius:50%;
        width:32px;height:32px;cursor:pointer;font-size:14px;
      }
    `;
    document.head.appendChild(style);
  }

  // ── Construir card en pestaña Biblia ───────────────────────────────────
  function buildCard() {
    const card = document.createElement('section');
    card.className = 'card pv-ba-card';

    let bookOpts = '';
    BOOKS.forEach(b => { bookOpts += `<option value="${b.name}">${b.name}</option>`; });

    card.innerHTML = `
      <p class="ref">Biblia en audio</p>
      <h3 class="pv-ba-title">🎧 Escuchar narración (Reina Valera 1909)</h3>
      <p class="soft">Elegí libro y capítulo, o reanudá donde quedaste. Voz humana. Funciona con Android Auto, CarPlay y Bluetooth.</p>

      <div class="pv-ba-row">
        <select class="pv-ba-select pv-ba-book" aria-label="Libro">${bookOpts}</select>
        <select class="pv-ba-select pv-ba-chap" aria-label="Capítulo"></select>
      </div>

      <div class="pv-ba-audio-slot" style="margin-top:10px"></div>
      <p class="pv-ba-status"></p>

      <div class="pv-ba-actions">
        <button class="pv-ba-btn" data-act="prev">⏮ Cap. anterior</button>
        <button class="pv-ba-btn" data-act="next">Cap. siguiente ⏭</button>
        <button class="pv-ba-btn primary full" data-act="resume">▶ Reanudar donde quedé</button>
        <button class="pv-ba-btn full"         data-act="start">⛪ Empezar desde Génesis 1</button>
      </div>

      <div class="pv-ba-toggle">
        <label for="pv-ba-auto-input">Auto-avanzar al próximo capítulo</label>
        <input id="pv-ba-auto-input" type="checkbox" />
      </div>

      <div class="pv-ba-resume" style="display:none"></div>
    `;

    // Insertar el elemento <audio> persistente en el slot
    card.querySelector('.pv-ba-audio-slot').appendChild(AUD);

    // Auto-advance toggle
    const autoInput = card.querySelector('#pv-ba-auto-input');
    autoInput.checked = getAutoAdvance();
    autoInput.onchange = () => setAutoAdvance(autoInput.checked);

    // Banner de última escucha
    const progress = loadProgress();
    if (progress?.book && progress?.chapter) {
      updateResumeBanner(card, progress.book, progress.chapter, progress.time || 0);
    }

    const bookSel = card.querySelector('.pv-ba-book');
    const chapSel = card.querySelector('.pv-ba-chap');

    bookSel.onchange = () => {
      const b = findBookByName(bookSel.value);
      if (b) loadChapter(card, b.name, 1, { autoplay: false });
    };
    chapSel.onchange = () => {
      const ch = parseInt(chapSel.value, 10);
      if (ch) loadChapter(card, bookSel.value, ch, { autoplay: false });
    };

    card.querySelector('[data-act="prev"]').onclick = () => goPrevChapter();
    card.querySelector('[data-act="next"]').onclick = () => goNextChapter();

    card.querySelector('[data-act="resume"]').onclick = () => {
      const p = loadProgress();
      if (p?.book && p?.chapter) loadChapter(card, p.book, p.chapter, { autoplay: true, resumeTime: p.time || 0 });
      else loadChapter(card, 'Génesis', 1, { autoplay: true });
    };
    card.querySelector('[data-act="start"]').onclick = () => loadChapter(card, 'Génesis', 1, { autoplay: true });

    // Si hay audio ya cargado, mostrar libro/cap actual en los selects
    if (currentBook && currentChapter) {
      const b = findBookByName(currentBook);
      if (b) {
        bookSel.value = b.name;
        let opts2 = '';
        for (let i = 1; i <= b.chapters; i++) opts2 += `<option value="${i}">Capítulo ${i}</option>`;
        chapSel.innerHTML = opts2;
        chapSel.value = String(currentChapter);
        updateResumeBanner(card, currentBook, currentChapter, AUD.currentTime);
      }
    } else {
      // Nada cargado aún: precargar capítulo según selección actual de la Biblia
      const sel = getCurrentBibleSelection();
      if (sel) {
        loadChapter(card, sel.book, sel.chapter, { autoplay: false });
      } else {
        const g = BOOKS[0];
        let opts2 = '';
        for (let i = 1; i <= g.chapters; i++) opts2 += `<option value="${i}">Capítulo ${i}</option>`;
        chapSel.innerHTML = opts2;
      }
    }

    return card;
  }

  function getCurrentBibleSelection() {
    const selects = document.querySelectorAll('.fieldLabel select.select');
    if (selects.length >= 2) {
      const book    = selects[0].value;
      const chapter = parseInt(selects[1].value, 10);
      if (book && chapter) return { book, chapter };
    }
    return null;
  }

  // ── Gestión de tabs ────────────────────────────────────────────────────
  function isBibleTab() {
    const h1 = document.querySelector('.topbar h1, h1');
    return h1?.textContent?.trim() === 'Biblia';
  }

  function removeOldInvasiveElements() {
    document.querySelectorAll(
      '.pv-bap-fab,.pv-bap-quick,.pv-bap-home,.pv-bap-panel,' +
      '.pv-audio-fixed,.pv-audio-box,.pv-audio-card-force,' +
      '.pv-voice-quick,.pv-voice-panel,.pv-audio-one,' +
      '.pv-archive-float,.pv-archive-panel,.pv-archive-home'
    ).forEach(el => el.remove());
  }

  function insertIntoBibleTab() {
    if (!isBibleTab()) return false;
    if (document.querySelector('.pv-ba-card')) {
      // Ya está el card — asegurarse de que el <audio> esté dentro del slot
      const slot = document.querySelector('.pv-ba-audio-slot');
      if (slot && !slot.contains(AUD)) slot.appendChild(AUD);
      return true;
    }
    const gradient = document.querySelector('.app .stack .card.gradient');
    if (!gradient) return false;

    const card = buildCard();
    gradient.insertAdjacentElement('afterend', card);
    return true;
  }

  function removeCardIfNotBibleTab() {
    if (!isBibleTab()) {
      const card = document.querySelector('.pv-ba-card');
      if (card) {
        // Guardar progreso pero NO detener el audio
        if (!AUD.paused && currentBook && currentChapter) {
          saveProgress(currentBook, currentChapter, AUD.currentTime);
        }
        // Mover <audio> al body para que siga sonando
        if (card.contains(AUD)) document.body.appendChild(AUD);
        AUD.style.display = 'none'; // oculto — controlado por mini-player
        card.remove();
      }
    } else {
      // Volvió a la pestaña Biblia: restaurar display del <audio>
      AUD.style.display = 'block';
    }
  }

  function boot() {
    injectStyles();
    removeOldInvasiveElements();
    if (isBibleTab()) {
      insertIntoBibleTab();
      removeCardIfNotBibleTab(); // limpia estado incorrecto
    } else {
      removeCardIfNotBibleTab();
    }
    // Si hay audio activo, mantener el mini-player visible
    if (currentBook && currentChapter && !AUD.paused) {
      refreshMiniPlayer();
    }
  }

  window.PalabraVivaAudioBible = {
    openInBibleTab: () => {
      const navs     = document.querySelectorAll('.bottom .nav');
      const bibleNav = Array.from(navs).find(n => (n.textContent||'').includes('Biblia'));
      if (bibleNav) bibleNav.click();
      setTimeout(boot, 100);
    },
    stop:  stopBapAudio,
    next:  goNextChapter,
    prev:  goPrevChapter,
    isPlaying:    () => !!currentBook && !AUD.paused,
    togglePlay:   () => { if (!currentBook) return; AUD.paused ? AUD.play().catch(()=>{}) : AUD.pause(); },
    getCurrentInfo: () => currentBook ? `${currentBook} ${currentChapter}` : ''
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('load', boot);
  setInterval(boot, 900);
})();

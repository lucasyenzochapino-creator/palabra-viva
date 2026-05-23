(() => {
  // ========================
  // BIBLIA EN AUDIO - REPRODUCTOR INTERNO
  // ========================
  // - Se inserta DENTRO de la pestaña Biblia (no flotante, no modal global).
  // - Reproduce MP3 directos desde archive.org (BibliaEnAudioRVA1909).
  // - Permite elegir libro y capítulo.
  // - Guarda el progreso (libro, capítulo, segundo) en localStorage.
  // - Reanudar donde quedaste o empezar desde Génesis 1.
  // - Auto-avance al próximo capítulo.
  // - No redirige. Todo dentro de la app.

  const ARCHIVE_ITEM = 'BibliaEnAudioRVA1909';
  const META_URL = `https://archive.org/metadata/${ARCHIVE_ITEM}`;
  const DOWNLOAD_BASE = `https://archive.org/download/${ARCHIVE_ITEM}`;

  // Orden canónico de los 66 libros RV1909
  const BOOKS = [
    { name: 'Génesis',        chapters: 50, slug: 'Genesis' },
    { name: 'Éxodo',          chapters: 40, slug: 'Exodo' },
    { name: 'Levítico',       chapters: 27, slug: 'Levitico' },
    { name: 'Números',        chapters: 36, slug: 'Numeros' },
    { name: 'Deuteronomio',   chapters: 34, slug: 'Deuteronomio' },
    { name: 'Josué',          chapters: 24, slug: 'Josue' },
    { name: 'Jueces',         chapters: 21, slug: 'Jueces' },
    { name: 'Rut',            chapters: 4,  slug: 'Rut' },
    { name: '1 Samuel',       chapters: 31, slug: '1 Samuel' },
    { name: '2 Samuel',       chapters: 24, slug: '2 Samuel' },
    { name: '1 Reyes',        chapters: 22, slug: '1 Reyes' },
    { name: '2 Reyes',        chapters: 25, slug: '2 Reyes' },
    { name: '1 Crónicas',     chapters: 29, slug: '1 Cronicas' },
    { name: '2 Crónicas',     chapters: 36, slug: '2 Cronicas' },
    { name: 'Esdras',         chapters: 10, slug: 'Esdras' },
    { name: 'Nehemías',       chapters: 13, slug: 'Nehemias' },
    { name: 'Ester',          chapters: 10, slug: 'Ester' },
    { name: 'Job',            chapters: 42, slug: 'Job' },
    { name: 'Salmos',         chapters: 150, slug: 'Salmos' },
    { name: 'Proverbios',     chapters: 31, slug: 'Proverbios' },
    { name: 'Eclesiastés',    chapters: 12, slug: 'Eclesiastes' },
    { name: 'Cantares',       chapters: 8,  slug: 'Cantares' },
    { name: 'Isaías',         chapters: 66, slug: 'Isaias' },
    { name: 'Jeremías',       chapters: 52, slug: 'Jeremias' },
    { name: 'Lamentaciones',  chapters: 5,  slug: 'Lamentaciones' },
    { name: 'Ezequiel',       chapters: 48, slug: 'Ezequiel' },
    { name: 'Daniel',         chapters: 12, slug: 'Daniel' },
    { name: 'Oseas',          chapters: 14, slug: 'Oseas' },
    { name: 'Joel',           chapters: 3,  slug: 'Joel' },
    { name: 'Amós',           chapters: 9,  slug: 'Amos' },
    { name: 'Abdías',         chapters: 1,  slug: 'Abdias' },
    { name: 'Jonás',          chapters: 4,  slug: 'Jonas' },
    { name: 'Miqueas',        chapters: 7,  slug: 'Miqueas' },
    { name: 'Nahum',          chapters: 3,  slug: 'Nahum' },
    { name: 'Habacuc',        chapters: 3,  slug: 'Habacuc' },
    { name: 'Sofonías',       chapters: 3,  slug: 'Sofonias' },
    { name: 'Hageo',          chapters: 2,  slug: 'Hageo' },
    { name: 'Zacarías',       chapters: 14, slug: 'Zacarias' },
    { name: 'Malaquías',      chapters: 4,  slug: 'Malaquias' },
    { name: 'Mateo',          chapters: 28, slug: 'Mateo' },
    { name: 'Marcos',         chapters: 16, slug: 'Marcos' },
    { name: 'Lucas',          chapters: 24, slug: 'Lucas' },
    { name: 'Juan',           chapters: 21, slug: 'Juan' },
    { name: 'Hechos',         chapters: 28, slug: 'Hechos' },
    { name: 'Romanos',        chapters: 16, slug: 'Romanos' },
    { name: '1 Corintios',    chapters: 16, slug: '1 Corintios' },
    { name: '2 Corintios',    chapters: 13, slug: '2 Corintios' },
    { name: 'Gálatas',        chapters: 6,  slug: 'Galatas' },
    { name: 'Efesios',        chapters: 6,  slug: 'Efesios' },
    { name: 'Filipenses',     chapters: 4,  slug: 'Filipenses' },
    { name: 'Colosenses',     chapters: 4,  slug: 'Colosenses' },
    { name: '1 Tesalonicenses', chapters: 5, slug: '1 Tesalonicenses' },
    { name: '2 Tesalonicenses', chapters: 3, slug: '2 Tesalonicenses' },
    { name: '1 Timoteo',      chapters: 6,  slug: '1 Timoteo' },
    { name: '2 Timoteo',      chapters: 4,  slug: '2 Timoteo' },
    { name: 'Tito',           chapters: 3,  slug: 'Tito' },
    { name: 'Filemón',        chapters: 1,  slug: 'Filemon' },
    { name: 'Hebreos',        chapters: 13, slug: 'Hebreos' },
    { name: 'Santiago',       chapters: 5,  slug: 'Santiago' },
    { name: '1 Pedro',        chapters: 5,  slug: '1 Pedro' },
    { name: '2 Pedro',        chapters: 3,  slug: '2 Pedro' },
    { name: '1 Juan',         chapters: 5,  slug: '1 Juan' },
    { name: '2 Juan',         chapters: 1,  slug: '2 Juan' },
    { name: '3 Juan',         chapters: 1,  slug: '3 Juan' },
    { name: 'Judas',          chapters: 1,  slug: 'Judas' },
    { name: 'Apocalipsis',    chapters: 22, slug: 'Apocalipsis' }
  ];

  const PROGRESS_KEY = 'pv-bible-audio-pos';
  const AUTOADVANCE_KEY = 'pv-bible-audio-auto';
  const FILE_INDEX_KEY = 'pv-bible-audio-files';

  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || 'null'); }
    catch { return null; }
  }
  function saveProgress(book, chapter, time) {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify({
        book, chapter, time: Math.floor(time || 0), ts: Date.now()
      }));
    } catch {}
  }

  function updateResumeBanner(card, book, chapter, time) {
    const banner = card.querySelector('.pv-ba-resume');
    if (!banner || !book || !chapter) return;
    const mins = Math.floor((time || 0) / 60);
    const secs = Math.floor((time || 0) % 60);
    banner.style.display = 'block';
    banner.innerHTML = `Última escucha: <strong>${book} ${chapter}</strong> · ${mins}:${String(secs).padStart(2, '0')} min`;
  }
  function getAutoAdvance() {
    return localStorage.getItem(AUTOADVANCE_KEY) !== '0';
  }
  function setAutoAdvance(v) {
    try { localStorage.setItem(AUTOADVANCE_KEY, v ? '1' : '0'); } catch {}
  }

  async function loadFileIndex() {
    try {
      const cached = localStorage.getItem(FILE_INDEX_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    try {
      const res = await fetch(META_URL);
      if (!res.ok) return null;
      const data = await res.json();
      const files = (data.files || [])
        .filter(f => /\.mp3$/i.test(f.name))
        .map(f => f.name);
      if (files.length === 0) return null;
      try { localStorage.setItem(FILE_INDEX_KEY, JSON.stringify(files)); } catch {}
      return files;
    } catch {
      return null;
    }
  }

  function stripAccents(s) {
    return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function findFile(files, bookSlug, chapter) {
    if (!files) return null;
    const bookClean = stripAccents(bookSlug).toLowerCase().trim();
    const cc2 = String(chapter).padStart(2, '0');
    const cc1 = String(chapter);

    const candidates = files.filter(f => {
      const fc = stripAccents(f).toLowerCase();
      return fc.includes(bookClean);
    });

    for (const f of candidates) {
      const fc = stripAccents(f).toLowerCase();
      if (fc.includes(` ${cc2}`) || fc.includes(`_${cc2}`) || fc.includes(`-${cc2}`)) return f;
    }
    for (const f of candidates) {
      const fc = stripAccents(f).toLowerCase();
      const re = new RegExp(`[\\s_-]${cc1}(?!\\d)`);
      if (re.test(fc)) return f;
    }
    return null;
  }

  function buildAudioUrl(filename) {
    if (!filename) return null;
    return `${DOWNLOAD_BASE}/${encodeURIComponent(filename)}`;
  }

  function injectStyles() {
    if (document.getElementById('pv-bap-style-v2')) return;
    document.getElementById('pv-bap-style')?.remove();
    const style = document.createElement('style');
    style.id = 'pv-bap-style-v2';
    style.textContent = `
      .pv-ba-card{border-color:rgba(124,74,30,.45);background:linear-gradient(135deg,rgba(124,74,30,.10),var(--card))}
      .pv-ba-card .pv-ba-title{margin:0 0 4px;font-size:20px;line-height:1.15}
      .pv-ba-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
      .pv-ba-select{width:100%;border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:14px;padding:11px;font:inherit;outline:none;box-sizing:border-box}
      .pv-ba-audio{width:100%;margin-top:12px;border-radius:14px;outline:none}
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
    `;
    document.head.appendChild(style);
  }

  function removeOldInvasiveElements() {
    document.querySelectorAll(
      '.pv-bap-fab, .pv-bap-quick, .pv-bap-home, .pv-bap-panel, ' +
      '.pv-audio-fixed, .pv-audio-box, .pv-audio-card-force, ' +
      '.pv-voice-quick, .pv-voice-panel, .pv-audio-one, ' +
      '.pv-archive-float, .pv-archive-panel, .pv-archive-home'
    ).forEach(el => el.remove());
  }

  function isBibleTab() {
    const h1 = document.querySelector('.topbar h1, h1');
    return h1 && h1.textContent && h1.textContent.trim() === 'Biblia';
  }

  function getCurrentBibleSelection() {
    const selects = document.querySelectorAll('.fieldLabel select.select');
    if (selects.length >= 2) {
      const book = selects[0].value;
      const chapter = parseInt(selects[1].value, 10);
      if (book && chapter) return { book, chapter };
    }
    return null;
  }

  let currentBook = null;
  let currentChapter = null;
  let fileIndex = null;
  let indexLoadPromise = null;

  async function ensureFileIndex() {
    if (fileIndex) return fileIndex;
    if (indexLoadPromise) return indexLoadPromise;
    indexLoadPromise = loadFileIndex().then(idx => {
      fileIndex = idx;
      indexLoadPromise = null;
      return idx;
    });
    return indexLoadPromise;
  }

  function findBookByName(name) {
    if (!name) return null;
    const n = stripAccents(name).toLowerCase().trim();
    return BOOKS.find(b => stripAccents(b.name).toLowerCase().trim() === n)
      || BOOKS.find(b => stripAccents(b.slug).toLowerCase().trim() === n)
      || null;
  }

  async function loadChapter(card, bookName, chapter, opts = {}) {
    const book = findBookByName(bookName);
    if (!book) return;
    if (chapter < 1) chapter = 1;
    if (chapter > book.chapters) chapter = book.chapters;

    currentBook = book.name;
    currentChapter = chapter;

    const status = card.querySelector('.pv-ba-status');
    const audio = card.querySelector('.pv-ba-audio');
    const bookSel = card.querySelector('.pv-ba-book');
    const chapSel = card.querySelector('.pv-ba-chap');

    if (bookSel && bookSel.value !== book.name) bookSel.value = book.name;
    if (chapSel) {
      const currentVal = String(chapter);
      let opts2 = '';
      for (let i = 1; i <= book.chapters; i++) opts2 += `<option value="${i}">Capítulo ${i}</option>`;
      chapSel.innerHTML = opts2;
      chapSel.value = currentVal;
    }

    status.textContent = 'Buscando audio…';

    const idx = await ensureFileIndex();
    if (!idx) {
      status.textContent = 'No se pudo cargar el catálogo de audios. Revisá tu conexión.';
      return;
    }

    const filename = findFile(idx, book.slug, chapter);
    if (!filename) {
      status.textContent = `No hay audio disponible para ${book.name} ${chapter}.`;
      audio.removeAttribute('src');
      return;
    }

    const url = buildAudioUrl(filename);
    audio.src = url;
    audio.load();

    if (opts.resumeTime && opts.resumeTime > 0) {
      audio.addEventListener('loadedmetadata', function once() {
        try { audio.currentTime = opts.resumeTime; } catch {}
        audio.removeEventListener('loadedmetadata', once);
      });
    }

    status.textContent = `${book.name} ${chapter} — listo`;
    updateResumeBanner(card, book.name, chapter, opts.resumeTime || 0);

    if (opts.autoplay !== false) {
      audio.play().catch(() => {
        status.textContent = `${book.name} ${chapter} — tocá ▶ para reproducir`;
      });
    }
  }

  function attachAudioEvents(card) {
    const audio = card.querySelector('.pv-ba-audio');
    const status = card.querySelector('.pv-ba-status');

    let lastSave = 0;
    audio.addEventListener('timeupdate', () => {
      const now = Date.now();
      if (now - lastSave > 5000 && currentBook && currentChapter) {
        lastSave = now;
        saveProgress(currentBook, currentChapter, audio.currentTime);
        updateResumeBanner(card, currentBook, currentChapter, audio.currentTime);
      }
    });

    audio.addEventListener('pause', () => {
      if (currentBook && currentChapter) {
        saveProgress(currentBook, currentChapter, audio.currentTime);
        updateResumeBanner(card, currentBook, currentChapter, audio.currentTime);
      }
    });

    audio.addEventListener('playing', () => {
      if (currentBook && currentChapter) {
        status.textContent = `${currentBook} ${currentChapter} — sonando`;
      }
    });

    audio.addEventListener('error', () => {
      status.textContent = 'Error al cargar el audio. Probá otro capítulo.';
    });

    audio.addEventListener('ended', () => {
      if (!getAutoAdvance()) return;
      const book = findBookByName(currentBook);
      if (!book) return;
      if (currentChapter < book.chapters) {
        loadChapter(card, currentBook, currentChapter + 1, { autoplay: true });
      } else {
        const idx = BOOKS.findIndex(b => b.name === book.name);
        if (idx >= 0 && idx < BOOKS.length - 1) {
          const next = BOOKS[idx + 1];
          loadChapter(card, next.name, 1, { autoplay: true });
        } else {
          status.textContent = '🎉 Terminaste toda la Biblia. Bendiciones.';
        }
      }
    });
  }

  function buildCard() {
    const card = document.createElement('section');
    card.className = 'card pv-ba-card';

    let bookOpts = '';
    BOOKS.forEach(b => { bookOpts += `<option value="${b.name}">${b.name}</option>`; });

    card.innerHTML = `
      <p class="ref">Biblia en audio</p>
      <h3 class="pv-ba-title">Escuchar narración (Reina Valera 1909)</h3>
      <p class="soft">Elegí libro y capítulo, o reanudá donde quedaste. Voz humana narrada.</p>

      <div class="pv-ba-row">
        <select class="pv-ba-select pv-ba-book" aria-label="Libro">${bookOpts}</select>
        <select class="pv-ba-select pv-ba-chap" aria-label="Capítulo"></select>
      </div>

      <audio class="pv-ba-audio" controls preload="none"></audio>
      <p class="pv-ba-status"></p>

      <div class="pv-ba-actions">
        <button class="pv-ba-btn" data-act="prev">⏮ Capítulo anterior</button>
        <button class="pv-ba-btn" data-act="next">Capítulo siguiente ⏭</button>
        <button class="pv-ba-btn primary full" data-act="resume">Reanudar donde quedé</button>
        <button class="pv-ba-btn full" data-act="start">⛪ Empezar desde Génesis 1</button>
      </div>

      <div class="pv-ba-toggle">
        <label for="pv-ba-auto-input">Auto-avanzar al próximo capítulo</label>
        <input id="pv-ba-auto-input" type="checkbox" />
      </div>

      <div class="pv-ba-resume" style="display:none"></div>
    `;

    const autoInput = card.querySelector('#pv-ba-auto-input');
    autoInput.checked = getAutoAdvance();
    autoInput.onchange = () => setAutoAdvance(autoInput.checked);

    const progress = loadProgress();
    const resumeBanner = card.querySelector('.pv-ba-resume');
    if (progress && progress.book && progress.chapter) {
      const mins = Math.floor((progress.time || 0) / 60);
      const secs = Math.floor((progress.time || 0) % 60);
      resumeBanner.style.display = 'block';
      resumeBanner.innerHTML = `Última escucha: <strong>${progress.book} ${progress.chapter}</strong> · ${mins}:${String(secs).padStart(2, '0')} min`;
    }

    const bookSel = card.querySelector('.pv-ba-book');
    const chapSel = card.querySelector('.pv-ba-chap');

    bookSel.onchange = () => {
      const b = findBookByName(bookSel.value);
      if (!b) return;
      loadChapter(card, b.name, 1, { autoplay: false });
    };

    chapSel.onchange = () => {
      const ch = parseInt(chapSel.value, 10);
      if (!ch) return;
      loadChapter(card, bookSel.value, ch, { autoplay: false });
    };

    card.querySelector('[data-act="prev"]').onclick = () => {
      if (!currentBook || !currentChapter) return;
      if (currentChapter > 1) {
        loadChapter(card, currentBook, currentChapter - 1, { autoplay: true });
      } else {
        const idx = BOOKS.findIndex(b => b.name === currentBook);
        if (idx > 0) {
          const prev = BOOKS[idx - 1];
          loadChapter(card, prev.name, prev.chapters, { autoplay: true });
        }
      }
    };
    card.querySelector('[data-act="next"]').onclick = () => {
      if (!currentBook || !currentChapter) return;
      const book = findBookByName(currentBook);
      if (!book) return;
      if (currentChapter < book.chapters) {
        loadChapter(card, currentBook, currentChapter + 1, { autoplay: true });
      } else {
        const idx = BOOKS.findIndex(b => b.name === book.name);
        if (idx >= 0 && idx < BOOKS.length - 1) {
          const next = BOOKS[idx + 1];
          loadChapter(card, next.name, 1, { autoplay: true });
        }
      }
    };
    card.querySelector('[data-act="resume"]').onclick = () => {
      const p = loadProgress();
      if (p && p.book && p.chapter) {
        loadChapter(card, p.book, p.chapter, { autoplay: true, resumeTime: p.time || 0 });
      } else {
        loadChapter(card, 'Génesis', 1, { autoplay: true });
      }
    };
    card.querySelector('[data-act="start"]').onclick = () => {
      loadChapter(card, 'Génesis', 1, { autoplay: true });
    };

    attachAudioEvents(card);

    const sel = getCurrentBibleSelection();
    if (sel) {
      loadChapter(card, sel.book, sel.chapter, { autoplay: false });
    } else {
      const g = BOOKS[0];
      let opts = '';
      for (let i = 1; i <= g.chapters; i++) opts += `<option value="${i}">Capítulo ${i}</option>`;
      chapSel.innerHTML = opts;
    }

    return card;
  }

  function insertIntoBibleTab() {
    if (!isBibleTab()) return false;
    if (document.querySelector('.pv-ba-card')) return true;

    const gradient = document.querySelector('.app .stack .card.gradient');
    if (!gradient) return false;

    const card = buildCard();
    gradient.insertAdjacentElement('afterend', card);
    return true;
  }

  function removeIfNotBibleTab() {
    if (!isBibleTab()) {
      const card = document.querySelector('.pv-ba-card');
      if (card) {
        const audio = card.querySelector('.pv-ba-audio');
        if (audio && !audio.paused && currentBook && currentChapter) {
          saveProgress(currentBook, currentChapter, audio.currentTime);
        }
        try { audio?.pause(); } catch {}
        card.remove();
      }
    }
  }

  function boot() {
    injectStyles();
    removeOldInvasiveElements();
    if (isBibleTab()) {
      insertIntoBibleTab();
    } else {
      removeIfNotBibleTab();
    }
  }

  window.PalabraVivaAudioBible = {
    openInBibleTab: () => {
      const navs = document.querySelectorAll('.bottom .nav');
      const bibleNav = Array.from(navs).find(n => (n.textContent || '').includes('Biblia'));
      if (bibleNav) bibleNav.click();
      setTimeout(boot, 100);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  window.addEventListener('load', boot);
  setInterval(boot, 900);
})();
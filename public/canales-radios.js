(() => {
  try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch {}

  // ========================
  // CANALES EN ESPAÑOL LATINO
  // ========================
  const CHANNELS = [
    {
      name: 'Proyecto Biblia (BibleProject Español)',
      type: 'Biblia animada · Español latino',
      note: 'Videos animados oficiales sobre libros y temas bíblicos, todos doblados al español.',
      embed: 'https://www.youtube-nocookie.com/embed/videoseries?list=PLlD1Kzc7omJmXnWoWlFVJ5AFOTPuYyGPg',
      channel: 'https://www.youtube.com/c/bibleprojectespanol'
    },
    {
      name: 'Nuevo Tiempo',
      type: 'TV cristiana adventista · Español',
      note: 'Contenido cristiano en español latino: familia, Biblia, esperanza, mensajes diarios.',
      embed: null,
      channel: 'https://www.youtube.com/@NuevoTiempoTV'
    },
    {
      name: 'Enlace TV',
      type: 'TV cristiana latina · Español',
      note: 'Predicaciones, programas familiares y contenido cristiano en español.',
      embed: null,
      channel: 'https://www.youtube.com/@enlacetv'
    },
    {
      name: 'Coalición por el Evangelio',
      type: 'Enseñanza bíblica seria · Español',
      note: 'Recursos teológicos reformados y bíblicos en español latino.',
      embed: null,
      channel: 'https://www.youtube.com/@coalicionporelevangelio'
    },
    {
      name: 'Hillsong en Español',
      type: 'Música de adoración · Español',
      note: 'Canciones de adoración cristianas en español.',
      embed: null,
      channel: 'https://www.youtube.com/@hillsongenespanol'
    }
  ];

  const RADIOS_FALLBACK = [
    {
      id: 'fallback-bbn',
      name: 'BBN Radio Español',
      type: 'Radio bíblica',
      note: 'Música cristiana, Biblia y enseñanza 24/7 en español.',
      stream: 'https://streams.radiomast.io/475ebed1-595e-4717-b888-64fe8fc6b09f',
      page: 'https://bbn1.bbnradio.org/spanish/',
      favicon: ''
    }
  ];

  const FAVS_KEY = 'pv-radio-favs';
  const CUSTOM_KEY = 'pv-radio-custom';

  function loadFavs() {
    try { return JSON.parse(localStorage.getItem(FAVS_KEY) || '[]'); }
    catch { return []; }
  }
  function saveFavs(arr) {
    try { localStorage.setItem(FAVS_KEY, JSON.stringify(arr)); } catch {}
  }
  function loadCustom() {
    try { return JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]'); }
    catch { return []; }
  }
  function saveCustom(arr) {
    try { localStorage.setItem(CUSTOM_KEY, JSON.stringify(arr)); } catch {}
  }
  function radioId(r) {
    return r.id || `${(r.name || '').toLowerCase().trim()}|${(r.stream || '').trim()}`;
  }
  function isFav(r, favs) {
    const id = radioId(r);
    return favs.some(f => radioId(f) === id);
  }
  function toggleFav(r) {
    const favs = loadFavs();
    const id = radioId(r);
    const idx = favs.findIndex(f => radioId(f) === id);
    if (idx >= 0) favs.splice(idx, 1);
    else favs.push({ ...r, id });
    saveFavs(favs);
    return idx < 0;
  }
  function removeFromMyRadios(r) {
    const id = radioId(r);
    const favs = loadFavs().filter(f => radioId(f) !== id);
    saveFavs(favs);
    const custom = loadCustom().filter(c => radioId(c) !== id);
    saveCustom(custom);
  }

  let currentRadio = null;

  function injectStyles() {
    if (document.getElementById('canales-radios-style')) return;
    const style = document.createElement('style');
    style.id = 'canales-radios-style';
    style.textContent = `
      .cr-panel{position:fixed;inset:0;z-index:55;background:var(--bg);color:var(--text);overflow:auto;padding:16px 14px calc(230px + env(safe-area-inset-bottom))}
      .cr-inner{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:14px}
      .cr-head{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:start;position:sticky;top:0;background:linear-gradient(to bottom,var(--bg),rgba(0,0,0,0));padding:8px 0 14px;z-index:2;backdrop-filter:blur(12px)}
      .cr-head h1{font-size:clamp(24px,7vw,32px);line-height:1.05;margin:4px 0 6px;letter-spacing:-.04em}
      .cr-close{border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:999px;padding:9px 12px;font-weight:900;min-width:66px}
      .cr-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
      .cr-tab{border:1px solid var(--line);background:var(--card);color:var(--text);border-radius:18px;padding:12px 8px;font-weight:900;text-align:center;font-size:14px}
      .cr-tab.active{background:linear-gradient(135deg,var(--brand),var(--brand2));color:white;border-color:transparent}
      .cr-search{width:100%;border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:18px;padding:14px;font:inherit;outline:none}
      .cr-list{display:grid;grid-template-columns:1fr;gap:12px}
      .cr-card{position:relative;border:1px solid var(--line);background:var(--card);border-radius:24px;padding:16px;box-shadow:0 16px 38px rgba(0,0,0,.12)}
      .cr-card h3{margin:0 0 6px;font-size:20px;line-height:1.12;padding-right:48px}
      .cr-type{font-size:13px;color:var(--brand);font-weight:900;text-transform:uppercase;letter-spacing:.06em}
      .cr-note{color:var(--muted);word-break:break-word}
      .cr-fav-btn{position:absolute;top:14px;right:14px;width:38px;height:38px;border-radius:999px;border:1px solid var(--line);background:var(--card2);color:var(--text);cursor:pointer;font-size:18px;display:grid;place-items:center}
      .cr-fav-btn.on{background:linear-gradient(135deg,#ef4444,#ec4899);border-color:transparent;color:white}
      .cr-favicon{width:32px;height:32px;border-radius:8px;background:var(--card2);object-fit:cover;float:left;margin-right:10px}
      .cr-badge{display:inline-block;font-size:11px;font-weight:900;padding:3px 8px;border-radius:999px;background:rgba(34,197,94,.15);color:#16a34a;margin-left:6px;vertical-align:middle}
      .cr-btn-primary{width:100%;border:0;background:linear-gradient(135deg,var(--brand),var(--brand2));color:white;border-radius:999px;padding:12px 14px;font-weight:900;margin-top:10px;min-height:46px;cursor:pointer}
      .cr-btn-ghost{width:100%;border:1px solid var(--line);background:transparent;color:var(--text);border-radius:999px;padding:11px 14px;font-weight:900;margin-top:8px;min-height:44px;cursor:pointer}
      .cr-btn-danger{width:100%;border:1px solid rgba(239,68,68,.4);background:rgba(239,68,68,.08);color:#ef4444;border-radius:999px;padding:11px 14px;font-weight:900;margin-top:8px;min-height:44px;cursor:pointer}
      .cr-home-card{border-color:rgba(236,72,153,.42);background:linear-gradient(135deg,rgba(236,72,153,.12),var(--card))}
      .cr-viewer{position:fixed;inset:0;z-index:70;background:var(--bg);color:var(--text);padding:14px;display:flex;flex-direction:column;gap:10px}
      .cr-viewer-head{display:flex;justify-content:space-between;align-items:center;gap:10px}
      .cr-viewer-frame{width:100%;height:72vh;border:1px solid var(--line);border-radius:22px;background:#000}
      .cr-mini{font-size:13px;color:var(--muted)}
      .cr-loading{padding:24px;text-align:center;color:var(--muted)}
      .cr-empty{padding:24px;text-align:center;color:var(--muted);border:1px dashed var(--line);border-radius:22px}
      .cr-form{border:1px solid var(--line);background:var(--card);border-radius:24px;padding:16px;display:flex;flex-direction:column;gap:10px}
      .cr-form input{width:100%;border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:14px;padding:12px;font:inherit;outline:none;box-sizing:border-box}
      .cr-form label{font-size:13px;color:var(--muted);font-weight:700}
      .cr-player{position:fixed;left:12px;right:12px;bottom:calc(80px + env(safe-area-inset-bottom));z-index:80;background:linear-gradient(135deg,var(--card),var(--card2));border:1px solid var(--line);border-radius:22px;padding:12px 14px;display:grid;grid-template-columns:1fr auto auto;gap:10px;align-items:center;box-shadow:0 18px 48px rgba(0,0,0,.35);max-width:760px;margin:0 auto}
      .cr-player-info{min-width:0}
      .cr-player-name{font-weight:900;font-size:15px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .cr-player-state{font-size:12px;color:var(--muted);margin-top:2px}
      .cr-player-btn{border:0;background:linear-gradient(135deg,var(--brand),var(--brand2));color:white;border-radius:999px;width:42px;height:42px;display:grid;place-items:center;font-weight:900;cursor:pointer;font-size:18px}
      .cr-player-close{border:1px solid var(--line);background:transparent;color:var(--text);border-radius:999px;width:34px;height:34px;cursor:pointer}
      @media(min-width:620px){.cr-list{grid-template-columns:1fr 1fr}.cr-viewer-frame{height:78vh}}
      @media(max-width:420px){.cr-viewer-frame{height:64vh}}
    `;
    document.head.appendChild(style);
  }

  function clean(t) {
    return (t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  function openYoutubeViewer(title, src, channelUrl) {
    injectStyles();
    try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch {}
    document.querySelector('.cr-viewer')?.remove();
    const v = document.createElement('section');
    v.className = 'cr-viewer';
    v.innerHTML = `
      <div class="cr-viewer-head">
        <div><p class="ref">Dentro de Palabra Viva</p><h3>${title}</h3></div>
        <button class="cr-close">Cerrar</button>
      </div>
      <iframe class="cr-viewer-frame" src="${src}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
      <p class="cr-mini">Si el video no carga, abrí el canal completo en YouTube.</p>
      <button class="cr-btn-ghost">Abrir canal en YouTube</button>
    `;
    document.body.appendChild(v);
    v.querySelector('.cr-close').onclick = () => v.remove();
    v.querySelector('.cr-btn-ghost').onclick = () => window.open(channelUrl, '_blank', 'noopener');
  }

  function stopRadio() {
    if (currentRadio) {
      try { currentRadio.audio.pause(); currentRadio.audio.src = ''; } catch {}
      currentRadio.el.remove();
      currentRadio = null;
    }
  }

  function playRadio(station) {
    stopRadio();
    const audio = new Audio();
    audio.src = station.stream;
    audio.preload = 'none';
    audio.crossOrigin = 'anonymous';
    const el = document.createElement('div');
    el.className = 'cr-player';
    el.innerHTML = `
      <div class="cr-player-info">
        <div class="cr-player-name">${station.name}</div>
        <div class="cr-player-state">Conectando…</div>
      </div>
      <button class="cr-player-btn" data-act="toggle" aria-label="Pausar">⏸</button>
      <button class="cr-player-close" data-act="close" aria-label="Cerrar">✕</button>
    `;
    document.body.appendChild(el);
    const stateEl = el.querySelector('.cr-player-state');
    const toggleBtn = el.querySelector('[data-act="toggle"]');
    const closeBtn = el.querySelector('[data-act="close"]');
    audio.addEventListener('playing', () => { stateEl.textContent = 'En vivo'; toggleBtn.textContent = '⏸'; });
    audio.addEventListener('pause', () => { stateEl.textContent = 'Pausado'; toggleBtn.textContent = '▶'; });
    audio.addEventListener('waiting', () => { stateEl.textContent = 'Buffer…'; });
    audio.addEventListener('error', () => { stateEl.textContent = 'Error al cargar'; toggleBtn.textContent = '↻'; });
    toggleBtn.onclick = () => {
      if (audio.paused) audio.play().catch(() => { stateEl.textContent = 'No se pudo reproducir'; });
      else audio.pause();
    };
    closeBtn.onclick = stopRadio;
    audio.play().catch(() => {
      stateEl.textContent = 'Tocá ▶ para iniciar';
      toggleBtn.textContent = '▶';
    });
    currentRadio = { audio, el, station };
  }

  async function fetchSpanishChristianRadios() {
    const servers = [
      'https://de1.api.radio-browser.info',
      'https://de2.api.radio-browser.info',
      'https://nl1.api.radio-browser.info',
      'https://at1.api.radio-browser.info'
    ];
    const path = '/json/stations/search?tag=christian&language=spanish&hidebroken=true&order=clickcount&reverse=true&limit=40';
    for (const server of servers) {
      try {
        const res = await fetch(server + path);
        if (!res.ok) continue;
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) continue;
        return data
          .filter(s => s.url_resolved && (s.codec === 'MP3' || s.codec === 'AAC' || s.codec === 'AAC+'))
          .map(s => ({
            id: s.stationuuid,
            name: s.name?.trim() || 'Sin nombre',
            type: `${s.country || 'Internacional'} · ${s.codec || 'Audio'}`,
            note: (s.tags || '').split(',').slice(0, 3).join(', ') || 'Radio cristiana en español',
            stream: s.url_resolved,
            page: s.homepage || '',
            favicon: s.favicon || ''
          }));
      } catch (e) { continue; }
    }
    return null;
  }

  let radiosCache = null;
  let radiosLoading = false;

  function openPanel() {
    injectStyles();
    try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch {}
    document.querySelector('.cr-panel')?.remove();

    let mode = 'misRadios';
    let q = '';

    const panel = document.createElement('section');
    panel.className = 'cr-panel';
    panel.innerHTML = `
      <div class="cr-inner">
        <div class="cr-head">
          <div>
            <p class="ref">Ver y escuchar</p>
            <h1>Radios y canales</h1>
            <p class="soft">Tus radios favoritas, descubrí más, y canales en español latino.</p>
          </div>
          <button class="cr-close">Cerrar</button>
        </div>
        <div class="cr-tabs">
          <button class="cr-tab active" data-mode="misRadios">Mis radios</button>
          <button class="cr-tab" data-mode="explorar">Explorar</button>
          <button class="cr-tab" data-mode="canales">Canales</button>
        </div>
        <input class="cr-search" placeholder="Buscar por nombre…" />
        <div class="cr-list"></div>
      </div>
    `;
    document.body.appendChild(panel);
    const list = panel.querySelector('.cr-list');
    const search = panel.querySelector('.cr-search');

    async function loadRadios() {
      if (radiosCache) return radiosCache;
      if (radiosLoading) return null;
      radiosLoading = true;
      list.innerHTML = '<div class="cr-loading">Buscando radios cristianas en español…</div>';
      try {
        const apiData = await fetchSpanishChristianRadios();
        radiosCache = (apiData && apiData.length > 0) ? apiData : RADIOS_FALLBACK;
      } catch { radiosCache = RADIOS_FALLBACK; }
      finally { radiosLoading = false; }
      return radiosCache;
    }

    // Tarjeta de radio en "Explorar" — con corazón para agregar/quitar de favs
    function radioCardExploreHTML(r, i) {
      const fav = isFav(r, loadFavs());
      return `
        <article class="cr-card" data-idx="${i}">
          <button class="cr-fav-btn ${fav ? 'on' : ''}" data-act="fav" aria-label="${fav ? 'Quitar de mis radios' : 'Agregar a mis radios'}">${fav ? '♥' : '♡'}</button>
          ${r.favicon ? `<img class="cr-favicon" src="${r.favicon}" alt="" onerror="this.remove()"/>` : ''}
          <p class="cr-type">${r.type || 'Radio cristiana'}</p>
          <h3>${r.name}</h3>
          <p class="cr-note">${r.note || ''}</p>
          <button class="cr-btn-primary" data-act="play">▶ Escuchar dentro de la app</button>
          ${r.page ? `<button class="cr-btn-ghost" data-act="page">Ver sitio oficial</button>` : ''}
        </article>
      `;
    }

    // Tarjeta de radio en "Mis radios" — con botón explícito "Quitar de mis radios"
    function radioCardMyHTML(r, i, isCustom) {
      const customBadge = isCustom ? '<span class="cr-badge">Agregada por vos</span>' : '';
      return `
        <article class="cr-card" data-idx="${i}">
          ${r.favicon ? `<img class="cr-favicon" src="${r.favicon}" alt="" onerror="this.remove()"/>` : ''}
          <p class="cr-type">${r.type || 'Radio cristiana'}${customBadge}</p>
          <h3>${r.name}</h3>
          <p class="cr-note">${r.note || ''}</p>
          <button class="cr-btn-primary" data-act="play">▶ Escuchar dentro de la app</button>
          ${r.page ? `<button class="cr-btn-ghost" data-act="page">Ver sitio oficial</button>` : ''}
          <button class="cr-btn-danger" data-act="remove">🗑️ Quitar de mis radios</button>
        </article>
      `;
    }

    function bindExploreCards(items) {
      list.querySelectorAll('.cr-card').forEach(card => {
        const idx = Number(card.dataset.idx);
        const r = items[idx];
        if (!r) return;
        card.querySelector('[data-act="play"]')?.addEventListener('click', () => playRadio(r));
        card.querySelector('[data-act="page"]')?.addEventListener('click', () => window.open(r.page, '_blank', 'noopener'));
        card.querySelector('[data-act="fav"]')?.addEventListener('click', () => {
          toggleFav(r);
          render();
        });
      });
    }

    function bindMyCards(items) {
      list.querySelectorAll('.cr-card').forEach(card => {
        const idx = Number(card.dataset.idx);
        const r = items[idx];
        if (!r) return;
        card.querySelector('[data-act="play"]')?.addEventListener('click', () => playRadio(r));
        card.querySelector('[data-act="page"]')?.addEventListener('click', () => window.open(r.page, '_blank', 'noopener'));
        card.querySelector('[data-act="remove"]')?.addEventListener('click', () => {
          if (!confirm(`¿Quitar "${r.name}" de tus radios?`)) return;
          // Si la radio que estamos sonando es esta, frenarla
          if (currentRadio && radioId(currentRadio.station) === radioId(r)) stopRadio();
          removeFromMyRadios(r);
          render();
        });
      });
    }

    function renderAddForm() {
      const wrap = document.createElement('div');
      wrap.className = 'cr-form';
      wrap.innerHTML = `
        <p class="cr-type">➕ Agregar una radio</p>
        <label>Nombre de la radio</label>
        <input data-field="name" placeholder="Ej: Mi Radio Cristiana FM" />
        <label>URL del stream (.mp3 / .aac)</label>
        <input data-field="stream" placeholder="https://stream.ejemplo.com/radio.mp3" />
        <label>Sitio web (opcional)</label>
        <input data-field="page" placeholder="https://miradio.com" />
        <button class="cr-btn-primary" data-act="add">Guardar radio</button>
        <p class="cr-mini">La radio queda guardada en este dispositivo y aparece arriba en "Mis radios".</p>
      `;
      wrap.querySelector('[data-act="add"]').onclick = () => {
        const name = wrap.querySelector('[data-field="name"]').value.trim();
        const stream = wrap.querySelector('[data-field="stream"]').value.trim();
        const page = wrap.querySelector('[data-field="page"]').value.trim();
        if (!name) { alert('Falta el nombre.'); return; }
        if (!stream || !/^https?:\/\//.test(stream)) { alert('La URL del stream debe empezar con http:// o https://'); return; }
        const custom = loadCustom();
        const newRadio = {
          id: `custom-${Date.now()}`, name, type: 'Mi radio',
          note: 'Agregada por vos', stream, page, favicon: ''
        };
        custom.push(newRadio);
        saveCustom(custom);
        const favs = loadFavs();
        favs.push({ ...newRadio });
        saveFavs(favs);
        render();
      };
      return wrap;
    }

    async function render() {
      panel.querySelectorAll('.cr-tab').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));

      if (mode === 'misRadios') {
        const favs = loadFavs();
        const custom = loadCustom();
        const seen = new Set();
        const all = [];
        for (const r of favs) {
          const id = radioId(r);
          if (!seen.has(id)) { seen.add(id); all.push({ ...r, _isCustom: custom.some(c => radioId(c) === id) }); }
        }
        for (const r of custom) {
          const id = radioId(r);
          if (!seen.has(id)) { seen.add(id); all.push({ ...r, _isCustom: true }); }
        }
        const items = all.filter(r => !q || clean(r.name + ' ' + (r.note || '')).includes(clean(q)));
        list.innerHTML = '';
        if (items.length === 0) {
          const empty = document.createElement('div');
          empty.className = 'cr-empty';
          empty.innerHTML = `
            <p><strong>Todavía no tenés radios guardadas.</strong></p>
            <p class="cr-mini">Andá a "Explorar" para descubrir radios cristianas en español y marcalas con ♡. O agregá una manualmente abajo.</p>
          `;
          list.appendChild(empty);
        } else {
          items.forEach((r, i) => {
            const div = document.createElement('div');
            div.innerHTML = radioCardMyHTML(r, i, r._isCustom);
            list.appendChild(div.firstElementChild);
          });
          bindMyCards(items);
        }
        list.appendChild(renderAddForm());
        return;
      }

      if (mode === 'explorar') {
        const all = await loadRadios();
        if (!all) return;
        const items = all.filter(r => !q || clean(r.name + ' ' + (r.note || '') + ' ' + (r.type || '')).includes(clean(q)));
        if (items.length === 0) {
          list.innerHTML = '<div class="cr-empty">No encontré radios con esa búsqueda.</div>';
          return;
        }
        list.innerHTML = items.map((r, i) => radioCardExploreHTML(r, i)).join('');
        bindExploreCards(items);
        return;
      }

      const items = CHANNELS.filter(c => !q || clean(c.name + ' ' + c.note + ' ' + c.type).includes(clean(q)));
      if (items.length === 0) {
        list.innerHTML = '<div class="cr-empty">No encontré canales con esa búsqueda.</div>';
        return;
      }
      list.innerHTML = items.map((c, i) => `
        <article class="cr-card">
          <p class="cr-type">${c.type}</p>
          <h3>${c.name}</h3>
          <p class="cr-note">${c.note}</p>
          ${c.embed
            ? `<button class="cr-btn-primary" data-embed="${i}">Ver dentro de la app</button>
               <button class="cr-btn-ghost" data-channel="${i}">Abrir canal en YouTube</button>`
            : `<button class="cr-btn-primary" data-channel="${i}">Abrir canal en YouTube</button>
               <p class="cr-mini" style="margin-top:8px">Este canal no permite reproducción embebida.</p>`
          }
        </article>
      `).join('');
      list.querySelectorAll('[data-embed]').forEach(b => {
        b.onclick = () => {
          const c = items[Number(b.dataset.embed)];
          openYoutubeViewer(c.name, c.embed, c.channel);
        };
      });
      list.querySelectorAll('[data-channel]').forEach(b => {
        b.onclick = () => {
          const c = items[Number(b.dataset.channel)];
          window.open(c.channel, '_blank', 'noopener');
        };
      });
    }

    panel.querySelector('.cr-close').onclick = () => {
      try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch {}
      panel.remove();
    };
    search.oninput = e => { q = e.target.value; render(); };
    panel.querySelectorAll('.cr-tab').forEach(b => {
      b.onclick = () => { mode = b.dataset.mode; q = ''; search.value = ''; render(); };
    });
    render();
  }

  function addQuickButton() {
    const quick = document.querySelector('.quick');
    if (!quick || document.querySelector('.cr-quick')) return;
    const b = document.createElement('button');
    b.className = 'cr-quick';
    b.textContent = 'Ver';
    b.onclick = openPanel;
    quick.insertBefore(b, quick.firstChild);
  }

  function addHomeCard() {
    if (document.querySelector('.cr-home-card')) return;
    const title = document.querySelector('h1')?.textContent || '';
    if (!title.includes('Una palabra para hoy')) return;
    const anchor = document.querySelector('.respuestas-home-card')
      || document.querySelector('.pv-path-card')
      || document.querySelector('.moodBox');
    if (!anchor) return;
    const card = document.createElement('section');
    card.className = 'card cr-home-card';
    card.innerHTML = `
      <p class="ref">Ver y escuchar</p>
      <h3>Radios cristianas y canales en español</h3>
      <p class="soft">Audio en vivo dentro de la app, con tus favoritas guardadas.</p>
      <button class="btn">Abrir</button>
    `;
    card.querySelector('button').onclick = openPanel;
    anchor.insertAdjacentElement('afterend', card);
  }

  window.PalabraVivaCanales = { open: openPanel };
  setInterval(() => { injectStyles(); addQuickButton(); addHomeCard(); }, 900);
})();
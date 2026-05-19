(() => {
  try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch {}

  // ========================
  // CANALES EN ESPAÑOL LATINO
  // ========================
  // Reglas:
  // - "embed" solo si tenemos una playlist real (PL...) o un videoId verificado.
  // - Si no hay embed, mostramos botón "Abrir en YouTube" (link externo).
  // - YouTube eliminó listType=search en noviembre 2020, no se usa más.
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
      note: 'Recursos teológicos reformados y bíblicos en español latino. Buen contenido para estudiar.',
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

  // Fallback estático de radios (por si la API de Radio Browser falla).
  // Streams confirmados directos.
  const RADIOS_FALLBACK = [
    {
      name: 'BBN Radio Español',
      type: 'Radio bíblica',
      note: 'Música cristiana, Biblia y enseñanza 24/7 en español. Sin publicidad.',
      stream: 'https://streams.radiomast.io/475ebed1-595e-4717-b888-64fe8fc6b09f',
      page: 'https://bbn1.bbnradio.org/spanish/'
    }
  ];

  // Mini-reproductor flotante de audio (persistente entre tabs de la app).
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
      .cr-tab{border:1px solid var(--line);background:var(--card);color:var(--text);border-radius:18px;padding:12px 8px;font-weight:900;text-align:center}
      .cr-tab.active{background:linear-gradient(135deg,var(--brand),var(--brand2));color:white;border-color:transparent}
      .cr-search{width:100%;border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:18px;padding:14px;font:inherit;outline:none}
      .cr-list{display:grid;grid-template-columns:1fr;gap:12px}
      .cr-card{border:1px solid var(--line);background:var(--card);border-radius:24px;padding:16px;box-shadow:0 16px 38px rgba(0,0,0,.12)}
      .cr-card h3{margin:0 0 6px;font-size:20px;line-height:1.12}
      .cr-type{font-size:13px;color:var(--brand);font-weight:900;text-transform:uppercase;letter-spacing:.06em}
      .cr-note{color:var(--muted)}
      .cr-fav{width:32px;height:32px;border-radius:8px;background:var(--card2);float:left;margin-right:10px;object-fit:cover}
      .cr-btn-primary{width:100%;border:0;background:linear-gradient(135deg,var(--brand),var(--brand2));color:white;border-radius:999px;padding:12px 14px;font-weight:900;margin-top:10px;min-height:46px;cursor:pointer}
      .cr-btn-ghost{width:100%;border:1px solid var(--line);background:transparent;color:var(--text);border-radius:999px;padding:11px 14px;font-weight:900;margin-top:8px;min-height:44px;cursor:pointer}
      .cr-warning{border:1px solid rgba(245,158,11,.45);background:linear-gradient(135deg,rgba(245,158,11,.12),var(--card));border-radius:22px;padding:14px}
      .cr-warning p{font-size:15px;color:var(--muted);margin:0}
      .cr-home-card{border-color:rgba(236,72,153,.42);background:linear-gradient(135deg,rgba(236,72,153,.12),var(--card))}
      .cr-viewer{position:fixed;inset:0;z-index:70;background:var(--bg);color:var(--text);padding:14px;display:flex;flex-direction:column;gap:10px}
      .cr-viewer-head{display:flex;justify-content:space-between;align-items:center;gap:10px}
      .cr-viewer-frame{width:100%;height:72vh;border:1px solid var(--line);border-radius:22px;background:#000}
      .cr-mini{font-size:13px;color:var(--muted)}
      .cr-loading{padding:24px;text-align:center;color:var(--muted)}
      .cr-error{padding:14px;border:1px solid rgba(239,68,68,.4);background:rgba(239,68,68,.08);border-radius:18px;color:var(--text)}

      /* Mini-reproductor de radio flotante */
      .cr-player{position:fixed;left:12px;right:12px;bottom:calc(80px + env(safe-area-inset-bottom));z-index:80;background:linear-gradient(135deg,var(--card),var(--card2));border:1px solid var(--line);border-radius:22px;padding:12px 14px;display:grid;grid-template-columns:1fr auto auto;gap:10px;align-items:center;box-shadow:0 18px 48px rgba(0,0,0,.35);max-width:760px;margin:0 auto}
      .cr-player-info{min-width:0}
      .cr-player-name{font-weight:900;font-size:15px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .cr-player-state{font-size:12px;color:var(--muted);margin-top:2px}
      .cr-player-btn{border:0;background:linear-gradient(135deg,var(--brand),var(--brand2));color:white;border-radius:999px;width:42px;height:42px;display:grid;place-items:center;font-weight:900;cursor:pointer;font-size:18px}
      .cr-player-close{border:1px solid var(--line);background:transparent;color:var(--text);border-radius:999px;width:34px;height:34px;cursor:pointer}

      @media(min-width:620px){.cr-list{grid-template-columns:1fr 1fr}.cr-viewer-frame{height:78vh}}
      @media(max-width:420px){.cr-tabs{grid-template-columns:1fr}.cr-viewer-frame{height:64vh}}
    `;
    document.head.appendChild(style);
  }

  function clean(t) {
    return (t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  // ========================
  // VISOR DE YOUTUBE
  // ========================
  function openYoutubeViewer(title, src, channelUrl) {
    injectStyles();
    try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch {}
    document.querySelector('.cr-viewer')?.remove();
    const v = document.createElement('section');
    v.className = 'cr-viewer';
    v.innerHTML = `
      <div class="cr-viewer-head">
        <div>
          <p class="ref">Dentro de Palabra Viva</p>
          <h3>${title}</h3>
        </div>
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

  // ========================
  // REPRODUCTOR DE RADIO FLOTANTE
  // ========================
  function stopRadio() {
    if (currentRadio) {
      try { currentRadio.audio.pause(); currentRadio.audio.src = ''; } catch {}
      currentRadio.el.remove();
      currentRadio = null;
    }
  }

  function playRadio(station) {
    // Parar la radio anterior si hay
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
    audio.addEventListener('error', () => {
      stateEl.textContent = 'Error al cargar';
      toggleBtn.textContent = '↻';
    });

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

  // ========================
  // RADIO BROWSER API
  // ========================
  // API pública sin key. Trae radios cristianas en español con stream directo.
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
        const res = await fetch(server + path, {
          headers: { 'User-Agent': 'PalabraViva/1.0' }
        });
        if (!res.ok) continue;
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) continue;

        return data
          .filter(s => s.url_resolved && (s.codec === 'MP3' || s.codec === 'AAC' || s.codec === 'AAC+'))
          .map(s => ({
            name: s.name?.trim() || 'Sin nombre',
            type: `${s.country || 'Internacional'} · ${s.codec || 'Audio'}`,
            note: (s.tags || '').split(',').slice(0, 3).join(', ') || 'Radio cristiana en español',
            stream: s.url_resolved,
            page: s.homepage || '',
            favicon: s.favicon || ''
          }));
      } catch (e) {
        continue;
      }
    }
    return null; // Fallback
  }

  // ========================
  // PANEL PRINCIPAL
  // ========================
  let radiosCache = null;
  let radiosLoading = false;

  function openPanel() {
    injectStyles();
    try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch {}
    document.querySelector('.cr-panel')?.remove();

    let mode = 'radios';
    let q = '';

    const panel = document.createElement('section');
    panel.className = 'cr-panel';
    panel.innerHTML = `
      <div class="cr-inner">
        <div class="cr-head">
          <div>
            <p class="ref">Ver y escuchar</p>
            <h1>Radios y canales</h1>
            <p class="soft">Radios cristianas en español con audio directo, y canales de YouTube en español latino.</p>
          </div>
          <button class="cr-close">Cerrar</button>
        </div>
        <section class="cr-warning">
          <p><strong>Cómo funciona:</strong> las radios se escuchan dentro de la app con un reproductor flotante (podés seguir navegando). Los canales de YouTube abren en pantalla completa dentro de la app cuando es posible, o se abren en YouTube si no permiten embed.</p>
        </section>
        <div class="cr-tabs">
          <button class="cr-tab active" data-mode="radios">Radios</button>
          <button class="cr-tab" data-mode="canales">Canales</button>
        </div>
        <input class="cr-search" placeholder="Buscar por nombre…" />
        <div class="cr-list"></div>
      </div>
    `;
    document.body.appendChild(panel);
    const list = panel.querySelector('.cr-list');

    async function loadRadios() {
      if (radiosCache) return radiosCache;
      if (radiosLoading) return null;
      radiosLoading = true;
      list.innerHTML = '<div class="cr-loading">Buscando radios cristianas en español…</div>';
      try {
        const apiData = await fetchSpanishChristianRadios();
        radiosCache = (apiData && apiData.length > 0) ? apiData : RADIOS_FALLBACK;
      } catch {
        radiosCache = RADIOS_FALLBACK;
      } finally {
        radiosLoading = false;
      }
      return radiosCache;
    }

    async function render() {
      panel.querySelectorAll('.cr-tab').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));

      if (mode === 'radios') {
        const all = await loadRadios();
        if (!all) return;
        const items = all.filter(r => !q || clean(r.name + ' ' + (r.note || '') + ' ' + (r.type || '')).includes(clean(q)));
        if (items.length === 0) {
          list.innerHTML = '<article class="cr-card"><p>No encontré radios con esa búsqueda.</p></article>';
          return;
        }
        list.innerHTML = items.map((r, i) => `
          <article class="cr-card">
            ${r.favicon ? `<img class="cr-fav" src="${r.favicon}" alt="" onerror="this.remove()"/>` : ''}
            <p class="cr-type">${r.type || 'Radio cristiana'}</p>
            <h3>${r.name}</h3>
            <p class="cr-note">${r.note || ''}</p>
            <button class="cr-btn-primary" data-i="${i}">▶ Escuchar dentro de la app</button>
            ${r.page ? `<button class="cr-btn-ghost" data-page="${r.page}">Ver sitio oficial</button>` : ''}
          </article>
        `).join('');
        list.querySelectorAll('[data-i]').forEach(b => {
          b.onclick = () => playRadio(items[Number(b.dataset.i)]);
        });
        list.querySelectorAll('[data-page]').forEach(b => {
          b.onclick = () => window.open(b.dataset.page, '_blank', 'noopener');
        });
        return;
      }

      // Canales YouTube
      const items = CHANNELS.filter(c => !q || clean(c.name + ' ' + c.note + ' ' + c.type).includes(clean(q)));
      if (items.length === 0) {
        list.innerHTML = '<article class="cr-card"><p>No encontré canales con esa búsqueda.</p></article>';
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
    panel.querySelector('.cr-search').oninput = e => { q = e.target.value; render(); };
    panel.querySelectorAll('.cr-tab').forEach(b => {
      b.onclick = () => { mode = b.dataset.mode; render(); };
    });
    render();
  }

  // ========================
  // BOTONES DE ENTRADA
  // ========================
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
      <p class="soft">Audio en vivo dentro de la app y videos en español latino.</p>
      <button class="btn">Abrir</button>
    `;
    card.querySelector('button').onclick = openPanel;
    anchor.insertAdjacentElement('afterend', card);
  }

  window.PalabraVivaCanales = { open: openPanel };
  setInterval(() => { injectStyles(); addQuickButton(); addHomeCard(); }, 900);
})();
(() => {
  try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch {}

  const CHANNELS = [
    { name:'Proyecto Biblia (BibleProject Español)', type:'Biblia animada · Español latino', note:'Videos oficiales sobre libros y temas bíblicos, doblados al español.', embed:'https://www.youtube-nocookie.com/embed/videoseries?list=PLlD1Kzc7omJmXnWoWlFVJ5AFOTPuYyGPg', channel:'https://www.youtube.com/c/bibleprojectespanol' },
    { name:'Nuevo Tiempo', type:'TV cristiana · Español', note:'Contenido cristiano en español latino: familia, Biblia y esperanza.', embed:null, channel:'https://www.youtube.com/@NuevoTiempoTV' },
    { name:'Enlace TV', type:'TV cristiana evangélica · Español', note:'Predicaciones y contenido cristiano evangélico en español.', embed:null, channel:'https://www.youtube.com/@enlacetv' },
    { name:'Coalición por el Evangelio', type:'Enseñanza evangélica · Español', note:'Recursos teológicos reformados y bíblicos en español latino.', embed:null, channel:'https://www.youtube.com/@coalicionporelevangelio' },
    { name:'Hillsong en Español', type:'Música de adoración · Español', note:'Canciones de adoración cristianas en español.', embed:null, channel:'https://www.youtube.com/@hillsongenespanol' }
  ];

  const FALLBACK_RADIOS = [
    { id:'bbn-es', name:'BBN Radio Español', type:'Radio bíblica evangélica', note:'Música cristiana, Biblia y enseñanza 24/7 en español.', stream:'https://streams.radiomast.io/475ebed1-595e-4717-b888-64fe8fc6b09f', page:'https://bbn1.bbnradio.org/spanish/', favicon:'' }
  ];

  const BLOCKED_WORDS = [
    'catolic','católic','catholic','catolico','católico','catolica','católica',
    'radio maria','radio maría','maria radio','maría radio','vatican','vaticano',
    'guadalupe','guadalupana','fatima','fátima','rosario','virgen','santuario',
    'cadena cope','cope ','mariana','mariano','arquidiocesis','arquidiócesis',
    'diocesis','diócesis','parroquia','sagrado corazon','sagrado corazón',
    'inmaculada','concepcion','concepción','papa francisco','pontificia','eucaristia','eucaristía'
  ];
  const FAVS_KEY = 'pv-radio-favs';
  const CUSTOM_KEY = 'pv-radio-custom';

  const $ = (s, r=document) => r.querySelector(s);
  const clean = t => (t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  const radioId = r => r.id || `${clean(r.name)}|${(r.stream || '').trim()}`;
  const load = (k, fb) => { try { return JSON.parse(localStorage.getItem(k) || JSON.stringify(fb)); } catch { return fb; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

  function isBlockedRadio(r) {
    const blob = clean(`${r.name || ''} ${r.type || ''} ${r.note || ''} ${r.tags || ''} ${r.page || ''} ${r.homepage || ''}`);
    return BLOCKED_WORDS.some(w => blob.includes(clean(w)));
  }
  function loadFavsRaw(){ return load(FAVS_KEY, []); }
  function loadCustomRaw(){ return load(CUSTOM_KEY, []); }
  function saveFavs(a){ save(FAVS_KEY, a); }
  function saveCustom(a){ save(CUSTOM_KEY, a); }
  function purifyStoredRadios() {
    const favs = loadFavsRaw().filter(r => !isBlockedRadio(r));
    const custom = loadCustomRaw().filter(r => !isBlockedRadio(r));
    saveFavs(favs);
    saveCustom(custom);
    if (currentRadio && isBlockedRadio(currentRadio.station)) stopRadio();
    return { favs, custom };
  }
  function isFav(r) { const id = radioId(r); return loadFavsRaw().some(f => radioId(f) === id); }
  function toggleFav(r) {
    if (isBlockedRadio(r)) { alert('Esta radio fue filtrada porque parece católica.'); return false; }
    const favs = loadFavsRaw();
    const id = radioId(r);
    const idx = favs.findIndex(f => radioId(f) === id);
    if (idx >= 0) favs.splice(idx, 1); else favs.push({ ...r, id });
    saveFavs(favs.filter(x => !isBlockedRadio(x)));
    return idx < 0;
  }
  function removeFromMyRadios(r) {
    const id = radioId(r);
    saveFavs(loadFavsRaw().filter(f => radioId(f) !== id));
    saveCustom(loadCustomRaw().filter(c => radioId(c) !== id));
    if (currentRadio && radioId(currentRadio.station) === id) stopRadio();
  }
  function getMyRadios() {
    const { favs, custom } = purifyStoredRadios();
    const seen = new Set();
    const all = [];
    [...favs, ...custom].forEach(r => {
      const id = radioId(r);
      if (!seen.has(id) && !isBlockedRadio(r)) {
        seen.add(id);
        all.push({ ...r, _isCustom: custom.some(c => radioId(c) === id) });
      }
    });
    return all;
  }

  let currentRadio = null;
  let modalStack = [];
  let radiosCache = null;
  let radiosLoading = false;

  function injectStyles() {
    if ($('#canales-radios-style-v5')) return;
    $('#canales-radios-style')?.remove();
    $('#canales-radios-style-v4')?.remove();
    const st = document.createElement('style');
    st.id = 'canales-radios-style-v5';
    st.textContent = `
      .cr-panel{position:fixed;inset:0;z-index:1000000;background:var(--bg);color:var(--text);overflow:auto;padding:16px 14px calc(230px + env(safe-area-inset-bottom))}.cr-inner{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:14px}.cr-head{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:start;position:sticky;top:0;background:linear-gradient(to bottom,var(--bg),rgba(0,0,0,0));padding:8px 0 14px;z-index:2;backdrop-filter:blur(12px)}.cr-head h1{font-size:clamp(24px,7vw,32px);line-height:1.05;margin:4px 0 6px;letter-spacing:-.04em}.cr-close{border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:999px;padding:9px 12px;font-weight:900;min-width:66px;cursor:pointer}.cr-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.cr-tab{border:1px solid var(--line);background:var(--card);color:var(--text);border-radius:14px;padding:10px 6px;font-weight:900;text-align:center;font-size:12px;cursor:pointer}.cr-tab.active{background:linear-gradient(135deg,var(--brand),var(--brand2));color:white;border-color:transparent}.cr-search{width:100%;border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:18px;padding:14px;font:inherit;outline:none}.cr-list{display:grid;grid-template-columns:1fr;gap:12px}.cr-card{position:relative;border:1px solid var(--line);background:var(--card);border-radius:24px;padding:16px;box-shadow:0 16px 38px rgba(0,0,0,.12)}.cr-card h3{margin:0 0 6px;font-size:20px;line-height:1.12;padding-right:48px}.cr-type{font-size:13px;color:var(--brand);font-weight:900;text-transform:uppercase;letter-spacing:.06em}.cr-note{color:var(--muted);word-break:break-word}.cr-fav-btn{position:absolute;top:14px;right:14px;width:38px;height:38px;border-radius:999px;border:1px solid var(--line);background:var(--card2);color:var(--text);cursor:pointer;font-size:18px;display:grid;place-items:center}.cr-fav-btn.on{background:linear-gradient(135deg,#ef4444,#ec4899);border-color:transparent;color:white}.cr-badge{display:inline-block;font-size:11px;font-weight:900;padding:3px 8px;border-radius:999px;background:rgba(34,197,94,.15);color:#16a34a;margin-left:6px}.cr-btn-primary{width:100%;border:0;background:linear-gradient(135deg,var(--brand),var(--brand2));color:white;border-radius:999px;padding:12px 14px;font-weight:900;margin-top:10px;min-height:46px;cursor:pointer}.cr-btn-ghost{width:100%;border:1px solid var(--line);background:transparent;color:var(--text);border-radius:999px;padding:11px 14px;font-weight:900;margin-top:8px;min-height:44px;cursor:pointer}.cr-btn-danger{width:100%;border:1px solid rgba(239,68,68,.4);background:rgba(239,68,68,.08);color:#ef4444;border-radius:999px;padding:11px 14px;font-weight:900;margin-top:8px;min-height:44px;cursor:pointer}.cr-empty,.cr-loading{padding:24px;text-align:center;color:var(--muted);border:1px dashed var(--line);border-radius:22px}.cr-form{border:1px solid var(--line);background:var(--card);border-radius:24px;padding:16px;display:flex;flex-direction:column;gap:10px}.cr-form input{width:100%;border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:14px;padding:12px;font:inherit;outline:none;box-sizing:border-box}.cr-form label{font-size:13px;color:var(--muted);font-weight:700}.cr-home-card{border-color:rgba(236,72,153,.42);background:linear-gradient(135deg,rgba(236,72,153,.12),var(--card))}
      .cr-player{position:fixed;left:12px;right:12px;bottom:calc(80px + env(safe-area-inset-bottom));z-index:1000003;background:linear-gradient(135deg,var(--card),var(--card2));border:1px solid var(--line);border-radius:22px;padding:12px 14px;display:grid;grid-template-columns:1fr auto auto;gap:10px;align-items:center;box-shadow:0 18px 48px rgba(0,0,0,.35);max-width:760px;margin:0 auto}.cr-player-name{font-weight:900;font-size:15px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cr-player-state{font-size:12px;color:var(--muted);margin-top:2px}.cr-player-bt{font-size:11px;color:#16a34a;font-weight:700;margin-top:2px}.cr-player-btn{border:0;background:linear-gradient(135deg,var(--brand),var(--brand2));color:white;border-radius:999px;width:42px;height:42px;display:grid;place-items:center;font-weight:900;cursor:pointer;font-size:18px}.cr-player-close{border:1px solid var(--line);background:transparent;color:var(--text);border-radius:999px;width:34px;height:34px;cursor:pointer}
      .cr-viewer{position:fixed;inset:0;z-index:1000002;background:var(--bg);color:var(--text);padding:14px;display:flex;flex-direction:column;gap:10px}.cr-viewer-head{display:flex;justify-content:space-between;align-items:center;gap:10px}.cr-viewer-frame{width:100%;height:72vh;border:1px solid var(--line);border-radius:22px;background:#000}.cr-mini{font-size:13px;color:var(--muted)}
      .cr-dial{background:linear-gradient(180deg,#3b2817 0%,#2a1c10 100%);border-radius:24px;padding:18px;color:#f5deb3;box-shadow:0 16px 38px rgba(0,0,0,.4),inset 0 2px 0 rgba(255,220,150,.15)}.cr-dial-brand{font-family:Georgia,serif;text-align:center;font-size:14px;letter-spacing:.3em;color:#d4a574;font-weight:700;margin-bottom:10px;border-bottom:1px solid rgba(212,165,116,.25);padding-bottom:8px}.cr-dial-display{background:linear-gradient(180deg,#f4e4a1,#e8d27d);color:#3b2817;border-radius:8px;padding:14px 16px;margin:12px 0;font-family:'Courier New',monospace;text-align:center;box-shadow:inset 0 3px 8px rgba(59,40,23,.4);border:2px solid #2a1c10}.cr-dial-display .freq{font-size:14px;letter-spacing:.2em;opacity:.7}.cr-dial-display .station{font-size:22px;font-weight:900;margin:6px 0 2px;line-height:1.15}.cr-dial-display .status{font-size:12px;opacity:.75}.cr-dial-strip{position:relative;background:linear-gradient(180deg,#f4e4a1,#d4a574);border-radius:6px;padding:10px 8px 22px;margin:14px 0;border:2px solid #2a1c10}.cr-dial-marks{display:flex;justify-content:space-between;color:#3b2817;font-size:11px;font-weight:900;font-family:'Courier New',monospace}.cr-dial-needle{position:absolute;top:6px;bottom:6px;width:3px;background:#d62828;left:50%;transform:translateX(-50%);box-shadow:0 0 8px rgba(214,40,40,.6);border-radius:2px;transition:left .3s ease}.cr-dial-controls{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;margin-top:10px}.cr-dial-knob{width:54px;height:54px;border-radius:50%;border:2px solid #d4a574;background:radial-gradient(circle at 30% 30%,#8b6332,#3b2817);color:#f5deb3;font-weight:900;font-size:18px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.4),inset 0 2px 4px rgba(255,220,150,.2)}.cr-dial-play{background:linear-gradient(135deg,#d62828,#9d0208);border:2px solid #f5deb3;color:#fff;border-radius:999px;padding:14px;font-weight:900;font-size:16px;cursor:pointer;min-height:52px}.cr-dial-empty{text-align:center;padding:30px 16px;color:#d4a574}
      @media(min-width:620px){.cr-list{grid-template-columns:1fr 1fr}.cr-viewer-frame{height:78vh}}@media(max-width:420px){.cr-tabs{grid-template-columns:repeat(2,1fr)}.cr-viewer-frame{height:64vh}}
    `;
    document.head.appendChild(st);
  }

  function openModal(el, id) {
    document.body.appendChild(el);
    history.pushState({ pvCr: id }, '', '#' + id);
    const entry = { id, el, handler: () => closeModal(entry, false) };
    modalStack.push(entry);
    window.addEventListener('popstate', entry.handler, { once:true });
    return entry;
  }
  function closeModal(entry, useHistory=true) {
    const i = modalStack.indexOf(entry);
    if (i >= 0) modalStack.splice(i, 1);
    try { entry.el.remove(); } catch {}
    window.removeEventListener('popstate', entry.handler);
    if (useHistory && history.state?.pvCr === entry.id) { try { history.back(); } catch {} }
  }
  function closeTopModal() { if (!modalStack.length) return false; closeModal(modalStack[modalStack.length-1], true); return true; }

  async function shareItem(title, text, url) {
    const payload = { title, text: `${text || ''}\n${url || ''}`.trim(), url: url || undefined };
    if (navigator.share) { try { await navigator.share(payload); return; } catch {} }
    try { await navigator.clipboard.writeText(`${title}\n${text || ''}\n${url || ''}`.trim()); alert('Copiado al portapapeles.'); } catch { alert(`${title}\n${text || ''}\n${url || ''}`); }
  }

  function stopRadio() {
    if (currentRadio) { try { currentRadio.audio.pause(); currentRadio.audio.src = ''; } catch {} currentRadio.el.remove(); currentRadio = null; }
    if ('mediaSession' in navigator) { try { navigator.mediaSession.metadata = null; navigator.mediaSession.playbackState = 'none'; } catch {} }
  }
  function setMediaSession(station, audio) {
    if (!('mediaSession' in navigator)) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({ title: station.name || 'Radio', artist:'Palabra Viva — Radio cristiana evangélica', album: station.type || '' });
      navigator.mediaSession.setActionHandler('play', () => audio.play().catch(()=>{}));
      navigator.mediaSession.setActionHandler('pause', () => audio.pause());
      navigator.mediaSession.setActionHandler('stop', stopRadio);
    } catch {}
  }
  function playRadio(station) {
    if (!station?.stream) { alert('Esta radio no tiene stream directo.'); return; }
    if (isBlockedRadio(station)) { alert('Esta radio fue filtrada porque parece católica.'); return; }
    stopRadio();
    const audio = new Audio(station.stream);
    audio.preload = 'none'; audio.crossOrigin = 'anonymous'; audio.setAttribute('x-webkit-airplay','allow');
    try { audio.disableRemotePlayback = false; } catch {}
    const el = document.createElement('div');
    el.className = 'cr-player';
    el.innerHTML = `<div><div class="cr-player-name">${station.name}</div><div class="cr-player-state">Conectando…</div><div class="cr-player-bt" style="display:none">🎧 Bluetooth/auriculares compatibles</div></div><button class="cr-player-btn" data-a="toggle">⏸</button><button class="cr-player-close" data-a="close">✕</button>`;
    document.body.appendChild(el);
    const state = $('.cr-player-state', el), bt = $('.cr-player-bt', el), btn = $('[data-a="toggle"]', el);
    audio.addEventListener('playing', () => { state.textContent='En vivo'; btn.textContent='⏸'; bt.style.display='block'; if ('mediaSession' in navigator) navigator.mediaSession.playbackState='playing'; });
    audio.addEventListener('pause', () => { state.textContent='Pausado'; btn.textContent='▶'; if ('mediaSession' in navigator) navigator.mediaSession.playbackState='paused'; });
    audio.addEventListener('waiting', () => { state.textContent='Buffer…'; });
    audio.addEventListener('error', () => { state.textContent='Error al cargar'; btn.textContent='↻'; });
    btn.onclick = () => audio.paused ? audio.play().catch(()=>{ state.textContent='No se pudo reproducir'; }) : audio.pause();
    $('[data-a="close"]', el).onclick = stopRadio;
    setMediaSession(station, audio);
    audio.play().catch(() => { state.textContent='Tocá ▶ para iniciar'; btn.textContent='▶'; });
    currentRadio = { audio, el, station };
  }

  async function fetchRadios() {
    const servers = ['https://de1.api.radio-browser.info','https://de2.api.radio-browser.info','https://nl1.api.radio-browser.info','https://at1.api.radio-browser.info'];
    const path = '/json/stations/search?tag=christian&language=spanish&hidebroken=true&order=clickcount&reverse=true&limit=80';
    for (const server of servers) {
      try {
        const res = await fetch(server + path);
        if (!res.ok) continue;
        const data = await res.json();
        const items = (Array.isArray(data) ? data : [])
          .filter(s => s.url_resolved && /^(MP3|AAC|AAC\+)$/i.test(s.codec || ''))
          .filter(s => !isBlockedRadio(s))
          .slice(0, 40)
          .map(s => ({ id:s.stationuuid, name:(s.name || 'Sin nombre').trim(), type:`${s.country || 'Internacional'} · ${s.codec || 'Audio'}`, note:(s.tags || '').split(',').slice(0,3).join(', ') || 'Radio cristiana evangélica', stream:s.url_resolved, page:s.homepage || '', favicon:s.favicon || '' }));
        if (items.length) return items;
      } catch {}
    }
    return FALLBACK_RADIOS;
  }

  function radioCard(r, i, mode) {
    const fav = isFav(r);
    if (mode === 'explorar') {
      return `<article class="cr-card" data-i="${i}"><button class="cr-fav-btn ${fav?'on':''}" data-act="fav">${fav?'♥':'♡'}</button><p class="cr-type">${r.type || 'Radio cristiana evangélica'}</p><h3>${r.name}</h3><p class="cr-note">${r.note || ''}</p><button class="cr-btn-primary" data-act="play">▶ Escuchar dentro de la app</button>${r.page?`<button class="cr-btn-ghost" data-act="page">Ver sitio oficial</button>`:''}<button class="cr-btn-ghost" data-act="share">Compartir</button></article>`;
    }
    return `<article class="cr-card" data-i="${i}"><p class="cr-type">${r.type || 'Radio cristiana evangélica'} ${r._isCustom?'<span class="cr-badge">Agregada por vos</span>':''}</p><h3>${r.name}</h3><p class="cr-note">${r.note || ''}</p><button class="cr-btn-primary" data-act="play">▶ Escuchar dentro de la app</button>${r.page?`<button class="cr-btn-ghost" data-act="page">Ver sitio oficial</button>`:''}<button class="cr-btn-ghost" data-act="share">Compartir</button><button class="cr-btn-danger" data-act="remove">🗑️ Quitar de mis radios</button></article>`;
  }
  function bindRadioCards(list, items, render) {
    list.querySelectorAll('.cr-card').forEach(card => {
      const r = items[Number(card.dataset.i)]; if (!r) return;
      $('[data-act="play"]', card)?.addEventListener('click', () => playRadio(r));
      $('[data-act="page"]', card)?.addEventListener('click', () => window.open(r.page, '_blank', 'noopener'));
      $('[data-act="share"]', card)?.addEventListener('click', () => shareItem(r.name, r.note || 'Radio cristiana evangélica', r.page || r.stream));
      $('[data-act="fav"]', card)?.addEventListener('click', () => { toggleFav(r); render(); });
      $('[data-act="remove"]', card)?.addEventListener('click', () => { if (confirm(`¿Quitar "${r.name}" de tus radios?`)) { removeFromMyRadios(r); render(); } });
    });
  }

  function addForm(render) {
    const f = document.createElement('div'); f.className='cr-form';
    f.innerHTML = `<p class="cr-type">➕ Agregar una radio</p><label>Nombre</label><input data-f="name" placeholder="Ej: Radio cristiana"/><label>URL del stream</label><input data-f="stream" placeholder="https://...mp3"/><label>Sitio web opcional</label><input data-f="page" placeholder="https://..."/><button class="cr-btn-primary">Guardar radio</button><p class="cr-mini">No se guardan radios que parezcan católicas.</p>`;
    $('button', f).onclick = () => {
      const name = $('[data-f="name"]', f).value.trim(), stream = $('[data-f="stream"]', f).value.trim(), page = $('[data-f="page"]', f).value.trim();
      if (!name) return alert('Falta el nombre.');
      if (!/^https?:\/\//.test(stream)) return alert('El stream debe empezar con http:// o https://');
      const r = { id:`custom-${Date.now()}`, name, type:'Mi radio evangélica', note:'Agregada por vos', stream, page, favicon:'' };
      if (isBlockedRadio(r)) return alert('No se guardó: parece una radio católica.');
      const custom = loadCustomRaw(); custom.push(r); saveCustom(custom);
      const favs = loadFavsRaw(); favs.push(r); saveFavs(favs);
      render();
    };
    return f;
  }

  function renderDial(container) {
    const radios = getMyRadios();
    if (!radios.length) { container.innerHTML = `<div class="cr-dial"><div class="cr-dial-brand">━━ PALABRA VIVA RADIO ━━</div><div class="cr-dial-empty"><p style="font-size:40px;margin:0">📻</p><p>Agregá radios a “Mis radios” para usar el dial retro.</p><p style="font-size:12px;opacity:.75">Entrá a Explorar y tocá ♡.</p></div></div>`; return; }
    let idx = Math.max(0, radios.findIndex(r => currentRadio && radioId(currentRadio.station) === radioId(r)));
    function ui() {
      const r = radios[idx];
      const playing = currentRadio && radioId(currentRadio.station) === radioId(r) && !currentRadio.audio.paused;
      const left = radios.length === 1 ? 50 : (idx / (radios.length - 1)) * 100;
      const freq = (88 + idx * (20 / Math.max(1, radios.length - 1))).toFixed(1);
      container.innerHTML = `<div class="cr-dial"><div class="cr-dial-brand">━━ PALABRA VIVA RADIO ━━</div><div class="cr-dial-display"><div class="freq">FM ${freq}</div><div class="station">${r.name}</div><div class="status">${playing?'EN VIVO':'SINTONIZADA'} · ${r.type || 'Radio cristiana'}</div></div><div class="cr-dial-strip"><div class="cr-dial-needle" style="left:${left}%"></div><div class="cr-dial-marks"><span>88</span><span>92</span><span>96</span><span>100</span><span>104</span><span>108</span></div></div><div class="cr-dial-controls"><button class="cr-dial-knob" data-a="prev">◀</button><button class="cr-dial-play" data-a="play">${playing?'⏸ DETENER':'▶ ESCUCHAR'}</button><button class="cr-dial-knob" data-a="next">▶</button></div><button class="cr-btn-ghost" data-a="share">Compartir radio</button></div>`;
      $('[data-a="prev"]', container).onclick = () => { idx = (idx - 1 + radios.length) % radios.length; ui(); };
      $('[data-a="next"]', container).onclick = () => { idx = (idx + 1) % radios.length; ui(); };
      $('[data-a="play"]', container).onclick = () => { if (playing) stopRadio(); else playRadio(r); setTimeout(ui, 150); };
      $('[data-a="share"]', container).onclick = () => shareItem(r.name, r.note || 'Radio cristiana evangélica', r.page || r.stream);
    }
    ui();
  }

  function openYoutubeViewer(title, src, channelUrl) {
    const v = document.createElement('section'); v.className = 'cr-viewer';
    v.innerHTML = `<div class="cr-viewer-head"><div><p class="ref">Dentro de Palabra Viva</p><h3>${title}</h3></div><button class="cr-close">Cerrar</button></div><iframe class="cr-viewer-frame" src="${src}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe><p class="cr-mini">Si el video no carga, abrí el canal completo en YouTube.</p><button class="cr-btn-ghost">Abrir canal en YouTube</button>`;
    const e = openModal(v, `cr-viewer-${Date.now()}`);
    $('.cr-close', v).onclick = () => closeModal(e, true);
    $('.cr-btn-ghost', v).onclick = () => window.open(channelUrl, '_blank', 'noopener');
  }

  function openPanel() {
    injectStyles(); purifyStoredRadios();
    document.querySelector('.cr-panel')?.remove();
    let mode = 'mis', q = '';
    const panel = document.createElement('section'); panel.className='cr-panel';
    panel.innerHTML = `<div class="cr-inner"><div class="cr-head"><div><p class="ref">Ver y escuchar</p><h1>Radios y canales</h1><p class="soft">Radios evangélicas, favoritas, dial retro y canales en español.</p></div><button class="cr-close">Cerrar</button></div><div class="cr-tabs"><button class="cr-tab active" data-m="mis">Mis radios</button><button class="cr-tab" data-m="explorar">Explorar</button><button class="cr-tab" data-m="dial">📻 Dial</button><button class="cr-tab" data-m="canales">Canales</button></div><input class="cr-search" placeholder="Buscar por nombre…"/><div class="cr-list"></div></div>`;
    const entry = openModal(panel, `cr-panel-${Date.now()}`), list = $('.cr-list', panel), search = $('.cr-search', panel);

    async function getExplore() {
      if (radiosCache) return radiosCache;
      if (radiosLoading) return null;
      radiosLoading = true; list.innerHTML='<div class="cr-loading">Buscando radios evangélicas en español…</div>';
      radiosCache = await fetchRadios(); radiosLoading = false; return radiosCache;
    }
    async function render() {
      panel.querySelectorAll('.cr-tab').forEach(b => b.classList.toggle('active', b.dataset.m === mode));
      search.style.display = mode === 'dial' ? 'none' : '';
      if (mode === 'mis') {
        const items = getMyRadios().filter(r => !q || clean(`${r.name} ${r.note} ${r.type}`).includes(clean(q)));
        list.innerHTML = items.length ? items.map((r,i)=>radioCard(r,i,'mis')).join('') : `<div class="cr-empty"><strong>Todavía no tenés radios guardadas.</strong><p>Andá a Explorar y tocá ♡, o agregá una manualmente abajo.</p></div>`;
        bindRadioCards(list, items, render); list.appendChild(addForm(render)); return;
      }
      if (mode === 'explorar') {
        const all = await getExplore(); if (!all) return;
        const items = all.filter(r => !q || clean(`${r.name} ${r.note} ${r.type}`).includes(clean(q)));
        list.innerHTML = items.length ? items.map((r,i)=>radioCard(r,i,'explorar')).join('') : '<div class="cr-empty">No encontré radios evangélicas con esa búsqueda.</div>';
        bindRadioCards(list, items, render); return;
      }
      if (mode === 'dial') { list.innerHTML = '<div style="grid-column:1/-1"></div>'; renderDial(list.firstElementChild); return; }
      const items = CHANNELS.filter(c => !q || clean(`${c.name} ${c.note} ${c.type}`).includes(clean(q)));
      list.innerHTML = items.map((c,i)=>`<article class="cr-card"><p class="cr-type">${c.type}</p><h3>${c.name}</h3><p class="cr-note">${c.note}</p>${c.embed?`<button class="cr-btn-primary" data-embed="${i}">Ver dentro de la app</button><button class="cr-btn-ghost" data-open="${i}">Abrir canal en YouTube</button>`:`<button class="cr-btn-primary" data-open="${i}">Abrir canal en YouTube</button><p class="cr-mini">Este canal no permite reproducción embebida.</p>`}<button class="cr-btn-ghost" data-share="${i}">Compartir</button></article>`).join('');
      list.querySelectorAll('[data-embed]').forEach(b => b.onclick = () => { const c = items[Number(b.dataset.embed)]; openYoutubeViewer(c.name, c.embed, c.channel); });
      list.querySelectorAll('[data-open]').forEach(b => b.onclick = () => window.open(items[Number(b.dataset.open)].channel, '_blank', 'noopener'));
      list.querySelectorAll('[data-share]').forEach(b => b.onclick = () => { const c = items[Number(b.dataset.share)]; shareItem(c.name, c.note, c.channel); });
    }
    $('.cr-close', panel).onclick = () => closeModal(entry, true);
    search.oninput = e => { q = e.target.value; render(); };
    panel.querySelectorAll('.cr-tab').forEach(b => b.onclick = () => { mode = b.dataset.m; q=''; search.value=''; render(); });
    render();
  }

  function addQuickButton() { const q = $('.quick'); if (!q || $('.cr-quick')) return; const b = document.createElement('button'); b.className='cr-quick'; b.textContent='Ver'; b.onclick=openPanel; q.insertBefore(b, q.firstChild); }
  function addHomeCard() {
    if ($('.cr-home-card')) return;
    const title = $('h1')?.textContent || ''; if (!title.includes('Una palabra para hoy')) return;
    const anchor = $('.pv-notif-card') || $('.respuestas-home-card') || $('.pv-path-card') || $('.moodBox') || $('.hero'); if (!anchor) return;
    const card = document.createElement('section'); card.className='card cr-home-card';
    card.innerHTML = `<p class="ref">Ver y escuchar</p><h3>Radios evangélicas y canales</h3><p class="soft">Sin radios católicas, con favoritos y dial retro estilo radio antigua.</p><button class="btn">Abrir</button>`;
    $('button', card).onclick = openPanel; anchor.insertAdjacentElement('afterend', card);
  }

  window.PalabraVivaCanales = { open: openPanel, close: closeTopModal, limpiarRadiosCatolicas: purifyStoredRadios };
  function boot(){ injectStyles(); purifyStoredRadios(); addQuickButton(); addHomeCard(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.addEventListener('load', boot);
  setInterval(boot, 900);
})();
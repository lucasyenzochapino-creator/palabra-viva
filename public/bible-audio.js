(() => {
  let queue = [];
  let index = 0;
  let currentText = '';
  let isReading = false;
  let voices = [];

  const settings = () => ({
    rate: Number(localStorage.getItem('pv-audio-rate') || '0.86'),
    pitch: Number(localStorage.getItem('pv-audio-pitch') || '0.92'),
    volume: Number(localStorage.getItem('pv-audio-volume') || '1'),
    pause: Number(localStorage.getItem('pv-audio-pause') || '450')
  });

  function $(sel, root = document) { return root.querySelector(sel); }
  function $$(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  function injectStyles() {
    if ($('#pv-audio-style')) return;
    const style = document.createElement('style');
    style.id = 'pv-audio-style';
    style.textContent = `
      .pv-audio-card{border-color:rgba(245,158,11,.45);background:linear-gradient(135deg,rgba(245,158,11,.14),var(--card))}
      .pv-audio-one,.pv-audio-read-visible,.pv-audio-open{border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:999px;padding:10px 13px;font-weight:900;display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:42px}
      .pv-audio-panel{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(188px + env(safe-area-inset-bottom));z-index:45;width:min(720px,calc(100% - 18px));border:1px solid var(--line);background:color-mix(in srgb,var(--card) 94%,transparent);backdrop-filter:blur(14px);border-radius:24px;padding:12px;box-shadow:0 20px 60px rgba(0,0,0,.28)}
      .pv-audio-title{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:8px}.pv-audio-title strong{font-size:15px;line-height:1.15}.pv-audio-title span{font-size:13px;color:var(--muted)}
      .pv-audio-actions{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}.pv-audio-actions button{border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:16px;padding:9px 6px;font-weight:900;min-height:40px;font-size:13px}.pv-audio-actions .primary{background:linear-gradient(135deg,var(--brand),var(--brand2));color:white;border-color:transparent}
      .pv-audio-progress{height:6px;border-radius:999px;background:var(--card2);overflow:hidden;margin-top:9px}.pv-audio-progress i{display:block;height:100%;width:0%;background:linear-gradient(135deg,var(--brand),var(--brand2));transition:width .2s}
      .pv-audio-settings{position:fixed;inset:0;z-index:60;background:var(--bg);color:var(--text);overflow:auto;padding:16px 14px calc(230px + env(safe-area-inset-bottom))}.pv-audio-settings-inner{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:14px}.pv-audio-head{display:grid;grid-template-columns:1fr auto;gap:10px;position:sticky;top:0;background:linear-gradient(to bottom,var(--bg),rgba(0,0,0,0));padding:8px 0 14px;backdrop-filter:blur(12px);z-index:2}.pv-audio-head h1{font-size:clamp(24px,7vw,32px);line-height:1.05;margin:4px 0 6px;letter-spacing:-.04em}.pv-audio-close{border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:999px;padding:9px 12px;font-weight:900;height:40px}.pv-audio-setting-card{border:1px solid var(--line);background:var(--card);border-radius:24px;padding:16px}.pv-audio-setting-card label{display:block;font-weight:900;margin:12px 0}.pv-audio-setting-card input{width:100%;accent-color:var(--brand)}.pv-audio-note{font-size:15px;color:var(--muted)}
      @media(max-width:420px){.pv-audio-actions{grid-template-columns:repeat(2,minmax(0,1fr))}.pv-audio-panel{bottom:calc(202px + env(safe-area-inset-bottom))}.pv-audio-title{display:block}.pv-audio-title button{margin-top:8px;width:100%}}
    `;
    document.head.appendChild(style);
  }

  function refreshVoices() {
    voices = speechSynthesis.getVoices ? speechSynthesis.getVoices() : [];
  }
  if ('speechSynthesis' in window) {
    refreshVoices();
    speechSynthesis.onvoiceschanged = refreshVoices;
  }

  function bestVoice() {
    refreshVoices();
    const preferred = [
      'Google español', 'Google español de Estados Unidos', 'Microsoft Sabina', 'Microsoft Helena', 'Microsoft Pablo', 'Microsoft Raul', 'Paulina', 'Monica', 'Jorge', 'Diego', 'Luciana', 'español', 'Spanish'
    ];
    for (const p of preferred) {
      const found = voices.find(v => (v.name + ' ' + v.lang).toLowerCase().includes(p.toLowerCase()) && /es|spanish/i.test(v.lang + ' ' + v.name));
      if (found) return found;
    }
    return voices.find(v => /es|spanish/i.test(v.lang + ' ' + v.name)) || null;
  }

  function normalizeText(text) {
    return (text || '')
      .replace(/[“”]/g, '')
      .replace(/Jehová/g, 'Jehová')
      .replace(/á/g, 'a')
      .replace(/é/g, 'e')
      .replace(/í/g, 'i')
      .replace(/ó/g, 'o')
      .replace(/ú/g, 'u')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function speakOne(text, onEnd) {
    if (!('speechSynthesis' in window)) {
      alert('Este dispositivo no tiene lectura por voz disponible.');
      return;
    }
    const cfg = settings();
    const u = new SpeechSynthesisUtterance(normalizeText(text));
    u.lang = 'es-419';
    u.rate = cfg.rate;
    u.pitch = cfg.pitch;
    u.volume = cfg.volume;
    const v = bestVoice();
    if (v) u.voice = v;
    u.onend = () => setTimeout(() => onEnd && onEnd(), cfg.pause);
    u.onerror = () => onEnd && onEnd();
    speechSynthesis.speak(u);
  }

  function updatePanel() {
    const panel = $('.pv-audio-panel');
    if (!panel) return;
    const total = queue.length || 1;
    const pct = Math.min(100, Math.round((index / total) * 100));
    $('.pv-audio-now', panel).textContent = currentText ? currentText.slice(0, 90) + (currentText.length > 90 ? '...' : '') : 'Listo para escuchar';
    $('.pv-audio-count', panel).textContent = queue.length ? `${Math.min(index + 1, total)} de ${total}` : 'Sin lectura';
    $('.pv-audio-progress i', panel).style.width = pct + '%';
  }

  function ensurePanel() {
    injectStyles();
    let panel = $('.pv-audio-panel');
    if (panel) return panel;
    panel = document.createElement('section');
    panel.className = 'pv-audio-panel';
    panel.innerHTML = `
      <div class="pv-audio-title"><div><strong>Audio bíblico cálido</strong><br><span class="pv-audio-now">Listo para escuchar</span><br><span class="pv-audio-count">Sin lectura</span></div><button class="pv-audio-open">Ajustes</button></div>
      <div class="pv-audio-actions"><button class="primary" data-audio="resume">Seguir</button><button data-audio="pause">Pausar</button><button data-audio="stop">Detener</button><button data-audio="visible">Leer visible</button></div>
      <div class="pv-audio-progress"><i></i></div>
    `;
    document.body.appendChild(panel);
    $('[data-audio="resume"]', panel).onclick = () => {
      if (speechSynthesis.paused) speechSynthesis.resume();
      else if (!isReading && queue.length) startQueue(queue, Math.max(0, index));
    };
    $('[data-audio="pause"]', panel).onclick = () => speechSynthesis.pause();
    $('[data-audio="stop"]', panel).onclick = stop;
    $('[data-audio="visible"]', panel).onclick = readVisible;
    $('.pv-audio-open', panel).onclick = openSettings;
    updatePanel();
    return panel;
  }

  function startQueue(items, start = 0) {
    if (!items.length) return;
    stop(false);
    ensurePanel();
    queue = items;
    index = start;
    isReading = true;
    const next = () => {
      if (!isReading || index >= queue.length) {
        isReading = false;
        currentText = '';
        updatePanel();
        return;
      }
      currentText = queue[index].label + '. ' + queue[index].text;
      updatePanel();
      speakOne(currentText, () => { index++; next(); });
    };
    next();
  }

  function stop(clear = true) {
    isReading = false;
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    if (clear) { queue = []; index = 0; currentText = ''; }
    updatePanel();
  }

  function verseFromCard(card) {
    const ref = card.querySelector('.ref')?.textContent?.replace(/·.*/, '').trim() || 'Palabra Viva';
    const text = card.querySelector('.verse')?.textContent?.replace(/[“”]/g, '').trim() || '';
    return text ? { label: ref, text } : null;
  }

  function readCard(card) {
    const item = verseFromCard(card);
    if (item) startQueue([item]);
  }

  function readVisible() {
    const items = $$('.card').map(verseFromCard).filter(Boolean);
    if (!items.length) return alert('No hay versículos visibles para leer.');
    startQueue(items);
  }

  function addButtons() {
    $$('.card').forEach(card => {
      if (card.querySelector('.pv-audio-one')) return;
      if (!card.querySelector('.verse') || !card.querySelector('.ref')) return;
      let row = card.querySelector('.row.wrap');
      if (!row) {
        row = document.createElement('div');
        row.className = 'row wrap';
        card.appendChild(row);
      }
      const b = document.createElement('button');
      b.className = 'pv-audio-one';
      b.type = 'button';
      b.textContent = 'Escuchar';
      b.onclick = e => { e.preventDefault(); e.stopPropagation(); readCard(card); };
      row.appendChild(b);
    });
  }

  function addHomeCard() {
    const title = $('h1')?.textContent || '';
    if (!title.includes('Una palabra para hoy')) return;
    if ($('.pv-audio-card')) return;
    const path = $('.pv-path-card') || $('.hero');
    if (!path) return;
    const card = document.createElement('section');
    card.className = 'card pv-audio-card';
    card.innerHTML = `<p class="ref">Audio bíblico</p><h3>Escuchar la Biblia con voz cálida</h3><p class="soft">Lectura pausada, serena y reverente usando la voz del dispositivo. Funciona sin APIs pagas.</p><div class="row wrap"><button class="btn pv-audio-read-visible">Escuchar ahora</button><button class="btn ghost pv-audio-open-card">Ajustes de voz</button></div>`;
    card.querySelector('.pv-audio-read-visible').onclick = readVisible;
    card.querySelector('.pv-audio-open-card').onclick = openSettings;
    path.insertAdjacentElement('afterend', card);
  }

  function addQuick() {
    const quick = $('.quick');
    if (!quick || $('.pv-audio-quick')) return;
    const b = document.createElement('button');
    b.className = 'pv-audio-quick';
    b.textContent = 'Audio';
    b.onclick = () => { ensurePanel(); readVisible(); };
    quick.insertBefore(b, quick.firstChild);
  }

  function openSettings() {
    injectStyles();
    $('.pv-audio-settings')?.remove();
    const cfg = settings();
    const panel = document.createElement('section');
    panel.className = 'pv-audio-settings';
    panel.innerHTML = `
      <div class="pv-audio-settings-inner">
        <div class="pv-audio-head"><div><p class="ref">Audio bíblico</p><h1>Voz cálida para leer la Biblia</h1><p class="soft">Perfil sereno y reverente. No imita actores ni voces protegidas.</p></div><button class="pv-audio-close">Cerrar</button></div>
        <section class="pv-audio-setting-card"><h3>Perfil de lectura</h3><p class="pv-audio-note">La app usa la mejor voz en español disponible en tu teléfono. En Android/iPhone puede variar según las voces instaladas.</p><label>Velocidad: <span data-rate>${cfg.rate.toFixed(2)}</span><input type="range" min="0.70" max="1.05" step="0.01" value="${cfg.rate}" data-audio-range="rate"></label><label>Tono: <span data-pitch>${cfg.pitch.toFixed(2)}</span><input type="range" min="0.75" max="1.10" step="0.01" value="${cfg.pitch}" data-audio-range="pitch"></label><label>Pausa entre versículos: <span data-pause>${cfg.pause}</span> ms<input type="range" min="100" max="1200" step="50" value="${cfg.pause}" data-audio-range="pause"></label><div class="row wrap"><button class="btn pv-test-voice">Probar voz</button><button class="btn ghost pv-stop-test">Detener</button></div></section>
        <section class="pv-audio-setting-card"><h3>Voz futura premium</h3><p class="pv-audio-note">Más adelante se puede integrar una voz profesional o licenciada, pero debe tener derechos de uso. No conviene copiar voces de actores, series ni personas reales sin permiso.</p></section>
      </div>`;
    document.body.appendChild(panel);
    $('.pv-audio-close', panel).onclick = () => panel.remove();
    $$('[data-audio-range]', panel).forEach(input => input.oninput = e => {
      const k = e.target.dataset.audioRange;
      localStorage.setItem('pv-audio-' + k, e.target.value);
      const out = panel.querySelector(`[data-${k}]`);
      if (out) out.textContent = k === 'pause' ? e.target.value : Number(e.target.value).toFixed(2);
    });
    $('.pv-test-voice', panel).onclick = () => startQueue([{ label: 'Juan 14:27', text: 'La paz os dejo, mi paz os doy: no como el mundo la da, yo os la doy.' }]);
    $('.pv-stop-test', panel).onclick = stop;
  }

  window.PalabraVivaAudio = { readVisible, stop, openSettings };
  setInterval(() => { injectStyles(); addButtons(); addQuick(); addHomeCard(); }, 900);
})();
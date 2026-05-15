(() => {
  const state = {
    voice: null,
    rate: 0.88,
    pitch: 0.82,
    volume: 1,
    reading: false,
    queue: [],
    index: 0,
    installed: false
  };

  function normalize(text) {
    return (text || '')
      .replace(/[“”]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function loadVoices() {
    const voices = window.speechSynthesis?.getVoices?.() || [];
    const spanish = voices.filter(v => /es|spanish|español/i.test(`${v.lang} ${v.name}`));
    const latino = spanish.filter(v => /es-419|es-US|es-MX|es-AR|es-CO|es-CL|es-PE|lat/i.test(`${v.lang} ${v.name}`));
    const preferred = [...latino, ...spanish, ...voices];
    state.voice = preferred.find(v => /male|mascul|hombre|pablo|jorge|diego|miguel|carlos|raul|raúl/i.test(v.name)) || preferred[0] || null;
  }

  function speakText(text, onEnd) {
    if (!('speechSynthesis' in window)) {
      alert('Este dispositivo no permite lectura en voz alta desde el navegador.');
      return;
    }
    loadVoices();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = state.voice?.lang || 'es-419';
    utterance.voice = state.voice;
    utterance.rate = state.rate;
    utterance.pitch = state.pitch;
    utterance.volume = state.volume;
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();
    window.speechSynthesis.speak(utterance);
  }

  function stop() {
    state.reading = false;
    state.queue = [];
    state.index = 0;
    window.speechSynthesis?.cancel?.();
    updateBar('Lectura detenida');
  }

  function pause() {
    window.speechSynthesis?.pause?.();
    updateBar('Lectura pausada');
  }

  function resume() {
    window.speechSynthesis?.resume?.();
    updateBar('Leyendo...');
  }

  function playQueue(items) {
    const clean = items.map(normalize).filter(Boolean);
    if (!clean.length) {
      alert('No encontré versículos visibles para leer.');
      return;
    }
    window.speechSynthesis?.cancel?.();
    state.queue = clean;
    state.index = 0;
    state.reading = true;
    updateBar(`Leyendo 1 de ${state.queue.length}`);
    next();
  }

  function next() {
    if (!state.reading) return;
    if (state.index >= state.queue.length) {
      state.reading = false;
      updateBar('Lectura terminada');
      return;
    }
    const current = state.queue[state.index];
    const displayIndex = state.index + 1;
    updateBar(`Leyendo ${displayIndex} de ${state.queue.length}`);
    state.index += 1;
    speakText(current, next);
  }

  function visibleVerseTexts() {
    return Array.from(document.querySelectorAll('.card'))
      .map(card => {
        const ref = card.querySelector('.ref')?.textContent || '';
        const verse = card.querySelector('.verse')?.textContent || '';
        if (!verse) return '';
        return `${ref}. ${verse}`;
      })
      .filter(Boolean);
  }

  function ensureBar() {
    if (document.getElementById('pv-audio-bar')) return;
    const bar = document.createElement('div');
    bar.id = 'pv-audio-bar';
    bar.innerHTML = `
      <div class="pv-audio-title">
        <strong>Audio Biblia</strong>
        <span id="pv-audio-status">Voz bíblica latino cálida</span>
      </div>
      <div class="pv-audio-actions">
        <button id="pv-read-all" type="button">Leer todo</button>
        <button id="pv-pause" type="button">Pausar</button>
        <button id="pv-resume" type="button">Seguir</button>
        <button id="pv-stop" type="button">Detener</button>
      </div>
    `;
    document.body.appendChild(bar);
    document.getElementById('pv-read-all')?.addEventListener('click', () => playQueue(visibleVerseTexts()));
    document.getElementById('pv-pause')?.addEventListener('click', pause);
    document.getElementById('pv-resume')?.addEventListener('click', resume);
    document.getElementById('pv-stop')?.addEventListener('click', stop);
  }

  function updateBar(text) {
    ensureBar();
    const status = document.getElementById('pv-audio-status');
    if (status) status.textContent = text;
  }

  function addVerseButtons() {
    document.querySelectorAll('.card').forEach(card => {
      if (card.querySelector('.pv-read-one')) return;
      const verse = card.querySelector('.verse');
      const ref = card.querySelector('.ref');
      if (!verse) return;
      const actions = card.querySelector('.row.wrap');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pv-read-one';
      btn.textContent = 'Leer';
      btn.addEventListener('click', ev => {
        ev.preventDefault();
        ev.stopPropagation();
        playQueue([`${ref?.textContent || ''}. ${verse.textContent || ''}`]);
      });
      if (actions) actions.appendChild(btn);
      else card.appendChild(btn);
    });
  }

  function injectStyles() {
    if (document.getElementById('pv-audio-style')) return;
    const style = document.createElement('style');
    style.id = 'pv-audio-style';
    style.textContent = `
      #pv-audio-bar{position:fixed;left:50%;bottom:150px;transform:translateX(-50%);width:min(720px,calc(100% - 24px));z-index:8;background:rgba(15,15,22,.92);color:#fff;border:1px solid rgba(255,255,255,.16);box-shadow:0 18px 55px rgba(0,0,0,.28);border-radius:24px;padding:10px 12px;display:flex;gap:10px;align-items:center;justify-content:space-between;backdrop-filter:blur(16px)}
      .pv-audio-title{display:flex;flex-direction:column;gap:2px;font-size:13px}.pv-audio-title strong{font-size:14px}.pv-audio-title span{opacity:.76}
      .pv-audio-actions{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}.pv-audio-actions button,.pv-read-one{border:1px solid rgba(255,255,255,.16);background:linear-gradient(135deg,#f59e0b,#fbbf24);color:#1b1208;border-radius:999px;padding:8px 10px;font-weight:900;font-size:13px}.pv-audio-actions button:nth-child(n+2){background:rgba(255,255,255,.1);color:#fff}.pv-read-one{margin-left:6px;background:rgba(255,255,255,.1);color:inherit;border-color:rgba(255,255,255,.18)}
      @media(max-width:480px){#pv-audio-bar{bottom:150px;align-items:flex-start;flex-direction:column}.pv-audio-actions{justify-content:flex-start}.pv-audio-actions button{font-size:12px;padding:7px 9px}}
    `;
    document.head.appendChild(style);
  }

  function boot() {
    if (state.installed) return;
    state.installed = true;
    injectStyles();
    ensureBar();
    loadVoices();
    if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = loadVoices;
    setInterval(addVerseButtons, 900);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

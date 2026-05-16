(() => {
  let items = [];
  let pos = 0;
  let playing = false;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  function injectStyles() {
    if ($('#pv-audio-force-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-audio-force-style';
    st.textContent = `
      .pv-audio-fixed{position:fixed;right:12px;bottom:calc(158px + env(safe-area-inset-bottom));z-index:80;border:0;background:linear-gradient(135deg,var(--brand),var(--brand2));color:white;border-radius:999px;padding:12px 15px;font-weight:900;box-shadow:0 18px 45px rgba(0,0,0,.32);min-height:46px}
      .pv-audio-box{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(210px + env(safe-area-inset-bottom));z-index:81;width:min(720px,calc(100% - 18px));border:1px solid var(--line);background:color-mix(in srgb,var(--card) 96%,transparent);color:var(--text);border-radius:24px;padding:13px;box-shadow:0 24px 70px rgba(0,0,0,.3);backdrop-filter:blur(14px)}
      .pv-audio-box h3{font-size:18px;margin:0 0 6px}.pv-audio-box p{font-size:14px;color:var(--muted);margin:0 0 10px}.pv-audio-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.pv-audio-grid button{border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:16px;padding:10px 8px;font-weight:900;min-height:42px}.pv-audio-grid button.primary{background:linear-gradient(135deg,var(--brand),var(--brand2));color:white;border-color:transparent}.pv-audio-one{border:1px solid var(--line)!important;background:var(--card2)!important;color:var(--text)!important;border-radius:999px!important;padding:10px 13px!important;font-weight:900!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;min-height:42px!important}
      .pv-audio-status{font-size:13px;color:var(--muted);margin-top:9px}.pv-audio-settings-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:9px}.pv-audio-settings-row label{font-size:12px;color:var(--muted);font-weight:900}.pv-audio-settings-row input{width:100%;accent-color:var(--brand)}
      @media(max-width:420px){.pv-audio-fixed{right:10px;bottom:calc(150px + env(safe-area-inset-bottom));padding:10px 12px;font-size:13px}.pv-audio-box{bottom:calc(198px + env(safe-area-inset-bottom))}.pv-audio-grid{grid-template-columns:1fr 1fr}}
    `;
    document.head.appendChild(st);
  }

  function cfg() {
    return {
      rate: Number(localStorage.getItem('pv-audio-rate') || '0.82'),
      pitch: Number(localStorage.getItem('pv-audio-pitch') || '0.90'),
      pause: Number(localStorage.getItem('pv-audio-pause') || '500')
    };
  }

  function voices() {
    try { return speechSynthesis.getVoices() || []; } catch { return []; }
  }

  function bestVoice() {
    const vs = voices();
    return vs.find(v => /es-419|es_AR|es-MX|es-US|es_ES/i.test(v.lang)) ||
      vs.find(v => /spanish|español|es-/i.test(v.name + ' ' + v.lang)) || null;
  }

  function clean(t) {
    return (t || '').replace(/[“”]/g, '').replace(/\s+/g, ' ').trim();
  }

  function speak(text, done) {
    if (!('speechSynthesis' in window)) {
      alert('Tu navegador no tiene lectura por voz disponible.');
      return;
    }
    speechSynthesis.cancel();
    const c = cfg();
    const u = new SpeechSynthesisUtterance(clean(text));
    u.lang = 'es-419';
    u.rate = c.rate;
    u.pitch = c.pitch;
    u.volume = 1;
    const v = bestVoice();
    if (v) u.voice = v;
    u.onend = () => setTimeout(() => done && done(), c.pause);
    u.onerror = () => done && done();
    speechSynthesis.speak(u);
  }

  function visibleVerses() {
    const result = [];
    $$('.card').forEach(card => {
      const ref = card.querySelector('.ref')?.textContent?.replace(/·.*/, '').trim();
      const verse = card.querySelector('.verse')?.textContent?.replace(/[“”]/g, '').trim();
      if (ref && verse) result.push({ ref, verse });
    });
    return result;
  }

  function setStatus(text) {
    const s = $('.pv-audio-status');
    if (s) s.textContent = text;
  }

  function readList(list) {
    if (!list.length) {
      alert('No hay versículos visibles para leer. Entrá a Biblia o a una palabra primero.');
      return;
    }
    items = list;
    pos = 0;
    playing = true;
    showBox();
    next();
  }

  function next() {
    if (!playing) return;
    if (pos >= items.length) {
      playing = false;
      setStatus('Lectura finalizada.');
      return;
    }
    const it = items[pos];
    setStatus(`Leyendo ${pos + 1} de ${items.length}: ${it.ref}`);
    speak(`${it.ref}. ${it.verse}`, () => { pos++; next(); });
  }

  function pause() { if ('speechSynthesis' in window) speechSynthesis.pause(); setStatus('Pausado.'); }
  function resume() { if ('speechSynthesis' in window) speechSynthesis.resume(); setStatus('Continuando lectura.'); }
  function stop() { playing = false; if ('speechSynthesis' in window) speechSynthesis.cancel(); setStatus('Detenido.'); }

  function showBox() {
    injectStyles();
    let box = $('.pv-audio-box');
    if (box) return box;
    box = document.createElement('section');
    box.className = 'pv-audio-box';
    box.innerHTML = `
      <h3>Audio bíblico cálido</h3>
      <p>Lectura pausada y reverente con la voz disponible en tu dispositivo.</p>
      <div class="pv-audio-grid">
        <button class="primary" data-a="visible">Leer visible</button>
        <button data-a="test">Probar voz</button>
        <button data-a="pause">Pausar</button>
        <button data-a="resume">Seguir</button>
        <button data-a="stop">Detener</button>
        <button data-a="close">Cerrar panel</button>
      </div>
      <div class="pv-audio-settings-row">
        <label>Velocidad<input type="range" min="0.70" max="1.05" step="0.01" value="${cfg().rate}" data-set="rate"></label>
        <label>Tono<input type="range" min="0.75" max="1.10" step="0.01" value="${cfg().pitch}" data-set="pitch"></label>
      </div>
      <div class="pv-audio-status">Listo para escuchar.</div>
    `;
    document.body.appendChild(box);
    $('[data-a="visible"]', box).onclick = () => readList(visibleVerses());
    $('[data-a="test"]', box).onclick = () => readList([{ ref: 'Juan 14:27', verse: 'La paz os dejo, mi paz os doy: no como el mundo la da, yo os la doy.' }]);
    $('[data-a="pause"]', box).onclick = pause;
    $('[data-a="resume"]', box).onclick = resume;
    $('[data-a="stop"]', box).onclick = stop;
    $('[data-a="close"]', box).onclick = () => { stop(); box.remove(); };
    $$('[data-set]', box).forEach(input => input.oninput = e => localStorage.setItem('pv-audio-' + e.target.dataset.set, e.target.value));
    return box;
  }

  function addFixedButton() {
    injectStyles();
    if ($('.pv-audio-fixed')) return;
    const b = document.createElement('button');
    b.className = 'pv-audio-fixed';
    b.textContent = 'Escuchar Biblia';
    b.onclick = () => { showBox(); readList(visibleVerses()); };
    document.body.appendChild(b);
  }

  function addVerseButtons() {
    $$('.card').forEach(card => {
      if (card.querySelector('.pv-audio-one')) return;
      if (!card.querySelector('.ref') || !card.querySelector('.verse')) return;
      let row = card.querySelector('.row.wrap');
      if (!row) {
        row = document.createElement('div');
        row.className = 'row wrap';
        card.appendChild(row);
      }
      const b = document.createElement('button');
      b.className = 'pv-audio-one';
      b.textContent = 'Escuchar';
      b.onclick = e => {
        e.preventDefault();
        e.stopPropagation();
        const ref = card.querySelector('.ref')?.textContent?.replace(/·.*/, '').trim() || 'Palabra Viva';
        const verse = card.querySelector('.verse')?.textContent?.replace(/[“”]/g, '').trim() || '';
        readList([{ ref, verse }]);
      };
      row.appendChild(b);
    });
  }

  function addHomeCard() {
    const title = $('h1')?.textContent || '';
    if (!title.includes('Una palabra para hoy')) return;
    if ($('.pv-audio-card-force')) return;
    const anchor = $('.pv-path-card') || $('.hero');
    if (!anchor) return;
    const card = document.createElement('section');
    card.className = 'card pv-audio-card-force';
    card.innerHTML = `<p class="ref">Audio bíblico</p><h3>Escuchar con voz cálida</h3><p class="soft">Tocá para activar la lectura. En algunos celulares el audio solo comienza después de tocar un botón.</p><div class="row wrap"><button class="btn">Escuchar ahora</button><button class="btn ghost">Panel de audio</button></div>`;
    const buttons = card.querySelectorAll('button');
    buttons[0].onclick = () => readList(visibleVerses());
    buttons[1].onclick = showBox;
    anchor.insertAdjacentElement('afterend', card);
  }

  window.PalabraVivaAudio = { show: showBox, readVisible: () => readList(visibleVerses()), stop };

  if ('speechSynthesis' in window) {
    speechSynthesis.onvoiceschanged = () => voices();
  }

  setInterval(() => { addFixedButton(); addVerseButtons(); addHomeCard(); }, 800);
  addFixedButton();
})();
(() => {
  const MALE_HINTS = ['pablo','raul','raúl','jorge','diego','carlos','miguel','enrique','javier','juan','alvaro','álvaro','luis','ricardo','mateo','antonio','pedro','manuel','male','hombre','masculino'];
  const ES_HINTS = ['es-419','es_ar','es-ar','es_mx','es-mx','es_us','es-us','es_es','es-es','spanish','español','espanol','castellano'];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  function voices() {
    try { return speechSynthesis.getVoices() || []; } catch { return []; }
  }
  function scoreVoice(v) {
    const text = (v.name + ' ' + v.lang).toLowerCase();
    let score = 0;
    if (ES_HINTS.some(h => text.includes(h))) score += 50;
    if (MALE_HINTS.some(h => text.includes(h))) score += 45;
    if (text.includes('google')) score += 10;
    if (text.includes('microsoft')) score += 12;
    if (text.includes('natural')) score += 10;
    if (text.includes('premium')) score += 8;
    if (text.includes('female') || text.includes('mujer') || text.includes('femenino')) score -= 30;
    return score;
  }
  function bestMaleVoice() {
    const list = voices().filter(v => ES_HINTS.some(h => (v.name + ' ' + v.lang).toLowerCase().includes(h)));
    return (list.length ? list : voices()).sort((a,b) => scoreVoice(b) - scoreVoice(a))[0] || null;
  }
  function selectedVoice() {
    const saved = localStorage.getItem('pv-audio-voice-name');
    const list = voices();
    return list.find(v => v.name === saved) || bestMaleVoice();
  }

  function patchSpeak() {
    if (!('speechSynthesis' in window) || speechSynthesis.__pvHumanPatched) return;
    const original = speechSynthesis.speak.bind(speechSynthesis);
    speechSynthesis.speak = (utterance) => {
      const v = selectedVoice();
      if (v) utterance.voice = v;
      utterance.lang = v?.lang || 'es-419';
      utterance.rate = Number(localStorage.getItem('pv-audio-rate') || '0.76');
      utterance.pitch = Number(localStorage.getItem('pv-audio-pitch') || '0.78');
      utterance.volume = 1;
      original(utterance);
    };
    speechSynthesis.__pvHumanPatched = true;
  }

  function injectStyles() {
    if ($('#pv-human-voice-style')) return;
    const style = document.createElement('style');
    style.id = 'pv-human-voice-style';
    style.textContent = `
      .pv-voice-panel{position:fixed;inset:0;z-index:90;background:var(--bg);color:var(--text);overflow:auto;padding:16px 14px calc(230px + env(safe-area-inset-bottom))}
      .pv-voice-inner{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:14px}.pv-voice-head{display:grid;grid-template-columns:1fr auto;gap:10px;position:sticky;top:0;background:linear-gradient(to bottom,var(--bg),rgba(0,0,0,0));padding:8px 0 14px;backdrop-filter:blur(12px);z-index:2}.pv-voice-head h1{font-size:clamp(24px,7vw,32px);line-height:1.05;margin:4px 0 6px;letter-spacing:-.04em}.pv-voice-close{border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:999px;padding:9px 12px;font-weight:900;height:40px}.pv-voice-card{border:1px solid var(--line);background:var(--card);border-radius:24px;padding:16px}.pv-voice-select{width:100%;border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:18px;padding:13px;font:inherit;outline:none}.pv-voice-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.pv-voice-actions button{border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:16px;padding:11px 8px;font-weight:900}.pv-voice-actions .primary{background:linear-gradient(135deg,var(--brand),var(--brand2));color:white;border-color:transparent}.pv-voice-note{font-size:15px;color:var(--muted)}.pv-voice-quick{background:linear-gradient(135deg,var(--brand),var(--brand2))!important;color:white!important}
      @media(max-width:420px){.pv-voice-actions{grid-template-columns:1fr}.pv-voice-panel{padding:12px 10px calc(240px + env(safe-area-inset-bottom))}.pv-voice-head h1{font-size:23px}}
    `;
    document.head.appendChild(style);
  }

  function testVoice(text = 'Juan catorce, veintisiete. La paz os dejo, mi paz os doy: no como el mundo la da, yo os la doy.') {
    if (!('speechSynthesis' in window)) return alert('Este navegador no tiene lectura por voz disponible.');
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(u);
  }

  function openPanel() {
    injectStyles();
    patchSpeak();
    $('.pv-voice-panel')?.remove();
    const panel = document.createElement('section');
    panel.className = 'pv-voice-panel';
    const list = voices().sort((a,b) => scoreVoice(b) - scoreVoice(a));
    const selected = selectedVoice();
    panel.innerHTML = `
      <div class="pv-voice-inner">
        <div class="pv-voice-head"><div><p class="ref">Audio humano</p><h1>Voz masculina cálida</h1><p class="soft">La app usa las voces instaladas en tu teléfono. Elegí la más natural disponible.</p></div><button class="pv-voice-close">Cerrar</button></div>
        <section class="pv-voice-card"><h3>Elegir voz</h3><p class="pv-voice-note">Si ves nombres como Pablo, Raúl, Jorge, Diego, Carlos o Miguel, probalos primero. En algunos Android solo aparece una voz genérica de Google.</p><select class="pv-voice-select">${list.map(v => `<option value="${v.name.replace(/"/g,'&quot;')}" ${selected?.name===v.name?'selected':''}>${v.name} · ${v.lang}${MALE_HINTS.some(h => v.name.toLowerCase().includes(h)) ? ' · posible masculina' : ''}</option>`).join('') || '<option>No hay voces detectadas todavía</option>'}</select><div class="pv-voice-actions"><button class="primary" data-v="save">Guardar voz</button><button data-v="test">Probar voz</button><button data-v="male">Elegir masculina automática</button><button data-v="slow">Modo cálido lento</button></div></section>
        <section class="pv-voice-card"><h3>Opciones gratis reales</h3><p class="pv-voice-note"><strong>Gratis inmediato:</strong> voces instaladas en Android/iPhone. Calidad depende del teléfono.</p><p class="pv-voice-note"><strong>Gratis más humano:</strong> generar audios con Piper TTS en servidor o PC y subirlos a la app. Requiere más trabajo, pero puede sonar mucho mejor que el navegador.</p><p class="pv-voice-note"><strong>Más adelante:</strong> voz profesional grabada o TTS premium con licencia. No usar imitaciones de actores o voces reales sin permiso.</p></section>
      </div>`;
    document.body.appendChild(panel);
    $('.pv-voice-close', panel).onclick = () => panel.remove();
    $('[data-v="save"]', panel).onclick = () => { localStorage.setItem('pv-audio-voice-name', $('.pv-voice-select', panel).value); alert('Voz guardada. Tocá Probar voz o Escuchar Biblia.'); };
    $('[data-v="test"]', panel).onclick = () => { localStorage.setItem('pv-audio-voice-name', $('.pv-voice-select', panel).value); testVoice(); };
    $('[data-v="male"]', panel).onclick = () => { const v = bestMaleVoice(); if (v) { localStorage.setItem('pv-audio-voice-name', v.name); $('.pv-voice-select', panel).value = v.name; testVoice(); } };
    $('[data-v="slow"]', panel).onclick = () => { localStorage.setItem('pv-audio-rate','0.74'); localStorage.setItem('pv-audio-pitch','0.76'); testVoice(); };
  }

  function addQuick() {
    const quick = $('.quick');
    if (!quick || $('.pv-voice-quick')) return;
    const btn = document.createElement('button');
    btn.className = 'pv-voice-quick';
    btn.textContent = 'Voz';
    btn.onclick = openPanel;
    quick.insertBefore(btn, quick.firstChild);
  }

  if ('speechSynthesis' in window) {
    speechSynthesis.onvoiceschanged = () => { patchSpeak(); };
  }
  window.PalabraVivaVoz = { open: openPanel, best: bestMaleVoice };
  setInterval(() => { injectStyles(); patchSpeak(); addQuick(); }, 900);
  patchSpeak();
})();
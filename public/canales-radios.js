(() => {
  try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch {}

  const CHANNELS = [
    { name:'BibleProject Español', type:'Biblia explicada', note:'Videos animados para entender libros y temas bíblicos.', embed:'https://www.youtube-nocookie.com/embed/videoseries?list=PLH0Szn1yYNedn4FbBMMtOlGN-BPLQ54IH', fallback:'https://www.youtube.com/@BibleProjectEspanol' }
  ];

  const RADIOS = [
    { name:'BBN Radio Español', type:'Radio bíblica', note:'Música, Biblia y enseñanza cristiana 24/7.', stream:'https://streams.radiomast.io/475ebed1-595e-4717-b888-64fe8fc6b09f', page:'https://bbnradio.org/espanol/' },
    { name:'Radio Nueva Vida', type:'Radio cristiana', note:'Música y enseñanza cristiana en español.', stream:'', page:'https://nuevavida.com/' },
    { name:'CVCLAVOZ', type:'Radio cristiana', note:'Música, devocionales y mensajes.', stream:'', page:'https://cvclavoz.com/escuchar-en-vivo/' }
  ];

  const MOMENTS = [
    ['Jesús calma la tormenta','Marcos 4:39','Calla, enmudece. Y cesó el viento, y fué hecha grande bonanza.','Cuando sentís miedo o caos','🌊','Jesús, hablá paz sobre mi tormenta interior.','Nombrá tu tormenta y entregásela a Dios en una frase.'],
    ['La mujer samaritana','Juan 4:14','El agua que yo le daré, será en él una fuente de agua que salte para vida eterna.','Cuando te sentís visto, juzgado o lejos de Dios','💧','Señor, encontrame en mi sed y hablame con verdad.','Hablá con Dios con honestidad.'],
    ['Nicodemo y nacer de nuevo','Juan 3:3','El que no naciere otra vez, no puede ver el reino de Dios.','Cuando querés empezar de nuevo','✨','Dios, enseñame a nacer de nuevo desde adentro.','Leé Juan 3 y anotá una pregunta sincera.'],
    ['El hijo pródigo vuelve','Lucas 15:20','Y como aun estuviese lejos, viólo su padre, y fué movido á misericordia.','Cuando sentís culpa o querés volver','🏠','Padre, ayudame a volver sin esconderme.','Decí: Dios, vuelvo a vos.'],
    ['La resurrección','Juan 20:16','Jesús le dice: María. Volviéndose ella, dícele: Rabboni.','Cuando necesitás esperanza','🌅','Jesús, llamame por mi nombre y renová mi esperanza.','Recordá que el dolor no tiene la última palabra.']
  ];

  const $ = (s, r=document) => r.querySelector(s);
  const clean = t => (t||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  const openExternal = url => window.open(url, '_blank', 'noopener,noreferrer');

  function injectStyles(){
    if ($('#canales-radios-style')) return;
    const st = document.createElement('style');
    st.id = 'canales-radios-style';
    st.textContent = `
      .cr-panel{position:fixed;inset:0;z-index:55;background:var(--bg);color:var(--text);overflow:auto;padding:16px 14px calc(230px + env(safe-area-inset-bottom))}.cr-inner{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:14px}.cr-head{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:start;position:sticky;top:0;background:linear-gradient(to bottom,var(--bg),rgba(0,0,0,0));padding:8px 0 14px;z-index:2;backdrop-filter:blur(12px)}.cr-head h1{font-size:clamp(24px,7vw,32px);line-height:1.05;margin:4px 0 6px;letter-spacing:-.04em}.cr-close{border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:999px;padding:9px 12px;font-weight:900;min-width:66px}.cr-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.cr-tab{border:1px solid var(--line);background:var(--card);color:var(--text);border-radius:18px;padding:12px 8px;font-weight:900;text-align:center}.cr-tab.active{background:linear-gradient(135deg,var(--brand),var(--brand2));color:white;border-color:transparent}.cr-search{width:100%;border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:18px;padding:14px;font:inherit;outline:none}.cr-list{display:grid;grid-template-columns:1fr;gap:12px}.cr-card{border:1px solid var(--line);background:var(--card);border-radius:24px;padding:16px;box-shadow:0 16px 38px rgba(0,0,0,.12)}.cr-card h3{margin:0 0 6px;font-size:20px;line-height:1.12}.cr-type{font-size:13px;color:var(--brand);font-weight:900;text-transform:uppercase;letter-spacing:.06em}.cr-note{color:var(--muted)}.cr-open{width:100%;border:0;background:linear-gradient(135deg,var(--brand),var(--brand2));color:white;border-radius:999px;padding:12px 14px;font-weight:900;margin-top:10px;min-height:46px}.cr-open.secondary{background:var(--card2);color:var(--text);border:1px solid var(--line)}.cr-warning{border:1px solid rgba(245,158,11,.45);background:linear-gradient(135deg,rgba(245,158,11,.12),var(--card));border-radius:22px;padding:14px}.cr-warning p{font-size:15px;color:var(--muted)}.cr-home-card{border-color:rgba(236,72,153,.42);background:linear-gradient(135deg,rgba(236,72,153,.12),var(--card))}
      .cr-viewer{position:fixed;inset:0;z-index:70;background:var(--bg);color:var(--text);padding:14px;display:flex;flex-direction:column;gap:10px}.cr-viewer-head{display:flex;justify-content:space-between;align-items:center;gap:10px}.cr-frame-wrap{position:relative;width:100%;height:72vh;border:1px solid var(--line);border-radius:22px;background:#000;overflow:hidden}.cr-viewer-frame{width:100%;height:100%;border:0;background:#000}.cr-iframe-error{position:absolute;inset:0;display:none;place-items:center;text-align:center;padding:18px;background:var(--card);color:var(--text)}.cr-iframe-error.show{display:grid}.cr-mini{font-size:13px;color:var(--muted)}
      .cr-audio-player{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(96px + env(safe-area-inset-bottom));z-index:95;width:min(720px,calc(100% - 20px));border:1px solid var(--line);background:color-mix(in srgb,var(--card) 96%,transparent);color:var(--text);border-radius:24px;padding:14px;box-shadow:0 24px 70px rgba(0,0,0,.32);backdrop-filter:blur(14px)}.cr-audio-top{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.cr-audio-title{font-size:16px;font-weight:900;margin:0}.cr-audio-note{font-size:13px;color:var(--muted);margin:4px 0 0}.cr-audio-player audio{width:100%;margin:10px 0}.cr-audio-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}.cr-audio-actions button{border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:999px;padding:10px;font-weight:900}.cr-audio-actions .primary{border:0;background:linear-gradient(135deg,var(--brand),var(--brand2));color:white}
      .cr-moment-visual{height:170px;border-radius:22px;background:radial-gradient(circle at 30% 20%,rgba(245,158,11,.36),transparent 28%),linear-gradient(135deg,#1f1307,#7c4a1e,#be185d);display:grid;place-items:center;font-size:64px;margin-bottom:12px}.cr-moment-actions{display:grid;grid-template-columns:1fr;gap:8px}.cr-moment-actions button{border:1px solid var(--line);background:linear-gradient(135deg,var(--brand),var(--brand2));color:white;border-radius:999px;padding:11px;font-weight:900}
      @media(min-width:620px){.cr-list{grid-template-columns:1fr 1fr}.cr-frame-wrap{height:78vh}}@media(max-width:420px){.cr-tabs{grid-template-columns:1fr}.cr-frame-wrap{height:64vh}.cr-audio-actions{grid-template-columns:1fr}}
    `;
    document.head.appendChild(st);
  }

  function openAudioPlayer(radio){
    injectStyles();
    $('.cr-audio-player')?.remove();
    const player = document.createElement('section');
    player.className = 'cr-audio-player';
    player.innerHTML = `<div class="cr-audio-top"><div><p class="cr-audio-title">${radio.name}</p><p class="cr-audio-note">${radio.note}</p></div><button class="cr-close" data-close>×</button></div><audio controls autoplay src="${radio.stream}"></audio><div class="cr-audio-actions"><button class="primary" data-play>Play / Pause</button><button data-site>Sitio oficial</button></div>`;
    document.body.appendChild(player);
    const audio = player.querySelector('audio');
    player.querySelector('[data-close]').onclick = () => { try { audio.pause(); } catch {}; player.remove(); };
    player.querySelector('[data-play]').onclick = () => audio.paused ? audio.play().catch(()=>{}) : audio.pause();
    player.querySelector('[data-site]').onclick = () => openExternal(radio.page);
    audio.play().catch(()=>{});
  }

  function openViewer(title, src, fallback){
    injectStyles();
    $('.cr-viewer')?.remove();
    const v = document.createElement('section');
    v.className = 'cr-viewer';
    v.innerHTML = `<div class="cr-viewer-head"><div><p class="ref">Dentro de Palabra Viva</p><h3>${title}</h3></div><button class="cr-close">Cerrar</button></div><div class="cr-frame-wrap"><iframe class="cr-viewer-frame" src="${src}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe><div class="cr-iframe-error"><div><h3>Este contenido no se puede ver dentro de la app</h3><p>El proveedor puede bloquear la reproducción embebida.</p><button class="cr-open" data-open>Abrir en YouTube</button></div></div></div><p class="cr-mini">Si queda en negro o no carga, abrilo desde la fuente oficial.</p><button class="cr-open" data-open>Abrir en YouTube</button>`;
    document.body.appendChild(v);
    const iframe = v.querySelector('iframe');
    const errorBox = v.querySelector('.cr-iframe-error');
    let loaded = false;
    const timer = setTimeout(() => { if (!loaded) errorBox.classList.add('show'); }, 5000);
    iframe.onload = () => { loaded = true; clearTimeout(timer); };
    iframe.onerror = () => { clearTimeout(timer); errorBox.classList.add('show'); };
    v.querySelector('.cr-close').onclick = () => v.remove();
    v.querySelectorAll('[data-open]').forEach(b => b.onclick = () => openExternal(fallback || src));
  }

  function openPanel(){
    injectStyles();
    $('.cr-panel')?.remove();
    let mode = 'momentos', q = '';
    const panel = document.createElement('section');
    panel.className = 'cr-panel';
    panel.innerHTML = `<div class="cr-inner"><div class="cr-head"><div><p class="ref">Ver y escuchar</p><h1>Canales, radios y momentos</h1><p class="soft">Contenido cristiano no católico, canales seguros y radios internas.</p></div><button class="cr-close">Cerrar</button></div><section class="cr-warning"><p><strong>Aviso:</strong> radios con stream directo se reproducen dentro de la app. Los sitios que bloquean iframe se abren en su fuente oficial.</p></section><div class="cr-tabs"><button class="cr-tab active" data-mode="momentos">Momentos</button><button class="cr-tab" data-mode="youtube">Canales</button><button class="cr-tab" data-mode="radios">Radios</button></div><input class="cr-search" placeholder="Buscar: Jesús, Biblia, radio..." /><div class="cr-list"></div></div>`;
    document.body.appendChild(panel);
    const list = panel.querySelector('.cr-list');
    const render = () => {
      panel.querySelectorAll('.cr-tab').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
      if (mode === 'momentos') {
        const items = MOMENTS.filter(m => !q || clean(m.join(' ')).includes(clean(q)));
        list.innerHTML = items.map(m => `<article class="cr-card"><div class="cr-moment-visual">${m[4]}</div><p class="cr-type">${m[3]}</p><h3>${m[0]}</h3><p class="cr-type">${m[1]}</p><p class="cr-note">“${m[2]}”</p><p><strong>Oración:</strong> ${m[5]}</p><p><strong>Acción:</strong> ${m[6]}</p><div class="cr-moment-actions"><button data-q="${encodeURIComponent('The Chosen Español '+m[0]+' clip oficial')}">Buscar clip oficial</button></div></article>`).join('');
        list.querySelectorAll('[data-q]').forEach(b => b.onclick = () => openExternal(`https://www.youtube.com/results?search_query=${b.dataset.q}`));
        return;
      }
      const source = mode === 'youtube' ? CHANNELS : RADIOS;
      const items = source.filter(x => !q || clean(x.name+' '+x.type+' '+x.note).includes(clean(q)));
      list.innerHTML = items.map((item,i) => `<article class="cr-card"><p class="cr-type">${item.type}</p><h3>${item.name}</h3><p class="cr-note">${item.note}</p>${mode==='radios' && !item.stream ? `<button class="cr-open secondary" data-site="${i}">Abrir sitio oficial</button>` : `<button class="cr-open" data-i="${i}">${mode==='youtube'?'Ver dentro de la app':'Escuchar radio'}</button>`}</article>`).join('') || '<article class="cr-card"><p>No encontré resultados.</p></article>';
      list.querySelectorAll('[data-i]').forEach(b => b.onclick = () => { const item = items[Number(b.dataset.i)]; mode === 'radios' ? openAudioPlayer(item) : openViewer(item.name, item.embed, item.fallback); });
      list.querySelectorAll('[data-site]').forEach(b => b.onclick = () => openExternal(items[Number(b.dataset.site)].page));
    };
    panel.querySelector('.cr-close').onclick = () => panel.remove();
    panel.querySelector('.cr-search').oninput = e => { q = e.target.value; render(); };
    panel.querySelectorAll('.cr-tab').forEach(b => b.onclick = () => { mode = b.dataset.mode; render(); });
    render();
  }

  function addQuickButton(){ const quick = $('.quick'); if (!quick || $('.cr-quick')) return; const b = document.createElement('button'); b.className='cr-quick'; b.textContent='Ver'; b.onclick=openPanel; quick.insertBefore(b, quick.firstChild); }
  function addHomeCard(){ if ($('.cr-home-card')) return; const title=$('h1')?.textContent||''; if(!title.includes('Una palabra para hoy')) return; const anchor=$('.respuestas-home-card')||$('.pv-path-card')||$('.moodBox'); if(!anchor) return; const card=document.createElement('section'); card.className='card cr-home-card'; card.innerHTML=`<p class="ref">Ver y escuchar</p><h3>Canales, radios y momentos con Jesús</h3><p class="soft">Canales seguros, radio interna y reflexiones bíblicas.</p><button class="btn">Abrir</button>`; card.querySelector('button').onclick=openPanel; anchor.insertAdjacentElement('afterend',card); }
  window.PalabraVivaCanales = { open: openPanel };
  setInterval(() => { injectStyles(); addQuickButton(); addHomeCard(); }, 900);
})();
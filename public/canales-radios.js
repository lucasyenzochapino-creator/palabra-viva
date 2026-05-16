(() => {
  try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch {}

  const CHANNELS = [
    { name:'BibleProject Español', type:'Biblia explicada', note:'Videos animados para entender libros y temas bíblicos.', embed:'https://www.youtube-nocookie.com/embed/videoseries?list=PLH0Szn1yYNedn4FbBMMtOlGN-BPLQ54IH', fallback:'https://www.youtube.com/@BibleProjectEspanol' },
    { name:'Enlace TV', type:'TV cristiana latina', note:'Señal y predicaciones cristianas en español. Usar con discernimiento bíblico.', embed:'https://www.youtube-nocookie.com/embed?listType=search&list=Enlace%20TV%20en%20vivo%20oficial', fallback:'https://www.enlace.org/' },
    { name:'Nuevo Tiempo', type:'TV / Biblia / familia', note:'Contenido cristiano adventista en español: Biblia, familia y esperanza.', embed:'https://www.youtube-nocookie.com/embed?listType=search&list=Nuevo%20Tiempo%20espa%C3%B1ol%20oficial', fallback:'https://www.nuevotiempo.org/' },
    { name:'yesHEis Español', type:'Evangelismo práctico', note:'Contenido corto para hablar de Jesús y compartir la fe.', embed:'https://www.youtube-nocookie.com/embed?listType=search&list=yesHEis%20Espa%C3%B1ol%20oficial', fallback:'https://www.youtube.com/results?search_query=yesHEis+Espa%C3%B1ol+oficial' },
    { name:'Mi Primera Biblia', type:'Biblia para familia', note:'Historias bíblicas animadas para niños y familias.', embed:'https://www.youtube-nocookie.com/embed?listType=search&list=Mi%20Primera%20Biblia%20oficial', fallback:'https://www.youtube.com/results?search_query=Mi+Primera+Biblia+oficial' }
  ];

  const RADIOS = [
    { name:'Radio Nueva Vida', type:'Radio cristiana en español', note:'Sitio verificado activo; tiene opción escuchar.', page:'https://nuevavida.com/' },
    { name:'BBN Radio Español', type:'Radio bíblica', note:'Música, Biblia y enseñanza cristiana en español.', page:'https://bbnradio.org/espanol/' },
    { name:'Radio Trans Mundial / RTM', type:'Enseñanza bíblica', note:'Programas bíblicos y discipulado cristiano.', page:'https://rtm360.org/' },
    { name:'CVCLAVOZ Radio', type:'Radio cristiana latina', note:'Música, devocionales y mensajes.', page:'https://cvclavoz.com/radio/' },
    { name:'Enlace en vivo', type:'TV cristiana latina', note:'Señal cristiana en español.', page:'https://www.enlace.org/' }
  ];

  const MOMENTS = [
    { title:'Jesús calma la tormenta', ref:'Marcos 4:39', verse:'Calla, enmudece. Y cesó el viento, y fué hecha grande bonanza.', mood:'Cuando sentís miedo o caos', image:'🌊', prayer:'Jesús, hablá paz sobre mi tormenta interior.', action:'Nombrá tu tormenta y entregásela a Dios en una frase.' },
    { title:'La mujer samaritana', ref:'Juan 4:14', verse:'El agua que yo le daré, será en él una fuente de agua que salte para vida eterna.', mood:'Cuando te sentís visto, juzgado o lejos de Dios', image:'💧', prayer:'Señor, encontrame en mi sed y hablame con verdad.', action:'No escondas tu historia: hablá con Dios con honestidad.' },
    { title:'Nicodemo y nacer de nuevo', ref:'Juan 3:3', verse:'El que no naciere otra vez, no puede ver el reino de Dios.', mood:'Cuando querés empezar de nuevo', image:'✨', prayer:'Dios, enseñame a nacer de nuevo desde adentro.', action:'Leé Juan 3 y anotá una pregunta sincera.' },
    { title:'Jesús llama a Pedro', ref:'Lucas 5:10', verse:'No temas: desde ahora pescarás hombres.', mood:'Cuando te sentís insuficiente', image:'⛵', prayer:'Jesús, llamame aunque yo me sienta poco.', action:'Dale a Dios tu disponibilidad, no tu perfección.' },
    { title:'El hijo pródigo vuelve', ref:'Lucas 15:20', verse:'Y como aun estuviese lejos, viólo su padre, y fué movido á misericordia.', mood:'Cuando sentís culpa o querés volver', image:'🏠', prayer:'Padre, ayudame a volver sin esconderme.', action:'Decí: “Dios, vuelvo a vos”.' },
    { title:'Jesús ante la cruz', ref:'Lucas 22:42', verse:'Padre, si quieres, pasa este vaso de mí; empero no se haga mi voluntad, sino la tuya.', mood:'Cuando cuesta obedecer', image:'✝️', prayer:'Señor, dame fuerza para elegir tu voluntad.', action:'Entregá una decisión difícil a Dios.' },
    { title:'La resurrección', ref:'Juan 20:16', verse:'Jesús le dice: María. Volviéndose ella, dícele: Rabboni.', mood:'Cuando necesitás esperanza', image:'🌅', prayer:'Jesús, llamame por mi nombre y renová mi esperanza.', action:'Recordá que el dolor no tiene la última palabra.' },
    { title:'Tomás y sus dudas', ref:'Juan 20:27', verse:'No seas incrédulo, sino fiel.', mood:'Cuando dudás de la fe', image:'🕯️', prayer:'Señor, encontrame también en mis dudas.', action:'Hacé una pregunta honesta y buscá una respuesta bíblica.' }
  ];

  function injectStyles() {
    if (document.getElementById('canales-radios-style')) return;
    const style = document.createElement('style');
    style.id = 'canales-radios-style';
    style.textContent = `
      .cr-panel{position:fixed;inset:0;z-index:55;background:var(--bg);color:var(--text);overflow:auto;padding:16px 14px calc(230px + env(safe-area-inset-bottom))}
      .cr-inner{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:14px}.cr-head{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:start;position:sticky;top:0;background:linear-gradient(to bottom,var(--bg),rgba(0,0,0,0));padding:8px 0 14px;z-index:2;backdrop-filter:blur(12px)}.cr-head h1{font-size:clamp(24px,7vw,32px);line-height:1.05;margin:4px 0 6px;letter-spacing:-.04em}.cr-close{border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:999px;padding:9px 12px;font-weight:900;min-width:66px}.cr-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.cr-tab{border:1px solid var(--line);background:var(--card);color:var(--text);border-radius:18px;padding:12px 8px;font-weight:900;text-align:center}.cr-tab.active{background:linear-gradient(135deg,var(--brand),var(--brand2));color:white;border-color:transparent}.cr-search{width:100%;border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:18px;padding:14px;font:inherit;outline:none}.cr-list{display:grid;grid-template-columns:1fr;gap:12px}.cr-card{border:1px solid var(--line);background:var(--card);border-radius:24px;padding:16px;box-shadow:0 16px 38px rgba(0,0,0,.12)}.cr-card h3{margin:0 0 6px;font-size:20px;line-height:1.12}.cr-type{font-size:13px;color:var(--brand);font-weight:900;text-transform:uppercase;letter-spacing:.06em}.cr-note{color:var(--muted)}.cr-open{width:100%;border:0;background:linear-gradient(135deg,var(--brand),var(--brand2));color:white;border-radius:999px;padding:12px 14px;font-weight:900;margin-top:10px;min-height:46px}.cr-warning{border:1px solid rgba(245,158,11,.45);background:linear-gradient(135deg,rgba(245,158,11,.12),var(--card));border-radius:22px;padding:14px}.cr-warning p{font-size:15px;color:var(--muted)}.cr-home-card{border-color:rgba(236,72,153,.42);background:linear-gradient(135deg,rgba(236,72,153,.12),var(--card))}.cr-viewer{position:fixed;inset:0;z-index:70;background:var(--bg);color:var(--text);padding:14px;display:flex;flex-direction:column;gap:10px}.cr-viewer-head{display:flex;justify-content:space-between;align-items:center;gap:10px}.cr-viewer-frame{width:100%;height:72vh;border:1px solid var(--line);border-radius:22px;background:#000}.cr-mini{font-size:13px;color:var(--muted)}.cr-moment-visual{height:170px;border-radius:22px;background:radial-gradient(circle at 30% 20%,rgba(245,158,11,.36),transparent 28%),linear-gradient(135deg,#1f1307,#7c4a1e,#be185d);display:grid;place-items:center;font-size:64px;margin-bottom:12px}.cr-moment-actions{display:grid;grid-template-columns:1fr;gap:8px}.cr-moment-actions button{border:1px solid var(--line);background:linear-gradient(135deg,var(--brand),var(--brand2));color:white;border-radius:999px;padding:11px;font-weight:900}
      @media(min-width:620px){.cr-list{grid-template-columns:1fr 1fr}.cr-viewer-frame{height:78vh}}@media(max-width:420px){.cr-tabs{grid-template-columns:1fr}.cr-viewer-frame{height:64vh}}
    `;
    document.head.appendChild(style);
  }

  function clean(t){return (t||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();}

  function openViewer(title, src, fallback) {
    injectStyles();
    try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch {}
    document.querySelector('.cr-viewer')?.remove();
    const v = document.createElement('section');
    v.className = 'cr-viewer';
    v.innerHTML = `<div class="cr-viewer-head"><div><p class="ref">Dentro de Palabra Viva</p><h3>${title}</h3></div><button class="cr-close">Cerrar</button></div><iframe class="cr-viewer-frame" src="${src}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe><p class="cr-mini">Si el proveedor bloquea la vista interna, usá el botón oficial. No copiamos contenido protegido.</p><button class="cr-open" data-fallback="${fallback || src}">Abrir fuente oficial</button>`;
    document.body.appendChild(v);
    v.querySelector('.cr-close').onclick = () => v.remove();
    v.querySelector('[data-fallback]').onclick = () => location.href = v.querySelector('[data-fallback]').dataset.fallback;
  }

  function openPanel() {
    injectStyles();
    try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch {}
    document.querySelector('.cr-panel')?.remove();
    let mode = 'momentos'; let q = '';
    const panel = document.createElement('section');
    panel.className = 'cr-panel';
    panel.innerHTML = `<div class="cr-inner"><div class="cr-head"><div><p class="ref">Ver y escuchar</p><h1>Canales, radios y momentos</h1><p class="soft">Contenido cristiano no católico, visor interno y reflexiones propias basadas en los Evangelios.</p></div><button class="cr-close">Cerrar</button></div><section class="cr-warning"><p><strong>Aviso:</strong> quitamos recursos católicos y páginas dudosas. Los videos se muestran embebidos cuando el proveedor lo permite. Las reflexiones de momentos son contenido original de Palabra Viva, no imágenes ni audios copiados de The Chosen.</p></section><div class="cr-tabs"><button class="cr-tab active" data-mode="momentos">Momentos</button><button class="cr-tab" data-mode="youtube">Canales</button><button class="cr-tab" data-mode="radios">Radios</button></div><input class="cr-search" placeholder="Buscar: Jesús, tormenta, Biblia, radio, jóvenes..." /><div class="cr-list"></div></div>`;
    document.body.appendChild(panel);
    const list = panel.querySelector('.cr-list');
    const render = () => {
      panel.querySelectorAll('.cr-tab').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
      if (mode === 'momentos') {
        const items = MOMENTS.filter(m => !q || clean(m.title+' '+m.ref+' '+m.mood).includes(clean(q)));
        list.innerHTML = items.map(m=>`<article class="cr-card"><div class="cr-moment-visual">${m.image}</div><p class="cr-type">${m.mood}</p><h3>${m.title}</h3><p class="cr-type">${m.ref}</p><p class="cr-note">“${m.verse}”</p><p><strong>Oración:</strong> ${m.prayer}</p><p><strong>Acción:</strong> ${m.action}</p><div class="cr-moment-actions"><button data-search="${encodeURIComponent('The Chosen Español '+m.title+' clip oficial')}">Buscar clip oficial</button></div></article>`).join('') || '<article class="cr-card"><p>No encontré momentos con esa búsqueda.</p></article>';
        list.querySelectorAll('[data-search]').forEach(b => b.onclick = () => openViewer('Clip oficial relacionado', `https://www.youtube-nocookie.com/embed?listType=search&list=${b.dataset.search}`, `https://www.youtube.com/results?search_query=${b.dataset.search}`));
        return;
      }
      const source = mode === 'youtube' ? CHANNELS : RADIOS;
      const items = source.filter(item => !q || clean(item.name+' '+item.type+' '+item.note).includes(clean(q)));
      list.innerHTML = items.map((item,i)=>`<article class="cr-card"><p class="cr-type">${item.type}</p><h3>${item.name}</h3><p class="cr-note">${item.note}</p><button class="cr-open" data-i="${i}">${mode==='youtube'?'Ver dentro de la app':'Abrir visor interno'}</button></article>`).join('') || '<article class="cr-card"><p>No encontré resultados.</p></article>';
      list.querySelectorAll('[data-i]').forEach(b => b.onclick = () => { const item = items[Number(b.dataset.i)]; const src = item.embed || item.page; openViewer(item.name, src, item.fallback || item.page); });
    };
    panel.querySelector('.cr-close').onclick = () => { try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch {}; panel.remove(); };
    panel.querySelector('.cr-search').oninput = e => { q = e.target.value; render(); };
    panel.querySelectorAll('.cr-tab').forEach(b => b.onclick = () => { mode = b.dataset.mode; render(); });
    render();
  }

  function addQuickButton() { const quick = document.querySelector('.quick'); if (!quick || document.querySelector('.cr-quick')) return; const b = document.createElement('button'); b.className='cr-quick'; b.textContent='Ver'; b.onclick=openPanel; quick.insertBefore(b, quick.firstChild); }
  function addHomeCard() { if (document.querySelector('.cr-home-card')) return; const title=document.querySelector('h1')?.textContent||''; if(!title.includes('Una palabra para hoy')) return; const anchor=document.querySelector('.respuestas-home-card')||document.querySelector('.pv-path-card')||document.querySelector('.moodBox'); if(!anchor) return; const card=document.createElement('section'); card.className='card cr-home-card'; card.innerHTML=`<p class="ref">Ver y escuchar</p><h3>Canales, radios y momentos con Jesús</h3><p class="soft">Contenido cristiano no católico, reflexiones bíblicas y visor interno.</p><button class="btn">Abrir</button>`; card.querySelector('button').onclick=openPanel; anchor.insertAdjacentElement('afterend',card); }
  window.PalabraVivaCanales = { open: openPanel };
  setInterval(() => { injectStyles(); addQuickButton(); addHomeCard(); }, 900);
})();
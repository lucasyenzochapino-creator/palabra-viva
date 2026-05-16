(() => {
  const YOUTUBE = [
    { name:'BibleProject Español', type:'Biblia explicada', note:'Videos animados para entender libros y temas bíblicos.', url:'https://www.youtube.com/@BibleProjectEspanol' },
    { name:'The Chosen Español Latino', type:'Serie sobre Jesús', note:'Escenas y contenido sobre la vida de Jesús.', url:'https://www.youtube.com/results?search_query=The+Chosen+Espa%C3%B1ol+Latino+canal+oficial' },
    { name:'Enlace TV', type:'Canal cristiano latino', note:'Programación cristiana en español.', url:'https://www.youtube.com/results?search_query=Enlace+TV+canal+oficial' },
    { name:'CVCLAVOZ', type:'Radio y contenido cristiano', note:'Reflexiones, entrevistas, música y mensajes.', url:'https://www.youtube.com/results?search_query=CVCLAVOZ+canal+oficial' },
    { name:'yesHEis Español', type:'Evangelismo y fe diaria', note:'Contenido corto para compartir la fe y hablar de Jesús.', url:'https://www.youtube.com/results?search_query=yesHEis+espa%C3%B1ol+canal+oficial' },
    { name:'Mi Primera Biblia', type:'Biblia para niños y familia', note:'Historias bíblicas animadas para ver en familia.', url:'https://www.youtube.com/results?search_query=Mi+Primera+Biblia+canal+oficial' },
    { name:'Dante Gebel Oficial', type:'Mensajes y reflexiones', note:'Contenido cristiano contemporáneo y mensajes para la vida.', url:'https://www.youtube.com/results?search_query=Dante+Gebel+Oficial+YouTube' },
    { name:'Itiel Arroyo', type:'Jóvenes y fe', note:'Mensajes cristianos para jóvenes, propósito y vida espiritual.', url:'https://www.youtube.com/results?search_query=Itiel+Arroyo+canal+oficial' },
    { name:'Andrés Spyker', type:'Enseñanza cristiana', note:'Predicaciones y temas de vida cristiana.', url:'https://www.youtube.com/results?search_query=Andr%C3%A9s+Spyker+canal+oficial' },
    { name:'Fundación Infinito + 1', type:'Contenido católico / testimonios', note:'Documentales, testimonios y contenidos cristianos.', url:'https://www.youtube.com/results?search_query=Fundaci%C3%B3n+Infinito+1+canal+oficial' }
  ];

  const RADIOS = [
    { name:'BBN Radio Español', type:'Radio bíblica', note:'Música, Biblia y enseñanza cristiana en español.', url:'https://bbnradio.org/espanol/' },
    { name:'Radio Trans Mundial / RTM', type:'Enseñanza bíblica', note:'Programas bíblicos, discipulado y contenido cristiano.', url:'https://rtm360.org/' },
    { name:'CVCLAVOZ Radio', type:'Radio cristiana latina', note:'Música, devocionales, entrevistas y programas cristianos.', url:'https://cvclavoz.com/radio/' },
    { name:'Radio Nueva Vida', type:'Radio cristiana en español', note:'Música cristiana y enseñanza para la comunidad hispana.', url:'https://nuevavida.com/' },
    { name:'Nuevo Tiempo', type:'Radio y TV cristiana', note:'Familia, Biblia, vida espiritual, música y programas cristianos.', url:'https://www.nuevotiempo.org/' },
    { name:'La Voz de la Esperanza', type:'Radio cristiana', note:'Mensajes, esperanza y contenido bíblico en español.', url:'https://www.lavoz.org/' },
    { name:'Radio María Argentina', type:'Radio católica', note:'Oración, formación, misa, espiritualidad y acompañamiento.', url:'https://radiomaria.org.ar/' },
    { name:'Enlace en vivo', type:'TV cristiana latina', note:'Programación cristiana en español.', url:'https://www.enlace.org/' }
  ];

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
      .cr-tabs{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      .cr-tab{border:1px solid var(--line);background:var(--card);color:var(--text);border-radius:18px;padding:12px 8px;font-weight:900;text-align:center}
      .cr-tab.active{background:linear-gradient(135deg,var(--brand),var(--brand2));color:white;border-color:transparent}
      .cr-search{width:100%;border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:18px;padding:14px;font:inherit;outline:none}
      .cr-list{display:grid;grid-template-columns:1fr;gap:12px}
      .cr-card{border:1px solid var(--line);background:var(--card);border-radius:24px;padding:16px;box-shadow:0 16px 38px rgba(0,0,0,.12)}
      .cr-card h3{margin:0 0 6px;font-size:20px;line-height:1.12}.cr-type{font-size:13px;color:var(--brand);font-weight:900;text-transform:uppercase;letter-spacing:.06em}.cr-note{color:var(--muted)}
      .cr-open{width:100%;border:0;background:linear-gradient(135deg,var(--brand),var(--brand2));color:white;border-radius:999px;padding:12px 14px;font-weight:900;margin-top:10px;min-height:46px}
      .cr-warning{border:1px solid rgba(245,158,11,.45);background:linear-gradient(135deg,rgba(245,158,11,.12),var(--card));border-radius:22px;padding:14px}.cr-warning p{font-size:15px;color:var(--muted)}
      .cr-home-card{border-color:rgba(236,72,153,.42);background:linear-gradient(135deg,rgba(236,72,153,.12),var(--card))}
      @media(min-width:620px){.cr-list{grid-template-columns:1fr 1fr}}
    `;
    document.head.appendChild(style);
  }

  function clean(t){return (t||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();}

  function openPanel() {
    injectStyles();
    document.querySelector('.cr-panel')?.remove();
    let mode = 'youtube';
    let q = '';
    const panel = document.createElement('section');
    panel.className = 'cr-panel';
    panel.innerHTML = `
      <div class="cr-inner">
        <div class="cr-head">
          <div><p class="ref">Canales y radios</p><h1>Contenido cristiano latino</h1><p class="soft">YouTube, enseñanza, música y radios cristianas para acompañar la lectura bíblica.</p></div>
          <button class="cr-close">Cerrar</button>
        </div>
        <section class="cr-warning"><p><strong>Aviso:</strong> estos son recursos externos. Palabra Viva no controla su contenido. Usalos como acompañamiento, no como reemplazo de la Biblia ni de una comunidad cristiana sana.</p></section>
        <div class="cr-tabs"><button class="cr-tab active" data-mode="youtube">YouTube</button><button class="cr-tab" data-mode="radios">Radios</button></div>
        <input class="cr-search" placeholder="Buscar: Biblia, música, jóvenes, radio, Jesús..." />
        <div class="cr-list"></div>
      </div>`;
    document.body.appendChild(panel);
    const list = panel.querySelector('.cr-list');
    const render = () => {
      panel.querySelectorAll('.cr-tab').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
      const source = mode === 'youtube' ? YOUTUBE : RADIOS;
      const items = source.filter(item => !q || clean(item.name + ' ' + item.type + ' ' + item.note).includes(clean(q)));
      list.innerHTML = items.map(item => `
        <article class="cr-card">
          <p class="cr-type">${item.type}</p>
          <h3>${item.name}</h3>
          <p class="cr-note">${item.note}</p>
          <button class="cr-open" data-url="${item.url}">Abrir</button>
        </article>
      `).join('') || '<article class="cr-card"><p>No encontré resultados con esa búsqueda.</p></article>';
      list.querySelectorAll('[data-url]').forEach(b => b.onclick = () => window.open(b.dataset.url, '_blank', 'noopener,noreferrer'));
    };
    panel.querySelector('.cr-close').onclick = () => panel.remove();
    panel.querySelector('.cr-search').oninput = e => { q = e.target.value; render(); };
    panel.querySelectorAll('.cr-tab').forEach(b => b.onclick = () => { mode = b.dataset.mode; render(); });
    render();
  }

  function addQuickButton() {
    const quick = document.querySelector('.quick');
    if (!quick || document.querySelector('.cr-quick')) return;
    const b = document.createElement('button');
    b.className = 'cr-quick';
    b.textContent = 'Canales';
    b.onclick = openPanel;
    quick.insertBefore(b, quick.firstChild);
  }

  function addHomeCard() {
    if (document.querySelector('.cr-home-card')) return;
    const title = document.querySelector('h1')?.textContent || '';
    if (!title.includes('Una palabra para hoy')) return;
    const answers = document.querySelector('.respuestas-home-card') || document.querySelector('.pv-path-card') || document.querySelector('.moodBox');
    if (!answers) return;
    const card = document.createElement('section');
    card.className = 'card cr-home-card';
    card.innerHTML = `<p class="ref">Canales y radios</p><h3>YouTube y radios cristianas latinas</h3><p class="soft">Recursos externos para escuchar música, enseñanza y contenido cristiano en español.</p><button class="btn">Abrir canales y radios</button>`;
    card.querySelector('button').onclick = openPanel;
    answers.insertAdjacentElement('afterend', card);
  }

  window.PalabraVivaCanales = { open: openPanel };
  setInterval(() => { injectStyles(); addQuickButton(); addHomeCard(); }, 900);
})();
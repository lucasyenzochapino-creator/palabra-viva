(() => {
  // ===========================================================================
  // PALABRA VIVA — Línea del tiempo bíblica para niños
  // ===========================================================================
  // Recorrido cronológico de la historia de salvación: Creación → Iglesia hoy.
  // Diseño visual con tarjetas grandes, emojis, fechas aproximadas y
  // explicaciones simples. Se enlaza a la historia detallada del modo Niños.

  const EVENTS = [
    { era:'pre',     year:'En el principio', emoji:'🌍', title:'Dios crea el mundo',
      kid:'Dios habló y nació todo: la luz, el cielo, los árboles, los animales. Al final del sexto día creó a la primera pareja (Adán y Eva) a su imagen. Todo lo hizo bueno.',
      ref:'Génesis 1-2', linkTo:'Dios crea el mundo' },
    { era:'pre',     year:'Al principio', emoji:'🍎', title:'Adán y Eva',
      kid:'Las primeras personas vivían felices con Dios en un jardín, hasta que desobedecieron y se alejaron de Él.',
      ref:'Génesis 3', linkTo:'Adán y Eva en el jardín' },
    { era:'ot',      year:'Hace ~4000 años', emoji:'🚢', title:'Noé y el diluvio',
      kid:'Cuando casi nadie obedecía a Dios, Noé construyó un arca. Dios salvó a su familia y a los animales del diluvio.',
      ref:'Génesis 6-9', linkTo:'Noé y el arca' },
    { era:'ot',      year:'Hace ~4000 años', emoji:'🏗️', title:'Torre de Babel',
      kid:'Las personas quisieron ser más grandes que Dios. Por eso Dios hizo que hablaran idiomas distintos y se dispersaron.',
      ref:'Génesis 11', linkTo:'La torre de Babel' },
    { era:'ot',      year:'~2000 a.C.', emoji:'⭐', title:'Dios llama a Abraham',
      kid:'Dios eligió a Abraham y le prometió darle una familia tan grande como las estrellas. Empezó el pueblo de Israel.',
      ref:'Génesis 12-15', linkTo:'Abraham y la promesa' },
    { era:'ot',      year:'~1900 a.C.', emoji:'👔', title:'José en Egipto',
      kid:'Sus hermanos lo vendieron, pero Dios usó a José para salvar a su familia del hambre. Aprendió a perdonar.',
      ref:'Génesis 37-50', linkTo:'José y sus hermanos' },
    { era:'ot',      year:'~1450 a.C.', emoji:'🧺', title:'Moisés es salvado',
      kid:'Una mamá puso a su bebé en una canastita en el río. La princesa lo encontró. Dios usaría a Moisés para liberar a su pueblo.',
      ref:'Éxodo 2', linkTo:'Moisés en el río' },
    { era:'ot',      year:'~1450 a.C.', emoji:'🌊', title:'Salida de Egipto',
      kid:'Dios envió plagas y abrió el mar Rojo para que su pueblo escapara de la esclavitud. Caminaron por tierra seca.',
      ref:'Éxodo 7-14', linkTo:'Cruzando el mar Rojo' },
    { era:'ot',      year:'~1450 a.C.', emoji:'📜', title:'Los diez mandamientos',
      kid:'En el monte Sinaí, Dios le dio a Moisés diez reglas para vivir bien: amar a Dios y a las personas.',
      ref:'Éxodo 20', linkTo:'Los diez mandamientos' },
    { era:'ot',      year:'~1000 a.C.', emoji:'⚔️', title:'David vence a Goliat',
      kid:'Un chico pastor venció a un gigante con una piedra y una honda, porque confiaba en Dios. Después sería rey.',
      ref:'1 Samuel 17', linkTo:'David y Goliat' },
    { era:'ot',      year:'~970 a.C.', emoji:'👑', title:'Salomón el sabio',
      kid:'El hijo de David pidió sabiduría en vez de riquezas. Dios le dio sabiduría y mucho más.',
      ref:'1 Reyes 3', linkTo:'Salomón y la sabiduría' },
    { era:'ot',      year:'~870 a.C.', emoji:'🐦', title:'El profeta Elías',
      kid:'Dios mandó cuervos a alimentar a Elías. También lo llevó al cielo en un carro de fuego.',
      ref:'1 Reyes 17', linkTo:'Elías y los cuervos' },
    { era:'ot',      year:'~750 a.C.', emoji:'🐳', title:'Jonás y el pez',
      kid:'Dios le pidió ir a Nínive. Jonás escapó, lo tragó un pez, oró desde adentro y Dios lo sacó.',
      ref:'Jonás 1-2', linkTo:'Jonás y el pez grande' },
    { era:'jesus',   year:'Año 0', emoji:'⭐', title:'Jesús nace en Belén',
      kid:'En un pesebre humilde, Dios se hizo bebé. Vino al mundo para buscarnos y traernos esperanza.',
      ref:'Lucas 2', linkTo:'Jesús nace en Belén' },
    { era:'jesus',   year:'~Año 30', emoji:'🤝', title:'Jesús enseña y sana',
      kid:'Tres años caminó haciendo el bien, sanando, contando parábolas y mostrando cómo es el corazón del Padre.',
      ref:'Evangelios', linkTo:'Jesús ama a los niños' },
    { era:'jesus',   year:'~Año 33', emoji:'🍞', title:'Cinco panes y dos peces',
      kid:'Con la merienda de un niño, Jesús alimentó a miles. Lo poco que damos, Él lo multiplica.',
      ref:'Juan 6', linkTo:'Cinco panes y dos peces' },
    { era:'jesus',   year:'~Año 33', emoji:'🌿', title:'Jesús resucita a Lázaro',
      kid:'Su amigo Lázaro había muerto. Jesús lo llamó y volvió a vivir. Jesús es más fuerte que la muerte.',
      ref:'Juan 11', linkTo:'Jesús resucita a Lázaro' },
    { era:'jesus',   year:'~Año 33', emoji:'✝️', title:'Muere por nosotros',
      kid:'En la cruz, Jesús cargó con nuestros errores. Lo hizo por amor, para perdonarnos y darnos vida.',
      ref:'Juan 19', linkTo:'Jesús muere por nosotros' },
    { era:'jesus',   year:'~Año 33', emoji:'🌅', title:'¡Jesús vive!',
      kid:'Al tercer día la tumba estaba vacía. Jesús resucitó. Está vivo hoy y para siempre.',
      ref:'Mateo 28', linkTo:'Jesús vive' },
    { era:'church',  year:'Año 33', emoji:'🔥', title:'El Espíritu Santo',
      kid:'Jesús subió al cielo. Mandó al Espíritu Santo para acompañarnos y darnos fuerza. Nació la Iglesia.',
      ref:'Hechos 2', linkTo:null },
    { era:'church',  year:'Años 30-90', emoji:'✉️', title:'Los apóstoles llevan el mensaje',
      kid:'Pedro, Pablo y los demás viajaron por el mundo contando lo de Jesús. Escribieron las cartas del Nuevo Testamento.',
      ref:'Hechos · cartas', linkTo:null },
    { era:'church',  year:'Año 95', emoji:'📖', title:'Termina la Biblia',
      kid:'Con el libro de Apocalipsis, escrito por Juan, se completa la Palabra de Dios que tenemos hoy.',
      ref:'Apocalipsis', linkTo:null },
    { era:'church',  year:'Hoy', emoji:'🙏', title:'Vos formás parte',
      kid:'Hoy seguimos siendo parte de esta historia. Cuando creés en Jesús, sos parte de su familia para siempre.',
      ref:'1 Pedro 2', linkTo:null },
  ];

  const ERA_LABELS = {
    pre:    { name:'Antes de todo',      color:'#8b5cf6' },
    ot:     { name:'Antiguo Testamento', color:'#f59e0b' },
    jesus:  { name:'Jesús',              color:'#ef4444' },
    church: { name:'Iglesia hoy',        color:'#22c55e' }
  };

  function injectStyles() {
    if (document.getElementById('pv-tl-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-tl-style';
    st.textContent = `
      .pv-tl-panel{position:fixed;inset:0;z-index:1000003;background:linear-gradient(180deg,#fff8ef,#ffe9c7);color:#20140b!important;overflow-y:auto;padding:14px 12px calc(140px + env(safe-area-inset-bottom))}
      .pv-tl-inner{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:14px}
      .pv-tl-head{display:grid;grid-template-columns:1fr auto;gap:10px;position:sticky;top:0;background:linear-gradient(to bottom,#fff8ef 85%,transparent);padding:8px 0 14px;z-index:5}
      .pv-tl-head h1{font-size:clamp(24px,6vw,32px);margin:4px 0;color:#7c4a1e!important}
      .pv-tl-head p{color:#7c4a1e!important;margin:0;font-size:14px}
      .pv-tl-close{border:2px solid #7c4a1e;background:#fff;color:#7c4a1e!important;border-radius:999px;padding:9px 14px;font-weight:900;cursor:pointer;height:fit-content;align-self:flex-start}
      .pv-tl-era-bar{display:flex;gap:6px;overflow-x:auto;padding:4px 0 8px;scrollbar-width:none}
      .pv-tl-era-bar::-webkit-scrollbar{display:none}
      .pv-tl-era-chip{flex:0 0 auto;border:0;color:#fff!important;border-radius:999px;padding:8px 14px;font-weight:900;font-size:13px;cursor:pointer;opacity:.65}
      .pv-tl-era-chip.active{opacity:1;box-shadow:0 4px 12px rgba(0,0,0,.18)}
      .pv-tl-line{position:relative;display:flex;flex-direction:column;gap:0;margin-top:6px;padding-left:32px}
      .pv-tl-line::before{content:'';position:absolute;left:14px;top:18px;bottom:18px;width:3px;background:linear-gradient(to bottom,#8b5cf6 0%,#f59e0b 22%,#ef4444 50%,#22c55e 78%,#22c55e 100%);border-radius:3px}
      .pv-tl-item{position:relative;background:#fff;border-radius:22px;padding:18px 18px 16px;box-shadow:0 6px 20px rgba(0,0,0,.08);margin-bottom:14px;border:2px solid transparent}
      .pv-tl-item:hover{transform:translateY(-2px);transition:transform .15s}
      .pv-tl-dot{position:absolute;left:-32px;top:24px;width:30px;height:30px;border-radius:50%;background:#fff;border:4px solid #fff;display:grid;place-items:center;font-size:18px;box-shadow:0 0 0 3px var(--era-color,#8b5cf6),0 4px 12px rgba(0,0,0,.12)}
      .pv-tl-year{font-size:12px;font-weight:900;color:var(--era-color,#8b5cf6);text-transform:uppercase;letter-spacing:.06em;margin:0 0 6px}
      .pv-tl-title{font-size:18px;font-weight:900;color:#20140b;margin:0 0 8px;letter-spacing:-.01em}
      .pv-tl-body{font-size:15px;line-height:1.55;color:#3f2f1f;margin:0 0 10px}
      .pv-tl-ref{font-size:13px;color:#7c4a1e;font-weight:700;margin:0}
      .pv-tl-cta{margin-top:10px;display:flex;gap:8px;flex-wrap:wrap}
      .pv-tl-cta button{border:0;border-radius:999px;padding:9px 14px;font-weight:900;font-size:13px;cursor:pointer;color:#fff;background:linear-gradient(135deg,#7c4a1e,#b45309)}
      .pv-tl-cta button.read{background:linear-gradient(135deg,#22c55e,#16a34a)}
      .pv-tl-home{border-color:rgba(139,92,246,.45)!important;background:linear-gradient(135deg,rgba(139,92,246,.12),var(--card))!important}
      @media(min-width:600px){.pv-tl-line{padding-left:40px}.pv-tl-dot{left:-40px;width:36px;height:36px;font-size:20px}}
    `;
    document.head.appendChild(st);
  }

  function openTimeline() {
    if (document.querySelector('.pv-tl-panel')) return;
    injectStyles();

    const panel = document.createElement('section');
    panel.className = 'pv-tl-panel';
    panel.setAttribute('aria-label', 'Línea del tiempo bíblica');
    history.pushState({ pvTimeline: true }, '', location.href.split('#')[0] + '#timeline');

    let activeEra = 'all';

    const eraChips = Object.entries(ERA_LABELS).map(([key, val]) =>
      `<button class="pv-tl-era-chip${activeEra===key?' active':''}" data-era="${key}" style="background:${val.color}">${val.name}</button>`
    ).join('');

    panel.innerHTML = `
      <div class="pv-tl-inner">
        <div class="pv-tl-head">
          <div>
            <p>Recorrido para niños</p>
            <h1>📜 Línea del tiempo bíblica</h1>
          </div>
          <button class="pv-tl-close" data-close>Cerrar ✕</button>
        </div>
        <div class="pv-tl-era-bar">
          <button class="pv-tl-era-chip${activeEra==='all'?' active':''}" data-era="all" style="background:#7c4a1e">📖 Todas</button>
          ${eraChips}
        </div>
        <div class="pv-tl-line" id="pv-tl-line"></div>
      </div>
    `;

    function render() {
      const line = panel.querySelector('#pv-tl-line');
      const list = activeEra === 'all' ? EVENTS : EVENTS.filter(e => e.era === activeEra);
      line.innerHTML = list.map((ev) => {
        const realIdx = EVENTS.indexOf(ev);
        const era = ERA_LABELS[ev.era] || ERA_LABELS.pre;
        // SIEMPRE renderizar los botones si el evento tiene linkTo
        // (chequeamos PalabraVivaNinos al click, no al render — evita
        //  que se renderice sin botones si los scripts cargan en orden raro)
        const hasLink = !!ev.linkTo;
        // Audio URL precomputado pero si no hay API aún, lo dejamos vacío
        const audioUrls = hasLink ? (window.PalabraVivaNinos?.audioFor?.(ev.linkTo) || []) : [];
        const hasAudio = audioUrls.length > 0;
        return `<article class="pv-tl-item" style="--era-color:${era.color}" data-idx="${realIdx}">
          <div class="pv-tl-dot" aria-hidden="true">${ev.emoji}</div>
          <p class="pv-tl-year">${ev.year}</p>
          <h3 class="pv-tl-title">${ev.title}</h3>
          <p class="pv-tl-body">${ev.kid}</p>
          <p class="pv-tl-ref">📖 ${ev.ref}</p>
          ${hasAudio ? `<div class="pv-tl-audio-slot" data-audio="${audioUrls[0].replace(/"/g,'&quot;')}"></div>` : ''}
          <div class="pv-tl-cta">
            ${hasAudio ? `<button data-play-audio="${realIdx}" style="background:linear-gradient(135deg,#b45309,#7c4a1e)">🎧 Escuchar voz humana</button>` : ''}
            ${hasLink ? `<button data-link="${ev.linkTo.replace(/"/g, '&quot;')}" class="read">📖 Leer historia completa</button>` : ''}
            <button data-share-ev="${realIdx}" style="background:linear-gradient(135deg,#3b82f6,#8b5cf6)">📤 Compartir</button>
          </div>
        </article>`;
      }).join('');

      // Botones de "leer historia": abren la historia DIRECTAMENTE sin cerrar
      // el timeline. Al cerrar la historia se vuelve al timeline (no a home).
      line.querySelectorAll('[data-link]').forEach(btn => {
        btn.addEventListener('click', () => {
          const title = btn.dataset.link;
          console.log('[Timeline] Abrir historia:', title, '— API disponible:', !!window.PalabraVivaNinos?.openStory);
          if (window.PalabraVivaNinos?.openStory) {
            window.PalabraVivaNinos.openStory(title, { fromTimeline: true });
          } else {
            // Si el módulo de niños no cargó, esperar y reintentar 1 vez
            btn.textContent = '⏳ Cargando…';
            setTimeout(() => {
              if (window.PalabraVivaNinos?.openStory) {
                window.PalabraVivaNinos.openStory(title, { fromTimeline: true });
              } else {
                alert('No se pudo cargar el módulo de historias. Recargá la página (Ctrl+Shift+R).');
              }
              btn.textContent = '📖 Leer historia completa';
            }, 800);
          }
        });
      });

      // 🎧 Reproducir audio inline en el hito
      line.querySelectorAll('[data-play-audio]').forEach(btn => {
        btn.addEventListener('click', () => {
          const card = btn.closest('.pv-tl-item');
          const slot = card?.querySelector('.pv-tl-audio-slot');
          if (!slot) return;
          // Si ya está el player, toggle play/pause
          const existing = slot.querySelector('audio');
          if (existing) {
            existing.paused ? existing.play() : existing.pause();
            return;
          }
          // Pausar cualquier otro audio en el timeline
          line.querySelectorAll('audio').forEach(a => { try { a.pause(); } catch {} });
          // Crear nuevo player
          const url = slot.dataset.audio;
          slot.innerHTML = `
            <div style="background:linear-gradient(135deg,#fef3c7,#fde68a);border:1px solid #b45309;border-radius:14px;padding:10px;margin:8px 0">
              <div style="font-size:11px;font-weight:900;color:#92400e;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px">🎙️ Voz humana — Oceano Multimedia</div>
              <audio controls preload="metadata" style="width:100%" autoplay></audio>
              <div class="pv-tl-status" style="font-size:11px;color:#7c4a1e;text-align:center;margin-top:4px">⏳ Cargando…</div>
            </div>
          `;
          const audio = slot.querySelector('audio');
          const status = slot.querySelector('.pv-tl-status');
          audio.src = url;
          audio.addEventListener('loadedmetadata', () => {
            const d = Math.round(audio.duration || 0);
            status.textContent = `Duración: ${Math.floor(d/60)}:${String(d%60).padStart(2,'0')}`;
          });
          audio.addEventListener('playing', () => status.textContent = '🔴 Reproduciendo');
          audio.addEventListener('pause',   () => status.textContent = '⏸ Pausado');
          audio.addEventListener('ended',   () => status.textContent = '✓ Terminó');
          audio.addEventListener('error',   () => status.textContent = '⚠️ No se pudo cargar');
          btn.textContent = '⏸ Pausar audio';
          audio.addEventListener('pause', () => { btn.textContent = '▶ Reanudar audio'; });
          audio.addEventListener('playing', () => { btn.textContent = '⏸ Pausar audio'; });
        });
      });

      // Botones compartir hito
      line.querySelectorAll('[data-share-ev]').forEach(btn => {
        btn.addEventListener('click', async () => {
          const i = parseInt(btn.dataset.shareEv, 10);
          const ev = EVENTS[i];
          if (!ev) return;
          const text = `${ev.emoji} ${ev.title} (${ev.year})\n\n${ev.kid}\n\n📖 ${ev.ref}\n\n✝️ Palabra Viva — Línea del tiempo bíblica\n${location.origin}/`;
          try {
            if (navigator.share) await navigator.share({ title: ev.title, text, url: location.origin + '/' });
            else if (navigator.clipboard) { await navigator.clipboard.writeText(text); alert('📋 Copiado.'); }
          } catch {}
        });
      });
    }

    function closePanel(useHistory = true) {
      window.removeEventListener('popstate', onPop);
      panel.remove();
      if (useHistory && location.hash === '#timeline') {
        window._pvPanelClosing = true;
        history.back();
      }
    }
    // popstate solo cierra timeline si REALMENTE saliste de la página timeline
    // (no si abriste una sub-pantalla como #kids-detail y volviste a #timeline)
    function onPop() {
      if (location.hash === '#timeline') return; // sigo en timeline (volví de detail)
      window.removeEventListener('popstate', onPop);
      panel.remove();
    }

    panel.querySelector('[data-close]').onclick = () => closePanel(true);
    panel.querySelectorAll('.pv-tl-era-chip').forEach(b => {
      b.onclick = () => {
        activeEra = b.dataset.era;
        panel.querySelectorAll('.pv-tl-era-chip').forEach(c => c.classList.toggle('active', c.dataset.era === activeEra));
        render();
      };
    });

    document.body.appendChild(panel);
    window.addEventListener('popstate', onPop); // NO once: true — chequea hash adentro
    render();
  }

  // Card en home + integración con modo Niños
  function addHomeCard() {
    const title = document.querySelector('h1')?.textContent || '';
    if (!title.includes('Una palabra para hoy')) {
      document.querySelector('.pv-tl-home')?.remove();
      return;
    }
    if (document.querySelector('.pv-tl-home')) return;
    const anchor = document.querySelector('.pv-kids-home') || document.querySelector('.pv-ba-card') || document.querySelector('.hero');
    if (!anchor) return;
    const card = document.createElement('section');
    card.className = 'card pv-tl-home';
    card.innerHTML = `
      <p class="ref">Para niños · Educativo</p>
      <h3>Línea del tiempo bíblica</h3>
      <p class="soft">Recorré la historia desde la Creación hasta hoy. ${EVENTS.length} hitos con explicaciones simples.</p>
      <div class="row wrap"><button class="btn">Comenzar el recorrido</button></div>
    `;
    window.PVImages?.applyColorHero?.(card, '📜', 'gold');
    card.querySelector('button').onclick = openTimeline;
    anchor.insertAdjacentElement('afterend', card);
  }

  // Botón dentro del panel de Niños
  function addInsideKids() {
    const panel = document.querySelector('.pv-kids-panel');
    if (!panel) return;
    if (panel.querySelector('.pv-tl-inside-btn')) return;
    const today = panel.querySelector('.pv-kids-today');
    if (!today) return;
    const btn = document.createElement('button');
    btn.className = 'pv-tl-inside-btn';
    btn.style.cssText = 'border:0;border-radius:22px;padding:14px 18px;font-weight:900;font-size:15px;background:linear-gradient(135deg,#8b5cf6,#a855f7);color:white;cursor:pointer;display:flex;align-items:center;gap:8px;justify-content:center;margin-top:6px';
    btn.innerHTML = '📜 Ver línea del tiempo bíblica →';
    btn.onclick = openTimeline;
    today.insertAdjacentElement('afterend', btn);
  }

  function boot() { injectStyles(); addHomeCard(); addInsideKids(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('load', boot);
  setInterval(boot, 2500);

  window.PVTimeline = { open: openTimeline };
})();

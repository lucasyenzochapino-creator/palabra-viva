(() => {
  // ===========================================================================
  // PALABRA VIVA — Versiones de la Biblia (info + links externos)
  // ===========================================================================
  // Como YouVersion: tabla comparativa de versiones en español + abrir el
  // capítulo actual en otras versiones (BibleGateway/YouVersion).
  // Solo RV1909 está en la app (dominio público); el resto se abre online.

  const VERSIONS = [
    {
      code:'RV1909', name:'Reina-Valera 1909',
      year:'1909', type:'Equivalencia formal',
      level:'Avanzado',
      style:'Vocabulario clásico, fiel al texto original.',
      desc:'La versión que viene en la app. Castellano antiguo, muy literal. Conserva el vosotros y construcciones del siglo XIX. Ideal para estudio profundo y comparación con otras versiones.',
      good:'Estudio, memorización, oración litúrgica.',
      avoid:'No recomendado para lectura rápida de niños o nuevos creyentes.',
      free:true,
      external:null
    },
    {
      code:'RVR1960', name:'Reina-Valera 1960',
      year:'1960', type:'Equivalencia formal',
      level:'Intermedio',
      style:'Revisión moderada del clásico RV. La más usada en iglesias evangélicas hispanas.',
      desc:'Actualización del castellano de la RV1909. Mantiene la fidelidad al texto griego/hebreo y la dignidad del lenguaje, pero reemplaza palabras arcaicas. Es la versión más memorizada en Latinoamérica.',
      good:'Lectura devocional, predicación, memorización.',
      avoid:'Algunos términos aún suenan formales para niños.',
      free:false,
      external:'https://www.biblegateway.com/passage/?search={REF}&version=RVR1960'
    },
    {
      code:'NVI', name:'Nueva Versión Internacional',
      year:'1999', type:'Equivalencia dinámica',
      level:'Fácil',
      style:'Moderna, fluida y precisa. Pensada para todos.',
      desc:'Traducción contemporánea hecha por más de 100 eruditos hispanohablantes. Lenguaje natural y claro sin sacrificar fidelidad. Es la versión moderna más usada en grupos jóvenes.',
      good:'Lectura diaria, jóvenes, estudio en grupo.',
      avoid:'Algunos pasajes pierden poesía hebrea original.',
      free:false,
      external:'https://www.biblegateway.com/passage/?search={REF}&version=NVI'
    },
    {
      code:'NTV', name:'Nueva Traducción Viviente',
      year:'2010', type:'Equivalencia dinámica',
      level:'Muy fácil',
      style:'Como te hablaría hoy un amigo. Muy clara.',
      desc:'Traducción del hebreo, arameo y griego directamente al castellano cotidiano. No es paráfrasis sino traducción precisa con lenguaje natural. Excelente puerta de entrada.',
      good:'Personas que recién empiezan a leer la Biblia, niños grandes, lectura familiar.',
      avoid:'Estudio académico exhaustivo (preferir RVR60 o NVI).',
      free:false,
      external:'https://www.biblegateway.com/passage/?search={REF}&version=NTV'
    },
    {
      code:'DHH', name:'Dios Habla Hoy (Versión Popular)',
      year:'1979', type:'Equivalencia dinámica',
      level:'Muy fácil',
      style:'Lenguaje sencillo de uso diario.',
      desc:'Traducción para alcanzar a personas de toda edad y nivel educativo. Sociedades Bíblicas Unidas. Muy clara aunque a veces simplifica conceptos teológicos.',
      good:'Primera lectura, evangelismo, niños.',
      avoid:'Estudio teológico profundo.',
      free:false,
      external:'https://www.biblegateway.com/passage/?search={REF}&version=DHH'
    },
    {
      code:'TLA', name:'Traducción en Lenguaje Actual',
      year:'2003', type:'Equivalencia dinámica',
      level:'Muy fácil',
      style:'Súper sencilla, frases cortas.',
      desc:'Especialmente diseñada para niños y para quienes el español no es su lengua materna. Sociedades Bíblicas Unidas. Frases simples, vocabulario reducido.',
      good:'Niños 8-12 años, alfabetización bíblica.',
      avoid:'Lectura adulta profunda.',
      free:false,
      external:'https://www.biblegateway.com/passage/?search={REF}&version=TLA'
    },
    {
      code:'NBLA', name:'Nueva Biblia de las Américas',
      year:'2005', type:'Equivalencia formal',
      level:'Avanzado',
      style:'Muy precisa, fiel al texto crítico.',
      desc:'Conocida también como LBLA. Traducción literal moderna del hebreo y griego. Una de las más usadas para estudio bíblico serio en español.',
      good:'Estudio profundo, exégesis, predicación seria.',
      avoid:'Lectura rápida de niños.',
      free:false,
      external:'https://www.biblegateway.com/passage/?search={REF}&version=NBLA'
    }
  ];

  function injectStyles() {
    if (document.getElementById('pv-vers-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-vers-style';
    st.textContent = `
      .pv-vers-panel{position:fixed;inset:0;z-index:1000008;background:var(--bg);color:var(--text);overflow-y:auto;padding:14px 14px calc(100px + env(safe-area-inset-bottom))}
      .pv-vers-inner{max-width:780px;margin:0 auto;display:flex;flex-direction:column;gap:14px}
      .pv-vers-head{display:flex;justify-content:space-between;gap:10px;position:sticky;top:0;background:var(--bg);padding:8px 0 14px;z-index:5;border-bottom:1px solid var(--line)}
      .pv-vers-head h1{margin:4px 0;font-size:clamp(22px,6vw,28px);letter-spacing:-.02em}
      .pv-vers-head p{font-size:13px;color:var(--muted);margin:0}
      .pv-vers-close{border:1px solid var(--line);background:var(--card);color:var(--text);border-radius:999px;padding:9px 14px;font-weight:600;cursor:pointer;height:fit-content}
      .pv-vers-intro{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px;font-size:14px;color:var(--text);line-height:1.55}
      .pv-vers-card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px;display:flex;flex-direction:column;gap:8px}
      .pv-vers-card.active{border-color:var(--brand);background:linear-gradient(135deg,rgba(107,31,31,.06),var(--card))}
      .pv-vers-card h3{margin:0;font-size:22px;color:var(--brand);letter-spacing:-.01em}
      .pv-vers-card .code{font-family:var(--font-sans);font-size:11px;font-weight:700;letter-spacing:.18em;color:var(--accent);text-transform:uppercase;margin:0}
      .pv-vers-card .meta{display:flex;gap:8px;flex-wrap:wrap;font-size:11px;font-family:var(--font-sans);font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin:2px 0}
      .pv-vers-card .meta span{background:var(--card2);padding:3px 9px;border-radius:999px}
      .pv-vers-card .style{font-style:italic;color:var(--muted);font-family:var(--font-serif);font-size:16px;margin:0}
      .pv-vers-card .desc{margin:6px 0 0;font-size:15px;line-height:1.55;color:var(--text)}
      .pv-vers-pros{background:rgba(90,111,72,.10);border-left:3px solid var(--good);padding:8px 12px;border-radius:8px;font-size:13px}
      .pv-vers-cons{background:rgba(154,58,58,.06);border-left:3px solid var(--danger);padding:8px 12px;border-radius:8px;font-size:13px}
      .pv-vers-pros strong{color:var(--good)}
      .pv-vers-cons strong{color:var(--danger)}
      .pv-vers-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:6px}
      .pv-vers-btn{border:0;background:var(--brand);color:#fbf3df;border-radius:999px;padding:9px 16px;font-weight:600;cursor:pointer;font-size:13px;text-decoration:none;display:inline-flex;align-items:center;gap:6px;font-family:var(--font-sans)}
      .pv-vers-btn.ghost{background:transparent;border:1px solid var(--line);color:var(--text)}
      .pv-vers-tag{display:inline-block;font-size:10px;font-weight:700;padding:3px 8px;border-radius:999px;letter-spacing:.06em;text-transform:uppercase;font-family:var(--font-sans)}
      .pv-vers-tag.free{background:rgba(90,111,72,.20);color:var(--good)}
      .pv-vers-tag.online{background:rgba(164,119,49,.20);color:var(--accent)}
      .pv-vers-home{border-color:var(--accent)!important;background:linear-gradient(135deg,rgba(164,119,49,.08),var(--card))!important}
    `;
    document.head.appendChild(st);
  }

  function getCurrentRef() {
    // Lee de los selects de la pestaña Biblia el libro+cap actual
    try {
      const sels = document.querySelectorAll('.fieldLabel select.select');
      if (sels.length >= 2) {
        const book = sels[0].value;
        const ch = parseInt(sels[1].value, 10) || 1;
        return `${book} ${ch}`;
      }
    } catch {}
    return 'Juan 3';
  }

  function open() {
    if (document.querySelector('.pv-vers-panel')) return;
    injectStyles();
    history.pushState({ pvVers: true }, '', location.href.split('#')[0] + '#versiones');

    const currentRef = getCurrentRef();

    const panel = document.createElement('section');
    panel.className = 'pv-vers-panel';
    panel.setAttribute('aria-label', 'Versiones de la Biblia');

    panel.innerHTML = `
      <div class="pv-vers-inner">
        <div class="pv-vers-head">
          <div>
            <p>Conocé las traducciones</p>
            <h1>📚 Versiones de la Biblia</h1>
          </div>
          <button class="pv-vers-close" data-close>Cerrar ✕</button>
        </div>
        <div class="pv-vers-intro">
          <strong>¿Por qué hay tantas?</strong> Cada versión equilibra de forma distinta dos objetivos: la <em>fidelidad al texto original</em> (hebreo/griego) y la <em>claridad en español</em>. Las más literales son fieles pero suenan formales; las dinámicas usan español natural pero pueden simplificar matices teológicos. Ninguna es "mejor" — son herramientas distintas para distintos momentos.
        </div>
        ${VERSIONS.map(v => `
          <article class="pv-vers-card ${v.code==='RV1909'?'active':''}">
            <p class="code">${v.code} · ${v.year}</p>
            <h3>${v.name}</h3>
            <div class="meta">
              <span>${v.type}</span>
              <span>${v.level}</span>
              ${v.free ? '<span class="pv-vers-tag free">✓ En la app</span>' : '<span class="pv-vers-tag online">Abre online</span>'}
            </div>
            <p class="style">"${v.style}"</p>
            <p class="desc">${v.desc}</p>
            <div class="pv-vers-pros"><strong>Ideal para:</strong> ${v.good}</div>
            <div class="pv-vers-cons"><strong>No tanto:</strong> ${v.avoid}</div>
            <div class="pv-vers-actions">
              ${v.free
                ? `<button class="pv-vers-btn" data-go-biblia>📖 Leer en la app</button>`
                : `<a class="pv-vers-btn" href="${v.external.replace('{REF}', encodeURIComponent(currentRef))}" target="_blank" rel="noopener noreferrer">🌐 Abrir ${v.code} en BibleGateway</a>`}
            </div>
          </article>
        `).join('')}
        <p style="font-size:12px;color:var(--muted);text-align:center;margin:14px 0 0">
          Las versiones modernas están protegidas por derechos de autor y no se pueden incluir gratis en la app. Las abrimos en <strong>BibleGateway</strong> que tiene licencia para mostrarlas online.
        </p>
      </div>
    `;

    function close(useHistory = true) {
      window.removeEventListener('popstate', onPop);
      panel.remove();
      if (useHistory && location.hash === '#versiones') {
        window._pvPanelClosing = true;
        history.back();
      }
    }
    function onPop() {
      if (location.hash === '#versiones') return;
      window.removeEventListener('popstate', onPop);
      panel.remove();
    }
    panel.querySelector('[data-close]').onclick = () => close(true);
    panel.querySelectorAll('[data-go-biblia]').forEach(b => b.onclick = () => {
      close(false);
      // Disparar cambio de tab a Biblia (con query param)
      const url = location.pathname + '?go=biblia';
      location.href = url;
    });
    document.body.appendChild(panel);
    window.addEventListener('popstate', onPop);
  }

  function addHomeCard() {
    const title = document.querySelector('h1')?.textContent || '';
    if (!title.includes('Una palabra para hoy')) {
      document.querySelector('.pv-vers-home')?.remove();
      return;
    }
    if (document.querySelector('.pv-vers-home')) return;
    const anchor = document.querySelector('.pv-pers-home') || document.querySelector('.pv-cal-home') || document.querySelector('.pv-igl-home') || document.querySelector('.hero');
    if (!anchor) return;
    const card = document.createElement('section');
    card.className = 'card pv-vers-home';
    card.innerHTML = `
      <p class="ref">Conocé las traducciones</p>
      <h3>Versiones de la Biblia</h3>
      <p class="soft">¿RVR60? ¿NVI? ¿NTV? Comparativa simple de las ${VERSIONS.length} versiones más usadas en español.</p>
      <div class="row wrap"><button class="btn">Ver comparativa</button></div>
    `;
    window.PVImages?.applyHero?.(card, 'bible_stack');
    card.querySelector('button').onclick = open;
    anchor.insertAdjacentElement('afterend', card);
  }

  function boot() { injectStyles(); addHomeCard(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('load', boot);
  setInterval(boot, 3000);

  window.PVVersiones = { open };
})();

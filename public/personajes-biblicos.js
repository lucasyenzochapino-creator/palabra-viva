(() => {
  // ===========================================================================
  // PALABRA VIVA — Personajes Bíblicos
  // ===========================================================================
  // Biografías cortas de personajes clave de la Biblia para todas las edades.
  // Diseñado para ser práctico: cada personaje tiene vida, fe, lección, ref.

  const CHARACTERS = [
    { c:'ot', emoji:'🌍', name:'Adán', life:'El primer hombre',
      who:'Creado por Dios a su imagen. Padre de toda la humanidad.',
      story:'Dios lo formó del polvo y le dio aliento de vida. Le encomendó cuidar la creación y le dio una compañera, Eva. Eligió desobedecer y trajo el pecado al mundo, pero Dios prometió un Salvador.',
      lesson:'Las decisiones tienen consecuencias, pero Dios siempre ofrece un camino de regreso.',
      ref:'Génesis 1-3' },
    { c:'ot', emoji:'🚢', name:'Noé', life:'Hace ~4000 años',
      who:'Hombre justo en una generación corrompida.',
      story:'Construyó un arca obedeciendo a Dios cuando llovió por primera vez. Salvó a su familia y a las especies animales. Dios hizo un pacto con un arcoiris.',
      lesson:'Obedecer a Dios aunque nadie más entienda lo que hacés.',
      ref:'Génesis 6-9' },
    { c:'ot', emoji:'⭐', name:'Abraham', life:'~2000 a.C.',
      who:'Padre de la fe. Iniciador del pueblo de Israel.',
      story:'Dejó su tierra a los 75 años para ir donde Dios le dijera. Recibió la promesa de una descendencia tan numerosa como las estrellas. Tuvo a Isaac en su vejez.',
      lesson:'La fe es confiar antes de ver. Dios cumple aunque tarde.',
      ref:'Génesis 12-25' },
    { c:'ot', emoji:'😊', name:'Sara', life:'~2000 a.C.',
      who:'Esposa de Abraham. Madre de las naciones.',
      story:'Estéril hasta los 90 años. Se rió cuando Dios le anunció un hijo, pero Isaac significa "risa". Dios cumplió lo imposible.',
      lesson:'Nunca es tarde para que Dios obre.',
      ref:'Génesis 18, 21' },
    { c:'ot', emoji:'👔', name:'José', life:'~1900 a.C.',
      who:'Soñador, traicionado, restaurado.',
      story:'Sus hermanos lo vendieron como esclavo. Fue a prisión injustamente. Dios lo levantó hasta ser segundo en Egipto y salvar a millones del hambre — incluida su familia.',
      lesson:'Lo que el mal pensó para daño, Dios lo usa para bien.',
      ref:'Génesis 37-50' },
    { c:'ot', emoji:'🧺', name:'Moisés', life:'~1450 a.C.',
      who:'Profeta libertador. Le dio la Ley a Israel.',
      story:'Salvado del Nilo. Educado en Egipto. Llamado en la zarza ardiente. Liberó a Israel de la esclavitud, abrió el mar Rojo, recibió los 10 mandamientos.',
      lesson:'Dios usa a los que se sienten incapaces. "¿Quién soy yo?" — "Yo estaré contigo".',
      ref:'Éxodo 2 - Deuteronomio 34' },
    { c:'ot', emoji:'🛡️', name:'Josué', life:'~1400 a.C.',
      who:'Sucesor de Moisés. Conquistador de Canaán.',
      story:'Cruzó el Jordán con el pueblo. Las murallas de Jericó cayeron tras 7 vueltas. Conquistó la tierra prometida.',
      lesson:'Esforzate y sé valiente — Dios va contigo a todo lugar.',
      ref:'Josué 1-24' },
    { c:'ot', emoji:'💪', name:'Sansón', life:'~1100 a.C.',
      who:'Juez fuerte, pero débil de carácter.',
      story:'Dotado por Dios con fuerza sobrenatural. Cayó en la trampa de Dalila. Al final, ciego y humillado, oró una última vez y derrotó a los filisteos al morir.',
      lesson:'La fuerza física no vale sin sabiduría espiritual.',
      ref:'Jueces 13-16' },
    { c:'ot', emoji:'🌾', name:'Rut', life:'~1100 a.C.',
      who:'Mujer moabita, bisabuela del rey David.',
      story:'Viuda joven que eligió quedarse con su suegra Noemí. "Tu pueblo será mi pueblo, tu Dios mi Dios". Dios la incluyó en la línea de Jesús.',
      lesson:'Las decisiones de lealtad y fe trascienden generaciones.',
      ref:'Rut 1-4' },
    { c:'ot', emoji:'⚔️', name:'David', life:'~1000 a.C.',
      who:'Pastor, músico, rey. "Varón conforme al corazón de Dios".',
      story:'Ungido rey siendo joven. Mató a Goliat con una honda. Fue perseguido por Saúl. Reinó 40 años. Cometió graves pecados pero se arrepintió de corazón. Escribió muchos salmos.',
      lesson:'Lo importante no es no caer, sino volver siempre a Dios.',
      ref:'1 Samuel 16 - 1 Reyes 2' },
    { c:'ot', emoji:'👑', name:'Salomón', life:'~970 a.C.',
      who:'El hijo de David. El rey más sabio del mundo antiguo.',
      story:'Pidió sabiduría en vez de riquezas. Construyó el Templo. Escribió Proverbios y Eclesiastés. En su vejez se desvió y permitió la idolatría.',
      lesson:'La sabiduría sin obediencia constante no protege el corazón.',
      ref:'1 Reyes 1-11' },
    { c:'ot', emoji:'🔥', name:'Elías', life:'~870 a.C.',
      who:'Profeta poderoso del reino del norte.',
      story:'Desafió al rey Acab y a los profetas de Baal. Bajó fuego del cielo. Fue alimentado por cuervos. Fue llevado al cielo en un carro de fuego.',
      lesson:'Un solo hombre en pie con Dios vale más que cientos sin Él.',
      ref:'1 Reyes 17 - 2 Reyes 2' },
    { c:'ot', emoji:'👸', name:'Ester', life:'~480 a.C.',
      who:'Reina judía en el imperio persa.',
      story:'Se convirtió en reina sin que nadie supiera que era judía. Arriesgó su vida para salvar a su pueblo del genocidio. "Si perezco, que perezca".',
      lesson:'Quizá estás donde estás para un momento como este.',
      ref:'Ester 1-10' },
    { c:'ot', emoji:'🦁', name:'Daniel', life:'~600 a.C.',
      who:'Profeta cautivo en Babilonia.',
      story:'Se negó a la comida del rey. Interpretó sueños. Sobrevivió al foso de los leones por su fe. Profetizó imperios y la venida del Mesías.',
      lesson:'La integridad bajo presión revela la verdadera fe.',
      ref:'Daniel 1-12' },
    { c:'ot', emoji:'🐳', name:'Jonás', life:'~750 a.C.',
      who:'Profeta que huyó del llamado.',
      story:'Dios lo mandó a Nínive y huyó por mar. Un pez gigante lo tragó 3 días. Oró desde adentro, fue expulsado vivo y predicó. Toda Nínive se arrepintió.',
      lesson:'La gracia de Dios es mayor que tus huidas.',
      ref:'Jonás 1-4' },
    { c:'nt', emoji:'✨', name:'María', life:'~Año 0',
      who:'Madre de Jesús. Joven judía elegida por Dios.',
      story:'El ángel Gabriel le anunció que sería madre del Salvador. Aceptó con humildad. Acompañó a Jesús desde el pesebre hasta la cruz.',
      lesson:'"Hágase en mí según tu palabra" — la mejor oración.',
      ref:'Lucas 1-2, Juan 19' },
    { c:'nt', emoji:'🔨', name:'José (esposo de María)', life:'~Año 0',
      who:'Carpintero. Padre adoptivo de Jesús.',
      story:'Hombre justo. Confió en el sueño donde Dios le explicó el embarazo de María. Llevó a la familia a Egipto huyendo de Herodes. Crió a Jesús como hijo.',
      lesson:'La fidelidad silenciosa también es servicio a Dios.',
      ref:'Mateo 1-2' },
    { c:'nt', emoji:'💧', name:'Juan el Bautista', life:'~Año 30',
      who:'Profeta del desierto. Primo de Jesús.',
      story:'Predicó arrepentimiento y bautizó multitudes. Bautizó a Jesús. Fue decapitado por denunciar al rey Herodes. Jesús dijo que era el mayor de los nacidos.',
      lesson:'"Es necesario que él crezca y yo mengüe".',
      ref:'Mateo 3, Marcos 6' },
    { c:'nt', emoji:'🎣', name:'Pedro', life:'~Año 30-60',
      who:'Pescador. Apóstol. Roca de la Iglesia.',
      story:'Dejó las redes para seguir a Jesús. Caminó sobre el agua. Negó a Jesús 3 veces y lloró. Restaurado, predicó en Pentecostés y guió la Iglesia primitiva.',
      lesson:'No importa cuántas veces falles — lo que importa es volver.',
      ref:'Mateo 4 - 1 Pedro 5' },
    { c:'nt', emoji:'❤️', name:'Juan (apóstol)', life:'~Año 30-95',
      who:'"El discípulo amado". El más joven.',
      story:'Estuvo con Jesús desde el primer día. Único apóstol al pie de la cruz. Cuidó de María. Escribió el Evangelio de Juan, 3 cartas y el Apocalipsis.',
      lesson:'Mantenerse cerca de Jesús transforma para siempre.',
      ref:'Juan, 1-3 Juan, Apocalipsis' },
    { c:'nt', emoji:'✉️', name:'Pablo', life:'~Año 30-65',
      who:'Saulo el perseguidor → Pablo el apóstol.',
      story:'Perseguía cristianos. Jesús se le apareció camino a Damasco. Quedó ciego 3 días. Se convirtió y se transformó en el mayor misionero del cristianismo. Escribió 13 cartas del Nuevo Testamento.',
      lesson:'Nadie está demasiado lejos para que Dios lo cambie.',
      ref:'Hechos 9 - cartas paulinas' },
    { c:'nt', emoji:'👩', name:'María Magdalena', life:'~Año 30',
      who:'Discípula liberada por Jesús. Primera testigo de la resurrección.',
      story:'Jesús sacó 7 demonios de ella. Lo siguió fielmente. Estuvo en la cruz cuando casi todos huyeron. Fue la primera en ver a Jesús resucitado y avisar a los apóstoles.',
      lesson:'Las personas más rotas pueden volverse las más valientes.',
      ref:'Lucas 8, Juan 20' },
    { c:'nt', emoji:'🙏', name:'Esteban', life:'~Año 34',
      who:'Primer mártir cristiano.',
      story:'Lleno del Espíritu Santo. Predicó valientemente ante el Sanedrín. Fue apedreado mientras oraba "Señor, no les tomes en cuenta este pecado". Su muerte impactó al joven Saulo (Pablo).',
      lesson:'Perdonar mientras nos hieren es el camino más alto.',
      ref:'Hechos 6-7' },
    { c:'nt', emoji:'✝️', name:'Jesús', life:'Año 0 - eternidad',
      who:'Hijo de Dios. Salvador del mundo.',
      story:'Nació en Belén. Vivió 30 años escondido. Predicó 3 años. Sanó, enseñó, perdonó. Murió en la cruz por nuestros pecados. Resucitó al tercer día. Vive y volverá.',
      lesson:'Todo se trata de Él.',
      ref:'Los 4 evangelios', highlight:true }
  ];

  const CATS = [
    ['todos', '📖', 'Todos'],
    ['ot',    '🕊️', 'Antiguo Testamento'],
    ['nt',    '✨', 'Nuevo Testamento']
  ];

  function injectStyles() {
    if (document.getElementById('pv-pers-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-pers-style';
    st.textContent = `
      .pv-pers-panel{position:fixed;inset:0;z-index:1000006;background:var(--bg,#1a0e05);color:var(--text,#f5deb3);overflow-y:auto;padding:14px 14px calc(140px + env(safe-area-inset-bottom))}
      .pv-pers-inner{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:14px}
      .pv-pers-head{display:grid;grid-template-columns:1fr auto;gap:10px;position:sticky;top:0;background:var(--bg,#1a0e05);padding:8px 0 14px;z-index:5;border-bottom:1px solid var(--line,#333447)}
      .pv-pers-head h1{font-size:clamp(22px,6vw,28px);margin:4px 0;letter-spacing:-.02em}
      .pv-pers-head p{font-size:13px;color:var(--muted,#c8c5d8);margin:0}
      .pv-pers-close{border:1px solid var(--line,#333447);background:var(--card2,#202031);color:var(--text,#f8fafc);border-radius:999px;padding:9px 14px;font-weight:900;cursor:pointer;height:fit-content}
      .pv-pers-cats{display:flex;gap:6px;overflow-x:auto;padding:4px 0 8px;scrollbar-width:none}
      .pv-pers-cats::-webkit-scrollbar{display:none}
      .pv-pers-cat{flex:0 0 auto;border:1px solid var(--line,#333447);background:var(--card2,#202031);color:var(--text,#f8fafc);border-radius:999px;padding:8px 14px;font-weight:900;font-size:13px;cursor:pointer}
      .pv-pers-cat.on{background:linear-gradient(135deg,#7c4a1e,#b45309);border-color:transparent;color:#fff}
      .pv-pers-grid{display:grid;grid-template-columns:1fr;gap:10px}
      @media(min-width:600px){.pv-pers-grid{grid-template-columns:1fr 1fr}}
      .pv-pers-card{background:var(--card,#171722);border:1px solid var(--line,#333447);border-radius:18px;padding:14px;cursor:pointer;transition:transform .15s,border-color .15s}
      .pv-pers-card:hover{transform:translateY(-2px);border-color:var(--brand,#f59e0b)}
      .pv-pers-card.highlight{background:linear-gradient(135deg,rgba(245,158,11,.12),var(--card,#171722));border-color:rgba(245,158,11,.4)}
      .pv-pers-card .emoji{font-size:36px;line-height:1}
      .pv-pers-card h3{margin:8px 0 4px;font-size:18px;letter-spacing:-.01em}
      .pv-pers-card .life{font-size:11px;color:var(--brand,#f59e0b);font-weight:900;text-transform:uppercase;letter-spacing:.06em;margin:0}
      .pv-pers-card .who{margin:6px 0 0;font-size:13px;color:var(--muted,#c8c5d8);line-height:1.4}
      /* Detail */
      .pv-pers-detail{position:fixed;inset:0;z-index:1000007;background:var(--bg,#1a0e05);color:var(--text,#f5deb3);overflow-y:auto;padding:14px 14px calc(60px + env(safe-area-inset-bottom))}
      .pv-pers-detail-inner{max-width:680px;margin:0 auto;display:flex;flex-direction:column;gap:14px}
      .pv-pers-detail-head{display:flex;justify-content:space-between;gap:10px}
      .pv-pers-detail .big-emoji{font-size:88px;text-align:center;margin:0}
      .pv-pers-detail h1{text-align:center;font-size:28px;margin:4px 0;letter-spacing:-.02em}
      .pv-pers-detail .life{text-align:center;color:var(--brand,#f59e0b);font-weight:900;font-size:13px;text-transform:uppercase;letter-spacing:.06em;margin:0}
      .pv-pers-section{background:var(--card,#171722);border:1px solid var(--line,#333447);border-radius:16px;padding:14px}
      .pv-pers-section .label{font-size:12px;font-weight:900;color:var(--brand,#f59e0b);text-transform:uppercase;letter-spacing:.08em;margin:0 0 6px}
      .pv-pers-section p{margin:0;font-size:15px;line-height:1.55}
      .pv-pers-lesson{background:linear-gradient(135deg,rgba(34,197,94,.12),var(--card,#171722));border-color:rgba(34,197,94,.4)}
      .pv-pers-lesson .label{color:#22c55e}
      .pv-pers-share{background:linear-gradient(135deg,#7c4a1e,#b45309);color:#fff;border:0;border-radius:999px;padding:14px 18px;font-weight:900;font-size:15px;cursor:pointer;min-height:50px;display:flex;align-items:center;justify-content:center;gap:8px}
      .pv-pers-home{border-color:rgba(245,158,11,.45)!important;background:linear-gradient(135deg,rgba(245,158,11,.08),var(--card))!important}
    `;
    document.head.appendChild(st);
  }

  function open() {
    if (document.querySelector('.pv-pers-panel')) return;
    injectStyles();
    history.pushState({ pvPers: true }, '', location.href.split('#')[0] + '#personajes');

    let cat = 'todos';
    const panel = document.createElement('section');
    panel.className = 'pv-pers-panel';
    panel.setAttribute('aria-label', 'Personajes bíblicos');

    panel.innerHTML = `
      <div class="pv-pers-inner">
        <div class="pv-pers-head">
          <div>
            <p>Vidas y lecciones</p>
            <h1>📖 Personajes bíblicos</h1>
          </div>
          <button class="pv-pers-close" data-close>Cerrar ✕</button>
        </div>
        <div class="pv-pers-cats" id="pv-pers-cats"></div>
        <div class="pv-pers-grid" id="pv-pers-grid"></div>
      </div>`;

    function render() {
      const cats = panel.querySelector('#pv-pers-cats');
      cats.innerHTML = CATS.map(c => `<button class="pv-pers-cat ${c[0]===cat?'on':''}" data-cat="${c[0]}">${c[1]} ${c[2]}</button>`).join('');
      cats.querySelectorAll('[data-cat]').forEach(b => b.onclick = () => { cat = b.dataset.cat; render(); });

      const grid = panel.querySelector('#pv-pers-grid');
      const list = cat === 'todos' ? CHARACTERS : CHARACTERS.filter(c => c.c === cat);
      grid.innerHTML = list.map((p, i) => `
        <article class="pv-pers-card ${p.highlight?'highlight':''}" data-i="${CHARACTERS.indexOf(p)}">
          <div class="emoji">${p.emoji}</div>
          <p class="life">${p.life}</p>
          <h3>${p.name}</h3>
          <p class="who">${p.who}</p>
        </article>`).join('');
      grid.querySelectorAll('[data-i]').forEach(c => c.onclick = () => openDetail(CHARACTERS[parseInt(c.dataset.i, 10)]));
    }

    function close(useHistory = true) {
      window.removeEventListener('popstate', onPop);
      panel.remove();
      if (useHistory && location.hash === '#personajes') {
        window._pvPanelClosing = true;
        history.back();
      }
    }
    function onPop() {
      if (location.hash === '#personajes') return;
      window.removeEventListener('popstate', onPop);
      panel.remove();
    }
    panel.querySelector('[data-close]').onclick = () => close(true);
    document.body.appendChild(panel);
    window.addEventListener('popstate', onPop);
    render();
  }

  function openDetail(p) {
    document.querySelector('.pv-pers-detail')?.remove();
    history.pushState({ pvPersDetail: true }, '', location.href.split('#')[0] + '#personaje');

    const d = document.createElement('section');
    d.className = 'pv-pers-detail';
    d.innerHTML = `
      <div class="pv-pers-detail-inner">
        <div class="pv-pers-detail-head">
          <button class="pv-pers-close" data-back>← Volver</button>
          <button class="pv-pers-close" data-close>Cerrar</button>
        </div>
        <div class="big-emoji">${p.emoji}</div>
        <p class="life">${p.life}</p>
        <h1>${p.name}</h1>
        <div class="pv-pers-section"><p class="label">Quién era</p><p>${p.who}</p></div>
        <div class="pv-pers-section"><p class="label">Su historia</p><p>${p.story}</p></div>
        <div class="pv-pers-section pv-pers-lesson"><p class="label">✨ Lección</p><p>${p.lesson}</p></div>
        <div class="pv-pers-section"><p class="label">📖 Lee más</p><p>${p.ref}</p></div>
        <button class="pv-pers-share" data-share>📤 Compartir este personaje</button>
      </div>`;

    function close(useHistory = true) {
      window.removeEventListener('popstate', onPopDet);
      d.remove();
      if (useHistory && location.hash === '#personaje') {
        window._pvPanelClosing = true;
        history.back();
      }
    }
    function onPopDet() {
      if (location.hash === '#personaje') return;
      window.removeEventListener('popstate', onPopDet);
      d.remove();
    }
    d.querySelector('[data-back]').onclick = () => close(true);
    d.querySelector('[data-close]').onclick = () => { close(false); document.querySelector('.pv-pers-panel')?.remove(); window._pvPanelClosing = true; history.go(-2); };
    d.querySelector('[data-share]').onclick = async () => {
      const text = `${p.emoji} ${p.name} — ${p.life}\n\n${p.story}\n\n✨ Lección: ${p.lesson}\n\n📖 ${p.ref}\n\nVisto en Palabra Viva — ${location.origin}/`;
      try {
        if (navigator.share) await navigator.share({ title: p.name, text, url: location.origin + '/' });
        else if (navigator.clipboard) { await navigator.clipboard.writeText(text); alert('📋 Copiado.'); }
      } catch {}
    };
    document.body.appendChild(d);
    window.addEventListener('popstate', onPopDet);
  }

  function addHomeCard() {
    const title = document.querySelector('h1')?.textContent || '';
    if (!title.includes('Una palabra para hoy')) {
      document.querySelector('.pv-pers-home')?.remove();
      return;
    }
    if (document.querySelector('.pv-pers-home')) return;
    const anchor = document.querySelector('.pv-cal-home') || document.querySelector('.pv-igl-home') || document.querySelector('.pv-tl-home') || document.querySelector('.pv-kids-home') || document.querySelector('.hero');
    if (!anchor) return;
    const card = document.createElement('section');
    card.className = 'card pv-pers-home';
    card.innerHTML = `
      <p class="ref">Educativo</p>
      <h3>Personajes bíblicos</h3>
      <p class="soft">${CHARACTERS.length} biografías cortas con historia, lección y referencia. De Adán a Pablo.</p>
      <div class="row wrap"><button class="btn">Conocer personajes</button></div>
    `;
    window.PVImages?.applyHero?.(card, 'stained_glass');
    card.querySelector('button').onclick = open;
    anchor.insertAdjacentElement('afterend', card);
  }

  function boot() { injectStyles(); addHomeCard(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('load', boot);
  setInterval(boot, 3000);

  window.PVPersonajes = { open, openDetail };
})();

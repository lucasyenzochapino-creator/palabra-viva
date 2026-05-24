(() => {
  const QUESTIONS = [
    {
      group: 'Dios',
      title: '¿Quién es Dios?',
      short: 'Desde la fe cristiana, Dios es el Creador, eterno, santo, justo, amoroso y cercano. No es una energía impersonal: es alguien que conoce, ama, llama y guía.',
      verse: ['Génesis 1:1', 'En el principio crió Dios los cielos y la tierra.'],
      read: ['Génesis 1', 'Salmos 23', 'Juan 14']
    },
    {
      group: 'Dios',
      title: '¿Dios existe?',
      short: 'La fe cristiana no presenta a Dios como una idea inventada para sentirse mejor, sino como el fundamento de la vida, el orden, la moral, la conciencia, el amor y la existencia misma. No todo se demuestra como una fórmula matemática, pero hay razones profundas para creer.',
      verse: ['Romanos 1:20', 'Porque las cosas invisibles de él, su eterna potencia y divinidad, se echan de ver desde la creación del mundo.'],
      read: ['Salmos 19', 'Romanos 1', 'Hebreos 11']
    },
    {
      group: 'Dios',
      title: '¿Qué nos muestra que Dios existe?',
      short: 'Algunos caminos clásicos son: el origen del universo, el orden de la creación, la conciencia moral, el deseo humano de eternidad, la experiencia espiritual, la historia de Israel, la vida de Jesús y el testimonio de personas transformadas.',
      verse: ['Salmos 19:1', 'Los cielos cuentan la gloria de Dios, y la expansión denuncia la obra de sus manos.'],
      read: ['Salmos 19', 'Romanos 1', 'Juan 1']
    },
    {
      group: 'Jesús',
      title: '¿Quién es Jesucristo?',
      short: 'Jesús no es solo un maestro moral. La fe cristiana afirma que es el Hijo de Dios, hecho hombre, enviado para revelar al Padre, salvar, perdonar y abrir el camino hacia Dios.',
      verse: ['Juan 14:6', 'Jesús le dice: Yo soy el camino, y la verdad, y la vida.'],
      read: ['Juan 1', 'Juan 3', 'Juan 14']
    },
    {
      group: 'Jesús',
      title: '¿Jesús existió realmente?',
      short: 'La existencia histórica de Jesús es ampliamente aceptada por historiadores. La discusión principal no es si existió, sino quién fue realmente: solo maestro, profeta, o el Cristo anunciado por la fe cristiana.',
      verse: ['Lucas 1:3', 'Me ha parecido también á mí, después de haber entendido todas las cosas desde el principio con diligencia, escribírtelas por orden.'],
      read: ['Lucas 1', 'Juan 20', 'Hechos 2']
    },
    {
      group: 'Jesús',
      title: '¿Por qué Jesús murió en la cruz?',
      short: 'La cruz muestra dos cosas al mismo tiempo: la gravedad del pecado y la profundidad del amor de Dios. Jesús entrega su vida para reconciliar al ser humano con Dios.',
      verse: ['Juan 3:16', 'Porque de tal manera amó Dios al mundo, que ha dado á su Hijo unigénito.'],
      read: ['Isaías 53', 'Juan 19', 'Romanos 5']
    },
    {
      group: 'Jesús',
      title: '¿Qué significa la resurrección?',
      short: 'La resurrección es el centro de la fe cristiana. Significa que Jesús venció la muerte, que su mensaje fue confirmado y que hay esperanza real más allá del pecado, el dolor y la muerte.',
      verse: ['1 Corintios 15:14', 'Y si Cristo no resucitó, vana es entonces nuestra predicación, vana es también vuestra fe.'],
      read: ['Mateo 28', 'Juan 20', '1 Corintios 15']
    },
    {
      group: 'Biblia',
      title: '¿Por qué leer la Biblia?',
      short: 'Porque la Biblia no es solo información religiosa. Es una historia completa: creación, caída, promesa, Israel, Jesús, cruz, resurrección, iglesia y esperanza final.',
      verse: ['Salmos 119:105', 'Lámpara es á mis pies tu palabra, y lumbrera á mi camino.'],
      read: ['Génesis 1', 'Juan 1', 'Romanos 8']
    },
    {
      group: 'Biblia',
      title: '¿Por dónde empiezo si no conozco nada?',
      short: 'Una buena ruta es empezar por Juan para conocer a Jesús, seguir con Marcos para ver sus acciones, leer Salmos para orar, y después Romanos para entender la fe cristiana.',
      verse: ['Juan 20:31', 'Estas empero son escritas, para que creáis que Jesús es el Cristo, el Hijo de Dios.'],
      read: ['Juan 1', 'Juan 3', 'Marcos 1', 'Salmos 23']
    },
    {
      group: 'Fe',
      title: '¿Qué es tener fe?',
      short: 'Tener fe no es apagar la mente. Es confiar en Dios, responder a su llamado y caminar aunque no entiendas todo desde el primer día.',
      verse: ['Hebreos 11:1', 'Es pues la fe la sustancia de las cosas que se esperan, la demostración de las cosas que no se ven.'],
      read: ['Hebreos 11', 'Romanos 10', 'Juan 20']
    },
    {
      group: 'Fe',
      title: '¿Y si tengo dudas?',
      short: 'Dudar no te deja afuera. Muchas personas se acercan a Dios con preguntas reales. Lo importante es buscar con honestidad, no cerrar el corazón antes de escuchar.',
      verse: ['Marcos 9:24', 'Creo, ayuda mi incredulidad.'],
      read: ['Marcos 9', 'Juan 20', 'Salmos 42']
    },
    {
      group: 'Fe',
      title: '¿Dios escucha cuando oro?',
      short: 'La oración no es una fórmula mágica. Es relación. A veces Dios responde cambiando circunstancias; otras veces empieza cambiando el corazón, dando paz, claridad o fuerza.',
      verse: ['Filipenses 4:6', 'Sean notorias vuestras peticiones delante de Dios en toda oración y ruego.'],
      read: ['Mateo 6', 'Filipenses 4', 'Salmos 5']
    },
    {
      group: 'Dolor',
      title: 'Si Dios existe, ¿por qué hay sufrimiento?',
      short: 'Es una de las preguntas más difíciles. La Biblia no niega el dolor: muestra un mundo quebrado por el pecado, un Dios que entra en el sufrimiento por medio de Jesús, y una esperanza final de restauración.',
      verse: ['Juan 16:33', 'En el mundo tendréis aflicción: mas confiad, yo he vencido al mundo.'],
      read: ['Job 1', 'Juan 11', 'Romanos 8', 'Apocalipsis 21']
    },
    {
      group: 'Dolor',
      title: '¿Dios me puede perdonar?',
      short: 'Sí. El perdón cristiano no se basa en negar el error, sino en volver a Dios con arrepentimiento sincero. La gracia no destruye: levanta y transforma.',
      verse: ['1 Juan 1:9', 'Si confesamos nuestros pecados, él es fiel y justo para que nos perdone nuestros pecados.'],
      read: ['Lucas 15', '1 Juan 1', 'Salmos 51']
    },
    {
      group: 'Vida',
      title: '¿Qué cambia al seguir a Jesús?',
      short: 'Seguir a Jesús no es solo cambiar de religión. Es empezar una vida nueva: aprender a amar, perdonar, vivir con propósito, resistir el mal y caminar con Dios cada día.',
      verse: ['2 Corintios 5:17', 'Si alguno está en Cristo, nueva criatura es.'],
      read: ['Mateo 5', 'Romanos 12', 'Gálatas 5']
    },
    {
      group: 'Vida',
      title: '¿Cómo empiezo hoy?',
      short: 'Empezá simple: hablá con Dios con tus palabras, leé Juan 3, pedí dirección, y buscá una comunidad cristiana sana donde puedas aprender y preguntar.',
      verse: ['Mateo 11:28', 'Venid á mí todos los que estáis trabajados y cargados, que yo os haré descansar.'],
      read: ['Juan 3', 'Juan 14', 'Salmos 23']
    }
  ];

  const clean = t => (t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  function injectStyles() {
    if (document.getElementById('respuestas-style')) return;
    const style = document.createElement('style');
    style.id = 'respuestas-style';
    style.textContent = `
      .respuestas-panel{position:fixed;inset:0;z-index:40;background:var(--bg);color:var(--text);overflow:auto;padding:18px 14px 130px}
      .respuestas-inner{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:14px}
      .respuestas-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;position:sticky;top:0;background:linear-gradient(to bottom,var(--bg),rgba(0,0,0,0));padding:8px 0 14px;z-index:2;backdrop-filter:blur(12px)}
      .respuestas-close{border:1px solid var(--line);background:var(--card);color:var(--text);border-radius:999px;padding:10px 13px;font-weight:900}
      .respuestas-search{width:100%;border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:18px;padding:14px;outline:none}
      .respuestas-groups{display:flex;gap:8px;overflow:auto;padding-bottom:4px}
      .respuestas-groups button{white-space:nowrap;border:1px solid var(--line);background:var(--card);color:var(--text);border-radius:999px;padding:9px 12px;font-weight:900}
      .respuestas-groups button.active{background:linear-gradient(135deg,var(--brand),var(--brand2));color:white;border-color:transparent}
      .res-card{border:1px solid var(--line);background:var(--card);border-radius:24px;padding:16px;box-shadow:0 16px 38px rgba(0,0,0,.12)}
      .res-card h3{margin:0 0 8px}.res-card .miniRef{font-size:13px;color:var(--brand);font-weight:900;text-transform:uppercase;letter-spacing:.06em}.res-card .resVerse{font-weight:800}.res-card ul{margin:8px 0 0;padding-left:18px}.res-card li{font-size:15px}.res-open{border:1px solid var(--line);background:var(--card);color:var(--text);border-radius:999px;padding:8px 11px;font-size:13px;font-weight:900}
    `;
    document.head.appendChild(style);
  }

  function openPanel() {
    injectStyles();
    document.querySelector('.respuestas-panel')?.remove();
    let currentGroup = 'Todos';
    let search = '';
    const panel = document.createElement('section');
    panel.className = 'respuestas-panel';
    panel.innerHTML = `
      <div class="respuestas-inner">
        <div class="respuestas-head">
          <div><p class="ref">Buscando respuestas</p><h1>Preguntas sobre Dios, Jesús y la fe</h1><p class="soft">Una guía simple para quien está empezando, duda o quiere entender mejor.</p></div>
          <button class="respuestas-close">Cerrar</button>
        </div>
        <input class="respuestas-search" placeholder="Buscar: Dios existe, Jesús, sufrimiento, fe, perdón..." />
        <div class="respuestas-groups"></div>
        <div class="respuestas-list"></div>
      </div>
    `;
    document.body.appendChild(panel);
    const groups = ['Todos', ...Array.from(new Set(QUESTIONS.map(q => q.group)))];
    const groupBox = panel.querySelector('.respuestas-groups');
    const list = panel.querySelector('.respuestas-list');
    const input = panel.querySelector('.respuestas-search');
    function renderGroups() {
      groupBox.innerHTML = '';
      groups.forEach(g => {
        const b = document.createElement('button');
        b.textContent = g;
        b.className = g === currentGroup ? 'active' : '';
        b.onclick = () => { currentGroup = g; render(); };
        groupBox.appendChild(b);
      });
    }
    function render() {
      renderGroups();
      const q = clean(search);
      const items = QUESTIONS.filter(item => (currentGroup === 'Todos' || item.group === currentGroup) && (!q || clean(item.title + ' ' + item.short + ' ' + item.group).includes(q)));
      list.innerHTML = items.map(item => `
        <article class="res-card">
          <p class="miniRef">${item.group}</p>
          <h3>${item.title}</h3>
          <p>${item.short}</p>
          <p class="miniRef">${item.verse[0]}</p>
          <p class="resVerse">“${item.verse[1]}”</p>
          <p class="miniRef">Para leer</p>
          <ul>${item.read.map(r => `<li>${r}</li>`).join('')}</ul>
        </article>
      `).join('') || '<article class="res-card"><p>No encontré una respuesta con esas palabras. Probá: Dios, Jesús, fe, sufrimiento, perdón, Biblia.</p></article>';
    }
    input.oninput = e => { search = e.target.value; render(); };
    panel.querySelector('.respuestas-close').onclick = () => panel.remove();
    render();
  }

  function installButton() {
    if (document.querySelector('.res-open')) return;
    const quick = document.querySelector('.quick');
    if (!quick) return;
    const btn = document.createElement('button');
    btn.className = 'res-open';
    btn.textContent = 'Respuestas';
    btn.onclick = openPanel;
    quick.insertBefore(btn, quick.firstChild);
  }

  function addHomeCard() {
    if (document.querySelector('.respuestas-home-card')) return;
    const title = document.querySelector('h1')?.textContent || '';
    if (!title.includes('Una palabra para hoy')) return;
    const mood = document.querySelector('.moodBox');
    if (!mood) return;
    const card = document.createElement('section');
    card.className = 'card respuestas-home-card';
    card.innerHTML = `<p class="ref">Buscando respuestas</p><h3>¿Quién es Dios? ¿Existe? ¿Quién es Jesús?</h3><p class="soft">Preguntas simples para empezar a entender la fe cristiana.</p><button class="btn">Abrir respuestas</button>`;
    window.PVImages?.applyHero?.(card, 'cross_sunset');
    card.querySelector('button').onclick = openPanel;
    mood.insertAdjacentElement('afterend', card);
  }

  setInterval(() => { installButton(); addHomeCard(); }, 3000);
})();
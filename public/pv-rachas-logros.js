(() => {
  // ===========================================================================
  // PALABRA VIVA — Sistema de rachas (streaks) y logros (badges)
  // ===========================================================================
  // Aumenta engagement diario sin requerir backend. Todo en localStorage.
  // - Rachas: días consecutivos abriendo la app o realizando acciones clave.
  // - Logros: hitos desbloqueables que se acumulan a lo largo del tiempo.
  // - Cards en home + panel completo accesible desde Ajustes.

  const STORAGE_KEY = 'pv-streak-data';
  const ACTIVITY_KEY = 'pv-activity-log';

  // ── Datos iniciales / migración ──────────────────────────────────────────
  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultData();
      const d = JSON.parse(raw);
      return { ...defaultData(), ...d };
    } catch {
      return defaultData();
    }
  }
  function defaultData() {
    return {
      currentStreak: 0,         // días consecutivos actuales
      longestStreak: 0,         // mejor racha histórica
      lastActiveDate: null,     // 'YYYY-MM-DD' del último día activo
      totalDays: 0,             // total de días distintos activos
      versesShared: 0,          // contador de versículos compartidos
      versesSaved: 0,           // contador de guardados
      plansCompleted: 0,        // planes 100% terminados
      readingsCompleted: 0,     // lecturas individuales marcadas
      prayersOpened: 0,         // veces que se abrió la sección oración
      earlyReads: 0,            // veces leyó antes de las 8am
      lateReads: 0,             // veces leyó después de las 22h
      uniqueBooks: [],          // libros distintos abiertos
      badges: []                // ids de logros desbloqueados
    };
  }
  function saveData(d) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {}
  }

  function today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  function yesterday() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  // ── Registrar actividad: actualiza racha si es un día nuevo ───────────────
  function recordActivity(type = 'open') {
    const data = loadData();
    const t = today();

    if (data.lastActiveDate !== t) {
      // Es un día nuevo
      if (data.lastActiveDate === yesterday()) {
        data.currentStreak = (data.currentStreak || 0) + 1;
      } else if (data.lastActiveDate) {
        // Se rompió la racha
        data.currentStreak = 1;
      } else {
        // Primer día de uso
        data.currentStreak = 1;
      }
      data.lastActiveDate = t;
      data.totalDays = (data.totalDays || 0) + 1;
      if (data.currentStreak > (data.longestStreak || 0)) {
        data.longestStreak = data.currentStreak;
      }
    }

    // Contadores específicos
    const h = new Date().getHours();
    if (type === 'read' || type === 'open') {
      if (h < 8) data.earlyReads = (data.earlyReads || 0) + 1;
      if (h >= 22) data.lateReads = (data.lateReads || 0) + 1;
    }
    if (type === 'share') data.versesShared = (data.versesShared || 0) + 1;
    if (type === 'save')  data.versesSaved  = (data.versesSaved  || 0) + 1;
    if (type === 'prayer') data.prayersOpened = (data.prayersOpened || 0) + 1;
    if (type === 'plan-complete') data.plansCompleted = (data.plansCompleted || 0) + 1;
    if (type === 'reading-complete') data.readingsCompleted = (data.readingsCompleted || 0) + 1;
    if (type === 'book-open' && typeof arguments[1] === 'string') {
      const book = arguments[1];
      if (!data.uniqueBooks.includes(book)) data.uniqueBooks.push(book);
    }

    saveData(data);
    checkBadges(data);
    return data;
  }

  // ── Definición de logros ──────────────────────────────────────────────────
  const BADGES = [
    // Constancia
    { id: 'streak-3',   emoji: '🌱', name: '3 días seguidos',  desc: 'Llevás 3 días viniendo. ¡Buen comienzo!',                 check: d => (d.currentStreak||0) >= 3 || (d.longestStreak||0) >= 3 },
    { id: 'streak-7',   emoji: '🔥', name: 'Una semana fiel',   desc: '7 días consecutivos abriendo la Palabra.',                check: d => (d.longestStreak||0) >= 7 },
    { id: 'streak-14',  emoji: '⚡',  name: 'Dos semanas',       desc: '14 días seguidos. Esto se vuelve hábito.',                check: d => (d.longestStreak||0) >= 14 },
    { id: 'streak-30',  emoji: '💎', name: 'Un mes completo',   desc: '30 días sin faltar. Te transforma.',                      check: d => (d.longestStreak||0) >= 30 },
    { id: 'streak-100', emoji: '👑', name: '100 días',          desc: 'Cien días con la Palabra. Sos parte de algo grande.',     check: d => (d.longestStreak||0) >= 100 },
    { id: 'streak-365', emoji: '🏆', name: 'Un año entero',     desc: '365 días seguidos. Inspiración pura.',                    check: d => (d.longestStreak||0) >= 365 },

    // Total acumulado
    { id: 'total-30',   emoji: '📖', name: 'Lector habitual',   desc: '30 días totales usando la app.',                          check: d => (d.totalDays||0) >= 30 },
    { id: 'total-100',  emoji: '📚', name: 'Centurión',         desc: '100 días totales. Ya sos parte del ADN.',                 check: d => (d.totalDays||0) >= 100 },
    { id: 'total-365',  emoji: '🌟', name: 'Año dorado',        desc: '365 días totales (no necesariamente seguidos).',          check: d => (d.totalDays||0) >= 365 },

    // Horarios
    { id: 'early-5',    emoji: '🌅', name: 'Madrugador',        desc: 'Leíste 5 veces antes de las 8am. La gracia es nueva cada mañana.', check: d => (d.earlyReads||0) >= 5 },
    { id: 'night-5',    emoji: '🌙', name: 'Pacífico nocturno', desc: 'Leíste 5 veces después de las 22h. Descansás en Él.',     check: d => (d.lateReads||0) >= 5 },

    // Engagement
    { id: 'save-10',    emoji: '🔖', name: 'Coleccionista',     desc: 'Guardaste 10 versículos para volver a ellos.',            check: d => (d.versesSaved||0) >= 10 },
    { id: 'save-50',    emoji: '📂', name: 'Biblioteca propia', desc: '50 versículos guardados. Tu propia colección.',           check: d => (d.versesSaved||0) >= 50 },
    { id: 'share-5',    emoji: '📤', name: 'Mensajero',         desc: 'Compartiste 5 versículos con otros.',                     check: d => (d.versesShared||0) >= 5 },
    { id: 'share-25',   emoji: '🕊️', name: 'Discípulo en misión', desc: 'Compartiste 25 versículos. Sembrás Palabra.',           check: d => (d.versesShared||0) >= 25 },

    // Planes
    { id: 'plan-1',     emoji: '✓',  name: 'Primer plan',       desc: 'Completaste tu primer plan de lectura.',                  check: d => (d.plansCompleted||0) >= 1 },
    { id: 'plan-3',     emoji: '🎓', name: '3 planes',          desc: 'Tres planes completos. Sos disciplinado/a.',              check: d => (d.plansCompleted||0) >= 3 },

    // Oración
    { id: 'pray-10',    emoji: '🙏', name: 'Vida de oración',   desc: 'Visitaste la sección de oración 10 veces.',               check: d => (d.prayersOpened||0) >= 10 },

    // Exploración bíblica
    { id: 'books-10',   emoji: '🗺️', name: 'Explorador',        desc: 'Leíste 10 libros distintos de la Biblia.',                check: d => (d.uniqueBooks?.length||0) >= 10 },
    { id: 'books-30',   emoji: '🌍', name: 'Cartógrafo bíblico',desc: 'Leíste 30 libros distintos de la Biblia.',                check: d => (d.uniqueBooks?.length||0) >= 30 },
    { id: 'books-66',   emoji: '🎯', name: '66 libros',         desc: 'Tocaste todos los libros de la Biblia. ¡Heroico!',         check: d => (d.uniqueBooks?.length||0) >= 66 },
  ];

  // ── Chequear si se desbloqueó algún logro nuevo ──────────────────────────
  function checkBadges(data) {
    let newly = [];
    for (const b of BADGES) {
      if (!data.badges.includes(b.id) && b.check(data)) {
        data.badges.push(b.id);
        newly.push(b);
      }
    }
    if (newly.length) {
      saveData(data);
      newly.forEach(b => setTimeout(() => showBadgeToast(b), 200));
    }
    return newly;
  }

  // ── Toast de logro desbloqueado ──────────────────────────────────────────
  function showBadgeToast(badge) {
    injectStyles();
    const t = document.createElement('div');
    t.className = 'pv-badge-toast';
    t.innerHTML = `
      <div class="pv-badge-toast-icon">${badge.emoji}</div>
      <div class="pv-badge-toast-text">
        <div class="pv-badge-toast-title">🎉 Logro desbloqueado</div>
        <div class="pv-badge-toast-name">${badge.name}</div>
        <div class="pv-badge-toast-desc">${badge.desc}</div>
      </div>
    `;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 20);
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 400);
    }, 5000);
    // Click para cerrar antes
    t.addEventListener('click', () => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 400);
    });
  }

  function injectStyles() {
    if (document.getElementById('pv-rachas-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-rachas-style';
    st.textContent = `
      /* Toast de logro */
      .pv-badge-toast{position:fixed;top:calc(env(safe-area-inset-top) + 20px);left:50%;transform:translate(-50%,-120%);background:linear-gradient(135deg,var(--brand),var(--brand2));color:#fbf3df;border-radius:20px;padding:14px 18px;box-shadow:0 12px 36px rgba(0,0,0,.35);z-index:99999;display:flex;align-items:center;gap:14px;max-width:380px;width:calc(100% - 28px);cursor:pointer;transition:transform .4s cubic-bezier(.18,.89,.32,1.28),opacity .3s}
      .pv-badge-toast.show{transform:translate(-50%,0)}
      .pv-badge-toast-icon{font-size:42px;line-height:1;flex-shrink:0}
      .pv-badge-toast-text{flex:1;min-width:0}
      .pv-badge-toast-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;opacity:.9;font-family:var(--font-sans)}
      .pv-badge-toast-name{font-size:17px;font-weight:900;margin-top:2px}
      .pv-badge-toast-desc{font-size:13px;opacity:.92;line-height:1.4;margin-top:3px;font-family:var(--font-sans)}

      /* Card racha en home */
      .pv-racha-card{background:linear-gradient(135deg,rgba(164,119,49,.10),rgba(107,31,31,.08));border:1px solid rgba(164,119,49,.30);border-radius:18px;padding:14px 16px;display:flex;align-items:center;gap:14px;cursor:pointer}
      .pv-racha-card:hover{border-color:var(--brand)}
      .pv-racha-flame{font-size:42px;line-height:1;flex-shrink:0;filter:drop-shadow(0 2px 6px rgba(164,119,49,.4))}
      .pv-racha-num{font-size:32px;font-weight:900;line-height:1;color:var(--brand);font-family:var(--font-serif)}
      .pv-racha-label{font-size:13px;color:var(--muted);font-family:var(--font-sans);letter-spacing:.03em}
      .pv-racha-stats{flex:1;min-width:0}
      .pv-racha-meta{font-size:12px;color:var(--muted);margin-top:4px}
      .pv-racha-arrow{color:var(--brand);font-size:20px;flex-shrink:0;opacity:.6}

      /* Panel completo */
      .pv-rachas-panel{position:fixed;inset:0;z-index:1000045;background:var(--bg);overflow-y:auto;padding:14px 14px calc(80px + env(safe-area-inset-bottom));color:var(--text)}
      .pv-rachas-inner{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:14px}
      .pv-rachas-head{display:flex;justify-content:space-between;gap:10px;position:sticky;top:0;background:var(--bg);padding:8px 0 14px;z-index:5;border-bottom:1px solid var(--line)}
      .pv-rachas-head h1{margin:4px 0;font-size:clamp(22px,5.5vw,28px);letter-spacing:-.02em}
      .pv-rachas-head .ver{font-size:11px;color:var(--muted);font-family:var(--font-sans);text-transform:uppercase;letter-spacing:.08em}
      .pv-rachas-close{border:1px solid var(--line);background:var(--card);color:var(--text);border-radius:999px;padding:9px 14px;font-weight:600;cursor:pointer;height:fit-content;font-size:13px}
      .pv-rachas-hero{background:linear-gradient(135deg,var(--brand),var(--brand2));color:#fbf3df;border-radius:22px;padding:24px;text-align:center}
      .pv-rachas-hero .big{font-size:64px;line-height:1;font-family:var(--font-serif)}
      .pv-rachas-hero .lab{font-size:14px;letter-spacing:.06em;text-transform:uppercase;font-family:var(--font-sans);opacity:.95;margin-top:4px}
      .pv-rachas-hero .sub{font-size:13px;opacity:.85;margin-top:10px;line-height:1.5}
      .pv-rachas-stats3{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
      .pv-rachas-stat{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px 10px;text-align:center}
      .pv-rachas-stat-n{font-size:28px;font-weight:900;font-family:var(--font-serif);color:var(--brand);line-height:1}
      .pv-rachas-stat-l{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-top:4px;font-family:var(--font-sans)}
      .pv-rachas-section{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:16px}
      .pv-rachas-section h2{margin:0 0 4px;font-size:18px;letter-spacing:-.02em}
      .pv-rachas-section p.soft{margin:0 0 14px;font-size:13px;color:var(--muted)}
      .pv-badges-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
      .pv-badge{background:var(--card2);border:1px solid var(--line);border-radius:14px;padding:12px 10px;text-align:center;opacity:.32;transition:opacity .25s}
      .pv-badge.unlocked{opacity:1;border-color:rgba(164,119,49,.40);background:linear-gradient(135deg,rgba(164,119,49,.08),var(--card2))}
      .pv-badge-emoji{font-size:36px;line-height:1;margin-bottom:6px}
      .pv-badge-name{font-size:13px;font-weight:700;line-height:1.2}
      .pv-badge-desc{font-size:11px;color:var(--muted);line-height:1.4;margin-top:4px;font-family:var(--font-sans)}
    `;
    document.head.appendChild(st);
  }

  // ── Card racha en home ────────────────────────────────────────────────────
  function renderHomeCard() {
    if (!isHomeTab()) {
      document.querySelector('.pv-racha-card')?.remove();
      return;
    }
    const data = loadData();
    if ((data.totalDays || 0) === 0) return; // no mostrar si nunca usó

    let card = document.querySelector('.pv-racha-card');
    const stack = document.querySelector('.app .stack');
    if (!stack) return;

    if (!card) {
      injectStyles();
      card = document.createElement('section');
      card.className = 'pv-racha-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', 'Ver mis rachas y logros');
      card.onclick = openPanel;
      // Insertar después del versículo del día (después de .verseCard que es la primera <Card>)
      const anchor = document.querySelector('.pv-rem-card') || document.querySelector('.moodBox') || stack.children[2];
      if (anchor && anchor.parentElement === stack) {
        anchor.insertAdjacentElement('beforebegin', card);
      } else {
        stack.appendChild(card);
      }
    }

    const streak = data.currentStreak || 0;
    const total = data.totalDays || 0;
    const newBadges = data.badges?.length || 0;
    const totalBadges = BADGES.length;

    let msg = '';
    if (streak === 0) msg = 'Empezá tu racha hoy';
    else if (streak === 1) msg = 'Primer día — ¡seguí mañana!';
    else if (streak < 7) msg = `${streak} días seguidos`;
    else if (streak < 30) msg = `🔥 ${streak} días seguidos — ¡hábito formándose!`;
    else msg = `🔥 ${streak} días seguidos — ¡increíble!`;

    card.innerHTML = `
      <div class="pv-racha-flame">${streak >= 30 ? '🔥' : streak >= 7 ? '⚡' : streak >= 3 ? '✨' : '🌱'}</div>
      <div class="pv-racha-stats">
        <div><span class="pv-racha-num">${streak}</span> <span class="pv-racha-label">día${streak === 1 ? '' : 's'} seguidos</span></div>
        <div class="pv-racha-meta">${total} días totales · ${newBadges}/${totalBadges} logros</div>
      </div>
      <div class="pv-racha-arrow">→</div>
    `;
  }

  // ── Panel completo ────────────────────────────────────────────────────────
  function openPanel() {
    if (document.querySelector('.pv-rachas-panel')) return;
    injectStyles();
    history.pushState({ pvRachas: true }, '', location.href.split('#')[0] + '#rachas');

    const data = loadData();
    const streak = data.currentStreak || 0;
    const longest = data.longestStreak || 0;
    const total = data.totalDays || 0;
    const unlocked = data.badges || [];

    const panel = document.createElement('section');
    panel.className = 'pv-rachas-panel';
    panel.setAttribute('aria-label', 'Mis rachas y logros');

    panel.innerHTML = `
      <div class="pv-rachas-inner">
        <div class="pv-rachas-head">
          <div>
            <div class="ver">Tu progreso</div>
            <h1>🔥 Rachas y logros</h1>
          </div>
          <button class="pv-rachas-close" data-close>Cerrar ✕</button>
        </div>

        <div class="pv-rachas-hero">
          <div class="big">${streak}</div>
          <div class="lab">días consecutivos</div>
          <div class="sub">${
            streak === 0 ? 'Hoy es un buen día para empezar 🌱'
            : streak < 3 ? 'Vení mañana para sumar otro día 🌱'
            : streak < 7 ? '¡Buen ritmo! ⚡'
            : streak < 30 ? '¡Ya es hábito! 🔥'
            : '¡Ejemplo de constancia! 👑'
          }</div>
        </div>

        <div class="pv-rachas-stats3">
          <div class="pv-rachas-stat">
            <div class="pv-rachas-stat-n">${longest}</div>
            <div class="pv-rachas-stat-l">Mejor racha</div>
          </div>
          <div class="pv-rachas-stat">
            <div class="pv-rachas-stat-n">${total}</div>
            <div class="pv-rachas-stat-l">Días totales</div>
          </div>
          <div class="pv-rachas-stat">
            <div class="pv-rachas-stat-n">${unlocked.length}/${BADGES.length}</div>
            <div class="pv-rachas-stat-l">Logros</div>
          </div>
        </div>

        <div class="pv-rachas-section">
          <h2>🏆 Logros</h2>
          <p class="soft">Se van desbloqueando solos a medida que usás la app.</p>
          <div class="pv-badges-grid">
            ${BADGES.map(b => {
              const u = unlocked.includes(b.id);
              return `<div class="pv-badge ${u ? 'unlocked' : ''}" title="${u ? '✓ Desbloqueado' : 'Bloqueado'}">
                <div class="pv-badge-emoji">${u ? b.emoji : '🔒'}</div>
                <div class="pv-badge-name">${b.name}</div>
                <div class="pv-badge-desc">${b.desc}</div>
              </div>`;
            }).join('')}
          </div>
        </div>

        <div class="pv-rachas-section">
          <h2>📊 Otros números</h2>
          <p class="soft">Tu actividad acumulada en la app.</p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:14px">
            <div>📖 Lecturas completadas: <strong>${data.readingsCompleted||0}</strong></div>
            <div>✓ Planes completos: <strong>${data.plansCompleted||0}</strong></div>
            <div>🔖 Versículos guardados: <strong>${data.versesSaved||0}</strong></div>
            <div>📤 Versículos compartidos: <strong>${data.versesShared||0}</strong></div>
            <div>🙏 Oraciones abiertas: <strong>${data.prayersOpened||0}</strong></div>
            <div>📚 Libros distintos: <strong>${(data.uniqueBooks?.length||0)}/66</strong></div>
            <div>🌅 Lecturas tempranas: <strong>${data.earlyReads||0}</strong></div>
            <div>🌙 Lecturas nocturnas: <strong>${data.lateReads||0}</strong></div>
          </div>
        </div>
      </div>
    `;

    function close(useHistory = true) {
      window.removeEventListener('popstate', onPop);
      panel.remove();
      if (useHistory && location.hash === '#rachas') {
        window._pvPanelClosing = true;
        history.back();
      }
    }
    function onPop() {
      if (location.hash === '#rachas') return;
      window.removeEventListener('popstate', onPop);
      panel.remove();
    }

    panel.querySelector('[data-close]').onclick = () => close(true);
    document.body.appendChild(panel);
    window.addEventListener('popstate', onPop);
  }

  function isHomeTab() {
    return (document.querySelector('h1')?.textContent || '').toLowerCase().includes('palabra para hoy');
  }

  // ── Boot: registrar actividad de hoy + mostrar card ───────────────────────
  function boot() {
    recordActivity('open');
    renderHomeCard();
  }

  // ── Hooks: detectar acciones del usuario para incrementar contadores ─────
  function setupHooks() {
    // Detectar saves
    document.addEventListener('click', (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      const btn = t.closest('button');
      if (!btn) return;
      const txt = (btn.textContent || '').toLowerCase();
      if (txt.includes('guardar') && !txt.includes('guardado')) {
        recordActivity('save');
      }
      if (txt.includes('compartir') || txt.includes('texto') || txt.includes('imagen')) {
        recordActivity('share');
      }
    }, true);

    // Detectar cambio a tab oración
    setInterval(() => {
      const h1 = document.querySelector('h1')?.textContent || '';
      if (h1.toLowerCase().includes('oraciones')) {
        const data = loadData();
        const t = today();
        // Solo contar 1 vez por día por sección
        if (data._lastPrayerView !== t) {
          data._lastPrayerView = t;
          saveData(data);
          recordActivity('prayer');
        }
      }
    }, 2000);

    // Detectar libro abierto (select de libro en Biblia)
    setInterval(() => {
      const sel = document.querySelector('.fieldLabel select.select');
      if (sel && sel.value && sel.value !== '_pvLastBook') {
        const last = sessionStorage.getItem('pv-last-book');
        if (last !== sel.value) {
          sessionStorage.setItem('pv-last-book', sel.value);
          recordActivity('book-open', sel.value);
        }
      }
    }, 3000);
  }

  // ── API pública ───────────────────────────────────────────────────────────
  window.PVRachas = {
    open: openPanel,
    record: recordActivity,
    getData: loadData,
    getBadges: () => BADGES.map(b => ({ ...b, unlocked: loadData().badges.includes(b.id) })),
    // Para testing: forzar racha
    _setStreak: (n) => { const d = loadData(); d.currentStreak = n; d.longestStreak = Math.max(d.longestStreak||0, n); saveData(d); checkBadges(d); renderHomeCard(); }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { boot(); setupHooks(); });
  } else {
    boot();
    setupHooks();
  }
  // Re-render card al cambiar de tab
  setInterval(renderHomeCard, 3000);
})();

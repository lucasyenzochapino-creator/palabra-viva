(() => {
  // ===========================================================================
  // PALABRA VIVA — Calendario Cristiano
  // ===========================================================================
  // Muestra las festividades cristianas del año actual:
  //   - Fechas fijas (Navidad, Epifanía, Pentecostés, etc.)
  //   - Pascua y dependientes calculadas via algoritmo de Gauss (evangélica)
  //   - Días especiales del año litúrgico
  // No es litúrgico católico — es evangélico/protestante neutral.

  // Algoritmo de Pascua (Gauss / Meeus simplificado) — domingo de Resurrección
  function easterSunday(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const L = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * L) / 451);
    const month = Math.floor((h + L - 7 * m + 114) / 31);
    const day = ((h + L - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
  }

  function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
  function fmtDate(d) { return d.toLocaleDateString('es-AR', { weekday:'long', day:'2-digit', month:'long' }); }
  function fmtShort(d) { return d.toLocaleDateString('es-AR', { day:'2-digit', month:'2-digit' }); }

  function buildEvents(year) {
    const easter = easterSunday(year);
    const lentStart    = addDays(easter, -46); // Miércoles de ceniza
    const palmSunday   = addDays(easter, -7);
    const holyThursday = addDays(easter, -3);
    const goodFriday   = addDays(easter, -2);
    const ascension    = addDays(easter, 40);
    const pentecost    = addDays(easter, 49);

    const events = [
      { date: new Date(year, 0, 1),  emoji:'🎊', title:'Año Nuevo',          ref:'Jeremías 29:11', body:'Un año nuevo es una nueva oportunidad para confiar en los planes de Dios.', kind:'fija' },
      { date: new Date(year, 0, 6),  emoji:'⭐', title:'Epifanía / Reyes',    ref:'Mateo 2:1-12',  body:'Los magos siguieron la estrella para adorar a Jesús. Dios se revela a todos.', kind:'fija' },
      { date: lentStart,             emoji:'🕊️', title:'Inicio de Cuaresma',  ref:'Joel 2:12-13', body:'40 días para acercarnos a Dios. No es solo ayuno externo, sino corazón humilde.', kind:'movible' },
      { date: palmSunday,            emoji:'🌿', title:'Domingo de Ramos',    ref:'Mateo 21:9',  body:'Jesús entra a Jerusalén. La gente lo recibe como Rey con ramos y mantos.', kind:'movible' },
      { date: holyThursday,          emoji:'🍷', title:'Jueves Santo',        ref:'Lucas 22:19', body:'Última Cena. Jesús instituye el pan y el vino como recordatorio de su entrega.', kind:'movible' },
      { date: goodFriday,            emoji:'✝️', title:'Viernes Santo',       ref:'Juan 19:30',  body:'Jesús dice "Consumado es". Da su vida por nosotros. Día de profunda reflexión.', kind:'movible' },
      { date: easter,                emoji:'🌅', title:'Pascua de Resurrección', ref:'Mateo 28:6', body:'¡Cristo vive! La tumba está vacía. La esperanza más grande de la fe cristiana.', kind:'movible', highlight:true },
      { date: ascension,             emoji:'☁️', title:'Ascensión',           ref:'Hechos 1:9',  body:'Jesús sube al cielo 40 días después de resucitar. Promete enviar al Espíritu.', kind:'movible' },
      { date: pentecost,             emoji:'🔥', title:'Pentecostés',         ref:'Hechos 2:1-4', body:'Llega el Espíritu Santo. Nace la Iglesia. Comienza la misión a todas las naciones.', kind:'movible' },
      { date: new Date(year, 9, 31), emoji:'📜', title:'Día de la Reforma',   ref:'Romanos 1:17', body:'En 1517, Martín Lutero publicó las 95 tesis. Solo por gracia, solo por fe, solo Cristo.', kind:'fija' },
      { date: new Date(year, 10, 1), emoji:'✨', title:'Día de Todos los Santos', ref:'Hebreos 12:1', body:'Recordamos a quienes nos precedieron en la fe. Esa nube de testigos nos acompaña.', kind:'fija' },
      { date: new Date(year, 11, 24),emoji:'🕯️', title:'Nochebuena',           ref:'Lucas 2:7',   body:'La noche en que Dios nació como bebé en un pesebre. Inmensa humildad.', kind:'fija' },
      { date: new Date(year, 11, 25),emoji:'🎄', title:'Navidad',             ref:'Lucas 2:11',  body:'Nos ha nacido un Salvador. Dios con nosotros — Emanuel.', kind:'fija', highlight:true },
    ];

    return events.sort((a, b) => a.date - b.date);
  }

  function daysUntil(d) {
    const now = new Date(); now.setHours(0,0,0,0);
    const t = new Date(d); t.setHours(0,0,0,0);
    return Math.round((t - now) / 86400000);
  }

  function injectStyles() {
    if (document.getElementById('pv-cal-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-cal-style';
    st.textContent = `
      .pv-cal-panel{position:fixed;inset:0;z-index:1000005;background:linear-gradient(180deg,#fdf6ec,#f3e0c0);color:#27190c;overflow-y:auto;padding:14px 14px calc(140px + env(safe-area-inset-bottom))}
      body[data-theme="dark"] .pv-cal-panel{background:linear-gradient(180deg,#1a1108,#2a1810);color:#f5deb3}
      .pv-cal-inner{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:14px}
      .pv-cal-head{display:grid;grid-template-columns:1fr auto;gap:10px;position:sticky;top:0;background:inherit;padding:8px 0 14px;z-index:5}
      .pv-cal-head h1{font-size:clamp(22px,6vw,28px);margin:4px 0;letter-spacing:-.02em;color:#7c4a1e}
      body[data-theme="dark"] .pv-cal-head h1{color:#fbbf24}
      .pv-cal-head p{font-size:13px;color:#604329;margin:0}
      body[data-theme="dark"] .pv-cal-head p{color:#c8b890}
      .pv-cal-close{border:2px solid #7c4a1e;background:#fff;color:#7c4a1e;border-radius:999px;padding:9px 14px;font-weight:900;cursor:pointer;height:fit-content}
      .pv-cal-next{background:linear-gradient(135deg,#7c4a1e,#b45309);color:#fff;border-radius:22px;padding:18px;box-shadow:0 16px 40px rgba(124,74,30,.3)}
      .pv-cal-next .label{font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;opacity:.85;margin:0}
      .pv-cal-next h2{margin:6px 0;font-size:24px;color:#fff}
      .pv-cal-next p{margin:4px 0;color:#fff;line-height:1.45}
      .pv-cal-next .countdown{font-size:38px;font-weight:900;letter-spacing:-.02em;margin:8px 0 0}
      .pv-cal-list{display:flex;flex-direction:column;gap:10px}
      .pv-cal-item{background:#fff;border:1px solid #d1b083;border-radius:18px;padding:14px;display:flex;gap:14px;align-items:flex-start}
      body[data-theme="dark"] .pv-cal-item{background:#3a2410;border-color:#604329}
      .pv-cal-item.past{opacity:.55}
      .pv-cal-item.today{border-color:#22c55e;border-width:3px;box-shadow:0 8px 24px rgba(34,197,94,.2)}
      .pv-cal-item.highlight{background:linear-gradient(135deg,#fef3c7,#fff);border-color:#f59e0b}
      body[data-theme="dark"] .pv-cal-item.highlight{background:linear-gradient(135deg,#4a2810,#3a2410);border-color:#f59e0b}
      .pv-cal-emoji{font-size:42px;line-height:1;flex-shrink:0}
      .pv-cal-content{flex:1;min-width:0}
      .pv-cal-date{font-size:12px;color:#7c4a1e;font-weight:900;text-transform:capitalize;letter-spacing:.04em;margin:0}
      body[data-theme="dark"] .pv-cal-date{color:#fbbf24}
      .pv-cal-title{margin:4px 0;font-size:18px;letter-spacing:-.01em}
      .pv-cal-body{margin:0;font-size:14px;line-height:1.5;color:#3f2f1f}
      body[data-theme="dark"] .pv-cal-body{color:#e8d5c2}
      .pv-cal-ref{margin:6px 0 0;font-size:12px;color:#7c4a1e;font-weight:700}
      body[data-theme="dark"] .pv-cal-ref{color:#fbbf24}
      .pv-cal-tag{display:inline-block;font-size:10px;font-weight:900;padding:2px 8px;border-radius:999px;background:#dcfce7;color:#166534;margin-left:6px;vertical-align:middle}
      .pv-cal-tag.today{background:#22c55e;color:#fff}
      .pv-cal-home{border-color:rgba(245,158,11,.45)!important;background:linear-gradient(135deg,rgba(245,158,11,.12),var(--card))!important}
    `;
    document.head.appendChild(st);
  }

  function open() {
    if (document.querySelector('.pv-cal-panel')) return;
    injectStyles();
    history.pushState({ pvCal: true }, '', location.href.split('#')[0] + '#calendario');

    const year = new Date().getFullYear();
    const events = buildEvents(year);
    const upcoming = events.find(e => daysUntil(e.date) >= 0);

    const panel = document.createElement('section');
    panel.className = 'pv-cal-panel';
    panel.setAttribute('aria-label', 'Calendario cristiano');

    panel.innerHTML = `
      <div class="pv-cal-inner">
        <div class="pv-cal-head">
          <div>
            <p>Año litúrgico ${year}</p>
            <h1>📅 Calendario cristiano</h1>
          </div>
          <button class="pv-cal-close" data-close>Cerrar ✕</button>
        </div>
        ${upcoming ? `
          <div class="pv-cal-next">
            <p class="label">Próxima fiesta</p>
            <h2>${upcoming.emoji} ${upcoming.title}</h2>
            <p>${upcoming.body}</p>
            <p style="font-size:13px;opacity:.85"><strong>📖 ${upcoming.ref}</strong> · ${fmtDate(upcoming.date)}</p>
            ${daysUntil(upcoming.date) === 0
              ? '<p class="countdown">¡Hoy! 🎉</p>'
              : `<p class="countdown">${daysUntil(upcoming.date)} día${daysUntil(upcoming.date)===1?'':'s'}</p>`}
          </div>
        ` : ''}
        <div class="pv-cal-list">
          ${events.map(e => {
            const d = daysUntil(e.date);
            const cls = ['pv-cal-item'];
            if (d < 0) cls.push('past');
            if (d === 0) cls.push('today');
            if (e.highlight) cls.push('highlight');
            const tag = d === 0 ? '<span class="pv-cal-tag today">HOY</span>'
              : (d > 0 && d <= 30) ? `<span class="pv-cal-tag">en ${d}d</span>` : '';
            return `<article class="${cls.join(' ')}">
              <div class="pv-cal-emoji">${e.emoji}</div>
              <div class="pv-cal-content">
                <p class="pv-cal-date">${fmtDate(e.date)} (${fmtShort(e.date)})</p>
                <h3 class="pv-cal-title">${e.title}${tag}</h3>
                <p class="pv-cal-body">${e.body}</p>
                <p class="pv-cal-ref">📖 ${e.ref}</p>
              </div>
            </article>`;
          }).join('')}
        </div>
        <p style="text-align:center;font-size:12px;color:#604329;margin:20px 0 0">Las fechas de Cuaresma, Pascua y dependientes se calculan automáticamente.</p>
      </div>
    `;

    function close(useHistory = true) {
      window.removeEventListener('popstate', onPop);
      panel.remove();
      if (useHistory && location.hash === '#calendario') {
        window._pvPanelClosing = true;
        history.back();
      }
    }
    function onPop() {
      if (location.hash === '#calendario') return;
      window.removeEventListener('popstate', onPop);
      panel.remove();
    }
    panel.querySelector('[data-close]').onclick = () => close(true);
    document.body.appendChild(panel);
    window.addEventListener('popstate', onPop);

    // Scroll a hoy/próximo
    setTimeout(() => {
      const todayEl = panel.querySelector('.pv-cal-item.today, .pv-cal-item:not(.past)');
      todayEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
  }

  function addHomeCard() {
    const title = document.querySelector('h1')?.textContent || '';
    if (!title.includes('Una palabra para hoy')) {
      document.querySelector('.pv-cal-home')?.remove();
      return;
    }
    if (document.querySelector('.pv-cal-home')) return;
    const anchor = document.querySelector('.pv-igl-home') || document.querySelector('.pv-tl-home') || document.querySelector('.pv-kids-home') || document.querySelector('.hero');
    if (!anchor) return;

    const events = buildEvents(new Date().getFullYear());
    const next = events.find(e => daysUntil(e.date) >= 0);
    if (!next) return;
    const days = daysUntil(next.date);

    const card = document.createElement('section');
    card.className = 'card pv-cal-home';
    card.innerHTML = `
      <p class="ref">Año litúrgico</p>
      <h3>📅 Calendario cristiano</h3>
      <p class="soft">${days === 0 ? '🎉 Hoy es' : `Faltan ${days} día${days===1?'':'s'} para`} <strong>${next.emoji} ${next.title}</strong></p>
      <div class="row wrap"><button class="btn">Ver calendario completo</button></div>
    `;
    card.querySelector('button').onclick = open;
    anchor.insertAdjacentElement('afterend', card);
  }

  function boot() { injectStyles(); addHomeCard(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('load', boot);
  setInterval(boot, 3000);

  window.PVCalendario = { open };
})();

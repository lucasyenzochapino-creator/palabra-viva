(() => {
  // ===========================================================================
  // PALABRA VIVA — Recordatorios diarios (notificaciones locales)
  // ===========================================================================
  // El usuario elige una hora y la app le manda una notificación con un
  // versículo. Sin servidor — usa Notification API + service worker.
  // Limitación: el navegador debe estar abierto al menos UNA vez al día.

  const SETTINGS_KEY = 'pv-reminder-settings';
  const LAST_SENT_KEY = 'pv-reminder-last';

  // Versículos rotativos (mismo bloque que el hero por hora)
  const VERSES = [
    'Jehová es mi pastor; nada me faltará. — Salmos 23:1',
    'Todo lo puedo en Cristo que me fortalece. — Filipenses 4:13',
    'Bástate mi gracia. — 2 Corintios 12:9',
    'No temas, porque yo soy contigo. — Isaías 41:10',
    'En tu mano están mis tiempos. — Salmos 31:15',
    'La paz os dejo, mi paz os doy. — Juan 14:27',
    'El amor del Señor no tiene fin. — Lamentaciones 3:22',
    'Echando toda vuestra ansiedad en él. — 1 Pedro 5:7',
    'Cercano está Jehová a los quebrantados de corazón. — Salmos 34:18',
    'Esforzaos y cobrad ánimo. — Josué 1:9',
    'Jehová es la luz mía y mi salvación. — Salmos 27:1',
    'Mi gracia es suficiente para ti. — 2 Corintios 12:9',
    'Y conoceréis la verdad, y la verdad os hará libres. — Juan 8:32',
    'Pedid, y se os dará. — Mateo 7:7',
    'Cantad a Jehová cántico nuevo. — Salmos 96:1',
    'El que cree en mí, tiene vida eterna. — Juan 6:47',
    'Encomienda tus obras al Señor. — Proverbios 16:3',
    'Confiad, yo he vencido al mundo. — Juan 16:33',
    'Yo te he llamado por tu nombre. — Isaías 43:1',
    'Levantad los ojos y mirad los campos. — Juan 4:35',
    'Misericordia quiero, y no sacrificio. — Oseas 6:6',
    'Todo lo hizo hermoso en su tiempo. — Eclesiastés 3:11',
    'El gozo del Señor es vuestra fuerza. — Nehemías 8:10',
    'No os afanéis por el día de mañana. — Mateo 6:34',
    'Bienaventurado el varón que confía en Jehová. — Jeremías 17:7',
    'Lámpara es a mis pies tu palabra. — Salmos 119:105',
    'Sus misericordias nuevas son cada mañana. — Lamentaciones 3:23',
    'Buscad primeramente el reino de Dios. — Mateo 6:33',
    'El que mora al abrigo del Altísimo. — Salmos 91:1',
    'Yo soy el camino, y la verdad, y la vida. — Juan 14:6'
  ];

  function todaysVerse() {
    const day = Math.floor((Date.now() - new Date(2025, 0, 0)) / 86400000);
    return VERSES[Math.abs(day) % VERSES.length];
  }

  function loadSettings() {
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'); }
    catch { return {}; }
  }
  function saveSettings(s) {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch {}
  }

  function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
  }

  // ── Verificar si toca enviar y disparar ───────────────────────────────────
  async function checkAndNotify() {
    const s = loadSettings();
    if (!s.enabled || !s.time) return;
    if (Notification.permission !== 'granted') return;

    const last = localStorage.getItem(LAST_SENT_KEY);
    if (last === todayStr()) return; // ya se mandó hoy

    const [hh, mm] = s.time.split(':').map(n => parseInt(n, 10));
    const now = new Date();
    const target = new Date();
    target.setHours(hh, mm, 0, 0);

    // Si la hora objetivo ya pasó hoy y todavía no se envió → enviar ahora
    if (now >= target) {
      try {
        const verse = todaysVerse();
        const [text, ref] = verse.split(' — ');
        const title = '📖 Palabra Viva — ' + (ref || 'Hoy');
        const body = text || verse;
        if (navigator.serviceWorker?.controller) {
          // Mostrar via service worker (mejor en iOS PWA)
          const reg = await navigator.serviceWorker.ready;
          await reg.showNotification(title, {
            body,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            tag: 'pv-daily',
            data: { url: '/' },
            renotify: false,
            requireInteraction: false
          });
        } else {
          new Notification(title, { body, icon: '/icon-192.png', tag: 'pv-daily' });
        }
        try { localStorage.setItem(LAST_SENT_KEY, todayStr()); } catch {}
      } catch (e) {
        console.warn('[Recordatorios] error mostrando notificación:', e);
      }
    }
  }

  // ── UI: card en Ajustes ───────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('pv-rem-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-rem-style';
    st.textContent = `
      .pv-rem-row{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:8px 0}
      .pv-rem-row label{flex:1;font-size:15px;font-weight:700}
      .pv-rem-row input[type="time"]{border:1px solid var(--line,#333447);background:var(--card2,#202031);color:var(--text,#f8fafc);border-radius:12px;padding:9px 12px;font:inherit;font-size:15px}
      .pv-rem-switch{position:relative;width:54px;height:30px;background:var(--card2,#202031);border:1px solid var(--line,#333447);border-radius:99px;cursor:pointer;flex-shrink:0}
      .pv-rem-switch.on{background:linear-gradient(135deg,#22c55e,#16a34a);border-color:transparent}
      .pv-rem-switch::after{content:'';position:absolute;top:2px;left:2px;width:24px;height:24px;background:#fff;border-radius:50%;transition:left .2s;box-shadow:0 2px 6px rgba(0,0,0,.3)}
      .pv-rem-switch.on::after{left:26px}
      .pv-rem-msg{font-size:13px;color:var(--muted,#c8c5d8);margin:6px 0 0;line-height:1.4}
      .pv-rem-test{background:var(--card2,#202031);border:1px solid var(--line,#333447);color:var(--text,#f8fafc);border-radius:999px;padding:8px 14px;font-weight:900;font-size:13px;cursor:pointer}
    `;
    document.head.appendChild(st);
  }

  function renderInAjustes() {
    if (!isAjustesTab()) {
      document.querySelector('.pv-rem-card')?.remove();
      return;
    }
    if (document.querySelector('.pv-rem-card')) return;
    injectStyles();
    const stack = document.querySelector('.app .stack');
    if (!stack) return;

    const s = loadSettings();
    const enabled = !!s.enabled;
    const time = s.time || '08:00';

    const card = document.createElement('section');
    card.className = 'card pv-rem-card';
    card.innerHTML = `
      <h3>🔔 Recordatorio diario</h3>
      <p class="soft">Te avisamos con un versículo a la hora que elijas. La app tiene que estar abierta al menos una vez por día (en celular o compu).</p>
      <div class="pv-rem-row">
        <label>Activar recordatorio</label>
        <div class="pv-rem-switch ${enabled?'on':''}" id="pv-rem-toggle" role="switch" aria-checked="${enabled}" tabindex="0"></div>
      </div>
      <div class="pv-rem-row">
        <label for="pv-rem-time">Hora del recordatorio</label>
        <input type="time" id="pv-rem-time" value="${time}">
      </div>
      <div class="pv-rem-row">
        <button class="pv-rem-test" id="pv-rem-test">📩 Probar ahora</button>
      </div>
      <p class="pv-rem-msg" id="pv-rem-status"></p>
    `;
    stack.appendChild(card);

    const toggle = card.querySelector('#pv-rem-toggle');
    const timeInp = card.querySelector('#pv-rem-time');
    const status = card.querySelector('#pv-rem-status');
    const testBtn = card.querySelector('#pv-rem-test');

    function isIOS() {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }
    function isPWA() {
      return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    }

    function refreshStatus() {
      const s2 = loadSettings();
      if (!('Notification' in window)) {
        status.innerHTML = '⚠️ Tu navegador no soporta notificaciones. Probá en Chrome o Safari actualizado.';
        return;
      }
      // iOS Safari requiere PWA instalada para notificaciones (desde iOS 16.4)
      if (isIOS() && !isPWA()) {
        status.innerHTML = '📱 <strong>En iPhone hay que instalar la app primero</strong>: en Safari tocá Compartir 📤 → "Añadir a pantalla de inicio". Después abrí la app desde el ícono y vení acá de nuevo.';
        return;
      }
      if (s2.enabled && Notification.permission === 'granted') {
        const last = localStorage.getItem(LAST_SENT_KEY);
        const sentToday = last === todayStr();
        status.innerHTML = `✅ <strong>Activo</strong> — te avisaremos a las <strong>${s2.time}</strong>.<br>
          <small style="font-size:12px;color:var(--muted)">Importante: tenés que abrir la app al menos una vez al día (en celular o compu) para que llegue el aviso.${sentToday ? '<br>✨ Ya recibiste tu aviso de hoy.' : ''}</small>`;
      } else if (s2.enabled && Notification.permission === 'denied') {
        status.innerHTML = '❌ <strong>Notificaciones bloqueadas</strong>. Activalas en los permisos del navegador (ícono 🔒 al lado de la URL).';
      } else if (Notification.permission === 'granted') {
        status.innerHTML = 'Permiso concedido. Encendé el interruptor verde para activar el recordatorio.';
      } else {
        status.innerHTML = 'Encendé el interruptor verde y permití notificaciones cuando te pregunte el navegador.';
      }
    }
    refreshStatus();

    async function setEnabled(on) {
      if (on) {
        if (!('Notification' in window)) return;
        if (Notification.permission === 'default') {
          const perm = await Notification.requestPermission();
          if (perm !== 'granted') {
            toggle.classList.remove('on');
            refreshStatus();
            return;
          }
        }
        if (Notification.permission !== 'granted') {
          toggle.classList.remove('on');
          refreshStatus();
          return;
        }
      }
      saveSettings({ ...loadSettings(), enabled: on, time: timeInp.value });
      toggle.classList.toggle('on', on);
      toggle.setAttribute('aria-checked', on);
      refreshStatus();
    }

    toggle.onclick = () => setEnabled(!toggle.classList.contains('on'));
    toggle.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle.click(); } };
    timeInp.onchange = () => {
      saveSettings({ ...loadSettings(), time: timeInp.value });
      refreshStatus();
    };

    testBtn.onclick = async () => {
      if (!('Notification' in window)) {
        alert('Tu navegador no soporta notificaciones.');
        return;
      }
      if (Notification.permission === 'default') {
        const perm = await Notification.requestPermission();
        if (perm !== 'granted') {
          alert('Para probar el recordatorio, primero permití las notificaciones.');
          return;
        }
      }
      if (Notification.permission !== 'granted') {
        alert('Las notificaciones están bloqueadas. Activalas en los permisos del navegador.');
        return;
      }
      const verse = todaysVerse();
      const [text, ref] = verse.split(' — ');
      const title = '📖 Palabra Viva — ' + (ref || 'Hoy');
      const body = text || verse;
      if (navigator.serviceWorker?.controller) {
        const reg = await navigator.serviceWorker.ready;
        await reg.showNotification(title, { body, icon: '/icon-192.png', tag: 'pv-test' });
      } else {
        new Notification(title, { body, icon: '/icon-192.png' });
      }
    };
  }

  function isAjustesTab() {
    return (document.querySelector('h1')?.textContent || '').trim() === 'Ajustes';
  }

  function boot() {
    renderInAjustes();
    checkAndNotify();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('load', boot);
  setInterval(boot, 3000);
  // Verificar cada 60s mientras la app esté abierta
  setInterval(checkAndNotify, 60000);

  window.PVReminders = { check: checkAndNotify };
})();

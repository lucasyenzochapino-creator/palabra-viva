(() => {
  // ⚠️ MÓDULO LEGACY DESHABILITADO
  // Reemplazado por daily-reminders.js que usa Web Push real (servidor envía
  // aunque la app esté cerrada). Este archivo solo limpia el card viejo si
  // todavía está en el DOM.
  document.querySelectorAll('.pv-notif-card').forEach(c => c.remove());
  return;
  // eslint-disable-next-line no-unreachable
  const ENABLED_KEY = 'pv-daily-notif-enabled';
  const HOUR_KEY = 'pv-daily-notif-hour';
  const LAST_DATE_KEY = 'pv-daily-notif-last';

  function isEnabled(){ return localStorage.getItem(ENABLED_KEY) === '1'; }
  function setEnabled(v){ try { localStorage.setItem(ENABLED_KEY, v ? '1' : '0'); } catch {} }
  function getHour(){ return localStorage.getItem(HOUR_KEY) || '07:00'; }
  function setHour(v){ try { localStorage.setItem(HOUR_KEY, v || '07:00'); } catch {} }
  function todayKey(){ const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
  function alreadyNotifiedToday(){ return localStorage.getItem(LAST_DATE_KEY) === todayKey(); }
  function markNotifiedToday(){ try { localStorage.setItem(LAST_DATE_KEY, todayKey()); } catch {} }
  function isSupported(){ return 'Notification' in window; }
  function hasPermission(){ return isSupported() && Notification.permission === 'granted'; }
  function isDenied(){ return isSupported() && Notification.permission === 'denied'; }

  async function requestPerm(){
    if (!isSupported()) return false;
    if (hasPermission()) return true;
    if (isDenied()) return false;
    try { return await Notification.requestPermission() === 'granted'; }
    catch { return false; }
  }

  function getTodayVerse(){
    const heroH2 = document.querySelector('.hero h2, .card.gradient h2');
    const heroRef = document.querySelector('.hero .ref, .card.gradient .ref');
    if (heroH2 && heroRef) return { ref: heroRef.textContent.trim(), text: heroH2.textContent.trim() };
    return { ref: 'Palabra Viva', text: 'Hoy tenés una nueva palabra esperándote en la app.' };
  }

  function sendNotification(){
    if (!isEnabled() || !hasPermission() || alreadyNotifiedToday()) return;
    const [h, m] = getHour().split(':').map(Number);
    const now = new Date();
    if ((now.getHours() * 60 + now.getMinutes()) < (h * 60 + m)) return;
    const verse = getTodayVerse();
    try {
      const notif = new Notification('📖 Palabra del día', {
        body: `${verse.text}\n— ${verse.ref}`,
        icon: '/icon.svg',
        badge: '/icon.svg',
        silent: true,
        tag: 'palabra-diaria',
        requireInteraction: false,
        renotify: false
      });
      notif.onclick = () => { window.focus(); notif.close(); };
      markNotifiedToday();
    } catch (e) { console.warn('No se pudo crear notificación:', e); }
  }

  function injectStyles(){
    if (document.getElementById('pv-notif-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-notif-style';
    st.textContent = `
      .pv-notif-card{border-color:rgba(59,130,246,.42)!important;background:linear-gradient(135deg,rgba(59,130,246,.10),var(--card))!important}
      .pv-notif-row{display:flex;align-items:center;gap:10px;margin-top:10px;flex-wrap:wrap}
      .pv-notif-row input[type="time"]{border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:12px;padding:8px 10px;font:inherit}
      .pv-notif-row label{font-size:14px;color:var(--muted);font-weight:700}
      .pv-notif-status{font-size:13px;margin-top:8px;padding:8px 12px;border-radius:12px;background:var(--card2);color:var(--muted)}
      .pv-notif-status.ok{color:#16a34a;background:rgba(34,197,94,.1)}
      .pv-notif-status.warn{color:#ef4444;background:rgba(239,68,68,.1)}
    `;
    document.head.appendChild(st);
  }

  function addHomeCard(){
    const title = document.querySelector('h1')?.textContent || '';
    if (!title.includes('Una palabra para hoy') || document.querySelector('.pv-notif-card')) return;
    if (!isSupported()) return;
    const anchor = document.querySelector('.cr-home-card') || document.querySelector('.pv-ba-card') || document.querySelector('.hero');
    if (!anchor) return;
    const card = document.createElement('section');
    card.className = 'card pv-notif-card';

    function render(){
      const enabled = isEnabled();
      const perm = hasPermission();
      const denied = isDenied();
      const hour = getHour();
      let statusHTML = '';
      if (denied) statusHTML = '<div class="pv-notif-status warn">⚠️ Las notificaciones están bloqueadas en este dispositivo. Activalas desde la configuración del navegador.</div>';
      else if (enabled && perm) statusHTML = `<div class="pv-notif-status ok">✓ Activadas. Te llega cada día a partir de las ${hour}, sin sonido ni vibración.</div>`;
      else if (enabled && !perm) statusHTML = '<div class="pv-notif-status warn">⚠️ Activá el permiso para que funcione.</div>';
      else statusHTML = '<div class="pv-notif-status">Recibí cada día la palabra como notificación silenciosa (sin sonido).</div>';

      card.innerHTML = `
        <p class="ref">🔔 Recordatorio diario</p>
        <h3>Palabra del día como notificación silenciosa</h3>
        <p class="soft">Una notificación discreta cada día, sin sonido ni vibración. Vos elegís la hora.</p>
        ${statusHTML}
        <div class="pv-notif-row">
          <label for="pv-notif-hour">Hora:</label>
          <input id="pv-notif-hour" type="time" value="${hour}" />
          <button class="btn" data-act="toggle">${enabled ? '🔕 Desactivar' : '🔔 Activar'}</button>
        </div>
      `;
      card.querySelector('[data-act="toggle"]').onclick = async () => {
        if (enabled) { setEnabled(false); render(); return; }
        const ok = await requestPerm();
        if (ok) { setEnabled(true); sendNotification(); }
        else alert('No se pudo activar. Asegurate de permitir notificaciones en este sitio.');
        render();
      };
      card.querySelector('#pv-notif-hour').onchange = e => { setHour(e.target.value); render(); };
    }
    render();
    anchor.insertAdjacentElement('afterend', card);
  }

  function boot(){ injectStyles(); addHomeCard(); sendNotification(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.addEventListener('load', boot);
  setInterval(() => { injectStyles(); addHomeCard(); }, 3000);
  setInterval(sendNotification, 60000);
  window.PalabraVivaNotif = { send: sendNotification };
})();
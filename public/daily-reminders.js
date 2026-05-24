(() => {
  // ===========================================================================
  // PALABRA VIVA — Recordatorios diarios (notificaciones locales)
  // ===========================================================================
  // El usuario elige una hora y la app le manda una notificación con un
  // versículo. Sin servidor — usa Notification API + service worker.
  // Limitación: el navegador debe estar abierto al menos UNA vez al día.

  const SETTINGS_KEY = 'pv-reminder-settings';
  const LAST_SENT_KEY = 'pv-reminder-last';
  const SUB_SAVED_KEY = 'pv-push-sub-saved';

  // Web Push — VAPID public key (la privada vive en el servidor)
  const VAPID_PUBLIC = 'BHYBE7lSF9SrZbFFb87HLAbOo6PuD0xL1neYscC-1ELjZ7RCjtU_U_Rv015hoG3qbVjw0rn_akqhlOxDQP_C8pI';
  const SUPA_URL = 'https://fuxojzmwyyecefxczfrn.supabase.co';
  const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1eG9qem13eXllY2VmeGN6ZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTU4MDAsImV4cCI6MjA5NTAzMTgwMH0.M4telJzC3kt7fNN86kvuqpL5-vVmCjdzE-hTDy6Igak';

  // Convertir base64url a Uint8Array (necesario para applicationServerKey)
  function urlBase64ToUint8Array(b64) {
    const padding = '='.repeat((4 - b64.length % 4) % 4);
    const base64 = (b64 + padding).replace(/-/g, '+').replace(/_/g, '/');
    const raw = atob(base64);
    const out = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  }

  // ArrayBuffer → base64url
  function arrayBufferToBase64Url(buf) {
    const bytes = new Uint8Array(buf);
    let bin = '';
    for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  // Suscribir el browser a Web Push y guardar en Supabase
  async function subscribeToPush(hour, minute) {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('[Push] Browser no soporta Web Push');
      return false;
    }
    try {
      const reg = await navigator.serviceWorker.ready;
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC)
        });
      }
      const subData = sub.toJSON();
      const endpoint = subData.endpoint;
      const p256dh = subData.keys?.p256dh;
      const auth_key = subData.keys?.auth;
      if (!endpoint || !p256dh || !auth_key) {
        console.warn('[Push] Subscription incompleta', subData);
        return false;
      }

      // Guardar via RPC SECURITY DEFINER (maneja upsert seguro para anon)
      const token = window.PVAuth?.getToken?.();
      const headers = {
        'apikey': SUPA_KEY,
        'Authorization': 'Bearer ' + (token || SUPA_KEY),
        'Content-Type': 'application/json'
      };
      const body = {
        p_endpoint: endpoint,
        p_p256dh: p256dh,
        p_auth_key: auth_key,
        p_hour: hour || 8,
        p_minute: minute || 0,
        p_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Argentina/Buenos_Aires',
        p_user_agent: navigator.userAgent.slice(0, 200)
      };
      const res = await fetch(`${SUPA_URL}/rest/v1/rpc/upsert_push_subscription`, {
        method: 'POST', headers, body: JSON.stringify(body)
      });
      if (res.ok) {
        const subId = await res.json().catch(() => null);
        try { localStorage.setItem(SUB_SAVED_KEY, endpoint); } catch {}
        console.log('[Push] Suscripción guardada en servidor, id:', subId);
        return true;
      }
      const errTxt = await res.text().catch(() => '');
      console.warn('[Push] Server save failed', res.status, errTxt);
      return false;
    } catch (e) {
      console.error('[Push] Error subscribing:', e);
      return false;
    }
  }

  // Auto-suscribe si el usuario YA dio permiso pero todavía no se guardó la
  // suscripción en el server. Llamado al volver a Home/Ajustes con permiso ok.
  let _autoSubscribing = false;
  async function autoSubscribe(card) {
    if (_autoSubscribing) return;
    _autoSubscribing = true;
    try {
      const settings = loadSettings();
      const t = settings.time || '08:00';
      const [hh, mm] = t.split(':').map(n => parseInt(n, 10));
      console.log('[Recordatorio] Auto-suscribiendo (permiso ya concedido)…');
      const ok = await subscribeToPush(hh, mm);
      if (ok) {
        saveSettings({ ...settings, enabled: true, time: t });
        scheduleNextNotification();
        if (card) renderCardContent(card);
      }
    } finally {
      _autoSubscribing = false;
    }
  }

  // ── Diagnóstico paso a paso (visible al usuario) ──────────────────────────
  async function runDiagnostic(outputEl) {
    const log = (line, kind) => {
      const div = document.createElement('div');
      div.style.cssText = 'padding:8px 12px;margin-bottom:6px;border-radius:8px;font-family:monospace;font-size:13px;line-height:1.4';
      if (kind === 'ok')    div.style.cssText += ';background:rgba(90,111,72,.12);color:var(--good);border-left:3px solid var(--good)';
      if (kind === 'err')   div.style.cssText += ';background:rgba(154,58,58,.12);color:var(--danger);border-left:3px solid var(--danger)';
      if (kind === 'warn')  div.style.cssText += ';background:rgba(164,119,49,.12);color:var(--accent);border-left:3px solid var(--accent)';
      div.textContent = line;
      outputEl.appendChild(div);
    };
    outputEl.innerHTML = '<div style="font-weight:600;margin-bottom:10px">🔍 Diagnóstico del sistema de notificaciones</div>';

    // 1) Soporte del browser
    if (!('Notification' in window))    return log('❌ 1. Tu navegador NO soporta la API de Notificaciones.', 'err');
    if (!('serviceWorker' in navigator)) return log('❌ 1. Tu navegador NO soporta Service Workers.', 'err');
    if (!('PushManager' in window))      return log('❌ 1. Tu navegador NO soporta PushManager.', 'err');
    log('✓ 1. Browser soporta Notification + ServiceWorker + PushManager', 'ok');

    // 2) iOS sin PWA
    if (isIOS() && !isPWA()) {
      return log('❌ 2. iPhone detectado SIN app instalada. Las notificaciones solo funcionan con la app agregada a pantalla de inicio (iOS 16.4+).', 'err');
    }
    log('✓ 2. Plataforma: ' + (isIOS() ? 'iOS' : /Android/.test(navigator.userAgent) ? 'Android' : 'Desktop') + (isPWA() ? ' (PWA instalada)' : ''), 'ok');

    // 3) Permission
    log('• 3. Estado del permiso: ' + Notification.permission, Notification.permission === 'granted' ? 'ok' : Notification.permission === 'denied' ? 'err' : 'warn');
    if (Notification.permission === 'denied') {
      return log('   → Para arreglar: tocá el ícono 🔒 al lado de la URL → permisos → permitir notificaciones → recargar.', 'err');
    }
    if (Notification.permission === 'default') {
      log('   → Pidiendo permiso ahora…', 'warn');
      try {
        const perm = await Notification.requestPermission();
        log('   → Respuesta del usuario: ' + perm, perm === 'granted' ? 'ok' : 'err');
        if (perm !== 'granted') return;
      } catch (e) {
        return log('   ❌ Error al pedir permiso: ' + (e.message || e), 'err');
      }
    }

    // 4) Service worker
    try {
      const reg = await navigator.serviceWorker.ready;
      log('✓ 4. Service Worker activo: ' + (reg.active ? 'sí' : 'no') + ' — scope: ' + reg.scope, reg.active ? 'ok' : 'warn');
    } catch (e) {
      return log('❌ 4. Service Worker no listo: ' + (e.message || e), 'err');
    }

    // 5) Push Manager subscribe
    let sub;
    try {
      const reg = await navigator.serviceWorker.ready;
      sub = await reg.pushManager.getSubscription();
      if (sub) {
        log('✓ 5. Ya existe una suscripción local. Endpoint: ' + sub.endpoint.slice(0, 60) + '…', 'ok');
      } else {
        log('• 5. No hay suscripción todavía. Creando una con VAPID public key…', 'warn');
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC)
        });
        log('✓ 5. Suscripción creada. Endpoint: ' + sub.endpoint.slice(0, 60) + '…', 'ok');
      }
    } catch (e) {
      return log('❌ 5. PushManager.subscribe() falló: ' + (e.name || '') + ' — ' + (e.message || e), 'err');
    }

    // 6) Extraer keys
    const subData = sub.toJSON();
    const endpoint = subData.endpoint;
    const p256dh = subData.keys?.p256dh;
    const auth_key = subData.keys?.auth;
    if (!endpoint || !p256dh || !auth_key) {
      return log('❌ 6. Subscription incompleta. endpoint=' + !!endpoint + ' p256dh=' + !!p256dh + ' auth=' + !!auth_key, 'err');
    }
    log('✓ 6. Keys completas (endpoint, p256dh, auth)', 'ok');

    // 7) POST a la RPC
    log('• 7. Guardando en el servidor via RPC upsert_push_subscription…', 'warn');
    try {
      const token = window.PVAuth?.getToken?.();
      const headers = {
        'apikey': SUPA_KEY,
        'Authorization': 'Bearer ' + (token || SUPA_KEY),
        'Content-Type': 'application/json'
      };
      const settings = loadSettings();
      const [hh, mm] = (settings.time || '08:00').split(':').map(n => parseInt(n, 10));
      const body = {
        p_endpoint: endpoint,
        p_p256dh: p256dh,
        p_auth_key: auth_key,
        p_hour: hh,
        p_minute: mm,
        p_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Argentina/Buenos_Aires',
        p_user_agent: navigator.userAgent.slice(0, 200)
      };
      const res = await fetch(`${SUPA_URL}/rest/v1/rpc/upsert_push_subscription`, {
        method: 'POST', headers, body: JSON.stringify(body)
      });
      const txt = await res.text();
      if (res.ok) {
        log('✓ 7. Servidor guardó la suscripción. ID: ' + txt.replace(/"/g, ''), 'ok');
        try { localStorage.setItem(SUB_SAVED_KEY, endpoint); } catch {}
      } else {
        return log('❌ 7. RPC respondió ' + res.status + ': ' + txt.slice(0, 200), 'err');
      }
    } catch (e) {
      return log('❌ 7. Error de red al guardar: ' + (e.message || e), 'err');
    }

    // 8) Probar mostrando una notificación local
    try {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification('🔍 Diagnóstico OK', {
        body: 'Si ves esto, las notificaciones funcionan. Ahora esperá a tu hora elegida.',
        icon: '/icon-192.png',
        tag: 'pv-diag'
      });
      log('✓ 8. Notificación de prueba enviada exitosamente.', 'ok');
    } catch (e) {
      log('⚠️ 8. No se pudo mostrar la notificación de prueba: ' + (e.message || e), 'warn');
    }

    // 9) Conclusión
    log('🎉 TODO OK. Tu suscripción está activa en el servidor. Vas a recibir el versículo del día a la hora elegida — incluso si la app está cerrada.', 'ok');
  }

  // Cancelar suscripción
  async function unsubscribeFromPush() {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) await sub.unsubscribe();
      try { localStorage.removeItem(SUB_SAVED_KEY); } catch {}
    } catch (e) { console.warn('[Push] unsubscribe error', e); }
  }

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

  // ── Programar setTimeout exacto para la próxima hora objetivo ────────────
  let _scheduledTimer = null;
  function scheduleNextNotification() {
    if (_scheduledTimer) { clearTimeout(_scheduledTimer); _scheduledTimer = null; }
    const s = loadSettings();
    if (!s.enabled || !s.time) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const last = localStorage.getItem(LAST_SENT_KEY);
    if (last === todayStr()) return; // ya se mandó hoy → próximo agendado mañana boot

    const [hh, mm] = s.time.split(':').map(n => parseInt(n, 10));
    const now = new Date();
    const target = new Date();
    target.setHours(hh, mm, 0, 0);

    let delay = target - now;
    if (delay < 0) {
      // Ya pasó hoy → disparar ahora
      checkAndNotify();
      return;
    }
    // Setear timeout exacto. Si el delay es > 24h dividirlo, pero como
    // estamos contando dentro del MISMO día, no debería pasar de 24h.
    _scheduledTimer = setTimeout(() => { _scheduledTimer = null; checkAndNotify(); }, Math.min(delay, 6*60*60*1000));
    console.log('[Recordatorio] Próxima notificación en', Math.round(delay/60000), 'min');
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
    if (document.getElementById('pv-rem-style-v2')) return;
    document.getElementById('pv-rem-style')?.remove();
    const st = document.createElement('style');
    st.id = 'pv-rem-style-v2';
    st.textContent = `
      .pv-rem-card .pv-rem-step{background:var(--card2);border:1px dashed var(--line);border-radius:14px;padding:14px;margin-top:10px}
      .pv-rem-card .pv-rem-step.error{background:rgba(154,58,58,.08);border-color:var(--danger)}
      .pv-rem-card .pv-rem-step.ok{background:rgba(90,111,72,.08);border-color:var(--good)}
      .pv-rem-card .pv-rem-step.warning{background:rgba(164,119,49,.08);border-color:var(--accent)}
      .pv-rem-card .pv-rem-cta{display:block;width:100%;background:linear-gradient(135deg,var(--brand),var(--brand2));color:#fbf3df;border:0;border-radius:999px;padding:14px 18px;font-weight:700;font-size:16px;cursor:pointer;min-height:54px;margin-top:10px;font-family:var(--font-sans)}
      .pv-rem-card .pv-rem-cta:active{transform:scale(.98)}
      .pv-rem-card .pv-rem-cta:disabled{opacity:.6;cursor:wait}
      .pv-rem-card .pv-rem-cta.secondary{background:var(--card);color:var(--text);border:1px solid var(--line)}
      .pv-rem-card .pv-rem-time-row{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:12px 0;padding:10px 14px;background:var(--card2);border-radius:12px}
      .pv-rem-card .pv-rem-time-row label{font-weight:700;font-size:15px}
      .pv-rem-card .pv-rem-time-row input[type="time"]{border:1px solid var(--line);background:var(--card);color:var(--text);border-radius:10px;padding:9px 14px;font:inherit;font-size:18px;font-weight:700}
      .pv-rem-card .pv-rem-status-icon{font-size:22px;line-height:1;flex-shrink:0}
      .pv-rem-card .pv-rem-step-content{display:flex;gap:10px;align-items:flex-start}
      .pv-rem-card .pv-rem-step-content > div{flex:1}
      .pv-rem-card .pv-rem-step h4{margin:0 0 4px;font-size:15px;font-family:var(--font-sans)}
      .pv-rem-card .pv-rem-step p{margin:0;font-size:13px;line-height:1.5;color:var(--text)}
    `;
    document.head.appendChild(st);
  }

  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }
  function isPWA() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }

  function isHomeTab() {
    return (document.querySelector('h1')?.textContent || '').includes('palabra para hoy');
  }

  function renderInAjustes() {
    const isAjustes = isAjustesTab();
    const isHome = isHomeTab();

    // Solo mostrar la card en Ajustes O en Home. En otras pestañas, removerla.
    if (!isAjustes && !isHome) {
      document.querySelector('.pv-rem-card')?.remove();
      return;
    }

    let card = document.querySelector('.pv-rem-card');
    if (!card) {
      injectStyles();
      const stack = document.querySelector('.app .stack');
      if (!stack) return;
      card = document.createElement('section');
      card.className = 'card pv-rem-card';
      // En home: insertar después del hero (no al final)
      if (isHome) {
        const anchor = document.querySelector('.pv-tl-home') || document.querySelector('.pv-ba-card') || document.querySelector('.hero');
        if (anchor) {
          anchor.insertAdjacentElement('afterend', card);
        } else {
          stack.appendChild(card);
        }
      } else {
        stack.appendChild(card);
      }
    }
    renderCardContent(card);
  }

  function renderCardContent(card) {
    const supported = ('Notification' in window) && ('serviceWorker' in navigator) && ('PushManager' in window);
    const perm = supported ? Notification.permission : 'unsupported';
    const settings = loadSettings();
    const enabled = !!settings.enabled;
    const time = settings.time || '08:00';
    const iOSnoPWA = isIOS() && !isPWA();

    let stepsHtml = '';

    // 1. iPhone sin PWA → bloque informativo
    if (iOSnoPWA) {
      stepsHtml = `
        <div class="pv-rem-step warning">
          <div class="pv-rem-step-content">
            <span class="pv-rem-status-icon">📱</span>
            <div>
              <h4>iPhone: instalar primero</h4>
              <p>En iPhone las notificaciones <strong>solo funcionan con la app instalada</strong> (iOS 16.4+).<br>
              En Safari tocá <strong>Compartir 📤 → "Añadir a pantalla de inicio"</strong>. Después abrí la app desde el ícono y volvé acá.</p>
            </div>
          </div>
        </div>`;
    }
    // 2. Browser no soporta nada
    else if (!supported) {
      stepsHtml = `
        <div class="pv-rem-step error">
          <div class="pv-rem-step-content">
            <span class="pv-rem-status-icon">⚠️</span>
            <div>
              <h4>Tu navegador no soporta notificaciones</h4>
              <p>Probá en Chrome o Safari actualizado.</p>
            </div>
          </div>
        </div>`;
    }
    // 3. Permiso denegado → instrucciones para desbloquear
    else if (perm === 'denied') {
      stepsHtml = `
        <div class="pv-rem-step error">
          <div class="pv-rem-step-content">
            <span class="pv-rem-status-icon">🔒</span>
            <div>
              <h4>Notificaciones bloqueadas</h4>
              <p>Las desbloqueaste antes o el navegador las bloqueó. Para activarlas: tocá el ícono <strong>🔒</strong> al lado de la URL → <strong>Permisos del sitio</strong> → Notificaciones → <strong>Permitir</strong>. Después recargá esta página.</p>
            </div>
          </div>
        </div>`;
    }
    // 4. Permiso default → UN SOLO botón que pide permiso + suscribe + activa
    else if (perm === 'default') {
      stepsHtml = `
        <div class="pv-rem-time-row">
          <label for="pv-rem-time">⏰ Hora del envío</label>
          <input type="time" id="pv-rem-time" value="${time}">
        </div>
        <button class="pv-rem-cta" id="pv-rem-oneshot">🔔 Activar versículo diario</button>
        <p style="font-size:12px;color:var(--muted);margin:8px 0 0;text-align:center">
          Una vez activado queda <strong>siempre encendido</strong>. Si querés apagarlo, vení acá y tocá Desactivar.
        </p>`;
    }
    // 5. Permiso granted → mostrar estado activo + opciones
    else if (perm === 'granted') {
      const subscribed = !!localStorage.getItem(SUB_SAVED_KEY);
      // Si todavía no se suscribió pero ya tenemos permiso → auto-suscribir
      if (!subscribed && !enabled) {
        setTimeout(() => autoSubscribe(card), 200);
      }
      stepsHtml = `
        <div class="pv-rem-step ok">
          <div class="pv-rem-step-content">
            <span class="pv-rem-status-icon">✓</span>
            <div>
              <h4>Versículo diario activado</h4>
              <p>Recibirás el versículo del día a las <strong>${time}</strong> aunque la app esté cerrada.${subscribed ? '' : ' <em>Conectando con servidor…</em>'}</p>
            </div>
          </div>
        </div>
        <div class="pv-rem-time-row">
          <label for="pv-rem-time">⏰ Cambiar hora</label>
          <input type="time" id="pv-rem-time" value="${time}">
        </div>
        <button class="pv-rem-cta secondary" id="pv-rem-test">📩 Probar notificación ahora</button>
        <button class="pv-rem-cta secondary" id="pv-rem-disable" style="background:rgba(154,58,58,.10);color:var(--danger);border-color:rgba(154,58,58,.4)">⏸ Desactivar versículo diario</button>
      `;
    }

    card.innerHTML = `
      <h3>🔔 Versículo diario</h3>
      <p class="soft">Recibí un versículo cada día a la hora que elijas, incluso si la app está cerrada (push verdadero con servidor).</p>
      ${stepsHtml}
      <div style="margin-top:14px;padding-top:14px;border-top:1px dashed var(--line)">
        <button class="pv-rem-cta secondary" id="pv-rem-diag" style="font-size:13px;min-height:42px;padding:9px 14px">🔍 Diagnosticar (si no llegan)</button>
        <div id="pv-rem-diag-out" style="margin-top:10px"></div>
      </div>
    `;

    // ── Handlers ─────────────────────────────────────────────────────────
    // Botón ONE-SHOT (permiso + suscripción + activación en un solo tap)
    const oneShotBtn = card.querySelector('#pv-rem-oneshot');
    if (oneShotBtn) {
      oneShotBtn.onclick = async () => {
        console.log('[Recordatorio] Activación en un tap…');
        oneShotBtn.disabled = true;
        oneShotBtn.textContent = '⏳ Pidiendo permiso…';
        try {
          let permResult;
          if (Notification.requestPermission.length) {
            permResult = await new Promise(resolve => {
              const r = Notification.requestPermission(resolve);
              if (r && typeof r.then === 'function') r.then(resolve);
            });
          } else {
            permResult = await Notification.requestPermission();
          }
          console.log('[Recordatorio] Permiso:', permResult);
          if (permResult !== 'granted') {
            oneShotBtn.disabled = false;
            oneShotBtn.textContent = '🔔 Activar versículo diario';
            renderCardContent(card);
            return;
          }
          // Permiso OK → suscribir inmediatamente
          oneShotBtn.textContent = '⏳ Conectando con servidor…';
          const timeInpNow = card.querySelector('#pv-rem-time');
          const t = timeInpNow?.value || '08:00';
          const [hh, mm] = t.split(':').map(n => parseInt(n, 10));
          const ok = await subscribeToPush(hh, mm);
          saveSettings({ enabled: true, time: t });
          scheduleNextNotification();
          if (ok) {
            oneShotBtn.textContent = '✓ ¡Activado!';
          } else {
            oneShotBtn.textContent = '⚠️ Activado solo localmente';
          }
          setTimeout(() => renderCardContent(card), 1000);
        } catch (e) {
          console.error('[Recordatorio] Error activación:', e);
          oneShotBtn.disabled = false;
          oneShotBtn.textContent = '🔔 Activar versículo diario';
          alert('Error: ' + (e.message || e));
        }
      };
    }

    const timeInp = card.querySelector('#pv-rem-time');
    // Cambio de hora cuando ya está activo → re-suscribe automáticamente
    if (timeInp) {
      timeInp.onchange = async () => {
        const t = timeInp.value || '08:00';
        const settings = loadSettings();
        saveSettings({ ...settings, time: t });
        if (Notification.permission === 'granted') {
          const [hh, mm] = t.split(':').map(n => parseInt(n, 10));
          await subscribeToPush(hh, mm);
        }
        scheduleNextNotification();
      };
    }

    const disableBtn = card.querySelector('#pv-rem-disable');
    if (disableBtn) {
      disableBtn.onclick = async () => {
        if (!confirm('¿Apagar el versículo diario? Podés volver a activarlo en cualquier momento.')) return;
        disableBtn.disabled = true;
        disableBtn.textContent = '⏳ Desactivando…';
        await unsubscribeFromPush();
        saveSettings({ enabled: false, time: timeInp?.value || '08:00' });
        setTimeout(() => renderCardContent(card), 500);
      };
    }

    const diagBtn = card.querySelector('#pv-rem-diag');
    const diagOut = card.querySelector('#pv-rem-diag-out');
    if (diagBtn && diagOut) {
      diagBtn.onclick = async () => {
        diagBtn.disabled = true;
        diagBtn.textContent = '⏳ Diagnosticando…';
        await runDiagnostic(diagOut);
        diagBtn.disabled = false;
        diagBtn.textContent = '🔍 Diagnosticar de nuevo';
      };
    }

    const testBtn = card.querySelector('#pv-rem-test');
    if (testBtn) {
      testBtn.onclick = async () => {
        const verse = todaysVerse();
        const [text, ref] = verse.split(' — ');
        const title = '📖 Palabra Viva — ' + (ref || 'Hoy');
        const body = text || verse;
        try {
          if (navigator.serviceWorker?.ready) {
            const reg = await navigator.serviceWorker.ready;
            await reg.showNotification(title, { body, icon: '/icon-192.png', tag: 'pv-test', requireInteraction: false });
          } else {
            new Notification(title, { body, icon: '/icon-192.png' });
          }
          testBtn.textContent = '✓ Enviada';
          setTimeout(() => { testBtn.textContent = '📩 Probar notificación ahora'; }, 2000);
        } catch (e) {
          console.error('[Recordatorio] Test error:', e);
          alert('No se pudo mostrar la notificación: ' + (e.message || e));
        }
      };
    }
  }

  function isAjustesTab() {
    return (document.querySelector('h1')?.textContent || '').trim() === 'Ajustes';
  }

  function boot() {
    renderInAjustes();
    checkAndNotify();
    scheduleNextNotification(); // setTimeout exacto a la hora objetivo
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('load', boot);
  // Solo refresca el render si cambió la pestaña — no machaca el card si ya existe
  setInterval(() => {
    if (!isAjustesTab() && document.querySelector('.pv-rem-card')) {
      document.querySelector('.pv-rem-card')?.remove();
    } else if (isAjustesTab() && !document.querySelector('.pv-rem-card')) {
      renderInAjustes();
    }
  }, 3000);
  // Verificar cada 60s mientras la app esté abierta (fallback al timer exacto)
  setInterval(checkAndNotify, 60000);
  // Re-agendar al volver al primer plano (ej. usuario vuelve después de mediodía)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) { checkAndNotify(); scheduleNextNotification(); }
  });

  // Re-sincronizar suscripción cuando el usuario inicia sesión
  // (si subscribió como anónimo, ahora se asocia a su user_id)
  document.addEventListener('pv-auth-change', async (ev) => {
    if (!ev.detail) return; // logout, no sync
    if (Notification.permission !== 'granted') return;
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (!sub) return; // no hay sub local todavía
      // Re-llamar al upsert con auth.uid() ahora logueado
      const settings = loadSettings();
      const t = settings.time || '08:00';
      const [hh, mm] = t.split(':').map(n => parseInt(n, 10));
      console.log('[Recordatorio] Re-asociando suscripción anónima al usuario logueado…');
      await subscribeToPush(hh, mm);
    } catch (e) { console.warn('[Recordatorio] auto-sync fail:', e); }
  });

  window.PVReminders = {
    check: checkAndNotify,
    scheduleNext: scheduleNextNotification,
    // Función para sincronizar manualmente la suscripción al server
    syncSubscription: async (hour, minute) => {
      return subscribeToPush(hour || 8, minute || 0);
    }
  };
})();

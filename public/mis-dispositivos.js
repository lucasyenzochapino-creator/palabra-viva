(() => {
  // ===========================================================================
  // PALABRA VIVA — Mis dispositivos / sesiones activas
  // ===========================================================================
  // Muestra los dispositivos que tienen notificaciones activadas para esta
  // cuenta. Permite desactivar cualquiera. Útil cuando una misma persona usa
  // varios teléfonos o cuando la cuenta se compartió.
  //
  // Privacidad: cada dispositivo tiene SU PROPIO Web Push endpoint único.
  // La tabla push_subscriptions guarda 1 fila por (user_id, endpoint).
  // El backend envía notificaciones a todos los endpoints del usuario.

  const SUPA_URL = 'https://fuxojzmwyyecefxczfrn.supabase.co';
  const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1eG9qem13eXllY2VmeGN6ZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTU4MDAsImV4cCI6MjA5NTAzMTgwMH0.M4telJzC3kt7fNN86kvuqpL5-vVmCjdzE-hTDy6Igak';
  const SUB_SAVED_KEY = 'pv-push-sub-saved';

  // Parsear user-agent a algo legible
  function prettyDevice(ua) {
    if (!ua) return 'Dispositivo desconocido';
    if (/iPhone/.test(ua))    return '📱 iPhone';
    if (/iPad/.test(ua))      return '📱 iPad';
    if (/Android/.test(ua) && /Mobile/.test(ua)) {
      const m = ua.match(/Android \d+(?:\.\d+)?/);
      return '🤖 Android' + (m ? ' (' + m[0].replace('Android ', '') + ')' : '') + ' — celular';
    }
    if (/Android/.test(ua))   return '🤖 Android — tablet';
    if (/Windows/.test(ua))   return '💻 Windows PC';
    if (/Mac OS X|Macintosh/.test(ua)) return '💻 Mac';
    if (/Linux/.test(ua))     return '💻 Linux PC';
    return '🌐 ' + ua.slice(0, 40);
  }
  function browserName(ua) {
    if (!ua) return '';
    if (/Edg/.test(ua))     return 'Edge';
    if (/OPR|Opera/.test(ua)) return 'Opera';
    if (/Firefox/.test(ua)) return 'Firefox';
    if (/Chrome/.test(ua))  return 'Chrome';
    if (/Safari/.test(ua))  return 'Safari';
    return '';
  }

  function injectStyles() {
    if (document.getElementById('pv-disp-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-disp-style';
    st.textContent = `
      .pv-disp-panel{position:fixed;inset:0;z-index:1000050;background:var(--bg);color:var(--text);overflow-y:auto;padding:14px 14px calc(80px + env(safe-area-inset-bottom))}
      .pv-disp-inner{max-width:680px;margin:0 auto;display:flex;flex-direction:column;gap:14px}
      .pv-disp-head{display:flex;justify-content:space-between;gap:10px;position:sticky;top:0;background:var(--bg);padding:8px 0 14px;z-index:5;border-bottom:1px solid var(--line)}
      .pv-disp-head h1{margin:4px 0;font-size:clamp(22px,5.5vw,26px);letter-spacing:-.02em}
      .pv-disp-head p{font-size:13px;color:var(--muted);margin:0;letter-spacing:.06em;text-transform:uppercase;font-family:var(--font-sans);font-weight:600}
      .pv-disp-close{border:1px solid var(--line);background:var(--card);color:var(--text);border-radius:999px;padding:9px 14px;font-weight:600;cursor:pointer;height:fit-content;font-size:13px}
      .pv-disp-intro{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px;font-size:14px;line-height:1.6;color:var(--text)}
      .pv-disp-card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:8px}
      .pv-disp-card.current{border-color:var(--brand);background:linear-gradient(135deg,rgba(107,31,31,.06),var(--card))}
      .pv-disp-card h3{margin:0;font-size:16px;letter-spacing:-.005em;display:flex;align-items:center;gap:8px}
      .pv-disp-card .badge-now{font-size:10px;background:var(--brand);color:#fbf3df;padding:2px 8px;border-radius:999px;letter-spacing:.06em;text-transform:uppercase}
      .pv-disp-card .meta{font-size:12px;color:var(--muted);display:flex;gap:10px;flex-wrap:wrap}
      .pv-disp-card .actions{display:flex;gap:8px;justify-content:flex-end;margin-top:4px}
      .pv-disp-card .actions button{border:1px solid var(--line);background:transparent;color:var(--text);border-radius:999px;padding:6px 12px;font-size:12px;cursor:pointer;font-weight:600;font-family:var(--font-sans)}
      .pv-disp-card .actions button.danger{border-color:rgba(154,58,58,.4);color:var(--danger);background:rgba(154,58,58,.06)}
      .pv-disp-empty{text-align:center;color:var(--muted);padding:24px;background:var(--card);border:1px dashed var(--line);border-radius:14px}
    `;
    document.head.appendChild(st);
  }

  async function fetchMyDevices() {
    const token = window.PVAuth?.getToken?.();
    if (!token) return null;
    const user = window.PVAuth?.getUser?.();
    if (!user?.id) return null;
    try {
      const res = await fetch(`${SUPA_URL}/rest/v1/push_subscriptions?user_id=eq.${user.id}&select=*&order=created_at.desc`, {
        headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) return null;
      return await res.json();
    } catch { return null; }
  }

  async function deactivateDevice(subId) {
    const token = window.PVAuth?.getToken?.();
    if (!token) return false;
    try {
      const res = await fetch(`${SUPA_URL}/rest/v1/push_subscriptions?id=eq.${subId}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPA_KEY,
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ active: false })
      });
      return res.ok;
    } catch { return false; }
  }

  async function open() {
    if (document.querySelector('.pv-disp-panel')) return;
    injectStyles();
    history.pushState({ pvDisp: true }, '', location.href.split('#')[0] + '#dispositivos');

    const panel = document.createElement('section');
    panel.className = 'pv-disp-panel';
    panel.setAttribute('aria-label', 'Mis dispositivos');

    const user = window.PVAuth?.getUser?.();
    const currentEndpoint = localStorage.getItem(SUB_SAVED_KEY) || '';

    panel.innerHTML = `
      <div class="pv-disp-inner">
        <div class="pv-disp-head">
          <div>
            <p>Privacidad y seguridad</p>
            <h1>📱 Mis dispositivos</h1>
          </div>
          <button class="pv-disp-close" data-close>Cerrar ✕</button>
        </div>
        <div class="pv-disp-intro">
          <strong>¿Cómo funciona?</strong> Cada celular o computadora donde activás el versículo diario aparece acá. Recibís la notificación en TODOS los dispositivos activos al mismo tiempo. Si dejaste tu cuenta abierta en un teléfono que ya no usás, podés desactivarlo desde acá — y dejará de recibir notificaciones. <br><br>
          ${user ? `Cuenta: <strong>${user.email}</strong>` : '⚠️ Iniciá sesión para ver tus dispositivos.'}
        </div>
        <div id="pv-disp-list">${user ? '⏳ Cargando…' : ''}</div>
      </div>
    `;

    function close(useHistory = true) {
      window.removeEventListener('popstate', onPop);
      panel.remove();
      if (useHistory && location.hash === '#dispositivos') {
        window._pvPanelClosing = true;
        history.back();
      }
    }
    function onPop() {
      if (location.hash === '#dispositivos') return;
      window.removeEventListener('popstate', onPop);
      panel.remove();
    }
    panel.querySelector('[data-close]').onclick = () => close(true);
    document.body.appendChild(panel);
    window.addEventListener('popstate', onPop);

    if (!user) return;

    async function refresh() {
      const list = panel.querySelector('#pv-disp-list');
      list.innerHTML = '⏳ Cargando…';

      // Diagnóstico local del browser
      let browserHasSub = false;
      let browserEndpoint = '';
      try {
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.ready;
          const sub = await reg.pushManager.getSubscription();
          if (sub) {
            browserHasSub = true;
            browserEndpoint = sub.endpoint;
          }
        }
      } catch {}
      const browserPerm = ('Notification' in window) ? Notification.permission : 'unsupported';

      const devices = await fetchMyDevices();

      // CASO ESPECIAL: hay sub local pero NO en server (o user_id=null por subscribir antes de login)
      // → ofrecer "Sincronizar"
      const localButNotServer = browserHasSub && (devices === null || !devices.some(d => d.endpoint === browserEndpoint));

      let diagHtml = `
        <div class="pv-disp-card" style="background:var(--card2)">
          <h3>🔍 Estado en este dispositivo</h3>
          <div class="meta" style="flex-direction:column;align-items:flex-start;gap:4px">
            <span>${browserPerm === 'granted' ? '✓' : '○'} Permiso de notificaciones: <strong>${browserPerm}</strong></span>
            <span>${browserHasSub ? '✓' : '○'} Suscripción en el browser: <strong>${browserHasSub ? 'sí' : 'no'}</strong></span>
            <span>${devices && devices.length ? '✓' : '○'} Dispositivos en tu cuenta: <strong>${devices ? devices.length : '?'}</strong></span>
          </div>
          ${localButNotServer ? `<div class="actions"><button id="pv-disp-sync" style="background:var(--brand);color:#fbf3df;border:0;font-size:13px">🔄 Sincronizar este dispositivo con tu cuenta</button></div>` : ''}
        </div>
      `;

      if (devices === null) {
        list.innerHTML = diagHtml + '<div class="pv-disp-empty">No pudimos cargar tus dispositivos del servidor. Probá de nuevo.</div>';
        bindSync(list);
        return;
      }
      if (!devices.length) {
        list.innerHTML = diagHtml + `<div class="pv-disp-empty">
          Todavía no hay dispositivos asociados a tu cuenta.<br>
          ${browserHasSub
            ? '<small style="color:var(--accent)">Tu browser SÍ tiene una suscripción local. Tocá <strong>🔄 Sincronizar</strong> arriba para vincularla a tu cuenta.</small>'
            : browserPerm === 'granted'
              ? '<small>Andá a inicio y tocá <strong>🔔 Activar versículo diario</strong> para suscribirte.</small>'
              : '<small>Andá a inicio y tocá <strong>🔔 Activar versículo diario</strong>, después aceptá el permiso del navegador.</small>'
          }
        </div>`;
        bindSync(list);
        return;
      }
      const escape = s => (s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
      list.innerHTML = diagHtml + devices.map(d => {
        const isCurrent = d.endpoint === currentEndpoint;
        const created = d.created_at ? new Date(d.created_at).toLocaleDateString('es-AR') : '?';
        const lastSent = d.last_sent_at ? new Date(d.last_sent_at).toLocaleDateString('es-AR') : 'nunca';
        return `<article class="pv-disp-card ${isCurrent ? 'current' : ''}">
          <h3>${escape(prettyDevice(d.user_agent))} ${isCurrent ? '<span class="badge-now">Este</span>' : ''}</h3>
          <div class="meta">
            <span>${escape(browserName(d.user_agent))}</span>
            <span>⏰ ${String(d.hour).padStart(2,'0')}:${String(d.minute||0).padStart(2,'0')}</span>
            <span>📅 Agregado: ${created}</span>
            <span>📬 Último envío: ${lastSent}</span>
            <span style="color:${d.active ? 'var(--good)' : 'var(--danger)'}">${d.active ? '● Activo' : '○ Inactivo'}</span>
          </div>
          ${d.active ? `<div class="actions">
            <button class="danger" data-deact="${d.id}">🚫 Apagar notificaciones aquí</button>
          </div>` : ''}
        </article>`;
      }).join('');

      list.querySelectorAll('[data-deact]').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!confirm('¿Apagar las notificaciones de ese dispositivo? Podés volver a activarlas desde ese teléfono cuando quieras.')) return;
          btn.disabled = true; btn.textContent = '⏳';
          const ok = await deactivateDevice(btn.dataset.deact);
          if (ok) refresh();
          else { btn.disabled = false; btn.textContent = '❌ Error — reintentar'; }
        });
      });
      bindSync(list);
    }

    // Handler del botón "Sincronizar"
    function bindSync(list) {
      const syncBtn = list.querySelector('#pv-disp-sync');
      if (!syncBtn) return;
      syncBtn.onclick = async () => {
        syncBtn.disabled = true;
        syncBtn.textContent = '⏳ Sincronizando…';
        try {
          // Re-llamar a la función pública de daily-reminders para que
          // guarde la suscripción en server (con el user_id ya logueado)
          const settings = (() => { try { return JSON.parse(localStorage.getItem('pv-reminder-settings') || '{}'); } catch { return {}; } })();
          const t = settings.time || '08:00';
          const [hh, mm] = t.split(':').map(n => parseInt(n, 10));
          // Trigger subscription via daily-reminders module
          if (window.PVReminders?.syncSubscription) {
            await window.PVReminders.syncSubscription(hh, mm);
          } else {
            // Fallback: re-subscribir directo
            const reg = await navigator.serviceWorker.ready;
            let sub = await reg.pushManager.getSubscription();
            if (!sub) throw new Error('No hay suscripción local');
            const subData = sub.toJSON();
            const token = window.PVAuth?.getToken?.();
            const res = await fetch(`${SUPA_URL}/rest/v1/rpc/upsert_push_subscription`, {
              method: 'POST',
              headers: {
                'apikey': SUPA_KEY,
                'Authorization': 'Bearer ' + (token || SUPA_KEY),
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                p_endpoint: subData.endpoint,
                p_p256dh: subData.keys?.p256dh,
                p_auth_key: subData.keys?.auth,
                p_hour: hh, p_minute: mm,
                p_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Argentina/Buenos_Aires',
                p_user_agent: navigator.userAgent.slice(0, 200)
              })
            });
            if (!res.ok) throw new Error('HTTP ' + res.status);
          }
          syncBtn.textContent = '✓ Sincronizado';
          setTimeout(refresh, 800);
        } catch (e) {
          syncBtn.disabled = false;
          syncBtn.textContent = '❌ Error: ' + (e.message || e);
        }
      };
    }
    refresh();
  }

  window.PVDispositivos = { open };
})();

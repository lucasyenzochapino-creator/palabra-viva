(() => {
  // ===========================================================================
  // PALABRA VIVA — Sistema de Sugerencias
  // ===========================================================================
  // El usuario manda una sugerencia desde Ajustes. Se guarda en Supabase
  // (tabla suggestions) y además se abre el cliente de mail con palabraviva
  // mm@gmail.com pre-llenado para que la dueña la reciba al toque.

  const SUPA_URL = 'https://fuxojzmwyyecefxczfrn.supabase.co';
  const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1eG9qem13eXllY2VmeGN6ZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTU4MDAsImV4cCI6MjA5NTAzMTgwMH0.M4telJzC3kt7fNN86kvuqpL5-vVmCjdzE-hTDy6Igak';
  const ADMIN_EMAIL = 'palabravivamm@gmail.com';

  function injectStyles() {
    if (document.getElementById('pv-fb-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-fb-style';
    st.textContent = `
      .pv-fb-modal{position:fixed;inset:0;z-index:9650;background:rgba(0,0,0,.8);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:18px}
      .pv-fb-card{background:var(--card,#171722);color:var(--text,#f8fafc);border:1px solid var(--line,#333447);border-radius:24px;padding:24px 22px;max-width:480px;width:100%;display:flex;flex-direction:column;gap:14px;box-shadow:0 24px 60px rgba(0,0,0,.5);max-height:90vh;overflow-y:auto}
      .pv-fb-close{align-self:flex-end;background:var(--card2,#202031);border:1px solid var(--line,#333447);color:var(--text,#f8fafc);border-radius:999px;padding:7px 14px;font-weight:900;cursor:pointer}
      .pv-fb-title{margin:0;font-size:24px;letter-spacing:-.02em}
      .pv-fb-sub{margin:0;color:var(--muted,#c8c5d8);font-size:14px;line-height:1.5}
      .pv-fb-input{width:100%;border:1px solid var(--line,#333447);background:var(--card2,#202031);color:var(--text,#f8fafc);border-radius:16px;padding:14px 16px;font:inherit;font-size:16px;outline:none;box-sizing:border-box;resize:vertical;min-height:120px}
      .pv-fb-input:focus{border-color:var(--brand,#f59e0b)}
      .pv-fb-label{display:block;color:var(--muted,#c8c5d8);font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;margin:0 0 6px}
      .pv-fb-btn{background:linear-gradient(135deg,var(--brand,#f59e0b),var(--brand2,#ec4899));color:#fff;border:0;border-radius:999px;padding:14px 20px;font-weight:900;font-size:16px;min-height:54px;cursor:pointer}
      .pv-fb-btn:active{transform:scale(.98)}
      .pv-fb-btn:disabled{opacity:.6;cursor:wait}
      .pv-fb-msg{font-size:14px;padding:10px 12px;border-radius:12px;display:none}
      .pv-fb-msg.ok{display:block;background:rgba(34,197,94,.15);color:#86efac;border:1px solid rgba(34,197,94,.4)}
      .pv-fb-msg.err{display:block;background:rgba(251,113,133,.15);color:#fda4af;border:1px solid rgba(251,113,133,.4)}
      .pv-fb-count{font-size:12px;color:var(--muted,#c8c5d8);text-align:right;margin:-6px 0 0}
    `;
    document.head.appendChild(st);
  }

  function openFeedback() {
    if (document.querySelector('.pv-fb-modal')) return;
    injectStyles();

    const user = window.PVAuth?.getUser?.();
    const defaultEmail = user?.email || '';
    const defaultName  = user?.profile?.display_name || (user?.email ? user.email.split('@')[0] : '');

    const modal = document.createElement('div');
    modal.className = 'pv-fb-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Enviar sugerencia');
    modal.innerHTML = `
      <div class="pv-fb-card">
        <button class="pv-fb-close" data-close>Cerrar ✕</button>
        <h2 class="pv-fb-title">💌 Enviar sugerencia</h2>
        <p class="pv-fb-sub">Contanos qué te gustaría que mejore o agregue Palabra Viva. Lo leemos todo 🙏</p>
        <div class="pv-fb-msg" id="pv-fb-msg"></div>
        <div>
          <label class="pv-fb-label" for="pv-fb-name">Tu nombre <span style="text-transform:none;font-weight:500">(opcional)</span></label>
          <input id="pv-fb-name" class="pv-fb-input" type="text" placeholder="Cómo te llamás" value="${defaultName.replace(/"/g, '&quot;')}" style="min-height:0;padding:11px 14px">
        </div>
        <div>
          <label class="pv-fb-label" for="pv-fb-email">Tu email <span style="text-transform:none;font-weight:500">(opcional, para responderte)</span></label>
          <input id="pv-fb-email" class="pv-fb-input" type="email" placeholder="tu@correo.com" value="${defaultEmail.replace(/"/g, '&quot;')}" style="min-height:0;padding:11px 14px">
        </div>
        <div>
          <label class="pv-fb-label" for="pv-fb-msg-input">Tu sugerencia</label>
          <textarea id="pv-fb-msg-input" class="pv-fb-input" rows="5" maxlength="2000" placeholder="Ej: me encantaría que se pueda escuchar la Biblia en la voz de…"></textarea>
          <p class="pv-fb-count" id="pv-fb-count">0 / 2000</p>
        </div>
        <button class="pv-fb-btn" id="pv-fb-send">📨 Enviar sugerencia</button>
        <p style="font-size:12px;color:var(--muted,#c8c5d8);text-align:center;margin:0">Recibimos tu mensaje en <strong>${ADMIN_EMAIL}</strong></p>
      </div>
    `;

    const close = () => modal.remove();
    modal.querySelector('[data-close]').onclick = close;
    modal.addEventListener('click', e => { if (e.target === modal) close(); });

    const msgInput = modal.querySelector('#pv-fb-msg-input');
    const count    = modal.querySelector('#pv-fb-count');
    msgInput.addEventListener('input', () => {
      count.textContent = `${msgInput.value.length} / 2000`;
    });

    const showMsg = (text, kind) => {
      const el = modal.querySelector('#pv-fb-msg');
      el.textContent = text;
      el.className = 'pv-fb-msg ' + kind;
    };

    modal.querySelector('#pv-fb-send').addEventListener('click', async () => {
      const btn = modal.querySelector('#pv-fb-send');
      const name    = modal.querySelector('#pv-fb-name').value.trim();
      const email   = modal.querySelector('#pv-fb-email').value.trim();
      const message = msgInput.value.trim();

      if (message.length < 3) {
        showMsg('Escribí al menos unas palabras 🙏', 'err');
        return;
      }
      if (message.length > 2000) {
        showMsg('Demasiado largo. Máximo 2000 caracteres.', 'err');
        return;
      }

      btn.disabled = true;
      btn.textContent = '⏳ Enviando…';

      // 1) Guardar en Supabase (no bloquea el flujo si falla)
      let savedOk = false;
      try {
        const token = window.PVAuth?.getToken?.();
        const headers = {
          'apikey': SUPA_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        };
        if (token) headers['Authorization'] = 'Bearer ' + token;
        const res = await fetch(`${SUPA_URL}/rest/v1/suggestions`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            user_id: window.PVAuth?.getUser?.()?.id || null,
            email: email || null,
            name: name || null,
            message,
            user_agent: navigator.userAgent.slice(0, 200)
          })
        });
        savedOk = res.ok;
        if (!savedOk) console.warn('Supabase suggestion save failed:', res.status, await res.text().catch(()=>'?'));
      } catch (e) {
        console.warn('No se pudo guardar sugerencia en Supabase:', e);
      }

      // 2) Abrir cliente de mail con la sugerencia pre-llenada
      const subject = encodeURIComponent('💌 Sugerencia de Palabra Viva' + (name ? ` — ${name}` : ''));
      const bodyLines = [
        `De: ${name || '(sin nombre)'}`,
        `Email: ${email || '(no dejó)'}`,
        '',
        'Mensaje:',
        message,
        '',
        '— enviado desde Palabra Viva'
      ];
      const body = encodeURIComponent(bodyLines.join('\n'));
      const mailto = `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`;

      // Mostrar éxito y dar la opción de mandar mail
      if (savedOk) {
        showMsg('✅ ¡Gracias! Recibimos tu sugerencia. Si querés, también podés mandárnosla por mail.', 'ok');
      } else {
        showMsg('No pudimos guardarla en línea. Vamos a abrir el correo para que nos llegue igual.', 'err');
      }

      btn.disabled = false;
      btn.innerHTML = '📨 Enviar también por mail';
      btn.onclick = () => {
        window.location.href = mailto;
        setTimeout(close, 800);
      };

      // Si la grabación falló, abrir mailto automático
      if (!savedOk) {
        setTimeout(() => { window.location.href = mailto; }, 600);
      }
    });

    document.body.appendChild(modal);
    setTimeout(() => msgInput.focus(), 100);
  }

  window.PVFeedback = { open: openFeedback };
})();

(() => {
  // ── Palabra Viva — Card de donación (sutil, al fondo) ─────────────────────
  const CAFECITO_URL    = 'https://cafecito.app/palabravivamm';
  const MERCADOPAGO_URL = 'https://link.mercadopago.com.ar/palabravivamm';
  // CBU/Alias para transferencia directa (0% comisión)
  // CONFIGURAR: cambiá ALIAS por tu alias real (ej: palabra.viva.mp)
  const ALIAS = 'palabra.viva.mp';
  const CBU   = 'Pedir por mail';

  const $ = (s, r = document) => r.querySelector(s);

  function injectStyles() {
    if ($('#pv-dona-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-dona-style';
    st.textContent = `
      /* Modal de donación */
      .pv-dona-modal{position:fixed;inset:0;z-index:9600;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:18px}
      .pv-dona-modal-card{background:var(--card,#171722);color:var(--text,#f8fafc);border:1px solid var(--line,#333447);border-radius:24px;padding:24px 22px;max-width:440px;width:100%;box-shadow:0 24px 60px rgba(0,0,0,.5);position:relative}
      .pv-dona-modal-close{position:absolute;top:14px;right:14px;background:var(--card2,#202031);border:1px solid var(--line,#333447);color:var(--text,#f8fafc);border-radius:50%;width:36px;height:36px;font-size:16px;cursor:pointer;line-height:1}
      .pv-dona-modal-btn{display:flex;align-items:center;justify-content:center;gap:8px;padding:14px 18px;border-radius:999px;text-decoration:none;font-weight:900;font-size:16px;min-height:52px;border:0;cursor:pointer}
      .pv-dona-modal-btn:active{transform:scale(.98)}
      /* Wrapper al fondo del .app */
      .pv-dona-wrap{
        margin-top:28px;
        padding-top:18px;
        border-top:1px solid var(--line,#333447);
        text-align:center;
      }

      /* Texto pequeño y discreto como pie de página */
      .pv-dona-hint{
        font-size:13px;
        color:var(--muted,#c8c5d8);
        opacity:.7;
        margin:0 0 10px;
        line-height:1.4;
      }

      /* Botones chicos, sin relleno fuerte */
      .pv-dona-btns{
        display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-bottom:10px;
      }
      .pv-dona-btn{
        display:inline-flex;align-items:center;gap:5px;
        border:1px solid var(--line,#333447);
        background:var(--card2,#202031);
        color:var(--text,#f8fafc);
        border-radius:999px;
        padding:8px 14px;
        font-size:13px;font-weight:900;
        text-decoration:none;cursor:pointer;
        transition:opacity .15s;
      }
      .pv-dona-btn:hover{opacity:.8}

      /* Sección premium colapsable */
      .pv-dona-toggle{
        background:none;border:0;
        color:var(--muted,#c8c5d8);
        font-size:12px;font-weight:700;
        cursor:pointer;padding:2px 0;opacity:.6;
        letter-spacing:.02em;
      }
      .pv-dona-toggle:hover{opacity:1}
      .pv-dona-premium{
        display:none;
        margin-top:10px;
        text-align:left;
        background:var(--card2,#202031);
        border:1px solid var(--line,#333447);
        border-radius:16px;
        padding:12px 14px;
      }
      .pv-dona-premium.open{display:block}
      .pv-dona-premium p{font-size:13px;color:var(--muted,#c8c5d8);margin:0 0 6px}
      .pv-dona-premium ul{margin:0;padding-left:16px;color:var(--muted,#c8c5d8);font-size:13px}
      .pv-dona-premium li{margin:4px 0}
    `;
    document.head.appendChild(st);
  }

  function isHome() {
    return (document.querySelector('h1')?.textContent || '').includes('Una palabra para hoy');
  }

  function addDona() {
    if (!isHome()) { document.querySelector('.pv-dona-wrap')?.remove(); return; }
    if (document.querySelector('.pv-dona-wrap')) return;

    // Anclar al final del .app
    const app = document.querySelector('.app');
    if (!app) return;

    const wrap = document.createElement('div');
    wrap.className = 'pv-dona-wrap';
    wrap.innerHTML = `
      <p class="pv-dona-hint">❤️ Esta app es gratuita. Si querés apoyarla o invitar a alguien:</p>
      <div class="pv-dona-btns">
        <button class="pv-dona-btn" data-act="dona-1vez">💝 Donar una vez</button>
        <button class="pv-dona-btn" data-act="dona-mes">🔁 Donar todos los meses</button>
        <button class="pv-dona-btn" data-share>📤 Invitar amigo</button>
      </div>
      <button class="pv-dona-toggle">⭐ Funciones premium que vienen ▾</button>
      <div class="pv-dona-premium">
        <p>Estamos preparando funciones especiales:</p>
        <ul>
          <li>📖 Planes de lectura personalizados</li>
          <li>🔔 Recordatorios de oración</li>
          <li>📒 Diario espiritual privado</li>
          <li>🎨 Temas visuales exclusivos</li>
          <li>📥 Descarga offline de contenido</li>
        </ul>
      </div>
    `;

    // Modal explicativo para elegir método de donación
    function openDonationModal(monthly) {
      const m = document.createElement('div');
      m.className = 'pv-dona-modal';
      m.innerHTML = `
        <div class="pv-dona-modal-card">
          <button class="pv-dona-modal-close" data-close>✕</button>
          <div style="font-size:48px;text-align:center;line-height:1">${monthly ? '🔁' : '💝'}</div>
          <h2 style="margin:6px 0;text-align:center;font-size:24px">${monthly ? 'Donar todos los meses' : 'Donar una vez'}</h2>
          ${monthly
            ? `<p style="margin:0 0 4px">Para que tu donación se repita cada mes:</p>
               <ol style="margin:0 0 10px;padding-left:22px;font-size:15px;line-height:1.55">
                 <li>Tocá el botón <strong>Mercado Pago</strong> de abajo.</li>
                 <li>Ingresá el monto que quieras donar.</li>
                 <li>Después de pagar, andá a <strong>Tu cuenta de Mercado Pago → Pagos programados / suscripciones</strong> y activá la repetición mensual.</li>
                 <li>Cafecito también permite suscripción mensual — elegí "Apoyo recurrente" al donar.</li>
               </ol>`
            : `<p style="margin:0 0 10px;font-size:15px">Elegí el método que prefieras. Tu donación llega completa al sostenimiento de Palabra Viva.</p>`}
          <div style="display:flex;flex-direction:column;gap:10px;margin-top:8px">
            <!-- ⭐ TRANSFERENCIA: 0% comisión, llega 100% -->
            <button class="pv-dona-modal-btn" data-show-alias style="background:linear-gradient(135deg,#3c5c3a,#5a7a4a);color:white;border:0;cursor:pointer;font:inherit">
              💸 Transferencia bancaria <span style="font-size:11px;background:rgba(255,255,255,.25);padding:2px 6px;border-radius:6px;margin-left:6px">0% comisión</span>
            </button>
            <a href="${CAFECITO_URL}" target="_blank" rel="noopener noreferrer" class="pv-dona-modal-btn" style="background:linear-gradient(135deg,#7c4a1e,#b45309);color:white">☕ Cafecito ${monthly ? '(con opción mensual)' : ''} <span style="font-size:11px;background:rgba(255,255,255,.25);padding:2px 6px;border-radius:6px;margin-left:6px">~7% comisión</span></a>
            <a href="${MERCADOPAGO_URL}" target="_blank" rel="noopener noreferrer" class="pv-dona-modal-btn" style="background:linear-gradient(135deg,#00b3e3,#0a83cf);color:white">💳 Mercado Pago <span style="font-size:11px;background:rgba(255,255,255,.25);padding:2px 6px;border-radius:6px;margin-left:6px">~6% comisión</span></a>
          </div>
          <div class="pv-dona-alias-box" style="display:none;background:var(--card2);border:1px dashed var(--brand,#7c4a1e);border-radius:14px;padding:14px;margin-top:10px">
            <p style="font-size:13px;color:var(--muted);margin:0 0 8px;font-weight:600">📨 Datos para transferir (llega 100% sin comisiones)</p>
            <div style="background:var(--card);border-radius:10px;padding:10px 12px;margin-bottom:8px">
              <p style="font-size:11px;color:var(--muted);margin:0 0 2px;letter-spacing:.08em;text-transform:uppercase">Alias</p>
              <p style="font-size:18px;font-weight:700;margin:0;font-family:monospace;letter-spacing:.04em">${ALIAS}</p>
            </div>
            <button class="pv-dona-modal-btn" data-copy-alias style="background:var(--brand,#7c4a1e);color:white;border:0;cursor:pointer;font:inherit;width:100%">📋 Copiar alias</button>
            <p style="font-size:12px;color:var(--muted);margin:10px 0 0;line-height:1.4">Para CBU completo o más info, escribinos a <strong>palabravivamm@gmail.com</strong>. Llegamos sin descuentos.</p>
          </div>
          <p style="font-size:12px;color:var(--muted,#a08060);text-align:center;margin:10px 0 0">Gracias por sostener este proyecto 🙏</p>
        </div>`;
      // Handler para mostrar/ocultar alias
      m.querySelector('[data-show-alias]')?.addEventListener('click', () => {
        const box = m.querySelector('.pv-dona-alias-box');
        box.style.display = box.style.display === 'none' ? 'block' : 'none';
      });
      // Copiar alias
      m.querySelector('[data-copy-alias]')?.addEventListener('click', async (ev) => {
        ev.preventDefault();
        try {
          await navigator.clipboard.writeText(ALIAS);
          ev.target.textContent = '✓ Copiado al portapapeles';
          setTimeout(() => { ev.target.textContent = '📋 Copiar alias'; }, 2000);
        } catch {
          prompt('Copiá este alias:', ALIAS);
        }
      });
      m.addEventListener('click', e => { if (e.target === m || e.target.dataset.close !== undefined) m.remove(); });
      document.body.appendChild(m);
    }

    wrap.querySelector('[data-act="dona-1vez"]').addEventListener('click', () => openDonationModal(false));
    wrap.querySelector('[data-act="dona-mes"]').addEventListener('click', () => openDonationModal(true));

    wrap.querySelector('.pv-dona-toggle').addEventListener('click', () => {
      const panel = wrap.querySelector('.pv-dona-premium');
      const btn   = wrap.querySelector('.pv-dona-toggle');
      panel.classList.toggle('open');
      btn.textContent = panel.classList.contains('open')
        ? '⭐ Funciones premium que vienen ▴'
        : '⭐ Funciones premium que vienen ▾';
    });

    // Compartir link de la app — usa Web Share API o fallback a clipboard
    wrap.querySelector('[data-share]').addEventListener('click', () => {
      window.PVAuth?.shareInviteLink?.() || (() => {
        const url = location.origin + '/';
        try { navigator.clipboard.writeText(url); alert('📋 Link copiado: ' + url); }
        catch { prompt('Copiá este link:', url); }
      })();
    });

    app.appendChild(wrap);
  }

  function boot() {
    injectStyles();
    addDona();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.addEventListener('load', boot);
  setInterval(boot, 3000);
})();

(() => {
  // ── Palabra Viva — Card de donación (sutil, al fondo) ─────────────────────
  const CAFECITO_URL    = 'https://cafecito.app/palabravivamm';
  const MERCADOPAGO_URL = 'https://link.mercadopago.com.ar/palabravivamm';
  // CVU y Alias para transferencia directa (0% comisión)
  const CVU   = '0000003100001074062433';
  const ALIAS = 'marie.2025.mp';
  // Montos sugeridos para donación mensual fija (en ARS)
  const MONTHLY_TIERS = [
    { amount: 500,   label: 'Apoyo',      desc: 'Una ayuda simbólica mensual' },
    { amount: 1000,  label: 'Sostén',     desc: 'Ayudás a mantener la app online' },
    { amount: 3000,  label: 'Constructor', desc: 'Permitís nuevas funciones cada mes' },
    { amount: 5000,  label: 'Padrino',    desc: 'Sostenés el proyecto a largo plazo' }
  ];

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
          <h2 style="margin:6px 0;text-align:center;font-size:24px">${monthly ? 'Donación mensual fija' : 'Donar una vez'}</h2>
          ${monthly
            ? `<p style="margin:0 0 10px;font-size:14px;color:var(--muted)">Elegí un monto y se descontará cada mes. Lo podés cancelar en cualquier momento desde tu app de pagos.</p>
               <div class="pv-dona-tiers" style="display:flex;flex-direction:column;gap:8px;margin:8px 0 14px">
                 ${MONTHLY_TIERS.map(t => `<button data-tier="${t.amount}" class="pv-dona-tier" style="display:flex;align-items:center;justify-content:space-between;gap:10px;border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:14px;padding:12px 14px;cursor:pointer;font:inherit;text-align:left">
                   <div>
                     <div style="font-weight:700;font-size:15px">${t.label}</div>
                     <div style="font-size:12px;color:var(--muted)">${t.desc}</div>
                   </div>
                   <div style="font-weight:900;font-size:20px;color:var(--brand);font-family:var(--font-serif);white-space:nowrap">$${t.amount.toLocaleString('es-AR')}</div>
                 </button>`).join('')}
                 <button data-tier="custom" class="pv-dona-tier" style="border:1px dashed var(--line);background:transparent;color:var(--muted);border-radius:14px;padding:11px;cursor:pointer;font:inherit;font-size:13px">+ Otro monto a definir</button>
               </div>
               <div class="pv-dona-monthly-info" style="display:none;background:rgba(164,119,49,.08);border:1px solid var(--accent);border-radius:14px;padding:12px;margin-bottom:10px;font-size:13px;line-height:1.5">
                 <strong>Cómo activar el cobro mensual:</strong>
                 <ol style="margin:6px 0 0;padding-left:20px">
                   <li>Tocá <strong>Mercado Pago</strong> abajo.</li>
                   <li>Ingresá el monto elegido.</li>
                   <li>Pagá la primera vez. Después, desde la app de Mercado Pago → <strong>Pagos programados</strong>, activá la repetición.</li>
                   <li>O elegí <strong>Cafecito</strong> y marcá la opción "Apoyo recurrente".</li>
                 </ol>
               </div>`
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
            <p style="font-size:13px;color:var(--muted);margin:0 0 8px;font-weight:600">📨 Transferí desde tu banco / Mercado Pago / Ualá (sin comisiones)</p>
            <div style="background:var(--card);border-radius:10px;padding:10px 12px;margin-bottom:8px">
              <p style="font-size:11px;color:var(--muted);margin:0 0 2px;letter-spacing:.08em;text-transform:uppercase">Alias</p>
              <p style="font-size:18px;font-weight:700;margin:0;font-family:monospace;letter-spacing:.04em">${ALIAS}</p>
            </div>
            <button class="pv-dona-modal-btn" data-copy-alias style="background:var(--brand,#7c4a1e);color:white;border:0;cursor:pointer;font:inherit;width:100%;margin-bottom:8px">📋 Copiar alias</button>
            <div style="background:var(--card);border-radius:10px;padding:10px 12px;margin-bottom:8px">
              <p style="font-size:11px;color:var(--muted);margin:0 0 2px;letter-spacing:.08em;text-transform:uppercase">CVU</p>
              <p style="font-size:14px;font-weight:700;margin:0;font-family:monospace;letter-spacing:.02em;word-break:break-all">${CVU}</p>
            </div>
            <button class="pv-dona-modal-btn" data-copy-cvu style="background:var(--brand,#7c4a1e);color:white;border:0;cursor:pointer;font:inherit;width:100%">📋 Copiar CVU</button>
            <p style="font-size:12px;color:var(--muted);margin:10px 0 0;line-height:1.4">Llega 100% sin descuentos. Confirmaciones por <strong>palabravivamm@gmail.com</strong>.</p>
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
          ev.target.textContent = '✓ Alias copiado';
          setTimeout(() => { ev.target.textContent = '📋 Copiar alias'; }, 2000);
        } catch {
          prompt('Copiá este alias:', ALIAS);
        }
      });
      // Copiar CVU
      m.querySelector('[data-copy-cvu]')?.addEventListener('click', async (ev) => {
        ev.preventDefault();
        try {
          await navigator.clipboard.writeText(CVU);
          ev.target.textContent = '✓ CVU copiado';
          setTimeout(() => { ev.target.textContent = '📋 Copiar CVU'; }, 2000);
        } catch {
          prompt('Copiá este CVU:', CVU);
        }
      });
      // Tiers de donación mensual
      m.querySelectorAll('[data-tier]').forEach(btn => {
        btn.addEventListener('click', (ev) => {
          ev.preventDefault();
          const v = btn.dataset.tier;
          // Resaltar el seleccionado
          m.querySelectorAll('[data-tier]').forEach(b => {
            b.style.background = 'var(--card2)';
            b.style.borderColor = 'var(--line)';
          });
          btn.style.background = 'rgba(107,31,31,.12)';
          btn.style.borderColor = 'var(--brand)';
          // Mostrar info de activación
          const info = m.querySelector('.pv-dona-monthly-info');
          if (info) info.style.display = 'block';
        });
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

(() => {
  // ── Palabra Viva — Card de donación (sutil, al fondo) ─────────────────────
  const CAFECITO_URL    = 'https://cafecito.app/palabraviva';
  const MERCADOPAGO_URL = 'https://link.mercadopago.com.ar/palabraviva';

  const $ = (s, r = document) => r.querySelector(s);

  function injectStyles() {
    if ($('#pv-dona-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-dona-style';
    st.textContent = `
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
      <p class="pv-dona-hint">❤️ Esta app es gratuita. Si querés apoyarla:</p>
      <div class="pv-dona-btns">
        <a class="pv-dona-btn" href="${CAFECITO_URL}" target="_blank" rel="noopener noreferrer">☕ Cafecito</a>
        <a class="pv-dona-btn" href="${MERCADOPAGO_URL}" target="_blank" rel="noopener noreferrer">💳 Mercado Pago</a>
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

    wrap.querySelector('.pv-dona-toggle').addEventListener('click', () => {
      const panel = wrap.querySelector('.pv-dona-premium');
      const btn   = wrap.querySelector('.pv-dona-toggle');
      panel.classList.toggle('open');
      btn.textContent = panel.classList.contains('open')
        ? '⭐ Funciones premium que vienen ▴'
        : '⭐ Funciones premium que vienen ▾';
    });

    app.appendChild(wrap);
  }

  function boot() {
    injectStyles();
    addDona();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.addEventListener('load', boot);
  setInterval(boot, 1500);
})();

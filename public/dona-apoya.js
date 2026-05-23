(() => {
  // ── Palabra Viva — Card de donación ────────────────────────────────────────
  // Cambiá estos links según tu perfil real
  const CAFECITO_URL   = 'https://cafecito.app/palabraviva';
  const MERCADOPAGO_URL = 'https://link.mercadopago.com.ar/palabraviva';

  const $ = (s, r = document) => r.querySelector(s);

  function injectStyles() {
    if ($('#pv-dona-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-dona-style';
    st.textContent = `
      .pv-dona-card{
        border:1px solid rgba(245,158,11,.35);
        background:linear-gradient(135deg,rgba(245,158,11,.08),var(--card,#171722));
        border-radius:24px;
        padding:18px 18px 14px;
        margin-bottom:12px;
      }
      .pv-dona-title{
        font-size:18px;font-weight:900;margin:0 0 6px;
        background:linear-gradient(135deg,var(--brand,#f59e0b),var(--brand2,#ec4899));
        -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
      }
      .pv-dona-sub{font-size:15px;color:var(--muted,#c8c5d8);margin:0 0 14px;line-height:1.45}
      .pv-dona-btns{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px}
      .pv-dona-btn{
        display:inline-flex;align-items:center;gap:7px;border:0;border-radius:999px;
        padding:12px 18px;font-weight:900;font-size:15px;cursor:pointer;text-decoration:none;
        flex:1;min-width:140px;justify-content:center;
      }
      .pv-dona-cafecito{background:linear-gradient(135deg,#f59e0b,#fbbf24);color:#1b1208}
      .pv-dona-mp{background:linear-gradient(135deg,#009ee3,#00b1ea);color:#fff}
      .pv-dona-premium-toggle{
        background:none;border:0;color:var(--brand,#f59e0b);font-size:13px;font-weight:900;
        cursor:pointer;padding:4px 0;display:flex;align-items:center;gap:6px;letter-spacing:.02em;
      }
      .pv-dona-premium{
        margin-top:10px;padding-top:10px;border-top:1px solid var(--line,#333447);
        display:none;
      }
      .pv-dona-premium.open{display:block}
      .pv-dona-premium p{font-size:14px;color:var(--muted,#c8c5d8);margin:4px 0}
      .pv-dona-premium ul{margin:8px 0 0;padding-left:18px;color:var(--muted,#c8c5d8);font-size:14px}
      .pv-dona-premium li{margin:5px 0}
    `;
    document.head.appendChild(st);
  }

  function isHome() {
    return (document.querySelector('h1')?.textContent || '').includes('Una palabra para hoy');
  }

  function addDona() {
    if (!isHome()) { document.querySelector('.pv-dona-card')?.remove(); return; }
    if (document.querySelector('.pv-dona-card')) return;

    // Insertar después del .pv-copyright si existe, o al final del .app
    const anchor = document.querySelector('.pv-copyright') || document.querySelector('.pv-home-shortcuts');
    if (!anchor) return;

    const card = document.createElement('section');
    card.className = 'pv-dona-card';
    card.innerHTML = `
      <p class="pv-dona-title">❤️ Apoyá Palabra Viva</p>
      <p class="pv-dona-sub">Esta app es completamente gratuita. Si te ayuda en tu fe, podés apoyarla con una donación voluntaria.</p>
      <div class="pv-dona-btns">
        <a class="pv-dona-btn pv-dona-cafecito" href="${CAFECITO_URL}" target="_blank" rel="noopener noreferrer">☕ Cafecito</a>
        <a class="pv-dona-btn pv-dona-mp" href="${MERCADOPAGO_URL}" target="_blank" rel="noopener noreferrer">💳 Mercado Pago</a>
      </div>
      <button class="pv-dona-premium-toggle" id="pv-dona-toggle">⭐ Próximamente: funciones premium ▾</button>
      <div class="pv-dona-premium" id="pv-dona-premium">
        <p>Estamos preparando funciones especiales para quienes apoyen la app:</p>
        <ul>
          <li>📖 Planes de lectura personalizados</li>
          <li>🔔 Recordatorios de oración</li>
          <li>📒 Diario espiritual privado</li>
          <li>🎨 Temas visuales exclusivos</li>
          <li>📥 Descarga offline de contenido</li>
        </ul>
        <p style="margin-top:8px;font-size:13px">¡Cada donación ayuda a mantener el servidor y seguir desarrollando la app!</p>
      </div>
    `;

    card.querySelector('#pv-dona-toggle').addEventListener('click', () => {
      const panel = card.querySelector('#pv-dona-premium');
      const btn   = card.querySelector('#pv-dona-toggle');
      panel.classList.toggle('open');
      btn.textContent = panel.classList.contains('open')
        ? '⭐ Próximamente: funciones premium ▴'
        : '⭐ Próximamente: funciones premium ▾';
    });

    anchor.insertAdjacentElement('afterend', card);
  }

  function boot() {
    injectStyles();
    addDona();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.addEventListener('load', boot);
  setInterval(boot, 1500);
})();

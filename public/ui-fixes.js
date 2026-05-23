(() => {
  // Migración: forzar sepia como tema predeterminado.
  // Si el usuario nunca tocó ajustes (tenía 'dark' viejo), se pasa a sepia.
  // Si eligió 'light' explícitamente, se respeta.
  (function migrateTheme() {
    const t = localStorage.getItem('pv-theme');
    if (!t || t === 'dark') {
      localStorage.setItem('pv-theme', 'sepia');
      // Aplicar de inmediato sin esperar que React monte
      document.body && (document.body.dataset.theme = 'sepia');
    }
  })();

  function inject() {
    if (document.getElementById('pv-ui-fixes')) return;
    const style = document.createElement('style');
    style.id = 'pv-ui-fixes';
    style.textContent = `
      /* Paneles tipo Experiencia personal / Diario */
      .pv-panel{
        padding: max(14px, env(safe-area-inset-top)) 14px calc(170px + env(safe-area-inset-bottom)) !important;
      }
      .pv-panel-head{
        display:grid !important;
        grid-template-columns: 1fr auto !important;
        align-items:start !important;
        gap:10px !important;
        padding:10px 0 16px !important;
        margin-bottom:2px !important;
      }
      .pv-panel-head > div{
        min-width:0 !important;
        overflow:visible !important;
      }
      .pv-panel-head h1{
        font-size: clamp(22px, 6vw, 30px) !important;
        line-height: 1.08 !important;
        letter-spacing:-.035em !important;
        margin:4px 0 6px !important;
        white-space:normal !important;
        overflow:visible !important;
        text-overflow:clip !important;
      }
      .pv-panel-head .soft{
        font-size:15px !important;
        line-height:1.35 !important;
        margin:0 !important;
      }
      .pv-close{
        position:sticky !important;
        top:10px !important;
        min-width:72px !important;
        height:42px !important;
        padding:8px 12px !important;
        white-space:nowrap !important;
        box-shadow:0 8px 24px rgba(0,0,0,.14) !important;
      }
      .pv-card{
        border-radius:22px !important;
        padding:15px !important;
      }
      .pv-card h3{
        font-size:20px !important;
        line-height:1.15 !important;
      }
      .pv-input,.pv-textarea,.pv-select{
        font-size:16px !important;
        border-radius:16px !important;
      }
      .pv-card .btn,
      .pv-card button.btn,
      .pv-allow,
      .pv-beg{
        width:100% !important;
        min-height:46px !important;
        white-space:normal !important;
        line-height:1.18 !important;
        text-align:center !important;
      }

      /* Barra de botones rápidos encima del menú inferior */
      .quick{
        bottom: calc(92px + env(safe-area-inset-bottom)) !important;
        width: min(720px, calc(100% - 18px)) !important;
        display:flex !important;
        justify-content:flex-start !important;
        overflow-x:auto !important;
        overflow-y:hidden !important;
        gap:7px !important;
        padding:8px !important;
        border:1px solid var(--line) !important;
        background: color-mix(in srgb, var(--card) 88%, transparent) !important;
        border-radius:22px !important;
        box-shadow:0 12px 38px rgba(0,0,0,.22) !important;
        backdrop-filter:blur(14px) !important;
        scrollbar-width:none !important;
      }
      .quick::-webkit-scrollbar{display:none !important;}
      .quick button{
        flex:0 0 auto !important;
        min-height:38px !important;
        padding:8px 11px !important;
        border-radius:999px !important;
        font-size:13px !important;
        line-height:1 !important;
        white-space:nowrap !important;
      }
      .bottom{
        bottom: calc(12px + env(safe-area-inset-bottom)) !important;
        width:min(720px, calc(100% - 18px)) !important;
      }
      .app{
        padding-bottom: calc(178px + env(safe-area-inset-bottom)) !important;
      }

      @media(max-width:420px){
        .pv-panel{padding:12px 10px calc(178px + env(safe-area-inset-bottom)) !important;}
        .pv-panel-head{grid-template-columns:1fr auto !important;}
        .pv-panel-head h1{font-size:24px !important;}
        .pv-close{font-size:13px !important;min-width:64px !important;height:38px !important;padding:7px 10px !important;}
        .quick{bottom:calc(88px + env(safe-area-inset-bottom)) !important;padding:7px !important;}
        .quick button{font-size:12px !important;padding:8px 10px !important;}
      }
    `;
    document.head.appendChild(style);
  }
  inject();
  setInterval(inject, 3000);
})();
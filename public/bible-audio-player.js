(() => {
  const ARCHIVE_ID = 'BibliaEnAudioRVA1909';
  const ARCHIVE_EMBED = `https://archive.org/embed/${ARCHIVE_ID}`;
  const ARCHIVE_PAGE = `https://archive.org/details/${ARCHIVE_ID}`;
  const $ = (s, r = document) => r.querySelector(s);

  function injectStyles() {
    const old = $('#pv-bap-style');
    if (old) old.remove();
    const style = document.createElement('style');
    style.id = 'pv-bap-style';
    style.textContent = `
      .pv-bap-fab{
        position:fixed!important;
        left:12px!important;
        bottom:calc(218px + env(safe-area-inset-bottom))!important;
        z-index:999999!important;
        border:0!important;
        background:linear-gradient(135deg,#7c4a1e,#be185d)!important;
        color:white!important;
        border-radius:999px!important;
        padding:13px 16px!important;
        font-weight:900!important;
        font-size:14px!important;
        min-height:48px!important;
        box-shadow:0 18px 45px rgba(0,0,0,.42)!important;
        display:inline-flex!important;
        align-items:center!important;
        gap:8px!important;
        cursor:pointer!important;
      }
      .pv-bap-fab::before{
        content:'▶';
        width:22px;
        height:22px;
        border-radius:50%;
        background:#22c55e;
        display:grid;
        place-items:center;
        font-size:11px;
      }
      .pv-bap-panel{
        position:fixed;
        inset:0;
        z-index:1000000;
        background:var(--bg,#fff7ed);
        color:var(--text,#1f1307);
        overflow:auto;
        padding:14px 12px calc(150px + env(safe-area-inset-bottom));
      }
      .pv-bap-inner{max-width:820px;margin:0 auto;display:flex;flex-direction:column;gap:14px;}
      .pv-bap-head{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:start;position:sticky;top:0;z-index:2;background:linear-gradient(to bottom,var(--bg,#fff7ed) 75%,transparent);padding:8px 0 14px;backdrop-filter:blur(12px);}
      .pv-bap-head h1{font-size:clamp(24px,7vw,32px);line-height:1.05;margin:4px 0 6px;}
      .pv-bap-close{border:1px solid var(--line,#e5d5bd);background:var(--card2,#fff);color:var(--text,#1f1307);border-radius:999px;padding:9px 14px;font-weight:900;min-width:68px;height:40px;}
      .pv-bap-card{border:1px solid var(--line,#e5d5bd);background:var(--card,#fff);border-radius:24px;padding:14px;box-shadow:0 16px 38px rgba(0,0,0,.12);}
      .pv-bap-frame{width:100%;height:430px;border:1px solid var(--line,#e5d5bd);border-radius:18px;background:#000;}
      .pv-bap-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px;}
      .pv-bap-actions button{border:1px solid var(--line,#e5d5bd);background:var(--card2,#fff);color:var(--text,#1f1307);border-radius:999px;padding:12px;font-weight:900;min-height:46px;}
      .pv-bap-actions .primary{border:0;background:linear-gradient(135deg,#7c4a1e,#be185d);color:white;}
      .pv-bap-home{border-color:rgba(124,74,30,.45)!important;background:linear-gradient(135deg,rgba(124,74,30,.14),var(--card,#fff))!important;}
      @media(max-width:420px){.pv-bap-fab{left:10px!important;bottom:calc(196px + env(safe-area-inset-bottom))!important;font-size:13px!important;padding:11px 13px!important}.pv-bap-frame{height:340px}.pv-bap-actions{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function openPanel() {
    injectStyles();
    document.querySelector('.pv-bap-panel')?.remove();
    const panel = document.createElement('section');
    panel.className = 'pv-bap-panel';
    panel.innerHTML = `
      <div class="pv-bap-inner">
        <div class="pv-bap-head">
          <div>
            <p class="ref">Biblia en audio</p>
            <h1>Voz humana masculina</h1>
            <p class="soft">Reina Valera 1909 narrada. Usá los controles del reproductor.</p>
          </div>
          <button class="pv-bap-close">Cerrar</button>
        </div>
        <section class="pv-bap-card">
          <iframe class="pv-bap-frame" src="${ARCHIVE_EMBED}" allow="autoplay" allowfullscreen></iframe>
          <p class="soft">Si no carga dentro de la app, abrí la fuente oficial.</p>
          <div class="pv-bap-actions">
            <button class="primary" data-open>Fuente oficial</button>
            <button data-close>Cerrar</button>
          </div>
        </section>
      </div>`;
    document.body.appendChild(panel);
    panel.querySelector('.pv-bap-close').onclick = () => panel.remove();
    panel.querySelector('[data-close]').onclick = () => panel.remove();
    panel.querySelector('[data-open]').onclick = () => { window.location.href = ARCHIVE_PAGE; };
  }

  function addFab() {
    injectStyles();
    if ($('.pv-bap-fab')) return;
    const btn = document.createElement('button');
    btn.className = 'pv-bap-fab';
    btn.textContent = 'Biblia en audio';
    btn.onclick = openPanel;
    document.body.appendChild(btn);
  }

  function addHomeCard() {
    const title = $('h1')?.textContent || '';
    if (!title.includes('Una palabra para hoy') || $('.pv-bap-home')) return;
    const anchor = $('.pv-path-card') || $('.hero');
    if (!anchor) return;
    const card = document.createElement('section');
    card.className = 'card pv-bap-home';
    card.innerHTML = `<p class="ref">Biblia en audio</p><h3>Escuchá la Biblia narrada</h3><p class="soft">Voz humana masculina, Reina Valera 1909.</p><div class="row wrap"><button class="btn">Abrir reproductor</button></div>`;
    card.querySelector('button').onclick = openPanel;
    anchor.insertAdjacentElement('afterend', card);
  }

  function addQuickButton() {
    const quick = $('.quick');
    if (!quick || $('.pv-bap-quick')) return;
    const btn = document.createElement('button');
    btn.className = 'pv-bap-quick';
    btn.textContent = 'Audio';
    btn.onclick = openPanel;
    quick.insertBefore(btn, quick.firstChild);
  }

  function cleanOldAudio() {
    document.querySelectorAll('.pv-audio-fixed,.pv-audio-box,.pv-audio-card-force,.pv-voice-quick,.pv-voice-panel,.pv-audio-one,.pv-archive-float,.pv-archive-panel,.pv-archive-home').forEach(el => el.remove());
  }

  window.PalabraVivaAudioBible = { open: openPanel };
  function boot() { injectStyles(); cleanOldAudio(); addFab(); addHomeCard(); addQuickButton(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.addEventListener('load', boot);
  setInterval(boot, 800);
})();
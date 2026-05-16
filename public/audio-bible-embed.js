(() => {
  const BOOKS = ['Génesis','Éxodo','Levítico','Números','Deuteronomio','Josué','Jueces','Rut','1 Samuel','2 Samuel','1 Reyes','2 Reyes','1 Crónicas','2 Crónicas','Esdras','Nehemías','Ester','Job','Salmos','Proverbios','Eclesiastés','Cantares','Isaías','Jeremías','Lamentaciones','Ezequiel','Daniel','Oseas','Joel','Amós','Abdías','Jonás','Miqueas','Nahum','Habacuc','Sofonías','Hageo','Zacarías','Malaquías','Mateo','Marcos','Lucas','Juan','Hechos','Romanos','1 Corintios','2 Corintios','Gálatas','Efesios','Filipenses','Colosenses','1 Tesalonicenses','2 Tesalonicenses','1 Timoteo','2 Timoteo','Tito','Filemón','Hebreos','Santiago','1 Pedro','2 Pedro','1 Juan','2 Juan','3 Juan','Judas','Apocalipsis'];
  const ARCHIVE_EMBED = 'https://archive.org/embed/BibliaEnAudioRVA1909';
  const ARCHIVE_PAGE = 'https://archive.org/details/BibliaEnAudioRVA1909';

  function $(s, r = document) { return r.querySelector(s); }

  function injectStyles() {
    if ($('#pv-archive-audio-style')) return;
    const style = document.createElement('style');
    style.id = 'pv-archive-audio-style';
    style.textContent = `
      .pv-archive-float{position:fixed;left:12px;bottom:calc(158px + env(safe-area-inset-bottom));z-index:74;border:0;background:linear-gradient(135deg,var(--brand),var(--brand2));color:white;border-radius:999px;padding:12px 15px;font-weight:900;box-shadow:0 18px 45px rgba(0,0,0,.32);min-height:46px}
      .pv-archive-panel{position:fixed;inset:0;z-index:88;background:var(--bg);color:var(--text);overflow:auto;padding:16px 14px calc(230px + env(safe-area-inset-bottom))}.pv-archive-inner{max-width:860px;margin:0 auto;display:flex;flex-direction:column;gap:14px}.pv-archive-head{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:start;position:sticky;top:0;background:linear-gradient(to bottom,var(--bg),rgba(0,0,0,0));padding:8px 0 14px;z-index:2;backdrop-filter:blur(12px)}.pv-archive-head h1{font-size:clamp(24px,7vw,32px);line-height:1.05;margin:4px 0 6px;letter-spacing:-.04em}.pv-archive-close{border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:999px;padding:9px 12px;font-weight:900;min-width:66px}.pv-archive-card{border:1px solid var(--line);background:var(--card);border-radius:24px;padding:16px;box-shadow:0 16px 38px rgba(0,0,0,.12)}.pv-archive-frame{width:100%;height:420px;border:1px solid var(--line);border-radius:20px;background:#000}.pv-archive-select{width:100%;border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:18px;padding:13px;font:inherit;outline:none}.pv-archive-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.pv-archive-actions button{border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:999px;padding:11px;font-weight:900}.pv-archive-actions .primary{border:0;background:linear-gradient(135deg,var(--brand),var(--brand2));color:white}.pv-archive-home{border-color:rgba(245,158,11,.45);background:linear-gradient(135deg,rgba(245,158,11,.13),var(--card))}
      @media(max-width:420px){.pv-archive-float{left:10px;bottom:calc(150px + env(safe-area-inset-bottom));font-size:13px;padding:10px 12px}.pv-archive-frame{height:340px}.pv-archive-actions{grid-template-columns:1fr}.pv-archive-panel{padding:12px 10px calc(240px + env(safe-area-inset-bottom))}}
    `;
    document.head.appendChild(style);
  }

  function openPanel() {
    injectStyles();
    document.querySelector('.pv-archive-panel')?.remove();
    const panel = document.createElement('section');
    panel.className = 'pv-archive-panel';
    panel.innerHTML = `
      <div class="pv-archive-inner">
        <div class="pv-archive-head"><div><p class="ref">Biblia en audio</p><h1>Reina-Valera 1909 narrada</h1><p class="soft">Voz humana masculina desde Internet Archive. Requiere conexión a internet.</p></div><button class="pv-archive-close">Cerrar</button></div>
        <section class="pv-archive-card"><h3>Reproductor</h3><iframe class="pv-archive-frame" src="${ARCHIVE_EMBED}" allow="autoplay" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen></iframe><p class="soft">Usá los controles del reproductor para elegir pista, pausar o avanzar.</p></section>
        <section class="pv-archive-card"><h3>Buscar libro</h3><select class="pv-archive-select">${BOOKS.map(b => `<option>${b}</option>`).join('')}</select><p class="soft pv-archive-book-note">Seleccioná un libro como guía y buscá esa pista dentro del reproductor.</p><div class="pv-archive-actions"><button class="primary" data-open-archive>Ver fuente oficial</button><button data-copy-book>Copiar nombre del libro</button></div></section>
      </div>`;
    document.body.appendChild(panel);
    $('.pv-archive-close', panel).onclick = () => panel.remove();
    $('[data-open-archive]', panel).onclick = () => location.href = ARCHIVE_PAGE;
    $('[data-copy-book]', panel).onclick = () => navigator.clipboard?.writeText($('.pv-archive-select', panel).value).then(() => alert('Libro copiado'));
  }

  function addFloat() {
    injectStyles();
    if ($('.pv-archive-float')) return;
    const b = document.createElement('button');
    b.className = 'pv-archive-float';
    b.textContent = 'Biblia en audio';
    b.onclick = openPanel;
    document.body.appendChild(b);
  }

  function addQuick() {
    const quick = document.querySelector('.quick');
    if (!quick || document.querySelector('.pv-archive-quick')) return;
    const b = document.createElement('button');
    b.className = 'pv-archive-quick';
    b.textContent = 'Audio';
    b.onclick = openPanel;
    quick.insertBefore(b, quick.firstChild);
  }

  function addHomeCard() {
    const title = document.querySelector('h1')?.textContent || '';
    if (!title.includes('Una palabra para hoy')) return;
    if (document.querySelector('.pv-archive-home')) return;
    const anchor = document.querySelector('.pv-path-card') || document.querySelector('.hero');
    if (!anchor) return;
    const card = document.createElement('section');
    card.className = 'card pv-archive-home';
    card.innerHTML = `<p class="ref">Biblia en audio</p><h3>Escuchar la Biblia con voz humana</h3><p class="soft">Reina-Valera 1909 narrada por voz masculina desde Internet Archive.</p><button class="btn">Abrir audio bíblico</button>`;
    card.querySelector('button').onclick = openPanel;
    anchor.insertAdjacentElement('afterend', card);
  }

  window.PalabraVivaAudioBiblia = { open: openPanel };
  setInterval(() => { addFloat(); addQuick(); addHomeCard(); }, 900);
})();
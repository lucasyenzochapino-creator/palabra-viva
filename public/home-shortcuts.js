(() => {
  // ATAJOS COMPACTOS EN HOME — Radio, Audio Biblia y Niños
  const $ = (s, r = document) => r.querySelector(s);

  function injectStyles(){
    if($('#pv-shortcuts-style')) return;
    const st=document.createElement('style');
    st.id='pv-shortcuts-style';
    st.textContent=`
      .pv-home-shortcuts{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0 12px}
      .pv-home-shortcut{border:1px solid var(--line);background:linear-gradient(135deg,var(--card),var(--card2));color:var(--text);border-radius:18px;padding:10px 8px;min-height:64px;font-weight:900;box-shadow:0 10px 24px rgba(0,0,0,.10);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;text-align:center;cursor:pointer}
      .pv-home-shortcut .ico{font-size:22px;line-height:1}
      .pv-home-shortcut .txt{font-size:12px;line-height:1.1}
      .pv-home-shortcut .live{font-size:10px;color:#16a34a;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:800}
      .pv-home-shortcut.radio{border-color:rgba(239,68,68,.25)}
      .pv-home-shortcut.audio{border-color:rgba(124,74,30,.30)}
      .pv-home-shortcut.kids{border-color:rgba(34,197,94,.30)}
      @media(max-width:360px){.pv-home-shortcut{padding:8px 5px}.pv-home-shortcut .txt{font-size:11px}}
    `;
    document.head.appendChild(st);
  }

  function isHome(){
    const h1=document.querySelector('h1')?.textContent||'';
    return h1.includes('Una palabra para hoy');
  }

  function getRadioName(){
    try { return window.PalabraVivaCanales?.getCurrentRadio?.() || ''; }
    catch { return ''; }
  }

  function addShortcuts(){
    if(!isHome()) { document.querySelector('.pv-home-shortcuts')?.remove(); return; }
    if(document.querySelector('.pv-home-shortcuts')) return;
    const hero=document.querySelector('.hero') || document.querySelector('.card.gradient');
    if(!hero) return;

    const wrap=document.createElement('section');
    wrap.className='pv-home-shortcuts';
    wrap.innerHTML=`
      <button class="pv-home-shortcut radio" data-a="radio"><span class="ico">📻</span><span class="txt">Radio</span><span class="live" data-live></span></button>
      <button class="pv-home-shortcut audio" data-a="audio"><span class="ico">🎧</span><span class="txt">Audio Biblia</span></button>
      <button class="pv-home-shortcut kids" data-a="kids"><span class="ico">👶</span><span class="txt">Niños</span></button>
    `;

    wrap.querySelector('[data-a="radio"]').onclick=()=>{
      if(window.PalabraVivaCanales?.openDial) window.PalabraVivaCanales.openDial();
      else if(window.PalabraVivaCanales?.open) window.PalabraVivaCanales.open();
    };
    wrap.querySelector('[data-a="audio"]').onclick=()=>{
      if(window.PalabraVivaAudioBible?.openInBibleTab) window.PalabraVivaAudioBible.openInBibleTab();
      else if(window.PalabraVivaAudioBible?.open) window.PalabraVivaAudioBible.open();
      else {
        const navs=document.querySelectorAll('.bottom .nav');
        const bible=Array.from(navs).find(n=>(n.textContent||'').includes('Biblia'));
        if(bible) bible.click();
      }
    };
    wrap.querySelector('[data-a="kids"]').onclick=()=>{
      if(window.PalabraVivaNinos?.open) window.PalabraVivaNinos.open();
    };

    hero.insertAdjacentElement('beforebegin', wrap);
    updateLive();
  }

  function updateLive(e){
    const el=document.querySelector('.pv-home-shortcuts [data-live]');
    if(!el) return;
    const name = (e?.detail?.name !== undefined) ? e.detail.name : getRadioName();
    el.textContent=name ? `🔴 En vivo: ${name}` : '';
  }

  document.addEventListener('pv-radio', updateLive);
  document.addEventListener('palabra-viva-radio', updateLive);
  function boot(){ injectStyles(); addShortcuts(); updateLive(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.addEventListener('load', boot);
  setInterval(boot, 1000);
})();
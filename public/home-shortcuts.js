(() => {
  // ATAJOS COMPACTOS EN HOME — Radio, Audio Biblia y Niños
  const $ = (s, r = document) => r.querySelector(s);

  function injectStyles(){
    if($('#pv-shortcuts-style')) return;
    const st=document.createElement('style');
    st.id='pv-shortcuts-style';
    st.textContent=`
      .pv-home-shortcuts{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0 12px}
      .pv-home-shortcut{border:1px solid var(--line);background:linear-gradient(135deg,var(--card),var(--card2));color:var(--text);border-radius:18px;padding:10px 8px;min-height:64px;font-weight:900;box-shadow:0 10px 24px rgba(0,0,0,.10);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;text-align:center;cursor:pointer;transition:border-color .2s,background .2s}
      .pv-home-shortcut .ico{font-size:22px;line-height:1}
      .pv-home-shortcut .txt{font-size:12px;line-height:1.1}
      .pv-home-shortcut .live{font-size:10px;color:#16a34a;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:800}
      .pv-home-shortcut.radio{border-color:rgba(239,68,68,.25)}
      .pv-home-shortcut.audio{border-color:rgba(124,74,30,.30)}
      .pv-home-shortcut.kids{border-color:rgba(34,197,94,.30)}

      /* Estado reproduciendo — radio */
      .pv-home-shortcut.radio.playing{
        border-color:rgba(239,68,68,.7);
        background:linear-gradient(135deg,rgba(239,68,68,.12),rgba(239,68,68,.05));
        min-height:76px;
      }
      /* Estado reproduciendo — audio biblia */
      .pv-home-shortcut.audio.playing{
        border-color:rgba(124,74,30,.8);
        background:linear-gradient(135deg,rgba(124,74,30,.15),rgba(124,74,30,.05));
        min-height:76px;
      }
      .pv-stop-btn{
        margin-top:3px;
        background:rgba(239,68,68,.15);
        border:1px solid rgba(239,68,68,.4);
        color:#ef4444;
        border-radius:999px;
        padding:3px 10px;
        font-size:10px;
        font-weight:900;
        cursor:pointer;
        white-space:nowrap;
      }
      .pv-stop-btn:active{background:rgba(239,68,68,.3)}
      .pv-stop-btn.audio{
        background:rgba(124,74,30,.15);
        border-color:rgba(124,74,30,.5);
        color:#b45309;
      }
      .pv-stop-btn.audio:active{background:rgba(124,74,30,.3)}

      /* Pie de autoría */
      .pv-copyright{
        text-align:center;
        font-size:10px;
        color:var(--muted,#a08060);
        opacity:.55;
        padding:4px 0 2px;
        letter-spacing:.03em;
      }

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
    if(!isHome()) { document.querySelector('.pv-home-shortcuts')?.remove(); document.querySelector('.pv-copyright')?.remove(); return; }
    if(document.querySelector('.pv-home-shortcuts')) return;
    const hero=document.querySelector('.hero') || document.querySelector('.card.gradient');
    if(!hero) return;

    const wrap=document.createElement('section');
    wrap.className='pv-home-shortcuts';
    wrap.innerHTML=`
      <button class="pv-home-shortcut radio" data-a="radio">
        <span class="ico">📻</span>
        <span class="txt">Radio</span>
        <span class="live" data-live></span>
      </button>
      <button class="pv-home-shortcut audio" data-a="audio">
        <span class="ico">🎧</span>
        <span class="txt">Audio Biblia</span>
        <span class="live" data-audio-live></span>
      </button>
      <button class="pv-home-shortcut kids" data-a="kids"><span class="ico">👶</span><span class="txt">Niños</span></button>
    `;

    // Radio: abre el dial
    wrap.querySelector('[data-a="radio"]').onclick=(e)=>{
      // Si el clic fue en el botón de detener, no abrir el dial
      if(e.target.closest('.pv-stop-btn')) return;
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

    // Pie de autoría
    if(!document.querySelector('.pv-copyright')){
      const copy=document.createElement('p');
      copy.className='pv-copyright';
      copy.textContent='© Mariela Alejandra Masmu — Todos los derechos reservados';
      wrap.insertAdjacentElement('afterend', copy);
    }

    updateLive();
  }

  function updateLive(e){
    const card=document.querySelector('.pv-home-shortcuts [data-a="radio"]');
    const liveEl=document.querySelector('.pv-home-shortcuts [data-live]');
    if(!liveEl || !card) return;

    const name = (e?.detail?.name !== undefined) ? e.detail.name : getRadioName();

    if(name){
      card.classList.add('playing');
      liveEl.textContent=`🔴 ${name}`;
      if(!card.querySelector('.pv-stop-btn')){
        const stopBtn=document.createElement('button');
        stopBtn.className='pv-stop-btn';
        stopBtn.textContent='⏹ Detener';
        stopBtn.addEventListener('click', e=>{
          e.stopPropagation();
          window.PalabraVivaCanales?.stop?.();
        });
        card.appendChild(stopBtn);
      }
    } else {
      card.classList.remove('playing');
      liveEl.textContent='';
      card.querySelector('.pv-stop-btn')?.remove();
    }
  }

  function updateAudioLive(){
    const card=document.querySelector('.pv-home-shortcuts [data-a="audio"]');
    const liveEl=document.querySelector('.pv-home-shortcuts [data-audio-live]');
    if(!liveEl || !card) return;

    const playing = window.PalabraVivaAudioBible?.isPlaying?.();
    const info    = window.PalabraVivaAudioBible?.getCurrentInfo?.() || '';

    if(playing && info){
      card.classList.add('playing');
      liveEl.textContent=`🔴 ${info}`;
      if(!card.querySelector('.pv-stop-btn')){
        const stopBtn=document.createElement('button');
        stopBtn.className='pv-stop-btn audio';
        stopBtn.textContent='⏹ Detener';
        stopBtn.addEventListener('click', e=>{
          e.stopPropagation();
          window.PalabraVivaAudioBible?.stop?.();
        });
        card.appendChild(stopBtn);
      }
    } else {
      card.classList.remove('playing');
      liveEl.textContent='';
      card.querySelector('.pv-stop-btn.audio')?.remove();
    }
  }

  document.addEventListener('pv-radio', updateLive);
  document.addEventListener('palabra-viva-radio', updateLive);

  function boot(){ injectStyles(); addShortcuts(); updateLive(); updateAudioLive(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.addEventListener('load', boot);
  setInterval(boot, 1000);
})();

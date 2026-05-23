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
      }
      /* Estado reproduciendo — audio biblia */
      .pv-home-shortcut.audio.playing{
        border-color:rgba(124,74,30,.8);
        background:linear-gradient(135deg,rgba(124,74,30,.15),rgba(124,74,30,.05));
        min-height:76px;
      }
      /* Mini-controles inline dentro del botón Radio */
      .pv-radio-controls{
        display:flex;align-items:center;justify-content:center;gap:5px;
        margin-top:5px;width:100%
      }
      .pv-rc-btn{
        background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.35);
        color:#ef4444;border-radius:50%;width:26px;height:26px;
        font-size:10px;cursor:pointer;display:grid;place-items:center;
        flex-shrink:0;padding:0;line-height:1
      }
      .pv-rc-btn:active{background:rgba(239,68,68,.3)!important}
      .pv-rc-pp{background:linear-gradient(135deg,rgba(239,68,68,.28),rgba(239,68,68,.12))!important;font-size:12px!important}
      .pv-rc-stop{font-size:9px!important}
      /* Mini-controles inline dentro del botón Audio Biblia */
      .pv-audio-controls{display:flex;align-items:center;justify-content:center;gap:5px;margin-top:5px;width:100%}
      .pv-ac-btn{
        background:rgba(124,74,30,.12);border:1px solid rgba(124,74,30,.35);
        color:#b45309;border-radius:50%;width:26px;height:26px;
        font-size:10px;cursor:pointer;display:grid;place-items:center;
        flex-shrink:0;padding:0;line-height:1
      }
      .pv-ac-btn:active{background:rgba(124,74,30,.3)!important}
      .pv-ac-pp{background:linear-gradient(135deg,rgba(124,74,30,.28),rgba(124,74,30,.12))!important;font-size:12px!important}
      .pv-ac-stop{font-size:9px!important}

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

    // Radio: abre el dial (salvo que el clic haya sido en los controles)
    wrap.querySelector('[data-a="radio"]').onclick=(e)=>{
      if(e.target.closest('.pv-radio-controls,.pv-stop-btn')) return;
      if(window.PalabraVivaCanales?.openDial) window.PalabraVivaCanales.openDial();
      else if(window.PalabraVivaCanales?.open) window.PalabraVivaCanales.open();
    };
    wrap.querySelector('[data-a="audio"]').onclick=(e)=>{
      if(e.target.closest('.pv-audio-controls,.pv-stop-btn')) return;
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

    // En home: ocultar floating mini-player; fuera del home: mostrarlo
    const crPlayer=document.querySelector('.cr-player');
    if(crPlayer) crPlayer.style.display=card?'none':'';

    if(!liveEl || !card) return;

    const name=(e?.detail?.name!==undefined)?e.detail.name:getRadioName();
    const playing=(e?.detail?.playing!==undefined)
      ?e.detail.playing
      :(name?window.PalabraVivaCanales?.isPlaying?.()!==false:false);

    if(name){
      card.classList.add('playing');
      liveEl.textContent=`🔴 ${name}`;
      card.querySelectorAll('.pv-stop-btn').forEach(el=>el.remove());

      // Controles inline ⏮ ▶/⏸ ⏭ ⏹
      let ctrl=card.querySelector('.pv-radio-controls');
      if(!ctrl){
        ctrl=document.createElement('div');
        ctrl.className='pv-radio-controls';
        ctrl.innerHTML=`
          <button class="pv-rc-btn" data-rc-prev title="Anterior">⏮</button>
          <button class="pv-rc-btn pv-rc-pp" data-rc-pp title="Play/Pausa">⏸</button>
          <button class="pv-rc-btn" data-rc-next title="Siguiente">⏭</button>
          <button class="pv-rc-btn pv-rc-stop" data-rc-stop title="Detener">⏹</button>`;
        ctrl.querySelector('[data-rc-prev]').addEventListener('click',ev=>{ev.stopPropagation();window.PalabraVivaCanales?.prev?.();});
        ctrl.querySelector('[data-rc-pp]').addEventListener('click',ev=>{ev.stopPropagation();window.PalabraVivaCanales?.togglePlay?.();});
        ctrl.querySelector('[data-rc-next]').addEventListener('click',ev=>{ev.stopPropagation();window.PalabraVivaCanales?.next?.();});
        ctrl.querySelector('[data-rc-stop]').addEventListener('click',ev=>{ev.stopPropagation();window.PalabraVivaCanales?.stop?.();});
        card.appendChild(ctrl);
      }
      // Actualizar ícono ▶/⏸
      const ppBtn=ctrl.querySelector('[data-rc-pp]');
      if(ppBtn) ppBtn.textContent=playing?'⏸':'▶';
    } else {
      card.classList.remove('playing');
      liveEl.textContent='';
      card.querySelector('.pv-radio-controls')?.remove();
      card.querySelector('.pv-stop-btn')?.remove();
    }
  }

  function updateAudioLive(e){
    const card=document.querySelector('.pv-home-shortcuts [data-a="audio"]');
    const liveEl=document.querySelector('.pv-home-shortcuts [data-audio-live]');

    // En home: ocultar floating mini-player de Biblia; fuera del home: mostrarlo
    const bapPlayer=document.querySelector('.pv-bap-player');
    if(bapPlayer) bapPlayer.style.display=card?'none':'';

    if(!liveEl || !card) return;

    const isPlaying=(e?.detail?.playing!==undefined)
      ?e.detail.playing
      :window.PalabraVivaAudioBible?.isPlaying?.();
    const info=(e?.detail?.info!==undefined)
      ?e.detail.info
      :(window.PalabraVivaAudioBible?.getCurrentInfo?.() || '');

    if(info){
      card.classList.add('playing');
      liveEl.textContent=`🔴 ${info}`;
      card.querySelectorAll('.pv-stop-btn').forEach(el=>el.remove());

      // Controles inline ⏮ ▶/⏸ ⏭ ⏹
      let ctrl=card.querySelector('.pv-audio-controls');
      if(!ctrl){
        ctrl=document.createElement('div');
        ctrl.className='pv-audio-controls';
        ctrl.innerHTML=`
          <button class="pv-ac-btn" data-ac-prev title="Capítulo anterior">⏮</button>
          <button class="pv-ac-btn pv-ac-pp" data-ac-pp title="Play/Pausa">⏸</button>
          <button class="pv-ac-btn" data-ac-next title="Capítulo siguiente">⏭</button>
          <button class="pv-ac-btn pv-ac-stop" data-ac-stop title="Detener">⏹</button>`;
        ctrl.querySelector('[data-ac-prev]').addEventListener('click',ev=>{ev.stopPropagation();window.PalabraVivaAudioBible?.prev?.();});
        ctrl.querySelector('[data-ac-pp]').addEventListener('click',ev=>{ev.stopPropagation();window.PalabraVivaAudioBible?.togglePlay?.();});
        ctrl.querySelector('[data-ac-next]').addEventListener('click',ev=>{ev.stopPropagation();window.PalabraVivaAudioBible?.next?.();});
        ctrl.querySelector('[data-ac-stop]').addEventListener('click',ev=>{ev.stopPropagation();window.PalabraVivaAudioBible?.stop?.();});
        card.appendChild(ctrl);
      }
      // Actualizar ícono ▶/⏸
      const ppBtn=ctrl.querySelector('[data-ac-pp]');
      if(ppBtn) ppBtn.textContent=isPlaying?'⏸':'▶';
    } else {
      card.classList.remove('playing');
      liveEl.textContent='';
      card.querySelector('.pv-audio-controls')?.remove();
      card.querySelector('.pv-stop-btn')?.remove();
    }
  }

  document.addEventListener('pv-radio', updateLive);
  document.addEventListener('palabra-viva-radio', updateLive);
  document.addEventListener('pv-bible-audio', updateAudioLive);

  function boot(){ injectStyles(); addShortcuts(); updateLive(); updateAudioLive(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.addEventListener('load', boot);
  setInterval(boot, 1000);
})();

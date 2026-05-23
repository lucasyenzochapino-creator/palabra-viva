(() => {
  try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch {}

  // ── Canales YouTube ────────────────────────────────────────────────────────
  const CHANNELS = [
    { name:'BibleProject Español', type:'Biblia animada', note:'Videos sobre libros y temas bíblicos en español latino.', embed:'https://www.youtube-nocookie.com/embed/videoseries?list=PLlD1Kzc7omJmXnWoWlFVJ5AFOTPuYyGPg', channel:'https://www.youtube.com/c/bibleprojectespanol' },
    { name:'Nuevo Tiempo', type:'TV cristiana', note:'Contenido cristiano: familia, Biblia y esperanza.', embed:null, channel:'https://www.youtube.com/@NuevoTiempoTV' },
    { name:'Enlace TV', type:'TV evangélica', note:'Predicaciones y contenido cristiano evangélico.', embed:null, channel:'https://www.youtube.com/@enlacetv' },
    { name:'Coalición por el Evangelio', type:'Enseñanza bíblica', note:'Recursos teológicos reformados en español.', embed:null, channel:'https://www.youtube.com/@coalicionporelevangelio' },
    { name:'Hillsong en Español', type:'Adoración', note:'Canciones de adoración en español.', embed:null, channel:'https://www.youtube.com/@hillsongenespanol' }
  ];

  // ── Radios hardcoded — URLs verificadas en Radio Browser API (lastcheckok=1) ──
  const HARD_RADIOS = [
    // USA en Español — verificadas
    { id:'aliento-ks',    name:'Radio Aliento 100.5 FM',     type:'USA · Kansas · Cristiana',       note:'Radio cristiana evangélica en español de Kansas.', stream:'https://streams.radio.co:80/s22a35bf51/listen' },
    { id:'bbn-es',        name:'BBN Radio Español',          type:'USA · Internacional · Bíblica',  note:'Música cristiana, Biblia y enseñanza 24/7.',       stream:'https://streams.radiomast.io/475ebed1-595e-4717-b888-64fe8fc6b09f' },
    { id:'buen-sam',      name:'El Buen Samaritano 102.3 FM',type:'USA · Florida · Cristiana',      note:'Radio cristiana en español desde Florida.',        stream:'https://stream1.305stream.com/proxy/buensamaritano?mp=/stream' },
    { id:'vision-crist',  name:'Radio Visión Cristiana',     type:'USA · Internacional · Cristiana',note:'Alabanza, predicaciones y familia cristiana.',     stream:'https://livestreamcdn.net:2000/stream/RadioVisionCristianaRadio/' },
    // Argentina — verificadas
    { id:'hacedor',       name:'El Hacedor Radio',           type:'Argentina · Evangélica',         note:'Música y mensajes del evangelio.',                 stream:'https://stream.zeno.fm/f7vpqramxrhvv' },
    { id:'cristo-rey',    name:'FM Cristo Rey 105.1',        type:'Argentina · Cristiana',          note:'Radio cristiana evangélica de Argentina.',         stream:'https://stream.zeno.fm/ujs4w68jh93uv' },
    // Ecuador — verificada
    { id:'hcjb',          name:'HCJB La Voz de los Andes',  type:'Ecuador · Evangélica',           note:'Radio evangélica histórica de Ecuador.',           stream:'https://streamingecuador.net:8287/hcjb' },
    // Costa Rica — verificada
    { id:'faro-caribe',   name:'Faro del Caribe',            type:'Costa Rica · Evangélica',        note:'Primera radio evangélica de Costa Rica.',          stream:'https://sp.unoredcdn.net/8032/stream' },
    // México — verificadas
    { id:'radio-familia-mx', name:'Radio Familia Parral',    type:'México · Cristiana',             note:'Radio familiar cristiana desde Chihuahua.',        stream:'https://radiofamilia1.radioca.st/stream' },
    { id:'estereo-vida',  name:'Estéreo Vida 93.1 FM',       type:'México · Cristiana',             note:'Radio cristiana desde Ciudad del Carmen.',         stream:'https://stream.zeno.fm/5y45gqtbcchvv' },
    // Latinoamérica — verificada
    { id:'nuevo-tiempo',  name:'Radio Nuevo Tiempo',         type:'Latinoamérica · Cristiana',      note:'Música y esperanza para la familia.',              stream:'https://stream.live.novotempo.com/radio/smil:radionuevotiempo.smil/playlist.m3u8' },
  ];

  const BLOCKED = ['catolic','católic','catholic','radio maria','radio maría','vatican','vaticano','guadalupe','fatima','fátima','virgen','santuario','cope ','mariana','arquidiocesis','diocesis','parroquia','sagrado corazon','inmaculada','pontificia','eucaristia'];
  const SPANISH_CC = ['AR','MX','ES','CO','PE','CL','VE','UY','PY','BO','EC','CU','DO','GT','HN','NI','CR','PA','SV','PR','US'];
  const FAVS_KEY='pv-radio-favs', CUSTOM_KEY='pv-radio-custom', HIDDEN_KEY='pv-radio-hidden';

  const $ = (s,r=document)=>r.querySelector(s);
  const norm = t=>(t||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').trim();
  const lsGet = (k,fb)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(fb))}catch{return fb}};
  const lsSet = (k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
  const rid = r=>r.id||`${norm(r.name)}|${(r.stream||'').trim()}`;
  const isFav = r=>lsGet(FAVS_KEY,[]).some(x=>rid(x)===rid(r));
  const toggleFav = r=>{const f=lsGet(FAVS_KEY,[]),id=rid(r),i=f.findIndex(x=>rid(x)===id);if(i>=0)f.splice(i,1);else f.push({...r,id});lsSet(FAVS_KEY,f)};
  const isBlocked = s=>BLOCKED.some(w=>norm(`${s.name||''} ${s.tags||''} ${s.homepage||''}  ${s.url||''}`).includes(norm(w)));
  const isSpanish = s=>!s.countrycode||SPANISH_CC.includes(String(s.countrycode).toUpperCase());

  // ── Audio único compartido ─────────────────────────────────────────────────
  const AUD = new Audio();
  AUD.preload = 'none';
  AUD.setAttribute('playsinline', '');           // iOS: no pantalla completa
  AUD.setAttribute('webkit-playsinline', '');    // iOS legacy
  AUD.setAttribute('x-webkit-airplay', 'allow'); // AirPlay

  // ── Reanudar si iOS pausó el audio al volver al primer plano ──────────────
  let _radioWasPlaying = false;
  let _radioLastSrc = '';
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      _radioWasPlaying = !!current && !AUD.paused;
      _radioLastSrc = AUD.src || '';
    } else if (_radioWasPlaying && AUD.paused && _radioLastSrc && current) {
      // iOS pausó el stream en background — intentar reanudar
      AUD.play().catch(() => {});
      _radioWasPlaying = false;
    }
  });

  let current=null, cache=null, cachePromise=null, panel=null, mode='dial', q='', dialIdx=0;

  // ── Estilos ────────────────────────────────────────────────────────────────
  function injectCSS(){
    if($('#cr-style-v11'))return;
    ['#cr-style-v10','#cr-style-v7','#canales-radios-style-v7','#canales-radios-style-v4','#canales-radios-style'].forEach(id=>$(id)?.remove());
    const st=document.createElement('style');st.id='cr-style-v11';st.textContent=`
.cr-panel{position:fixed;inset:0;z-index:9000;background:var(--bg,#1a1007);color:var(--text,#f5deb3);overflow-y:auto;padding:14px 14px calc(200px + env(safe-area-inset-bottom))}
.cr-inner{max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:14px}
.cr-head{position:sticky;top:0;z-index:2;backdrop-filter:blur(14px);background:linear-gradient(to bottom,var(--bg,#1a1007) 70%,transparent);padding:10px 0 14px;display:flex;justify-content:space-between;align-items:flex-start;gap:10px}
.cr-head-left h1{font-size:clamp(22px,6vw,30px);margin:2px 0 4px;line-height:1.05}
.cr-head-left p{font-size:13px;color:var(--muted,#a08060);margin:0}
.cr-close{border:1px solid var(--line,rgba(200,150,80,.25));background:var(--card2,rgba(255,220,150,.08));color:var(--text,#f5deb3);border-radius:999px;padding:9px 14px;font-weight:900;white-space:nowrap;cursor:pointer}
.cr-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.cr-tab{border:1px solid var(--line,rgba(200,150,80,.25));background:var(--card,rgba(255,220,150,.05));color:var(--text,#f5deb3);border-radius:14px;padding:10px 4px;font-weight:900;font-size:11px;text-align:center;cursor:pointer}
.cr-tab.on{background:linear-gradient(135deg,var(--brand,#9a3412),var(--brand2,#f97316));color:#fff;border-color:transparent}
.cr-search{width:100%;border:1px solid var(--line,rgba(200,150,80,.25));background:var(--card2,rgba(255,220,150,.08));color:var(--text,#f5deb3);border-radius:18px;padding:13px 16px;font:inherit;box-sizing:border-box}
.cr-list{display:grid;gap:12px}
.cr-card{position:relative;border:1px solid var(--line,rgba(200,150,80,.2));background:var(--card,rgba(255,220,150,.05));border-radius:22px;padding:16px}
.cr-card h3{margin:4px 0 6px;font-size:18px;padding-right:46px}
.cr-label{font-size:12px;color:var(--brand,#f97316);font-weight:900;text-transform:uppercase;letter-spacing:.06em}
.cr-note{font-size:13px;color:var(--muted,#a08060);margin:0}
.cr-fav{position:absolute;top:14px;right:14px;width:38px;height:38px;border-radius:50%;border:1px solid var(--line,rgba(200,150,80,.25));background:var(--card2,rgba(255,220,150,.08));color:var(--text,#f5deb3);font-size:17px;cursor:pointer;display:grid;place-items:center}
.cr-fav.on{background:linear-gradient(135deg,#ef4444,#ec4899);border-color:transparent;color:#fff}
.cr-btn{width:100%;border:0;border-radius:999px;padding:11px 14px;font-weight:900;margin-top:9px;min-height:44px;cursor:pointer;font:inherit}
.cr-btn.primary{background:linear-gradient(135deg,var(--brand,#9a3412),var(--brand2,#f97316));color:#fff}
.cr-btn.ghost{background:transparent;border:1px solid var(--line,rgba(200,150,80,.3));color:var(--text,#f5deb3)}
.cr-btn.danger{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.4);color:#ef4444}
.cr-btn.sm{padding:8px 12px;font-size:13px;min-height:36px;width:auto}
.cr-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
.cr-empty{padding:22px;text-align:center;color:var(--muted,#a08060);border:1px dashed var(--line,rgba(200,150,80,.2));border-radius:18px}
.cr-spin{padding:28px;text-align:center;color:var(--muted,#a08060)}
.cr-form{border:1px solid var(--line,rgba(200,150,80,.2));background:var(--card,rgba(255,220,150,.05));border-radius:20px;padding:16px;display:flex;flex-direction:column;gap:10px}
.cr-form input{border:1px solid var(--line,rgba(200,150,80,.25));background:var(--card2,rgba(255,220,150,.08));color:var(--text,#f5deb3);border-radius:14px;padding:11px 14px;font:inherit;width:100%;box-sizing:border-box}
.cr-player{position:fixed;left:10px;right:10px;bottom:calc(72px + env(safe-area-inset-bottom));z-index:9001;background:var(--card,rgba(30,15,5,.96));border:1px solid var(--line,rgba(200,150,80,.3));border-radius:20px;padding:11px 14px;display:grid;grid-template-columns:1fr auto auto auto auto;gap:8px;align-items:center;box-shadow:0 16px 48px rgba(0,0,0,.5);max-width:720px;margin:0 auto;backdrop-filter:blur(16px)}
.cr-pname{font-weight:900;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cr-pstate{font-size:11px;color:var(--muted,#a08060)}
.cr-pbtn{border:0;width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--brand,#9a3412),var(--brand2,#f97316));color:#fff;font-weight:900;font-size:16px;cursor:pointer}
.cr-pclose{border:1px solid var(--line,rgba(200,150,80,.25));background:transparent;color:var(--text,#f5deb3);border-radius:50%;width:32px;height:32px;cursor:pointer;font-size:14px}
.cr-dial-box{background:linear-gradient(180deg,#2a1805,#150b02);border-radius:22px;padding:18px;color:#f5deb3;border:1px solid rgba(212,165,116,.2)}
.cr-dial-brand{text-align:center;font-family:Georgia,serif;letter-spacing:.22em;font-size:13px;color:#d4a574;padding-bottom:10px;margin-bottom:10px;border-bottom:1px solid rgba(212,165,116,.2)}
.cr-dial-screen{background:linear-gradient(180deg,#f4e4a1,#dfc96e);color:#2a1805;border-radius:10px;padding:14px;text-align:center;font-family:'Courier New',monospace;box-shadow:inset 0 3px 8px rgba(0,0,0,.35);margin-bottom:14px}
.cr-dial-freq{font-size:13px;opacity:.65;letter-spacing:.15em}
.cr-dial-name{font-size:20px;font-weight:900;margin:5px 0 3px;line-height:1.2}
.cr-dial-status{font-size:11px;opacity:.6}
.cr-dial-track{position:relative;background:linear-gradient(180deg,#e8d060,#c4a030);border-radius:6px;height:28px;margin-bottom:14px;border:2px solid #1a0e00;overflow:hidden}
.cr-dial-needle{position:absolute;top:2px;bottom:2px;width:3px;background:#d62828;border-radius:2px;transform:translateX(-50%);box-shadow:0 0 8px rgba(214,40,40,.7);transition:left .25s ease}
.cr-dial-marks{display:flex;justify-content:space-between;font-size:10px;color:#c4a030;font-family:'Courier New',monospace;font-weight:900;margin-top:2px;padding:0 4px}
.cr-dial-ctrl{display:grid;grid-template-columns:52px 1fr 52px;gap:10px;align-items:center;margin-top:10px}
.cr-dial-knob{width:52px;height:52px;border-radius:50%;border:2px solid #d4a574;background:radial-gradient(circle at 30% 30%,#7a5220,#2a1805);color:#f5deb3;font-weight:900;font-size:20px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.5)}
.cr-dial-play{background:linear-gradient(135deg,#c0392b,#8e1010);border:2px solid rgba(255,220,150,.4);color:#fff;border-radius:999px;padding:13px;font-weight:900;font-size:15px;cursor:pointer;min-height:50px}
.cr-dial-count{text-align:center;font-size:11px;color:#c4a030;opacity:.65;margin:8px 0}
.cr-home-card{border-color:rgba(236,72,153,.4)!important;background:linear-gradient(135deg,rgba(236,72,153,.1),var(--card))!important}
.cr-dial-search-wrap{position:relative;margin-bottom:12px}
#cr-dial-sug{position:absolute;top:calc(100% + 4px);left:0;right:0;z-index:20;background:var(--bg,#1a1007);border:1px solid var(--line,rgba(200,150,80,.3));border-radius:16px;overflow:hidden;max-height:220px;overflow-y:auto;display:none;box-shadow:0 8px 24px rgba(0,0,0,.5)}
.cr-dial-vol{display:flex;align-items:center;gap:10px;margin-top:12px;padding:0 2px}
.cr-dial-vol span{font-size:16px;min-width:20px;text-align:center;color:#d4a574}
.cr-dial-vol input[type=range]{flex:1;accent-color:#c0392b;height:6px;cursor:pointer;border-radius:4px}
.cr-sug-item{display:block;width:100%;text-align:left;padding:11px 16px;border:0;border-bottom:1px solid var(--line,rgba(200,150,80,.1));background:transparent;color:var(--text,#f5deb3);cursor:pointer;font:inherit}
.cr-sug-item:last-child{border-bottom:0}
.cr-sug-item:hover,.cr-sug-item:focus{background:var(--card2,rgba(255,220,150,.1))}
.cr-sug-item small{display:block;font-size:10px;opacity:.55;font-weight:400;margin-top:2px}
@media(min-width:580px){.cr-list{grid-template-columns:1fr 1fr}}
@media(max-width:400px){.cr-tabs{grid-template-columns:repeat(2,1fr)}}
    `;document.head.appendChild(st);
  }

  // ── Reproducción ───────────────────────────────────────────────────────────
  function stopRadio(){
    try{AUD.pause();AUD.src='';AUD.load()}catch{}
    current?.el?.remove();current=null;
    try{navigator.mediaSession&&(navigator.mediaSession.metadata=null,navigator.mediaSession.playbackState='none')}catch{}
    document.dispatchEvent(new CustomEvent('pv-radio',{detail:{name:''}}));
    document.dispatchEvent(new CustomEvent('palabra-viva-radio',{detail:{name:''}}));
  }

  function playRadio(r){
    if(!r?.stream)return Promise.resolve();
    // Exclusión mutua: si la Biblia en audio está sonando, pararla primero
    try{if(window.PalabraVivaAudioBible?.isPlaying?.())window.PalabraVivaAudioBible.stop();}catch{}
    // Solo pausar — src='' dispara onerror asíncrono que cortocircuita el stream nuevo
    try{AUD.pause()}catch{}
    current?.el?.remove();current=null;

    // Construir/reusar el player fijo
    let el=document.querySelector('.cr-player');
    if(!el){el=document.createElement('div');el.className='cr-player';document.body.appendChild(el);}
    el.innerHTML=`
      <div style="display:flex;align-items:center;gap:8px;min-width:0">
        <span style="font-size:22px;flex-shrink:0">📻</span>
        <div style="min-width:0">
          <div class="cr-pname">${r.name}</div>
          <div class="cr-pstate">⏳ Conectando…</div>
        </div>
      </div>
      <button class="cr-pbtn" data-pp title="Play/Pausa">▶</button>
      <button class="cr-pbtn" style="font-size:13px" data-prev title="Anterior">⏮</button>
      <button class="cr-pbtn" style="font-size:13px" data-skip title="Siguiente">⏭</button>
      <button class="cr-pclose" data-stop title="Cerrar">✕</button>`;

    const stEl=$('.cr-pstate',el), ppBtn=$('[data-pp]',el);

    AUD.onplaying=()=>{stEl.textContent='🔴 En vivo';ppBtn.textContent='⏸';try{navigator.mediaSession.playbackState='playing'}catch{};document.dispatchEvent(new CustomEvent('pv-radio',{detail:{name:r.name,playing:true}}));};
    AUD.onpause=()=>{stEl.textContent='Pausado';ppBtn.textContent='▶';try{navigator.mediaSession.playbackState='paused'}catch{};if(current)document.dispatchEvent(new CustomEvent('pv-radio',{detail:{name:r.name,playing:false}}));};
    AUD.onwaiting=()=>{stEl.textContent='⏳ Cargando…'};
    AUD.onerror=()=>{stEl.textContent='❌ Sin señal — tocá → para saltar';ppBtn.textContent='↻'};
    AUD.onstalled=()=>{stEl.textContent='⚠️ Sin respuesta…'};

    ppBtn.onclick=e=>{e.stopPropagation();AUD.paused?AUD.play().catch(err=>{stEl.textContent=err?.name==='NotAllowedError'?'Tocá ▶':'❌ Sin señal';ppBtn.textContent='▶';}):AUD.pause()};
    $('[data-stop]',el).onclick=e=>{e.stopPropagation();stopRadio()};
    $('[data-prev]',el).onclick=e=>{
      e.stopPropagation();
      if(!cache||cache.length<2)return;
      dialIdx=(dialIdx-1+cache.length)%cache.length;
      playRadio(cache[dialIdx]);
    };
    $('[data-skip]',el).onclick=e=>{
      e.stopPropagation();
      if(!cache||cache.length<2)return;
      dialIdx=(dialIdx+1)%cache.length;
      playRadio(cache[dialIdx]);
    };

    try{
      navigator.mediaSession.metadata=new MediaMetadata({
        title:r.name,
        artist:'Palabra Viva',
        album:r.type||'Radio Cristiana',
        artwork:[
          {src:'/icon-192.png',sizes:'192x192',type:'image/png'},
          {src:'/icon-512.png',sizes:'512x512',type:'image/png'}
        ]
      });
      navigator.mediaSession.setActionHandler('play',()=>AUD.play().catch(()=>{}));
      navigator.mediaSession.setActionHandler('pause',()=>AUD.pause());
      navigator.mediaSession.setActionHandler('stop',stopRadio);
      navigator.mediaSession.setActionHandler('nexttrack',()=>{
        if(!cache||cache.length<2)return;
        dialIdx=(dialIdx+1)%cache.length;
        playRadio(cache[dialIdx]);
      });
      navigator.mediaSession.setActionHandler('previoustrack',()=>{
        if(!cache||cache.length<2)return;
        dialIdx=(dialIdx-1+cache.length)%cache.length;
        playRadio(cache[dialIdx]);
      });
    }catch{}

    // Asignar src y reproducir — NO llamar load() antes de play(), provoca AbortError silencioso
    AUD.src=r.stream;
    const playP=AUD.play();
    if(playP){
      playP.catch(err=>{
        if(err?.name==='NotAllowedError'){stEl.textContent='Tocá ▶ para iniciar';ppBtn.textContent='▶';}
        else{stEl.textContent='❌ Sin señal — tocá → para saltar';ppBtn.textContent='↻';}
      });
    }
    current={audio:AUD,el,station:r};
    if(cache){const i=cache.findIndex(x=>rid(x)===rid(r));if(i>=0)dialIdx=i;}
    document.dispatchEvent(new CustomEvent('pv-radio',{detail:{name:r.name}}));
    document.dispatchEvent(new CustomEvent('palabra-viva-radio',{detail:{name:r.name}}));
    return playP||Promise.resolve();
  }

  // ── Buscar radios en Radio Browser API ────────────────────────────────────
  // IMPORTANTE: solo HTTPS — el navegador bloquea HTTP desde una app HTTPS
  async function fetchAPI(){
    const servers=['https://de1.api.radio-browser.info','https://de2.api.radio-browser.info','https://nl1.api.radio-browser.info'];
    const qs=[
      '/json/stations/search?tag=christian&language=spanish&hidebroken=true&lastcheckok=1&order=clickcount&reverse=true&limit=80',
      '/json/stations/search?tag=evangelica&hidebroken=true&lastcheckok=1&order=clickcount&reverse=true&limit=60',
      '/json/stations/search?tag=cristiana&language=spanish&hidebroken=true&lastcheckok=1&order=clickcount&reverse=true&limit=60',
      '/json/stations/search?countrycode=US&language=spanish&tag=christian&hidebroken=true&lastcheckok=1&order=clickcount&reverse=true&limit=50',
      '/json/stations/search?countrycode=AR&tag=cristiana&hidebroken=true&lastcheckok=1&order=clickcount&reverse=true&limit=40',
      '/json/stations/search?countrycode=MX&tag=cristiana&hidebroken=true&lastcheckok=1&order=clickcount&reverse=true&limit=40',
    ];
    for(const sv of servers){
      try{
        const res=await Promise.allSettled(qs.map(q=>fetch(sv+q).then(r=>r.ok?r.json():[])));
        const all=res.flatMap(r=>r.status==='fulfilled'&&Array.isArray(r.value)?r.value:[]);
        if(!all.length)continue;
        const seen=new Set();
        return all
          // Solo HTTPS — crítico para que funcionen en app servida por HTTPS
          .filter(x=>x.url_resolved?.startsWith('https://')&&isSpanish(x)&&!isBlocked(x))
          .filter(x=>{if(seen.has(x.stationuuid))return false;seen.add(x.stationuuid);return true})
          .map(x=>({
            id:x.stationuuid,
            name:(x.name||'').trim()||'Sin nombre',
            type:`${x.country||'Internacional'} · ${x.codec||'Audio'}`,
            note:(x.tags||'').split(',').filter(Boolean).slice(0,3).join(', ')||'Radio cristiana',
            stream:x.url_resolved,
            page:x.homepage||''
          }))
          .slice(0,100);
      }catch{}
    }
    return[];
  }

  async function loadAll(){
    if(cache)return cache;
    if(!cachePromise){
      cachePromise=(async()=>{
        const api=await fetchAPI().catch(()=>[]);
        const hidden=lsGet(HIDDEN_KEY,[]);
        const seen=new Set();
        cache=[...HARD_RADIOS,...api,...lsGet(CUSTOM_KEY,[])]
          .filter(r=>!hidden.includes(rid(r)))
          .filter(r=>{const id=rid(r);if(seen.has(id))return false;seen.add(id);return true});
        cachePromise=null;
        return cache;
      })();
    }
    return cachePromise;
  }
  function myRadios(){
    const seen=new Set();
    return[...lsGet(FAVS_KEY,[]),...lsGet(CUSTOM_KEY,[])].filter(r=>{const id=rid(r);if(seen.has(id))return false;seen.add(id);return true});
  }

  // ── Componentes de tarjeta ─────────────────────────────────────────────────
  function cardHTML(r,i,kind){
    const fav=isFav(r);
    return `<article class="cr-card" data-i="${i}">
      ${kind==='explore'?`<button class="cr-fav" ${fav?'style="background:linear-gradient(135deg,#ef4444,#ec4899);color:#fff;border-color:transparent"':''} data-f aria-label="${fav?'Quitar':'Guardar'} favorito">${fav?'♥':'♡'}</button>`:''}
      <p class="cr-label">${r.type||'Radio cristiana'}</p>
      <h3>${r.name}</h3>
      <p class="cr-note">${r.note||''}</p>
      <button class="cr-btn primary" data-p>▶ Escuchar</button>
      <div class="cr-row">
        ${r.page?`<a class="cr-btn ghost sm" href="${r.page}" target="_blank" rel="noopener noreferrer">Sitio oficial</a>`:''}
        ${kind==='my'?`<button class="cr-btn danger sm" data-rm>🗑 Quitar</button>`:''}
        ${kind==='explore'?`<button class="cr-btn ghost sm" data-fav>${fav?'♥ Guardada':'♡ Favorito'}</button>`:''}
      </div>
    </article>`;
  }

  function bindCards(items,kind){
    panel?.querySelectorAll('.cr-card').forEach(c=>{
      const r=items[+c.dataset.i];if(!r)return;
      c.querySelector('[data-p]')?.addEventListener('click',e=>{e.stopPropagation();playRadio(r)});
      // Botón favorito (corazón) — actualiza UI sin recargar lista
      const favBtns=[c.querySelector('[data-f]'),c.querySelector('[data-fav]')].filter(Boolean);
      favBtns.forEach(btn=>btn.addEventListener('click',e=>{
        e.stopPropagation();
        toggleFav(r);
        const now=isFav(r);
        const heart=c.querySelector('[data-f]');
        if(heart){heart.textContent=now?'♥':'♡';if(now){heart.style.cssText='background:linear-gradient(135deg,#ef4444,#ec4899);color:#fff;border-color:transparent'}else{heart.style.cssText=''}}
        const txt=c.querySelector('[data-fav]');if(txt)txt.textContent=now?'♥ Guardada':'♡ Favorito';
      }));
      c.querySelector('[data-rm]')?.addEventListener('click',e=>{
        e.stopPropagation();
        lsSet(FAVS_KEY,lsGet(FAVS_KEY,[]).filter(x=>rid(x)!==rid(r)));
        lsSet(CUSTOM_KEY,lsGet(CUSTOM_KEY,[]).filter(x=>rid(x)!==rid(r)));
        renderList();
      });
    });
  }

  function addForm(){
    const d=document.createElement('div');
    d.className='cr-form';
    d.innerHTML=`<p class="cr-label">➕ Agregar emisora</p>
      <input data-n placeholder="Nombre de la radio" autocomplete="off">
      <input data-s placeholder="URL del stream (https://...)" autocomplete="off" type="url">
      <input data-w placeholder="Sitio web (opcional)" autocomplete="off" type="url">
      <button class="cr-btn primary">Guardar</button>`;
    d.querySelector('button').onclick=e=>{
      e.stopPropagation();
      const name=d.querySelector('[data-n]').value.trim();
      const stream=d.querySelector('[data-s]').value.trim();
      const page=d.querySelector('[data-w]').value.trim();
      if(!name||!stream.startsWith('https://')){alert('Necesitás nombre y URL que empiece con https://');return;}
      const r={id:`custom-${Date.now()}`,name,type:'Mi radio',note:'Agregada por vos',stream,page};
      const c=lsGet(CUSTOM_KEY,[]);c.push(r);lsSet(CUSTOM_KEY,c);
      const f=lsGet(FAVS_KEY,[]);f.push(r);lsSet(FAVS_KEY,f);
      cache=null;cachePromise=null;
      renderList();
    };
    return d;
  }

  // ── Dial ───────────────────────────────────────────────────────────────────
  function dialHTML(items){
    if(!items.length)return`<div class="cr-dial-box"><div class="cr-dial-brand">📻 PALABRA VIVA RADIO</div><div class="cr-empty">No hay estaciones. <button class="cr-btn ghost sm" data-restore>↺ Restaurar</button></div></div>`;
    dialIdx=Math.max(0,Math.min(dialIdx,items.length-1));
    const r=items[dialIdx];
    const playing=current&&rid(current.station)===rid(r)&&!AUD.paused;
    const pct=items.length===1?50:(dialIdx/(items.length-1))*100;
    return`<div class="cr-dial-box">
      <div class="cr-dial-brand">━━ PALABRA VIVA RADIO ━━</div>
      <div class="cr-dial-search-wrap">
        <input id="cr-dial-q" class="cr-search" placeholder="🔍 Buscar emisora…" autocomplete="off" style="margin:0">
        <div id="cr-dial-sug"></div>
      </div>
      <div class="cr-dial-screen">
        <div class="cr-dial-freq">${(88+dialIdx*(20/Math.max(1,items.length-1))).toFixed(1)} MHz</div>
        <div class="cr-dial-name" id="cr-dn">${r.name}</div>
        <div class="cr-dial-status" id="cr-ds">${playing?'🔴 EN VIVO':'SINTONIZADA'}</div>
      </div>
      <div class="cr-dial-track"><div class="cr-dial-needle" id="cr-needle" style="left:${pct}%"></div></div>
      <div class="cr-dial-marks"><span>88</span><span>92</span><span>96</span><span>100</span><span>104</span><span>108</span></div>
      <div class="cr-dial-count" id="cr-dc">${dialIdx+1} de ${items.length} estaciones</div>
      <div class="cr-dial-ctrl">
        <button class="cr-dial-knob" data-prev>◀</button>
        <button class="cr-dial-play" data-play>${playing?'⏸ DETENER':'▶ ESCUCHAR'}</button>
        <button class="cr-dial-knob" data-next>▶</button>
      </div>
      <div class="cr-dial-vol">
        <span>🔇</span>
        <input type="range" id="cr-vol" min="0" max="1" step="0.05" value="1">
        <span>🔊</span>
      </div>
      <div class="cr-row" style="margin-top:14px;justify-content:center">
        <button class="cr-btn danger sm" data-hide>🚫 Quitar del dial</button>
        <button class="cr-btn ghost sm" data-restore>↺ Restaurar ocultas</button>
      </div>
    </div>`;
  }

  function updateDialDisplay(items){
    const r=items[dialIdx];
    const el=document.getElementById('cr-dn');if(el)el.textContent=r.name;
    const st=document.getElementById('cr-ds');if(st){const pl=current&&rid(current.station)===rid(r)&&!AUD.paused;st.textContent=pl?'🔴 EN VIVO':'SINTONIZADA';}
    const nd=document.getElementById('cr-needle');if(nd)nd.style.left=`${items.length===1?50:(dialIdx/(items.length-1))*100}%`;
    const dc=document.getElementById('cr-dc');if(dc)dc.textContent=`${dialIdx+1} de ${items.length} estaciones`;
    const pb=panel?.querySelector('[data-play]');if(pb){const pl=current&&rid(current.station)===rid(items[dialIdx])&&!AUD.paused;pb.textContent=pl?'⏸ DETENER':'▶ ESCUCHAR';}
  }

  function bindDial(listEl,items){
    listEl.querySelectorAll('[data-prev],[data-next]').forEach(btn=>{
      btn.addEventListener('click',e=>{
        e.stopPropagation();
        dialIdx=btn.dataset.prev!=null?(dialIdx-1+items.length)%items.length:(dialIdx+1)%items.length;
        updateDialDisplay(items);
        // Reproducir directamente — setTimeout rompe el contexto de gesto en móvil
        playRadio(items[dialIdx]).then(()=>updateDialDisplay(items));
      });
    });
    listEl.querySelector('[data-play]')?.addEventListener('click',e=>{
      e.stopPropagation();
      const r=items[dialIdx];
      if(current&&rid(current.station)===rid(r)&&!AUD.paused){stopRadio();updateDialDisplay(items);}
      else playRadio(r).then(()=>updateDialDisplay(items));
    });
    listEl.querySelector('[data-hide]')?.addEventListener('click',e=>{
      e.stopPropagation();
      const h=lsGet(HIDDEN_KEY,[]);h.push(rid(items[dialIdx]));lsSet(HIDDEN_KEY,h);
      if(current&&rid(current.station)===rid(items[dialIdx]))stopRadio();
      cache=null;cachePromise=null;renderList();
    });
    listEl.querySelector('[data-restore]')?.addEventListener('click',e=>{
      e.stopPropagation();
      lsSet(HIDDEN_KEY,[]);cache=null;cachePromise=null;renderList();
    });

    // ── Control de volumen ───────────────────────────────────────────────────
    const volEl=listEl.querySelector('#cr-vol');
    if(volEl){
      volEl.value=AUD.volume;
      volEl.addEventListener('input',e=>{e.stopPropagation();AUD.volume=+e.target.value;});
    }

    // ── Búsqueda con sugerencias en el dial ─────────────────────────────────
    const searchEl=listEl.querySelector('#cr-dial-q');
    const sugEl=listEl.querySelector('#cr-dial-sug');
    if(searchEl&&sugEl){
      function showSug(q){
        if(!q){sugEl.style.display='none';sugEl.innerHTML='';return;}
        const matches=items
          .map((r,i)=>({r,i}))
          .filter(({r})=>norm(r.name+' '+r.type).includes(norm(q)))
          .slice(0,10);
        if(!matches.length){sugEl.style.display='none';return;}
        sugEl.innerHTML=matches.map(({r,i})=>
          `<button class="cr-sug-item" data-si="${i}">${r.name}<small>${r.type||''}</small></button>`
        ).join('');
        sugEl.style.display='block';
        sugEl.querySelectorAll('.cr-sug-item').forEach(btn=>btn.addEventListener('mousedown',e=>{
          // mousedown antes de blur para que no se cierre antes de registrar el click
          e.preventDefault();e.stopPropagation();
          dialIdx=+btn.dataset.si;
          searchEl.value='';
          sugEl.style.display='none';
          updateDialDisplay(items);
          playRadio(items[dialIdx]);
        }));
      }
      searchEl.addEventListener('input',e=>{e.stopPropagation();showSug(e.target.value.trim())});
      searchEl.addEventListener('blur',()=>setTimeout(()=>{sugEl.style.display='none'},150));
      searchEl.addEventListener('focus',e=>{if(e.target.value.trim())showSug(e.target.value.trim())});
      searchEl.addEventListener('keydown',e=>{
        if(e.key==='Escape'){sugEl.style.display='none';searchEl.value='';e.stopPropagation();}
      });
    }
  }

  // ── Render central ─────────────────────────────────────────────────────────
  async function renderList(){
    if(!panel)return;
    panel.querySelectorAll('.cr-tab').forEach(b=>b.classList.toggle('on',b.dataset.m===mode));
    const listEl=$('.cr-list',panel);

    if(mode==='misRadios'){
      const items=myRadios().filter(r=>!q||norm(r.name+' '+r.note).includes(norm(q)));
      listEl.innerHTML=items.length?items.map((r,i)=>cardHTML(r,i,'my')).join(''):'<div class="cr-empty">No tenés radios guardadas. Usá ♡ en Explorar o agregá una abajo.</div>';
      bindCards(items,'my');
      listEl.appendChild(addForm());
      return;
    }

    if(mode==='explorar'){
      listEl.innerHTML='<div class="cr-spin">🔍 Buscando radios… (puede tardar unos segundos)</div>';
      const items=await loadAll();
      if(!panel)return; // panel cerrado mientras cargaba
      const f=items.filter(r=>!q||norm(r.name+' '+r.note+' '+r.type).includes(norm(q)));
      if(!f.length){listEl.innerHTML='<div class="cr-empty">No encontramos radios con ese filtro.</div>';return;}
      listEl.innerHTML=f.map((r,i)=>cardHTML(r,i,'explore')).join('');
      bindCards(f,'explore');
      return;
    }

    if(mode==='dial'){
      listEl.innerHTML='<div class="cr-spin">📻 Cargando dial…</div>';
      const items=await loadAll();
      if(!panel)return; // panel cerrado mientras cargaba
      listEl.innerHTML=dialHTML(items);
      bindDial(listEl,items);
      listEl.appendChild(addForm());
      return;
    }

    // Canales YouTube
    const items=CHANNELS.filter(c=>!q||norm(c.name+' '+c.note).includes(norm(q)));
    listEl.innerHTML=items.map((c,i)=>`<article class="cr-card">
      <p class="cr-label">${c.type}</p><h3>${c.name}</h3><p class="cr-note">${c.note}</p>
      ${c.embed?`<button class="cr-btn primary" data-e="${i}">Ver aquí</button>`:''}
      <a class="cr-btn ghost" href="${c.channel}" target="_blank" rel="noopener" style="display:block;text-align:center;text-decoration:none;margin-top:8px">Abrir en YouTube</a>
    </article>`).join('');
    listEl.querySelectorAll('[data-e]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();openYT(items[+b.dataset.e])}));
  }

  // ── Panel principal ────────────────────────────────────────────────────────
  function openPanel(){
    injectCSS();
    document.querySelector('.cr-panel')?.remove();
    mode='dial';q='';
    panel=document.createElement('section');
    panel.className='cr-panel';
    panel.setAttribute('aria-label','Radios y canales');
    panel.innerHTML=`
      <div class="cr-inner">
        <div class="cr-head">
          <div class="cr-head-left"><h1>📻 Radios y canales</h1><p>Evangélicas · Hispanas · Sin publicidad religiosa católica</p></div>
          <button class="cr-close" data-close>Cerrar ✕</button>
        </div>
        <div class="cr-tabs">
          <button class="cr-tab" data-m="misRadios">Mis radios</button>
          <button class="cr-tab on" data-m="dial">📻 Dial</button>
          <button class="cr-tab" data-m="explorar">Explorar</button>
          <button class="cr-tab" data-m="canales">Canales</button>
        </div>
        <input class="cr-search" placeholder="Buscar por nombre…" aria-label="Buscar radio">
        <div class="cr-list"></div>
      </div>`;
    document.body.appendChild(panel);

    // Historia: empujamos estado para que "atrás" cierre el panel
    history.pushState({pvRadioPanel:true},'',location.href.split('#')[0]+'#radios');

    function closePanel(withHistory=true){
      window.removeEventListener('popstate',onPop);
      panel?.remove();panel=null;
      if(withHistory&&location.hash==='#radios')history.back();
    }
    function onPop(){
      // Siempre se limpia a sí mismo, tanto si back-navigation.js ya cerró el panel como si no
      window.removeEventListener('popstate',onPop);
      if(panel){panel.remove();panel=null;}
    }
    window.addEventListener('popstate',onPop);

    $('[data-close]',panel).addEventListener('click',e=>{e.stopPropagation();closePanel(true)});
    $('.cr-search',panel).addEventListener('input',e=>{q=e.target.value;renderList()});
    panel.querySelectorAll('.cr-tab').forEach(b=>b.addEventListener('click',e=>{
      e.stopPropagation();mode=b.dataset.m;q='';$('.cr-search',panel).value='';renderList();
    }));

    renderList();
  }

  function openYT(c){
    if(!c.embed){window.open(c.channel,'_blank','noopener');return;}
    const v=document.createElement('section');
    v.style.cssText='position:fixed;inset:0;z-index:9100;background:var(--bg,#1a1007);padding:14px;display:flex;flex-direction:column;gap:10px';
    v.innerHTML=`<div style="display:flex;justify-content:space-between"><h3>${c.name}</h3><button class="cr-close">Cerrar</button></div><iframe style="flex:1;border:1px solid var(--line,rgba(200,150,80,.2));border-radius:18px;background:#000" src="${c.embed}" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>`;
    document.body.appendChild(v);
    history.pushState({pvYT:true},'',location.href.split('#')[0]+'#canal');
    v.querySelector('.cr-close').onclick=()=>{v.remove();history.back()};
    window.addEventListener('popstate',()=>v.remove(),{once:true});
  }

  // ── Tarjeta y botón en Home ────────────────────────────────────────────────
  function addHomeCard(){
    const h1=document.querySelector('h1');
    if(!h1?.textContent?.includes('Una palabra para hoy'))return;
    if(document.querySelector('.cr-home-card'))return;
    const anchor=document.querySelector('.moodBox,.hero,.card.gradient');
    if(!anchor)return;
    const card=document.createElement('section');
    card.className='card cr-home-card';
    card.innerHTML='<p class="ref">📻 Radio cristiana</p><h3>Radios evangélicas y canales</h3><p class="soft">Dial directo. Solo evangélicas en español, sin radios católicas.</p><button class="btn">Abrir dial</button>';
    card.querySelector('button').onclick=openPanel;
    anchor.insertAdjacentElement('afterend',card);
  }

  function addQuickBtn(){
    const quick=document.querySelector('.quick');
    if(!quick||quick.querySelector('.cr-quick'))return;
    const b=document.createElement('button');b.className='cr-quick';b.textContent='📻 Radio';b.onclick=openPanel;
    quick.insertBefore(b,quick.firstChild);
  }

  // Escuchar evento de radio activa (para el botón "En vivo" del home-shortcuts)
  document.addEventListener('pv-radio',()=>{});

  window.PalabraVivaCanales={
    open:openPanel,
    openDial:()=>{openPanel()},
    stop:stopRadio,
    getCurrentRadio:()=>current?.station?.name||'',
    isPlaying:()=>!!current&&!AUD.paused,
    togglePlay:()=>{if(!current)return;AUD.paused?AUD.play().catch(()=>{}):AUD.pause();},
    prev:()=>{if(!cache||cache.length<2)return;dialIdx=(dialIdx-1+cache.length)%cache.length;playRadio(cache[dialIdx]);},
    next:()=>{if(!cache||cache.length<2)return;dialIdx=(dialIdx+1)%cache.length;playRadio(cache[dialIdx]);}
  };

  function boot(){
    injectCSS();
    addHomeCard();
    addQuickBtn();
    // Limpiar FABs viejos
    document.querySelectorAll('.cr-fab-old,.pv-radio-fab').forEach(e=>e.remove());
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  window.addEventListener('load',boot);
  setInterval(boot,1200);
})();

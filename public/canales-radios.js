(() => {
  try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch {}

  const CHANNELS = [
    { name:'Proyecto Biblia (BibleProject Español)', type:'Biblia animada · Español latino', note:'Videos oficiales sobre libros y temas bíblicos, doblados al español.', embed:'https://www.youtube-nocookie.com/embed/videoseries?list=PLlD1Kzc7omJmXnWoWlFVJ5AFOTPuYyGPg', channel:'https://www.youtube.com/c/bibleprojectespanol' },
    { name:'Nuevo Tiempo', type:'TV cristiana · Español', note:'Contenido cristiano en español latino: familia, Biblia y esperanza.', embed:null, channel:'https://www.youtube.com/@NuevoTiempoTV' },
    { name:'Enlace TV', type:'TV cristiana evangélica · Español', note:'Predicaciones y contenido cristiano evangélico en español.', embed:null, channel:'https://www.youtube.com/@enlacetv' },
    { name:'Coalición por el Evangelio', type:'Enseñanza evangélica · Español', note:'Recursos teológicos reformados y bíblicos en español latino.', embed:null, channel:'https://www.youtube.com/@coalicionporelevangelio' },
    { name:'Hillsong en Español', type:'Música de adoración · Español', note:'Canciones de adoración cristianas en español.', embed:null, channel:'https://www.youtube.com/@hillsongenespanol' }
  ];

  const HARD_RADIOS = [
    // Argentina
    { id:'bbn-es', name:'BBN Radio Español', type:'Argentina · Evangélica 24/7', note:'Música cristiana, Biblia y enseñanza 24/7 en español.', stream:'https://streams.radiomast.io/475ebed1-595e-4717-b888-64fe8fc6b09f', page:'https://bbn1.bbnradio.org/spanish/', favicon:'' },
    { id:'cadena-cristiana-evangelica', name:'Cadena Cristiana Evangélica', type:'Argentina · Evangélica', note:'Radio cristiana evangélica argentina.', stream:'https://server.laradio.online/proxy/cadenacristiana?mp=/stream', page:'https://cadenacristiana.com.ar/', favicon:'' },
    { id:'radio-vida-mendoza', name:'Radio Vida 105.1 Mendoza', type:'Argentina · Evangélica', note:'Radio cristiana desde Mendoza, Argentina.', stream:'https://streaming01.shockmedia.com.ar:10777/stream', page:'https://radiovida1051.com/', favicon:'' },
    { id:'radio-cristiana-883', name:'Radio Cristiana 88.3 Munro', type:'Argentina · Cristiana', note:'Radio cristiana de Buenos Aires.', stream:'https://server.laradio.online/proxy/radiocristiana883?mp=/stream', page:'', favicon:'' },
    { id:'777-radio-cristiana', name:'777 Radio Cristiana', type:'Argentina · Cristiana', note:'Música y mensajes cristianos.', stream:'https://stream.zeno.fm/3t3s0u7k8yzuv', page:'', favicon:'' },
    { id:'radio-imagen', name:'Radio Imagen 107.3', type:'Argentina · Cristiana evangélica', note:'Radio cristiana evangélica de Buenos Aires.', stream:'https://stream.zeno.fm/vkq0gqvd128uv', page:'', favicon:'' },
    { id:'radio-gracia', name:'Radio Gracia 100.9', type:'Argentina · Evangélica', note:'Evangelio y música cristiana desde Argentina.', stream:'https://stream.zeno.fm/r5d79e3p128uv', page:'', favicon:'' },
    // Internacional hispana
    { id:'cvclavoz', name:'CVC La Voz', type:'Hispanoamérica · Cristiana', note:'Música, devocionales y mensajes cristianos.', stream:'https://23583.live.streamtheworld.com/CVC_LA_VOZ_SC', page:'https://cvclavoz.com/escuchar-en-vivo/', favicon:'' },
    { id:'faro-caribe', name:'Faro del Caribe', type:'Costa Rica · Evangélica', note:'Radio cristiana evangélica desde Costa Rica.', stream:'https://s1.farodelcaribe.org:8443/faro', page:'https://farodelcaribe.org/', favicon:'' },
    { id:'radio-nuevo-tiempo', name:'Radio Nuevo Tiempo', type:'Latinoamérica · Cristiana', note:'Música y mensajes de esperanza para toda la familia.', stream:'https://stream.nuevotiempo.org/nuevotiempo', page:'https://nuevotiempo.org/', favicon:'' },
    { id:'ondas-de-luz', name:'Ondas de Luz', type:'Ecuador · Evangélica', note:'La primera radio evangélica de Ecuador.', stream:'https://stream.ondasdeluz.org:8000/live', page:'https://ondasdeluz.org/', favicon:'' },
    { id:'radio-luz-mx', name:'Radio Luz México', type:'México · Cristiana evangélica', note:'Música cristiana y mensajes bíblicos desde México.', stream:'https://stream.zeno.fm/gx5x8e3p128uv', page:'', favicon:'' },
    { id:'hcjb', name:'HCJB Voces Andinas', type:'Ecuador · Evangélica internacional', note:'Radio evangélica internacional desde Ecuador.', stream:'https://hcjb.streamguys1.com/HCJB-Music-AAC', page:'https://hcjb.org/', favicon:'' },
  ];

  const SPANISH_COUNTRIES = ['AR','MX','ES','CO','PE','CL','VE','UY','PY','BO','EC','CU','DO','GT','HN','NI','CR','PA','SV','PR','US'];
  const BLOCKED_WORDS = ['catolic','católic','catholic','catolico','católico','catolica','católica','radio maria','radio maría','maria radio','maría radio','vatican','vaticano','guadalupe','guadalupana','fatima','fátima','rosario','virgen','santuario','cadena cope','cope ','mariana','mariano','arquidiocesis','arquidiócesis','diocesis','diócesis','parroquia','sagrado corazon','sagrado corazón','inmaculada','concepcion','concepción','papa francisco','pontificia','eucaristia','eucaristía'];
  const FAVS_KEY='pv-radio-favs', CUSTOM_KEY='pv-radio-custom', HIDDEN_KEY='pv-radio-hidden';

  const $=(s,r=document)=>r.querySelector(s);
  const clean=t=>(t||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  const load=(k,fb)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(fb))}catch{return fb}};
  const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
  const radioId=r=>r.id||`${clean(r.name)}|${(r.stream||'').trim()}`;
  const isFav=(r,f=load(FAVS_KEY,[]))=>f.some(x=>radioId(x)===radioId(r));
  const toggleFav=r=>{const f=load(FAVS_KEY,[]),id=radioId(r),i=f.findIndex(x=>radioId(x)===id);if(i>=0)f.splice(i,1);else f.push({...r,id});save(FAVS_KEY,f)};
  const custom=()=>load(CUSTOM_KEY,[]);
  const hidden=()=>load(HIDDEN_KEY,[]);
  const hideRadio=r=>{const h=hidden();if(!h.includes(radioId(r)))h.push(radioId(r));save(HIDDEN_KEY,h)};
  const isBlocked=s=>BLOCKED_WORDS.some(w=>clean(`${s.name||''} ${s.tags||''} ${s.homepage||''} ${s.url||''}`).includes(clean(w)));
  const isSpanishCountry=s=>!s.countrycode || SPANISH_COUNTRIES.includes(String(s.countrycode).toUpperCase());

  const SHARED_AUDIO = new Audio();
  SHARED_AUDIO.preload = 'none';
  SHARED_AUDIO.crossOrigin = 'anonymous';

  let currentRadio=null, radiosCache=null, loading=false, panel=null, mode='dial', q='', dialIndex=0;

  function css(){
    if($('#canales-radios-style-v7'))return;$('#canales-radios-style')?.remove();$('#canales-radios-style-v4')?.remove();
    const st=document.createElement('style');st.id='canales-radios-style-v7';st.textContent=`
      .cr-panel{position:fixed;inset:0;z-index:55;background:var(--bg);color:var(--text);overflow:auto;padding:16px 14px calc(230px + env(safe-area-inset-bottom))}.cr-inner{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:14px}.cr-head{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:start;position:sticky;top:0;background:linear-gradient(to bottom,var(--bg),rgba(0,0,0,0));padding:8px 0 14px;z-index:2;backdrop-filter:blur(12px)}.cr-head h1{font-size:clamp(24px,7vw,32px);line-height:1.05;margin:4px 0 6px}.cr-close{border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:999px;padding:9px 12px;font-weight:900;min-width:66px}.cr-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.cr-tab{border:1px solid var(--line);background:var(--card);color:var(--text);border-radius:14px;padding:10px 6px;font-weight:900;text-align:center;font-size:12px}.cr-tab.active{background:linear-gradient(135deg,var(--brand),var(--brand2));color:#fff;border-color:transparent}.cr-search{width:100%;border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:18px;padding:14px;font:inherit}.cr-list{display:grid;grid-template-columns:1fr;gap:12px}.cr-card{position:relative;border:1px solid var(--line);background:var(--card);border-radius:24px;padding:16px;box-shadow:0 16px 38px rgba(0,0,0,.12)}.cr-card h3{margin:0 0 6px;font-size:20px;line-height:1.12;padding-right:48px}.cr-type{font-size:13px;color:var(--brand);font-weight:900;text-transform:uppercase;letter-spacing:.06em}.cr-note{color:var(--muted);word-break:break-word}.cr-fav-btn{position:absolute;top:14px;right:14px;width:38px;height:38px;border-radius:999px;border:1px solid var(--line);background:var(--card2);color:var(--text);font-size:18px}.cr-fav-btn.on{background:linear-gradient(135deg,#ef4444,#ec4899);border-color:transparent;color:#fff}.cr-btn-primary{width:100%;border:0;background:linear-gradient(135deg,var(--brand),var(--brand2));color:#fff;border-radius:999px;padding:12px 14px;font-weight:900;margin-top:10px;min-height:46px}.cr-btn-ghost{width:100%;border:1px solid var(--line);background:transparent;color:var(--text);border-radius:999px;padding:11px 14px;font-weight:900;margin-top:8px;min-height:44px}.cr-btn-danger{width:100%;border:1px solid rgba(239,68,68,.4);background:rgba(239,68,68,.08);color:#ef4444;border-radius:999px;padding:11px 14px;font-weight:900;margin-top:8px;min-height:44px}.cr-empty{padding:24px;text-align:center;color:var(--muted);border:1px dashed var(--line);border-radius:22px}.cr-loading{padding:24px;text-align:center;color:var(--muted)}.cr-form{border:1px solid var(--line);background:var(--card);border-radius:24px;padding:16px;display:flex;flex-direction:column;gap:10px}.cr-form input{width:100%;border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:14px;padding:12px;font:inherit;box-sizing:border-box}.cr-player{position:fixed;left:12px;right:12px;bottom:calc(80px + env(safe-area-inset-bottom));z-index:80;background:linear-gradient(135deg,var(--card),var(--card2));border:1px solid var(--line);border-radius:22px;padding:12px 14px;display:grid;grid-template-columns:1fr auto auto;gap:10px;align-items:center;box-shadow:0 18px 48px rgba(0,0,0,.35);max-width:760px;margin:0 auto}.cr-player-name{font-weight:900;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cr-player-state{font-size:12px;color:var(--muted);margin-top:2px}.cr-player-btn{border:0;background:linear-gradient(135deg,var(--brand),var(--brand2));color:#fff;border-radius:999px;width:42px;height:42px;font-weight:900;font-size:18px}.cr-player-close{border:1px solid var(--line);background:transparent;color:var(--text);border-radius:999px;width:34px;height:34px}.cr-home-card{border-color:rgba(236,72,153,.42);background:linear-gradient(135deg,rgba(236,72,153,.12),var(--card))}
      .cr-dial{background:linear-gradient(180deg,#3b2817 0%,#201309 100%);border-radius:24px;padding:18px;color:#f5deb3;box-shadow:0 16px 38px rgba(0,0,0,.4),inset 0 2px 0 rgba(255,220,150,.15)}.cr-dial-brand{font-family:Georgia,serif;text-align:center;font-size:14px;letter-spacing:.25em;color:#d4a574;font-weight:700;margin-bottom:10px;border-bottom:1px solid rgba(212,165,116,.25);padding-bottom:8px}.cr-dial-display{background:linear-gradient(180deg,#f4e4a1,#e8d27d);color:#3b2817;border-radius:8px;padding:14px 16px;margin:12px 0;font-family:'Courier New',monospace;text-align:center;box-shadow:inset 0 3px 8px rgba(59,40,23,.4);border:2px solid #2a1c10}.cr-dial-display .freq{font-size:14px;letter-spacing:.2em;opacity:.7}.cr-dial-display .station{font-size:22px;font-weight:900;margin:6px 0 2px;line-height:1.15}.cr-dial-display .status{font-size:12px;opacity:.7}.cr-dial-strip{position:relative;background:linear-gradient(180deg,#f4e4a1,#d4a574);border-radius:6px;padding:10px 8px 22px;margin:14px 0;border:2px solid #2a1c10}.cr-dial-marks{display:flex;justify-content:space-between;color:#3b2817;font-size:11px;font-weight:900;font-family:'Courier New',monospace}.cr-dial-needle{position:absolute;top:6px;bottom:6px;width:3px;background:#d62828;left:50%;transform:translateX(-50%);box-shadow:0 0 8px rgba(214,40,40,.6);border-radius:2px;transition:left .3s ease}.cr-dial-controls{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;margin-top:10px}.cr-dial-knob{width:54px;height:54px;border-radius:50%;border:2px solid #d4a574;background:radial-gradient(circle at 30% 30%,#8b6332,#3b2817);color:#f5deb3;font-weight:900;font-size:18px;box-shadow:0 4px 12px rgba(0,0,0,.4),inset 0 2px 4px rgba(255,220,150,.2)}.cr-dial-play{background:linear-gradient(135deg,#d62828,#9d0208);border:2px solid #f5deb3;color:#fff;border-radius:999px;padding:14px;font-weight:900;font-size:16px;min-height:52px}.cr-viewer{position:fixed;inset:0;z-index:70;background:var(--bg);color:var(--text);padding:14px;display:flex;flex-direction:column;gap:10px}.cr-viewer-frame{width:100%;height:72vh;border:1px solid var(--line);border-radius:22px;background:#000}@media(min-width:620px){.cr-list{grid-template-columns:1fr 1fr}.cr-viewer-frame{height:78vh}}@media(max-width:420px){.cr-tabs{grid-template-columns:repeat(2,1fr)}}`;
    document.head.appendChild(st);
  }

  function stopRadio(){
    try{SHARED_AUDIO.pause();SHARED_AUDIO.src='';SHARED_AUDIO.load()}catch{}
    if(currentRadio){currentRadio.el.remove();currentRadio=null}
    try{if('mediaSession'in navigator){navigator.mediaSession.metadata=null;navigator.mediaSession.playbackState='none'}}catch{}
  }

  async function playRadio(r){
    if(!r?.stream){if(r?.page)window.open(r.page,'_blank','noopener');return;}
    // Detener stream anterior antes de cargar el nuevo
    try{SHARED_AUDIO.pause();SHARED_AUDIO.src='';SHARED_AUDIO.load()}catch{}
    if(currentRadio){currentRadio.el.remove();currentRadio=null}

    // Reusar o crear el cartel del player
    let el=document.querySelector('.cr-player');
    if(!el){el=document.createElement('div');el.className='cr-player';document.body.appendChild(el);}
    el.innerHTML=`<div><div class="cr-player-name">${r.name}</div><div class="cr-player-state">Conectando…</div></div><button class="cr-player-btn" data-t>⏸</button><button class="cr-player-close" data-x>✕</button>`;

    const state=$('.cr-player-state',el),btn=$('[data-t]',el);
    SHARED_AUDIO.onplaying=()=>{state.textContent='En vivo';btn.textContent='⏸';try{navigator.mediaSession.playbackState='playing'}catch{}};
    SHARED_AUDIO.onpause=()=>{state.textContent='Pausado';btn.textContent='▶';try{navigator.mediaSession.playbackState='paused'}catch{}};
    SHARED_AUDIO.onwaiting=()=>state.textContent='Buffer…';
    SHARED_AUDIO.onerror=()=>{state.textContent='Sin señal — probá otra radio';btn.textContent='↻'};
    btn.onclick=()=>SHARED_AUDIO.paused?SHARED_AUDIO.play().catch(()=>state.textContent='Tocá ▶ para iniciar'):SHARED_AUDIO.pause();
    $('[data-x]',el).onclick=stopRadio;

    try{if('mediaSession'in navigator){navigator.mediaSession.metadata=new MediaMetadata({title:r.name,artist:'Palabra Viva — Radio cristiana',album:r.type||''});navigator.mediaSession.setActionHandler('play',()=>SHARED_AUDIO.play().catch(()=>{}));navigator.mediaSession.setActionHandler('pause',()=>SHARED_AUDIO.pause());navigator.mediaSession.setActionHandler('stop',stopRadio)}}catch{}

    // Cargar y reproducir el nuevo stream
    SHARED_AUDIO.src = r.stream;
    SHARED_AUDIO.load();
    try{await SHARED_AUDIO.play()}catch(e){if(e?.name!=='AbortError')state.textContent='Tocá ▶ para iniciar';btn.textContent='▶';}
    currentRadio={audio:SHARED_AUDIO,el,station:r};
    document.dispatchEvent(new CustomEvent('palabra-viva-radio',{detail:{name:r.name}}));
  }

  async function apiRadios(){const servers=['https://de1.api.radio-browser.info','https://de2.api.radio-browser.info','https://nl1.api.radio-browser.info','https://at1.api.radio-browser.info'];const path='/json/stations/search?tag=christian&language=spanish&hidebroken=true&order=clickcount&reverse=true&limit=80';for(const s of servers){try{const res=await fetch(s+path);if(!res.ok)continue;const data=await res.json();if(!Array.isArray(data))continue;return data.filter(x=>x.url_resolved&&isSpanishCountry(x)&&!isBlocked(x)&&(/MP3|AAC/i.test(x.codec||''))).slice(0,40).map(x=>({id:x.stationuuid,name:x.name?.trim()||'Sin nombre',type:`${x.country||'Internacional'} · ${x.codec||'Audio'}`,note:(x.tags||'').split(',').slice(0,3).join(', ')||'Radio cristiana evangélica',stream:x.url_resolved,page:x.homepage||'',favicon:x.favicon||''}))}catch{}}return[];}
  async function allRadios(){if(radiosCache)return radiosCache;if(loading)return null;loading=true;const a=await apiRadios().catch(()=>[]);const seen=new Set(),h=hidden();radiosCache=[...HARD_RADIOS,...a,...custom()].filter(r=>!h.includes(radioId(r))).filter(r=>{const id=radioId(r);if(seen.has(id))return false;seen.add(id);return true});loading=false;return radiosCache;}
  function myRadios(){const seen=new Set();return[...load(FAVS_KEY,[]),...custom()].filter(r=>{const id=radioId(r);if(seen.has(id))return false;seen.add(id);return true})}

  function card(r,i,kind){const fav=isFav(r);return `<article class="cr-card" data-i="${i}">${kind==='explore'?`<button class="cr-fav-btn ${fav?'on':''}" data-f>${fav?'♥':'♡'}</button>`:''}<p class="cr-type">${r.type||'Radio cristiana'}</p><h3>${r.name}</h3><p class="cr-note">${r.note||''}</p><button class="cr-btn-primary" data-p>▶ Escuchar dentro de la app</button>${r.page?`<button class="cr-btn-ghost" data-web>Sitio oficial</button>`:''}${kind==='my'?'<button class="cr-btn-danger" data-rm>🗑️ Quitar de mis radios</button>':''}${kind==='dial'?'<button class="cr-btn-danger" data-hide>🚫 Quitar del dial</button>':''}</article>`}
  function bind(items,kind){panel.querySelectorAll('.cr-card').forEach(c=>{const r=items[Number(c.dataset.i)];if(!r)return;$('[data-p]',c)?.addEventListener('click',()=>playRadio(r));$('[data-web]',c)?.addEventListener('click',()=>window.open(r.page,'_blank','noopener'));$('[data-f]',c)?.addEventListener('click',()=>{toggleFav(r);render()});$('[data-rm]',c)?.addEventListener('click',()=>{save(FAVS_KEY,load(FAVS_KEY,[]).filter(x=>radioId(x)!==radioId(r)));save(CUSTOM_KEY,custom().filter(x=>radioId(x)!==radioId(r)));render()});$('[data-hide]',c)?.addEventListener('click',()=>{if(currentRadio&&radioId(currentRadio.station)===radioId(r))stopRadio();hideRadio(r);radiosCache=null;render()})})}
  function addForm(){const d=document.createElement('div');d.className='cr-form';d.innerHTML=`<p class="cr-type">➕ Agregar una radio</p><input data-n placeholder="Nombre"><input data-s placeholder="URL del stream"><input data-w placeholder="Sitio web opcional"><button class="cr-btn-primary">Guardar radio</button>`;$('button',d).onclick=()=>{const name=$('[data-n]',d).value.trim(),stream=$('[data-s]',d).value.trim(),page=$('[data-w]',d).value.trim();if(!name||!/^https?:\/\//.test(stream)){alert('Falta nombre o URL válida.');return;}const r={id:`custom-${Date.now()}`,name,type:'Mi radio',note:'Agregada por vos',stream,page,favicon:''};const c=custom();c.push(r);save(CUSTOM_KEY,c);const f=load(FAVS_KEY,[]);f.push(r);save(FAVS_KEY,f);render()};return d;}

  function openYoutube(c){const v=document.createElement('section');v.className='cr-viewer';v.innerHTML=`<div style="display:flex;justify-content:space-between;gap:10px"><div><p class="ref">Dentro de Palabra Viva</p><h3>${c.name}</h3></div><button class="cr-close">Cerrar</button></div><iframe class="cr-viewer-frame" src="${c.embed}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe><button class="cr-btn-ghost">Abrir canal en YouTube</button>`;document.body.appendChild(v);history.pushState({crView:true},'',location.href.split('#')[0]+'#canal');$('.cr-close',v).onclick=()=>{v.remove();history.back()};$('.cr-btn-ghost',v).onclick=()=>window.open(c.channel,'_blank','noopener');window.addEventListener('popstate',()=>v.remove(),{once:true})}
  function renderDial(items){if(!items.length){return `<div class="cr-dial"><div class="cr-dial-brand">━━ PALABRA VIVA RADIO ━━</div><div class="cr-empty">📻 No hay radios para el dial.</div><button class="cr-btn-ghost" data-restore>↺ Restaurar ocultas</button></div>`}dialIndex=Math.max(0,Math.min(dialIndex,items.length-1));const r=items[dialIndex],isPlaying=currentRadio&&radioId(currentRadio.station)===radioId(r)&&!SHARED_AUDIO.paused;const left=items.length===1?50:(dialIndex/(items.length-1))*100;return `<div class="cr-dial"><div class="cr-dial-brand">━━ PALABRA VIVA RADIO ━━</div><div class="cr-dial-display"><div class="freq">${(88+dialIndex*(20/Math.max(1,items.length-1))).toFixed(1)} MHz</div><div class="station" id="cr-dial-name">${r.name}</div><div class="status" id="cr-dial-status">${isPlaying?'🔴 EN VIVO':'SINTONIZADA'}</div></div><div class="cr-dial-strip"><div class="cr-dial-needle" id="cr-dial-needle" style="left:${left}%"></div><div class="cr-dial-marks"><span>88</span><span>92</span><span>96</span><span>100</span><span>104</span><span>108</span></div></div><div class="cr-dial-controls"><button class="cr-dial-knob" data-prev>◀</button><button class="cr-dial-play" data-play>${isPlaying?'⏸ DETENER':'▶ ESCUCHAR'}</button><button class="cr-dial-knob" data-next>▶</button></div><p style="text-align:center;font-size:11px;color:#d4a574;margin:6px 0 0;opacity:.7">${dialIndex+1} de ${items.length} estaciones</p><button class="cr-btn-danger" data-hide style="margin-top:12px">🚫 Quitar del dial</button><button class="cr-btn-ghost" data-restore>↺ Restaurar ocultas</button></div>`}
  async function render(){if(!panel)return;panel.querySelectorAll('.cr-tab').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));const list=$('.cr-list',panel);if(mode==='misRadios'){const items=myRadios().filter(r=>!q||clean(r.name+' '+r.note).includes(clean(q)));list.innerHTML=items.length?items.map((r,i)=>card(r,i,'my')).join(''):'<div class="cr-empty">Todavía no tenés radios guardadas. Agregá una o marcá favoritas en Explorar.</div>';bind(items,'my');list.appendChild(addForm());return;}if(mode==='explorar'){const items=await allRadios();if(!items){list.innerHTML='<div class="cr-loading">Buscando radios cristianas en español…</div>';return;}const f=items.filter(r=>!q||clean(r.name+' '+r.note+' '+r.type).includes(clean(q)));list.innerHTML=f.map((r,i)=>card(r,i,'explore')).join('');bind(f,'explore');return;}if(mode==='dial'){const items=await allRadios();if(!items){list.innerHTML='<div class="cr-loading">Cargando dial…</div>';return;}
    let dialDebounce=null;
    function updateDialUI(){
      // Actualiza solo el texto/aguja sin reconstruir todo el DOM
      const r=items[dialIndex];
      const nameEl=document.getElementById('cr-dial-name');if(nameEl)nameEl.textContent=r.name;
      const needle=document.getElementById('cr-dial-needle');if(needle)needle.style.left=`${items.length===1?50:(dialIndex/(items.length-1))*100}%`;
      const freq=list.querySelector('.cr-dial-display .freq');if(freq)freq.textContent=`${(88+dialIndex*(20/Math.max(1,items.length-1))).toFixed(1)} MHz`;
      const counter=list.querySelector('.cr-dial p');if(counter)counter.textContent=`${dialIndex+1} de ${items.length} estaciones`;
    }
    function bindDial(){
      list.innerHTML=renderDial(items);
      // Agregar form de nueva radio al final del dial
      list.appendChild(addForm());
      $('[data-prev]',list)?.addEventListener('click',()=>{
        dialIndex=(dialIndex-1+items.length)%items.length;
        updateDialUI();
        clearTimeout(dialDebounce);
        dialDebounce=setTimeout(async()=>{await playRadio(items[dialIndex]);setTimeout(bindDial,250)},180);
      });
      $('[data-next]',list)?.addEventListener('click',()=>{
        dialIndex=(dialIndex+1)%items.length;
        updateDialUI();
        clearTimeout(dialDebounce);
        dialDebounce=setTimeout(async()=>{await playRadio(items[dialIndex]);setTimeout(bindDial,250)},180);
      });
      $('[data-play]',list)?.addEventListener('click',()=>{
        const r=items[dialIndex];
        if(currentRadio&&radioId(currentRadio.station)===radioId(r)&&!SHARED_AUDIO.paused){stopRadio();setTimeout(bindDial,100);}
        else{playRadio(r).then(()=>setTimeout(bindDial,250));}
      });
      $('[data-hide]',list)?.addEventListener('click',()=>{hideRadio(items[dialIndex]);if(currentRadio&&radioId(currentRadio.station)===radioId(items[dialIndex]))stopRadio();radiosCache=null;render()});
      $('[data-restore]',list)?.addEventListener('click',()=>{save(HIDDEN_KEY,[]);radiosCache=null;render()});
    }
    bindDial();return;}const items=CHANNELS.filter(c=>!q||clean(c.name+' '+c.note+' '+c.type).includes(clean(q)));list.innerHTML=items.map((c,i)=>`<article class="cr-card"><p class="cr-type">${c.type}</p><h3>${c.name}</h3><p class="cr-note">${c.note}</p>${c.embed?`<button class="cr-btn-primary" data-e="${i}">Ver dentro de la app</button><button class="cr-btn-ghost" data-c="${i}">Abrir canal en YouTube</button>`:`<button class="cr-btn-primary" data-c="${i}">Abrir canal en YouTube</button>`}</article>`).join('');list.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>openYoutube(items[Number(b.dataset.e)]));list.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>window.open(items[Number(b.dataset.c)].channel,'_blank','noopener'));}
  function openPanel(){css();document.querySelector('.cr-panel')?.remove();mode='dial';q='';panel=document.createElement('section');panel.className='cr-panel';panel.innerHTML=`<div class="cr-inner"><div class="cr-head"><div><p class="ref">Ver y escuchar</p><h1>Radios y canales</h1><p class="soft">Dial directo, radios evangélicas en español y canales cristianos.</p></div><button class="cr-close">Cerrar</button></div><div class="cr-tabs"><button class="cr-tab" data-mode="misRadios">Mis radios</button><button class="cr-tab" data-mode="explorar">Explorar</button><button class="cr-tab active" data-mode="dial">📻 Dial</button><button class="cr-tab" data-mode="canales">Canales</button></div><input class="cr-search" placeholder="Buscar por nombre…"><div class="cr-list"></div></div>`;document.body.appendChild(panel);history.pushState({crPanel:true},'',location.href.split('#')[0]+'#radios');$('.cr-close',panel).onclick=()=>{panel.remove();history.back()};$('.cr-search',panel).oninput=e=>{q=e.target.value;render()};panel.querySelectorAll('.cr-tab').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;q='';$('.cr-search',panel).value='';render()});window.addEventListener('popstate',()=>panel?.remove(),{once:true});render()}
  function addQuick(){const quick=document.querySelector('.quick');if(!quick||document.querySelector('.cr-quick'))return;const b=document.createElement('button');b.className='cr-quick';b.textContent='Ver';b.onclick=openPanel;quick.insertBefore(b,quick.firstChild)}
  function addHome(){const title=document.querySelector('h1')?.textContent||'';if(!title.includes('Una palabra para hoy')||document.querySelector('.cr-home-card'))return;const anchor=document.querySelector('.respuestas-home-card')||document.querySelector('.pv-path-card')||document.querySelector('.moodBox')||document.querySelector('.hero');if(!anchor)return;const card=document.createElement('section');card.className='card cr-home-card';card.innerHTML='<p class="ref">Ver y escuchar</p><h3>📻 Radio cristiana y canales</h3><p class="soft">Dial directo dentro de la app, sin necesidad de favoritos.</p><button class="btn">Abrir dial</button>';card.querySelector('button').onclick=openPanel;anchor.insertAdjacentElement('afterend',card)}
  window.PalabraVivaCanales={open:openPanel,openDial:()=>{openPanel();mode='dial';render()},getCurrentRadio:()=>currentRadio?.station?.name||''};
  function boot(){css();addQuick();addHome()}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();window.addEventListener('load',boot);setInterval(boot,900);
})();
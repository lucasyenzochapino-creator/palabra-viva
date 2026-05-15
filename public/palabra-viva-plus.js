(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  function css() {
    if ($('#pv-plus-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-plus-style';
    st.textContent = `
      .pv-path-card,.pv-beginner-card{border-color:rgba(245,158,11,.45);background:linear-gradient(135deg,rgba(245,158,11,.14),var(--card))}
      .pv-path-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}.pv-path-step{border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:20px;padding:13px;text-align:left;font-weight:900;min-height:76px}.pv-path-step span{display:block;font-size:13px;color:var(--muted);font-weight:700;margin-top:4px}
      .pv-panel{position:fixed;inset:0;z-index:50;background:var(--bg);color:var(--text);overflow:auto;padding:18px 14px 130px}.pv-panel-inner{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:14px}.pv-panel-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;position:sticky;top:0;background:linear-gradient(to bottom,var(--bg),rgba(0,0,0,0));padding:8px 0 14px;z-index:2;backdrop-filter:blur(12px)}
      .pv-card{border:1px solid var(--line);background:var(--card);border-radius:24px;padding:16px;box-shadow:0 16px 38px rgba(0,0,0,.12)}.pv-close,.pv-small-btn,.pv-share-image{border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:999px;padding:10px 13px;font-weight:900}.pv-share-image{margin-left:6px;display:inline-flex;align-items:center;gap:6px}.pv-input,.pv-textarea,.pv-select{width:100%;border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:18px;padding:13px;outline:none;font:inherit;margin:6px 0 10px}.pv-textarea{min-height:90px;resize:vertical}.pv-row{display:flex;gap:8px;flex-wrap:wrap}.pv-muted{color:var(--muted);font-size:14px}.pv-success{border-color:rgba(34,197,94,.5);background:rgba(34,197,94,.1)}.pv-chapter-card{border-color:rgba(99,102,241,.45);background:linear-gradient(135deg,rgba(99,102,241,.13),var(--card))}.pv-entry{border-top:1px solid var(--line);padding:12px 0}.pv-entry:first-child{border-top:0}.pv-pill{display:inline-flex;border:1px solid var(--line);background:var(--card2);border-radius:999px;padding:8px 11px;font-weight:900;margin:3px}
      @media(max-width:420px){.pv-path-grid{grid-template-columns:1fr}.pv-panel{padding:14px 12px 130px}}
    `;
    document.head.appendChild(st);
  }

  function nav(label){ const b = $$('.nav').find(x => (x.textContent||'').toLowerCase().includes(label)); if(b) b.click(); }
  function openAnswers(){ const b = $('.res-open'); if(b) b.click(); }

  function addPathCard(){
    if(!($('h1')?.textContent||'').includes('Una palabra para hoy')) return;
    if($('.pv-path-card')) return;
    const hero = $('.hero'); if(!hero) return;
    const card = document.createElement('section');
    card.className = 'card pv-path-card';
    card.innerHTML = `<p class="ref">Mi camino de hoy</p><h3>Una guía simple para este momento</h3><p class="soft">Palabra, emoción, oración y próximo paso. No es solo leer: es caminar.</p><div class="pv-path-grid"><button class="pv-path-step" data-a="word">1. Palabra del momento<span>Cambia cada 6 horas</span></button><button class="pv-path-step" data-a="feel">2. Cómo me siento<span>Biblioteca emocional</span></button><button class="pv-path-step" data-a="pray">3. Una oración<span>Diario privado</span></button><button class="pv-path-step" data-a="answers">4. Una respuesta<span>Dios, Jesús y fe</span></button></div>`;
    hero.insertAdjacentElement('afterend', card);
    $('[data-a="word"]',card).onclick=()=>scrollTo({top:0,behavior:'smooth'});
    $('[data-a="feel"]',card).onclick=()=>nav('sentir');
    $('[data-a="pray"]',card).onclick=()=>openJournal('prayer');
    $('[data-a="answers"]',card).onclick=openAnswers;
  }

  const CH = {
    'juan 3':['Jesús habla con Nicodemo sobre nacer de nuevo.','La fe no es solo religión externa: es una vida nueva que nace de Dios.','Acercate con una oración honesta, aunque no entiendas todo.'],
    'juan 14':['Jesús consuela a sus discípulos y habla del camino al Padre.','Jesús se presenta como camino, verdad y vida, y promete paz.','Pedile a Dios dirección y paz para tu próximo paso.'],
    'mateo 6':['Jesús enseña sobre oración, prioridades y ansiedad.','Dios conoce tus necesidades y llama a buscar primero su reino.','Transformá una preocupación en oración.'],
    'mateo 11':['Jesús invita a los cansados a venir a Él.','La fe también incluye descanso, no solo esfuerzo.','Hacé una pausa y orá sin apuro.'],
    'salmos 23':['David describe a Dios como pastor cercano y cuidador.','Dios guía y acompaña incluso en valle oscuro.','Repetí: Dios está conmigo en este camino.'],
    'romanos 8':['Pablo habla de esperanza, vida en el Espíritu y amor de Dios.','Nada puede separar al creyente del amor de Dios.','Guardá una frase del capítulo para volver a ella.'],
    'filipenses 4':['Pablo habla de paz, oración, contentamiento y fortaleza.','La paz de Dios guarda el corazón cuando llevamos todo a Él.','Convertí una preocupación en oración.'],
    '1 juan 1':['Juan habla de luz, verdad, confesión y perdón.','Dios no llama a esconder el pecado, sino a caminar en verdad.','Pedí perdón y corregí un paso concreto.']
  };
  function chapterKey(){ const ref=$('.stack .card .ref')?.textContent?.toLowerCase().replace(':',' ')||''; const m=ref.match(/^(.+?)\s+(\d+)/); return m?`${m[1].trim()} ${m[2]}`:''; }
  function addChapterInsight(){
    if(!($('h1')?.textContent||'').includes('Biblia')) return;
    const key=chapterKey(); if(!key) return;
    const old=$('.pv-chapter-card'); if(old?.dataset.key===key) return; old?.remove();
    const d=CH[key]||['Este capítulo debe leerse dentro del contexto del libro.','Buscá qué revela sobre Dios, el ser humano y la esperanza.','Leé despacio y marcá una frase para tu día.'];
    const first=$$('.card').find(c=>c.querySelector('.ref')&&c.querySelector('.verse')); if(!first) return;
    const card=document.createElement('section'); card.className='card pv-chapter-card'; card.dataset.key=key;
    card.innerHTML=`<p class="ref">Entender este capítulo</p><h3>${key.replace(/\b\w/g,l=>l.toUpperCase())}</h3><p><strong>Qué está pasando:</strong> ${d[0]}</p><p><strong>Qué enseña:</strong> ${d[1]}</p><p><strong>Qué puedo aplicar hoy:</strong> ${d[2]}</p>`;
    first.insertAdjacentElement('beforebegin', card);
  }

  function wrap(ctx,text,x,y,w,lh){let line='',lines=[];text.split(' ').forEach(word=>{const t=line?line+' '+word:word;if(ctx.measureText(t).width>w&&line){lines.push(line);line=word}else line=t}); if(line) lines.push(line); lines.forEach((l,i)=>ctx.fillText(l,x,y+i*lh)); return y+lines.length*lh;}
  async function shareImage(ref, verse){
    const c=document.createElement('canvas'); c.width=1080; c.height=1920; const ctx=c.getContext('2d');
    const g=ctx.createLinearGradient(0,0,1080,1920); g.addColorStop(0,'#1f1307'); g.addColorStop(.55,'#7c4a1e'); g.addColorStop(1,'#be185d'); ctx.fillStyle=g; ctx.fillRect(0,0,1080,1920);
    ctx.fillStyle='rgba(255,255,255,.10)'; ctx.beginPath(); ctx.arc(880,240,280,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#fff7ed'; ctx.font='700 54px system-ui'; ctx.fillText('Palabra Viva',90,150); ctx.font='900 64px system-ui'; ctx.fillText(ref,90,350); ctx.font='700 58px Georgia'; const y=wrap(ctx,'“'+verse+'”',90,480,900,78);
    ctx.font='500 34px system-ui'; ctx.fillStyle='rgba(255,247,237,.86)'; wrap(ctx,'Una palabra para este momento',90,y+90,900,46); ctx.font='700 30px system-ui'; ctx.fillStyle='rgba(255,247,237,.72)'; ctx.fillText('palabra-viva-amber.vercel.app',90,1790);
    const blob=await new Promise(res=>c.toBlob(res,'image/png',.95)); const file=new File([blob],'palabra-viva.png',{type:'image/png'});
    if(navigator.canShare&&navigator.canShare({files:[file]})) await navigator.share({files:[file],title:ref,text:'Palabra Viva'}); else {const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='palabra-viva.png'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
  }
  function addImageButtons(){ $$('.card').forEach(card=>{ if(card.querySelector('.pv-share-image'))return; const ref=card.querySelector('.ref')?.textContent?.replace(/·.*/,'').trim(); const verse=card.querySelector('.verse')?.textContent?.replace(/[“”]/g,'').trim(); const row=card.querySelector('.row.wrap'); if(!ref||!verse||!row)return; const b=document.createElement('button'); b.className='pv-share-image'; b.type='button'; b.textContent='Imagen'; b.onclick=e=>{e.preventDefault();e.stopPropagation();shareImage(ref,verse)}; row.appendChild(b); }); }

  function getJ(){try{return JSON.parse(localStorage.getItem('pv-journal')||'[]')}catch{return[]}} function setJ(v){localStorage.setItem('pv-journal',JSON.stringify(v))}
  function openJournal(focus){
    css(); $('.pv-panel')?.remove(); const p=document.createElement('section'); p.className='pv-panel';
    p.innerHTML=`<div class="pv-panel-inner"><div class="pv-panel-head"><div><p class="ref">Mi diario con Dios</p><h1>Guardar lo que Dios va hablando</h1><p class="soft">Privado, sin cuenta, guardado en este dispositivo.</p></div><button class="pv-close">Cerrar</button></div><section class="pv-card"><h3>Nueva entrada</h3><label>Cómo me sentí hoy<textarea class="pv-textarea" data-f="feeling"></textarea></label><label>Palabra o versículo<textarea class="pv-textarea" data-f="word"></textarea></label><label>Oración<textarea class="pv-textarea" data-f="prayer"></textarea></label><label>Paso para hoy<input class="pv-input" data-f="step"></label><button class="btn pv-save-entry">Guardar entrada</button></section><section class="pv-card"><h3>Entradas guardadas</h3><div class="pv-journal-list"></div></section></div>`;
    document.body.appendChild(p); $('.pv-close',p).onclick=()=>p.remove(); if(focus)$('[data-f="prayer"]',p)?.focus();
    const render=()=>{const items=getJ(); $('.pv-journal-list',p).innerHTML=items.length?items.map((it,i)=>`<div class="pv-entry"><p class="pv-mini-ref">${new Date(it.date).toLocaleString()}</p><p><strong>Sentí:</strong> ${it.feeling||'-'}</p><p><strong>Palabra:</strong> ${it.word||'-'}</p><p><strong>Oración:</strong> ${it.prayer||'-'}</p><p><strong>Paso:</strong> ${it.step||'-'}</p><button class="pv-small-btn" data-del="${i}">Eliminar</button></div>`).join(''):'<p class="pv-muted">Todavía no guardaste entradas.</p>'; $$('[data-del]',p).forEach(b=>b.onclick=()=>{const arr=getJ();arr.splice(Number(b.dataset.del),1);setJ(arr);render()})};
    $('.pv-save-entry',p).onclick=()=>{const item={date:new Date().toISOString(),feeling:$('[data-f="feeling"]',p).value,word:$('[data-f="word"]',p).value,prayer:$('[data-f="prayer"]',p).value,step:$('[data-f="step"]',p).value}; setJ([item,...getJ()].slice(0,200)); $$('textarea,input',p).forEach(i=>i.value=''); render()}; render();
  }

  function openMode(){
    css(); $('.pv-panel')?.remove(); const on=localStorage.getItem('pv-beginner')==='true'; const notif=localStorage.getItem('pv-notif')||'off'; const p=document.createElement('section'); p.className='pv-panel';
    p.innerHTML=`<div class="pv-panel-inner"><div class="pv-panel-head"><div><p class="ref">Experiencia personal</p><h1>Modo nuevo creyente y recordatorios</h1><p class="soft">Ajustes simples para que la app acompañe mejor.</p></div><button class="pv-close">Cerrar</button></div><section class="pv-card ${on?'pv-success':''}"><h3>Modo “Estoy empezando”</h3><p>Usa lenguaje más simple, te recuerda por dónde empezar y evita que te pierdas.</p><button class="btn pv-beg">${on?'Desactivar':'Activar'} modo nuevo creyente</button></section><section class="pv-card"><h3>Recordatorios de palabra</h3><p>Para PWA depende del navegador. Con Capacitor se puede reforzar después.</p><select class="pv-select pv-notif"><option value="off">Sin recordatorios</option><option value="morning">Solo mañana</option><option value="night">Solo noche</option><option value="six">Cada 6 horas</option></select><button class="btn pv-allow">Pedir permiso</button></section></div>`;
    document.body.appendChild(p); $('.pv-close',p).onclick=()=>p.remove(); $('.pv-notif',p).value=notif; $('.pv-notif',p).onchange=e=>localStorage.setItem('pv-notif',e.target.value); $('.pv-beg',p).onclick=()=>{localStorage.setItem('pv-beginner',String(!on));p.remove();}; $('.pv-allow',p).onclick=async()=>{ if(!('Notification'in window)) return alert('Este navegador no soporta notificaciones.'); const perm=await Notification.requestPermission(); if(perm==='granted') new Notification('Palabra Viva',{body:'Recordatorios habilitados en este dispositivo.'}); };
  }
  function addBeginner(){ if(localStorage.getItem('pv-beginner')!=='true')return; if(!($('h1')?.textContent||'').includes('Una palabra para hoy'))return; if($('.pv-beginner-card'))return; const anchor=$('.pv-path-card')||$('.hero'); if(!anchor)return; const card=document.createElement('section'); card.className='card pv-beginner-card pv-success'; card.innerHTML=`<p class="ref">Estoy empezando</p><h3>No necesitás entender todo hoy</h3><p>Empezá por Jesús, leé poco, orá como puedas y guardá una palabra.</p><div class="pv-row"><button class="btn" data-r>Buscar respuestas</button><button class="btn ghost" data-o>Ocultar modo</button></div>`; anchor.insertAdjacentElement('afterend',card); $('[data-r]',card).onclick=openAnswers; $('[data-o]',card).onclick=()=>{localStorage.setItem('pv-beginner','false');card.remove()}; }
  function quick(){ const q=$('.quick'); if(!q)return; if(!$('.pv-diary-btn')){const b=document.createElement('button');b.className='pv-diary-btn';b.textContent='Diario';b.onclick=()=>openJournal();q.insertBefore(b,q.firstChild)} if(!$('.pv-mode-btn')){const b=document.createElement('button');b.className='pv-mode-btn';b.textContent='Mi modo';b.onclick=openMode;q.insertBefore(b,q.firstChild)} }

  function tick(){ css(); addPathCard(); addChapterInsight(); addImageButtons(); addBeginner(); quick(); }
  setInterval(tick,900); tick();
})();
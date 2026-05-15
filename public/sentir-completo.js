(() => {
  const DATA = [
    { id:'crisis', label:'No puedo más / peligro', priority:1000, keys:['no quiero vivir','me quiero matar','suicidio','suicidarme','hacerme daño','hacerme dano','no aguanto mas','no aguanto más','quiero desaparecer'], refs:[['Salmos 34:18','Cercano está Jehová á los quebrantados de corazón.'],['Salmos 46:1','Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.'],['Mateo 11:28','Venid á mí todos los que estáis trabajados y cargados, que yo os haré descansar.']], note:'Esto es serio. No te quedes solo con una app. Buscá ayuda humana ahora mismo.', prayer:'Dios, sosteneme en este minuto y acercá a alguien que pueda ayudarme.', action:'Llamá a emergencias locales o hablá ya con una persona de confianza.' },
    { id:'ansiedad', label:'Ansiedad / preocupación', keys:['ansiedad','ansioso','ansiosa','preocupado','preocupada','nervioso','nerviosa','estresado','estresada','angustia','futuro','no puedo dormir','sobrepasado','mente acelerada'], refs:[['Filipenses 4:6','Por nada estéis afanosos; sino sean notorias vuestras peticiones delante de Dios en toda oración y ruego.'],['Mateo 6:34','Así que, no os congojéis por el día de mañana.'],['1 Pedro 5:7','Echando toda vuestra solicitud en él, porque él tiene cuidado de vosotros.'],['Salmos 55:22','Echa sobre Jehová tu carga, y él te sustentará.'],['Juan 14:27','La paz os dejo, mi paz os doy: no como el mundo la da, yo os la doy.']], note:'No tenés que cargar todo el futuro hoy. Entregale a Dios lo que no podés controlar.', prayer:'Señor, ordená mi mente y dame paz.', action:'Respirá lento y orá una frase simple.' },
    { id:'miedo', label:'Miedo / inseguridad', keys:['miedo','temor','asustado','asustada','panico','pánico','inseguro','insegura','peligro','amenaza','no me animo'], refs:[['Isaías 41:10','No temas, porque yo soy contigo; no desmayes, porque yo soy tu Dios.'],['Salmos 27:1','Jehová es mi luz y mi salvación: ¿de quién temeré?'],['Salmos 46:1','Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.'],['Salmos 91:2','Diré yo á Jehová: Esperanza mía, y castillo mío; mi Dios, en él confiaré.'],['1 Juan 4:18','En amor no hay temor; mas el perfecto amor echa fuera el temor.']], note:'El miedo puede hablar fuerte, pero no tiene la última palabra.', prayer:'Dios, acompañame y guardá mi camino.', action:'No te aísles; hablá con alguien de confianza.' },
    { id:'tristeza', label:'Tristeza / desánimo', keys:['triste','tristeza','llorar','llorando','dolor','deprimido','deprimida','desanimado','desanimada','bajoneado','sin ganas'], refs:[['Salmos 34:18','Cercano está Jehová á los quebrantados de corazón.'],['Salmos 42:11','¿Por qué te abates, oh alma mía? Espera á Dios.'],['Romanos 8:28','Y sabemos que á los que á Dios aman, todas las cosas les ayudan á bien.'],['Juan 14:27','La paz os dejo, mi paz os doy.'],['Apocalipsis 21:4','Y limpiará Dios toda lágrima de los ojos de ellos.']], note:'Dios no desprecia tu dolor. Podés acercarte sin fingir.', prayer:'Señor, sosteneme hoy.', action:'Hablá con una persona segura.' },
    { id:'soledad', label:'Soledad / abandono', keys:['solo','sola','soledad','abandonado','abandonada','nadie me entiende','aislado','aislada','me siento solo','me siento sola'], refs:[['Isaías 41:10','No temas, porque yo soy contigo.'],['Salmos 23:1','Jehová es mi pastor; nada me faltará.'],['Salmos 34:18','Cercano está Jehová á los quebrantados de corazón.'],['1 Pedro 5:7','Echando toda vuestra solicitud en él, porque él tiene cuidado de vosotros.']], note:'Estar solo no significa estar olvidado por Dios.', prayer:'Señor, haceme sentir tu cercanía.', action:'Mandá un mensaje corto a alguien confiable.' },
    { id:'duelo', label:'Duelo / pérdida', keys:['duelo','perdida','pérdida','murio','murió','fallecio','falleció','luto','extraño','extrano','se fue'], refs:[['Salmos 34:18','Cercano está Jehová á los quebrantados de corazón.'],['Apocalipsis 21:4','Y limpiará Dios toda lágrima de los ojos de ellos.'],['Romanos 8:28','Todas las cosas les ayudan á bien.'],['Juan 14:27','La paz os dejo, mi paz os doy.']], note:'El duelo necesita tiempo. Dios no apura tu dolor.', prayer:'Señor, acompañame en esta pérdida.', action:'Permitite llorar y buscá compañía sana.' },
    { id:'cansancio', label:'Cansancio / desgaste', keys:['cansado','cansada','agotado','agotada','sin fuerzas','quemado','quemada','fundido','fundida','no puedo mas','no puedo más','exhausto','exhausta'], refs:[['Mateo 11:28','Venid á mí todos los que estáis trabajados y cargados, que yo os haré descansar.'],['Isaías 40:31','Mas los que esperan á Jehová tendrán nuevas fuerzas.'],['Salmos 23:1','Jehová es mi pastor; nada me faltará.'],['Gálatas 6:9','No nos cansemos, pues, de hacer bien.'],['Filipenses 4:13','Todo lo puedo en Cristo que me fortalece.']], note:'Jesús no te pide aparentar fuerza. Te invita a descansar.', prayer:'Señor, renová mis fuerzas.', action:'Hacé una pausa de cinco minutos.' },
    { id:'enojo', label:'Enojo / bronca', keys:['enojo','enojado','enojada','bronca','ira','rabia','furia','resentido','resentida','discusion','discusión'], refs:[['Proverbios 15:1','La blanda respuesta quita la ira.'],['Efesios 4:26','Airaos, y no pequéis; no se ponga el sol sobre vuestro enojo.'],['Mateo 5:9','Bienaventurados los pacificadores.'],['Colosenses 3:13','Soportándoos unos á otros, y perdonándoos unos á otros.']], note:'Sentir enojo no te obliga a actuar desde el enojo.', prayer:'Señor, dame dominio propio y palabras sabias.', action:'No respondas en caliente. Esperá y bajá el tono.' },
    { id:'culpa', label:'Culpa / vergüenza', keys:['culpa','culpable','falle','fallé','pecado','verguenza','vergüenza','me equivoque','me equivoqué','no merezco','arrepentido'], refs:[['1 Juan 1:9','Si confesamos nuestros pecados, él es fiel y justo para que nos perdone nuestros pecados.'],['Salmos 51:10','Crea en mí, oh Dios, un corazón limpio.'],['2 Corintios 5:17','Si alguno está en Cristo, nueva criatura es.'],['Hebreos 4:16','Lleguémonos pues confiadamente al trono de la gracia.']], note:'Dios no te llama para destruirte, sino para levantarte.', prayer:'Dios, ayudame a reparar y empezar de nuevo.', action:'Corregí lo que puedas corregir.' },
    { id:'perdon', label:'Necesito perdonar', keys:['perdonar','perdón','perdon','me hirieron','me lastimaron','resentimiento','rencor','no puedo perdonar'], refs:[['Colosenses 3:13','Perdonándoos unos á otros si alguno tuviere queja del otro.'],['Efesios 4:26','No se ponga el sol sobre vuestro enojo.'],['Mateo 5:9','Bienaventurados los pacificadores.']], note:'Perdonar no niega el daño; ayuda a no vivir preso del daño.', prayer:'Señor, ayudame a soltar el rencor con sabiduría.', action:'No fuerces todo hoy; empezá pidiendo ayuda a Dios.' },
    { id:'familia', label:'Problemas familiares', keys:['familia','familiar','mi casa','mis hijos','mi esposa','mi esposo','mis padres','mi mama','mi mamá','mi papa','mi papá','problemas familiares'], refs:[['Proverbios 15:1','La blanda respuesta quita la ira.'],['Mateo 5:9','Bienaventurados los pacificadores.'],['Colosenses 3:13','Soportándoos unos á otros, y perdonándoos unos á otros.'],['Salmos 23:1','Jehová es mi pastor; nada me faltará.']], note:'Dios también quiere trabajar en tu casa, tus palabras y tu paciencia.', prayer:'Señor, traé paz y sabiduría a mi familia.', action:'Buscá una conversación tranquila, no una pelea.' },
    { id:'dinero', label:'Problemas económicos', keys:['dinero','plata','deuda','deudas','economico','económico','no llego','cuentas','pagar','finanzas','problemas economicos','problemas económicos'], refs:[['Salmos 55:22','Echa sobre Jehová tu carga, y él te sustentará.'],['Proverbios 16:3','Encomienda á Jehová tus obras, y tus pensamientos serán afirmados.'],['Mateo 6:34','No os congojéis por el día de mañana.'],['Salmos 23:1','Jehová es mi pastor; nada me faltará.']], note:'La preocupación económica pesa, pero no tenés que resolver todo en pánico.', prayer:'Señor, dame provisión, orden y sabiduría.', action:'Anotá prioridades reales para hoy y evitá decisiones impulsivas.' },
    { id:'trabajo', label:'Trabajo / presión', keys:['trabajo','jefe','presion','presión','cansancio laboral','estres laboral','estrés laboral','empresa','exigido','exigida'], refs:[['Proverbios 16:3','Encomienda á Jehová tus obras.'],['Salmos 55:22','Echa sobre Jehová tu carga.'],['Gálatas 6:9','No nos cansemos de hacer bien.'],['Filipenses 4:13','Todo lo puedo en Cristo que me fortalece.']], note:'Tu valor no depende solo de tu rendimiento.', prayer:'Señor, dame orden, fuerza y calma para trabajar bien.', action:'Separá lo urgente de lo importante.' },
    { id:'direccion', label:'Dirección / decisión', keys:['decision','decisión','decidir','no se que hacer','no sé qué hacer','direccion','dirección','confundido','confundida','duda','dudas','camino','guia','guía'], refs:[['Proverbios 3:5','Fíate de Jehová de todo tu corazón.'],['Santiago 1:5','Si alguno tiene falta de sabiduría, demándela á Dios.'],['Juan 14:6','Yo soy el camino, y la verdad, y la vida.'],['Jeremías 29:11','Pensamientos de paz, y no de mal.']], note:'A veces Dios guía paso a paso.', prayer:'Señor, dame sabiduría.', action:'Anotá la decisión y pedí consejo sabio.' },
    { id:'tentacion', label:'Tentación / lucha interior', keys:['tentacion','tentación','tentado','tentada','vicio','adiccion','adicción','caigo otra vez','debilidad','lucha interna'], refs:[['1 Corintios 10:13','Fiel es Dios, que no os dejará ser tentados más de lo que podéis llevar.'],['Salmos 51:10','Crea en mí, oh Dios, un corazón limpio.'],['Filipenses 4:13','Todo lo puedo en Cristo que me fortalece.'],['Hebreos 4:16','Lleguémonos confiadamente al trono de la gracia.']], note:'Una caída no tiene que ser tu identidad.', prayer:'Dios, dame salida, fuerza y honestidad.', action:'Alejate de la situación que te empuja a caer.' },
    { id:'despertar', label:'Al despertar', keys:['al despertar','me desperte','me desperté','comenzar el dia','comenzar el día','mañana','manana','hoy empiezo'], refs:[['Salmos 118:24','Este es el día que hizo Jehová.'],['Salmos 23:1','Jehová es mi pastor; nada me faltará.'],['Proverbios 16:3','Encomienda á Jehová tus obras.'],['Romanos 12:2','Reformaos por la renovación de vuestro entendimiento.']], note:'El día no tiene que empezar en automático. Puede empezar con dirección.', prayer:'Señor, guiá mis pasos hoy.', action:'Elegí una intención simple para este día.' },
    { id:'dormir', label:'Antes de dormir', keys:['dormir','antes de dormir','noche','no puedo descansar','insomnio','me acuesto','descansar'], refs:[['Salmos 4:8','En paz me acostaré, y asimismo dormiré.'],['Juan 14:27','La paz os dejo, mi paz os doy.'],['Salmos 23:1','Jehová es mi pastor.'],['1 Pedro 5:7','Echando toda vuestra solicitud en él.']], note:'No necesitás llevarte todas las cargas a la cama.', prayer:'Señor, dejo este día en tus manos.', action:'Apagá pantallas unos minutos y orá en silencio.' },
    { id:'agradecido', label:'Agradecimiento / alegría', keys:['agradecido','agradecida','gracias','feliz','contento','contenta','bendecido','bendecida','alegre','alegria','alegría','en paz'], refs:[['Salmos 118:24','Este es el día que hizo Jehová.'],['Salmos 23:1','Jehová es mi pastor.'],['Romanos 8:28','Todas las cosas les ayudan á bien.'],['1 Timoteo 4:12','Sé ejemplo de los fieles.']], note:'La gratitud también es una forma de fe.', prayer:'Gracias, Dios, por acompañarme.', action:'Compartí ánimo con alguien.' },
    { id:'esperanza', label:'Necesito esperanza', keys:['esperanza','sin esperanza','no veo salida','todo va mal','me cuesta creer','futuro oscuro','desmotivado','desmotivada'], refs:[['Jeremías 29:11','Pensamientos de paz, y no de mal.'],['Salmos 42:11','Espera á Dios.'],['Romanos 8:28','Todas las cosas les ayudan á bien.'],['Isaías 40:31','Tendrán nuevas fuerzas.']], note:'La esperanza bíblica no niega la realidad; mira más allá de ella.', prayer:'Señor, encendé esperanza en mí.', action:'Hacé una cosa pequeña que te acerque a la vida.' },
    { id:'jovenes', label:'Jóvenes / propósito', keys:['joven','jovenes','jóvenes','proposito','propósito','identidad','quien soy','quién soy','mi futuro','estudio'], refs:[['1 Timoteo 4:12','Ninguno tenga en poco tu juventud.'],['Romanos 12:2','Renovación de vuestro entendimiento.'],['Jeremías 29:11','Pensamientos de paz.'],['Proverbios 3:5','Fíate de Jehová.']], note:'Tu edad no te descalifica para vivir con propósito.', prayer:'Señor, formá carácter y dirección en mí.', action:'Elegí una decisión pequeña que honre tu futuro.' },
    { id:'empezar', label:'Acercarme a Jesús', keys:['jesus','jesús','dios','fe','creer','empezar','lejos de dios','quiero acercarme','no conozco a dios','no conozco a jesus','no entiendo la biblia'], refs:[['Juan 14:6','Yo soy el camino, y la verdad, y la vida.'],['Juan 3:16','De tal manera amó Dios al mundo.'],['2 Corintios 5:17','Nueva criatura es.'],['Hebreos 4:16','Lleguémonos confiadamente al trono de la gracia.']], note:'No necesitás entender todo para dar el primer paso.', prayer:'Dios, si sos real, quiero conocerte.', action:'Leé Juan 3 y Juan 14 sin apuro.' }
  ];

  const clean = t => (t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const hash = t => { let h = 0; for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) >>> 0; return h; };

  function interpret(text, fallback = DATA[1]) {
    const input = clean(text);
    if (!input) return fallback;
    const scored = DATA.map(m => {
      let score = m.priority || 0;
      m.keys.forEach(k => {
        const key = clean(k);
        if (input === key) score += 25;
        else if (input.includes(key)) score += key.includes(' ') ? 14 : 6;
      });
      return { m, score };
    }).sort((a,b) => b.score - a.score);
    return scored[0].score > 0 ? scored[0].m : fallback;
  }

  function pick(mood, seed, variant) {
    return mood.refs[(hash(clean(seed || mood.id)) + variant) % mood.refs.length];
  }

  function render(box) {
    if (box.dataset.sentirCompleto === 'true') return;
    box.dataset.sentirCompleto = 'true';
    let current = DATA[1];
    let variant = 0;
    box.innerHTML = `
      <p class="ref">Sentir</p>
      <h3>¿Cómo te sentís hoy?</h3>
      <p class="soft">Elegí una opción o escribilo con tus palabras. Hay más estados y más escrituras relacionadas.</p>
      <textarea class="moodInput" rows="3" placeholder="Ej: tengo miedo, problemas familiares, deudas, estoy enojado, antes de dormir..."></textarea>
      <div class="chips moodChips"></div>
      <div class="row wrap"><button class="btn pv-find">Buscar mi palabra</button><button class="btn ghost pv-other">Otra palabra</button></div>
      <div class="moodResult"></div>
    `;
    const input = box.querySelector('.moodInput');
    const chips = box.querySelector('.moodChips');
    const result = box.querySelector('.moodResult');
    const show = () => {
      const [ref, txt] = pick(current, input.value || current.label, variant);
      result.innerHTML = `<p class="ref">${ref}</p><h3>${current.label}</h3><p class="verse">“${txt}”</p><p>${current.note}</p><p><strong>Oración:</strong> ${current.prayer}</p><p><strong>Acción pequeña:</strong> ${current.action}</p><p class="soft">Interpretado desde: ${input.value || current.label}</p>`;
    };
    DATA.filter(m => m.id !== 'crisis').forEach(m => {
      const b = document.createElement('button');
      b.className = 'chip';
      b.type = 'button';
      b.textContent = m.label;
      b.onclick = () => { current = m; input.value = m.label; variant++; show(); };
      chips.appendChild(b);
    });
    box.querySelector('.pv-find').onclick = () => { current = interpret(input.value, current); variant++; show(); };
    box.querySelector('.pv-other').onclick = () => { variant++; show(); };
    show();
  }

  function boot() {
    document.querySelectorAll('.moodBox').forEach(render);
  }
  setInterval(boot, 700);
  boot();
})();
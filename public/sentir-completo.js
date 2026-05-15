(() => {
  const VERSES = {
    sal4_8:['Salmos 4:8','En paz me acostaré, y asimismo dormiré; porque solo tú, Jehová, me harás estar confiado.'],
    sal16_8:['Salmos 16:8','A Jehová he puesto siempre delante de mí: porque está á mi diestra no seré conmovido.'],
    sal18_2:['Salmos 18:2','Jehová, roca mía y castillo mío, y mi libertador.'],
    sal23_1:['Salmos 23:1','Jehová es mi pastor; nada me faltará.'],
    sal23_4:['Salmos 23:4','Aunque ande en valle de sombra de muerte, no temeré mal alguno; porque tú estarás conmigo.'],
    sal27_1:['Salmos 27:1','Jehová es mi luz y mi salvación: ¿de quién temeré?'],
    sal30_5:['Salmos 30:5','Por la tarde durará el lloro, y á la mañana vendrá la alegría.'],
    sal34_18:['Salmos 34:18','Cercano está Jehová á los quebrantados de corazón.'],
    sal37_5:['Salmos 37:5','Encomienda á Jehová tu camino, y espera en él; y él hará.'],
    sal42_11:['Salmos 42:11','¿Por qué te abates, oh alma mía? Espera á Dios.'],
    sal46_1:['Salmos 46:1','Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.'],
    sal51_10:['Salmos 51:10','Crea en mí, oh Dios, un corazón limpio; y renueva un espíritu recto dentro de mí.'],
    sal55_22:['Salmos 55:22','Echa sobre Jehová tu carga, y él te sustentará.'],
    sal73_26:['Salmos 73:26','Mi carne y mi corazón desfallecen: mas la roca de mi corazón y mi porción es Dios para siempre.'],
    sal91_2:['Salmos 91:2','Diré yo á Jehová: Esperanza mía, y castillo mío; mi Dios, en él confiaré.'],
    sal118_24:['Salmos 118:24','Este es el día que hizo Jehová: nos gozaremos y alegraremos en él.'],
    sal119_105:['Salmos 119:105','Lámpara es á mis pies tu palabra, y lumbrera á mi camino.'],
    prov3_5:['Proverbios 3:5','Fíate de Jehová de todo tu corazón, y no estribes en tu prudencia.'],
    prov15_1:['Proverbios 15:1','La blanda respuesta quita la ira: mas la palabra áspera hace subir el furor.'],
    prov16_3:['Proverbios 16:3','Encomienda á Jehová tus obras, y tus pensamientos serán afirmados.'],
    isa40_31:['Isaías 40:31','Mas los que esperan á Jehová tendrán nuevas fuerzas.'],
    isa41_10:['Isaías 41:10','No temas, porque yo soy contigo; no desmayes, porque yo soy tu Dios.'],
    isa43_2:['Isaías 43:2','Cuando pasares por las aguas, yo seré contigo.'],
    jer29_11:['Jeremías 29:11','Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal.'],
    lam3_22:['Lamentaciones 3:22','Por la misericordia de Jehová no hemos sido consumidos.'],
    mat5_9:['Mateo 5:9','Bienaventurados los pacificadores: porque ellos serán llamados hijos de Dios.'],
    mat6_33:['Mateo 6:33','Mas buscad primeramente el reino de Dios y su justicia.'],
    mat6_34:['Mateo 6:34','Así que, no os congojéis por el día de mañana.'],
    mat11_28:['Mateo 11:28','Venid á mí todos los que estáis trabajados y cargados, que yo os haré descansar.'],
    juan3_16:['Juan 3:16','Porque de tal manera amó Dios al mundo, que ha dado á su Hijo unigénito.'],
    juan8_32:['Juan 8:32','Y conoceréis la verdad, y la verdad os libertará.'],
    juan14_6:['Juan 14:6','Yo soy el camino, y la verdad, y la vida.'],
    juan14_27:['Juan 14:27','La paz os dejo, mi paz os doy.'],
    juan16_33:['Juan 16:33','En el mundo tendréis aflicción: mas confiad, yo he vencido al mundo.'],
    rom8_28:['Romanos 8:28','Todas las cosas les ayudan á bien.'],
    rom12_2:['Romanos 12:2','Reformaos por la renovación de vuestro entendimiento.'],
    rom12_21:['Romanos 12:21','No seas vencido de lo malo; mas vence con el bien el mal.'],
    cor1_10_13:['1 Corintios 10:13','Fiel es Dios, que no os dejará ser tentados más de lo que podéis llevar.'],
    cor2_5_17:['2 Corintios 5:17','Si alguno está en Cristo, nueva criatura es.'],
    gal6_9:['Gálatas 6:9','No nos cansemos, pues, de hacer bien.'],
    efe4_26:['Efesios 4:26','Airaos, y no pequéis; no se ponga el sol sobre vuestro enojo.'],
    fil4_6:['Filipenses 4:6','Por nada estéis afanosos.'],
    fil4_7:['Filipenses 4:7','Y la paz de Dios, que sobrepuja todo entendimiento, guardará vuestros corazones.'],
    fil4_13:['Filipenses 4:13','Todo lo puedo en Cristo que me fortalece.'],
    col3_13:['Colosenses 3:13','Soportándoos unos á otros, y perdonándoos unos á otros.'],
    tim1_4_12:['1 Timoteo 4:12','Ninguno tenga en poco tu juventud; pero sé ejemplo de los fieles.'],
    heb4_16:['Hebreos 4:16','Lleguémonos pues confiadamente al trono de la gracia.'],
    heb13_5:['Hebreos 13:5','No te desampararé, ni te dejaré.'],
    sant1_5:['Santiago 1:5','Si alguno de vosotros tiene falta de sabiduría, demándela á Dios.'],
    sant1_19:['Santiago 1:19','Todo hombre sea pronto para oír, tardío para hablar, tardío para airarse.'],
    ped1_5_7:['1 Pedro 5:7','Echando toda vuestra solicitud en él, porque él tiene cuidado de vosotros.'],
    juan1_1_9:['1 Juan 1:9','Si confesamos nuestros pecados, él es fiel y justo para que nos perdone nuestros pecados.'],
    juan1_4_18:['1 Juan 4:18','En amor no hay temor; mas el perfecto amor echa fuera el temor.'],
    apoc21_4:['Apocalipsis 21:4','Y limpiará Dios toda lágrima de los ojos de ellos.']
  };
  const r = (...ids) => ids.map(id => VERSES[id]).filter(Boolean);
  const DATA = [
    { group:'Urgente', id:'crisis', label:'No puedo más / peligro', priority:1000, keys:['no quiero vivir','me quiero matar','suicidio','suicidarme','hacerme daño','hacerme dano','no aguanto mas','no aguanto más','quiero desaparecer','estoy en peligro'], refs:r('sal34_18','sal46_1','mat11_28','juan14_27','heb13_5','apoc21_4'), note:'Esto es serio. No te quedes solo con una app. Buscá ayuda humana ahora mismo.', prayer:'Dios, sosteneme en este minuto y acercá a alguien que pueda ayudarme.', action:'Llamá a emergencias locales o hablá ya con una persona de confianza.' },
    { group:'Paz interior', id:'ansiedad', label:'Ansiedad / preocupación', keys:['ansiedad','ansioso','ansiosa','preocupado','preocupada','nervioso','nerviosa','estresado','estresada','angustia','futuro','no puedo dormir','sobrepasado','mente acelerada','preocupacion','preocupación'], refs:r('fil4_6','fil4_7','mat6_34','ped1_5_7','sal55_22','juan14_27','sal46_1','mat11_28'), note:'No tenés que cargar todo el futuro hoy. Entregale a Dios lo que no podés controlar.', prayer:'Señor, ordená mi mente y dame paz.', action:'Respirá lento y orá una frase simple.' },
    { group:'Paz interior', id:'miedo', label:'Miedo / inseguridad', keys:['miedo','temor','asustado','asustada','panico','pánico','inseguro','insegura','peligro','amenaza','no me animo','temblando'], refs:r('isa41_10','sal27_1','sal46_1','sal91_2','juan1_4_18','juan14_27','sal23_4','isa43_2'), note:'El miedo puede hablar fuerte, pero no tiene la última palabra.', prayer:'Dios, acompañame y guardá mi camino.', action:'No te aísles; hablá con alguien de confianza.' },
    { group:'Paz interior', id:'paz', label:'Necesito paz', keys:['paz','necesito paz','tranquilidad','calma','quiero calma','no tengo paz','mi mente no para'], refs:r('juan14_27','fil4_7','sal4_8','sal23_1','ped1_5_7','mat11_28'), note:'La paz de Dios no siempre cambia todo afuera, pero sí puede sostenerte por dentro.', prayer:'Señor, dame tu paz real.', action:'Hacé silencio un minuto y repetí una oración corta.' },
    { group:'Dolor', id:'tristeza', label:'Tristeza / desánimo', keys:['triste','tristeza','llorar','llorando','dolor','deprimido','deprimida','desanimado','desanimada','bajoneado','sin ganas','me siento mal'], refs:r('sal34_18','sal42_11','rom8_28','juan14_27','apoc21_4','sal30_5','lam3_22','sal73_26'), note:'Dios no desprecia tu dolor. Podés acercarte sin fingir.', prayer:'Señor, sosteneme hoy.', action:'Hablá con una persona segura.' },
    { group:'Dolor', id:'soledad', label:'Soledad / abandono', keys:['solo','sola','soledad','abandonado','abandonada','nadie me entiende','aislado','aislada','me siento solo','me siento sola'], refs:r('isa41_10','sal23_1','sal34_18','ped1_5_7','heb13_5','sal23_4','juan14_27'), note:'Estar solo no significa estar olvidado por Dios.', prayer:'Señor, haceme sentir tu cercanía.', action:'Mandá un mensaje corto a alguien confiable.' },
    { group:'Dolor', id:'duelo', label:'Duelo / pérdida', keys:['duelo','perdida','pérdida','murio','murió','fallecio','falleció','luto','extraño','extrano','se fue','perdi a alguien'], refs:r('sal34_18','apoc21_4','rom8_28','juan14_27','sal30_5','sal73_26'), note:'El duelo necesita tiempo. Dios no apura tu dolor.', prayer:'Señor, acompañame en esta pérdida.', action:'Permitite llorar y buscá compañía sana.' },
    { group:'Fuerza', id:'cansancio', label:'Cansancio / desgaste', keys:['cansado','cansada','agotado','agotada','sin fuerzas','quemado','quemada','fundido','fundida','no puedo mas','no puedo más','exhausto','exhausta'], refs:r('mat11_28','isa40_31','sal23_1','gal6_9','fil4_13','sal55_22','sal73_26'), note:'Jesús no te pide aparentar fuerza. Te invita a descansar.', prayer:'Señor, renová mis fuerzas.', action:'Hacé una pausa de cinco minutos.' },
    { group:'Fuerza', id:'debilidad', label:'Me siento débil', keys:['debil','débil','debilidad','no tengo fuerzas','me falta fuerza','no puedo seguir','fragil','frágil'], refs:r('fil4_13','isa40_31','sal18_2','sal46_1','cor1_10_13','sal73_26'), note:'La debilidad puede ser un lugar donde Dios te sostiene.', prayer:'Señor, sé mi fuerza hoy.', action:'Elegí solo el próximo paso, no todo el camino.' },
    { group:'Fuerza', id:'desmotivado', label:'Desmotivado / sin propósito', keys:['desmotivado','desmotivada','sin proposito','sin propósito','no tengo ganas','para que','para qué','nada tiene sentido'], refs:r('jer29_11','rom12_2','tim1_4_12','sal119_105','gal6_9','sal42_11'), note:'El propósito muchas veces vuelve con pasos pequeños, no con grandes emociones.', prayer:'Dios, reordená mi corazón y mi camino.', action:'Hacé una cosa pequeña que te acerque a la vida.' },
    { group:'Relaciones', id:'enojo', label:'Enojo / bronca', keys:['enojo','enojado','enojada','bronca','ira','rabia','furia','resentido','resentida','discusion','discusión'], refs:r('prov15_1','efe4_26','mat5_9','col3_13','sant1_19','rom12_21'), note:'Sentir enojo no te obliga a actuar desde el enojo.', prayer:'Señor, dame dominio propio y palabras sabias.', action:'No respondas en caliente. Esperá y bajá el tono.' },
    { group:'Relaciones', id:'perdon', label:'Necesito perdonar', keys:['perdonar','perdón','perdon','me hirieron','me lastimaron','resentimiento','rencor','no puedo perdonar','guardar rencor'], refs:r('col3_13','efe4_26','mat5_9','rom12_21','sant1_19','sal51_10'), note:'Perdonar no niega el daño; ayuda a no vivir preso del daño.', prayer:'Señor, ayudame a soltar el rencor con sabiduría.', action:'No fuerces todo hoy; empezá pidiendo ayuda a Dios.' },
    { group:'Relaciones', id:'familia', label:'Problemas familiares', keys:['familia','familiar','mi casa','mis hijos','mi esposa','mi esposo','mis padres','mi mama','mi mamá','mi papa','mi papá','problemas familiares','pelea familiar'], refs:r('prov15_1','mat5_9','col3_13','sal23_1','sant1_19','rom12_21'), note:'Dios también quiere trabajar en tu casa, tus palabras y tu paciencia.', prayer:'Señor, traé paz y sabiduría a mi familia.', action:'Buscá una conversación tranquila, no una pelea.' },
    { group:'Relaciones', id:'amor', label:'Amor / relación', keys:['amor','pareja','novio','novia','relacion','relación','corazon roto','corazón roto','me dejaron','amar bien'], refs:r('juan3_16','col3_13','mat5_9','juan1_4_18','rom12_21','sal34_18'), note:'El amor sano no destruye tu paz ni tu identidad.', prayer:'Señor, enseñame a amar con verdad y sabiduría.', action:'No tomes decisiones desde la herida del momento.' },
    { group:'Responsabilidad', id:'culpa', label:'Culpa / vergüenza', keys:['culpa','culpable','falle','fallé','pecado','verguenza','vergüenza','me equivoque','me equivoqué','no merezco','arrepentido'], refs:r('juan1_1_9','sal51_10','cor2_5_17','heb4_16','juan3_16','sal37_5'), note:'Dios no te llama para destruirte, sino para levantarte.', prayer:'Dios, ayudame a reparar y empezar de nuevo.', action:'Corregí lo que puedas corregir.' },
    { group:'Responsabilidad', id:'tentacion', label:'Tentación / lucha interior', keys:['tentacion','tentación','tentado','tentada','vicio','adiccion','adicción','caigo otra vez','debilidad','lucha interna','no puedo dejar'], refs:r('cor1_10_13','sal51_10','fil4_13','heb4_16','juan8_32','cor2_5_17'), note:'Una caída no tiene que ser tu identidad.', prayer:'Dios, dame salida, fuerza y honestidad.', action:'Alejate de la situación que te empuja a caer.' },
    { group:'Responsabilidad', id:'decisiones', label:'Dirección / decisión', keys:['decision','decisión','decidir','no se que hacer','no sé qué hacer','direccion','dirección','confundido','confundida','duda','dudas','camino','guia','guía','eleccion','elección'], refs:r('prov3_5','sant1_5','juan14_6','jer29_11','sal119_105','prov16_3','sal37_5'), note:'A veces Dios guía paso a paso.', prayer:'Señor, dame sabiduría.', action:'Anotá la decisión y pedí consejo sabio.' },
    { group:'Vida diaria', id:'dinero', label:'Problemas económicos', keys:['dinero','plata','deuda','deudas','economico','económico','no llego','cuentas','pagar','finanzas','problemas economicos','problemas económicos'], refs:r('sal55_22','prov16_3','mat6_34','sal23_1','mat6_33','fil4_13','sal37_5'), note:'La preocupación económica pesa, pero no tenés que resolver todo en pánico.', prayer:'Señor, dame provisión, orden y sabiduría.', action:'Anotá prioridades reales para hoy y evitá decisiones impulsivas.' },
    { group:'Vida diaria', id:'trabajo', label:'Trabajo / presión', keys:['trabajo','jefe','presion','presión','cansancio laboral','estres laboral','estrés laboral','empresa','exigido','exigida','turno','laburo'], refs:r('prov16_3','sal55_22','gal6_9','fil4_13','mat11_28','isa40_31'), note:'Tu valor no depende solo de tu rendimiento.', prayer:'Señor, dame orden, fuerza y calma para trabajar bien.', action:'Separá lo urgente de lo importante.' },
    { group:'Vida diaria', id:'estudio', label:'Estudio / aprendizaje', keys:['estudio','estudiar','examen','aprender','facultad','escuela','no entiendo','me cuesta aprender'], refs:r('sant1_5','prov3_5','sal119_105','rom12_2','tim1_4_12'), note:'Aprender también requiere paciencia, humildad y constancia.', prayer:'Señor, dame claridad y disciplina.', action:'Estudiá 20 minutos sin distracciones.' },
    { group:'Momentos', id:'despertar', label:'Al despertar', keys:['al despertar','me desperte','me desperté','comenzar el dia','comenzar el día','mañana','manana','hoy empiezo','nuevo dia','nuevo día'], refs:r('sal118_24','sal23_1','prov16_3','rom12_2','sal119_105','mat6_33'), note:'El día no tiene que empezar en automático. Puede empezar con dirección.', prayer:'Señor, guiá mis pasos hoy.', action:'Elegí una intención simple para este día.' },
    { group:'Momentos', id:'dormir', label:'Antes de dormir', keys:['dormir','antes de dormir','noche','no puedo descansar','insomnio','me acuesto','descansar','sueño','sueno'], refs:r('sal4_8','juan14_27','sal23_1','ped1_5_7','sal55_22','fil4_7'), note:'No necesitás llevarte todas las cargas a la cama.', prayer:'Señor, dejo este día en tus manos.', action:'Apagá pantallas unos minutos y orá en silencio.' },
    { group:'Momentos', id:'agradecido', label:'Agradecimiento / alegría', keys:['agradecido','agradecida','gracias','feliz','contento','contenta','bendecido','bendecida','alegre','alegria','alegría','en paz'], refs:r('sal118_24','sal23_1','rom8_28','tim1_4_12','sal16_8','lam3_22'), note:'La gratitud también es una forma de fe.', prayer:'Gracias, Dios, por acompañarme.', action:'Compartí ánimo con alguien.' },
    { group:'Fe', id:'esperanza', label:'Necesito esperanza', keys:['esperanza','sin esperanza','no veo salida','todo va mal','me cuesta creer','futuro oscuro','desesperanza'], refs:r('jer29_11','sal42_11','rom8_28','isa40_31','apoc21_4','juan16_33','lam3_22'), note:'La esperanza bíblica no niega la realidad; mira más allá de ella.', prayer:'Señor, encendé esperanza en mí.', action:'Hacé una cosa pequeña que te acerque a la vida.' },
    { group:'Fe', id:'fe', label:'Me cuesta creer', keys:['me cuesta creer','dudo','duda de dios','no siento a dios','dios no me escucha','perdi la fe','perdí la fe','crisis de fe'], refs:r('juan14_6','sal42_11','heb4_16','juan8_32','sal119_105','jer29_11'), note:'La fe también puede empezar con una oración honesta.', prayer:'Dios, ayudame en mi incredulidad y acercame a la verdad.', action:'Leé un pasaje corto y hablá con Dios sin actuar.' },
    { group:'Fe', id:'jesus', label:'Acercarme a Jesús', keys:['jesus','jesús','dios','fe','creer','empezar','lejos de dios','quiero acercarme','no conozco a dios','no conozco a jesus','no entiendo la biblia'], refs:r('juan14_6','juan3_16','cor2_5_17','heb4_16','juan8_32','sal119_105'), note:'No necesitás entender todo para dar el primer paso.', prayer:'Dios, si sos real, quiero conocerte.', action:'Leé Juan 3 y Juan 14 sin apuro.' },
    { group:'Identidad', id:'jovenes', label:'Jóvenes / propósito', keys:['joven','jovenes','jóvenes','proposito','propósito','identidad','quien soy','quién soy','mi futuro','estudio','vocacion','vocación'], refs:r('tim1_4_12','rom12_2','jer29_11','prov3_5','sal119_105','gal6_9'), note:'Tu edad no te descalifica para vivir con propósito.', prayer:'Señor, formá carácter y dirección en mí.', action:'Elegí una decisión pequeña que honre tu futuro.' },
    { group:'Identidad', id:'nuevo', label:'Quiero empezar de nuevo', keys:['empezar de nuevo','nuevo comienzo','quiero cambiar','cambiar mi vida','volver a empezar','renovar','nueva vida'], refs:r('cor2_5_17','sal51_10','rom12_2','juan1_1_9','heb4_16','lam3_22'), note:'Dios puede trabajar con una vida que decide volver.', prayer:'Señor, renová mi corazón y mis pasos.', action:'Elegí un cambio pequeño y concreto para hoy.' }
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
        if (input === key) score += 30;
        else if (input.includes(key)) score += key.includes(' ') ? 16 : 7;
      });
      return { m, score };
    }).sort((a,b) => b.score - a.score);
    return scored[0].score > 0 ? scored[0].m : fallback;
  }
  function pick(mood, seed, variant) {
    return mood.refs[(hash(clean(seed || mood.id)) + variant) % mood.refs.length];
  }
  function injectStyles() {
    if (document.getElementById('sentir-biblioteca-style')) return;
    const style = document.createElement('style');
    style.id = 'sentir-biblioteca-style';
    style.textContent = `
      .sentir-count{display:inline-block;margin:4px 0 10px;padding:7px 10px;border-radius:999px;background:var(--card2);border:1px solid var(--line);font-weight:900;font-size:13px;color:var(--muted)}
      .sentir-groups{display:flex;flex-direction:column;gap:12px;margin:12px 0}
      .sentir-group-title{font-size:13px;font-weight:900;color:var(--brand);text-transform:uppercase;letter-spacing:.08em;margin:2px 0 8px}
      .sentir-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;max-height:420px;overflow:auto;padding-right:2px}
      .sentir-grid .chip{white-space:normal;text-align:left;line-height:1.2;border-radius:16px;padding:11px 12px}
      .sentir-help{font-size:14px;color:var(--muted);margin-top:6px}
      @media(max-width:420px){.sentir-grid{grid-template-columns:1fr;max-height:460px}}
    `;
    document.head.appendChild(style);
  }
  function render(box) {
    if (box.dataset.sentirCompleto === 'biblioteca-v2') return;
    box.dataset.sentirCompleto = 'biblioteca-v2';
    injectStyles();
    let current = DATA[1];
    let variant = 0;
    box.innerHTML = `
      <p class="ref">Biblioteca emocional bíblica</p>
      <h3>¿Cómo te sentís hoy?</h3>
      <p class="soft">Elegí un estado o escribilo con tus palabras. La app interpreta el momento y busca una palabra relacionada.</p>
      <span class="sentir-count">${DATA.length - 1} estados · más de 50 escrituras relacionadas</span>
      <textarea class="moodInput" rows="3" placeholder="Ej: tengo deudas, estoy enojado, me siento solo, quiero empezar de nuevo, me cuesta creer..."></textarea>
      <div class="sentir-groups"></div>
      <div class="row wrap"><button class="btn pv-find">Buscar mi palabra</button><button class="btn ghost pv-other">Otra palabra</button></div>
      <p class="sentir-help">Consejo: cuanto más concreto escribas, mejor interpreta. Ej: “estoy cansado del trabajo”, “tengo problemas familiares”, “no puedo dormir”.</p>
      <div class="moodResult"></div>
    `;
    const input = box.querySelector('.moodInput');
    const groups = box.querySelector('.sentir-groups');
    const result = box.querySelector('.moodResult');
    const show = () => {
      const [ref, txt] = pick(current, input.value || current.label, variant);
      result.innerHTML = `<p class="ref">${ref}</p><h3>${current.label}</h3><p class="verse">“${txt}”</p><p>${current.note}</p><p><strong>Oración:</strong> ${current.prayer}</p><p><strong>Acción pequeña:</strong> ${current.action}</p><p class="soft">Interpretado desde: ${input.value || current.label}</p>`;
    };
    const grouped = DATA.filter(m => m.id !== 'crisis').reduce((acc, m) => { (acc[m.group] ||= []).push(m); return acc; }, {});
    Object.entries(grouped).forEach(([name, list]) => {
      const wrap = document.createElement('div');
      wrap.innerHTML = `<div class="sentir-group-title">${name}</div><div class="sentir-grid"></div>`;
      const grid = wrap.querySelector('.sentir-grid');
      list.forEach(m => {
        const b = document.createElement('button');
        b.className = 'chip';
        b.type = 'button';
        b.textContent = m.label;
        b.onclick = () => { current = m; input.value = m.label; variant++; show(); };
        grid.appendChild(b);
      });
      groups.appendChild(wrap);
    });
    box.querySelector('.pv-find').onclick = () => { current = interpret(input.value, current); variant++; show(); };
    box.querySelector('.pv-other').onclick = () => { variant++; show(); };
    show();
  }
  function boot() { document.querySelectorAll('.moodBox').forEach(render); }
  setInterval(boot, 700);
  boot();
})();
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

  // ── Guía de capítulos — 70+ capítulos ────────────────────────────────────
  const CH = {
    // Juan
    'juan 1':['Juan presenta a Jesús como el Verbo eterno hecho carne, la Luz del mundo.','Jesús no es solo un maestro: es Dios que entra en la historia para salvar.','Acercate a Jesús como el pan y la luz que tu vida necesita.'],
    'juan 3':['Jesús habla con Nicodemo sobre nacer de nuevo y la fe que salva.','La fe no es religión externa: es una vida nueva que nace del Espíritu de Dios.','Orá con honestidad aunque no entiendas todo todavía.'],
    'juan 4':['Jesús habla con la samaritana y ofrece agua de vida eterna.','Dios busca a quienes nadie más busca, sin importar el pasado.','Pedile a Dios que sacie la sed que las cosas del mundo no calman.'],
    'juan 8':['Jesús perdona a la mujer, declara ser la luz y anuncia la verdad que libera.','La condena no es la última palabra de Dios; tampoco la mentira que esclaviza.','Pedí ser libre de algo que te tiene atado.'],
    'juan 10':['Jesús se presenta como el Buen Pastor que da su vida por las ovejas.','Dios no es un desconocido; te conoce, te cuida y te llama por nombre.','Escuchá la voz de Dios en la lectura y la oración de hoy.'],
    'juan 11':['Jesús llora con María y resucita a Lázaro.','Jesús siente el dolor humano y tiene poder sobre la muerte.','Confiá tus situaciones sin salida al que puede hacer lo imposible.'],
    'juan 13':['Jesús lava los pies de sus discípulos y anuncia la traición.','El liderazgo cristiano empieza por servir, no por ser servido.','Buscá una forma concreta de servir a alguien hoy.'],
    'juan 14':['Jesús consuela a sus discípulos: él es el camino, la verdad y la vida.','No hay que tener todo resuelto para caminar con Dios; solo hace falta seguirle.','Pedile a Dios paz y dirección para tu próximo paso.'],
    'juan 15':['Jesús habla de la vid y los pámpanos: la vida viene de permanecer en Él.','Sin conexión con Dios, los frutos no duran. Con Él, dan fruto abundante.','¿Qué te está alejando de esa conexión? Volvé hoy.'],
    'juan 16':['Jesús prepara a los discípulos para su partida y promete el Consolador.','En el mundo hay aflicción, pero Jesús ya venció al mundo.','Guardá Juan 16:33 para el próximo momento difícil.'],
    'juan 20':['María, Pedro y Juan encuentran la tumba vacía. Jesús resucitado se aparece.','La resurrección es real: cambia todo lo que creemos sobre la vida y la muerte.','La fe no se basa en emociones sino en hechos: Jesús resucitó.'],
    // Mateo
    'mateo 5':['Jesús enseña el Sermón del Monte: bienaventuranzas, sal, luz, ley.','El reino de Dios invierte los valores del mundo: el humilde es bendecido.','Elegí una bienaventuranza y pensá qué significa para tu vida hoy.'],
    'mateo 6':['Jesús enseña sobre oración auténtica, tesoros y la ansiedad del mañana.','Dios ya sabe lo que necesitás; la oración no es convencerlo sino confiar en Él.','Transformá una preocupación en oración concreta.'],
    'mateo 7':['Jesús habla de juzgar, pedir, la regla de oro y edificar sobre la roca.','La fe se prueba en la práctica, no solo en el conocimiento.','¿Qué área de tu vida necesita aplicar estas enseñanzas hoy?'],
    'mateo 11':['Jesús invita a los cansados a venir a Él y descansar.','La fe también incluye descanso, no solo esfuerzo constante.','Hacé una pausa real y orá sin apuro.'],
    'mateo 22':['Jesús enseña sobre el mayor mandamiento: amar a Dios y al prójimo.','Toda la ley se resume en amor. Sin amor, la religión está vacía.','¿A quién podés amar mejor hoy con acciones concretas?'],
    'mateo 28':['La resurrección y el mandato de ir a todas las naciones.','Jesús resucitó y está con nosotros todos los días hasta el fin del mundo.','Llevá hoy algo del evangelio a alguien de tu entorno.'],
    // Marcos
    'marcos 1':['Marcos presenta a Jesús que llama discípulos, sana y echa demonios.','Jesús actúa con autoridad: su palabra transforma vidas concretas.','Pedile a Jesús que actúe con esa misma autoridad en tu situación.'],
    'marcos 4':['Parábola del sembrador y la semilla: distintos terrenos y frutos.','La Palabra de Dios cae en corazones distintos; lo importante es el terreno del corazón.','¿Qué tipo de terreno es tu corazón hoy? ¿Qué lo endurece o lo prepara?'],
    'marcos 10':['Jesús bendice niños, habla al joven rico y anuncia su muerte y resurrección.','Lo que el mundo considera grande, Dios lo ve diferente: sirve, no domina.','Pedí humildad y apertura para lo que Dios te está mostrando.'],
    // Lucas
    'lucas 1':['El ángel anuncia el nacimiento de Juan el Bautista y de Jesús a María.','Dios entra en la historia de manera inesperada, a través de personas sencillas.','La respuesta de María ("Hágase en mí según tu palabra") puede ser tu oración hoy.'],
    'lucas 2':['El nacimiento de Jesús en Belén. Los pastores y Simeón lo reconocen.','Dios se hace vulnerable para estar cerca de los que menos esperan visita.','La Navidad no es solo tradición: es Dios eligiendo tu mundo para venir.'],
    'lucas 15':['Tres parábolas: la oveja perdida, la moneda perdida, el hijo pródigo.','Dios busca activamente al que se perdió, y celebra cuando vuelve.','Si sentís que estás lejos, la puerta del Padre siempre está abierta.'],
    'lucas 19':['Jesús entra en Jericó, se hospeda con Zaqueo y entra a Jerusalén.','Jesús no espera que uno sea perfecto para entrar: va al que lo necesita.','¿Hay algo que te impide recibir a Jesús hoy?'],
    // Hechos
    'hechos 1':['Jesús asciende y promete el Espíritu Santo. Los discípulos esperan en oración.','El comienzo de la iglesia es oración, comunidad y espera en Dios.','Pasá unos minutos en oración antes de actuar hoy.'],
    'hechos 2':['Pentecostés: el Espíritu Santo llega. Pedro predica y nacen 3.000 creyentes.','El Espíritu de Dios puede transformar una vida ordinaria en algo extraordinario.','Pedile al Espíritu Santo que guíe tus palabras y tus acciones hoy.'],
    'hechos 9':['La conversión de Saulo en el camino a Damasco.','Nadie está tan lejos de Dios como para no poder cambiar radicalmente.','¿Hay algo en tu vida que Dios quiere transformar por completo?'],
    // Romanos
    'romanos 1':['Pablo presenta el evangelio como poder de Dios para todo el que cree.','El evangelio no es solo para ciertos tipos de personas: es para todos.','¿En qué área de tu vida necesitás este poder de Dios hoy?'],
    'romanos 3':['Todos pecaron y se justifican gratuitamente por la fe en Cristo.','La salvación no es por méritos propios sino por gracia, mediante la fe.','Descansá: no tenés que ganarte el amor de Dios. Ya es tuyo por fe.'],
    'romanos 5':['La justificación por fe trae paz con Dios y esperanza en las tribulaciones.','Las dificultades producen carácter; el carácter produce esperanza.','¿Qué tribulación podés mirar diferente con esta perspectiva hoy?'],
    'romanos 6':['Muertos al pecado, vivos para Dios. La gracia no es excusa para pecar.','La nueva vida en Cristo no es solo perdón: es transformación real.','¿En qué área de tu vida querés ver esa transformación concreta?'],
    'romanos 8':['Vida en el Espíritu, esperanza, intercesión y amor indestructible de Dios.','Nada puede separar al creyente del amor de Dios en Cristo Jesús.','Guardá Romanos 8:28 y 8:38-39 para los momentos difíciles.'],
    'romanos 10':['La fe viene por el oír, y el oír por la Palabra de Cristo.','Creer y confesar son el camino a la salvación, no los rituales externos.','Compartí algo del evangelio con alguien cercano esta semana.'],
    'romanos 12':['Vivir el evangelio: sacrificio vivo, renovación de la mente, amor real.','La fe cristiana tiene consecuencias concretas en cómo tratamos a otros.','Elegí una enseñanza de este capítulo y aplicala hoy en una relación.'],
    // 1 Corintios
    '1 corintios 1':['Pablo habla de la sabiduría del mundo vs. la sabiduría de la cruz.','Lo que el mundo desprecia, Dios lo usa para confundir a los poderosos.','Dios puede usar tu debilidad si se la entregás con fe.'],
    '1 corintios 13':['El famoso capítulo del amor: sus características y su permanencia.','Sin amor, todos los dones, el conocimiento y la fe son vacíos.','Leé las características del amor y evaluá una relación tuya con esa lista.'],
    '1 corintios 15':['La resurrección de Cristo como fundamento de toda la fe cristiana.','Si Cristo resucitó, el pecado, la muerte y la desesperanza no tienen la última palabra.','La resurrección no es poesía: cambia cómo vivís hoy.'],
    // 2 Corintios
    '2 corintios 4':['Pablo habla de la fragilidad humana como recipiente del tesoro de Dios.','Somos vasijas de barro, pero llevamos dentro el poder de Dios.','Tu debilidad no te descalifica; es el espacio donde Dios trabaja mejor.'],
    '2 corintios 5':['Reconciliación con Dios: nueva criatura, embajadores del evangelio.','En Cristo todo es nuevo. No es una mejora: es una transformación real.','¿En qué área de tu vida necesitás esa renovación hoy?'],
    // Gálatas
    'gálatas 3':['La justificación es por fe en Cristo, no por obras de la ley.','La fe en Cristo nos hace herederos de las promesas de Abraham.','Descansá de intentar ganarte a Dios con esfuerzo. Ya lo tenés por fe.'],
    'gálatas 5':['Libertad cristiana vs. carne. El fruto del Espíritu Santo.','La vida en el Espíritu no es lista de reglas: es carácter que crece.','¿Cuál fruto del Espíritu querés pedirle a Dios que desarrolle en vos?'],
    // Efesios
    'efesios 1':['Las riquezas espirituales en Cristo: elección, redención, herencia.','Antes de nacer ya eras amado y elegido por Dios con un propósito.','Leé Ef 1:3-5 en voz alta como declaración de identidad.'],
    'efesios 2':['Salvados por gracia mediante la fe, no por obras. Somos su hechura.','No tenés que merecer el amor de Dios: ya sos su obra maestra.','¿Qué cambiaría en tu día si creyeras que sos hechura de Dios?'],
    'efesios 6':['La armadura de Dios para resistir las batallas espirituales.','La lucha cristiana no es contra personas sino contra fuerzas espirituales.','Vestite con la armadura de Dios antes de salir a tu día.'],
    // Filipenses
    'filipenses 1':['Pablo escribe desde prisión con gozo y propósito claro.','El gozo cristiano no depende de las circunstancias sino de Cristo.','¿Podés encontrar motivos de gratitud incluso en una situación difícil?'],
    'filipenses 2':['Humildad como la de Cristo: vaciarse para servir a otros.','El modelo de liderazgo cristiano es Jesús que se humilló, no que dominó.','¿En qué relación podés aplicar humildad concreta hoy?'],
    'filipenses 3':['Pablo considera basura todo lo que tenía antes, por conocer a Cristo.','Lo que el mundo valora no define tu identidad: Cristo sí.','¿Hay algo que estés poniendo antes que tu relación con Dios?'],
    'filipenses 4':['Gozo, paz, contentamiento y fortaleza en Cristo.','La paz de Dios guarda el corazón cuando llevamos todo a Él en oración.','Escribí una preocupación y conviértela en oración concreta ahora.'],
    // Colosenses
    'colosenses 1':['Cristo supremo sobre toda la creación y la iglesia.','Jesús no es uno más: es el primogénito de toda creación, cabeza de la iglesia.','¿Qué lugar real tiene Cristo en tu toma de decisiones diarias?'],
    'colosenses 3':['Renovación de la mente, vida familiar y laboral como adoración.','Todo lo que hacés puede ser un acto de adoración a Dios.','Elegí una tarea de hoy y hacela "como para el Señor".'],
    // Hebreos
    'hebreos 11':['El capítulo de la fe: Abel, Noé, Abraham, Sara, Moisés y más.','La fe no es sentimiento; es actuar sobre lo que Dios prometió aunque no se vea.','¿Qué promesa de Dios necesitás seguir creyendo aunque no la veas aún?'],
    'hebreos 12':['Correr con paciencia la carrera mirando a Jesús.','Jesús corrió su carrera hasta el final; es nuestro modelo para no desmayar.','¿Qué peso o pecado te está frenando en tu carrera de fe?'],
    // Santiago
    'santiago 1':['Fe que produce paciencia, sabiduría, y se prueba en la tentación.','La fe real transforma el carácter, no solo cambia el estado espiritual.','¿Qué prueba de hoy podés recibir como entrenamiento de carácter?'],
    'santiago 2':['La fe sin obras está muerta. Cuidado con favoritismos.','Creer no alcanza si no se refleja en cómo tratamos a los demás.','¿Hay alguien a quien estás ignorando o juzgando que necesita tu ayuda?'],
    // 1 Pedro
    '1 pedro 2':['Piedras vivas, sacerdocio real, vida entre los que no creen.','Somos pueblo de Dios llamado a vivir diferente en medio del mundo.','¿Cómo reflejás ese "sacerdocio real" en tu trabajo o familia?'],
    '1 pedro 5':['Humillad ante Dios, resistí al diablo, echá la ansiedad en Dios.','Dios resiste al soberbio y da gracia al humilde. La ansiedad no es para cargarla solos.','Echá tu ansiedad sobre Dios en oración específica ahora mismo.'],
    // 1 Juan
    '1 juan 1':['Luz, comunión, verdad, confesión y perdón.','Dios no llama a esconder el pecado, sino a caminar en verdad y recibir perdón real.','Pedí perdón y corregí un paso concreto.'],
    '1 juan 3':['Somos hijos de Dios; la diferencia entre amor real y amor de palabras.','El amor cristiano no es solo emoción: se prueba en acciones concretas.','¿Cómo podés amar de manera práctica a alguien hoy?'],
    '1 juan 4':['Dios es amor; probad los espíritus; el amor perfecto echa el temor.','El amor de Dios no depende de lo que hagamos: es su naturaleza.','El miedo se va cuando el amor de Dios ocupa ese espacio. Pedilo en oración.'],
    '1 juan 5':['La fe que vence al mundo; certeza de la vida eterna.','Podés tener certeza de tu relación con Dios: no es presunción, es fe.','¿Qué te hace dudar de tu relación con Dios? Llevalo en oración.'],
    // Apocalipsis
    'apocalipsis 1':['La visión de Juan del Cristo glorificado. "Yo soy el Alfa y la Omega".','El Cristo que conocemos en los Evangelios es el mismo Señor glorioso del fin.','La adoración empieza por ver quién es realmente Jesús.'],
    'apocalipsis 21':['Nueva creación: nueva Jerusalén, no más muerte ni llanto.','La historia no termina en destrucción sino en restauración total.','Lo que hoy duele no es la última palabra; viene una creación nueva.'],
    // Salmos
    'salmos 1':['Bienaventurado el que medita en la ley de Dios día y noche.','La prosperidad real viene de nutrir el alma con la Palabra de Dios.','Elegí un versículo de hoy y repetilo durante el día.'],
    'salmos 22':['Clamor al Dios que parece ausente; confianza que persiste hasta la alabanza.','Jesús oró este salmo en la cruz. El abandono es real; la confianza también.','¿Podés llevar tu sensación de abandono a Dios sin pretender que no existe?'],
    'salmos 23':['El Señor como pastor que provee, guía y acompaña incluso en lo oscuro.','Dios no promete ausencia de valles, sino su compañía en ellos.','Repetí en voz alta: "El Señor es mi pastor; nada me faltará."'],
    'salmos 27':['Confianza en Dios frente al miedo: una sola petición, buscar su rostro.','El miedo se enfrenta buscando el rostro de Dios, no evitando la realidad.','¿Qué miedo podés entregarle a Dios hoy buscando su presencia?'],
    'salmos 34':['Alabanza de David: Dios libra a los afligidos y está cerca del quebrantado.','Dios no está lejos cuando más duele; está más cerca de lo que parece.','Agradecé específicamente por alguna forma en que Dios te libró.'],
    'salmos 46':['Dios es nuestro refugio y fortaleza; estad quietos y conoced que soy Dios.','En medio del caos, la quietud ante Dios es una respuesta de fe.','Tomá 5 minutos de silencio ante Dios hoy.'],
    'salmos 51':['Oración de arrepentimiento genuino de David después de su pecado.','El arrepentimiento real no es sentirse mal: es volver a Dios con humildad.','Orá el Salmo 51:10 como oración personal hoy.'],
    'salmos 91':['Protección divina para el que habita en el abrigo del Altísimo.','Confiar en Dios no elimina los peligros; pone a Dios en medio de ellos.','Memorizá Salmos 91:1-2 para los momentos de miedo.'],
    'salmos 100':['Aclamad a Dios, entrad en su presencia con acción de gracias.','La adoración no espera que todo esté bien: empieza en la decisión de agradecer.','Entrá a tu día con tres motivos concretos de gratitud.'],
    'salmos 103':['Bendice a Dios y no te olvides de sus beneficios: perdón, sanidad, amor.','Dios no te trata como merecen tus pecados; actúa desde su misericordia.','Nombrá tres "beneficios" concretos de Dios en tu vida esta semana.'],
    'salmos 119':['El más largo de los salmos: alabanza a la Palabra de Dios.','La Palabra de Dios no es información: es lámpara, guía, consuelo y vida.','Elegí 5 versículos de este salmo y hacelos oración tuya.'],
    'salmos 121':['El Señor guarda tu salida y tu entrada, no se adormece ni duerme.','El Dios que guarda no descansa; su cuidado es permanente, no esporádico.','Salí hoy con la confianza de que Dios guarda tu camino.'],
    'salmos 139':['Dios te conoce completamente: pensamientos, caminos, antes de nacer.','No podés escapar de su presencia ni de su conocimiento; tampoco de su amor.','Leé Sal 139:23-24 como oración de apertura y honestidad con Dios.'],
    // Proverbios
    'proverbios 1':['El comienzo de la sabiduría es el temor de Dios.','La sabiduría no es solo inteligencia: es vivir conforme al orden de Dios.','¿Qué decisión de hoy necesita más sabiduría que información?'],
    'proverbios 3':['Confiar en Dios con todo el corazón; honrarlo con las primicias.','Reconocer a Dios en todos los caminos es el secreto de una vida bien dirigida.','Entregale a Dios una decisión que estás intentando resolver solo.'],
    'proverbios 31':['La mujer virtuosa: su carácter, trabajo, familia y temor a Dios.','El valor cristiano no es externo sino de carácter, servicio y sabiduría.','¿Qué característica de este capítulo querés desarrollar más?'],
    // Isaías
    'isaías 40':['Consolaos, pueblo mío. Dios da fuerzas al cansado.','Dios no se cansa; los que esperan en Él renuevan sus fuerzas.','Descansá en Isaías 40:31 si estás agotado/a hoy.'],
    'isaías 41':['No temas, porque yo soy contigo; no desmayes, soy tu Dios.','Dios repite "no temas" porque sabe cuánto miedo sentimos. No lo ignora.','Repetí Isaías 41:10 en voz alta tres veces hoy.'],
    'isaías 53':['El Siervo sufriente: herido por nuestras transgresiones.','Isaías describe a Jesús 700 años antes de su nacimiento. La cruz no fue accidente.','Leé este capítulo pensando en Jesús en la cruz por vos.'],
    'isaías 55':['Venid a las aguas; buscad a Dios mientras puede ser hallado.','La invitación de Dios es amplia y gratuita; solo hay que responder.','¿Qué te impide responder a la invitación de Dios hoy?'],
    // Jeremías
    'jeremías 29':['Carta a los exiliados: busquen el bienestar de la ciudad y conféen en Dios.','Los planes de Dios son de bien, no de mal, aunque estemos en un tiempo difícil.','Confiá en Jer 29:11 aunque el contexto actual parezca contradecirlo.'],
    // Daniel
    'daniel 3':['Los tres jóvenes en el horno de fuego que no los quema.','Obedecer a Dios puede costar caro; Dios acompaña en el horno, no solo lo evita.','¿En qué situación te cuesta mantener tus convicciones de fe?'],
    'daniel 6':['Daniel en el foso de los leones por no dejar de orar.','La fe que vale se mantiene cuando cuesta mantenerla.','¿Hay algo de tu fe que estás escondiendo por miedo a las consecuencias?'],
    // Génesis
    'génesis 1':['Dios crea el universo y lo declara bueno; el ser humano como su imagen.','La creación no es accidente: tiene origen, diseño y propósito en Dios.','Si sos imagen de Dios, ¿cómo lo refllejás en cómo tratás a otros hoy?'],
    'génesis 3':['La caída: desobediencia, vergüenza, consecuencias y primera promesa.','El pecado entró al mundo, pero Dios ya prometió la solución desde el principio.','La primera promesa de un Salvador (Gén 3:15) se cumplió en Jesús.'],
    'génesis 12':['El llamado de Abraham: dejá tu tierra y ve. Promesa de bendición.','La fe de Abraham empieza obedeciendo sin conocer el destino.','¿A qué te está llamando Dios que aún no te animás a dar el paso?'],
    'génesis 22':['Dios prueba a Abraham pidiéndole a Isaac; el carnero en el matorral.','Dios provee en el momento exacto; lo que parece un final puede ser el punto de provisión.','¿Qué estás aferrando que tal vez Dios te pide confiarle?'],
    // Josué
    'josué 1':['Josué recibe el mando y la promesa: "Sé fuerte y valiente; Dios está contigo".','El coraje cristiano no viene de la confianza en uno mismo sino en Dios.','Repetí Josué 1:9 antes de enfrentar algo difícil hoy.'],
  };

  // ── Leer el libro/capítulo REAL desde los selectores del DOM ─────────────
  function chapterKey(){
    // 1. Leer directamente de los <select> del React — es lo más confiable
    const selects = $$('.fieldLabel select.select');
    if(selects.length >= 2){
      const book = (selects[0].value||'').toLowerCase().trim();
      const chapter = (selects[1].value||'').trim();
      if(book && chapter) return `${book} ${chapter}`;
    }
    // 2. Fallback: primer .ref con número de capítulo
    const ref = ($('.stack .card .ref')?.textContent||'').toLowerCase().replace(/:/g,' ');
    const m = ref.match(/^(.+?)\s+(\d+)/);
    return m ? `${m[1].trim()} ${m[2]}` : '';
  }

  function addChapterInsight(){
    if(!($('h1')?.textContent||'').includes('Biblia')) return;
    // Si está buscando (search activo), no insertar
    if(document.querySelector('.stack input.search')?.value?.trim()) return;
    const key = chapterKey(); if(!key) return;
    const old = $('.pv-chapter-card');
    if(old?.dataset.key === key) return;  // ya está el correcto
    old?.remove();
    const d = CH[key] || [
      'Este capítulo forma parte de una historia más grande.',
      'Buscá qué revela sobre Dios, el ser humano y la esperanza.',
      'Leé despacio y marcá una frase que te llegue hoy.'
    ];
    // Insertar antes del primer versículo visible
    const first = $$('.card').find(c => c.querySelector('.ref') && c.querySelector('.verse'));
    if(!first) return;
    const card = document.createElement('section');
    card.className = 'card pv-chapter-card';
    card.dataset.key = key;
    const title = key.replace(/\b\w/g, l => l.toUpperCase());
    card.innerHTML = `
      <p class="ref">📖 Entender este capítulo</p>
      <h3>${title}</h3>
      <p><strong>¿Qué está pasando?</strong> ${d[0]}</p>
      <p><strong>¿Qué enseña?</strong> ${d[1]}</p>
      <p><strong>¿Qué puedo aplicar hoy?</strong> ${d[2]}</p>
    `;
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
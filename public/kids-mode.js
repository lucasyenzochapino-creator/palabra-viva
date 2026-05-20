(() => {
  // ========================
  // BIBLIA PARA CHICOS — v2
  // ========================
  // Mejoras vs versión anterior:
  // - 30 historias (antes 12), organizadas en 5 categorías
  // - Cada historia con: versículo clave, explicación simple,
  //   2 preguntas de reflexión, oración guiada
  // - Audio narrado (Web Speech API) opcional
  // - Progreso guardado: marca historias leídas con estrella
  // - "Historia del día" cambia cada día
  // - Sin FAB invasivo; entradas claras desde home y menú rápido

  const STORIES = [
    // === CREACIÓN Y PATRIARCAS ===
    { c:'creacion', emoji:'🌍', title:'Dios crea el mundo', ref:'Génesis 1:1',
      verse:'En el principio creó Dios los cielos y la tierra.',
      text:'Antes que existiera todo, ya estaba Dios. Dios habló y nació la luz. Hizo el cielo, el mar, los árboles, los animales y las estrellas. Y al final hizo a las personas, porque quería tener una familia.',
      q:['¿Qué cosa de la creación te gusta más?','¿Cómo le agradecemos a Dios por todo lo que hizo?'],
      pray:'Gracias Dios por hacer un mundo tan lindo. Ayudame a cuidarlo.' },
    { c:'creacion', emoji:'🍎', title:'Adán y Eva en el jardín', ref:'Génesis 3:15',
      verse:'Pondré enemistad entre ti y la mujer.',
      text:'Dios puso a Adán y Eva en un jardín hermoso. Les pidió no comer de un árbol. Ellos desobedecieron y se pusieron tristes. Pero Dios prometió enviar a alguien para arreglar todo: Jesús.',
      q:['¿Qué pasa cuando desobedecemos?','¿Por qué Dios siguió amando a Adán y Eva?'],
      pray:'Jesús, gracias porque viniste a arreglar lo que estaba roto.' },
    { c:'creacion', emoji:'🚢', title:'Noé y el arca', ref:'Génesis 9:13',
      verse:'Mi arco he puesto en las nubes.',
      text:'Noé escuchaba a Dios. Dios le pidió construir un arca grande para cuidar a su familia y a los animales. Llovió mucho. Cuando terminó, Dios puso un arcoiris en el cielo como una promesa.',
      q:['¿Cómo te sentirías construyendo un barco enorme?','¿Qué significa el arcoiris en el cielo?'],
      pray:'Dios, ayudame a escucharte y obedecerte siempre.' },
    { c:'creacion', emoji:'🏗️', title:'La torre de Babel', ref:'Génesis 11:9',
      verse:'Allí confundió Jehová el lenguaje.',
      text:'Las personas quisieron construir una torre tan alta como el cielo para sentirse importantes. Dios las hizo hablar idiomas diferentes y se separaron. Aprendieron que no podemos estar por encima de Dios.',
      q:['¿Por qué no podemos ser más importantes que Dios?','¿Qué pasaría si todos hiciéramos lo que queremos sin escucharlo?'],
      pray:'Dios, ayudame a ser humilde y a poner siempre primero tu voluntad.' },
    { c:'creacion', emoji:'⭐', title:'Abraham y la promesa', ref:'Génesis 15:5',
      verse:'Mira ahora los cielos, y cuenta las estrellas.',
      text:'Abraham era un hombre que confiaba mucho en Dios. Dios le prometió darle una familia tan grande como las estrellas del cielo. Aunque Abraham era muy viejo, Dios cumplió su promesa con su hijo Isaac.',
      q:['¿Te cuesta esperar cuando alguien te promete algo?','¿Por qué Dios siempre cumple lo que promete?'],
      pray:'Dios, enseñame a esperar y a confiar en vos.' },
    { c:'creacion', emoji:'👔', title:'José y sus hermanos', ref:'Génesis 50:20',
      verse:'Dios lo encaminó a bien.',
      text:'José tenía once hermanos que estaban enojados con él. Lo vendieron y terminó lejos de casa. Pero Dios estaba con José. Años después, José pudo perdonar a sus hermanos y ayudarlos cuando tenían hambre.',
      q:['¿Es fácil perdonar a alguien que te lastimó?','¿Cómo puede Dios convertir algo malo en algo bueno?'],
      pray:'Jesús, dame un corazón como el de José para perdonar.' },

    // === MOISÉS Y EL ÉXODO ===
    { c:'moises', emoji:'🧺', title:'Moisés en el río', ref:'Éxodo 2:10',
      verse:'Le puso por nombre Moisés.',
      text:'Una mamá puso a su bebé en una canastita en el río Nilo para salvarlo. La hija del rey lo encontró y lo cuidó. Ese bebé era Moisés, a quien Dios usaría para liberar a su pueblo.',
      q:['¿Cómo te sentirías siendo esa mamá?','¿Cómo cuida Dios a los chicos?'],
      pray:'Dios, gracias porque siempre me cuidás como cuidaste a Moisés.' },
    { c:'moises', emoji:'🔥', title:'La zarza ardiente', ref:'Éxodo 3:14',
      verse:'YO SOY EL QUE SOY.',
      text:'Moisés estaba cuidando ovejas cuando vio una planta que ardía pero no se quemaba. Dios le habló desde allí. Le pidió ir a Egipto a liberar a su pueblo. Moisés tenía miedo, pero Dios le prometió estar con él.',
      q:['¿Qué hubieras hecho si veías una planta hablando?','¿Cuándo sentís miedo y Dios te da fuerza?'],
      pray:'Dios, cuando tenga miedo recordame que vos estás conmigo.' },
    { c:'moises', emoji:'🐸', title:'Las plagas de Egipto', ref:'Éxodo 9:16',
      verse:'Para mostrar en ti mi poder.',
      text:'El rey de Egipto no quería dejar libre al pueblo de Dios. Entonces Dios envió diez plagas: ranas, langostas, oscuridad… Después de la última, el rey dejó ir al pueblo. Nadie es más grande que Dios.',
      q:['¿Por qué crees que el rey no quería obedecer a Dios?','¿Qué pasa cuando alguien no escucha a Dios?'],
      pray:'Dios, ayudame a obedecerte la primera vez que me hables.' },
    { c:'moises', emoji:'🌊', title:'Cruzando el mar Rojo', ref:'Éxodo 14:14',
      verse:'Jehová peleará por vosotros.',
      text:'El pueblo de Dios estaba atrapado entre el mar y los soldados egipcios. Moisés levantó su vara y el mar se abrió en dos. Cruzaron por tierra seca. Dios siempre abre un camino cuando parece que no hay.',
      q:['¿Te imaginás caminando entre dos paredes de agua?','¿Qué hacés cuando parece que no hay salida?'],
      pray:'Jesús, gracias porque vos siempre abrís un camino para mí.' },
    { c:'moises', emoji:'🍞', title:'Maná del cielo', ref:'Éxodo 16:4',
      verse:'Yo os haré llover pan del cielo.',
      text:'En el desierto, el pueblo tenía hambre. Dios mandó del cielo un pan dulce llamado maná, cada mañana, por 40 años. Dios siempre da lo que necesitamos en el momento justo.',
      q:['¿Confiás que Dios te va a dar lo que necesitás cada día?','¿Qué cosas te da Dios todos los días sin que las pidas?'],
      pray:'Padre, gracias por darme lo necesario para cada día.' },
    { c:'moises', emoji:'📜', title:'Los diez mandamientos', ref:'Éxodo 20:6',
      verse:'Hago misericordia a los que me aman.',
      text:'En el monte Sinaí, Dios le dio a Moisés diez reglas para vivir bien: amar a Dios, no mentir, honrar a papá y mamá, no robar, no envidiar… Son como una guía para amar a Dios y a las personas.',
      q:['¿Cuál de los mandamientos te parece más difícil de cumplir?','¿Por qué los mandamientos nos ayudan a ser felices?'],
      pray:'Jesús, ayudame a amar como vos amás.' },

    // === REYES Y PROFETAS ===
    { c:'reyes', emoji:'⚔️', title:'David y Goliat', ref:'1 Samuel 17:47',
      verse:'No con espada y lanza salva Jehová.',
      text:'Goliat era un gigante que daba mucho miedo. David era un chico pastor, pero confiaba en Dios. Con solo una honda y una piedra, derrotó a Goliat. La victoria no era de David, era de Dios.',
      q:['¿Cuál es tu Goliat? ¿A qué le tenés miedo?','¿Cómo te ayuda Dios cuando enfrentás algo difícil?'],
      pray:'Jesús, dame el valor de David para confiar en vos.' },
    { c:'reyes', emoji:'👑', title:'Salomón y la sabiduría', ref:'1 Reyes 3:9',
      verse:'Da a tu siervo corazón entendido.',
      text:'Cuando Salomón fue rey, Dios le dijo: "Pedime lo que quieras." Salomón no pidió dinero ni fama. Pidió sabiduría para gobernar bien. A Dios le encantó la pregunta y le dio sabiduría y mucho más.',
      q:['¿Qué le pedirías vos a Dios si te dijera eso?','¿Por qué la sabiduría es más importante que el dinero?'],
      pray:'Dios, dame un corazón sabio para tomar buenas decisiones.' },
    { c:'reyes', emoji:'🐦', title:'Elías y los cuervos', ref:'1 Reyes 17:6',
      verse:'Los cuervos le traían pan y carne.',
      text:'Hubo una sequía muy grande. Elías era un profeta de Dios. Dios le dijo que se escondiera junto a un arroyo. Cada mañana y tarde, los cuervos le traían comida en sus picos. Dios usa cosas raras para cuidarnos.',
      q:['¿Te imaginás cuervos trayéndote la comida?','¿Cómo te cuida Dios en formas que no esperás?'],
      pray:'Padre, gracias porque siempre encontrás la manera de cuidarme.' },
    { c:'reyes', emoji:'🦁', title:'Daniel y los leones', ref:'Daniel 6:22',
      verse:'Mi Dios envió su ángel, el cual cerró la boca de los leones.',
      text:'Daniel oraba todos los días, aunque el rey había dicho que estaba prohibido. Lo tiraron al foso de los leones. Pero Dios envió un ángel y cerró la boca de los leones. Daniel pasó la noche tranquilo.',
      q:['¿Hablás con Dios todos los días, aunque estés ocupado?','¿Cómo te protege Dios cuando hacés lo correcto?'],
      pray:'Dios, dame valor para orar y confiar todos los días.' },
    { c:'reyes', emoji:'🐳', title:'Jonás y el pez grande', ref:'Jonás 2:2',
      verse:'Clamé de mi tribulación a Jehová, y él me oyó.',
      text:'Dios le pidió a Jonás ir a Nínive a hablar de Él. Jonás primero quiso escapar en barco. Una tormenta lo arrastró al mar y un pez gigante se lo tragó. Adentro del pez, oró. Dios lo escuchó y lo sacó.',
      q:['¿Alguna vez quisiste escapar de algo difícil?','¿Por qué es mejor obedecer a Dios la primera vez?'],
      pray:'Dios, ayudame a decir que sí cuando me llamás.' },
    { c:'reyes', emoji:'👸', title:'Ester salva a su pueblo', ref:'Ester 4:14',
      verse:'¿Quién sabe si para esta hora has llegado al reino?',
      text:'Ester era una reina muy joven. Un hombre malo quería hacerle daño al pueblo de Dios. Ester tenía miedo, pero habló con el rey y los salvó. Dios la puso en ese lugar para ese momento.',
      q:['¿Para qué creés que Dios te puso donde estás?','¿Cómo podés ser valiente como Ester?'],
      pray:'Dios, usame en el lugar donde me pusiste, aunque sea chico.' },

    // === JESÚS ===
    { c:'jesus', emoji:'⭐', title:'Jesús nace en Belén', ref:'Lucas 2:11',
      verse:'Os ha nacido hoy un Salvador.',
      text:'Jesús nació en un lugar humilde, en un pesebre con animales, porque no había lugar en el mesón. Los ángeles cantaron y los pastores fueron a verlo. Era el Hijo de Dios viniendo a buscarnos.',
      q:['¿Por qué Jesús nació en un lugar tan humilde?','¿Qué le regalarías vos al niño Jesús?'],
      pray:'Jesús, gracias por venir al mundo por mí.' },
    { c:'jesus', emoji:'🌊', title:'Jesús calma la tormenta', ref:'Marcos 4:39',
      verse:'Calla, enmudece. Y cesó el viento.',
      text:'Jesús y sus amigos estaban en una barca cuando vino una tormenta fuerte. Jesús dormía. Sus amigos lo despertaron asustados. Jesús habló al viento y al mar, y todo quedó tranquilo. Hasta el viento le obedece.',
      q:['¿Qué tormentas hay en tu vida?','¿Cómo te calma Jesús el corazón cuando estás asustado?'],
      pray:'Jesús, calmá mi corazón cuando todo me da miedo.' },
    { c:'jesus', emoji:'🍞', title:'Cinco panes y dos peces', ref:'Juan 6:11',
      verse:'Tomó Jesús aquellos panes, y habiendo dado gracias, repartió.',
      text:'Mucha gente seguía a Jesús y tenían hambre. Un niño ofreció lo poco que tenía: cinco panes y dos pescaditos. Jesús dio gracias, partió la comida, y todos comieron. Hasta sobró comida. Con poco, Jesús hace mucho.',
      q:['¿Qué tenés vos para darle a Jesús?','¿Cómo usa Jesús lo poco que damos?'],
      pray:'Jesús, usá lo que tengo, aunque sea poquito.' },
    { c:'jesus', emoji:'👣', title:'Jesús camina sobre el agua', ref:'Mateo 14:27',
      verse:'Confiad, yo soy; no tengáis miedo.',
      text:'Los discípulos estaban en la barca de noche, con olas grandes. De repente vieron a Jesús caminando sobre el agua. Pedro quiso ir hacia él y caminó también… hasta que miró las olas. Jesús lo agarró de la mano.',
      q:['¿En qué cosas te cuesta mantener los ojos en Jesús?','¿Qué hace Jesús cuando empezamos a hundirnos?'],
      pray:'Jesús, agarrame la mano siempre.' },
    { c:'jesus', emoji:'🌿', title:'Jesús resucita a Lázaro', ref:'Juan 11:25',
      verse:'Yo soy la resurrección y la vida.',
      text:'Lázaro, amigo de Jesús, se murió. Cuando Jesús llegó a la tumba, lloró. Después dijo: "Lázaro, ¡sal afuera!" Y Lázaro salió vivo. Jesús es más fuerte que la muerte.',
      q:['¿Sabías que Jesús también llora con nosotros?','¿Qué cosas imposibles para nosotros puede hacer Jesús?'],
      pray:'Jesús, gracias porque vos sos la vida.' },
    { c:'jesus', emoji:'🤗', title:'Jesús ama a los niños', ref:'Marcos 10:14',
      verse:'Dejad a los niños venir a mí.',
      text:'Los amigos de Jesús no querían que los chicos lo molestaran. Pero Jesús se enojó con ellos. Les dijo: "Dejen venir a los niños." Los abrazó y los bendijo. Vos sos muy especial para Jesús.',
      q:['¿Cómo te sentís sabiendo que Jesús te quiere abrazar?','¿Cómo podés acercarte vos a Jesús hoy?'],
      pray:'Jesús, gracias porque me querés tal como soy.' },

    // === PARÁBOLAS Y PASCUA ===
    { c:'pascua', emoji:'❤️', title:'El buen samaritano', ref:'Lucas 10:33',
      verse:'Fue movido a misericordia.',
      text:'Un hombre necesitaba ayuda en el camino. Pasaron dos personas importantes y siguieron de largo. Pero un samaritano se detuvo, lo curó y lo cuidó. Jesús nos enseña así a amar al que necesita ayuda.',
      q:['¿Conocés alguien que necesite ayuda hoy?','¿Cómo podés ser un buen samaritano esta semana?'],
      pray:'Jesús, enseñame a mirar a los que sufren y a ayudar.' },
    { c:'pascua', emoji:'🏠', title:'El hijo que volvió', ref:'Lucas 15:20',
      verse:'Su padre fue movido a misericordia.',
      text:'Un hijo se fue lejos y gastó todo. Quedó pobre y triste. Decidió volver a su casa. Cuando el papá lo vio venir, corrió a abrazarlo. Así nos recibe Dios cuando volvemos arrepentidos.',
      q:['¿Alguna vez te alejaste de Dios?','¿Qué hace Dios cuando le decimos "perdón"?'],
      pray:'Padre, gracias porque siempre puedo volver a tus brazos.' },
    { c:'pascua', emoji:'🐑', title:'La oveja perdida', ref:'Lucas 15:5',
      verse:'La pone sobre sus hombros gozoso.',
      text:'Un pastor tenía cien ovejas. Una se perdió. Dejó las 99 y fue a buscar a la perdida. Cuando la encontró, se puso muy feliz y la cargó sobre sus hombros. Así nos busca Jesús a cada uno.',
      q:['¿Sabías que vos sos importante para Jesús, uno por uno?','¿Cómo se siente saber que Jesús nunca te abandona?'],
      pray:'Jesús, gracias por buscarme cuando me alejo.' },
    { c:'pascua', emoji:'🌱', title:'El sembrador', ref:'Mateo 13:23',
      verse:'Da fruto, y produce a ciento, a sesenta y a treinta por uno.',
      text:'Un agricultor sembró semillas. Algunas cayeron en el camino y los pájaros se las comieron. Otras en piedras y se secaron. Otras entre espinas. Pero las que cayeron en buena tierra dieron mucho fruto.',
      q:['¿Qué tipo de tierra es tu corazón?','¿Cómo podés cuidar la palabra de Dios en tu vida?'],
      pray:'Dios, hacé de mi corazón una buena tierra para tu palabra.' },
    { c:'pascua', emoji:'✝️', title:'Jesús muere por nosotros', ref:'Juan 3:16',
      verse:'Tanto amó Dios al mundo.',
      text:'Jesús dio su vida en la cruz por todos nosotros. Tomó nuestros errores y nos dio su perdón. Fue el regalo más grande del mundo, porque Dios nos ama mucho.',
      q:['¿Por qué Jesús quiso morir por vos?','¿Cómo le agradecés ese regalo tan grande?'],
      pray:'Jesús, gracias por amarme hasta dar tu vida.' },
    { c:'pascua', emoji:'🌅', title:'Jesús vive', ref:'Mateo 28:6',
      verse:'No está aquí, pues ha resucitado.',
      text:'Tres días después de la cruz, los amigos de Jesús fueron a la tumba. Pero estaba vacía. ¡Jesús había resucitado! Está vivo para siempre. Y porque Él vive, nosotros también vivimos.',
      q:['¿Qué cambia saber que Jesús está vivo hoy?','¿Cómo se llama el día que celebramos su resurrección?'],
      pray:'Jesús, gracias porque estás vivo y estás conmigo siempre.' }
  ];

  const CATEGORIES = [
    { id:'todas',    name:'Todas',                  emoji:'📖' },
    { id:'creacion', name:'Creación y patriarcas',  emoji:'🌍' },
    { id:'moises',   name:'Moisés y el éxodo',      emoji:'🔥' },
    { id:'reyes',    name:'Reyes y profetas',       emoji:'👑' },
    { id:'jesus',    name:'Jesús',                  emoji:'✨' },
    { id:'pascua',   name:'Parábolas y Pascua',     emoji:'✝️' }
  ];

  const PROGRESS_KEY = 'pv-kids-read';

  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); }
    catch { return {}; }
  }
  function saveProgress(obj) {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(obj)); } catch {}
  }
  function markRead(id) {
    const p = loadProgress();
    p[id] = Date.now();
    saveProgress(p);
  }
  function isRead(id) {
    return !!loadProgress()[id];
  }
  function clearAllProgress() {
    saveProgress({});
  }

  // Historia del día: siempre la misma para una fecha dada
  function getStoryOfDay() {
    const today = new Date();
    const daysSinceEpoch = Math.floor((today - new Date(2025, 0, 1)) / 86400000);
    return STORIES[Math.abs(daysSinceEpoch) % STORIES.length];
  }

  function injectStyles() {
    if (document.getElementById('pv-kids-style-v2')) return;
    document.getElementById('pv-kids-style')?.remove();
    const st = document.createElement('style');
    st.id = 'pv-kids-style-v2';
    st.textContent = `
      .pv-kids-fab,.pv-kids-fab-old{display:none!important}
      .pv-kids-panel{position:fixed;inset:0;z-index:1000001;background:linear-gradient(180deg,#fff8ef,#ffe9c7);color:#20140b;overflow:auto;padding:14px 12px calc(140px + env(safe-area-inset-bottom))}
      .pv-kids-inner{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:14px}
      .pv-kids-head{display:grid;grid-template-columns:1fr auto;gap:10px;position:sticky;top:0;background:linear-gradient(to bottom,#fff8ef 80%,transparent);padding:8px 0 14px;z-index:5;backdrop-filter:blur(12px)}
      .pv-kids-head h1{font-size:clamp(26px,7vw,34px);margin:4px 0;color:#7c4a1e}
      .pv-kids-head p{color:#7c4a1e;opacity:.75;margin:0}
      .pv-kids-close{border:2px solid #7c4a1e;background:#fff;color:#7c4a1e;border-radius:999px;padding:9px 14px;font-weight:900}
      .pv-kids-progress{background:#fff;border-radius:18px;padding:12px 14px;display:flex;justify-content:space-between;align-items:center;gap:10px;box-shadow:0 4px 12px rgba(0,0,0,.06)}
      .pv-kids-progress strong{color:#16a34a;font-size:22px}
      .pv-kids-progress small{color:#7c4a1e;opacity:.7}
      .pv-kids-reset{border:1px solid rgba(124,74,30,.3);background:transparent;color:#7c4a1e;border-radius:999px;padding:7px 12px;font-weight:700;font-size:13px;cursor:pointer}
      .pv-kids-today{background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#fff;border-radius:22px;padding:16px;box-shadow:0 8px 24px rgba(245,158,11,.35)}
      .pv-kids-today .ribbon{font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;opacity:.95}
      .pv-kids-today h2{font-size:22px;line-height:1.1;margin:6px 0}
      .pv-kids-today .btn{margin-top:8px;background:#fff;color:#b45309;border:0;border-radius:999px;padding:11px 18px;font-weight:900;cursor:pointer}
      .pv-kids-cats{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none}
      .pv-kids-cats::-webkit-scrollbar{display:none}
      .pv-kids-cat{flex:0 0 auto;border:2px solid transparent;background:#fff;color:#7c4a1e;border-radius:999px;padding:9px 14px;font-weight:900;font-size:14px;cursor:pointer;white-space:nowrap}
      .pv-kids-cat.active{background:linear-gradient(135deg,#22c55e,#3b82f6);color:#fff}
      .pv-kids-grid{display:grid;grid-template-columns:1fr;gap:12px}
      .pv-kids-card{background:#fff;color:#20140b;border-radius:24px;padding:16px;box-shadow:0 8px 24px rgba(0,0,0,.08);border-top:5px solid #22c55e;cursor:pointer;position:relative;transition:transform .15s}
      .pv-kids-card:active{transform:scale(.97)}
      .pv-kids-card.read{border-top-color:#fbbf24}
      .pv-kids-card .star{position:absolute;top:12px;right:14px;font-size:22px}
      .pv-kids-card .emoji{font-size:38px}
      .pv-kids-card h3{margin:6px 0 4px;font-size:18px;line-height:1.15}
      .pv-kids-card .ref{font-size:12px;font-weight:900;color:#9a5a16;text-transform:uppercase}
      .pv-kids-card p{font-size:14px;line-height:1.4;margin:6px 0 0;color:#5b4a3a}

      .pv-kids-detail{position:fixed;inset:0;z-index:1000002;background:#fff8ef;overflow:auto;padding:14px 14px calc(150px + env(safe-area-inset-bottom))}
      .pv-kids-detail-inner{max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:14px}
      .pv-kids-detail-head{display:flex;justify-content:space-between;align-items:center;gap:10px;position:sticky;top:0;background:linear-gradient(to bottom,#fff8ef 85%,transparent);padding:6px 0 12px;z-index:3;backdrop-filter:blur(10px)}
      .pv-kids-detail h1{font-size:clamp(24px,7vw,32px);line-height:1.1;color:#7c4a1e;margin:6px 0}
      .pv-kids-detail .big-emoji{font-size:72px;text-align:center;margin:4px 0}
      .pv-kids-detail .verse-box{background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:18px;padding:14px;color:#7c4a1e}
      .pv-kids-detail .verse-box .label{font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}
      .pv-kids-detail .verse-box em{font-size:18px;line-height:1.35;display:block;margin-top:6px;font-style:normal}
      .pv-kids-detail .story-text{background:#fff;border-radius:18px;padding:16px;font-size:17px;line-height:1.55;color:#20140b;box-shadow:0 4px 14px rgba(0,0,0,.05)}
      .pv-kids-detail .questions{background:#dbeafe;border-radius:18px;padding:14px;color:#1e3a8a}
      .pv-kids-detail .questions .label{font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}
      .pv-kids-detail .questions ol{margin:6px 0 0;padding-left:18px;font-size:16px;line-height:1.45}
      .pv-kids-detail .pray-box{background:linear-gradient(135deg,#dcfce7,#bbf7d0);border-radius:18px;padding:14px;color:#14532d}
      .pv-kids-detail .pray-box .label{font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}
      .pv-kids-detail .pray-box p{margin:6px 0 0;font-size:17px;line-height:1.4;font-style:italic}
      .pv-kids-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      .pv-kids-btn{border:0;border-radius:999px;padding:13px;font-weight:900;cursor:pointer;font-size:15px;min-height:48px}
      .pv-kids-btn.primary{background:linear-gradient(135deg,#22c55e,#3b82f6);color:#fff}
      .pv-kids-btn.audio{background:linear-gradient(135deg,#f97316,#ef4444);color:#fff}
      .pv-kids-btn.audio.playing{background:linear-gradient(135deg,#7c3aed,#ec4899)}
      .pv-kids-btn.ghost{background:#fff;color:#7c4a1e;border:2px solid #7c4a1e}
      .pv-kids-btn.full{grid-column:1/-1}

      .pv-kids-home{border-color:rgba(34,197,94,.45)!important;background:linear-gradient(135deg,rgba(34,197,94,.12),var(--card))!important}
      @media(min-width:600px){.pv-kids-grid{grid-template-columns:1fr 1fr}}
    `;
    document.head.appendChild(st);
  }

  function removeInvasiveOld() {
    document.querySelectorAll('.pv-kids-fab,.pv-kids-fab-old').forEach(el => el.remove());
  }

  // ========================
  // AUDIO NARRADO (Web Speech API)
  // ========================
  let activeUtterance = null;
  function stopSpeak() {
    try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch {}
    activeUtterance = null;
  }
  function speak(text, onEnd) {
    stopSpeak();
    if (!('speechSynthesis' in window)) return false;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'es-ES';
    u.rate = 0.92;
    u.pitch = 1.05;
    // Buscar voz en español
    const voices = speechSynthesis.getVoices();
    const es = voices.find(v => /es[-_]/i.test(v.lang)) || voices.find(v => /spanish/i.test(v.name));
    if (es) u.voice = es;
    u.onend = () => { activeUtterance = null; if (onEnd) onEnd(); };
    u.onerror = () => { activeUtterance = null; if (onEnd) onEnd(); };
    activeUtterance = u;
    try { speechSynthesis.speak(u); return true; } catch { return false; }
  }

  // ========================
  // VISTA DETALLE DE HISTORIA
  // ========================
  function openDetail(story) {
    stopSpeak();
    document.querySelector('.pv-kids-detail')?.remove();
    const v = document.createElement('section');
    v.className = 'pv-kids-detail';
    const sid = `${story.c}-${story.title.replace(/\s+/g,'-')}`;
    v.innerHTML = `
      <div class="pv-kids-detail-inner">
        <div class="pv-kids-detail-head">
          <button class="pv-kids-btn ghost" data-act="back">← Volver</button>
          <button class="pv-kids-btn ghost" data-act="closeAll">Cerrar</button>
        </div>
        <div class="big-emoji">${story.emoji}</div>
        <h1 style="text-align:center">${story.title}</h1>
        <div class="verse-box">
          <span class="label">${story.ref}</span>
          <em>"${story.verse}"</em>
        </div>
        <div class="story-text">${story.text}</div>
        <div class="questions">
          <span class="label">Para pensar juntos</span>
          <ol>${story.q.map(x => `<li>${x}</li>`).join('')}</ol>
        </div>
        <div class="pray-box">
          <span class="label">Oración</span>
          <p>${story.pray}</p>
        </div>
        <div class="pv-kids-actions">
          <button class="pv-kids-btn audio" data-act="audio">🔊 Escuchar historia</button>
          <button class="pv-kids-btn primary" data-act="mark">⭐ Marcar como leída</button>
        </div>
      </div>
    `;
    document.body.appendChild(v);

    const audioBtn = v.querySelector('[data-act="audio"]');
    const fullText = `${story.title}. ${story.verse}. ${story.text} Para pensar. ${story.q.join('. ')}. Oración. ${story.pray}`;

    audioBtn.onclick = () => {
      if (activeUtterance) {
        stopSpeak();
        audioBtn.textContent = '🔊 Escuchar historia';
        audioBtn.classList.remove('playing');
        return;
      }
      audioBtn.textContent = '⏸ Detener audio';
      audioBtn.classList.add('playing');
      const ok = speak(fullText, () => {
        audioBtn.textContent = '🔊 Escuchar historia';
        audioBtn.classList.remove('playing');
      });
      if (!ok) {
        audioBtn.textContent = 'Audio no disponible';
        audioBtn.disabled = true;
      }
    };

    v.querySelector('[data-act="mark"]').onclick = () => {
      markRead(sid);
      const btn = v.querySelector('[data-act="mark"]');
      btn.textContent = '✓ Leída';
      btn.style.background = '#16a34a';
    };
    if (isRead(sid)) {
      const btn = v.querySelector('[data-act="mark"]');
      btn.textContent = '✓ Leída';
      btn.style.background = '#16a34a';
    }

    v.querySelector('[data-act="back"]').onclick = () => { stopSpeak(); v.remove(); };
    v.querySelector('[data-act="closeAll"]').onclick = () => {
      stopSpeak();
      v.remove();
      document.querySelector('.pv-kids-panel')?.remove();
    };
  }

  // ========================
  // PANEL PRINCIPAL
  // ========================
  function openPanel() {
    stopSpeak();
    injectStyles();
    document.querySelector('.pv-kids-panel')?.remove();

    let activeCat = 'todas';

    const panel = document.createElement('section');
    panel.className = 'pv-kids-panel';
    panel.innerHTML = `
      <div class="pv-kids-inner">
        <div class="pv-kids-head">
          <div>
            <p>Para los más chicos</p>
            <h1>👶 Biblia para chicos</h1>
          </div>
          <button class="pv-kids-close">Cerrar</button>
        </div>
        <div class="pv-kids-progress">
          <div>
            <strong class="pv-kids-count">0</strong> <small>de ${STORIES.length} historias leídas</small>
          </div>
          <button class="pv-kids-reset">Borrar progreso</button>
        </div>
        <div class="pv-kids-today">
          <div class="ribbon">⭐ Historia del día</div>
          <h2 class="pv-kids-today-title"></h2>
          <button class="btn">Leer ahora</button>
        </div>
        <div class="pv-kids-cats"></div>
        <div class="pv-kids-grid"></div>
      </div>
    `;
    document.body.appendChild(panel);

    const grid = panel.querySelector('.pv-kids-grid');
    const cats = panel.querySelector('.pv-kids-cats');
    const countEl = panel.querySelector('.pv-kids-count');
    const todayTitle = panel.querySelector('.pv-kids-today-title');
    const todayBtn = panel.querySelector('.pv-kids-today .btn');

    // Historia del día
    const today = getStoryOfDay();
    todayTitle.textContent = `${today.emoji} ${today.title}`;
    todayBtn.onclick = () => openDetail(today);

    // Categorías
    cats.innerHTML = CATEGORIES.map(c =>
      `<button class="pv-kids-cat ${c.id === activeCat ? 'active' : ''}" data-cat="${c.id}">${c.emoji} ${c.name}</button>`
    ).join('');

    function renderGrid() {
      cats.querySelectorAll('.pv-kids-cat').forEach(b => b.classList.toggle('active', b.dataset.cat === activeCat));
      const items = activeCat === 'todas' ? STORIES : STORIES.filter(s => s.c === activeCat);
      grid.innerHTML = items.map(s => {
        const sid = `${s.c}-${s.title.replace(/\s+/g,'-')}`;
        const read = isRead(sid);
        return `
          <article class="pv-kids-card ${read ? 'read' : ''}" data-title="${s.title}">
            ${read ? '<span class="star">⭐</span>' : ''}
            <div class="emoji">${s.emoji}</div>
            <h3>${s.title}</h3>
            <div class="ref">${s.ref}</div>
            <p>${s.text.slice(0, 80)}…</p>
          </article>
        `;
      }).join('');
      grid.querySelectorAll('.pv-kids-card').forEach(card => {
        card.onclick = () => {
          const title = card.dataset.title;
          const story = STORIES.find(s => s.title === title);
          if (story) openDetail(story);
        };
      });

      // Actualizar contador
      const readCount = STORIES.filter(s => isRead(`${s.c}-${s.title.replace(/\s+/g,'-')}`)).length;
      countEl.textContent = readCount;
    }

    cats.querySelectorAll('.pv-kids-cat').forEach(b => {
      b.onclick = () => { activeCat = b.dataset.cat; renderGrid(); };
    });

    panel.querySelector('.pv-kids-close').onclick = () => { stopSpeak(); panel.remove(); };
    panel.querySelector('.pv-kids-reset').onclick = () => {
      if (confirm('¿Borrar el progreso de lectura de los niños?')) {
        clearAllProgress();
        renderGrid();
      }
    };

    renderGrid();

    // Re-renderizar al volver de detalle
    const obs = new MutationObserver(() => {
      if (!document.querySelector('.pv-kids-detail')) renderGrid();
    });
    obs.observe(document.body, { childList: true });
    panel.addEventListener('remove', () => obs.disconnect());
  }

  function addHomeCard() {
    const title = document.querySelector('h1')?.textContent || '';
    if (!title.includes('Una palabra para hoy') || document.querySelector('.pv-kids-home')) return;
    const anchor = document.querySelector('.pv-ba-card')
      || document.querySelector('.pv-path-card')
      || document.querySelector('.hero');
    if (!anchor) return;
    const card = document.createElement('section');
    card.className = 'card pv-kids-home';
    const today = getStoryOfDay();
    const readCount = STORIES.filter(s => isRead(`${s.c}-${s.title.replace(/\s+/g,'-')}`)).length;
    card.innerHTML = `
      <p class="ref">Para los más chicos</p>
      <h3>👶 Biblia para chicos</h3>
      <p class="soft">${STORIES.length} historias con preguntas, oración y audio narrado. Hoy: <strong>${today.title}</strong> ${today.emoji}</p>
      <p class="soft" style="font-size:13px;margin-top:6px">📖 ${readCount} de ${STORIES.length} leídas</p>
      <div class="row wrap"><button class="btn">Abrir historias</button></div>
    `;
    card.querySelector('button').onclick = openPanel;
    anchor.insertAdjacentElement('afterend', card);
  }

  function addQuick() {
    const q = document.querySelector('.quick');
    if (!q || document.querySelector('.pv-kids-quick')) return;
    const b = document.createElement('button');
    b.className = 'pv-kids-quick';
    b.textContent = '👶 Niños';
    b.onclick = openPanel;
    q.insertBefore(b, q.firstChild);
  }

  window.PalabraVivaNinos = { open: openPanel };

  function boot() {
    injectStyles();
    removeInvasiveOld();
    addHomeCard();
    addQuick();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('load', boot);
  setInterval(boot, 900);
})();
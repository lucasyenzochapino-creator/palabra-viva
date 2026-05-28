(() => {
  // BIBLIA PARA CHICOS — v5
  // Fix crítico de contraste + audios narrados cuando están disponibles.

  const S = (c,emoji,title,ref,verse,text,q1,q2,pray) => ({ c, emoji, title, ref, verse, text, q:[q1,q2], pray });
  const STORIES = [
    S('creacion','🌍','Dios crea el mundo','Génesis 1:1','En el principio creó Dios los cielos y la tierra.','Antes que existiera todo, ya estaba Dios. Dios habló y nació la luz. Hizo el cielo, el mar, los árboles, los animales y las estrellas. Y al final hizo a las personas, porque quería tener una familia.','¿Qué cosa de la creación te gusta más?','¿Cómo le agradecemos a Dios por todo lo que hizo?','Gracias Dios por hacer un mundo tan lindo. Ayudame a cuidarlo.'),
    S('creacion','🍎','Adán y Eva en el jardín','Génesis 3:15','Pondré enemistad entre ti y la mujer.','Dios puso a Adán y Eva en un jardín hermoso. Les pidió no comer de un árbol. Ellos desobedecieron y se pusieron tristes. Pero Dios prometió enviar a alguien para arreglar todo: Jesús.','¿Qué pasa cuando desobedecemos?','¿Por qué Dios siguió amando a Adán y Eva?','Jesús, gracias porque viniste a arreglar lo que estaba roto.'),
    S('creacion','🚢','Noé y el arca','Génesis 9:13','Mi arco he puesto en las nubes.','Noé escuchaba a Dios. Dios le pidió construir un arca grande para cuidar a su familia y a los animales. Llovió mucho. Cuando terminó, Dios puso un arcoiris en el cielo como una promesa.','¿Cómo te sentirías construyendo un barco enorme?','¿Qué significa el arcoiris en el cielo?','Dios, ayudame a escucharte y obedecerte siempre.'),
    S('creacion','🏗️','La torre de Babel','Génesis 11:9','Allí confundió Jehová el lenguaje.','Las personas quisieron construir una torre tan alta como el cielo para sentirse importantes. Dios las hizo hablar idiomas diferentes y se separaron. Aprendieron que no podemos estar por encima de Dios.','¿Por qué no podemos ser más importantes que Dios?','¿Qué pasaría si todos hiciéramos lo que queremos sin escucharlo?','Dios, ayudame a ser humilde y a poner siempre primero tu voluntad.'),
    S('creacion','⭐','Abraham y la promesa','Génesis 15:5','Mira ahora los cielos, y cuenta las estrellas.','Abraham era un hombre que confiaba mucho en Dios. Dios le prometió darle una familia tan grande como las estrellas del cielo. Aunque Abraham era muy viejo, Dios cumplió su promesa con su hijo Isaac.','¿Te cuesta esperar cuando alguien te promete algo?','¿Por qué Dios siempre cumple lo que promete?','Dios, enseñame a esperar y a confiar en vos.'),
    S('creacion','👔','José y sus hermanos','Génesis 50:20','Dios lo encaminó a bien.','José tenía once hermanos que estaban enojados con él. Lo vendieron y terminó lejos de casa. Pero Dios estaba con José. Años después, José pudo perdonar a sus hermanos y ayudarlos cuando tenían hambre.','¿Es fácil perdonar a alguien que te lastimó?','¿Cómo puede Dios convertir algo malo en algo bueno?','Jesús, dame un corazón como el de José para perdonar.'),
    S('moises','🧺','Moisés en el río','Éxodo 2:10','Le puso por nombre Moisés.','Una mamá puso a su bebé en una canastita en el río Nilo para salvarlo. La hija del rey lo encontró y lo cuidó. Ese bebé era Moisés, a quien Dios usaría para liberar a su pueblo.','¿Cómo te sentirías siendo esa mamá?','¿Cómo cuida Dios a los chicos?','Dios, gracias porque siempre me cuidás como cuidaste a Moisés.'),
    S('moises','🔥','La zarza ardiente','Éxodo 3:14','YO SOY EL QUE SOY.','Moisés estaba cuidando ovejas cuando vio una planta que ardía pero no se quemaba. Dios le habló desde allí. Le pidió ir a Egipto a liberar a su pueblo. Moisés tenía miedo, pero Dios le prometió estar con él.','¿Qué hubieras hecho si veías una planta hablando?','¿Cuándo sentís miedo y Dios te da fuerza?','Dios, cuando tenga miedo recordame que vos estás conmigo.'),
    S('moises','🐸','Las plagas de Egipto','Éxodo 9:16','Para mostrar en ti mi poder.','El rey de Egipto no quería dejar libre al pueblo de Dios. Entonces Dios envió diez plagas: ranas, langostas, oscuridad. Después de la última, el rey dejó ir al pueblo. Nadie es más grande que Dios.','¿Por qué crees que el rey no quería obedecer a Dios?','¿Qué pasa cuando alguien no escucha a Dios?','Dios, ayudame a obedecerte la primera vez que me hables.'),
    S('moises','🌊','Cruzando el mar Rojo','Éxodo 14:14','Jehová peleará por vosotros.','El pueblo de Dios estaba atrapado entre el mar y los soldados egipcios. Moisés levantó su vara y el mar se abrió en dos. Cruzaron por tierra seca. Dios siempre abre un camino cuando parece que no hay.','¿Te imaginás caminando entre dos paredes de agua?','¿Qué hacés cuando parece que no hay salida?','Jesús, gracias porque vos siempre abrís un camino para mí.'),
    S('moises','🍞','Maná del cielo','Éxodo 16:4','Yo os haré llover pan del cielo.','En el desierto, el pueblo tenía hambre. Dios mandó del cielo un pan dulce llamado maná, cada mañana, por 40 años. Dios siempre da lo que necesitamos en el momento justo.','¿Confiás que Dios te va a dar lo que necesitás cada día?','¿Qué cosas te da Dios todos los días sin que las pidas?','Padre, gracias por darme lo necesario para cada día.'),
    S('moises','📜','Los diez mandamientos','Éxodo 20:6','Hago misericordia a los que me aman.','En el monte Sinaí, Dios le dio a Moisés diez reglas para vivir bien: amar a Dios, no mentir, honrar a papá y mamá, no robar, no envidiar. Son como una guía para amar a Dios y a las personas.','¿Cuál de los mandamientos te parece más difícil de cumplir?','¿Por qué los mandamientos nos ayudan a ser felices?','Jesús, ayudame a amar como vos amás.'),
    S('reyes','⚔️','David y Goliat','1 Samuel 17:47','No con espada y lanza salva Jehová.','Goliat era un gigante que daba mucho miedo. David era un chico pastor, pero confiaba en Dios. Con solo una honda y una piedra, derrotó a Goliat. La victoria no era de David, era de Dios.','¿Cuál es tu Goliat? ¿A qué le tenés miedo?','¿Cómo te ayuda Dios cuando enfrentás algo difícil?','Jesús, dame el valor de David para confiar en vos.'),
    S('reyes','👑','Salomón y la sabiduría','1 Reyes 3:9','Da a tu siervo corazón entendido.','Cuando Salomón fue rey, Dios le dijo: pedime lo que quieras. Salomón no pidió dinero ni fama. Pidió sabiduría para gobernar bien. A Dios le encantó la pregunta y le dio sabiduría y mucho más.','¿Qué le pedirías vos a Dios si te dijera eso?','¿Por qué la sabiduría es más importante que el dinero?','Dios, dame un corazón sabio para tomar buenas decisiones.'),
    S('reyes','🐦','Elías y los cuervos','1 Reyes 17:6','Los cuervos le traían pan y carne.','Hubo una sequía muy grande. Elías era un profeta de Dios. Dios le dijo que se escondiera junto a un arroyo. Cada mañana y tarde, los cuervos le traían comida en sus picos. Dios usa cosas raras para cuidarnos.','¿Te imaginás cuervos trayéndote la comida?','¿Cómo te cuida Dios en formas que no esperás?','Padre, gracias porque siempre encontrás la manera de cuidarme.'),
    S('reyes','🦁','Daniel y los leones','Daniel 6:22','Mi Dios envió su ángel, el cual cerró la boca de los leones.','Daniel oraba todos los días, aunque el rey había dicho que estaba prohibido. Lo tiraron al foso de los leones. Pero Dios envió un ángel y cerró la boca de los leones. Daniel pasó la noche tranquilo.','¿Hablás con Dios todos los días, aunque estés ocupado?','¿Cómo te protege Dios cuando hacés lo correcto?','Dios, dame valor para orar y confiar todos los días.'),
    S('reyes','🐳','Jonás y el pez grande','Jonás 2:2','Clamé de mi tribulación a Jehová, y él me oyó.','Dios le pidió a Jonás ir a Nínive a hablar de Él. Jonás primero quiso escapar en barco. Una tormenta lo arrastró al mar y un pez gigante se lo tragó. Adentro del pez, oró. Dios lo escuchó y lo sacó.','¿Alguna vez quisiste escapar de algo difícil?','¿Por qué es mejor obedecer a Dios la primera vez?','Dios, ayudame a decir que sí cuando me llamás.'),
    S('reyes','👸','Ester salva a su pueblo','Ester 4:14','¿Quién sabe si para esta hora has llegado al reino?','Ester era una reina muy joven. Un hombre malo quería hacerle daño al pueblo de Dios. Ester tenía miedo, pero habló con el rey y los salvó. Dios la puso en ese lugar para ese momento.','¿Para qué creés que Dios te puso donde estás?','¿Cómo podés ser valiente como Ester?','Dios, usame en el lugar donde me pusiste, aunque sea chico.'),
    S('jesus','⭐','Jesús nace en Belén','Lucas 2:11','Os ha nacido hoy un Salvador.','Jesús nació en un lugar humilde, en un pesebre con animales, porque no había lugar en el mesón. Los ángeles cantaron y los pastores fueron a verlo. Era el Hijo de Dios viniendo a buscarnos.','¿Por qué Jesús nació en un lugar tan humilde?','¿Qué le regalarías vos al niño Jesús?','Jesús, gracias por venir al mundo por mí.'),
    S('jesus','🌊','Jesús calma la tormenta','Marcos 4:39','Calla, enmudece. Y cesó el viento.','Jesús y sus amigos estaban en una barca cuando vino una tormenta fuerte. Jesús dormía. Sus amigos lo despertaron asustados. Jesús habló al viento y al mar, y todo quedó tranquilo. Hasta el viento le obedece.','¿Qué tormentas hay en tu vida?','¿Cómo te calma Jesús el corazón cuando estás asustado?','Jesús, calmá mi corazón cuando todo me da miedo.'),
    S('jesus','🍞','Cinco panes y dos peces','Juan 6:11','Tomó Jesús aquellos panes, y habiendo dado gracias, repartió.','Mucha gente seguía a Jesús y tenían hambre. Un niño ofreció lo poco que tenía: cinco panes y dos pescaditos. Jesús dio gracias, partió la comida, y todos comieron. Hasta sobró comida. Con poco, Jesús hace mucho.','¿Qué tenés vos para darle a Jesús?','¿Cómo usa Jesús lo poco que damos?','Jesús, usá lo que tengo, aunque sea poquito.'),
    S('jesus','👣','Jesús camina sobre el agua','Mateo 14:27','Confiad, yo soy; no tengáis miedo.','Los discípulos estaban en la barca de noche, con olas grandes. De repente vieron a Jesús caminando sobre el agua. Pedro quiso ir hacia él y caminó también, hasta que miró las olas. Jesús lo agarró de la mano.','¿En qué cosas te cuesta mantener los ojos en Jesús?','¿Qué hace Jesús cuando empezamos a hundirnos?','Jesús, agarrame la mano siempre.'),
    S('jesus','🌿','Jesús resucita a Lázaro','Juan 11:25','Yo soy la resurrección y la vida.','Lázaro, amigo de Jesús, se murió. Cuando Jesús llegó a la tumba, lloró. Después dijo: Lázaro, sal afuera. Y Lázaro salió vivo. Jesús es más fuerte que la muerte.','¿Sabías que Jesús también llora con nosotros?','¿Qué cosas imposibles para nosotros puede hacer Jesús?','Jesús, gracias porque vos sos la vida.'),
    S('jesus','🤗','Jesús ama a los niños','Marcos 10:14','Dejad a los niños venir a mí.','Los amigos de Jesús no querían que los chicos lo molestaran. Pero Jesús se enojó con ellos. Les dijo: Dejen venir a los niños. Los abrazó y los bendijo. Vos sos muy especial para Jesús.','¿Cómo te sentís sabiendo que Jesús te quiere abrazar?','¿Cómo podés acercarte vos a Jesús hoy?','Jesús, gracias porque me querés tal como soy.'),
    S('pascua','❤️','El buen samaritano','Lucas 10:33','Fue movido a misericordia.','Un hombre necesitaba ayuda en el camino. Pasaron dos personas importantes y siguieron de largo. Pero un samaritano se detuvo, lo curó y lo cuidó. Jesús nos enseña así a amar al que necesita ayuda.','¿Conocés alguien que necesite ayuda hoy?','¿Cómo podés ser un buen samaritano esta semana?','Jesús, enseñame a mirar a los que sufren y a ayudar.'),
    S('pascua','🏠','El hijo que volvió','Lucas 15:20','Su padre fue movido a misericordia.','Un hijo se fue lejos y gastó todo. Quedó pobre y triste. Decidió volver a su casa. Cuando el papá lo vio venir, corrió a abrazarlo. Así nos recibe Dios cuando volvemos arrepentidos.','¿Alguna vez te alejaste de Dios?','¿Qué hace Dios cuando le decimos perdón?','Padre, gracias porque siempre puedo volver a tus brazos.'),
    S('pascua','🐑','La oveja perdida','Lucas 15:5','La pone sobre sus hombros gozoso.','Un pastor tenía cien ovejas. Una se perdió. Dejó las noventa y nueve y fue a buscar a la perdida. Cuando la encontró, se puso muy feliz y la cargó sobre sus hombros. Así nos busca Jesús a cada uno.','¿Sabías que vos sos importante para Jesús, uno por uno?','¿Cómo se siente saber que Jesús nunca te abandona?','Jesús, gracias por buscarme cuando me alejo.'),
    S('pascua','🌱','El sembrador','Mateo 13:23','Da fruto a ciento, a sesenta y a treinta por uno.','Un agricultor sembró semillas. Algunas cayeron en el camino y los pájaros se las comieron. Otras en piedras y se secaron. Otras entre espinas. Pero las que cayeron en buena tierra dieron mucho fruto.','¿Qué tipo de tierra es tu corazón?','¿Cómo podés cuidar la palabra de Dios en tu vida?','Dios, hacé de mi corazón una buena tierra para tu palabra.'),
    S('pascua','✝️','Jesús muere por nosotros','Juan 3:16','Tanto amó Dios al mundo.','Jesús dio su vida en la cruz por todos nosotros. Tomó nuestros errores y nos dio su perdón. Fue el regalo más grande del mundo, porque Dios nos ama mucho.','¿Por qué Jesús quiso morir por vos?','¿Cómo le agradecés ese regalo tan grande?','Jesús, gracias por amarme hasta dar tu vida.'),
    S('pascua','🌅','Jesús vive','Mateo 28:6','No está aquí, pues ha resucitado.','Tres días después de la cruz, los amigos de Jesús fueron a la tumba. Pero estaba vacía. Jesús había resucitado. Está vivo para siempre. Y porque Él vive, nosotros también vivimos.','¿Qué cambia saber que Jesús está vivo hoy?','¿Cómo se llama el día que celebramos su resurrección?','Jesús, gracias porque estás vivo y estás conmigo siempre.')
  ];

  const CATS=[['todas','📖','Todas'],['creacion','🌍','Creación'],['moises','🔥','Moisés'],['reyes','👑','Reyes y profetas'],['jesus','✨','Jesús'],['pascua','✝️','Parábolas y Pascua']];
  const PROGRESS_KEY='pv-kids-read';

  // ── AUDIO HUMANO REAL ─────────────────────────────────────────────────────
  // Serie "La Biblia Infantil" de Oceano Multimedia en archive.org.
  // Voz humana real, narración cálida pensada para niños, ~2-3 min cada una.
  // CC BY-NC-ND license — uso permitido en app no comercial gratuita.
  const IA_BASE = 'https://archive.org/download/';
  const AUDIO_MAP = {
    'Dios crea el mundo':         [IA_BASE+'102-la-creacion-del-mundo_202210/102%20-%20La%20Creacio%CC%81n%20Del%20Mundo.mp3'],
    'Adán y Eva en el jardín':    [IA_BASE+'103-la-primera-pareja-adan-y-eva_202210/103%20-%20La%20Primera%20Pareja-%20Ada%CC%81n%20Y%20Eva.mp3'],
    'Noé y el arca':              [IA_BASE+'105-el-arca-de-noe/105%20-%20El%20Arca%20De%20Noe%CC%81.mp3'],
    'La torre de Babel':          [IA_BASE+'107-la-torre-de-babel/107%20-%20La%20Torre%20De%20Babel.mp3'],
    'Abraham y la promesa':       [IA_BASE+'108-sacrificio-de-isaac/108%20-%20Sacrificio%20De%20Isaac.mp3'],
    'José y sus hermanos':        [IA_BASE+'110-jose-en-egipto/110%20-%20Jose%CC%81%20En%20Egipto.mp3'],
    'Moisés en el río':           [IA_BASE+'113-el-pequeno-moises/113%20-%20El%20Pequen%CC%83o%20Moise%CC%81s.mp3'],
    'Las plagas de Egipto':       [IA_BASE+'115-las-plagas-de-egipto/115%20-%20Las%20Plagas%20De%20Egipto.mp3'],
    'Cruzando el mar Rojo':       [IA_BASE+'116-el-paso-del-mar-rojo/116%20-%20El%20Paso%20Del%20Mar%20Rojo.mp3'],
    'Los diez mandamientos':      [IA_BASE+'118-las-tablas-de-la-ley/118%20-%20Las%20Tablas%20De%20La%20Ley.mp3'],
    'David y Goliat':             [IA_BASE+'124-el-gigante-goliat/124%20-%20El%20Gigante%20Goliat.mp3'],
    'Salomón y la sabiduría':     [IA_BASE+'125-el-sabio-salomon/125%20-%20El%20Sabio%20Salomo%CC%81n.mp3'],
    'Elías y los cuervos':        [IA_BASE+'128-el-profeta-elias/128%20-%20El%20Profeta%20Eli%CC%81as.mp3'],
    'Jonás y el pez grande':      [IA_BASE+'131-jonas-y-la-ballena/131%20-%20Jona%CC%81s%20Y%20La%20Ballena.mp3'],
    'Jesús nace en Belén':        [IA_BASE+'203-el-nacimiento-de-jesus_202210/203%20-%20El%20Nacimiento%20De%20Jesu%CC%81s.mp3'],
    'Cinco panes y dos peces':    [IA_BASE+'214-la-multiplicacion-de-los-panes-y-los-peces_202210/214%20-%20La%20Multiplicacio%CC%81n%20De%20Los%20Panes%20Y%20Los%20Peces.mp3'],
    'Jesús camina sobre el agua': [IA_BASE+'215-jesus-camina-sobre-las-aguas_202210/215%20-%20Jesu%CC%81s%20Camina%20Sobre%20Las%20Aguas.mp3'],
    'Jesús ama a los niños':      [IA_BASE+'218-jesus-y-los-ninos_202210/218%20-%20Jesu%CC%81s%20Y%20Los%20Nin%CC%83os.mp3'],
    'Jesús resucita a Lázaro':    [IA_BASE+'219-la-resurreccion-de-lazaro_202210/219%20-%20La%20Resurreccio%CC%81n%20De%20La%CC%81zaro.mp3'],
    'El buen samaritano':         [IA_BASE+'217-jesus-cuenta-parabolas_202210/217%20-%20Jesu%CC%81s%20Cuenta%20Para%CC%81bolas.mp3'],
    'El hijo que volvió':         [IA_BASE+'217-jesus-cuenta-parabolas_202210/217%20-%20Jesu%CC%81s%20Cuenta%20Para%CC%81bolas.mp3'],
    'La oveja perdida':           [IA_BASE+'217-jesus-cuenta-parabolas_202210/217%20-%20Jesu%CC%81s%20Cuenta%20Para%CC%81bolas.mp3'],
    'El sembrador':               [IA_BASE+'217-jesus-cuenta-parabolas_202210/217%20-%20Jesu%CC%81s%20Cuenta%20Para%CC%81bolas.mp3'],
    'Jesús muere por nosotros':   [IA_BASE+'228-la-crucifixion_202210/228%20-%20La%20Crucifixio%CC%81n.mp3'],
    'Jesús vive':                 [IA_BASE+'230-la-resureccion-del-senor_202210/230%20-%20La%20Resureccio%CC%81n%20Del%20Sen%CC%83or.mp3']
  };

  const idOf=s=>`${s.c}-${s.title.replace(/\s+/g,'-')}`;
  const read=()=>{try{return JSON.parse(localStorage.getItem(PROGRESS_KEY)||'{}')}catch{return{}}};
  const save=o=>{try{localStorage.setItem(PROGRESS_KEY,JSON.stringify(o))}catch{}};
  const mark=s=>{const p=read();p[idOf(s)]=Date.now();save(p)};
  const isRead=s=>!!read()[idOf(s)];
  const today=()=>STORIES[Math.abs(Math.floor((new Date()-new Date(2025,0,1))/86400000))%STORIES.length];

  let panel=null, detail=null, currentAudio=null, speechParts=[], speechStop=false;

  // ── Voces: cargar voces disponibles (puede tardar en algunos browsers) ────
  let _voicesCache=null;
  function loadVoices(){
    return new Promise(resolve=>{
      const vs=speechSynthesis.getVoices();
      if(vs&&vs.length){_voicesCache=vs;return resolve(vs);}
      speechSynthesis.addEventListener('voiceschanged',()=>{
        _voicesCache=speechSynthesis.getVoices();
        resolve(_voicesCache);
      },{once:true});
      setTimeout(()=>resolve(speechSynthesis.getVoices()||[]),1500);
    });
  }

  // Seleccionar la mejor voz en español disponible, priorizando voces
  // neurales/network/premium que suenan más humanas que las robot básicas.
  // El usuario puede sobreescribir con localStorage.pv-kids-voice.
  function pickBestSpanishVoice(){
    const vs=_voicesCache||speechSynthesis.getVoices()||[];
    if(!vs.length) return null;
    const preferred=localStorage.getItem('pv-kids-voice');
    if(preferred){const m=vs.find(v=>v.voiceURI===preferred||v.name===preferred);if(m)return m;}
    // Heurística: priorizar voces de alta calidad
    const score=v=>{
      let s=0;
      const n=(v.name||'').toLowerCase(), uri=(v.voiceURI||'').toLowerCase(), lang=(v.lang||'').toLowerCase();
      if(!lang.startsWith('es')) return -100;
      // Voces neurales/network = mucho más naturales
      if(/neural|wavenet|natural|network|enhanced|premium|online/.test(n+uri)) s+=50;
      // Voces nombradas de personas (suelen ser mejor calidad)
      if(/elena|tomas|sabina|paulina|conchita|sofia|jorge|monica|paola|lupe|laura|miguel/.test(n)) s+=20;
      // Voces es-AR / es-MX / es-419 (Latinoamérica, más natural para el target)
      if(/ar|419/.test(lang)) s+=15;
      else if(/mx|us|co/.test(lang)) s+=10;
      else s+=5;
      // Penalizar voces "compact" o explícitamente robóticas
      if(/compact|robot|basic|standard/.test(n+uri)) s-=10;
      return s;
    };
    return [...vs].sort((a,b)=>score(b)-score(a))[0];
  }

  // Lista de voces ES para el selector
  function listSpanishVoices(){
    const vs=_voicesCache||speechSynthesis.getVoices()||[];
    return vs.filter(v=>(v.lang||'').toLowerCase().startsWith('es'));
  }

  function css(){
    if(document.getElementById('pv-kids-style-v7'))return;
    document.getElementById('pv-kids-style')?.remove();document.getElementById('pv-kids-style-v2')?.remove();document.getElementById('pv-kids-style-v5')?.remove();
    const st=document.createElement('style');st.id='pv-kids-style-v7';st.textContent=`
      .pv-kids-fab,.pv-kids-fab-old{display:none!important}
      .pv-kids-panel{position:fixed;inset:0;z-index:1000001;background:linear-gradient(180deg,#fff8ef,#ffe9c7);color:#20140b!important;overflow:auto;padding:14px 12px calc(140px + env(safe-area-inset-bottom))}
      .pv-kids-inner{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:14px}.pv-kids-head{display:grid;grid-template-columns:1fr auto;gap:10px;position:sticky;top:0;background:linear-gradient(to bottom,#fff8ef 82%,transparent);padding:8px 0 14px;z-index:5}.pv-kids-head h1{font-size:clamp(26px,7vw,34px);margin:4px 0;color:#7c4a1e!important}.pv-kids-head p{color:#7c4a1e!important;margin:0}.pv-kids-close{border:2px solid #7c4a1e;background:#fff;color:#7c4a1e!important;border-radius:999px;padding:9px 14px;font-weight:900}.pv-kids-progress,.pv-kids-card,.pv-kids-audio-note{background:#fff;border-radius:20px;padding:14px;box-shadow:0 4px 12px rgba(0,0,0,.06);color:#20140b!important}.pv-kids-progress strong{color:#16a34a!important;font-size:22px}.pv-kids-reset{border:1px solid rgba(124,74,30,.35);background:transparent;color:#7c4a1e!important;border-radius:999px;padding:7px 12px;font-weight:800}.pv-kids-today{background:linear-gradient(135deg,#fbbf24,#f59e0b);color:white!important;border-radius:22px;padding:16px}.pv-kids-today h2{margin:6px 0;color:white!important}.pv-kids-today .btn{background:#fff;color:#92400e!important;border:0;border-radius:999px;padding:11px 18px;font-weight:900}.pv-kids-cats{display:flex;gap:8px;overflow-x:auto}.pv-kids-cat{flex:0 0 auto;border:0;background:#fff;color:#7c4a1e!important;border-radius:999px;padding:9px 14px;font-weight:900}.pv-kids-cat.active{background:linear-gradient(135deg,#22c55e,#3b82f6);color:#fff!important}.pv-kids-grid{display:grid;grid-template-columns:1fr;gap:12px}.pv-kids-card{border-top:5px solid #22c55e;position:relative;cursor:pointer}.pv-kids-card.read{border-top-color:#fbbf24}.pv-kids-card .emoji{font-size:38px}.pv-kids-card h3{margin:6px 0 4px;font-size:18px;color:#20140b!important}.pv-kids-card .ref{font-size:12px;font-weight:900;color:#7c4a1e!important}.pv-kids-card p{color:#3f2f1f!important}.pv-kids-badge{position:absolute;top:12px;right:12px;background:#2563eb;color:#fff!important;border-radius:999px;font-size:11px;font-weight:900;padding:4px 8px}.pv-kids-star{position:absolute;top:44px;right:16px;font-size:20px}
      .pv-kids-detail{position:fixed;inset:0;z-index:1000040;background:#fff8ef;overflow:auto;padding:14px 14px calc(150px + env(safe-area-inset-bottom));color:#20140b!important}.pv-kids-detail-inner{max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:14px}.pv-kids-detail-head{display:flex;justify-content:space-between;gap:10px;position:sticky;top:0;background:linear-gradient(to bottom,#fff8ef 85%,transparent);padding:6px 0 12px;z-index:3}.pv-kids-detail h1{font-size:clamp(24px,7vw,32px);text-align:center;color:#7c4a1e!important}.big-emoji{font-size:72px;text-align:center}.verse-box{background:linear-gradient(135deg,#fef3c7,#fde68a)!important;border-radius:18px;padding:14px;color:#7c4a1e!important}.verse-box .label,.verse-box em{color:#7c4a1e!important}.story-text{background:#fff;border-radius:18px;padding:16px;font-size:17px;line-height:1.55;color:#20140b!important}.questions{background:#dbeafe!important;border-radius:18px;padding:14px;color:#0c2557!important}.questions *{color:#0c2557!important}.pray-box{background:linear-gradient(135deg,#dcfce7,#bbf7d0)!important;border-radius:18px;padding:14px;color:#052e16!important}.pray-box *{color:#052e16!important;font-weight:600!important}.label{font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.08em}.pv-kids-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}.pv-kids-btn{border:0;border-radius:999px;padding:13px;font-weight:900;min-height:48px}.pv-kids-btn.primary{background:linear-gradient(135deg,#22c55e,#3b82f6);color:#fff!important}.pv-kids-btn.audio{background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff!important}.pv-kids-btn.ghost{background:#fff;color:#7c4a1e!important;border:2px solid #7c4a1e}.pv-kids-btn.full{grid-column:1/-1}.pv-kids-player{width:100%;margin-top:8px}.pv-kids-home{border-color:rgba(34,197,94,.45)!important;background:linear-gradient(135deg,rgba(34,197,94,.12),var(--card))!important}@media(min-width:600px){.pv-kids-grid{grid-template-columns:1fr 1fr}}
    `;document.head.appendChild(st);
  }

  function stopAll(){
    try{currentAudio?.pause();currentAudio=null;}catch{}
    try{if('speechSynthesis' in window){speechSynthesis.cancel();}}catch{}
    speechStop=true;
  }

  // TTS v3 — implementación más simple posible. Sin async/await complejo,
  // sin watchdog. Llamada sincrónica desde click → primera speak() llega
  // dentro del user-gesture (crítico para iOS). Resto encadena por onend.
  function tts(text, btn){
    if(!('speechSynthesis' in window)){
      alert('Tu navegador no soporta lectura en voz alta.');
      return;
    }

    // Cancelar lo anterior INMEDIATAMENTE (síncrono)
    speechStop = true;
    try{ speechSynthesis.cancel(); }catch{}

    // Voz preferida (puede ser null si voces aún no cargaron)
    let voice = pickBestSpanishVoice();
    const voiceName = voice?.name || '(default)';

    // Cortar texto en frases (mantenemos chunks cortos para evitar bug 15s)
    const sentences = (text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text])
      .map(s => s.trim())
      .filter(Boolean);

    let i = 0;
    speechStop = false;
    btn.textContent = '⏸ Detener audio';
    btn.dataset.playing = '1';
    btn.disabled = false;

    console.log('[Niños TTS v3] voz:', voiceName, voice?.lang, '— frases:', sentences.length);

    function speakNext(){
      if(speechStop || i >= sentences.length){
        btn.textContent = '🔊 Leer de nuevo';
        btn.dataset.playing = '';
        return;
      }
      const u = new SpeechSynthesisUtterance(sentences[i++]);
      u.lang = (voice?.lang) || 'es-419';
      u.rate = 0.93;
      u.pitch = 1.0;
      u.volume = 1;
      if(voice) u.voice = voice;

      u.onend = () => { if(!speechStop) speakNext(); };
      u.onerror = (ev) => {
        const err = ev?.error || 'desconocido';
        console.warn('[Niños TTS v3] onerror frase', i-1, err);
        // 'interrupted' y 'canceled' son normales (usuario detuvo)
        if(err === 'interrupted' || err === 'canceled'){
          btn.textContent = '🔊 Escuchar historia';
          btn.dataset.playing = '';
          return;
        }
        // Otros errores → mostrar mensaje y reintentar próxima frase
        btn.textContent = '⚠️ Error de voz: ' + err;
        setTimeout(() => { if(!speechStop) speakNext(); }, 300);
      };

      try{ speechSynthesis.speak(u); }
      catch(e){
        console.error('[Niños TTS v3] speak() lanzó excepción:', e);
        btn.textContent = '❌ No se pudo iniciar la voz';
        btn.dataset.playing = '';
      }
    }

    // Si voces no estaban cargadas, intentar de nuevo en 500ms
    if(!voice){
      // Cargar voces y reintentar el speak con la mejor voz
      const onVoices = () => {
        voice = pickBestSpanishVoice();
        speechSynthesis.removeEventListener('voiceschanged', onVoices);
      };
      speechSynthesis.addEventListener('voiceschanged', onVoices);
    }

    speakNext();

    // Diagnóstico visible: si en 2.5s no empezó a hablar, avisar al usuario
    setTimeout(() => {
      if(speechStop) return;
      if(!speechSynthesis.speaking && !speechSynthesis.pending){
        console.warn('[Niños TTS v3] No arrancó después de 2.5s — revisar permisos / voces.');
        btn.textContent = '⚠️ Tocá de nuevo para reintentar';
      }
    }, 2500);
  }

  // UI: mini selector de voz dentro del detail panel
  function buildVoiceSelector(){
    const voices=listSpanishVoices();
    if(voices.length<=1) return ''; // no hay alternativas
    const current=localStorage.getItem('pv-kids-voice')||'';
    const opts=voices.map(v=>`<option value="${v.voiceURI||v.name}" ${current===(v.voiceURI||v.name)?'selected':''}>${v.name} (${v.lang})</option>`).join('');
    return `<div style="background:#fff;border-radius:14px;padding:10px 12px;display:flex;align-items:center;gap:8px;flex-wrap:wrap"><span style="font-size:13px;font-weight:900;color:#7c4a1e">🎙️ Voz:</span><select class="pv-kids-voice-sel" style="flex:1;min-width:160px;border:1px solid #d1b083;background:#fff;color:#27190c;border-radius:10px;padding:7px 10px;font-size:13px;font-weight:600"><option value="">Mejor disponible (auto)</option>${opts}</select></div>`;
  }

  function openDetail(story, opts){
    opts = opts || {};
    const fromTimeline = !!opts.fromTimeline;
    stopAll();
    document.querySelector('.pv-kids-detail')?.remove();
    history.pushState({pvKidsDetail:true,fromTimeline}, '', location.href.split('#')[0] + '#kids-detail');
    detail = document.createElement('section');
    detail.className = 'pv-kids-detail';
    const aud = AUDIO_MAP[story.title] || [];
    const escape = s => (s||'').replace(/"/g, '&quot;');

    // Botón "siguiente historia" disponible si vinimos del timeline
    const idx = STORIES.findIndex(s => s.title === story.title);
    const hasNextStory = idx >= 0 && idx < STORIES.length - 1;
    const hasPrevStory = idx > 0;

    detail.innerHTML = `
      <div class="pv-kids-detail-inner">
        <div class="pv-kids-detail-head">
          <button class="pv-kids-btn ghost" data-back>← Volver</button>
          <button class="pv-kids-btn ghost" data-close>Cerrar</button>
        </div>
        <div class="big-emoji">${story.emoji}</div>
        <h1>${story.title}</h1>

        ${aud.length ? `
        <div class="pv-kids-human-audio" style="background:linear-gradient(135deg,#fef3c7,#fde68a);border:3px solid #b45309;border-radius:20px;padding:16px;display:flex;flex-direction:column;gap:12px;box-shadow:0 6px 18px rgba(180,83,9,.15)">
          <div style="display:flex;align-items:center;gap:10px;border-bottom:1px dashed rgba(180,83,9,.35);padding-bottom:10px">
            <span style="font-size:36px;line-height:1">🎙️</span>
            <div style="flex:1">
              <div style="font-weight:900;color:#92400e;font-size:16px;line-height:1.2;text-transform:uppercase;letter-spacing:.04em">Audio narrado</div>
              <div style="font-size:11px;color:#7c4a1e;line-height:1.3">Voz humana real — Oceano Multimedia</div>
            </div>
          </div>
          <div style="background:rgba(255,255,255,.7);border-radius:14px;padding:12px;text-align:center">
            <div style="font-size:11px;color:#7c4a1e;font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px">📻 Ahora suena</div>
            <div style="font-size:18px;font-weight:900;color:#92400e;line-height:1.25">${story.title}</div>
            <div style="font-size:13px;color:#7c4a1e;margin-top:4px;font-weight:600">📖 ${story.ref}</div>
          </div>
          <audio class="pv-kids-player" controls preload="metadata" src="${aud[0]}" style="width:100%"></audio>
          <div class="pv-kids-audio-status" style="font-size:13px;color:#7c4a1e;text-align:center;min-height:18px;font-weight:600"></div>
        </div>
        ` : `
        <div class="pv-kids-audio-note" style="background:#fff;border:1px dashed #d1b083;border-radius:14px;padding:12px;color:#7c4a1e">
          🔊 Esta historia se lee con la voz de tu celular. Elegí la mejor voz disponible abajo.
        </div>
        ${buildVoiceSelector()}
        `}

        <div class="verse-box"><span class="label">${story.ref}</span><em>“${story.verse}”</em></div>
        <div class="story-text">${story.text}</div>
        <div class="questions"><span class="label">Para pensar juntos</span><ol>${story.q.map(x=>`<li>${x}</li>`).join('')}</ol></div>
        <div class="pray-box"><span class="label">Oración</span><p>${story.pray}</p></div>

        <div class="pv-kids-actions">
          ${aud.length ? '' : `<button class="pv-kids-btn audio full" data-tts>🔊 Escuchar con voz del celular</button>`}
          <button class="pv-kids-btn audio" data-share>📤 Compartir</button>
          <button class="pv-kids-btn primary" data-read>⭐ Marcar como leída</button>
          ${hasPrevStory ? '<button class="pv-kids-btn ghost" data-prev-story>⏮ Anterior</button>' : ''}
          ${hasNextStory ? '<button class="pv-kids-btn audio" data-next-story>Siguiente ⏭</button>' : ''}
        </div>

        ${aud.length ? `
        <details style="background:transparent;border:1px solid #d1b083;border-radius:12px;padding:10px 14px;margin-top:8px">
          <summary style="cursor:pointer;font-size:13px;color:#7c4a1e;font-weight:700">¿No carga el audio narrado? Probá leer con la voz del celular</summary>
          ${buildVoiceSelector()}
          <button class="pv-kids-btn audio full" data-tts style="margin-top:8px">🔊 Leer en voz alta</button>
        </details>
        ` : ''}
      </div>`;

    document.body.appendChild(detail);

    detail.querySelector('[data-back]').onclick = () => closeDetail(true);
    detail.querySelector('[data-close]').onclick = () => { closeDetail(false); closePanel(false); };
    detail.querySelector('[data-read]').onclick = (e) => {
      mark(story);
      e.target.textContent = '✓ Leída';
      e.target.style.background = '#16a34a';
    };
    if (isRead(story)) {
      const b = detail.querySelector('[data-read]');
      b.textContent = '✓ Leída';
      b.style.background = '#16a34a';
    }

    // Siguiente / anterior historia
    detail.querySelector('[data-next-story]')?.addEventListener('click', () => {
      if (idx >= 0 && idx < STORIES.length - 1) openDetail(STORIES[idx + 1], { fromTimeline });
    });
    detail.querySelector('[data-prev-story]')?.addEventListener('click', () => {
      if (idx > 0) openDetail(STORIES[idx - 1], { fromTimeline });
    });

    // Compartir
    detail.querySelector('[data-share]')?.addEventListener('click', async () => {
      const shareRef = `📖 ${story.title}${story.ref ? ' — ' + story.ref : ''}`;
      const shareVerse = story.verse || story.text || story.title;
      const shareBtn2 = detail.querySelector('[data-share]');
      try {
        if (window.PVShareImage) {
          window.PVShareImage.share({ text: shareVerse, ref: shareRef, btn: shareBtn2 });
        } else {
          const text = `📖 ${story.title}\n\n${story.ref}: “${story.verse}”\n\n${story.text}\n\n🙏 ${story.pray}\n\n✝️ Palabra Viva`;
          const shareData = { title: 'Palabra Viva — ' + story.title, text, url: location.origin + '/' };
          if (navigator.share && navigator.canShare?.(shareData)) {
            await navigator.share(shareData);
          } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(text);
          }
        }
      } catch (e) { /* user canceled */ }
    });

    // Audio player con status visible
    const player = detail.querySelector('.pv-kids-player');
    const statusEl = detail.querySelector('.pv-kids-audio-status');
    if (player) {
      currentAudio = player;
      const setStatus = (txt) => { if (statusEl) statusEl.textContent = txt; };
      player.addEventListener('loadstart',   () => setStatus('⏳ Cargando audio…'));
      player.addEventListener('loadedmetadata', () => {
        const dur = Math.round(player.duration || 0);
        const m = Math.floor(dur / 60), s = dur % 60;
        setStatus(`📻 Duración: ${m}:${String(s).padStart(2,'0')} — tocá ▶`);
      });
      player.addEventListener('playing',     () => setStatus('🔴 Reproduciendo voz humana real'));
      player.addEventListener('pause',       () => setStatus('⏸ Pausado'));
      player.addEventListener('ended',       () => setStatus('✓ Terminó la narración'));
      player.addEventListener('waiting',     () => setStatus('⏳ Buffering…'));
      player.addEventListener('error', () => {
        setStatus('⚠️ No se pudo cargar el audio narrado.');
        const note = detail.querySelector('.pv-kids-human-audio');
        if (note) {
          note.style.background = 'linear-gradient(135deg,#fef2f2,#fee2e2)';
          note.style.borderColor = '#dc2626';
          note.querySelector('div div div:first-child').innerHTML = '⚠️ No se pudo cargar el audio';
          note.querySelector('div div div:last-child').innerHTML = 'Probá la opción "Leer con voz del celular" más abajo';
        }
      });
    }

    // TTS
    const tb = detail.querySelector('[data-tts]');
    if (tb) tb.onclick = () => {
      if (tb.dataset.playing) {
        stopAll();
        tb.textContent = '🔊 Leer en voz alta';
        tb.dataset.playing = '';
      } else {
        tts(`${story.title}. ${story.verse}. ${story.text}. Para pensar juntos: ${story.q.join('. ')} Oración: ${story.pray}`, tb);
      }
    };

    // Selector de voz
    const vs = detail.querySelector('.pv-kids-voice-sel');
    if (vs) vs.onchange = () => {
      try { localStorage.setItem('pv-kids-voice', vs.value || ''); } catch {}
      stopAll();
      if (tb) tb.textContent = '🔊 Leer en voz alta';
    };

    loadVoices().then(() => {
      const newVs = detail.querySelector('.pv-kids-voice-sel');
      if (newVs && newVs.options.length <= 1) {
        const wrap = newVs.parentElement;
        if (wrap) {
          wrap.outerHTML = buildVoiceSelector();
          const newSel = detail.querySelector('.pv-kids-voice-sel');
          if (newSel) newSel.onchange = () => { try { localStorage.setItem('pv-kids-voice', newSel.value||''); } catch {} stopAll(); };
        }
      }
    });

    window.addEventListener('popstate', onPop);
  }

  // popstate solo cierra el detail si REALMENTE saliste de #kids-detail
  // (no si abriste una sub-pantalla y volviste)
  function onPop() {
    if (location.hash === '#kids-detail') return; // sigo en detail
    window.removeEventListener('popstate', onPop);
    stopAll();
    document.querySelector('.pv-kids-detail')?.remove();
    detail = null;
  }

  function closeDetail(useHistory) {
    stopAll();
    document.querySelector('.pv-kids-detail')?.remove();
    detail = null;
    window.removeEventListener('popstate', onPop);
    if (useHistory && location.hash === '#kids-detail') {
      window._pvPanelClosing = true;
      history.back();
    }
  }

  function openPanel(){
    stopAll();css();document.querySelector('.pv-kids-panel')?.remove();let cat='todas';history.pushState({pvKids:true},'',location.href.split('#')[0]+'#kids');
    panel=document.createElement('section');panel.className='pv-kids-panel';panel.innerHTML=`<div class="pv-kids-inner"><div class="pv-kids-head"><div><p>Para los más chicos</p><h1>👶 Biblia para chicos</h1></div><button class="pv-kids-close">Cerrar</button></div><div class="pv-kids-progress"><div><strong class="pv-kids-count">0</strong> <small>de ${STORIES.length} historias leídas</small></div><button class="pv-kids-reset">Borrar progreso</button></div><div class="pv-kids-today"><div class="label">⭐ Historia del día</div><h2></h2><button class="btn">Leer ahora</button></div><div class="pv-kids-cats"></div><div class="pv-kids-grid"></div></div>`;document.body.appendChild(panel);
    const grid=panel.querySelector('.pv-kids-grid'),cats=panel.querySelector('.pv-kids-cats'),cnt=panel.querySelector('.pv-kids-count'),td=today();panel.querySelector('.pv-kids-today h2').textContent=`${td.emoji} ${td.title}`;panel.querySelector('.pv-kids-today .btn').onclick=()=>openDetail(td);
    cats.innerHTML=CATS.map(c=>`<button class="pv-kids-cat ${c[0]===cat?'active':''}" data-cat="${c[0]}">${c[1]} ${c[2]}</button>`).join('');
    function render(){cats.querySelectorAll('.pv-kids-cat').forEach(b=>b.classList.toggle('active',b.dataset.cat===cat));const items=cat==='todas'?STORIES:STORIES.filter(s=>s.c===cat);grid.innerHTML=items.map(s=>`<article class="pv-kids-card ${isRead(s)?'read':''}" data-title="${s.title}">${AUDIO_MAP[s.title]?'<span class="pv-kids-badge">🎧 VOZ</span>':''}${isRead(s)?'<span class="pv-kids-star">⭐</span>':''}<div class="emoji">${s.emoji}</div><h3>${s.title}</h3><div class="ref">${s.ref}</div><p>${s.text.slice(0,95)}…</p></article>`).join('');grid.querySelectorAll('.pv-kids-card').forEach(card=>card.onclick=()=>openDetail(STORIES.find(s=>s.title===card.dataset.title)));cnt.textContent=STORIES.filter(isRead).length;}
    cats.querySelectorAll('.pv-kids-cat').forEach(b=>b.onclick=()=>{cat=b.dataset.cat;render()});
    panel.querySelector('.pv-kids-close').onclick=()=>closePanel(true);
    panel.querySelector('.pv-kids-reset').onclick=()=>{if(confirm('¿Borrar el progreso de lectura de los niños?')){save({});render()}};
    render();
    // popstate solo cierra el panel si REALMENTE saliste de #kids
    // (al abrir detail se push #kids-detail; al volver de detail vuelve a #kids
    //  → entonces NO debemos cerrar el panel, solo el detail)
    function onPanelPop() {
      if (location.hash === '#kids') return; // sigo en panel
      window.removeEventListener('popstate', onPanelPop);
      stopAll();
      document.querySelector('.pv-kids-panel')?.remove();
      panel = null;
    }
    window.addEventListener('popstate', onPanelPop);
  }
  function closePanel(useHistory){
    stopAll();
    document.querySelector('.pv-kids-panel')?.remove();
    panel=null;
    if(useHistory&&location.hash==='#kids'){window._pvPanelClosing=true;history.back();}
  }
  function addHome(){const title=document.querySelector('h1')?.textContent||'';if(!title.includes('Una palabra para hoy')||document.querySelector('.pv-kids-home'))return;const anchor=document.querySelector('.pv-ba-card')||document.querySelector('.pv-path-card')||document.querySelector('.hero');if(!anchor)return;const t=today(),n=STORIES.filter(isRead).length;const card=document.createElement('section');card.className='card pv-kids-home';card.innerHTML=`<p class="ref">Para los más chicos</p><h3>Biblia para chicos</h3><p class="soft">${STORIES.length} historias con preguntas, oración y audio. Hoy: <strong>${t.title}</strong> ${t.emoji}</p><p class="soft" style="font-size:13px">📖 ${n} de ${STORIES.length} leídas</p><div class="row wrap"><button class="btn">Abrir historias</button></div>`;window.PVImages?.applyHero?.(card,'child_reading');card.querySelector('button').onclick=openPanel;anchor.insertAdjacentElement('afterend',card)}
  function addQuick(){const q=document.querySelector('.quick');if(!q||document.querySelector('.pv-kids-quick'))return;const b=document.createElement('button');b.className='pv-kids-quick';b.textContent='👶 Niños';b.onclick=openPanel;q.insertBefore(b,q.firstChild)}
  // API pública
  window.PalabraVivaNinos = {
    open: openPanel,
    openStory: (title, opts) => {
      const story = STORIES.find(s => s.title === title);
      if (story) openDetail(story, opts || {});
    },
    stories: () => STORIES.slice(),
    audioFor: (title) => (AUDIO_MAP[title] || []).slice(),
    findStory: (title) => STORIES.find(s => s.title === title) || null
  };
  function boot(){css();document.querySelectorAll('.pv-kids-fab,.pv-kids-fab-old').forEach(e=>e.remove());addHome();addQuick()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();window.addEventListener('load',boot);setInterval(boot,2500);
})();
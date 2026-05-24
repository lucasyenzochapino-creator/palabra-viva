(() => {
  // ===========================================================================
  // PALABRA VIVA — Historia bíblica completa (panel detallado)
  // ===========================================================================
  // Cuando el usuario toca "Leer historia completa" desde la línea del tiempo,
  // se abre este panel con narrativa expandida, contexto histórico, versículos
  // clave, significado y aplicación práctica.

  const STORIES = {
    'Dios crea el mundo': {
      emoji: '🌍',
      year: 'En el principio',
      ref: 'Génesis 1-2',
      intro: 'Antes de que existiera el tiempo, ya estaba Dios. Y de la nada, con su palabra, hizo nacer todo lo que vemos y lo que no vemos.',
      narrative: [
        'En el principio, todo era oscuridad y vacío. No había estrellas, ni mares, ni animales, ni personas. Solo estaba Dios, eterno y bueno. Entonces Dios dijo: "Sea la luz". Y fue la luz. Así comenzó la creación del universo.',
        'Durante seis días, Dios fue dando forma al mundo. El primer día separó la luz de la oscuridad: nació el día y la noche. El segundo día creó el cielo. El tercero, separó las aguas y aparecieron los continentes; cubrió la tierra de plantas, árboles y frutos.',
        'El cuarto día puso el sol para iluminar el día, la luna y las estrellas para alumbrar la noche. El quinto día llenó los mares de peces y el cielo de aves. El sexto día hizo los animales terrestres: leones, ovejas, hormigas, todos.',
        'Pero faltaba algo especial. Dios dijo: "Hagamos al hombre a nuestra imagen". Y creó al primer ser humano, Adán, del polvo de la tierra, soplando vida en él. Después, de su costado, formó a Eva, la primera mujer. Les dio el huerto del Edén para cuidar, y les bendijo.',
        'Al terminar, Dios vio todo lo que había hecho, y era bueno en gran manera. El séptimo día descansó. No porque estuviera cansado, sino para enseñarnos a detenernos y disfrutar lo que Él hizo.'
      ],
      context: 'El libro de Génesis (que significa "origen") fue escrito por Moisés hace unos 3.500 años. Los capítulos 1 y 2 no son un manual científico, sino la revelación de QUIÉN creó todo y POR QUÉ. La Biblia afirma que Dios existió antes del tiempo y que todo lo creado tiene propósito.',
      keyVerses: [
        { ref: 'Génesis 1:1',  text: 'En el principio creó Dios los cielos y la tierra.' },
        { ref: 'Génesis 1:27', text: 'Y creó Dios al hombre a su imagen, a imagen de Dios lo creó; varón y hembra los creó.' },
        { ref: 'Génesis 1:31', text: 'Y vio Dios todo lo que había hecho, y he aquí que era bueno en gran manera.' }
      ],
      meaning: 'No somos un accidente. Cada persona fue pensada, querida y diseñada por un Dios que es Padre. La creación es buena, los seres humanos somos especiales (a imagen de Dios), y todo tiene sentido porque hay un Creador detrás.',
      application: 'Cuidá el mundo que recibimos como regalo. Tratá a cada persona con dignidad (incluso al que te cae mal — también fue creado a imagen de Dios). Y descansá el día séptimo: Dios mismo lo hizo, y nos enseñó a parar para no convertirnos en máquinas.',
      audioKey: 'Dios crea el mundo'
    },

    'Adán y Eva': {
      emoji: '🍎', year: 'Al principio', ref: 'Génesis 3',
      intro: 'Los primeros seres humanos vivían en perfecta amistad con Dios — hasta que decidieron desobedecer.',
      narrative: [
        'Dios había puesto a Adán y Eva en el huerto del Edén, un lugar precioso lleno de árboles con frutos. Solo había una regla: no comer del árbol del conocimiento del bien y del mal. "Porque el día que comieres de él, ciertamente morirás", les advirtió Dios.',
        'Pero la serpiente, llena de astucia, se acercó a Eva y plantó una duda: "¿En verdad Dios les dijo eso? Si comen del fruto, serán como Dios". Eva miró el fruto, le pareció agradable, lo comió. Y le dio también a Adán, que comió.',
        'Inmediatamente sus ojos se abrieron. Por primera vez sintieron vergüenza, miedo, culpa. Se escondieron de Dios cuando lo oyeron caminar en el huerto. Dios los llamó: "¿Dónde estás?". No porque no supiera, sino para que ellos reconocieran lo que habían hecho.',
        'Las consecuencias fueron duras: el dolor entró al mundo, el trabajo se volvió fatigoso, la relación con Dios se rompió. Los sacó del huerto. Pero antes — y este es el corazón de la historia — Dios prometió algo: "Pondré enemistad entre tu descendencia y la mujer; ésta te herirá en la cabeza". Esa es la primera promesa de un Salvador.',
        'Adán y Eva salieron del Edén. Pero no salieron solos: salieron con la promesa de que Dios no los abandonaría. Y siglos después, esa promesa se cumplió en Jesús.'
      ],
      context: 'Esta historia explica el origen del mal en el mundo: no viene de Dios, sino de la elección humana de querer ser "como Dios" en vez de confiar en Él. Esta caída afecta a toda la humanidad — todos nacemos heridos por ese pecado original. Pero también es el primer evangelio (proto-evangelio): Dios promete restauración desde el primer momento.',
      keyVerses: [
        { ref: 'Génesis 3:6',  text: 'Y vio la mujer que el árbol era bueno para comer... tomó de su fruto, y comió.' },
        { ref: 'Génesis 3:15', text: 'Y pondré enemistad entre ti y la mujer, y entre tu simiente y la simiente suya; ésta te herirá en la cabeza, y tú le herirás en el calcañar.' },
        { ref: 'Romanos 5:12', text: 'Como el pecado entró en el mundo por un hombre, y por el pecado la muerte, así la muerte pasó a todos.' }
      ],
      meaning: 'El pecado no es solo "portarse mal": es desconfiar de Dios y querer construir vida sin Él. Las consecuencias son reales (vergüenza, miedo, muerte). Pero también lo es la gracia: Dios viene a buscarnos aún cuando nos escondemos.',
      application: 'Cuando hagas algo malo, no te escondas de Dios. Acercate, contale. La sangre de Jesús cubre lo que Adán rompió. La pregunta "¿Dónde estás?" sigue resonando: Dios te busca, no para condenarte sino para restaurarte.',
      audioKey: 'Adán y Eva en el jardín'
    },

    'Noé y el diluvio': {
      emoji: '🚢', year: 'Hace ~4000 años', ref: 'Génesis 6-9',
      intro: 'Cuando la humanidad se volvió tan corrupta que cada pensamiento era malo, Dios eligió a Noé para empezar de nuevo.',
      narrative: [
        'Generaciones después de Adán, la maldad llenó la tierra. Las personas hacían lo que querían sin pensar en Dios ni en otros. La violencia era constante. Dios miró todo y sintió tristeza profunda — "se arrepintió de haber hecho hombre en la tierra, y le dolió en su corazón".',
        'Pero había un hombre justo: Noé. Caminaba con Dios. Dios le habló: "Voy a destruir esto. Construí un arca enorme, salvate vos, tu familia y dos de cada especie animal".',
        'Noé tenía unos 500 años cuando empezó. Durante décadas construyó un barco gigante en tierra seca, mientras los vecinos se reían: "Mirá al loco, ¿para qué un barco si no hay mar?". Pero Noé obedecía, día tras día.',
        'Cuando llegó el momento, entraron al arca él, su esposa, sus tres hijos con sus esposas, y las parejas de animales. Dios cerró la puerta. Llovió durante 40 días y 40 noches. Las aguas del cielo y del subsuelo cubrieron todo. La humanidad pereció.',
        'Pasaron meses. Cuando las aguas bajaron, el arca encalló en los montes de Ararat. Noé esperó pacientemente. Soltó una paloma; al tercer intento volvió con una rama de olivo verde — había vida nueva. Al salir, lo primero que hizo Noé fue construir un altar y adorar a Dios.',
        'Dios prometió: "Nunca más destruiré la tierra con diluvio". Y puso un arcoiris en el cielo como señal del pacto. Cada vez que lo veas, recordá: Dios cumple sus promesas.'
      ],
      context: 'El diluvio aparece en muchas culturas antiguas (sumerios, babilonios, mayas), lo cual sugiere que fue un evento real con memoria universal. Bíblicamente representa: el juicio de Dios contra el mal, su gracia salvadora a través de un remanente fiel, y el pacto incondicional de no destruir más así.',
      keyVerses: [
        { ref: 'Génesis 6:8',  text: 'Pero Noé halló gracia ante los ojos de Jehová.' },
        { ref: 'Génesis 7:5',  text: 'E hizo Noé conforme a todo lo que le mandó Jehová.' },
        { ref: 'Génesis 9:13', text: 'Mi arco he puesto en las nubes, el cual será por señal del pacto entre mí y la tierra.' },
        { ref: '1 Pedro 3:20-21', text: 'La paciencia de Dios esperaba en los días de Noé... ocho personas fueron salvadas por agua. El bautismo que corresponde a esto ahora nos salva.' }
      ],
      meaning: 'El arca prefigura a Cristo: como Noé y su familia se salvaron entrando al arca, hoy somos salvos entrando en Jesús. La obediencia de Noé enseña que la fe se demuestra haciendo lo que Dios pide aunque nadie más entienda.',
      application: 'Construí tu "arca" antes de que llueva. Decisiones diarias de cercanía con Dios (oración, Biblia, comunidad) son las tablas que te sostienen cuando vienen tormentas. Y cuando veas un arcoiris, paralo a recordar: Dios cumple lo que promete.',
      audioKey: 'Noé y el arca'
    },

    'Torre de Babel': {
      emoji: '🏗️', year: 'Hace ~4000 años', ref: 'Génesis 11',
      intro: 'Cuando la humanidad quiso ser más grande que Dios construyendo un monumento al orgullo, todo terminó en confusión.',
      narrative: [
        'Después del diluvio, los descendientes de Noé hablaban un solo idioma y vivían en la llanura de Sinar (lo que hoy es Irak). Eran muchos y empezaron a planear: "Edifiquemos una ciudad y una torre cuya cúspide llegue al cielo. Hagámonos un nombre".',
        'Querían hacerse famosos, juntos, en oposición a Dios. No para honrarlo, sino para reemplazarlo. Hacían ladrillos cocidos, brea por mortero. La torre crecía.',
        'Dios bajó a ver. No porque no supiera, sino para mostrar que aún el proyecto más alto del hombre, Dios tiene que bajar a mirarlo. Vio el orgullo, el deseo de unidad sin Él. Y dijo: "Confundamos su lengua, para que ninguno entienda al otro".',
        'De pronto, los obreros se miraron y no se entendían. Cada grupo hablaba un idioma distinto. La construcción se detuvo. Se dispersaron por la tierra en familias y pueblos.',
        'La ciudad se llamó Babel — que significa "confusión". Allí nacieron las naciones, los idiomas, las culturas. Pero también nació una pregunta: ¿cómo volvería Dios a unir a las personas? La respuesta llegó muchos siglos después: en Pentecostés, cuando el Espíritu Santo les permitió a los apóstoles hablar en muchos idiomas para anunciar a Jesús. La torre dividió. El evangelio reúne.'
      ],
      context: 'Babel está en la base de la actual Babilonia, en Irak. Las torres mesopotámicas llamadas "zigurats" eran templos escalonados — los babilonios efectivamente querían "llegar al cielo" con sus altares. La historia critica el orgullo de cualquier proyecto humano que pretenda no necesitar a Dios.',
      keyVerses: [
        { ref: 'Génesis 11:4',  text: 'Edifiquémonos una ciudad y una torre, cuya cúspide llegue al cielo; y hagámonos un nombre.' },
        { ref: 'Génesis 11:9',  text: 'Por esto fue llamado el nombre de ella Babel, porque allí confundió Jehová el lenguaje de toda la tierra.' },
        { ref: 'Hechos 2:6',    text: 'Estaban confusos, porque cada uno les oía hablar en su propia lengua.' }
      ],
      meaning: 'Construir "torres" para hacernos un nombre — sin Dios — siempre termina en confusión. Pero Dios, en Pentecostés, revierte Babel: el Espíritu Santo permite que personas de todas las lenguas oigan el evangelio en su propio idioma.',
      application: '¿Qué torre estás construyendo? Carrera, redes sociales, fama, dinero. Si no incluye a Dios, es Babel. La invitación es construir CON Dios, no SIN Él. Lo que se hace para Su nombre, no para el propio, dura.',
      audioKey: 'La torre de Babel'
    },

    'Dios llama a Abraham': {
      emoji: '⭐', year: '~2000 a.C.', ref: 'Génesis 12-15',
      intro: 'Un hombre de 75 años escuchó a Dios decirle: "Salí de tu tierra". Y se fue, sin saber a dónde. Así nació el pueblo de Dios.',
      narrative: [
        'Abram vivía en Ur de los caldeos, una ciudad rica del antiguo Irak. Tenía esposa, Saraí, pero no tenían hijos — y eso, en su cultura, era doloroso. Era un hombre acomodado, con casa y rebaños.',
        'Un día Dios le habló: "Vete de tu tierra, de tu parentela y de la casa de tu padre, a la tierra que te mostraré. Y haré de ti una nación grande, y te bendeciré, y serán benditas en ti todas las familias de la tierra".',
        'Abram tenía 75 años. La mayoría a esa edad ya no se mueve. Pero salió. Cruzó desiertos sin GPS, sin saber el destino. Llegó a Canaán (lo que hoy es Israel) y Dios le dijo: "Esta tierra será para tu descendencia".',
        'Pero pasaron los años y Saraí seguía sin hijos. Abram dudó: "¿Cómo voy a tener descendencia si no tengo ni un hijo?". Dios lo sacó de noche y le dijo: "Mira el cielo. Cuenta las estrellas si podés. Así será tu descendencia". Y Abram creyó. Le contaron eso por justicia.',
        'Dios cambió su nombre a Abraham ("padre de multitud") y de Saraí a Sara. A los 100 años, milagrosamente, Sara dio a luz a Isaac. La promesa se cumplió. Y a través de Isaac, Jacob, las doce tribus, hasta llegar a Jesús — descendiente directo de Abraham. "Padre de la fe", lo llama el Nuevo Testamento.'
      ],
      context: 'Abraham vivió ~2000 años antes de Cristo. De él nacen las tres grandes religiones monoteístas (judaísmo, cristianismo, islam). Su historia inicia el "pueblo escogido" — no por mérito de Abraham, sino por gracia de Dios que elige iniciar Su plan de salvación a través de una sola familia.',
      keyVerses: [
        { ref: 'Génesis 12:1-3', text: 'Vete de tu tierra... y haré de ti una nación grande, y te bendeciré... y serán benditas en ti todas las familias de la tierra.' },
        { ref: 'Génesis 15:6',   text: 'Y creyó a Jehová, y le fue contado por justicia.' },
        { ref: 'Hebreos 11:8',   text: 'Por la fe Abraham, siendo llamado, obedeció para salir al lugar que había de recibir por herencia; y salió sin saber a dónde iba.' }
      ],
      meaning: 'La fe es salir cuando Dios te llama, sin tener todo claro. Abraham no era perfecto (mintió, dudó, falló), pero confiaba en Dios. Por su fe lo declararon "justo" — no por sus obras. Aquí empieza el evangelio: somos salvos por fe.',
      application: 'Si Dios te llama a moverte (cambiar trabajo, romper con algo malo, comprometerte con alguien, ir a misiones), no esperes verlo todo claro antes de salir. La fe se hace en el camino. Y si dudás como Abraham, mirá el cielo: Dios cumple lo que promete.',
      audioKey: 'Abraham y la promesa'
    },

    'José en Egipto': {
      emoji: '👔', year: '~1900 a.C.', ref: 'Génesis 37-50',
      intro: 'Lo traicionaron sus hermanos, lo vendieron como esclavo, lo metieron preso. Y Dios usó todo eso para salvar a millones del hambre.',
      narrative: [
        'José era el hijo favorito de Jacob, el undécimo de doce hermanos. Su padre le regaló una túnica de muchos colores, lo cual generó envidia. Para empeorar, José tenía sueños donde gobernaba sobre sus hermanos. Ellos lo odiaban.',
        'Un día, los hermanos lo vieron venir solo al campo. Lo agarraron, lo arrojaron a un pozo, después lo vendieron como esclavo a mercaderes que iban a Egipto. Llevaron la túnica manchada de sangre al padre Jacob, que pensó: "Mi hijo murió devorado por una fiera".',
        'En Egipto, José fue comprado por Potifar, capitán de la guardia del Faraón. Dios estaba con él. Trabajó honestamente y Potifar lo puso a cargo de toda su casa. Pero la esposa de Potifar quiso seducirlo. José se negó: "¿Cómo voy a pecar contra Dios?". Ella lo acusó falsamente y José fue a prisión.',
        'En la cárcel, José interpretó sueños de dos funcionarios reales. Años después, el Faraón tuvo sueños extraños y nadie podía interpretarlos. Lo trajeron a José. Dios le dio sabiduría: "Vienen 7 años de abundancia y 7 de hambre. Hay que guardar comida". El Faraón quedó tan impresionado que lo nombró segundo del reino.',
        'Cuando llegó la hambruna, gente de todos lados venía a Egipto a comprar alimento — incluida la familia de José. Sus hermanos vinieron sin reconocerlo. Después de probarlos, José se reveló llorando: "Yo soy José, vuestro hermano". Y dijo las palabras más sanadoras de la Biblia: "Vosotros pensasteis mal contra mí, mas Dios lo encaminó a bien".',
        'Perdonó a sus hermanos, llevó a su padre Jacob a Egipto. Toda la familia se salvó del hambre. Y Dios usó la maldad humana para preservar el linaje del que un día nacería Jesús.'
      ],
      context: 'La historia de José ocupa más de un cuarto del Génesis (caps. 37-50). Es uno de los relatos más cinematográficos de la Biblia. Egipto era la potencia mundial de la época, y un hebreo esclavo llegando a ser segundo del Faraón era casi imposible — excepto si Dios estaba detrás.',
      keyVerses: [
        { ref: 'Génesis 39:2',  text: 'Mas Jehová estaba con José, y fue varón próspero.' },
        { ref: 'Génesis 50:20', text: 'Vosotros pensasteis mal contra mí, mas Dios lo encaminó a bien, para hacer lo que vemos hoy, para mantener en vida a mucho pueblo.' },
        { ref: 'Romanos 8:28',  text: 'Sabemos que a los que aman a Dios, todas las cosas les ayudan a bien.' }
      ],
      meaning: 'Dios no causa el mal, pero lo redime. Lo que parecía destrucción (esclavitud, cárcel injusta) era el camino que Dios usaba para salvación. La historia de José es la historia de toda vida cristiana: a través de heridas, Dios escribe propósito.',
      application: 'Lo que te hicieron mal no es la última palabra. Como José, podés elegir perdonar y dejar que Dios reescriba la historia. Y en cada cárcel injusta o pozo del que no podés salir, recordá: Dios sigue con vos. La promoción puede venir desde el lugar más oscuro.',
      audioKey: 'José y sus hermanos'
    },

    'Moisés es salvado': {
      emoji: '🧺', year: '~1450 a.C.', ref: 'Éxodo 1-4',
      intro: 'Una mamá puso a su bebé en una canastita en el Nilo para salvarlo. La princesa lo encontró y lo crió como hijo. Era Moisés.',
      narrative: [
        'Pasaron 400 años desde José. Los hebreos, descendientes de Abraham, se habían multiplicado en Egipto. El nuevo faraón los temió y los esclavizó. Ordenó matar a todo bebé varón hebreo recién nacido — los tiraban al Nilo.',
        'Una mujer hebrea, Jocabed, dio a luz a un bebé hermoso. Lo escondió tres meses, pero ya no podía. Hizo una arquilla de juncos, la cubrió con brea para impermeabilizar, puso al bebé adentro y la dejó entre los juncos del río. Su hija mayor, Miriam, miraba desde lejos.',
        'La princesa de Egipto, hija del Faraón, bajó a bañarse al río. Vio la arquilla. La abrió, vio al niño llorando, sintió compasión: "Es un niño de los hebreos". Miriam corrió: "¿Querés que llame a una nodriza para cuidarlo?". La princesa aceptó. Miriam trajo a su propia madre, Jocabed. La princesa le pagaba a Jocabed para criar a su propio hijo.',
        'Cuando el niño creció, lo llevaron al palacio. La princesa lo adoptó. Le puso por nombre "Moisés" — "porque lo saqué de las aguas". Moisés creció como príncipe de Egipto, pero sabiendo que era hebreo.',
        'A los 40 años, vio a un egipcio golpear a un hebreo. Sintió ira y lo mató. Tuvo que huir al desierto, donde pasó 40 años más cuidando ovejas. Cuando ya no esperaba nada, Dios se le apareció en una zarza que ardía sin consumirse: "Yo soy el Dios de Abraham, Isaac y Jacob. He visto el sufrimiento de mi pueblo. Te envío al Faraón para sacarlos de Egipto".',
        'Moisés tenía 80 años. Dijo: "¿Quién soy yo para ir?". Dios respondió: "Yo estaré contigo". Y así empezó la liberación más grande de la historia bíblica.'
      ],
      context: 'Egipto era la superpotencia mundial. Los hebreos eran ~2 millones esclavos. La historia de Moisés conecta el AT antiguo (patriarcas) con el AT central (pueblo de Israel, Ley, profetas). Moisés escribió los primeros 5 libros de la Biblia (Pentateuco).',
      keyVerses: [
        { ref: 'Éxodo 2:10', text: 'Cuando el niño creció, ella lo trajo a la hija de Faraón, la cual lo prohijó, y le puso por nombre Moisés.' },
        { ref: 'Éxodo 3:14', text: 'Y respondió Dios a Moisés: YO SOY EL QUE SOY.' },
        { ref: 'Hebreos 11:24-25', text: 'Por la fe Moisés, hecho ya grande, rehusó llamarse hijo de la hija de Faraón, escogiendo antes ser maltratado con el pueblo de Dios.' }
      ],
      meaning: 'Dios prepara liberadores en los lugares menos esperados. Una mamá pobre, una princesa, una canasta en el río — y nace el libertador. Cuando Dios va a sacarnos de algo, primero pone gente, recursos, momentos en su lugar, sin que lo veamos.',
      application: 'Si te sentís pequeño o inútil para lo que Dios te llama, recordá Moisés. Dios no busca al más capacitado — busca al disponible. Su "yo estaré contigo" vale más que tu currículum.',
      audioKey: 'Moisés en el río'
    },

    'Salida de Egipto': {
      emoji: '🌊', year: '~1450 a.C.', ref: 'Éxodo 7-14',
      intro: 'Dios envió diez plagas y abrió el mar Rojo para que su pueblo escapara de la esclavitud. La liberación más grande del Antiguo Testamento.',
      narrative: [
        'Moisés volvió a Egipto con su hermano Aarón. Se presentaron al Faraón: "Jehová dice: deja ir a mi pueblo". El Faraón se burló: "¿Quién es Jehová? No conozco a Jehová y no dejaré ir a Israel".',
        'Dios envió las plagas, una tras otra. El agua del Nilo se volvió sangre. Vinieron ranas por todos lados. Mosquitos. Moscas. Murieron los ganados. Úlceras. Granizo. Langostas. Tres días de oscuridad total.',
        'El Faraón a veces cedía y después se arrepentía. Tras cada plaga endurecía su corazón. La última plaga fue terrible: murieron todos los primogénitos de Egipto — pero los hebreos se salvaron porque marcaron sus puertas con la sangre del cordero pascual. Esa noche el Faraón los dejó ir.',
        'Salieron unos 2 millones de personas con sus rebaños. Dios los guiaba con una columna de nube de día y de fuego de noche. Pero el Faraón se arrepintió otra vez y mandó su ejército. Los alcanzaron en la orilla del mar Rojo. Atrás los caballos egipcios, adelante el mar.',
        'El pueblo se asustó. Moisés dijo: "No temáis; estad firmes, y ved la salvación que Jehová hará". Levantó la vara, sopló un viento poderoso y el mar se partió en dos. Caminaron por tierra seca entre dos muros de agua.',
        'Cuando los egipcios los persiguieron al medio del mar, Dios cerró las aguas. El ejército faraónico se ahogó. Israel quedó libre, del otro lado, cantando alabanza a Dios. Esa noche se llama Pascua, "paso" — Dios pasó sobre las casas marcadas con sangre y libró a su pueblo.'
      ],
      context: 'La Pascua judía (Pésaj) celebra este evento cada año. Conecta directamente con la Pascua cristiana: Jesús es el "cordero de Dios" cuya sangre nos libra de la muerte eterna, así como la sangre del cordero pascual libró a los hebreos. La cruzada del mar Rojo es figura del bautismo (1 Corintios 10:1-2).',
      keyVerses: [
        { ref: 'Éxodo 14:14',  text: 'Jehová peleará por vosotros, y vosotros estaréis tranquilos.' },
        { ref: 'Éxodo 14:21',  text: 'Hizo Jehová que el mar se retirase por recio viento... y las aguas quedaron divididas.' },
        { ref: '1 Corintios 5:7', text: 'Nuestra pascua, que es Cristo, ya fue sacrificada por nosotros.' }
      ],
      meaning: 'Dios libra a su pueblo. Cuando no hay salida aparente (mar adelante, ejército atrás), Dios abre un camino donde no había. La sangre del cordero (Cristo) es lo único que nos libra del juicio.',
      application: 'Estés en qué Egipto estés (adicción, depresión, relación tóxica, deuda), Dios libera. No con magia barata, sino respondiendo al clamor. Marcá tu vida con la sangre de Cristo y ve cómo el "ejército" del pasado se ahoga a tus espaldas.',
      audioKey: 'Cruzando el mar Rojo'
    },

    'Los diez mandamientos': {
      emoji: '📜', year: '~1450 a.C.', ref: 'Éxodo 19-20',
      intro: 'En el monte Sinaí, Dios le dio a Moisés diez palabras que serían el corazón del Antiguo Testamento.',
      narrative: [
        'A los tres meses de salir de Egipto, el pueblo llegó al desierto del Sinaí y acampó frente al monte. Dios llamó a Moisés a subir. Truenos, relámpagos, una nube espesa, sonido de trompeta poderoso. El pueblo tembló al pie del monte.',
        'Dios habló desde el monte y dijo: "Yo soy Jehová tu Dios, que te saqué de la tierra de Egipto, de casa de servidumbre". Y dio las diez palabras (mandamientos):',
        '1. No tendrás dioses ajenos delante de mí.\n2. No te harás imagen para adorarla.\n3. No tomarás el nombre de Jehová en vano.\n4. Acuérdate del día de reposo para santificarlo.\n5. Honra a tu padre y a tu madre.',
        '6. No matarás.\n7. No cometerás adulterio.\n8. No robarás.\n9. No hablarás contra tu prójimo falso testimonio.\n10. No codiciarás lo que pertenece a tu prójimo.',
        'Los primeros cuatro son sobre la relación con Dios. Los otros seis, sobre la relación con las personas. Jesús los resumió en dos: "Amarás a Dios con todo tu corazón... y amarás a tu prójimo como a ti mismo".',
        'Moisés bajó del monte con dos tablas de piedra escritas por el dedo de Dios. Eran el pacto entre Dios y su pueblo. No son simples reglas — son la descripción de cómo es la vida cuando uno camina con Dios.'
      ],
      context: 'Los diez mandamientos son la base de la ética judeo-cristiana y de gran parte del derecho occidental. No son arbitrarios: protegen lo que más importa (vida, familia, propiedad, verdad). Jesús no los abolió, sino los profundizó: "Habéis oído que se dijo, pero yo os digo..." (Mateo 5).',
      keyVerses: [
        { ref: 'Éxodo 20:2-3',  text: 'Yo soy Jehová tu Dios, que te saqué de la tierra de Egipto. No tendrás dioses ajenos delante de mí.' },
        { ref: 'Mateo 22:37-40', text: 'Amarás al Señor tu Dios con todo tu corazón... y a tu prójimo como a ti mismo. De estos dos mandamientos dependen toda la ley y los profetas.' },
        { ref: 'Romanos 13:10',  text: 'El cumplimiento de la ley es el amor.' }
      ],
      meaning: 'La ley no salva, pero MUESTRA cómo es la vida según Dios. Es como un mapa: revela el camino correcto y también nos muestra cuánto nos desviamos. Por eso necesitamos a Cristo: no solo para perdonar, sino para darnos un corazón nuevo capaz de amar.',
      application: 'Repasá tu semana con los 10. ¿Le dediqué tiempo a Dios? ¿Honro a mis padres? ¿Mentí? ¿Envidié? No para sentirte aplastado, sino para volver al pie de la cruz y pedirle a Jesús que cambie tu corazón.',
      audioKey: 'Los diez mandamientos'
    },

    'David vence a Goliat': {
      emoji: '⚔️', year: '~1000 a.C.', ref: '1 Samuel 17',
      intro: 'Un chico pastor venció a un gigante con cinco piedras lisas y mucha fe en Dios. Después sería el rey más grande de Israel.',
      narrative: [
        'Los filisteos invadían Israel. Su campeón era Goliat: casi 3 metros de altura, armadura pesadísima, una espada inmensa. Durante 40 días desafiaba a Israel: "Mandadme un hombre para pelear conmigo. Si me vence, seremos vuestros esclavos. Si gano yo, ustedes serán nuestros".',
        'Nadie se animaba. Hasta el rey Saúl tenía miedo. David, el menor de ocho hermanos, era pastor. Su padre lo mandó a llevarle comida a sus hermanos soldados. Llegó al campamento, oyó las amenazas de Goliat, y se indignó: "¿Quién es este filisteo incircunciso para provocar al ejército del Dios viviente?".',
        'Le contaron a Saúl. David se ofreció: "Yo iré". El rey lo miró: "Sos un muchacho, él es guerrero desde su juventud". David respondió: "Tu siervo apacentaba las ovejas. Cuando venía un león o un oso, lo mataba. Este filisteo será como uno de ellos, porque ha provocado al Dios viviente".',
        'Saúl le ofreció su armadura. No le entró. David se la quitó, agarró su honda, eligió cinco piedras lisas del arroyo y fue al encuentro de Goliat.',
        'Goliat se rió: "¿Vienes a mí con palos como a un perro?". David respondió con palabras inmortales: "Tú vienes a mí con espada y lanza y jabalina; mas yo vengo a ti en el nombre de Jehová de los ejércitos, Dios de los escuadrones de Israel, a quien tú has provocado. Jehová te entregará hoy en mi mano".',
        'Corrió hacia el gigante. Sacó una piedra. La hondeó. La piedra voló y se clavó en la frente de Goliat. El gigante cayó de bruces. David corrió, le sacó la espada al gigante y le cortó la cabeza. Los filisteos huyeron. Israel ganó.'
      ],
      context: 'David nació en Belén, hijo de Isaí, descendiente de Rut. Tenía unos 17 años cuando mató a Goliat. Saúl era el rey, pero Dios ya había rechazado a Saúl y ungido secretamente a David. Después de muchas pruebas (incluida la persecución de Saúl), David sería el segundo rey de Israel y el más amado.',
      keyVerses: [
        { ref: '1 Samuel 17:45', text: 'Tú vienes a mí con espada y lanza y jabalina; mas yo vengo a ti en el nombre de Jehová de los ejércitos.' },
        { ref: '1 Samuel 17:47', text: 'No con espada y lanza salva Jehová; porque de Jehová es la batalla.' },
        { ref: '1 Samuel 16:7',  text: 'Jehová no mira lo que mira el hombre; pues el hombre mira lo que está delante de sus ojos, pero Jehová mira el corazón.' }
      ],
      meaning: 'La fuerza de David no estaba en su tamaño ni en su honda. Estaba en su Dios. Ningún gigante es demasiado grande para Dios. La piedra fue solo el instrumento; el verdadero arma era la fe.',
      application: '¿Cuál es tu Goliat? Una enfermedad, una deuda, un miedo, un vicio. Recordá: la batalla es del Señor. Tu trabajo es elegir las 5 piedras (oración, Biblia, comunidad, obediencia, fe) y correr hacia el gigante. Dios apunta la piedra.',
      audioKey: 'David y Goliat'
    },

    'Salomón el sabio': {
      emoji: '👑', year: '~970 a.C.', ref: '1 Reyes 3',
      intro: 'Cuando Dios le ofreció lo que quisiera, no pidió dinero ni fama. Pidió sabiduría. Y Dios le dio sabiduría y mucho más.',
      narrative: [
        'David murió. Su hijo Salomón quedó como rey, muy joven. Una noche Dios se le apareció en sueños: "Pídeme lo que quieras que yo te dé".',
        'Salomón respondió con humildad: "Señor, soy joven y no sé cómo gobernar a este pueblo tan grande. Dame, pues, a tu siervo, corazón entendido para juzgar a tu pueblo, y para discernir entre lo bueno y lo malo".',
        'A Dios le encantó esa pregunta. "Porque no pediste para ti vida larga, ni riquezas, ni la vida de tus enemigos, sino que pediste inteligencia para oír juicio, he hecho conforme a tus palabras. Y aun te he dado las cosas que no pediste: riquezas y gloria, de tal manera que entre los reyes ninguno habrá como tú".',
        'Salomón se hizo famoso por su sabiduría. La reina de Sabá viajó miles de kilómetros para escucharlo. Construyó el Templo en Jerusalén, una obra arquitectónica espectacular. Escribió Proverbios, Eclesiastés y Cantares.',
        'Pero su historia tiene un lado triste. Con el tiempo se llenó de esposas extranjeras (700 esposas y 300 concubinas) que lo influyeron a adorar otros dioses. Su corazón se desvió. Dios le dijo: "Por esto rasgaré el reino y lo daré a tu siervo". Después de Salomón el reino se dividió en dos.',
        'Su vida enseña una verdad fuerte: la sabiduría que recibís cuando sos joven no te sirve si no la cuidás cuando sos viejo. Empezar bien no es suficiente; hay que terminar bien.'
      ],
      context: 'Salomón reinó 40 años (971-931 a.C.). Construyó el Primer Templo de Jerusalén, que fue el centro de adoración judía hasta su destrucción por Babilonia en 586 a.C. Es autor (total o parcialmente) de Proverbios, Eclesiastés y Cantares — tres libros sapienciales fundamentales.',
      keyVerses: [
        { ref: '1 Reyes 3:9',     text: 'Da, pues, a tu siervo corazón entendido para juzgar a tu pueblo, y para discernir entre lo bueno y lo malo.' },
        { ref: '1 Reyes 11:4',    text: 'Cuando Salomón era ya viejo, sus mujeres inclinaron su corazón tras dioses ajenos.' },
        { ref: 'Proverbios 9:10', text: 'El temor de Jehová es el principio de la sabiduría, y el conocimiento del Santísimo es la inteligencia.' }
      ],
      meaning: 'La verdadera sabiduría es pedirla a Dios y CUIDAR el corazón toda la vida. Salomón tuvo sabiduría sin igual, pero no la usó para vigilar su propio corazón. Esa es la trampa más peligrosa: ser sabio para los demás y necio para sí mismo.',
      application: 'Pedile a Dios sabiduría — sin temor de pedir, dice Santiago 1:5. Pero cuidá tu corazón cada día. Sabiduría sin obediencia constante termina en desastre. Empezar con Dios es fácil; perseverar con Él es lo que importa.',
      audioKey: 'Salomón y la sabiduría'
    },

    'El profeta Elías': {
      emoji: '🐦', year: '~870 a.C.', ref: '1 Reyes 17-19',
      intro: 'Un profeta solitario enfrentó a 450 profetas de Baal en un duelo de fuego — y ganó.',
      narrative: [
        'El reino del norte de Israel había caído bajo el rey Acab y la reina Jezabel, que adoraban a Baal e Asera. Mataron a los profetas de Dios. La fe verdadera parecía extinta.',
        'Pero Dios levantó a Elías. Le dijo a Acab: "No habrá lluvia en estos años, sino por mi palabra". Y dejó de llover. Tres años y medio de sequía.',
        'Dios cuidó a Elías. Lo escondió junto a un arroyo, y cuervos le traían pan y carne cada mañana y tarde. Cuando el arroyo se secó, Dios lo envió a una viuda pobre en Sarepta. El aceite y la harina de la viuda no se acabaron mientras duró la hambruna. El hijo de la viuda murió y Elías lo resucitó.',
        'Después de tres años, Elías retó a Acab a un duelo público en el monte Carmelo. 450 profetas de Baal contra Elías solo. Cada lado pondría un altar con un buey. El dios que respondiera con fuego del cielo sería el verdadero.',
        'Los profetas de Baal danzaron, gritaron, se cortaron, todo el día. Nada. Elías se burló: "Gritad más fuerte, quizás Baal está durmiendo". Después le tocó a Elías. Para que no hubiera trampa, mandó echar agua sobre el altar — tres veces. Todo empapado.',
        'Oró: "Jehová Dios de Abraham, de Isaac y de Israel, sea manifestado hoy que tú eres Dios en Israel". Cayó fuego del cielo. Consumió el buey, la leña, las piedras, el agua, todo. El pueblo cayó de rodillas: "¡Jehová es el Dios!". Esa misma tarde volvió la lluvia.',
        'Pero después del triunfo, Jezabel juró matarlo. Elías huyó cuarenta días al monte Horeb. Allí, en una cueva, deprimido, Dios le habló — no en viento fuerte, ni en terremoto, ni en fuego, sino en un silbo apacible y delicado. Lo reconfortó, le dio nueva misión.',
        'Al final de su vida, Elías no murió: subió al cielo en un torbellino, en un carro de fuego. Dejó a Eliseo como sucesor. Y mil años después, en el monte de la Transfiguración, apareció hablando con Jesús.'
      ],
      context: 'Elías es uno de los profetas más importantes del AT. Sin escribir libros, sus actos hablan. Junto con Moisés representa "la Ley y los Profetas" (los dos aparecen con Jesús en la Transfiguración). Su regreso es esperado para preparar la venida del Mesías — Juan el Bautista cumplió ese rol parcialmente.',
      keyVerses: [
        { ref: '1 Reyes 17:6',  text: 'Y los cuervos le traían pan y carne por la mañana, y pan y carne por la tarde; y bebía del arroyo.' },
        { ref: '1 Reyes 18:21', text: '¿Hasta cuándo claudicaréis vosotros entre dos pensamientos? Si Jehová es Dios, seguidle; y si Baal, id en pos de él.' },
        { ref: '1 Reyes 19:12', text: 'Y tras el fuego un silbo apacible y delicado.' },
        { ref: 'Santiago 5:17', text: 'Elías era hombre sujeto a pasiones semejantes a las nuestras, y oró fervientemente para que no lloviese, y no llovió.' }
      ],
      meaning: 'Dios sostiene a sus siervos en tiempos difíciles (cuervos, viuda). Hace milagros cuando hay valentía (fuego en Carmelo). Pero también consuela en la depresión (silbo apacible). No es una caricatura de "héroe espiritual": Elías tuvo crisis, miedo, ganas de morir. Y Dios lo acompañó en todo.',
      application: 'Después de un éxito espiritual puede venir el bajón más duro. No te asustes. Como Elías, comé, dormí, escuchá el silbo apacible. Dios no siempre se manifiesta en fuego: muchas veces es en susurro silencioso. Aprendé a escuchar el silencio.',
      audioKey: 'Elías y los cuervos'
    },

    'Jonás y el pez': {
      emoji: '🐳', year: '~750 a.C.', ref: 'Jonás 1-4',
      intro: 'Dios le pidió ir a Nínive. Jonás escapó por mar. Un pez gigante lo tragó. Tres días después salió, predicó, y Nínive se arrepintió.',
      narrative: [
        'Dios le habló a Jonás: "Ve a Nínive, esa gran ciudad, y predica contra ella, porque su maldad ha subido delante de mí". Nínive era la capital del imperio asirio, el enemigo más cruel de Israel. Jonás no quería ir — porque sabía que Dios era misericordioso y temía que Nínive se arrepintiera y fuera perdonada.',
        'Entonces hizo lo contrario: se fue al puerto de Jope, pagó pasaje en un barco rumbo a Tarsis (España), en dirección opuesta a Nínive. Pensó que podía huir de Dios.',
        'En el mar, Dios envió una tempestad terrible. El barco estaba por hundirse. Los marineros oraban a sus dioses. Jonás dormía abajo. El capitán lo despertó: "¡Levántate y clama a tu Dios!". Echaron suertes para ver por quién venía el problema. Cayó sobre Jonás.',
        'Él confesó: "Soy hebreo, temo a Jehová Dios del cielo, que hizo el mar y la tierra. Estoy huyendo de Él. Tírenme al mar y se calmará". Los marineros no querían matar a nadie, pero la tormenta empeoraba. Al final lo tiraron. El mar se calmó al instante.',
        'Dios había preparado un gran pez que tragó a Jonás. Tres días y tres noches estuvo en su vientre. Allí, en la oscuridad, Jonás oró: "Desde mi angustia clamé a Jehová, y él me oyó". El pez lo vomitó en la playa.',
        'Dios le volvió a hablar: "Anda, ve a Nínive". Esta vez Jonás obedeció. Recorrió la ciudad gritando: "De aquí a cuarenta días Nínive será destruida". Increíblemente, desde el rey hasta el último mendigo, toda la ciudad se arrepintió. Ayunaron, lloraron, cambiaron de vida. Dios los perdonó.',
        'Jonás se enojó. Quería verlos destruidos. Salió al desierto a quejarse. Dios hizo crecer una calabacera que lo cubría del sol, después la hizo secar. Jonás se enfureció. Dios le habló: "Tuviste lástima de una planta. ¿Y yo no tendré lástima de Nínive, con 120.000 personas?". Allí termina el libro. Sin respuesta de Jonás. La pregunta queda flotando para nosotros.'
      ],
      context: 'Jonás es un libro corto (4 capítulos) pero profundo. Es uno de los pocos profetas que predica fuera de Israel. Su historia es citada por Jesús como señal: "Como estuvo Jonás tres días y tres noches en el vientre del pez, así estará el Hijo del Hombre en el corazón de la tierra" (Mateo 12:40) — anuncio de la muerte y resurrección.',
      keyVerses: [
        { ref: 'Jonás 1:3',  text: 'Y Jonás se levantó para huir de la presencia de Jehová a Tarsis.' },
        { ref: 'Jonás 2:2',  text: 'Invoqué en mi angustia a Jehová, y él me oyó.' },
        { ref: 'Jonás 4:11', text: '¿Y no tendré yo piedad de Nínive, aquella gran ciudad donde hay más de ciento veinte mil personas?' },
        { ref: 'Mateo 12:40',text: 'Como estuvo Jonás en el vientre del gran pez tres días y tres noches, así estará el Hijo del Hombre en el corazón de la tierra.' }
      ],
      meaning: 'No se puede huir de Dios. Pero Su misericordia es mayor que nuestros prejuicios. Jonás pensaba que Nínive no merecía perdón — Dios pensaba diferente. La historia critica el corazón religioso que no quiere que Dios sea bueno con "los malos".',
      application: '¿Hay personas que vos no querrías que Dios salve? Pensá en eso. Si Cristo murió por todos, nosotros no podemos elegir a quién se le predica el evangelio. La Nínive de hoy puede ser tu vecino difícil, el familiar tóxico, el ex que te lastimó. Dios los ama también.',
      audioKey: 'Jonás y el pez grande'
    },

    'Jesús nace en Belén': {
      emoji: '⭐', year: 'Año 0', ref: 'Lucas 2',
      intro: 'En un establo de Belén, en la noche más silenciosa de la historia, Dios se hizo bebé.',
      narrative: [
        'El emperador romano Augusto ordenó un censo. Cada persona tenía que ir a registrarse a su ciudad natal. José, descendiente del rey David, salió de Nazaret hacia Belén con su esposa María, embarazada de nueve meses.',
        'El viaje fue largo y duro — unos 150 km a pie y burro. Cuando llegaron a Belén, la ciudad estaba llena. No había lugar en el mesón. Una posada los recibió, pero solo en el establo donde guardaban los animales.',
        'Allí, en un pesebre (comedero de animales), nació Jesús. María lo envolvió en pañales y lo acostó. No hubo cuna real, ni doctores, ni familia alrededor. Solo el ruido de animales, el olor del establo, dos padres cansados y un bebé que era Dios hecho carne.',
        'Esa misma noche, en el campo cercano, unos pastores cuidaban sus ovejas. De repente apareció un ángel rodeado de gloria. Los pastores se aterrorizaron. El ángel dijo: "No temáis; os doy nuevas de gran gozo: hoy os ha nacido un Salvador, que es Cristo el Señor, en la ciudad de David. Lo hallaréis envuelto en pañales, acostado en un pesebre".',
        'De pronto se unieron al ángel muchas voces angelicales: "¡Gloria a Dios en las alturas, y en la tierra paz, buena voluntad para con los hombres!".',
        'Los pastores corrieron a Belén. Encontraron al bebé tal como les habían dicho. Lo adoraron. Volvieron contando todo a quien encontraban. María guardó todas estas cosas, meditándolas en su corazón.',
        'Más tarde, sabios del oriente (los "magos") siguieron una estrella hasta encontrarlo. Lo adoraron y le ofrecieron oro, incienso y mirra. Pero el rey Herodes, celoso, ordenó matar a todos los niños de Belén. José, avisado por un ángel en sueños, huyó con María y Jesús a Egipto. Volvieron años después a Nazaret.'
      ],
      context: 'La fecha del 25 de diciembre fue elegida en el siglo IV — la fecha exacta del nacimiento es desconocida. Jesús nació probablemente entre 6 y 4 a.C. (el calendario actual tiene un error). Belén significa "casa de pan" — el lugar donde nació "el Pan de vida". Era una pequeña aldea, pero el profeta Miqueas (700 años antes) había predicho que de allí saldría el gobernante de Israel.',
      keyVerses: [
        { ref: 'Lucas 2:11',    text: 'Os ha nacido hoy, en la ciudad de David, un Salvador, que es Cristo el Señor.' },
        { ref: 'Juan 1:14',     text: 'Y aquel Verbo fue hecho carne, y habitó entre nosotros, y vimos su gloria.' },
        { ref: 'Filipenses 2:7', text: 'Se despojó a sí mismo, tomando forma de siervo, hecho semejante a los hombres.' },
        { ref: 'Miqueas 5:2',   text: 'Pero tú, Belén Efrata, pequeña para estar entre las familias de Judá, de ti me saldrá el que será Señor en Israel.' }
      ],
      meaning: 'El Dios infinito eligió nacer como bebé pobre, en un establo, en un pueblo perdido. Nada de poder externo, nada de imponer. Vino en humildad para mostrar que el reino de Dios opera al revés: el primero es el último, el grande se hace pequeño.',
      application: 'Si Dios eligió un pesebre, no tenés que tener "todo en orden" para que entre a tu vida. Vino al lugar más simple. Hoy puede entrar a tu corazón aunque esté hecho un desastre. Dejá que nazca en vos — esa es la verdadera Navidad.',
      audioKey: 'Jesús nace en Belén'
    },

    'Jesús enseña y sana': {
      emoji: '🤝', year: '~Año 30', ref: 'Evangelios',
      intro: 'Tres años caminando, enseñando, sanando, perdonando. Mostrando con palabras y obras cómo es realmente el corazón del Padre.',
      narrative: [
        'A los 30 años, Jesús se bautizó en el Jordán por Juan el Bautista. El cielo se abrió, el Espíritu bajó como paloma, una voz dijo: "Este es mi Hijo amado, en quien tengo complacencia". Comenzó su ministerio público.',
        'Eligió a doce discípulos: pescadores, cobrador de impuestos, fanáticos políticos, pescadores otra vez. Gente común. Los entrenó tres años caminando con Él. Llamó a Pedro, Andrés, Santiago, Juan, Felipe, Bartolomé, Mateo, Tomás, Santiago el menor, Tadeo, Simón y Judas Iscariote.',
        'Predicaba sobre el Reino de Dios — un reino que ya estaba presente y todavía vendría plenamente. Usaba parábolas: historias sencillas con sentido profundo. El sembrador, la oveja perdida, el hijo pródigo, el buen samaritano, la perla preciosa.',
        'Sus enseñanzas dieron vuelta lo establecido. "Bienaventurados los pobres, los que lloran, los mansos". "Amen a sus enemigos". "El primero será el último". "Si te golpean una mejilla, pon la otra". Era radical. Indignaba a los religiosos y atraía a los pecadores.',
        'Hizo milagros: dio vista a ciegos, oído a sordos, palabras a mudos. Resucitó a la hija de Jairo, al hijo de la viuda de Naín, a Lázaro. Sanó leprosos, paralíticos, epilépticos. Multiplicó panes y peces para 5000 personas. Calmó tormentas con su palabra. Caminó sobre el agua.',
        'Pero también perdonaba. A la mujer adúltera dijo: "Ni yo te condeno; vete, y no peques más". A Zaqueo el cobrador deshonesto le entró a la casa. A los niños los abrazó cuando los discípulos querían echarlos. Los religiosos lo criticaban: "Come con publicanos y pecadores". Jesús respondía: "Los sanos no necesitan médico, sino los enfermos. No he venido a llamar justos, sino pecadores".'
      ],
      context: 'El ministerio público de Jesús duró aproximadamente 3 años, principalmente en Galilea (norte de Israel) con visitas a Jerusalén. Los cuatro Evangelios (Mateo, Marcos, Lucas y Juan) cubren ese período. Juan dice que si se escribiera todo lo que hizo, los libros no cabrían en el mundo.',
      keyVerses: [
        { ref: 'Marcos 1:15', text: 'El tiempo se ha cumplido, y el reino de Dios se ha acercado; arrepentíos, y creed en el evangelio.' },
        { ref: 'Mateo 5:3-4', text: 'Bienaventurados los pobres en espíritu, porque de ellos es el reino de los cielos. Bienaventurados los que lloran, porque ellos recibirán consolación.' },
        { ref: 'Juan 10:10',  text: 'Yo he venido para que tengan vida, y para que la tengan en abundancia.' },
        { ref: 'Mateo 11:28', text: 'Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.' }
      ],
      meaning: 'Jesús no vino a fundar una religión. Vino a mostrar cómo es el Padre. Cada milagro, cada parábola, cada conversación es una ventana al corazón de Dios. El reino que predica no es geográfico — es lo que pasa cuando Dios reina en un corazón.',
      application: 'Leé los Evangelios despacio. Imaginate las escenas. ¿Qué Jesús cambia cuando lo conocés realmente? El de las imágenes pop "lindas" no es el Jesús de los Evangelios. El verdadero te confronta, te abraza, te perdona, te llama. Te invita a seguirlo, no a admirarlo.',
      audioKey: 'Jesús ama a los niños'
    },

    'Cinco panes y dos peces': {
      emoji: '🍞', year: '~Año 32', ref: 'Juan 6',
      intro: 'Cinco mil personas con hambre. Cinco panes y dos peces. Cuando Jesús da gracias, lo poco alcanza para todos.',
      narrative: [
        'Jesús había cruzado el mar de Galilea para descansar con sus discípulos. Pero la gente lo siguió en multitudes. Lo veían sanar, oían sus palabras y querían más. Al final del día, había 5.000 hombres (más mujeres y niños — probablemente 15.000 personas en total) en un lugar desierto.',
        'Estaban hambrientos. Jesús miró a sus discípulos y le preguntó a Felipe (para probarlo): "¿De dónde compraremos pan para que coman estos?". Felipe calculó: "Doscientos denarios de pan no bastan para que cada uno tome un poco".',
        'Andrés acercó a un niño. "Aquí hay un muchacho que tiene cinco panes de cebada y dos pescaditos; mas ¿qué es esto para tantos?". Era la merienda del chico. La trajo, se la entregó al maestro.',
        'Jesús hizo recostar a la gente en grupos de cincuenta sobre la hierba. Tomó los cinco panes, miró al cielo, dio gracias y los partió. Empezó a repartir. Algo imposible empezó a pasar: el pan no se acababa. Y el pescado tampoco. La gente comió hasta saciarse.',
        'Cuando terminaron, Jesús dijo: "Recoged los pedazos que sobraron, para que no se pierda nada". Llenaron doce cestas. Más sobras que comida original.',
        'La gente quería hacerlo rey por la fuerza. Pero Jesús se retiró solo a orar al monte. Al día siguiente les explicó: "Vosotros me buscáis no porque visteis las señales, sino porque comisteis pan y os saciasteis. Yo soy el pan de vida; el que a mí viene, nunca tendrá hambre".',
        'No querían un mesías político que les diera comida cada día. Querían eso. Cuando Jesús dijo "yo soy el pan", muchos se fueron. Es el mensaje que sigue dividiendo: ¿buscás a Dios por lo que da, o por quién es?'
      ],
      context: 'Este es el único milagro (aparte de la resurrección) que aparece en los CUATRO evangelios — su importancia es central. Jesús prefigura la Eucaristía: tomar pan, dar gracias, partir, dar. Esos cuatro verbos se repetirán en la Última Cena.',
      keyVerses: [
        { ref: 'Juan 6:11',  text: 'Tomó Jesús aquellos panes, y habiendo dado gracias, repartió a los discípulos, y los discípulos a los que estaban recostados.' },
        { ref: 'Juan 6:35',  text: 'Yo soy el pan de vida; el que a mí viene, nunca tendrá hambre.' },
        { ref: 'Juan 6:12',  text: 'Recoged los pedazos que sobraron, para que no se pierda nada.' }
      ],
      meaning: 'Jesús puede multiplicar lo poco que damos. La merienda de un chico alcanza para 15.000 si Él la bendice. No despreciés "lo poco" que tenés — entregalo a Cristo. Él se encarga del milagro.',
      application: '¿Qué cinco panes y dos peces tenés? Tiempo limitado, plata escasa, talento "chico". Llevalos a Jesús. Él los multiplica. Pero solo da gracias y parte: vos tenés que poner lo que tenés en sus manos.',
      audioKey: 'Cinco panes y dos peces'
    },

    'Jesús resucita a Lázaro': {
      emoji: '🌿', year: '~Año 33', ref: 'Juan 11',
      intro: 'Su amigo Lázaro había muerto hacía cuatro días. Jesús lloró. Después lo llamó por su nombre. Y Lázaro salió de la tumba.',
      narrative: [
        'Lázaro vivía en Betania (cerca de Jerusalén) con sus hermanas Marta y María. Eran amigos íntimos de Jesús. Lázaro enfermó gravemente. Las hermanas mandaron mensaje urgente: "Señor, he aquí el que amas está enfermo".',
        'Jesús, al oírlo, dijo: "Esta enfermedad no es para muerte, sino para gloria de Dios". Y se quedó dos días más donde estaba. Cuando finalmente fue a Betania, Lázaro llevaba cuatro días muerto en la tumba.',
        'Marta corrió a recibirlo. Le dijo, casi reprochándole: "Señor, si hubieses estado aquí, mi hermano no habría muerto". Jesús respondió: "Tu hermano resucitará". Marta pensó que hablaba de la resurrección final.',
        'Jesús dijo entonces palabras que cambiaron la historia: "Yo soy la resurrección y la vida; el que cree en mí, aunque esté muerto, vivirá. ¿Crees esto?". Marta respondió: "Sí, Señor; yo he creído que tú eres el Cristo, el Hijo de Dios".',
        'María vino. Lloraba. Cuando Jesús vio su llanto y el de los que la acompañaban, "se estremeció en espíritu y se conmovió". Pidió ver la tumba. Y entonces dice el versículo más corto de la Biblia: "Jesús lloró". Dios mismo lloró frente a la muerte de su amigo, aunque sabía que en minutos iba a resucitarlo.',
        'Llegaron al sepulcro: una cueva con una piedra grande encima. "Quitad la piedra", ordenó Jesús. Marta dudó: "Señor, hiede ya, porque es de cuatro días". Jesús: "¿No te he dicho que si crees, verás la gloria de Dios?".',
        'Quitaron la piedra. Jesús levantó los ojos al cielo, dio gracias al Padre, y con voz potente gritó: "¡Lázaro, ven fuera!". Y Lázaro salió de la tumba con las vendas en los pies, las manos y la cara. Jesús ordenó: "Desatadle, y dejadle ir".',
        'Muchos creyeron al verlo. Otros fueron a contárselo a los enemigos de Jesús. Desde ese día, los sacerdotes decidieron matarlo. Resucitar a Lázaro fue la señal final que confirmó quién era Jesús — y la que aceleró su propia muerte.'
      ],
      context: 'Es el séptimo y último gran "signo" en el Evangelio de Juan. Marca el clímax: después de Lázaro, viene la Pasión. Jesús sabía que resucitar a Lázaro lo llevaría a su propia muerte — pero igual lo hizo, por amor a sus amigos.',
      keyVerses: [
        { ref: 'Juan 11:25', text: 'Yo soy la resurrección y la vida; el que cree en mí, aunque esté muerto, vivirá.' },
        { ref: 'Juan 11:35', text: 'Jesús lloró.' },
        { ref: 'Juan 11:43-44', text: 'Habiendo dicho esto, clamó a gran voz: ¡Lázaro, ven fuera! Y el que había muerto salió.' }
      ],
      meaning: 'Jesús es más fuerte que la muerte. Pero antes de mostrarlo, llora. Dios no es indiferente a nuestro dolor; siente con nosotros. Y aun cuando todo parece terminado (cuatro días en la tumba, ya hiede), Él tiene poder para hacer salir vida.',
      application: '¿Qué cosa "muerta" hay en tu vida? Un sueño, una relación, una vocación, esperanza. Llevala a Jesús aunque "ya hieda". Él llora con vos, pero también puede llamar lo muerto por su nombre y hacerlo salir. La piedra que parece definitiva, se mueve.',
      audioKey: 'Jesús resucita a Lázaro'
    },

    'Muere por nosotros': {
      emoji: '✝️', year: '~Año 33', ref: 'Juan 18-19',
      intro: 'En la cruz, Jesús cargó con nuestros pecados, perdonó a sus enemigos y abrió el camino al Padre para todos.',
      narrative: [
        'La noche del jueves Jesús cenó con sus discípulos. Lavó sus pies, instituyó la Cena del Señor (pan y vino como memorial), oró largamente por ellos. Fue al huerto de Getsemaní a orar.',
        'Allí sudó gotas como sangre, suplicando al Padre: "Si es posible, pase de mí esta copa; pero no se haga mi voluntad, sino la tuya". Llegó Judas con soldados y lo arrestaron. Los discípulos huyeron. Pedro lo negó tres veces antes que cantara el gallo.',
        'Lo llevaron ante el Sanedrín. Lo acusaron de blasfemia por decirse Hijo de Dios. Lo enviaron a Pilato (el gobernador romano), después a Herodes, otra vez a Pilato. Pilato lo encontró sin culpa, pero la multitud gritaba "¡Crucifícale!". Cedió por miedo político.',
        'Lo azotaron. Le pusieron una corona de espinas. Lo escupieron, lo golpearon, se burlaron: "Si eres Hijo de Dios, bájate de la cruz". Le cargaron una cruz pesada y caminó por las calles de Jerusalén hasta el Calvario (también llamado Gólgota, "lugar de la calavera").',
        'Lo clavaron con clavos en las manos y los pies. Entre dos criminales. Desde la cruz dijo siete palabras famosas, entre ellas: "Padre, perdónalos, porque no saben lo que hacen". A su madre María le encomendó al apóstol Juan. A un ladrón a su lado le prometió el paraíso.',
        'Al mediodía el sol se oscureció. La tierra tembló. El velo del Templo (que separaba al hombre del Lugar Santísimo) se rasgó de arriba abajo. Jesús gritó: "Padre, en tus manos encomiendo mi espíritu". Inclinó la cabeza. Dijo: "Consumado es". Y entregó su espíritu.',
        'Era el viernes santo a las 3 de la tarde. Su cuerpo fue bajado, envuelto en lienzos y puesto en una tumba prestada. Pusieron una piedra grande, soldados de guardia. Sus discípulos huyeron destrozados, escondidos. Parecía el final.'
      ],
      context: 'La crucifixión era el método de ejecución más cruel del imperio romano, reservado para esclavos y peores criminales. Que el Hijo de Dios eligiera morir así demuestra hasta dónde fue el amor. Todo el AT prefigura este momento: el cordero pascual, el chivo expiatorio, las profecías de Isaías 53 (el Siervo Sufriente).',
      keyVerses: [
        { ref: 'Juan 3:16',     text: 'Tanto amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.' },
        { ref: 'Isaías 53:5',   text: 'Mas él herido fue por nuestras rebeliones, molido por nuestros pecados; el castigo de nuestra paz fue sobre él, y por su llaga fuimos nosotros curados.' },
        { ref: 'Lucas 23:34',   text: 'Padre, perdónalos, porque no saben lo que hacen.' },
        { ref: 'Juan 19:30',    text: 'Consumado es.' }
      ],
      meaning: 'En la cruz, Jesús pagó la deuda que vos no podías pagar. Tomó tu castigo. El velo del Templo rasgado significa que ya nada nos separa del Padre — podemos acercarnos directamente por la sangre de Cristo.',
      application: 'No minimicés lo que costó tu perdón. La cruz no es decoración: es el precio de tu paz con Dios. Cuando peques, no corras a la culpa: corré a la cruz. Allí ya está pagado. Aceptá ese perdón, no como derecho sino como regalo enorme.',
      audioKey: 'Jesús muere por nosotros'
    },

    '¡Jesús vive!': {
      emoji: '🌅', year: '~Año 33', ref: 'Mateo 28, Juan 20',
      intro: 'Al tercer día la tumba estaba vacía. Jesús resucitó. Está vivo hoy. Y por Él, también nosotros viviremos.',
      narrative: [
        'El sábado entero los discípulos estuvieron encerrados, llorando, sin entender. María Magdalena, María (madre de Santiago) y otras mujeres habían comprado especias para embalsamar el cuerpo. Al amanecer del domingo, fueron a la tumba.',
        'En el camino se preguntaban: "¿Quién nos removerá la piedra?". Pero cuando llegaron, la piedra estaba corrida. Entraron. La tumba estaba vacía. Solo los lienzos del cuerpo, doblados con orden. Un ángel resplandeciente les dijo: "¿Por qué buscáis entre los muertos al que vive? No está aquí; ha resucitado. Recordad lo que os dijo cuando aún estaba en Galilea".',
        'María Magdalena corrió a contarle a Pedro y Juan. Ellos fueron corriendo a la tumba. Encontraron todo como había contado. Juan creyó. Pedro quedó pensativo.',
        'María se quedó llorando afuera de la tumba. Vio a alguien que pensó era el jardinero. Le dijo: "Señor, si tú te lo has llevado, dime dónde lo has puesto". El hombre la llamó por su nombre: "¡María!". Era Jesús. Lo reconoció. Cayó a sus pies.',
        'Ese mismo domingo, Jesús se apareció a dos discípulos camino a Emaús. Después a Pedro. A la tarde, a los once apóstoles reunidos: "Paz a vosotros". Tomás no estaba. Cuando le contaron, dijo: "Si no veo en sus manos la señal de los clavos, no creeré".',
        'Ocho días después, Jesús apareció de nuevo. Le dijo a Tomás: "Pon aquí tu dedo, y mira mis manos; y acerca tu mano, y métela en mi costado; y no seas incrédulo, sino creyente". Tomás cayó: "¡Señor mío, y Dios mío!". Jesús respondió: "Porque me has visto, has creído; bienaventurados los que no vieron, y creyeron".',
        'Durante 40 días Jesús se apareció a sus discípulos. Comió con ellos. Les explicó las Escrituras. Les dio la Gran Comisión: "Id, y haced discípulos a todas las naciones, bautizándolos en el nombre del Padre, del Hijo y del Espíritu Santo". Después subió al cielo en una nube. Mil testigos lo vieron.',
        'Cristo vive. Está sentado a la diestra del Padre. Volverá un día. Y porque Él vive, nosotros también viviremos.'
      ],
      context: 'La resurrección es el centro del cristianismo. Si Cristo no resucitó, dice Pablo, vuestra fe es vana (1 Corintios 15). Hay más de 500 testigos oculares según el NT. Los discípulos, antes cobardes, se volvieron mártires por proclamar esto. Solo un evento real explica ese cambio radical.',
      keyVerses: [
        { ref: 'Mateo 28:6',     text: 'No está aquí, pues ha resucitado, como dijo. Venid, ved el lugar donde fue puesto el Señor.' },
        { ref: 'Juan 20:29',     text: 'Bienaventurados los que no vieron, y creyeron.' },
        { ref: 'Romanos 6:9',    text: 'Cristo, habiendo resucitado de los muertos, ya no muere; la muerte no se enseñorea más de él.' },
        { ref: '1 Corintios 15:14', text: 'Si Cristo no resucitó, vana es entonces nuestra predicación, vana es también vuestra fe.' }
      ],
      meaning: 'La resurrección no es solo "Jesús volvió a la vida". Es la victoria sobre la muerte misma. Cambia todo: el pecado ya no tiene la última palabra, ni el sufrimiento, ni la tumba. La muerte no es el final.',
      application: 'Si Cristo vive, vos también vivís. Hoy y para siempre. La depresión, el miedo, la culpa — no son tu identidad. Sos hijo/a de un Dios que venció la muerte. Vivir como resucitado/a significa: no temer, no esconderse, anunciar a otros que la tumba está vacía.',
      audioKey: 'Jesús vive'
    }
  };

  // Mapeo títulos de timeline → claves de STORIES (algunos varían)
  const TITLE_MAP = {
    'Dios crea el mundo': 'Dios crea el mundo',
    'Adán y Eva': 'Adán y Eva',
    'Noé y el diluvio': 'Noé y el diluvio',
    'Torre de Babel': 'Torre de Babel',
    'Dios llama a Abraham': 'Dios llama a Abraham',
    'José en Egipto': 'José en Egipto',
    'Moisés es salvado': 'Moisés es salvado',
    'Salida de Egipto': 'Salida de Egipto',
    'Los diez mandamientos': 'Los diez mandamientos',
    'David vence a Goliat': 'David vence a Goliat',
    'Salomón el sabio': 'Salomón el sabio',
    'El profeta Elías': 'El profeta Elías',
    'Jonás y el pez': 'Jonás y el pez',
    'Jesús nace en Belén': 'Jesús nace en Belén',
    'Jesús enseña y sana': 'Jesús enseña y sana',
    'Cinco panes y dos peces': 'Cinco panes y dos peces',
    'Jesús resucita a Lázaro': 'Jesús resucita a Lázaro',
    'Muere por nosotros': 'Muere por nosotros',
    '¡Jesús vive!': '¡Jesús vive!'
  };

  function injectStyles() {
    if (document.getElementById('pv-hc-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-hc-style';
    st.textContent = `
      .pv-hc-panel{position:fixed;inset:0;z-index:1000030;background:var(--bg);color:var(--text);overflow-y:auto;padding:14px 14px calc(80px + env(safe-area-inset-bottom))}
      .pv-hc-inner{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:16px}
      .pv-hc-head{display:flex;justify-content:space-between;gap:10px;position:sticky;top:0;background:var(--bg);padding:8px 0 12px;z-index:5;border-bottom:1px solid var(--line)}
      .pv-hc-head h1{margin:4px 0;font-size:clamp(22px,5.5vw,28px);letter-spacing:-.02em;line-height:1.15}
      .pv-hc-head p{font-size:13px;color:var(--muted);margin:0;letter-spacing:.06em;text-transform:uppercase;font-family:var(--font-sans);font-weight:600}
      .pv-hc-close{border:1px solid var(--line);background:var(--card);color:var(--text);border-radius:999px;padding:9px 14px;font-weight:600;cursor:pointer;height:fit-content;font-size:13px}
      .pv-hc-hero{background:linear-gradient(135deg,var(--brand),var(--brand2));color:#fbf3df;border-radius:18px;padding:24px;text-align:center;position:relative;overflow:hidden}
      .pv-hc-hero .big-emoji{font-size:72px;line-height:1;margin:0 0 6px;filter:drop-shadow(0 4px 12px rgba(0,0,0,.25))}
      .pv-hc-hero h2{color:#fbf3df;margin:6px 0;font-size:24px;letter-spacing:-.01em}
      .pv-hc-hero .ref{display:inline-block;background:rgba(251,243,223,.18);padding:4px 12px;border-radius:999px;color:#fbf3df;font-size:12px;font-family:var(--font-sans);letter-spacing:.12em}
      .pv-hc-hero .year{font-size:12px;opacity:.85;margin-top:8px;text-transform:uppercase;letter-spacing:.16em;font-family:var(--font-sans)}
      .pv-hc-intro{font-family:var(--font-serif);font-style:italic;font-size:19px;line-height:1.55;color:var(--text);padding:16px 18px;background:var(--card);border-left:3px solid var(--brand);border-radius:8px}
      .pv-hc-section{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px 18px}
      .pv-hc-section h3{margin:0 0 10px;font-size:18px;color:var(--brand);font-family:var(--font-serif)}
      .pv-hc-section .pv-hc-narrative-p{font-size:16px;line-height:1.7;color:var(--text);margin:0 0 12px}
      .pv-hc-section .pv-hc-narrative-p:last-child{margin-bottom:0}
      .pv-hc-section .pv-hc-narrative-p:first-letter{font-family:var(--font-serif);font-size:32px;font-weight:600;color:var(--brand);float:left;line-height:0.9;padding:6px 6px 0 0}
      .pv-hc-context{background:rgba(164,119,49,.06);border:1px solid var(--accent);border-radius:14px;padding:14px 16px}
      .pv-hc-context h3{color:var(--accent)}
      .pv-hc-context p{margin:0;font-size:15px;line-height:1.6;color:var(--text)}
      .pv-hc-verses{display:flex;flex-direction:column;gap:10px}
      .pv-hc-verses .v{background:linear-gradient(135deg,rgba(107,31,31,.06),var(--card));border-left:3px solid var(--brand);padding:12px 14px;border-radius:8px}
      .pv-hc-verses .v-ref{font-size:11px;color:var(--brand);font-weight:700;letter-spacing:.16em;text-transform:uppercase;margin:0 0 4px;font-family:var(--font-sans)}
      .pv-hc-verses .v-text{margin:0;font-family:var(--font-serif);font-style:italic;font-size:16px;line-height:1.5;color:var(--text)}
      .pv-hc-meaning{background:rgba(90,111,72,.08);border:1px solid var(--good);border-radius:14px;padding:14px 16px}
      .pv-hc-meaning h3{color:var(--good)}
      .pv-hc-meaning p{margin:0;font-size:16px;line-height:1.65;color:var(--text)}
      .pv-hc-application{background:linear-gradient(135deg,rgba(164,119,49,.10),var(--card));border:1px solid var(--accent);border-radius:14px;padding:16px 18px}
      .pv-hc-application h3{color:var(--accent)}
      .pv-hc-application p{margin:0;font-size:16px;line-height:1.65;color:var(--text);font-weight:500}
      .pv-hc-audio{background:linear-gradient(135deg,#fef3c7,#fde68a);border:2px solid #b45309;border-radius:18px;padding:14px;display:flex;flex-direction:column;gap:10px;color:#27190c}
      .pv-hc-audio .lbl{font-weight:900;color:#92400e;font-size:14px}
      .pv-hc-audio audio{width:100%}
      .pv-hc-audio .status{font-size:12px;color:#7c4a1e;text-align:center;min-height:14px}
      .pv-hc-actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:8px}
      .pv-hc-btn{border:0;border-radius:999px;padding:12px 18px;font-weight:600;cursor:pointer;font-size:14px;min-height:44px;display:inline-flex;align-items:center;gap:8px;font-family:var(--font-sans)}
      .pv-hc-btn.primary{background:var(--brand);color:#fbf3df}
      .pv-hc-btn.ghost{background:var(--card);border:1px solid var(--line);color:var(--text)}
    `;
    document.head.appendChild(st);
  }

  function open(title, opts = {}) {
    const story = STORIES[title] || STORIES[TITLE_MAP[title]];
    if (!story) {
      // Fallback al kids panel si no hay historia completa para este título
      if (window.PalabraVivaNinos?.openStory) {
        window.PalabraVivaNinos.openStory(title, opts);
      }
      return;
    }
    document.querySelector('.pv-hc-panel')?.remove();
    injectStyles();
    history.pushState({ pvHC: true }, '', location.href.split('#')[0] + '#historia-completa');

    // URL de audio narrado (si existe)
    const audioUrl = story.audioKey && window.PalabraVivaNinos
      ? (window.PalabraVivaNinos.audioFor?.(story.audioKey) || [])[0]
      : null;

    const escapeHtml = s => (s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

    const panel = document.createElement('section');
    panel.className = 'pv-hc-panel';
    panel.setAttribute('aria-label', 'Historia completa: ' + title);
    panel.innerHTML = `
      <div class="pv-hc-inner">
        <div class="pv-hc-head">
          <div>
            <p>Historia bíblica completa</p>
            <h1>${escapeHtml(title)}</h1>
          </div>
          <button class="pv-hc-close" data-close>Cerrar ✕</button>
        </div>

        <div class="pv-hc-hero">
          <div class="big-emoji" aria-hidden="true">${story.emoji}</div>
          <span class="ref">${escapeHtml(story.ref)}</span>
          <p class="year">${escapeHtml(story.year)}</p>
        </div>

        <div class="pv-hc-intro">${escapeHtml(story.intro)}</div>

        ${audioUrl ? `
          <div class="pv-hc-audio">
            <div class="lbl">🎙️ Voz humana narrada — Oceano Multimedia</div>
            <audio class="pv-hc-player" controls preload="metadata" src="${audioUrl}"></audio>
            <div class="status">Tocá ▶ para escuchar la narración</div>
          </div>
        ` : ''}

        <div class="pv-hc-section">
          <h3>📖 La historia</h3>
          ${story.narrative.map(p => `<p class="pv-hc-narrative-p">${p.replace(/\n/g, '<br>')}</p>`).join('')}
        </div>

        ${story.context ? `
          <div class="pv-hc-context">
            <h3>🏛️ Contexto histórico</h3>
            <p>${escapeHtml(story.context)}</p>
          </div>
        ` : ''}

        ${story.keyVerses && story.keyVerses.length ? `
          <div class="pv-hc-section">
            <h3>✝️ Versículos clave</h3>
            <div class="pv-hc-verses">
              ${story.keyVerses.map(v => `
                <div class="v">
                  <p class="v-ref">${escapeHtml(v.ref)}</p>
                  <p class="v-text">"${escapeHtml(v.text)}"</p>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${story.meaning ? `
          <div class="pv-hc-meaning">
            <h3>💡 Significado profundo</h3>
            <p>${escapeHtml(story.meaning)}</p>
          </div>
        ` : ''}

        ${story.application ? `
          <div class="pv-hc-application">
            <h3>🌱 Para tu vida hoy</h3>
            <p>${escapeHtml(story.application)}</p>
          </div>
        ` : ''}

        <div class="pv-hc-actions">
          <button class="pv-hc-btn primary" data-share>📤 Compartir historia</button>
          <button class="pv-hc-btn ghost" data-kids>👶 Versión para niños</button>
          <button class="pv-hc-btn ghost" data-close>← Volver</button>
        </div>
      </div>
    `;

    function close(useHistory = true) {
      window.removeEventListener('popstate', onPop);
      panel.remove();
      if (useHistory && location.hash === '#historia-completa') {
        window._pvPanelClosing = true;
        history.back();
      }
    }
    function onPop() {
      if (location.hash === '#historia-completa') return;
      window.removeEventListener('popstate', onPop);
      panel.remove();
    }
    panel.querySelectorAll('[data-close]').forEach(b => b.onclick = () => close(true));

    // Audio status
    const player = panel.querySelector('.pv-hc-player');
    const statusEl = panel.querySelector('.pv-hc-audio .status');
    if (player && statusEl) {
      player.addEventListener('loadedmetadata', () => {
        const d = Math.round(player.duration || 0);
        statusEl.textContent = `Duración: ${Math.floor(d/60)}:${String(d%60).padStart(2,'0')} — tocá ▶`;
      });
      player.addEventListener('playing', () => statusEl.textContent = '🔴 Reproduciendo');
      player.addEventListener('pause',   () => statusEl.textContent = '⏸ Pausado');
      player.addEventListener('ended',   () => statusEl.textContent = '✓ Terminó la narración');
      player.addEventListener('error',   () => statusEl.textContent = '⚠️ No se pudo cargar el audio');
    }

    // Compartir
    panel.querySelector('[data-share]').onclick = async () => {
      const text = `📖 ${title} — ${story.ref}\n\n${story.intro}\n\n✝️ Leé la historia completa en Palabra Viva:\n${location.origin}/`;
      try {
        if (navigator.share) await navigator.share({ title: title, text, url: location.origin + '/' });
        else if (navigator.clipboard) { await navigator.clipboard.writeText(text); alert('📋 Copiado.'); }
      } catch {}
    };

    // Versión kids — cierra HC primero, después abre detail kids
    // (mejor UX: no quedan apilados; back vuelve directo al timeline)
    panel.querySelector('[data-kids]').onclick = () => {
      console.log('[HC] Abrir versión kids:', story.audioKey, '— API:', !!window.PalabraVivaNinos?.openStory);
      if (!story.audioKey) {
        alert('No hay versión para niños de esta historia.');
        return;
      }
      if (!window.PalabraVivaNinos?.openStory) {
        alert('El módulo de niños no cargó. Recargá (Ctrl+Shift+R).');
        return;
      }
      // Cerrar HC primero (sin history.back para no romper la pila)
      window.removeEventListener('popstate', onPop);
      panel.remove();
      // Pequeño delay para asegurar que el remove se ve antes de abrir kids
      setTimeout(() => {
        window.PalabraVivaNinos.openStory(story.audioKey, { fromTimeline: true });
      }, 50);
    };

    document.body.appendChild(panel);
    window.addEventListener('popstate', onPop);
    window.scrollTo(0, 0);
  }

  window.PVHistoriaCompleta = { open, hasStory: (title) => !!(STORIES[title] || STORIES[TITLE_MAP[title]]) };
})();

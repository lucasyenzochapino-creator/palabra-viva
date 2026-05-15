(() => {
  const moods = [
    {
      id: 'ansiedad',
      label: 'Ansiedad / preocupación',
      words: ['ansioso','ansiosa','ansiedad','preocupado','preocupada','preocupacion','preocupación','nervioso','nerviosa','estresado','estresada','angustia','angustiado','angustiada','inquieto','inquieta','no puedo dormir','pensando mucho','sobrepasado','sobrepasada'],
      note: 'No tenés que cargar todo el futuro hoy. Empezá por entregarle a Dios lo que no podés controlar.',
      prayer: 'Señor, ordená mi mente y dame paz para este momento.',
      action: 'Respirá lento, nombrá lo que te preocupa y orá una frase simple.',
      verses: [
        ['Filipenses 4:6', 'Por nada estéis afanosos; sino sean notorias vuestras peticiones delante de Dios en toda oración y ruego.'],
        ['Mateo 6:34', 'Así que, no os congojéis por el día de mañana.'],
        ['1 Pedro 5:7', 'Echando toda vuestra solicitud en él, porque él tiene cuidado de vosotros.'],
        ['Juan 14:27', 'La paz os dejo, mi paz os doy: no como el mundo la da, yo os la doy.']
      ]
    },
    {
      id: 'miedo',
      label: 'Miedo / inseguridad',
      words: ['miedo','temor','asustado','asustada','panico','pánico','inseguro','insegura','me da miedo','tengo miedo','no me animo','amenaza','peligro'],
      note: 'El miedo puede hablar fuerte, pero no tiene la última palabra sobre tu vida.',
      prayer: 'Dios, acompañame y ayudame a no caminar dominado por el miedo.',
      action: 'Mandale un mensaje a alguien de confianza. No te aísles.',
      verses: [
        ['Isaías 41:10', 'No temas, porque yo soy contigo; no desmayes, porque yo soy tu Dios.'],
        ['Salmos 27:1', 'Jehová es mi luz y mi salvación: ¿de quién temeré?'],
        ['Salmos 46:1', 'Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.'],
        ['Salmos 91:2', 'Diré yo á Jehová: Esperanza mía, y castillo mío; mi Dios, en él confiaré.']
      ]
    },
    {
      id: 'tristeza',
      label: 'Tristeza / soledad',
      words: ['triste','tristeza','llorar','dolor','duelo','vacio','vacío','solo','sola','soledad','deprimido','deprimida','abandonado','abandonada','me siento mal','sin ganas','desanimado','desanimada'],
      note: 'Dios no desprecia tu dolor. No tenés que fingir que estás bien para acercarte a Él.',
      prayer: 'Señor, acercate a mi corazón y sosteneme hoy.',
      action: 'Hablá con una persona segura. No cargues esto solo.',
      verses: [
        ['Salmos 34:18', 'Cercano está Jehová á los quebrantados de corazón.'],
        ['Romanos 8:28', 'Y sabemos que á los que á Dios aman, todas las cosas les ayudan á bien.'],
        ['Juan 14:27', 'La paz os dejo, mi paz os doy: no como el mundo la da, yo os la doy.'],
        ['Mateo 11:28', 'Venid á mí todos los que estáis trabajados y cargados, que yo os haré descansar.']
      ]
    },
    {
      id: 'cansancio',
      label: 'Cansancio / desgaste',
      words: ['cansado','cansada','agotado','agotada','sin fuerzas','quemado','quemada','fundido','fundida','no puedo mas','no puedo más','exhausto','exhausta','harto','harta'],
      note: 'Jesús no te pide aparentar fuerza. Te invita a descansar en Él.',
      prayer: 'Señor, renová mis fuerzas y enseñame a parar a tiempo.',
      action: 'Hacé una pausa de cinco minutos sin pantalla.',
      verses: [
        ['Mateo 11:28', 'Venid á mí todos los que estáis trabajados y cargados, que yo os haré descansar.'],
        ['Isaías 40:31', 'Mas los que esperan á Jehová tendrán nuevas fuerzas.'],
        ['Salmos 23:1', 'Jehová es mi pastor; nada me faltará.'],
        ['Gálatas 6:9', 'No nos cansemos, pues, de hacer bien.']
      ]
    },
    {
      id: 'culpa',
      label: 'Culpa / perdón',
      words: ['culpa','culpable','falle','fallé','pecado','perdon','perdón','arrepentido','arrepentida','me equivoque','me equivoqué','verguenza','vergüenza','no merezco'],
      note: 'Dios no te llama para destruirte, sino para levantarte y corregir el camino.',
      prayer: 'Dios, ayudame a pedir perdón, reparar y empezar de nuevo.',
      action: 'Elegí una acción concreta para corregir lo que puedas corregir.',
      verses: [
        ['1 Juan 1:9', 'Si confesamos nuestros pecados, él es fiel y justo para que nos perdone nuestros pecados.'],
        ['2 Corintios 5:17', 'De modo que si alguno está en Cristo, nueva criatura es.'],
        ['Juan 3:16', 'Porque de tal manera amó Dios al mundo, que ha dado á su Hijo unigénito.'],
        ['Proverbios 3:5', 'Fíate de Jehová de todo tu corazón, y no estribes en tu prudencia.']
      ]
    },
    {
      id: 'direccion',
      label: 'Decisiones / dirección',
      words: ['decision','decisión','decidir','no se que hacer','no sé qué hacer','direccion','dirección','confundido','confundida','duda','dudas','camino','futuro','necesito guia','necesito guía'],
      note: 'No todas las respuestas llegan juntas. A veces Dios guía paso a paso.',
      prayer: 'Señor, dame sabiduría para elegir bien.',
      action: 'Anotá la decisión, pedí consejo sabio y no actúes por impulso.',
      verses: [
        ['Proverbios 3:5', 'Fíate de Jehová de todo tu corazón, y no estribes en tu prudencia.'],
        ['Santiago 1:5', 'Y si alguno de vosotros tiene falta de sabiduría, demándela á Dios.'],
        ['Juan 14:6', 'Yo soy el camino, y la verdad, y la vida.'],
        ['Salmos 27:1', 'Jehová es mi luz y mi salvación.']
      ]
    },
    {
      id: 'agradecimiento',
      label: 'Agradecimiento / alegría',
      words: ['agradecido','agradecida','gracias','feliz','contento','contenta','bendecido','bendecida','alegre','alegria','alegría','bien','en paz'],
      note: 'La gratitud también es una forma de fe: reconocer que no caminaste solo.',
      prayer: 'Gracias, Dios, por sostenerme y acompañarme.',
      action: 'Compartí una palabra de ánimo con alguien.',
      verses: [
        ['Salmos 23:1', 'Jehová es mi pastor; nada me faltará.'],
        ['Romanos 8:28', 'Todas las cosas les ayudan á bien.'],
        ['1 Timoteo 4:12', 'Ninguno tenga en poco tu juventud; pero sé ejemplo de los fieles.'],
        ['Juan 14:27', 'La paz os dejo, mi paz os doy.']
      ]
    },
    {
      id: 'empezar',
      label: 'Acercarme a Dios / Jesús',
      words: ['lejos de dios','no conozco a dios','no conozco a jesus','jesus','jesús','fe','creer','empezar','dios','quiero creer','quiero acercarme','no entiendo la biblia'],
      note: 'No necesitás entender todo para dar el primer paso. Empezá con una oración honesta.',
      prayer: 'Dios, si sos real, quiero conocerte. Guiame hacia Jesús.',
      action: 'Leé Juan 3 y después Juan 14, sin apuro.',
      verses: [
        ['Juan 14:6', 'Jesús le dice: Yo soy el camino, y la verdad, y la vida.'],
        ['Juan 3:16', 'Porque de tal manera amó Dios al mundo, que ha dado á su Hijo unigénito.'],
        ['2 Corintios 5:17', 'Si alguno está en Cristo, nueva criatura es.'],
        ['1 Juan 1:9', 'Él es fiel y justo para que nos perdone.']
      ]
    }
  ];

  function clean(text) {
    return (text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  function hash(text) {
    let h = 0;
    for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
    return h;
  }

  function pick(input, arr) {
    const seed = `${clean(input)}-${new Date().toDateString()}`;
    return arr[hash(seed) % arr.length];
  }

  function interpret(input) {
    const text = clean(input);
    const scored = moods.map(m => {
      let score = 0;
      m.words.forEach(w => {
        const key = clean(w);
        if (text === key) score += 10;
        else if (text.includes(key)) score += key.split(' ').length > 1 ? 6 : 3;
      });
      return { mood: m, score };
    }).sort((a, b) => b.score - a.score);
    const best = scored[0]?.score > 0 ? scored[0].mood : moods[0];
    const verse = pick(input || best.id, best.verses);
    return { mood: best, verse };
  }

  function render(box, input) {
    const { mood, verse } = interpret(input);
    box.innerHTML = `
      <p class="ref">${verse[0]}</p>
      <h3>${mood.label}</h3>
      <p class="verse">“${verse[1]}”</p>
      <p>${mood.note}</p>
      <p><strong>Oración:</strong> ${mood.prayer}</p>
      <p><strong>Acción pequeña:</strong> ${mood.action}</p>
      <p class="soft">Interpretado desde: “${input || mood.label}”</p>
    `;
  }

  function enhance() {
    document.querySelectorAll('.moodBox').forEach(box => {
      if (box.dataset.moodEnhanced === 'true') return;
      box.dataset.moodEnhanced = 'true';
      const input = box.querySelector('.moodInput');
      const result = box.querySelector('.moodResult');
      const mainButton = Array.from(box.querySelectorAll('button')).find(btn => btn.textContent?.includes('Buscar mi palabra'));
      if (!input || !result || !mainButton) return;

      const run = () => setTimeout(() => render(result, input.value), 30);
      mainButton.addEventListener('click', run);
      input.addEventListener('keydown', ev => {
        if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) run();
      });
      box.querySelectorAll('.chip').forEach(chip => chip.addEventListener('click', () => {
        setTimeout(() => render(result, chip.textContent || input.value), 40);
      }));
    });
  }

  setInterval(enhance, 700);
})();

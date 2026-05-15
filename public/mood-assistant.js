(() => {
  const moodData = [
    {
      keys: ['ansioso','ansiedad','preocupado','preocupada','nervioso','nerviosa','estresado','estresada','angustia','inquieto','inquieta'],
      title: 'Para cuando sentís ansiedad',
      ref: 'Filipenses 4:6',
      verse: 'Por nada estéis afanosos; sino sean notorias vuestras peticiones delante de Dios en toda oración y ruego.',
      note: 'No tenés que resolver todo hoy. Empezá por entregarle a Dios lo que no podés controlar.',
      prayer: 'Señor, ordená mi mente y dame paz para este momento.',
      action: 'Respirá lento, nombrá lo que te preocupa y orá una frase simple.'
    },
    {
      keys: ['miedo','temor','asustado','asustada','pánico','panico','inseguro','insegura'],
      title: 'Para cuando tenés miedo',
      ref: 'Isaías 41:10',
      verse: 'No temas, porque yo soy contigo; no desmayes, porque yo soy tu Dios.',
      note: 'El miedo puede hablar fuerte, pero no tiene la última palabra sobre tu vida.',
      prayer: 'Dios, acompañame y ayudame a no caminar dominado por el miedo.',
      action: 'Mandale un mensaje a alguien de confianza y no te aísles.'
    },
    {
      keys: ['triste','tristeza','llorar','dolor','duelo','vacío','vacio','solo','sola','deprimido','deprimida'],
      title: 'Para cuando te sentís triste o solo',
      ref: 'Salmos 34:18',
      verse: 'Cercano está Jehová á los quebrantados de corazón.',
      note: 'Dios no desprecia tu dolor. No tenés que fingir que estás bien para acercarte a Él.',
      prayer: 'Señor, acercate a mi corazón y sosteneme hoy.',
      action: 'Hablá con una persona segura. No cargues esto solo.'
    },
    {
      keys: ['cansado','cansada','agotado','agotada','sin fuerzas','quemado','quemada','fundido','fundida'],
      title: 'Para cuando estás cansado',
      ref: 'Mateo 11:28',
      verse: 'Venid á mí todos los que estáis trabajados y cargados, que yo os haré descansar.',
      note: 'Jesús no te pide aparentar fuerza. Te invita a descansar en Él.',
      prayer: 'Señor, renová mis fuerzas y enseñame a parar a tiempo.',
      action: 'Hacé una pausa de cinco minutos sin pantalla.'
    },
    {
      keys: ['culpa','culpable','fallé','falle','pecado','perdón','perdon','arrepentido','arrepentida'],
      title: 'Para cuando sentís culpa',
      ref: '1 Juan 1:9',
      verse: 'Si confesamos nuestros pecados, él es fiel y justo para que nos perdone nuestros pecados.',
      note: 'Dios no te llama para destruirte, sino para levantarte y corregir el camino.',
      prayer: 'Dios, ayudame a pedir perdón, reparar y empezar de nuevo.',
      action: 'Elegí una acción concreta para corregir lo que puedas corregir.'
    },
    {
      keys: ['decisión','decision','decidir','no sé qué hacer','no se que hacer','dirección','direccion','confundido','confundida'],
      title: 'Para cuando necesitás dirección',
      ref: 'Proverbios 3:5',
      verse: 'Fíate de Jehová de todo tu corazón, y no estribes en tu prudencia.',
      note: 'No todas las respuestas llegan juntas. A veces Dios guía paso a paso.',
      prayer: 'Señor, dame sabiduría para elegir bien.',
      action: 'Anotá la decisión, pedí consejo sabio y no actúes por impulso.'
    },
    {
      keys: ['agradecido','agradecida','gracias','feliz','contento','contenta','bendecido','bendecida'],
      title: 'Para cuando estás agradecido',
      ref: 'Salmos 23:1',
      verse: 'Jehová es mi pastor; nada me faltará.',
      note: 'La gratitud también es una forma de fe: reconocer que no caminaste solo.',
      prayer: 'Gracias, Dios, por sostenerme y acompañarme.',
      action: 'Compartí una palabra de ánimo con alguien.'
    },
    {
      keys: ['lejos de dios','no conozco a dios','no conozco a jesus','jesús','jesus','fe','creer','duda','dudas'],
      title: 'Para empezar a acercarte a Jesús',
      ref: 'Juan 14:6',
      verse: 'Jesús le dice: Yo soy el camino, y la verdad, y la vida.',
      note: 'No necesitás entender todo para dar el primer paso. Empezá con una oración honesta.',
      prayer: 'Dios, si sos real, quiero conocerte. Guiame hacia Jesús.',
      action: 'Leé Juan 3 y después Juan 14, sin apuro.'
    }
  ];

  const fallback = {
    title: 'Una palabra para este momento',
    ref: 'Juan 14:27',
    verse: 'La paz os dejo, mi paz os doy: no como el mundo la da, yo os la doy.',
    note: 'No pude interpretar exactamente lo que escribiste, pero esta palabra es un buen punto de partida.',
    prayer: 'Señor, hablame con claridad y dame paz.',
    action: 'Escribí con más detalle cómo te sentís o leé esta palabra en silencio.'
  };

  function clean(text) {
    return (text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function interpret(text) {
    const input = clean(text);
    if (!input.trim()) return fallback;
    return moodData.find(item => item.keys.some(key => input.includes(clean(key)))) || fallback;
  }

  function shareResult(result) {
    const text = `${result.ref}\n\n${result.verse}\n\n${result.note}\n\nCompartido desde Palabra Viva`;
    if (navigator.share) navigator.share({ title: result.ref, text });
    else navigator.clipboard.writeText(text).then(() => alert('Palabra copiada'));
  }

  function renderResult(box, result) {
    box.innerHTML = `
      <p class="pv-mood-ref">${result.ref}</p>
      <h3>${result.title}</h3>
      <p class="pv-mood-verse">“${result.verse}”</p>
      <p>${result.note}</p>
      <p><strong>Oración:</strong> ${result.prayer}</p>
      <p><strong>Acción pequeña:</strong> ${result.action}</p>
      <button class="pv-mood-share" type="button">Compartir esta palabra</button>
    `;
    box.querySelector('.pv-mood-share')?.addEventListener('click', () => shareResult(result));
  }

  function createWidget() {
    const widget = document.createElement('section');
    widget.className = 'card pv-mood-widget';
    widget.innerHTML = `
      <p class="pv-mood-ref">Sentir</p>
      <h3>¿Cómo te sentís hoy?</h3>
      <p class="pv-mood-muted">Escribilo con tus palabras y la app te muestra una palabra para ese momento.</p>
      <textarea class="pv-mood-input" rows="3" placeholder="Ej: me siento ansioso, cansado, triste, lejos de Dios..."></textarea>
      <div class="pv-mood-actions">
        <button type="button" data-mood="ansioso">Ansioso</button>
        <button type="button" data-mood="triste">Triste</button>
        <button type="button" data-mood="cansado">Cansado</button>
        <button type="button" data-mood="con miedo">Con miedo</button>
      </div>
      <button class="pv-mood-main" type="button">Buscar mi palabra</button>
      <div class="pv-mood-result"></div>
    `;
    const input = widget.querySelector('.pv-mood-input');
    const resultBox = widget.querySelector('.pv-mood-result');
    const run = () => renderResult(resultBox, interpret(input.value));
    widget.querySelector('.pv-mood-main')?.addEventListener('click', run);
    widget.querySelectorAll('[data-mood]').forEach(btn => btn.addEventListener('click', () => {
      input.value = btn.getAttribute('data-mood') || '';
      run();
    }));
    return widget;
  }

  function injectStyles() {
    if (document.getElementById('pv-mood-style')) return;
    const style = document.createElement('style');
    style.id = 'pv-mood-style';
    style.textContent = `
      .pv-mood-widget{border-color:rgba(236,72,153,.42);background:linear-gradient(135deg,rgba(236,72,153,.12),var(--card))}
      .pv-mood-ref{font-size:14px;color:var(--brand);font-weight:900;letter-spacing:.02em;text-transform:uppercase;margin:0 0 6px}
      .pv-mood-muted{color:var(--muted)}
      .pv-mood-input{width:100%;border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:18px;padding:14px;resize:vertical;outline:none;margin:8px 0 10px;font:inherit}
      .pv-mood-input::placeholder{color:var(--muted)}
      .pv-mood-actions{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}
      .pv-mood-actions button,.pv-mood-main,.pv-mood-share{border:1px solid var(--line);border-radius:999px;padding:9px 12px;font-weight:900;background:var(--card2);color:var(--text)}
      .pv-mood-main{background:linear-gradient(135deg,var(--brand),var(--brand2));color:white;border-color:transparent;width:100%;padding:12px;margin-bottom:12px}
      .pv-mood-result{border-top:1px solid var(--line);margin-top:12px;padding-top:12px}
      .pv-mood-result:empty{display:none}
      .pv-mood-result h3{margin-top:0}
      .pv-mood-verse{font-weight:700;font-size:calc(var(--font-size) + 1px)}
      .pv-mood-share{background:var(--card2)}
    `;
    document.head.appendChild(style);
  }

  function shouldInjectOnHome() {
    const h1 = document.querySelector('h1')?.textContent || '';
    return h1.includes('Una palabra para hoy');
  }

  function shouldInjectOnFeel() {
    const h1 = document.querySelector('h1')?.textContent || '';
    return h1.includes('Cómo te sentís') || h1.includes('Como te sentís');
  }

  function inject() {
    injectStyles();
    if (document.querySelector('.pv-mood-widget')) return;
    if (shouldInjectOnHome()) {
      const today = document.querySelector('.today');
      if (today?.parentElement) today.insertAdjacentElement('afterend', createWidget());
    } else if (shouldInjectOnFeel()) {
      const firstCard = document.querySelector('.stack .card');
      if (firstCard?.parentElement) firstCard.insertAdjacentElement('afterend', createWidget());
    }
  }

  setInterval(inject, 800);
})();

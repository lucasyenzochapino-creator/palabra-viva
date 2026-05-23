(() => {
  const words = [
    ['Salmos 23:1', 'Jehová es mi pastor; nada me faltará.'],
    ['Salmos 27:1', 'Jehová es mi luz y mi salvación: ¿de quién temeré?'],
    ['Salmos 34:18', 'Cercano está Jehová á los quebrantados de corazón.'],
    ['Salmos 46:1', 'Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.'],
    ['Salmos 55:22', 'Echa sobre Jehová tu carga, y él te sustentará.'],
    ['Salmos 91:2', 'Diré yo á Jehová: Esperanza mía, y castillo mío; mi Dios, en él confiaré.'],
    ['Salmos 118:24', 'Este es el día que hizo Jehová: nos gozaremos y alegraremos en él.'],
    ['Proverbios 3:5', 'Fíate de Jehová de todo tu corazón, y no estribes en tu prudencia.'],
    ['Isaías 40:31', 'Mas los que esperan á Jehová tendrán nuevas fuerzas.'],
    ['Isaías 41:10', 'No temas, porque yo soy contigo; no desmayes, porque yo soy tu Dios.'],
    ['Jeremías 29:11', 'Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal.'],
    ['Mateo 6:34', 'Así que, no os congojéis por el día de mañana.'],
    ['Mateo 11:28', 'Venid á mí todos los que estáis trabajados y cargados, que yo os haré descansar.'],
    ['Juan 3:16', 'Porque de tal manera amó Dios al mundo, que ha dado á su Hijo unigénito.'],
    ['Juan 14:6', 'Jesús le dice: Yo soy el camino, y la verdad, y la vida.'],
    ['Juan 14:27', 'La paz os dejo, mi paz os doy: no como el mundo la da, yo os la doy.'],
    ['Romanos 8:28', 'Y sabemos que á los que á Dios aman, todas las cosas les ayudan á bien.'],
    ['2 Corintios 5:17', 'De modo que si alguno está en Cristo, nueva criatura es.'],
    ['Filipenses 4:6', 'Por nada estéis afanosos; sino sean notorias vuestras peticiones delante de Dios en toda oración y ruego.'],
    ['Filipenses 4:13', 'Todo lo puedo en Cristo que me fortalece.'],
    ['1 Pedro 5:7', 'Echando toda vuestra solicitud en él, porque él tiene cuidado de vosotros.'],
    ['1 Juan 1:9', 'Si confesamos nuestros pecados, él es fiel y justo para que nos perdone nuestros pecados.'],
    ['1 Juan 4:18', 'En amor no hay temor; mas el perfecto amor echa fuera el temor.'],
    ['Apocalipsis 21:4', 'Y limpiará Dios toda lágrima de los ojos de ellos.']
  ];

  function slotIndex() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const day = Math.floor((now - start) / 86400000);
    const block = Math.floor(now.getHours() / 6); // 0, 1, 2, 3
    return (day * 4 + block) % words.length;
  }

  function periodName() {
    const h = new Date().getHours();
    if (h < 6) return 'madrugada';
    if (h < 12) return 'mañana';
    if (h < 18) return 'tarde';
    return 'noche';
  }

  function updateDailyWord() {
    const title = document.querySelector('h1')?.textContent || '';
    if (!title.includes('Una palabra para hoy')) return;
    const cards = Array.from(document.querySelectorAll('.card'));
    const dailyCard = cards.find(card => card.querySelector('.verse') && card.querySelector('.ref'));
    if (!dailyCard || dailyCard.dataset.sixHourWord === String(slotIndex())) return;

    const [ref, text] = words[slotIndex()];
    dailyCard.dataset.sixHourWord = String(slotIndex());
    const refEl = dailyCard.querySelector('.ref');
    const verseEl = dailyCard.querySelector('.verse');
    if (refEl) refEl.textContent = `${ref} · palabra de la ${periodName()}`;
    if (verseEl) verseEl.textContent = `“${text}”`;

    const shareBtn = Array.from(dailyCard.querySelectorAll('button')).find(b => b.textContent?.includes('Compartir'));
    if (shareBtn && !shareBtn.dataset.sixHourShare) {
      shareBtn.dataset.sixHourShare = 'true';
      shareBtn.addEventListener('click', ev => {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        const shareText = `${ref}\n\n${text}\n\nPalabra Viva`;
        if (navigator.share) navigator.share({ title: ref, text: shareText });
        else navigator.clipboard.writeText(shareText).then(() => alert('Palabra copiada'));
      }, true);
    }
  }

  setInterval(updateDailyWord, 3000);
  updateDailyWord();
})();

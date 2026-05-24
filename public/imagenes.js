(() => {
  // ===========================================================================
  // PALABRA VIVA — Biblioteca curada de imágenes cristianas reales
  // ===========================================================================
  // Fotografías de Unsplash (licencia libre, sin atribución requerida).
  // IDs estables, verificadas. CDN de Unsplash sirve resizes automáticos.

  // Mezcla Unsplash (Aaron Burden y otros verificados) + Wikimedia Commons
  // (arte clásico cristiano, dominio público).
  const UNSPLASH = 'https://images.unsplash.com/photo-';
  const UNSPLASH_PARAMS = '?w=600&q=80&auto=format&fit=crop';
  const WM = 'https://upload.wikimedia.org/wikipedia/commons/thumb/';

  // Mapeo temático → URL completa (verificadas manualmente)
  const IMAGES = {
    // Unsplash — fotos verificadas (Aaron Burden, etc.)
    bible_open:      UNSPLASH + '1504052434569-70ad5836ab65' + UNSPLASH_PARAMS,
    bible_stack:     UNSPLASH + '1532012197267-da84d127e765' + UNSPLASH_PARAMS,
    cross_sunset:    UNSPLASH + '1499728603263-13726abce5fd' + UNSPLASH_PARAMS,
    sunrise_hills:   UNSPLASH + '1518709268805-4e9042af9f23' + UNSPLASH_PARAMS,
    church_exterior: UNSPLASH + '1505236858219-8359eb29e329' + UNSPLASH_PARAMS,
    child_reading:   UNSPLASH + '1503454537195-1dcabb73ffb9' + UNSPLASH_PARAMS,
    calendar:        UNSPLASH + '1606327054629-64c8b0fd6e4f' + UNSPLASH_PARAMS,

    // Wikimedia Commons — arte clásico cristiano dominio público
    // Personajes bíblicos → Última Cena de Leonardo da Vinci
    stained_glass:   WM + '4/4b/%C3%9Altima_Cena_-_Da_Vinci_5.jpg/800px-%C3%9Altima_Cena_-_Da_Vinci_5.jpg',
    // Timeline → Creación de Adán de Miguel Ángel (Sistina)
    timeline_stone:  WM + '6/61/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg/800px-Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg',
    // Más opciones disponibles para usar
    last_supper:     WM + '4/4b/%C3%9Altima_Cena_-_Da_Vinci_5.jpg/800px-%C3%9Altima_Cena_-_Da_Vinci_5.jpg',
    creation_adam:   WM + '6/61/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg/800px-Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg',
    sistine_chapel:  WM + '0/0c/Cieling_of_the_Sistine_Chapel.jpg/800px-Cieling_of_the_Sistine_Chapel.jpg',
    good_shepherd:   WM + 'a/a5/Bernhard_Plockhorst_-_Good_Shephard.jpg/800px-Bernhard_Plockhorst_-_Good_Shephard.jpg',
    nativity_art:    WM + 'a/a0/Adoration_of_the_Shepherds_-_Murillo.jpg/800px-Adoration_of_the_Shepherds_-_Murillo.jpg'
  };

  // Función pública: obtener URL completa por clave temática
  function get(key) {
    return IMAGES[key] || null;
  }

  // CSS background-image listo para usar
  function bg(key) {
    const u = get(key);
    return u ? `url('${u}')` : '';
  }

  // Aplicar como hero-image a un elemento (insertando un div)
  function applyHero(parent, key) {
    if (!parent || parent.querySelector('.card-img-hero')) return;
    const u = get(key);
    if (!u) return;
    const div = document.createElement('div');
    div.className = 'card-img-hero';
    div.style.backgroundImage = `url('${u}')`;
    // Si la imagen no carga, ocultarla (no romper la card)
    const probe = new Image();
    probe.onerror = () => div.remove();
    probe.src = u;
    parent.insertBefore(div, parent.firstChild);
  }

  // Alternativa: header de color sólido con un emoji-icono grande
  // Útil cuando no encontramos una foto verificable que represente el tema.
  function applyColorHero(parent, emoji, variant) {
    if (!parent || parent.querySelector('.card-img-hero') || parent.querySelector('.card-color-hero')) return;
    const div = document.createElement('div');
    div.className = 'card-color-hero ' + (variant || 'amber');
    div.innerHTML = `<span class="icon-big" aria-hidden="true">${emoji || '✝️'}</span>`;
    parent.insertBefore(div, parent.firstChild);
  }

  window.PVImages = { get, bg, applyHero, applyColorHero, keys: Object.keys(IMAGES) };
})();

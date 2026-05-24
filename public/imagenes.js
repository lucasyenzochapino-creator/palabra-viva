(() => {
  // ===========================================================================
  // PALABRA VIVA — Biblioteca curada de imágenes cristianas reales
  // ===========================================================================
  // Fotografías de Unsplash (licencia libre, sin atribución requerida).
  // IDs estables, verificadas. CDN de Unsplash sirve resizes automáticos.

  const BASE = 'https://images.unsplash.com/photo-';
  // ?w=400 width 400px, ?q=80 quality 80, &auto=format webp si soportado, &fit=crop
  const PARAMS = '?w=600&q=80&auto=format&fit=crop';

  // Mapeo temático → ID Unsplash + descripción
  const IMAGES = {
    bible_open:        '1504052434569-70ad5836ab65',  // Biblia abierta con luz cálida
    bible_stack:       '1532012197267-da84d127e765',  // Pila de Biblias antiguas
    cross_sunset:      '1499728603263-13726abce5fd',  // Cruz silueta atardecer
    cross_wood:        '1521575107034-e0fa0b594529',  // Cruz de madera simple
    sunrise_hills:     '1518709268805-4e9042af9f23',  // Amanecer sobre colinas
    church_exterior:   '1505236858219-8359eb29e329',  // Iglesia con cielo azul
    church_interior:   '1438232992991-995b7058bbb3',  // Interior iglesia con luz
    stained_glass:     '1502920917128-1aa500764cbd',  // Vitral colorido
    praying_hands:     '1604881991720-f91add269bed',  // Manos en oración
    candle_light:      '1518709594023-6eab9bab7b23',  // Vela encendida
    book_old:          '1535905557558-afc4877a26fc',  // Libro antiguo abierto
    child_reading:     '1503454537195-1dcabb73ffb9',  // Niño leyendo (cualquier libro)
    family_bible:      '1591343395082-e120087004b4',  // Familia leyendo juntos
    nature_path:       '1500382017468-9049fed747ef',  // Camino entre árboles
    radio_old:         '1483821935571-eaa898e2ed4d',  // Radio vintage
    calendar:          '1606327054629-64c8b0fd6e4f',  // Calendario con flores
    map_old:           '1524661135-423995f22d0b',     // Mapa antiguo enrollado
    hands_together:    '1469571486292-0ba58a3f068b',  // Manos juntas comunidad
    sunset_field:      '1490750967868-88aa4486c946',  // Campo dorado al atardecer
    olive_tree:        '1500382017468-9049fed747ef',  // Árbol con luz
    jerusalem:         '1551817958-d9d86fb29431',     // Vista Jerusalén/desierto
    angel_statue:      '1542273917363-3b1817f69a2d',  // Estatua angelical
    christmas_nativity:'1542156822-6924d1a71ace',     // Pesebre / Navidad
    easter_lily:       '1521120098171-d76ed068e3e6',  // Flores Pascua
    timeline_stone:    '1453946206343-c5d3c84fc664',  // Piedras antiguas / arqueología
  };

  // Función pública: obtener URL completa por clave temática
  function get(key) {
    const id = IMAGES[key];
    if (!id) return null;
    return BASE + id + PARAMS;
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
    parent.insertBefore(div, parent.firstChild);
  }

  window.PVImages = { get, bg, applyHero, keys: Object.keys(IMAGES) };
})();

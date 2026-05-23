(() => {
  // ===========================================================================
  // PALABRA VIVA — Iglesias cristianas cerca
  // ===========================================================================
  // Usa la geolocalización del navegador (con permiso explícito) y consulta
  // OpenStreetMap (Overpass API · gratis) para encontrar iglesias cristianas
  // dentro de un radio. Filtra católicas para mostrar solo evangélicas /
  // protestantes / cristianas (alineado con el target de la app).

  const OVERPASS_URLS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass.openstreetmap.fr/api/interpreter'
  ];

  // Denominaciones EXCLUIDAS (la app es evangélica/cristiana)
  const EXCLUDED_DENOMS = ['catholic', 'roman_catholic', 'orthodox', 'eastern_orthodox', 'mormon', 'jehovahs_witness', 'latter_day_saints'];

  function injectStyles() {
    if (document.getElementById('pv-iglesias-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-iglesias-style';
    st.textContent = `
      .pv-igl-panel{position:fixed;inset:0;z-index:1000004;background:var(--bg,#1a0e05);color:var(--text,#f5deb3);overflow-y:auto;padding:14px 14px calc(150px + env(safe-area-inset-bottom))}
      .pv-igl-inner{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:14px}
      .pv-igl-head{display:grid;grid-template-columns:1fr auto;gap:10px;position:sticky;top:0;background:var(--bg,#1a0e05);padding:8px 0 14px;z-index:5;border-bottom:1px solid var(--line,#333447)}
      .pv-igl-head h1{font-size:clamp(22px,6vw,28px);margin:4px 0;letter-spacing:-.02em}
      .pv-igl-head p{font-size:13px;color:var(--muted,#c8c5d8);margin:0}
      .pv-igl-close{border:1px solid var(--line,#333447);background:var(--card2,#202031);color:var(--text,#f8fafc);border-radius:999px;padding:9px 16px;font-weight:900;cursor:pointer;height:fit-content}
      .pv-igl-status{background:var(--card,#171722);border:1px solid var(--line,#333447);border-radius:18px;padding:16px;text-align:center}
      .pv-igl-btn-loc{background:linear-gradient(135deg,#7c4a1e,#b45309);color:#fff;border:0;border-radius:999px;padding:16px 24px;font-weight:900;font-size:16px;cursor:pointer;min-height:54px;display:flex;align-items:center;justify-content:center;gap:8px;margin:14px auto 0;box-shadow:0 12px 30px rgba(124,74,30,.4)}
      .pv-igl-btn-loc:active{transform:scale(.98)}
      .pv-igl-btn-loc:disabled{opacity:.6;cursor:wait}
      .pv-igl-radius{display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:var(--card2,#202031);border:1px solid var(--line,#333447);border-radius:18px;padding:12px 14px}
      .pv-igl-radius select{flex:1;border:1px solid var(--line,#333447);background:var(--card,#171722);color:var(--text,#f8fafc);border-radius:12px;padding:10px;font-weight:700}
      .pv-igl-list{display:flex;flex-direction:column;gap:10px}
      .pv-igl-card{background:var(--card,#171722);border:1px solid var(--line,#333447);border-radius:18px;padding:14px;display:flex;flex-direction:column;gap:6px}
      .pv-igl-card h3{margin:0;font-size:17px;letter-spacing:-.01em;line-height:1.25}
      .pv-igl-card .denom{font-size:12px;color:var(--brand,#f59e0b);font-weight:900;text-transform:uppercase;letter-spacing:.06em}
      .pv-igl-card .addr{font-size:14px;color:var(--muted,#c8c5d8);margin:0;line-height:1.4}
      .pv-igl-card .meta{font-size:12px;color:var(--muted,#c8c5d8);display:flex;gap:10px;flex-wrap:wrap;margin-top:4px}
      .pv-igl-card .actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
      .pv-igl-card .actions a{background:var(--card2,#202031);border:1px solid var(--line,#333447);color:var(--text,#f8fafc);text-decoration:none;border-radius:999px;padding:8px 12px;font-weight:700;font-size:13px}
      .pv-igl-card .actions a.primary{background:linear-gradient(135deg,#7c4a1e,#b45309);color:#fff;border:0}
      .pv-igl-empty{color:var(--muted,#c8c5d8);text-align:center;padding:24px 16px}
      .pv-igl-error{background:rgba(251,113,133,.1);border:1px solid rgba(251,113,133,.4);color:#fda4af;border-radius:14px;padding:14px;font-size:14px}
      .pv-igl-home{border-color:rgba(34,197,94,.45)!important;background:linear-gradient(135deg,rgba(34,197,94,.12),var(--card))!important}
      /* Leaflet map container */
      .pv-igl-map{height:340px;width:100%;border-radius:18px;overflow:hidden;border:1px solid var(--line,#333447);background:#222}
      .pv-igl-map .leaflet-control-zoom a{background:#fff;color:#1a1007}
      .pv-igl-map .leaflet-popup-content-wrapper{background:var(--card,#171722);color:var(--text,#f8fafc);border:1px solid var(--line,#333447);border-radius:14px}
      .pv-igl-map .leaflet-popup-tip{background:var(--card,#171722)}
      .pv-igl-map .leaflet-popup-content{margin:12px;font-size:14px;line-height:1.4}
      .pv-igl-map .leaflet-popup-content h4{margin:0 0 4px;font-size:15px;color:var(--text,#f8fafc)}
      .pv-igl-map .leaflet-popup-content .denom{font-size:11px;color:var(--brand,#f59e0b);font-weight:900;text-transform:uppercase}
      .pv-igl-map .leaflet-popup-content a{display:inline-block;background:linear-gradient(135deg,#7c4a1e,#b45309);color:#fff;text-decoration:none;border-radius:999px;padding:6px 10px;font-weight:700;font-size:12px;margin-top:6px}
      .pv-igl-toggle{display:flex;gap:6px;background:var(--card2,#202031);border:1px solid var(--line,#333447);border-radius:14px;padding:4px;width:fit-content;margin:0 auto}
      .pv-igl-toggle button{border:0;background:transparent;color:var(--muted,#c8c5d8);border-radius:10px;padding:7px 14px;font-weight:900;font-size:13px;cursor:pointer}
      .pv-igl-toggle button.on{background:linear-gradient(135deg,#7c4a1e,#b45309);color:#fff}
    `;
    document.head.appendChild(st);
  }

  // ── Geolocalización con permiso explícito ─────────────────────────────────
  function getLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Tu navegador no soporta ubicación.'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude, accuracy: pos.coords.accuracy }),
        (err) => {
          const msgs = {
            1: 'No permitiste el acceso a tu ubicación. Activala en los permisos del navegador y volvé a intentar.',
            2: 'No pudimos detectar tu ubicación. Verificá que el GPS esté encendido.',
            3: 'Tardó demasiado. Probá de nuevo.'
          };
          reject(new Error(msgs[err.code] || 'Error obteniendo ubicación.'));
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 }
      );
    });
  }

  // ── Overpass API: buscar iglesias en radio ────────────────────────────────
  async function fetchChurches(lat, lon, radiusM) {
    // Query Overpass: places of worship cristianas (no católicas) en radio
    const query = `[out:json][timeout:25];
(
  node["amenity"="place_of_worship"]["religion"="christian"](around:${radiusM},${lat},${lon});
  way["amenity"="place_of_worship"]["religion"="christian"](around:${radiusM},${lat},${lon});
);
out center body;`;

    for (const url of OVERPASS_URLS) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
          body: query
        });
        if (!res.ok) continue;
        const data = await res.json();
        return (data.elements || []).map(el => ({
          id: el.id,
          lat: el.lat || el.center?.lat,
          lon: el.lon || el.center?.lon,
          name: el.tags?.name || 'Iglesia',
          denomination: el.tags?.denomination || '',
          religion: el.tags?.religion || '',
          addr: [
            el.tags?.['addr:street'],
            el.tags?.['addr:housenumber'],
            el.tags?.['addr:city']
          ].filter(Boolean).join(' ') || '',
          phone: el.tags?.phone || el.tags?.['contact:phone'] || '',
          website: el.tags?.website || el.tags?.['contact:website'] || '',
          opening_hours: el.tags?.opening_hours || ''
        }))
        .filter(c => c.lat && c.lon)
        // Excluir denominaciones que no son evangélicas / cristianas no-romanas
        .filter(c => {
          const d = (c.denomination || '').toLowerCase();
          return !EXCLUDED_DENOMS.some(ex => d.includes(ex));
        });
      } catch { continue; }
    }
    throw new Error('No pudimos conectar con el servidor de mapas. Probá en unos minutos.');
  }

  // Calcular distancia en km (Haversine)
  function distance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 +
              Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) *
              Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  function denomPretty(d) {
    if (!d) return 'Cristiana';
    const map = {
      evangelical: 'Evangélica',
      pentecostal: 'Pentecostal',
      baptist: 'Bautista',
      methodist: 'Metodista',
      lutheran: 'Luterana',
      presbyterian: 'Presbiteriana',
      anglican: 'Anglicana',
      adventist: 'Adventista',
      christian: 'Cristiana',
      protestant: 'Protestante'
    };
    return map[d.toLowerCase()] || (d.charAt(0).toUpperCase() + d.slice(1));
  }

  // ── Panel principal ──────────────────────────────────────────────────────
  function openPanel() {
    if (document.querySelector('.pv-igl-panel')) return;
    injectStyles();

    const panel = document.createElement('section');
    panel.className = 'pv-igl-panel';
    panel.setAttribute('aria-label', 'Iglesias cristianas cerca');
    history.pushState({ pvIglesias: true }, '', location.href.split('#')[0] + '#iglesias');

    panel.innerHTML = `
      <div class="pv-igl-inner">
        <div class="pv-igl-head">
          <div>
            <p>Comunidad</p>
            <h1>⛪ Iglesias cristianas cerca</h1>
          </div>
          <button class="pv-igl-close" data-close>Cerrar ✕</button>
        </div>
        <div class="pv-igl-radius">
          <span style="font-weight:900">📍 Radio:</span>
          <select id="pv-igl-radius">
            <option value="1000">1 km</option>
            <option value="3000" selected>3 km</option>
            <option value="5000">5 km</option>
            <option value="10000">10 km</option>
            <option value="20000">20 km</option>
          </select>
        </div>
        <div class="pv-igl-status" id="pv-igl-status">
          <p style="margin:0 0 6px;font-size:16px"><strong>Mostrá tu ubicación para encontrar iglesias cercanas.</strong></p>
          <p style="margin:0;font-size:13px;color:var(--muted,#c8c5d8)">No guardamos tu ubicación en ningún lado. Solo la usamos para buscar.</p>
          <button class="pv-igl-btn-loc" data-loc>📍 Usar mi ubicación</button>
        </div>
        <div class="pv-igl-toggle" id="pv-igl-toggle" style="display:none">
          <button class="on" data-view="map">🗺️ Mapa</button>
          <button data-view="list">📋 Lista</button>
        </div>
        <div class="pv-igl-map" id="pv-igl-map" style="display:none" aria-label="Mapa de iglesias"></div>
        <div class="pv-igl-list" id="pv-igl-list"></div>
      </div>`;

    function closePanel(useHistory = true) {
      window.removeEventListener('popstate', onPop);
      panel.remove();
      if (useHistory && location.hash === '#iglesias') {
        window._pvPanelClosing = true;
        history.back();
      }
    }
    function onPop() { window.removeEventListener('popstate', onPop); panel.remove(); }

    panel.querySelector('[data-close]').onclick = () => closePanel(true);

    let userLoc = null;
    let mapInstance = null;
    let markerLayer = null;
    let lastChurches = [];
    let view = 'map'; // 'map' | 'list'
    const statusEl = panel.querySelector('#pv-igl-status');
    const listEl   = panel.querySelector('#pv-igl-list');
    const mapEl    = panel.querySelector('#pv-igl-map');
    const toggleEl = panel.querySelector('#pv-igl-toggle');
    const radiusSel = panel.querySelector('#pv-igl-radius');

    function initMap(lat, lon) {
      if (typeof L === 'undefined') return false; // Leaflet aún no cargó
      if (mapInstance) {
        mapInstance.setView([lat, lon], 14);
        return true;
      }
      mapInstance = L.map(mapEl, { zoomControl: true, attributionControl: true }).setView([lat, lon], 14);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      }).addTo(mapInstance);
      markerLayer = L.layerGroup().addTo(mapInstance);
      return true;
    }

    function plotMarkers(churches) {
      if (!mapInstance || !markerLayer) return;
      markerLayer.clearLayers();
      // Marker del usuario (azul)
      if (userLoc) {
        L.circleMarker([userLoc.lat, userLoc.lon], {
          radius: 9, fillColor: '#3b82f6', color: '#fff', weight: 3, fillOpacity: 1
        }).addTo(markerLayer).bindPopup('<strong>📍 Estás acá</strong>');
      }
      const escape = s => (s || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
      churches.forEach(c => {
        const distStr = c.dist < 1 ? `${Math.round(c.dist * 1000)} m` : `${c.dist.toFixed(1)} km`;
        const popup = `<div>
          <span class="denom">${escape(denomPretty(c.denomination))} · ${distStr}</span>
          <h4>${escape(c.name)}</h4>
          ${c.addr ? `<div style="font-size:12px;color:#c8c5d8">${escape(c.addr)}</div>` : ''}
          <a href="https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lon}" target="_blank" rel="noopener noreferrer">🗺️ Cómo llegar</a>
        </div>`;
        L.marker([c.lat, c.lon]).addTo(markerLayer).bindPopup(popup);
      });
      // Ajustar vista para mostrar todos los pins
      if (churches.length && userLoc) {
        const bounds = L.latLngBounds([
          [userLoc.lat, userLoc.lon],
          ...churches.map(c => [c.lat, c.lon])
        ]);
        mapInstance.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      }
    }

    function applyView() {
      mapEl.style.display    = view === 'map'  ? 'block' : 'none';
      listEl.style.display   = view === 'list' ? 'flex'  : (lastChurches.length ? 'flex' : 'none');
      // En desktop podríamos mostrar ambos. Por ahora: list siempre visible si hay datos
      if (view === 'map' && mapInstance) {
        setTimeout(() => mapInstance.invalidateSize(), 100);
      }
      toggleEl.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.view === view));
    }
    toggleEl.querySelectorAll('button').forEach(b => {
      b.onclick = () => { view = b.dataset.view; applyView(); };
    });

    async function doSearch() {
      const r = parseInt(radiusSel.value, 10) || 3000;
      if (!userLoc) {
        statusEl.innerHTML = `<p style="margin:0">⏳ Detectando tu ubicación…</p>`;
        try {
          userLoc = await getLocation();
        } catch (e) {
          statusEl.innerHTML = `<div class="pv-igl-error">❌ ${e.message}</div>
            <button class="pv-igl-btn-loc" data-loc>📍 Intentar de nuevo</button>`;
          statusEl.querySelector('[data-loc]').onclick = doSearch;
          return;
        }
      }
      statusEl.innerHTML = `<p style="margin:0">📍 Tu ubicación detectada. Buscando iglesias en ${r/1000} km…</p>`;

      let churches;
      try {
        churches = await fetchChurches(userLoc.lat, userLoc.lon, r);
      } catch (e) {
        statusEl.innerHTML = `<div class="pv-igl-error">❌ ${e.message}</div>
          <button class="pv-igl-btn-loc" data-loc>Reintentar</button>`;
        statusEl.querySelector('[data-loc]').onclick = doSearch;
        return;
      }

      if (!churches.length) {
        statusEl.innerHTML = `<p style="margin:0">📍 Ubicación detectada</p>
          <button class="pv-igl-btn-loc" data-loc>📍 Buscar de nuevo</button>`;
        statusEl.querySelector('[data-loc]').onclick = doSearch;
        listEl.innerHTML = `<div class="pv-igl-empty">No encontramos iglesias cristianas en ${r/1000} km. Probá un radio más grande.</div>`;
        return;
      }

      // Ordenar por distancia
      churches = churches
        .map(c => ({ ...c, dist: distance(userLoc.lat, userLoc.lon, c.lat, c.lon) }))
        .sort((a, b) => a.dist - b.dist);

      lastChurches = churches;

      statusEl.innerHTML = `<p style="margin:0"><strong>${churches.length} iglesia${churches.length===1?'':'s'} cristiana${churches.length===1?'':'s'}</strong> en ${r/1000} km de tu ubicación.</p>
        <button class="pv-igl-btn-loc" data-loc>🔄 Actualizar</button>`;
      statusEl.querySelector('[data-loc]').onclick = doSearch;

      // Inicializar mapa + markers (esperar a que Leaflet esté cargado)
      const setupMap = () => {
        if (initMap(userLoc.lat, userLoc.lon)) {
          plotMarkers(churches);
          toggleEl.style.display = 'flex';
          applyView();
        } else {
          // Leaflet aún no cargó — reintentar
          setTimeout(setupMap, 250);
        }
      };
      setupMap();

      listEl.innerHTML = churches.map(c => {
        const distStr = c.dist < 1 ? `${Math.round(c.dist * 1000)} m` : `${c.dist.toFixed(1)} km`;
        const escape = s => (s || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lon}`;
        const osmUrl  = `https://www.openstreetmap.org/?mlat=${c.lat}&mlon=${c.lon}&zoom=17`;
        return `<article class="pv-igl-card">
          <span class="denom">${escape(denomPretty(c.denomination))} · ${distStr}</span>
          <h3>${escape(c.name)}</h3>
          ${c.addr ? `<p class="addr">📍 ${escape(c.addr)}</p>` : ''}
          <div class="meta">
            ${c.phone ? `📞 ${escape(c.phone)}` : ''}
            ${c.opening_hours ? `🕒 ${escape(c.opening_hours)}` : ''}
          </div>
          <div class="actions">
            <a class="primary" href="${mapsUrl}" target="_blank" rel="noopener noreferrer">🗺️ Cómo llegar</a>
            <a href="${osmUrl}" target="_blank" rel="noopener noreferrer">📍 Ver en mapa</a>
            ${c.website ? `<a href="${escape(c.website)}" target="_blank" rel="noopener noreferrer">🌐 Sitio web</a>` : ''}
          </div>
        </article>`;
      }).join('');
    }

    statusEl.querySelector('[data-loc]').onclick = doSearch;
    radiusSel.onchange = () => { if (userLoc) doSearch(); };

    document.body.appendChild(panel);
    window.addEventListener('popstate', onPop, { once: true });
  }

  // ── Card en home ──────────────────────────────────────────────────────────
  function addHomeCard() {
    const title = document.querySelector('h1')?.textContent || '';
    if (!title.includes('Una palabra para hoy')) {
      document.querySelector('.pv-igl-home')?.remove();
      return;
    }
    if (document.querySelector('.pv-igl-home')) return;
    const anchor = document.querySelector('.pv-kids-home') || document.querySelector('.pv-tl-home') || document.querySelector('.pv-ba-card') || document.querySelector('.hero');
    if (!anchor) return;
    const card = document.createElement('section');
    card.className = 'card pv-igl-home';
    card.innerHTML = `
      <p class="ref">Comunidad cerca</p>
      <h3>⛪ Iglesias cristianas cerca</h3>
      <p class="soft">Encontrá una congregación evangélica cerca tuyo. Usá tu ubicación (con permiso) y elegí el radio.</p>
      <div class="row wrap"><button class="btn">Ver iglesias cerca</button></div>
    `;
    card.querySelector('button').onclick = openPanel;
    anchor.insertAdjacentElement('afterend', card);
  }

  function boot() { injectStyles(); addHomeCard(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('load', boot);
  setInterval(boot, 2500);

  window.PVIglesias = { open: openPanel };
})();

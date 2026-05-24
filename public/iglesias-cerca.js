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

  const SUPA_URL = 'https://fuxojzmwyyecefxczfrn.supabase.co';
  const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1eG9qem13eXllY2VmeGN6ZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTU4MDAsImV4cCI6MjA5NTAzMTgwMH0.M4telJzC3kt7fNN86kvuqpL5-vVmCjdzE-hTDy6Igak';

  // Buscar iglesias aprobadas por la comunidad cerca del usuario
  async function fetchCommunityChurches(lat, lon, radiusKm) {
    try {
      const url = `${SUPA_URL}/rest/v1/community_churches?status=eq.approved&select=*`;
      const res = await fetch(url, { headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY } });
      if (!res.ok) return [];
      const rows = await res.json();
      return (rows || []).filter(c => {
        const d = distance(lat, lon, parseFloat(c.lat), parseFloat(c.lon));
        return d <= radiusKm;
      }).map(c => ({
        id: 'community-' + c.id,
        lat: parseFloat(c.lat),
        lon: parseFloat(c.lon),
        name: c.name,
        denomination: c.denomination || '',
        addr: c.address || '',
        phone: c.phone || '',
        website: c.website || '',
        opening_hours: '',
        community: true
      }));
    } catch { return []; }
  }

  // Submit nueva iglesia
  async function submitChurch(payload) {
    const token = window.PVAuth?.getToken?.() || SUPA_KEY;
    const res = await fetch(`${SUPA_URL}/rest/v1/community_churches`, {
      method: 'POST',
      headers: {
        'apikey': SUPA_KEY,
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ ...payload, status: 'pending' })
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error('HTTP ' + res.status + ': ' + txt.slice(0, 200));
    }
    return true;
  }

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
      .pv-igl-add{background:linear-gradient(135deg,var(--brand,#6b1f1f),var(--brand2,#8a5a2b));color:#fbf3df;border:0;border-radius:14px;padding:13px 18px;font-weight:600;font-size:15px;cursor:pointer;width:100%;display:flex;align-items:center;justify-content:center;gap:8px;min-height:48px;margin-top:6px}
      .pv-igl-comm-badge{display:inline-block;background:rgba(164,119,49,.18);color:var(--brand,#6b1f1f);font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;text-transform:uppercase;letter-spacing:.06em;margin-left:6px}
      /* Add church modal */
      .pv-add-modal{position:fixed;inset:0;z-index:9750;background:rgba(0,0,0,.8);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:18px}
      .pv-add-card{background:var(--card,#fff);color:var(--text,#000);border:1px solid var(--line,#ccc);border-radius:20px;padding:22px;max-width:480px;width:100%;display:flex;flex-direction:column;gap:12px;box-shadow:0 24px 60px rgba(0,0,0,.5);max-height:90vh;overflow-y:auto}
      .pv-add-card h2{margin:0;font-size:22px}
      .pv-add-card label{font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.16em;display:block;margin:6px 0 4px}
      .pv-add-card input,.pv-add-card select,.pv-add-card textarea{width:100%;border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:10px;padding:11px 14px;font:inherit;font-size:15px;outline:none;box-sizing:border-box}
      .pv-add-card textarea{font-family:var(--font-serif);resize:vertical;min-height:80px}
      .pv-add-card input:focus,.pv-add-card select:focus,.pv-add-card textarea:focus{border-color:var(--brand)}
      .pv-add-card .actions{display:flex;gap:10px;margin-top:12px}
      .pv-add-card .actions button{flex:1;border:0;border-radius:999px;padding:12px;font-weight:600;cursor:pointer;min-height:46px;font-size:15px}
      .pv-add-card .actions .save{background:var(--brand);color:#fbf3df}
      .pv-add-card .actions .cancel{background:var(--card2);color:var(--text);border:1px solid var(--line)}
      .pv-add-loc-row{display:flex;gap:8px;align-items:center}
      .pv-add-loc-row button{background:var(--card2);border:1px solid var(--line);color:var(--text);border-radius:10px;padding:9px 12px;font-size:13px;cursor:pointer;font-weight:600;flex-shrink:0}
      .pv-add-msg{font-size:13px;padding:8px 12px;border-radius:10px;display:none}
      .pv-add-msg.ok{display:block;background:rgba(90,111,72,.15);color:var(--good)}
      .pv-add-msg.err{display:block;background:rgba(154,58,58,.10);color:var(--danger)}
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
  async function fetchChurches(lat, lon, radiusM, onProgress) {
    // Query Overpass: places of worship cristianas en radio.
    // Por defecto OSM no siempre tiene 'religion=christian' — algunas iglesias
    // tienen denomination=baptist sin religion. Hacemos una query más amplia.
    const query = `[out:json][timeout:30];
(
  node["amenity"="place_of_worship"]["religion"="christian"](around:${radiusM},${lat},${lon});
  way["amenity"="place_of_worship"]["religion"="christian"](around:${radiusM},${lat},${lon});
  node["amenity"="place_of_worship"]["denomination"~"^(evangelical|pentecostal|baptist|methodist|lutheran|presbyterian|anglican|adventist|protestant|christian)$"](around:${radiusM},${lat},${lon});
  way["amenity"="place_of_worship"]["denomination"~"^(evangelical|pentecostal|baptist|methodist|lutheran|presbyterian|anglican|adventist|protestant|christian)$"](around:${radiusM},${lat},${lon});
);
out center body;`;

    for (let i = 0; i < OVERPASS_URLS.length; i++) {
      const url = OVERPASS_URLS[i];
      if (onProgress) onProgress(`Probando servidor ${i+1} de ${OVERPASS_URLS.length}…`);
      const ctrl = new AbortController();
      const timeoutId = setTimeout(() => ctrl.abort(), 35000); // 35s
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
          body: query,
          signal: ctrl.signal
        });
        clearTimeout(timeoutId);
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
        .filter(c => {
          const d = (c.denomination || '').toLowerCase();
          return !EXCLUDED_DENOMS.some(ex => d.includes(ex));
        })
        // Deduplicar por id
        .filter((c, idx, arr) => arr.findIndex(x => x.id === c.id) === idx);
      } catch (e) {
        clearTimeout(timeoutId);
        if (e.name === 'AbortError') console.warn(`Overpass ${url} timeout`);
        continue;
      }
    }
    throw new Error('Los 3 servidores de mapas están lentos o caídos ahora. Probá en unos minutos.');
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
        <button class="pv-igl-add" id="pv-igl-add">＋ Agregar iglesia que conozcas</button>
        <p style="font-size:12px;color:var(--muted,#c8c5d8);text-align:center;margin:4px 0 0">Si conocés una iglesia cristiana que no aparece, agregala para ayudar a otros.</p>
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

    async function doSearch(autoRadius) {
      let r = parseInt(radiusSel.value, 10) || 3000;
      if (autoRadius) r = autoRadius;

      if (!userLoc) {
        statusEl.innerHTML = `<p style="margin:0">⏳ Detectando tu ubicación…</p>
          <p style="margin:6px 0 0;font-size:12px;color:var(--muted,#c8c5d8)">Si no aparece el pedido de permiso, revisá el ícono de candado 🔒 al lado de la URL.</p>`;
        try {
          userLoc = await getLocation();
        } catch (e) {
          statusEl.innerHTML = `<div class="pv-igl-error">❌ ${e.message}</div>
            <button class="pv-igl-btn-loc" data-loc>📍 Intentar de nuevo</button>`;
          statusEl.querySelector('[data-loc]').onclick = () => doSearch();
          return;
        }
      }
      statusEl.innerHTML = `<p style="margin:0">📍 Ubicación detectada. <strong>Buscando iglesias en ${r/1000} km</strong>…</p>
        <p style="margin:6px 0 0;font-size:12px;color:var(--muted,#c8c5d8)" id="pv-igl-progress">Conectando con OpenStreetMap…</p>`;

      const progressEl = panel.querySelector('#pv-igl-progress');

      let churches;
      try {
        // Buscamos en paralelo: OSM + community
        const [osm, comm] = await Promise.all([
          fetchChurches(userLoc.lat, userLoc.lon, r, (msg) => { if (progressEl) progressEl.textContent = msg; }),
          fetchCommunityChurches(userLoc.lat, userLoc.lon, r / 1000)
        ]);
        churches = [...comm, ...osm];
      } catch (e) {
        statusEl.innerHTML = `<div class="pv-igl-error">❌ ${e.message}</div>
          <button class="pv-igl-btn-loc" data-loc>🔄 Reintentar</button>`;
        statusEl.querySelector('[data-loc]').onclick = () => doSearch();
        return;
      }

      if (!churches.length) {
        // Auto-expand: si no hay con radio actual, probar el siguiente más grande
        const nextRadius = { 1000: 3000, 3000: 5000, 5000: 10000, 10000: 20000, 20000: null }[r];
        if (nextRadius && !autoRadius) {
          statusEl.innerHTML = `<p style="margin:0">⏳ No encontramos en ${r/1000} km. Probando ${nextRadius/1000} km…</p>`;
          radiusSel.value = nextRadius;
          return doSearch(nextRadius);
        }
        statusEl.innerHTML = `<p style="margin:0">📍 Ubicación detectada</p>
          <button class="pv-igl-btn-loc" data-loc>📍 Buscar de nuevo</button>`;
        statusEl.querySelector('[data-loc]').onclick = () => doSearch();
        listEl.innerHTML = `<div class="pv-igl-empty">😕 No encontramos iglesias cristianas evangélicas en ${r/1000} km de tu ubicación según OpenStreetMap.<br><br>
          <small>Esto puede deberse a que las iglesias de tu zona no están registradas todavía en el mapa abierto. Probá:<br>
          • Aumentar el radio a 20 km<br>
          • Buscar manualmente en <a href="https://www.google.com/maps/search/iglesia+cristiana+cerca" target="_blank" rel="noopener noreferrer" style="color:var(--brand,#f59e0b)">Google Maps</a></small>
        </div>`;
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
          <span class="denom">${escape(denomPretty(c.denomination))} · ${distStr}${c.community ? '<span class="pv-igl-comm-badge">Comunidad</span>' : ''}</span>
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

    statusEl.querySelector('[data-loc]').onclick = () => doSearch();
    radiusSel.onchange = () => { if (userLoc) doSearch(); };

    // Botón Agregar Iglesia
    panel.querySelector('#pv-igl-add').onclick = () => openAddChurch(userLoc, () => doSearch());

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

  // ── Modal: Agregar Iglesia ────────────────────────────────────────────────
  async function openAddChurch(userLoc, onSaved) {
    if (document.querySelector('.pv-add-modal')) return;

    let lat = userLoc?.lat || null;
    let lon = userLoc?.lon || null;

    const modal = document.createElement('div');
    modal.className = 'pv-add-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Agregar iglesia');

    const user = window.PVAuth?.getUser?.();
    const defaultEmail = user?.email || '';

    modal.innerHTML = `
      <div class="pv-add-card">
        <h2>＋ Agregar iglesia</h2>
        <p style="margin:0;font-size:14px;color:var(--muted)">Si conocés una iglesia cristiana evangélica que no aparezca, dejanos los datos. Nuestro equipo la revisa y la publica para que la encuentren los demás 🙏</p>
        <div class="pv-add-msg" id="pv-add-msg"></div>

        <label for="ich-name">Nombre de la iglesia *</label>
        <input id="ich-name" type="text" placeholder="Ej: Iglesia Evangélica Casa de Oración" required maxlength="200" />

        <label for="ich-denom">Denominación</label>
        <select id="ich-denom">
          <option value="">— Elegir —</option>
          <option value="evangelical">Evangélica (general)</option>
          <option value="pentecostal">Pentecostal</option>
          <option value="baptist">Bautista</option>
          <option value="methodist">Metodista</option>
          <option value="lutheran">Luterana</option>
          <option value="presbyterian">Presbiteriana</option>
          <option value="anglican">Anglicana</option>
          <option value="adventist">Adventista</option>
          <option value="christian">Cristiana sin denominación</option>
          <option value="protestant">Protestante</option>
        </select>

        <label for="ich-addr">Dirección</label>
        <input id="ich-addr" type="text" placeholder="Calle, número, ciudad" maxlength="200" />

        <label>Ubicación (lat, lon) *</label>
        <div class="pv-add-loc-row">
          <input id="ich-lat" type="number" step="0.000001" placeholder="-34.6037" value="${lat ?? ''}" style="flex:1" />
          <input id="ich-lon" type="number" step="0.000001" placeholder="-58.3816" value="${lon ?? ''}" style="flex:1" />
          <button type="button" id="ich-here">📍 Acá</button>
        </div>
        <p style="font-size:11px;color:var(--muted);margin:2px 0 0">Tocá "📍 Acá" si estás físicamente en la iglesia. O buscá en Google Maps clic-derecho → copiar coordenadas.</p>

        <label for="ich-phone">Teléfono <span style="text-transform:none;letter-spacing:0;font-weight:400">(opcional)</span></label>
        <input id="ich-phone" type="tel" placeholder="+54 11 ..." maxlength="50" />

        <label for="ich-web">Sitio web o redes <span style="text-transform:none;letter-spacing:0;font-weight:400">(opcional)</span></label>
        <input id="ich-web" type="url" placeholder="https://..." maxlength="200" />

        <label for="ich-notes">Notas <span style="text-transform:none;letter-spacing:0;font-weight:400">(opcional)</span></label>
        <textarea id="ich-notes" placeholder="Horarios de culto, pastor, lo que quieras compartir..." maxlength="500"></textarea>

        <label for="ich-email">Tu email <span style="text-transform:none;letter-spacing:0;font-weight:400">(opcional, para avisarte cuando se publique)</span></label>
        <input id="ich-email" type="email" placeholder="tu@correo.com" value="${defaultEmail.replace(/"/g,'&quot;')}" maxlength="120" />

        <div class="actions">
          <button class="cancel" data-cancel>Cancelar</button>
          <button class="save" data-save>Enviar para revisión</button>
        </div>
      </div>
    `;

    function close() { modal.remove(); }
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    modal.querySelector('[data-cancel]').onclick = close;

    modal.querySelector('#ich-here').onclick = async () => {
      try {
        const loc = await getLocation();
        modal.querySelector('#ich-lat').value = loc.lat.toFixed(6);
        modal.querySelector('#ich-lon').value = loc.lon.toFixed(6);
      } catch (e) {
        showAddMsg(modal, e.message, 'err');
      }
    };

    modal.querySelector('[data-save]').onclick = async () => {
      const saveBtn = modal.querySelector('[data-save]');
      const name = modal.querySelector('#ich-name').value.trim();
      const denomination = modal.querySelector('#ich-denom').value;
      const address = modal.querySelector('#ich-addr').value.trim();
      const latV = parseFloat(modal.querySelector('#ich-lat').value);
      const lonV = parseFloat(modal.querySelector('#ich-lon').value);
      const phone = modal.querySelector('#ich-phone').value.trim();
      const website = modal.querySelector('#ich-web').value.trim();
      const notes = modal.querySelector('#ich-notes').value.trim();
      const submitter_email = modal.querySelector('#ich-email').value.trim();

      if (!name || name.length < 2) return showAddMsg(modal, 'Falta el nombre de la iglesia.', 'err');
      if (isNaN(latV) || latV < -90 || latV > 90)   return showAddMsg(modal, 'La latitud no es válida.', 'err');
      if (isNaN(lonV) || lonV < -180 || lonV > 180) return showAddMsg(modal, 'La longitud no es válida.', 'err');

      saveBtn.disabled = true; saveBtn.textContent = '⏳ Enviando…';
      try {
        await submitChurch({
          user_id: window.PVAuth?.getUser?.()?.id || null,
          name, denomination: denomination || null,
          lat: latV, lon: lonV,
          address: address || null, phone: phone || null, website: website || null,
          notes: notes || null, submitter_email: submitter_email || null
        });
        showAddMsg(modal, '✅ ¡Gracias! Tu iglesia llegó a moderación. La aprobamos en las próximas horas y aparece para todos.', 'ok');
        saveBtn.textContent = '✓ Enviada';
        setTimeout(() => { close(); onSaved?.(); }, 2200);
      } catch (e) {
        saveBtn.disabled = false; saveBtn.textContent = 'Enviar para revisión';
        showAddMsg(modal, '❌ No pudimos enviar: ' + e.message, 'err');
      }
    };

    document.body.appendChild(modal);
    setTimeout(() => modal.querySelector('#ich-name')?.focus(), 80);
  }

  function showAddMsg(modal, text, kind) {
    const el = modal.querySelector('#pv-add-msg');
    el.textContent = text;
    el.className = 'pv-add-msg ' + kind;
  }

  window.PVIglesias = { open: openPanel, openAdd: openAddChurch };
})();

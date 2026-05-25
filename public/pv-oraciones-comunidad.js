(() => {
  // ===========================================================================
  // PALABRA VIVA — Comunidad de oración
  // ===========================================================================
  // Muro de peticiones de oración anónimas. Cualquiera puede pedir oración.
  // Las admins aprueban antes de publicar (moderación contra spam).
  // Cualquiera puede dejar un "Yo oro por esto" — incrementa contador.

  const SUPA_URL = 'https://fuxojzmwyyecefxczfrn.supabase.co';
  const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1eG9qem13eXllY2VmeGN6ZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTU4MDAsImV4cCI6MjA5NTAzMTgwMH0.M4telJzC3kt7fNN86kvuqpL5-vVmCjdzE-hTDy6Igak';
  const PRAYED_KEY = 'pv-prayed-requests'; // ids locales por los que ya oró

  const CATEGORIES = [
    { id: 'general',       label: 'General',         emoji: '🙏' },
    { id: 'salud',         label: 'Salud',           emoji: '🤍' },
    { id: 'familia',       label: 'Familia',         emoji: '👨‍👩‍👧' },
    { id: 'trabajo',       label: 'Trabajo / Estudio', emoji: '💼' },
    { id: 'duelo',         label: 'Pérdida o duelo', emoji: '🕊️' },
    { id: 'fe',            label: 'Fe / Búsqueda',   emoji: '✝️' },
    { id: 'agradecimiento',label: 'Agradecimiento',  emoji: '✨' }
  ];

  function getToken() { return window.PVAuth?.getToken?.() || ''; }
  function getPrayedSet() {
    try { return new Set(JSON.parse(localStorage.getItem(PRAYED_KEY) || '[]')); }
    catch { return new Set(); }
  }
  function markAsPrayed(id) {
    const s = getPrayedSet();
    s.add(id);
    try { localStorage.setItem(PRAYED_KEY, JSON.stringify([...s])); } catch {}
  }

  async function listPrayers() {
    try {
      const res = await fetch(`${SUPA_URL}/rest/v1/prayer_requests?status=eq.approved&select=id,display_name,request_text,prayer_count,category,created_at,approved_at&order=approved_at.desc.nullslast,created_at.desc&limit=100`, {
        headers: {
          'apikey': SUPA_KEY,
          'Authorization': 'Bearer ' + (getToken() || SUPA_KEY)
        }
      });
      if (!res.ok) return [];
      return await res.json();
    } catch { return []; }
  }

  async function submitPrayer(text, displayName, category) {
    const token = getToken();
    // Usar RPC SECURITY DEFINER (mismo patrón que upsert_push_subscription).
    // El INSERT directo a la tabla rebota por RLS en clientes con anon key,
    // la RPC bypasea eso con validación interna en SQL.
    const url = `${SUPA_URL}/rest/v1/rpc/submit_prayer_request`;
    const body = {
      p_request_text: text.trim(),
      p_display_name: (displayName || '').trim() || 'Anónimo/a',
      p_category: category || 'general',
      p_user_agent: navigator.userAgent.slice(0, 200)
    };
    console.log('[Oración] POST →', url, body);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'apikey': SUPA_KEY,
          'Authorization': 'Bearer ' + (token || SUPA_KEY),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      console.log('[Oración] HTTP', res.status, res.statusText);
      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        console.error('[Oración] submit falló:', res.status, errText);
        return { ok: false, error: 'HTTP ' + res.status + ' — ' + (errText || res.statusText || 'sin detalle') };
      }
      const id = await res.json().catch(() => null);
      console.log('[Oración] OK — id:', id);
      return { ok: true, id };
    } catch (e) {
      console.error('[Oración] submit network error:', e);
      return { ok: false, error: 'Sin conexión a Supabase: ' + (e.message || e.name || String(e)) };
    }
  }

  async function pray(id) {
    const token = getToken();
    const res = await fetch(`${SUPA_URL}/rest/v1/rpc/increment_prayer_count`, {
      method: 'POST',
      headers: {
        'apikey': SUPA_KEY,
        'Authorization': 'Bearer ' + (token || SUPA_KEY),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ p_request_id: id })
    });
    if (res.ok) {
      markAsPrayed(id);
      return await res.json();
    }
    return null;
  }

  function injectStyles() {
    if (document.getElementById('pv-orac-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-orac-style';
    st.textContent = `
      .pv-orac-panel{position:fixed;inset:0;z-index:1000055;background:var(--bg);color:var(--text);overflow-y:auto;padding:14px 14px calc(80px + env(safe-area-inset-bottom))}
      .pv-orac-inner{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:14px}
      .pv-orac-head{display:flex;justify-content:space-between;gap:10px;position:sticky;top:0;background:var(--bg);padding:8px 0 14px;z-index:5;border-bottom:1px solid var(--line)}
      .pv-orac-head h1{margin:4px 0;font-size:clamp(22px,5.5vw,28px);letter-spacing:-.02em}
      .pv-orac-head .ver{font-size:11px;color:var(--muted);font-family:var(--font-sans);text-transform:uppercase;letter-spacing:.08em}
      .pv-orac-close{border:1px solid var(--line);background:var(--card);color:var(--text);border-radius:999px;padding:9px 14px;font-weight:600;cursor:pointer;height:fit-content;font-size:13px}
      .pv-orac-intro{background:linear-gradient(135deg,var(--card),var(--card2));border:1px solid var(--line);border-radius:18px;padding:16px;line-height:1.55}
      .pv-orac-intro h2{margin:0 0 6px;font-size:18px}
      .pv-orac-intro p{margin:0;font-size:14px;color:var(--muted)}
      .pv-orac-cta{display:block;width:100%;background:var(--brand);color:#fbf3df;border:0;border-radius:999px;padding:13px;font-weight:700;font-size:15px;cursor:pointer;font-family:var(--font-sans);min-height:48px;margin-top:12px}
      .pv-orac-cats{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px}
      .pv-orac-cat{flex:0 0 auto;border:1px solid var(--line);background:var(--card);color:var(--text);border-radius:999px;padding:8px 14px;font-weight:600;font-size:13px;cursor:pointer;font-family:var(--font-sans)}
      .pv-orac-cat.active{background:var(--brand);color:#fbf3df;border-color:var(--brand)}
      .pv-orac-list{display:flex;flex-direction:column;gap:12px}
      .pv-orac-item{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px 16px;display:flex;flex-direction:column;gap:8px}
      .pv-orac-item-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
      .pv-orac-item-cat{font-size:11px;color:var(--muted);font-family:var(--font-sans);letter-spacing:.06em;text-transform:uppercase;display:flex;align-items:center;gap:6px}
      .pv-orac-item-time{font-size:11px;color:var(--muted);font-family:var(--font-sans)}
      .pv-orac-item-text{font-size:15px;line-height:1.55;margin:0;white-space:pre-wrap;word-wrap:break-word}
      .pv-orac-item-name{font-size:13px;color:var(--accent);font-style:italic}
      .pv-orac-item-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:4px;padding-top:8px;border-top:1px dashed var(--line)}
      .pv-orac-pray-btn{border:1px solid rgba(154,58,58,.4);background:rgba(154,58,58,.08);color:var(--danger);border-radius:999px;padding:8px 16px;font-weight:700;font-size:13px;cursor:pointer;font-family:var(--font-sans)}
      .pv-orac-pray-btn:hover:not(:disabled){background:rgba(154,58,58,.16)}
      .pv-orac-pray-btn:disabled{opacity:.6;cursor:not-allowed}
      .pv-orac-pray-btn.prayed{background:linear-gradient(135deg,rgba(164,119,49,.18),rgba(154,58,58,.12));color:var(--brand);border-color:rgba(164,119,49,.5)}
      .pv-orac-count{font-size:13px;color:var(--muted);font-family:var(--font-sans);font-weight:600}
      .pv-orac-empty{text-align:center;padding:30px 20px;color:var(--muted);background:var(--card);border:1px dashed var(--line);border-radius:16px}
      /* Form */
      .pv-orac-form-backdrop{position:fixed;inset:0;z-index:1000058;background:rgba(0,0,0,.6);backdrop-filter:blur(6px);display:flex;align-items:flex-end;justify-content:center}
      .pv-orac-form{background:var(--card);border:1px solid var(--line);border-top-left-radius:24px;border-top-right-radius:24px;padding:18px 16px calc(24px + env(safe-area-inset-bottom));width:100%;max-width:560px;max-height:85vh;overflow-y:auto;animation:pv-orac-up .25s ease-out}
      @keyframes pv-orac-up{from{transform:translateY(40px)}to{transform:none}}
      .pv-orac-form h3{margin:0 0 12px;font-size:18px}
      .pv-orac-form label{display:block;font-size:13px;font-weight:600;margin:10px 0 4px;color:var(--muted);font-family:var(--font-sans)}
      .pv-orac-form input, .pv-orac-form textarea, .pv-orac-form select{width:100%;background:var(--card2);border:1px solid var(--line);color:var(--text);border-radius:12px;padding:10px 12px;font:inherit;font-size:15px}
      .pv-orac-form textarea{resize:vertical;min-height:90px;line-height:1.5}
      .pv-orac-form .pv-orac-counter{font-size:11px;color:var(--muted);text-align:right;margin-top:4px}
      .pv-orac-form .row{display:flex;gap:8px;margin-top:14px}
      .pv-orac-form .row button{flex:1;border-radius:999px;padding:12px;font-weight:700;font-size:14px;cursor:pointer;min-height:48px;font-family:var(--font-sans)}
      .pv-orac-form .row .cancel{background:var(--card2);border:1px solid var(--line);color:var(--text)}
      .pv-orac-form .row .submit{background:var(--brand);border:0;color:#fbf3df}
      .pv-orac-form .row .submit:disabled{opacity:.5;cursor:wait}
      .pv-orac-disclaimer{font-size:11px;color:var(--muted);line-height:1.5;margin-top:10px;padding:8px 10px;background:var(--card2);border-radius:10px;font-family:var(--font-sans)}
      @keyframes pv-fade-in{from{opacity:0;transform:translate(-50%,8px)}to{opacity:1;transform:translateX(-50%)}}
    `;
    document.head.appendChild(st);
  }

  function timeAgo(iso) {
    if (!iso) return '';
    const ms = Date.now() - new Date(iso).getTime();
    const min = Math.floor(ms / 60000);
    if (min < 1) return 'recién';
    if (min < 60) return `hace ${min}m`;
    const h = Math.floor(min / 60);
    if (h < 24) return `hace ${h}h`;
    const d = Math.floor(h / 24);
    if (d < 30) return `hace ${d}d`;
    return new Date(iso).toLocaleDateString('es-AR');
  }

  function escape(s) {
    return (s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  let currentFilter = 'all';

  async function open() {
    if (document.querySelector('.pv-orac-panel')) return;
    injectStyles();
    history.pushState({ pvOrac: true }, '', location.href.split('#')[0] + '#oracion-comunidad');

    const panel = document.createElement('section');
    panel.className = 'pv-orac-panel';
    panel.setAttribute('aria-label', 'Comunidad de oración');
    panel.innerHTML = `
      <div class="pv-orac-inner">
        <div class="pv-orac-head">
          <div>
            <div class="ver">Oramos juntos</div>
            <h1>🙏 Comunidad de oración</h1>
          </div>
          <button class="pv-orac-close" data-close>Cerrar ✕</button>
        </div>

        <div class="pv-orac-intro">
          <h2>Llevamos cargas unos por otros</h2>
          <p>Compartí tu petición de oración (puede ser anónima) o orá por las que otros hermanos publicaron. Cada "Yo oro por esto" suma una persona orando.</p>
          <button class="pv-orac-cta" id="pv-orac-new">✍️ Pedir oración</button>
        </div>

        <div class="pv-orac-cats" id="pv-orac-cats">
          <button class="pv-orac-cat active" data-cat="all">Todas</button>
          ${CATEGORIES.map(c => `<button class="pv-orac-cat" data-cat="${c.id}">${c.emoji} ${c.label}</button>`).join('')}
        </div>

        <div class="pv-orac-list" id="pv-orac-list">⏳ Cargando peticiones…</div>
      </div>
    `;

    function close(useHistory = true) {
      window.removeEventListener('popstate', onPop);
      panel.remove();
      if (useHistory && location.hash === '#oracion-comunidad') {
        window._pvPanelClosing = true;
        history.back();
      }
    }
    function onPop() {
      if (location.hash === '#oracion-comunidad') return;
      window.removeEventListener('popstate', onPop);
      panel.remove();
    }
    panel.querySelector('[data-close]').onclick = () => close(true);
    panel.querySelector('#pv-orac-new').onclick = () => openForm(() => refreshList(panel));

    panel.querySelectorAll('.pv-orac-cat').forEach(btn => {
      btn.onclick = () => {
        panel.querySelectorAll('.pv-orac-cat').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.cat;
        refreshList(panel);
      };
    });

    document.body.appendChild(panel);
    window.addEventListener('popstate', onPop);
    refreshList(panel);
  }

  async function refreshList(panel) {
    const listEl = panel.querySelector('#pv-orac-list');
    listEl.innerHTML = '⏳ Cargando peticiones…';
    let prayers = await listPrayers();
    if (currentFilter !== 'all') {
      prayers = prayers.filter(p => p.category === currentFilter);
    }
    const prayed = getPrayedSet();

    if (!prayers.length) {
      listEl.innerHTML = `<div class="pv-orac-empty">
        <p style="margin:0 0 6px;font-size:16px"><strong>Sé el primero/a en pedir oración</strong></p>
        <p style="margin:0;font-size:13px">Compartí lo que cargás hoy. Tu pedido va a llegar a hermanos que orarán por vos.</p>
      </div>`;
      return;
    }

    listEl.innerHTML = prayers.map(p => {
      const cat = CATEGORIES.find(c => c.id === p.category) || CATEGORIES[0];
      const already = prayed.has(p.id);
      return `<article class="pv-orac-item" data-id="${p.id}">
        <div class="pv-orac-item-head">
          <span class="pv-orac-item-cat">${cat.emoji} ${cat.label}</span>
          <span class="pv-orac-item-time">${timeAgo(p.approved_at || p.created_at)}</span>
        </div>
        <p class="pv-orac-item-text">${escape(p.request_text)}</p>
        <div class="pv-orac-item-name">— ${escape(p.display_name || 'Anónimo/a')}</div>
        <div class="pv-orac-item-foot">
          <span class="pv-orac-count">🙏 <strong data-count="${p.id}">${p.prayer_count || 0}</strong> persona${(p.prayer_count||0)===1?'':'s'} orando</span>
          <button class="pv-orac-pray-btn ${already ? 'prayed' : ''}" data-pray="${p.id}" ${already ? 'disabled' : ''}>${already ? '✓ Ya oraste' : '❤️ Yo oro por esto'}</button>
        </div>
      </article>`;
    }).join('');

    listEl.querySelectorAll('[data-pray]').forEach(btn => {
      btn.onclick = async () => {
        const id = btn.dataset.pray;
        btn.disabled = true;
        btn.textContent = '⏳ Orando…';
        const newCount = await pray(id);
        if (newCount !== null) {
          btn.classList.add('prayed');
          btn.textContent = '✓ Ya oraste';
          const cEl = panel.querySelector(`[data-count="${id}"]`);
          if (cEl) cEl.textContent = newCount;
          // Pequeño feedback espiritual
          setTimeout(() => {
            const msg = document.createElement('div');
            msg.textContent = '❤️ Gracias por orar';
            msg.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--brand);color:#fbf3df;padding:10px 18px;border-radius:999px;font-weight:700;z-index:1000060;box-shadow:0 6px 20px rgba(0,0,0,.3);animation:pv-fade-in .25s ease-out';
            document.body.appendChild(msg);
            setTimeout(() => msg.remove(), 1800);
          }, 100);
        } else {
          btn.disabled = false;
          btn.textContent = '❤️ Yo oro por esto';
          alert('No se pudo registrar la oración. Probá de nuevo.');
        }
      };
    });
  }

  function openForm(onSubmitted) {
    const overlay = document.createElement('div');
    overlay.className = 'pv-orac-form-backdrop';
    overlay.innerHTML = `
      <div class="pv-orac-form">
        <h3>✍️ Compartir mi petición</h3>
        <label for="pv-orac-cat-sel">Categoría</label>
        <select id="pv-orac-cat-sel">
          ${CATEGORIES.map(c => `<option value="${c.id}">${c.emoji} ${c.label}</option>`).join('')}
        </select>
        <label for="pv-orac-name-inp">Nombre o seudónimo (opcional)</label>
        <input type="text" id="pv-orac-name-inp" placeholder="Anónimo/a" maxlength="40" />
        <label for="pv-orac-txt">Tu petición de oración</label>
        <textarea id="pv-orac-txt" placeholder="Escribí lo que necesitás que oremos. Por favor sin datos sensibles ni teléfonos." maxlength="500"></textarea>
        <div class="pv-orac-counter"><span id="pv-orac-count">0</span> / 500</div>
        <div class="pv-orac-disclaimer">
          📋 Tu petición pasa por una moderación corta antes de publicarse (filtramos spam y datos sensibles). Puede tardar unas horas. <br>
          🔒 Tu identidad no se publica. Si querés podés firmar con seudónimo.
        </div>
        <div class="row">
          <button class="cancel" type="button">Cancelar</button>
          <button class="submit" type="button">Enviar</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const txt = overlay.querySelector('#pv-orac-txt');
    const counter = overlay.querySelector('#pv-orac-count');
    txt.addEventListener('input', () => counter.textContent = txt.value.length);

    overlay.querySelector('.cancel').onclick = () => overlay.remove();
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

    overlay.querySelector('.submit').onclick = async () => {
      const text = txt.value.trim();
      const name = overlay.querySelector('#pv-orac-name-inp').value.trim();
      const cat = overlay.querySelector('#pv-orac-cat-sel').value;
      if (text.length < 5) { alert('Escribí al menos 5 caracteres.'); return; }
      const btn = overlay.querySelector('.submit');
      btn.disabled = true; btn.textContent = '⏳ Enviando…';
      const result = await submitPrayer(text, name, cat);
      if (result && result.ok) {
        overlay.querySelector('.pv-orac-form').innerHTML = `
          <div style="text-align:center;padding:30px 10px">
            <div style="font-size:48px;margin-bottom:8px">🙏</div>
            <h3 style="margin:0 0 8px">¡Gracias!</h3>
            <p style="color:var(--muted);font-size:14px;line-height:1.6">Tu petición está esperando moderación corta para evitar spam. Una vez aprobada, hermanos de toda la comunidad van a poder orar por vos.</p>
            <button class="pv-orac-cta" style="margin-top:14px" id="pv-orac-close-ok">Volver</button>
          </div>
        `;
        overlay.querySelector('#pv-orac-close-ok').onclick = () => {
          overlay.remove();
          if (onSubmitted) onSubmitted();
        };
      } else {
        btn.disabled = false; btn.textContent = 'Enviar';
        const detail = result?.error ? '\n\nDetalle: ' + result.error.slice(0, 200) : '';
        alert('No se pudo enviar la petición.' + detail + '\n\nProbá de nuevo en un momento.');
      }
    };
  }

  // ── Home card: muestra 1 petición reciente + CTA al panel completo ──────
  function isHomeTab() {
    return (document.querySelector('h1')?.textContent || '').toLowerCase().includes('palabra para hoy');
  }

  function injectHomeStyles() {
    if (document.getElementById('pv-orac-home-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-orac-home-style';
    st.textContent = `
      .pv-orac-home-card{background:linear-gradient(135deg,var(--card),rgba(154,58,58,.05));border:1px solid var(--line);border-radius:18px;padding:14px 16px;display:flex;flex-direction:column;gap:10px;cursor:pointer}
      .pv-orac-home-card:hover{border-color:var(--brand)}
      .pv-orac-home-card .pv-orac-home-eyebrow{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--brand);font-weight:700;font-family:var(--font-sans);display:flex;align-items:center;justify-content:space-between;gap:8px}
      .pv-orac-home-card h3{margin:0;font-size:18px;letter-spacing:-.01em}
      .pv-orac-home-card .pv-orac-home-quote{background:var(--card2);border-left:3px solid var(--brand);padding:10px 12px;border-radius:0 10px 10px 0;font-size:14px;line-height:1.5;font-style:italic;color:var(--text);max-height:80px;overflow:hidden;position:relative}
      .pv-orac-home-card .pv-orac-home-quote::after{content:'';position:absolute;bottom:0;left:0;right:0;height:24px;background:linear-gradient(to bottom,transparent,var(--card2))}
      .pv-orac-home-card .pv-orac-home-meta{font-size:12px;color:var(--muted);font-family:var(--font-sans);display:flex;justify-content:space-between;gap:8px}
      .pv-orac-home-card .pv-orac-home-cta{background:var(--brand);color:#fbf3df;border:0;border-radius:999px;padding:10px;font-weight:700;font-size:13px;cursor:pointer;font-family:var(--font-sans);min-height:42px;width:100%;margin-top:2px}
    `;
    document.head.appendChild(st);
  }

  let _homeCardLoaded = false;
  async function renderHomeCard() {
    if (!isHomeTab()) {
      document.querySelector('.pv-orac-home-card')?.remove();
      _homeCardLoaded = false;
      return;
    }
    if (document.querySelector('.pv-orac-home-card')) return;
    if (_homeCardLoaded) return;
    _homeCardLoaded = true;

    injectHomeStyles();
    // Insertar después de la card de racha o del recordatorio, antes del menú "Más"
    const stack = document.querySelector('.app .stack');
    if (!stack) return;
    const anchor = document.querySelector('.pv-rem-card') || document.querySelector('.pv-racha-card') || stack.children[2];

    const card = document.createElement('section');
    card.className = 'pv-orac-home-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.innerHTML = `
      <div class="pv-orac-home-eyebrow">
        <span>🙏 Oramos juntos</span>
        <span style="color:var(--muted);font-weight:400">⏳ cargando…</span>
      </div>
      <h3>Llevamos cargas unos por otros</h3>
    `;
    card.onclick = open;
    if (anchor && anchor.parentElement === stack) {
      anchor.insertAdjacentElement('afterend', card);
    } else {
      stack.appendChild(card);
    }

    // Cargar petición destacada (la más reciente)
    try {
      const prayers = await listPrayers();
      if (!prayers.length) {
        card.innerHTML = `
          <div class="pv-orac-home-eyebrow">
            <span>🙏 Oramos juntos</span>
          </div>
          <h3>Sé el primero/a en pedir oración</h3>
          <p style="margin:0;font-size:14px;color:var(--muted);line-height:1.5">Compartí lo que cargás hoy. La comunidad va a orar por vos.</p>
          <button class="pv-orac-home-cta">✍️ Pedir oración</button>
        `;
        card.querySelector('button').onclick = (e) => { e.stopPropagation(); open(); };
      } else {
        const p = prayers[0];
        const cat = CATEGORIES.find(c => c.id === p.category) || CATEGORIES[0];
        card.innerHTML = `
          <div class="pv-orac-home-eyebrow">
            <span>🙏 Oramos juntos</span>
            <span style="color:var(--muted);font-weight:400">${prayers.length} peticiones</span>
          </div>
          <h3>${cat.emoji} ${cat.label} · ${timeAgo(p.approved_at || p.created_at)}</h3>
          <div class="pv-orac-home-quote">${escape(p.request_text)}</div>
          <div class="pv-orac-home-meta">
            <span>— ${escape(p.display_name || 'Anónimo/a')}</span>
            <span>🙏 ${p.prayer_count || 0} orando</span>
          </div>
          <button class="pv-orac-home-cta">Ver todas las peticiones</button>
        `;
      }
    } catch {
      card.remove();
      _homeCardLoaded = false;
    }
  }

  // Re-render al cambiar de tab
  setInterval(renderHomeCard, 4000);

  window.PVOracionesComunidad = { open, renderHomeCard };
})();

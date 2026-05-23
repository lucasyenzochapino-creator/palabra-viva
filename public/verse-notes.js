(() => {
  // ===========================================================================
  // PALABRA VIVA — Notas y resaltados por versículo
  // ===========================================================================
  // El usuario puede:
  //   · Resaltar versículos en 4 colores (amarillo, verde, azul, rosa)
  //   · Escribir notas personales en cada versículo
  //   · Ver indicador 📝 en versículos con nota
  //   · Sincronizar con Supabase si está logueado (tabla verse_notes)
  //   · Usar localStorage si no hay sesión

  const SUPA_URL = 'https://fuxojzmwyyecefxczfrn.supabase.co';
  const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1eG9qem13eXllY2VmeGN6ZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTU4MDAsImV4cCI6MjA5NTAzMTgwMH0.M4telJzC3kt7fNN86kvuqpL5-vVmCjdzE-hTDy6Igak';
  const LS_KEY = 'pv-notes';

  const COLORS = {
    yellow: { name: 'Amarillo', bg: 'rgba(245,158,11,.25)', border: 'rgba(245,158,11,.6)', dot: '#f59e0b' },
    green:  { name: 'Verde',    bg: 'rgba(34,197,94,.22)',  border: 'rgba(34,197,94,.6)',  dot: '#22c55e' },
    blue:   { name: 'Azul',     bg: 'rgba(59,130,246,.22)', border: 'rgba(59,130,246,.6)', dot: '#3b82f6' },
    pink:   { name: 'Rosa',     bg: 'rgba(236,72,153,.22)', border: 'rgba(236,72,153,.6)', dot: '#ec4899' }
  };

  // ── Storage local ─────────────────────────────────────────────────────────
  function loadAll() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); }
    catch { return {}; }
  }
  function saveAll(data) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
  }
  function getNote(verseId) {
    return loadAll()[verseId] || null;
  }
  function setNote(verseId, payload) {
    const all = loadAll();
    if (!payload || (!payload.note && payload.color === 'none')) {
      delete all[verseId];
    } else {
      all[verseId] = { ...payload, updated: Date.now() };
    }
    saveAll(all);
    syncOne(verseId, all[verseId]);
  }

  // ── Sync con Supabase ─────────────────────────────────────────────────────
  function getToken() { return window.PVAuth?.getToken?.() || ''; }
  function getUserId() { return window.PVAuth?.getUser?.()?.id || null; }

  async function syncOne(verseId, payload) {
    const token = getToken();
    const uid = getUserId();
    if (!token || !uid) return;
    const headers = {
      'apikey': SUPA_KEY,
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates,return=minimal'
    };
    try {
      if (!payload) {
        await fetch(`${SUPA_URL}/rest/v1/verse_notes?user_id=eq.${uid}&verse_id=eq.${encodeURIComponent(verseId)}`, {
          method: 'DELETE', headers
        });
        return;
      }
      // Parsear verse_id formato "Libro-Cap-Vers"
      const m = verseId.match(/^(.+)-(\d+)-(\d+)$/);
      const body = {
        user_id: uid,
        verse_id: verseId,
        book: m?.[1] || null,
        chapter: m ? parseInt(m[2], 10) : null,
        verse: m ? parseInt(m[3], 10) : null,
        color: payload.color || 'yellow',
        note: payload.note || null
      };
      await fetch(`${SUPA_URL}/rest/v1/verse_notes`, {
        method: 'POST', headers, body: JSON.stringify(body)
      });
    } catch {}
  }

  // Pull al loguearse
  async function pullAll() {
    const token = getToken();
    const uid = getUserId();
    if (!token || !uid) return;
    try {
      const res = await fetch(`${SUPA_URL}/rest/v1/verse_notes?user_id=eq.${uid}&select=*`, {
        headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) return;
      const rows = await res.json();
      const local = loadAll();
      let changed = false;
      for (const r of rows) {
        const cur = local[r.verse_id];
        const serverTime = +new Date(r.updated_at);
        if (!cur || (cur.updated || 0) < serverTime) {
          local[r.verse_id] = { color: r.color, note: r.note || '', updated: serverTime };
          changed = true;
        }
      }
      if (changed) {
        saveAll(local);
        applyHighlights();
      }
    } catch {}
  }
  document.addEventListener('pv-auth-change', () => setTimeout(pullAll, 300));

  // ── Estilos ───────────────────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('pv-notes-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-notes-style';
    const colorRules = Object.entries(COLORS).map(([k, c]) =>
      `.card.pv-h-${k}{border-color:${c.border}!important;background:linear-gradient(135deg,${c.bg},var(--card))!important}`
    ).join('');
    st.textContent = `
      ${colorRules}
      .pv-note-indicator{display:inline-block;margin-left:6px;font-size:13px;cursor:pointer}
      .pv-notes-modal{position:fixed;inset:0;z-index:9700;background:rgba(0,0,0,.8);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:18px}
      .pv-notes-card{background:var(--card,#171722);color:var(--text,#f8fafc);border:1px solid var(--line,#333447);border-radius:24px;padding:22px;max-width:480px;width:100%;display:flex;flex-direction:column;gap:14px;box-shadow:0 24px 60px rgba(0,0,0,.5);max-height:90vh;overflow-y:auto}
      .pv-notes-close{align-self:flex-end;background:var(--card2,#202031);border:1px solid var(--line,#333447);color:var(--text,#f8fafc);border-radius:999px;padding:7px 14px;font-weight:900;cursor:pointer}
      .pv-notes-ref{font-size:13px;color:var(--brand,#f59e0b);font-weight:900;text-transform:uppercase;letter-spacing:.06em;margin:0}
      .pv-notes-quote{font-size:17px;line-height:1.5;font-style:italic;color:var(--text,#f8fafc);padding:10px 12px;background:var(--card2,#202031);border-radius:14px;margin:0}
      .pv-notes-label{font-size:13px;color:var(--muted,#c8c5d8);font-weight:900;text-transform:uppercase;letter-spacing:.08em;margin:6px 0 4px}
      .pv-notes-colors{display:flex;gap:8px;flex-wrap:wrap}
      .pv-notes-color{width:44px;height:44px;border-radius:50%;border:3px solid transparent;cursor:pointer;display:grid;place-items:center;font-size:18px;font-weight:900}
      .pv-notes-color.on{border-color:var(--text,#f8fafc);box-shadow:0 0 0 2px var(--card,#171722),0 0 0 5px var(--brand,#f59e0b)}
      .pv-notes-textarea{width:100%;border:1px solid var(--line,#333447);background:var(--card2,#202031);color:var(--text,#f8fafc);border-radius:14px;padding:12px 14px;font:inherit;font-size:15px;line-height:1.55;outline:none;box-sizing:border-box;resize:vertical;min-height:120px}
      .pv-notes-textarea:focus{border-color:var(--brand,#f59e0b)}
      .pv-notes-actions{display:flex;gap:10px;flex-wrap:wrap}
      .pv-notes-btn{flex:1;min-width:140px;background:linear-gradient(135deg,var(--brand,#f59e0b),var(--brand2,#ec4899));color:#fff;border:0;border-radius:999px;padding:12px 16px;font-weight:900;font-size:15px;cursor:pointer;min-height:48px}
      .pv-notes-btn.ghost{background:var(--card2,#202031);color:var(--text,#f8fafc);border:1px solid var(--line,#333447)}
      .pv-notes-btn.danger{background:rgba(251,113,133,.15);color:#fb7185;border:1px solid rgba(251,113,133,.45)}
    `;
    document.head.appendChild(st);
  }

  // ── Modal de edición ──────────────────────────────────────────────────────
  function openModal(verseId, book, chapter, verse, text) {
    if (document.querySelector('.pv-notes-modal')) return;
    injectStyles();
    const existing = getNote(verseId);
    let curColor = existing?.color || 'none';
    let curNote = existing?.note || '';

    const modal = document.createElement('div');
    modal.className = 'pv-notes-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="pv-notes-card">
        <button class="pv-notes-close" data-close>Cerrar ✕</button>
        <p class="pv-notes-ref">${book} ${chapter}:${verse}</p>
        <p class="pv-notes-quote">“${(text || '').replace(/"/g, '&quot;')}”</p>

        <p class="pv-notes-label">Resaltar con color</p>
        <div class="pv-notes-colors">
          ${Object.entries(COLORS).map(([k,c]) =>
            `<button class="pv-notes-color ${curColor===k?'on':''}" data-color="${k}" style="background:${c.bg};border-color:${c.border}" aria-label="${c.name}"><span style="color:${c.dot}">●</span></button>`
          ).join('')}
          <button class="pv-notes-color ${curColor==='none'?'on':''}" data-color="none" style="background:var(--card2);border-color:var(--line)" aria-label="Sin color">∅</button>
        </div>

        <p class="pv-notes-label">Tu nota personal</p>
        <textarea class="pv-notes-textarea" id="pv-notes-input" placeholder="Escribí lo que Dios te habló con este versículo…">${(curNote || '').replace(/</g,'&lt;')}</textarea>

        <div class="pv-notes-actions">
          <button class="pv-notes-btn" data-save>💾 Guardar</button>
          ${existing ? '<button class="pv-notes-btn danger" data-del>🗑 Borrar nota</button>' : ''}
        </div>
      </div>
    `;
    const close = () => modal.remove();
    modal.querySelector('[data-close]').onclick = close;
    modal.addEventListener('click', e => { if (e.target === modal) close(); });

    modal.querySelectorAll('[data-color]').forEach(btn => {
      btn.onclick = () => {
        curColor = btn.dataset.color;
        modal.querySelectorAll('[data-color]').forEach(b => b.classList.toggle('on', b.dataset.color === curColor));
      };
    });

    modal.querySelector('[data-save]').onclick = () => {
      const note = modal.querySelector('#pv-notes-input').value.trim();
      if (curColor === 'none' && !note) {
        setNote(verseId, null);
      } else {
        setNote(verseId, { color: curColor === 'none' ? 'yellow' : curColor, note });
      }
      close();
      applyHighlights();
    };

    if (modal.querySelector('[data-del]')) {
      modal.querySelector('[data-del]').onclick = () => {
        if (confirm('¿Borrar esta nota y el resaltado?')) {
          setNote(verseId, null);
          close();
          applyHighlights();
        }
      };
    }

    document.body.appendChild(modal);
    setTimeout(() => modal.querySelector('#pv-notes-input').focus(), 100);
  }

  // ── Aplicar highlights en versículos del DOM ──────────────────────────────
  function parseVerseId(card) {
    const ref = card.querySelector('.ref')?.textContent || '';
    const m = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
    if (!m) return null;
    return {
      id: `${m[1]}-${m[2]}-${m[3]}`,
      book: m[1], chapter: parseInt(m[2], 10), verse: parseInt(m[3], 10)
    };
  }

  function applyHighlights() {
    const all = loadAll();
    const cards = document.querySelectorAll('.app .stack .card');
    cards.forEach(card => {
      const parsed = parseVerseId(card);
      if (!parsed) return;
      const note = all[parsed.id];
      // Limpiar clases anteriores
      Object.keys(COLORS).forEach(c => card.classList.remove('pv-h-' + c));
      if (note?.color && COLORS[note.color]) card.classList.add('pv-h-' + note.color);
      // Indicador 📝 si hay texto
      const ref = card.querySelector('.ref');
      const exist = ref?.querySelector('.pv-note-indicator');
      if (note?.note) {
        if (!exist && ref) {
          const span = document.createElement('span');
          span.className = 'pv-note-indicator';
          span.textContent = '📝';
          span.title = 'Tiene nota';
          ref.appendChild(span);
        }
      } else {
        exist?.remove();
      }
    });
  }

  // ── Inyectar botón "Nota" en cada versículo ───────────────────────────────
  function injectButtons() {
    const cards = document.querySelectorAll('.app .stack .card');
    cards.forEach(card => {
      const parsed = parseVerseId(card);
      if (!parsed) return;
      const text = card.querySelector('.verse')?.textContent?.replace(/^["“]|["”]$/g, '') || '';
      const row = card.querySelector('.row.wrap');
      if (!row) return;
      if (row.querySelector('.pv-note-btn')) return;
      const btn = document.createElement('button');
      btn.className = 'btn ghost pv-note-btn';
      btn.style.cssText = 'padding:8px 14px;font-size:14px;min-height:42px';
      const has = getNote(parsed.id);
      btn.textContent = has ? '📝 Nota' : '📝 Nota';
      btn.onclick = () => openModal(parsed.id, parsed.book, parsed.chapter, parsed.verse, text);
      row.appendChild(btn);
    });
  }

  function boot() {
    injectStyles();
    injectButtons();
    applyHighlights();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('load', boot);
  setInterval(boot, 2500);

  // Pull al cargar (si ya hay sesión)
  setTimeout(pullAll, 600);

  window.PVNotes = { open: openModal, get: getNote, set: setNote, applyHighlights };
})();

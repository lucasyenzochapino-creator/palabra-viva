(() => {
  // ===========================================================================
  // PALABRA VIVA — Generador de imagen para compartir versículos (canvas → PNG)
  // ===========================================================================
  // Diferencial vs apps similares: YouVersion lo tiene, Bible Gateway no.
  // Genera una tarjeta cuadrada (1080×1080) lista para Instagram/WhatsApp Status,
  // y dispara Web Share API en móvil (con fallback a descarga en desktop).

  const SIZE = 1080;   // Cuadrado Instagram
  const PADDING = 96;  // Margen interno

  // Paleta — coincide con el tema sepia (cálido, no agresivo)
  const PALETTES = [
    { // Sepia cálido — default
      bg1: '#1a0e05', bg2: '#3a2410', accent: '#f5deb3', text: '#fdf6e3', soft: '#d4a574'
    },
    { // Oscuro dorado
      bg1: '#0a0a14', bg2: '#1a1a2e', accent: '#f59e0b', text: '#f8fafc', soft: '#fbbf24'
    },
    { // Rosa atardecer
      bg1: '#3a0d2a', bg2: '#7c2d56', accent: '#fcd5ce', text: '#fff5f7', soft: '#f9a8d4'
    },
    { // Verde oliva
      bg1: '#0d2317', bg2: '#1e3a2a', accent: '#bef264', text: '#f0fdf4', soft: '#86efac'
    },
    { // Azul noche
      bg1: '#0a1929', bg2: '#1e3a5f', accent: '#bae6fd', text: '#f0f9ff', soft: '#7dd3fc'
    },
  ];

  function pickPalette(seed) {
    let h = 0;
    for (let i = 0; i < (seed || '').length; i++) h = ((h * 31) + seed.charCodeAt(i)) >>> 0;
    return PALETTES[h % PALETTES.length];
  }

  // Wrap de texto en canvas con tamaño dinámico para que quepa
  function wrapText(ctx, text, maxWidth, lineHeight) {
    const words = (text || '').split(/\s+/);
    const lines = [];
    let line = '';
    for (const w of words) {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  function fitFontSize(ctx, text, maxWidth, maxHeight, fontFamily, weight) {
    let size = 76;
    while (size >= 28) {
      ctx.font = `${weight} ${size}px ${fontFamily}`;
      const lh = Math.round(size * 1.28);
      const lines = wrapText(ctx, text, maxWidth, lh);
      if (lines.length * lh <= maxHeight) {
        return { size, lines, lh };
      }
      size -= 4;
    }
    ctx.font = `${weight} 28px ${fontFamily}`;
    return { size: 28, lines: wrapText(ctx, text, maxWidth, 36), lh: 36 };
  }

  function generateCanvas({ book, chapter, verse, text }) {
    const canvas = document.createElement('canvas');
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext('2d');

    const ref = `${book} ${chapter}${verse ? ':' + verse : ''}`;
    const pal = pickPalette(ref);

    // Fondo: gradiente diagonal
    const grad = ctx.createLinearGradient(0, 0, SIZE, SIZE);
    grad.addColorStop(0, pal.bg1);
    grad.addColorStop(1, pal.bg2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Capa decorativa: círculos suaves
    ctx.globalAlpha = 0.10;
    ctx.fillStyle = pal.accent;
    ctx.beginPath(); ctx.arc(SIZE * 0.85, SIZE * 0.15, 220, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(SIZE * 0.12, SIZE * 0.88, 280, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    // Header — eyebrow "Palabra Viva"
    ctx.fillStyle = pal.accent;
    ctx.font = '900 28px Inter, system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('✦ PALABRA VIVA', PADDING, PADDING + 28);

    // Referencia bíblica
    ctx.fillStyle = pal.soft;
    ctx.font = '900 44px Inter, system-ui, sans-serif';
    ctx.fillText(ref.toUpperCase(), PADDING, PADDING + 100);

    // Cita — tamaño adaptativo
    const maxTextWidth  = SIZE - PADDING * 2;
    const maxTextHeight = SIZE - PADDING * 2 - 240 - 120; // -header -footer
    const verseText = `“${text}”`;
    const { size, lines, lh } = fitFontSize(ctx, verseText, maxTextWidth, maxTextHeight, 'Inter, system-ui, sans-serif', '650');

    ctx.fillStyle = pal.text;
    ctx.font = `650 ${size}px Inter, system-ui, sans-serif`;
    let y = PADDING + 220 + lh;
    for (const ln of lines) {
      ctx.fillText(ln, PADDING, y);
      y += lh;
    }

    // Footer — URL de la app
    ctx.fillStyle = pal.soft;
    ctx.font = '700 26px Inter, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('palabra-viva-oficepro.vercel.app', PADDING, SIZE - PADDING + 10);

    // Marca de cita decorativa (comilla grande)
    ctx.globalAlpha = 0.14;
    ctx.fillStyle = pal.accent;
    ctx.font = '900 360px Georgia, serif';
    ctx.textAlign = 'right';
    ctx.fillText('"', SIZE - PADDING + 60, SIZE - PADDING + 30);
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';

    return canvas;
  }

  function canvasToBlob(canvas) {
    return new Promise(resolve => canvas.toBlob(resolve, 'image/png', 0.95));
  }

  // API pública — invocable desde React o desde otros módulos
  async function shareVerseImage({ book, chapter, verse, text }) {
    if (!book || !chapter || !text) return false;
    const canvas = generateCanvas({ book, chapter, verse, text });
    const blob   = await canvasToBlob(canvas);
    if (!blob) return false;

    const ref = `${book} ${chapter}${verse ? ':' + verse : ''}`;
    const file = new File([blob], `palabra-viva-${ref.replace(/\s+/g, '-')}.png`, { type: 'image/png' });
    const shareText = `${ref}\n\n"${text}"\n\nCompartido desde Palabra Viva`;

    // Web Share API con archivo (Android, iOS 15+)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: ref, text: shareText });
        return true;
      } catch (e) {
        if (e.name === 'AbortError') return false;
      }
    }

    // Fallback: descargar
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
    return true;
  }

  // Preview en pantalla (para que el usuario vea antes de compartir)
  function previewVerseImage(verseData) {
    const canvas = generateCanvas(verseData);
    const dataUrl = canvas.toDataURL('image/png');
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9700;background:rgba(0,0,0,.85);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;gap:14px';
    overlay.innerHTML = `
      <img src="${dataUrl}" alt="Vista previa del versículo" style="max-width:min(420px,90vw);max-height:60vh;border-radius:18px;box-shadow:0 24px 60px rgba(0,0,0,.5)" />
      <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">
        <button data-act="share" style="border:0;border-radius:999px;padding:14px 22px;font-weight:900;font-size:15px;background:linear-gradient(135deg,#f59e0b,#ec4899);color:white;cursor:pointer">📤 Compartir</button>
        <button data-act="close" style="border:1px solid #555;border-radius:999px;padding:14px 22px;font-weight:900;font-size:15px;background:rgba(255,255,255,.08);color:white;cursor:pointer">Cerrar</button>
      </div>
    `;
    overlay.querySelector('[data-act="share"]').onclick = () => { overlay.remove(); shareVerseImage(verseData); };
    overlay.querySelector('[data-act="close"]').onclick = () => overlay.remove();
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
  }

  window.PVShareVerse = {
    share:   shareVerseImage,
    preview: previewVerseImage
  };
})();

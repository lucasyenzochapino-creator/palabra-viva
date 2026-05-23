(() => {
  // ===========================================================================
  // PALABRA VIVA — Onboarding de bienvenida (primera vez)
  // ===========================================================================
  // Tour de 4 pasos breves que se muestra UNA VEZ por dispositivo.
  // Diseñado pensando en adultos mayores: tipografía grande, contraste alto,
  // botones grandes, lenguaje cálido.

  const FLAG_KEY = 'pv-onboarded-v1';

  const STEPS = [
    {
      emoji: '✝️',
      title: '¡Bienvenido a Palabra Viva!',
      body: 'Tu compañera diaria de fe, Biblia y oración. Es 100% gratuita, sin publicidad.',
      cta: 'Comenzar'
    },
    {
      emoji: '📖',
      title: 'La Biblia, fácil y a tu ritmo',
      body: 'Leé cualquier libro o capítulo. Tocá 🎧 en los Planes para escuchar la lectura con voz humana.',
      cta: 'Siguiente'
    },
    {
      emoji: '💭',
      title: '¿Cómo te sentís?',
      body: 'Si estás triste, ansioso, cansado o agradecido — escribilo. Te damos un versículo y una oración pensada para vos.',
      cta: 'Siguiente'
    },
    {
      emoji: '📻',
      title: 'Radios cristianas en vivo',
      body: 'Más de 20 emisoras evangélicas en español. Funcionan en segundo plano y en el auto (Android Auto / CarPlay).',
      cta: '¡Empezar a usar!'
    }
  ];

  function injectStyles() {
    if (document.getElementById('pv-onboard-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-onboard-style';
    st.textContent = `
      .pv-onb-overlay{
        position:fixed;inset:0;z-index:9800;background:rgba(10,7,3,.85);backdrop-filter:blur(8px);
        display:flex;align-items:center;justify-content:center;padding:18px;
        animation:pv-onb-in .2s ease-out;
      }
      @keyframes pv-onb-in{from{opacity:0}to{opacity:1}}
      .pv-onb-card{
        background:linear-gradient(135deg,#f5deb3,#fff7e8);
        color:#27190c;border-radius:32px;padding:32px 28px;
        max-width:480px;width:100%;
        box-shadow:0 30px 80px rgba(0,0,0,.5);
        display:flex;flex-direction:column;gap:18px;align-items:center;text-align:center;
        animation:pv-onb-slide .3s ease-out;
      }
      @keyframes pv-onb-slide{from{transform:translateY(20px);opacity:0}to{transform:none;opacity:1}}
      .pv-onb-emoji{font-size:88px;line-height:1;margin:6px 0 4px}
      .pv-onb-title{font-size:28px;line-height:1.1;font-weight:900;margin:0;letter-spacing:-.02em;color:#27190c}
      .pv-onb-body{font-size:18px;line-height:1.5;margin:0;color:#604329;font-weight:500}
      .pv-onb-dots{display:flex;gap:8px;margin:4px 0 6px}
      .pv-onb-dot{width:10px;height:10px;border-radius:50%;background:rgba(124,74,30,.25)}
      .pv-onb-dot.on{background:#7c4a1e;width:30px;border-radius:5px;transition:width .2s}
      .pv-onb-cta{
        background:linear-gradient(135deg,#7c4a1e,#b45309);color:#fff;border:0;
        border-radius:999px;padding:16px 36px;font-size:18px;font-weight:900;
        cursor:pointer;min-width:200px;min-height:56px;
        box-shadow:0 12px 30px rgba(124,74,30,.4);
      }
      .pv-onb-cta:active{transform:scale(.97)}
      .pv-onb-skip{
        background:transparent;border:0;color:#604329;
        font-size:14px;font-weight:700;text-decoration:underline;cursor:pointer;
        padding:8px;margin-top:-4px;
      }
      @media (max-width:380px){
        .pv-onb-card{padding:24px 20px;gap:14px}
        .pv-onb-emoji{font-size:72px}
        .pv-onb-title{font-size:24px}
        .pv-onb-body{font-size:16px}
      }
    `;
    document.head.appendChild(st);
  }

  function show(stepIndex) {
    if (stepIndex >= STEPS.length) return finish();
    const step = STEPS[stepIndex];

    document.querySelector('.pv-onb-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.className = 'pv-onb-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', step.title);

    const dots = STEPS.map((_, i) => `<span class="pv-onb-dot ${i === stepIndex ? 'on' : ''}"></span>`).join('');

    overlay.innerHTML = `
      <section class="pv-onb-card">
        <div class="pv-onb-emoji" aria-hidden="true">${step.emoji}</div>
        <h2 class="pv-onb-title">${step.title}</h2>
        <p class="pv-onb-body">${step.body}</p>
        <div class="pv-onb-dots" aria-hidden="true">${dots}</div>
        <button class="pv-onb-cta" data-act="next">${step.cta}</button>
        ${stepIndex < STEPS.length - 1 ? '<button class="pv-onb-skip" data-act="skip">Saltar tour</button>' : ''}
      </section>
    `;
    overlay.querySelector('[data-act="next"]').onclick = () => show(stepIndex + 1);
    overlay.querySelector('[data-act="skip"]')?.addEventListener('click', finish);
    document.body.appendChild(overlay);

    // Focus en el botón para que Enter funcione
    setTimeout(() => overlay.querySelector('[data-act="next"]')?.focus(), 60);
  }

  function finish() {
    try { localStorage.setItem(FLAG_KEY, '1'); } catch {}
    document.querySelector('.pv-onb-overlay')?.remove();
  }

  function boot() {
    try {
      if (localStorage.getItem(FLAG_KEY)) return; // ya se mostró
    } catch { return; }
    injectStyles();
    // Esperar a que React renderice el home
    let attempts = 0;
    const tryShow = () => {
      const h1 = document.querySelector('h1');
      if (h1 && (h1.textContent || '').includes('palabra para hoy')) {
        setTimeout(() => show(0), 400);
      } else if (attempts++ < 40) {
        setTimeout(tryShow, 250);
      }
    };
    tryShow();
  }

  // Permite re-mostrar manualmente (ej. desde admin o "ayuda")
  window.PVOnboarding = {
    show: () => { try { localStorage.removeItem(FLAG_KEY); } catch {} show(0); },
    reset: () => { try { localStorage.removeItem(FLAG_KEY); } catch {} }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

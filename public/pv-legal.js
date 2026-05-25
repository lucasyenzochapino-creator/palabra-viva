(() => {
  // ===========================================================================
  // PALABRA VIVA — Páginas legales (Privacidad + Términos)
  // ===========================================================================
  // Modal con dos pestañas: Política de Privacidad y Términos de Uso.
  // Importante para credibilidad de la app y cumplimiento básico
  // (Ley 25.326 Argentina + buenas prácticas).

  const VERSION = '2026-05-25';
  const ADMIN_EMAIL = 'palabravivamm@gmail.com';

  function injectStyles() {
    if (document.getElementById('pv-legal-style')) return;
    const st = document.createElement('style');
    st.id = 'pv-legal-style';
    st.textContent = `
      .pv-legal-panel{position:fixed;inset:0;z-index:1000060;background:var(--bg);color:var(--text);overflow-y:auto;padding:14px 14px calc(80px + env(safe-area-inset-bottom))}
      .pv-legal-inner{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:14px}
      .pv-legal-head{display:flex;justify-content:space-between;gap:10px;position:sticky;top:0;background:var(--bg);padding:8px 0 14px;z-index:5;border-bottom:1px solid var(--line)}
      .pv-legal-head h1{margin:4px 0;font-size:clamp(22px,5.5vw,28px);letter-spacing:-.02em}
      .pv-legal-head .ver{font-size:11px;color:var(--muted);font-family:var(--font-sans);text-transform:uppercase;letter-spacing:.08em}
      .pv-legal-close{border:1px solid var(--line);background:var(--card);color:var(--text);border-radius:999px;padding:9px 14px;font-weight:600;cursor:pointer;height:fit-content;font-size:13px}
      .pv-legal-tabs{display:flex;gap:8px;padding:4px;background:var(--card2);border-radius:999px}
      .pv-legal-tab{flex:1;border:0;background:transparent;color:var(--text);padding:10px 12px;border-radius:999px;font-weight:700;cursor:pointer;font-family:var(--font-sans);font-size:14px}
      .pv-legal-tab.active{background:var(--brand);color:#fbf3df}
      .pv-legal-body{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:18px;line-height:1.65}
      .pv-legal-body h2{margin:0 0 10px;font-size:20px;letter-spacing:-.02em}
      .pv-legal-body h3{margin:18px 0 6px;font-size:16px;font-family:var(--font-sans);color:var(--accent)}
      .pv-legal-body p{margin:0 0 12px;font-size:15px}
      .pv-legal-body ul{padding-left:22px;margin:0 0 12px}
      .pv-legal-body li{margin-bottom:6px;font-size:15px}
      .pv-legal-body strong{color:var(--brand)}
      .pv-legal-body a{color:var(--brand);text-decoration:underline}
      .pv-legal-foot{padding:14px;text-align:center;color:var(--muted);font-size:13px;font-family:var(--font-sans)}
    `;
    document.head.appendChild(st);
  }

  function privacyHtml() {
    return `
      <h2>🔐 Política de Privacidad</h2>
      <p>Palabra Viva (en adelante, <strong>"la App"</strong>) respeta tu privacidad. Esta política explica de forma clara qué datos recolectamos, por qué, y cómo los protegemos.</p>

      <h3>1. Datos que recolectamos</h3>
      <p>Si <strong>NO te registrás</strong>: la App funciona sin enviar ningún dato personal. Tus notas, marcadores, plan de lectura y configuración se guardan únicamente en tu dispositivo (localStorage).</p>
      <p>Si <strong>te registrás</strong>, recolectamos:</p>
      <ul>
        <li><strong>Email</strong> — para identificarte y permitirte recuperar tu cuenta.</li>
        <li><strong>Contraseña</strong> — guardada de forma encriptada (nunca la vemos en texto plano).</li>
        <li><strong>Nombre para mostrar</strong> (opcional) — solo si lo cargás.</li>
        <li><strong>Datos de uso anónimos</strong> — visitas a páginas, sin identificarte personalmente, para mejorar la app.</li>
      </ul>
      <p>Si activás <strong>notificaciones</strong> también guardamos:</p>
      <ul>
        <li><strong>Endpoint de push</strong> generado por tu navegador (clave técnica, no identifica a la persona).</li>
        <li><strong>Hora elegida</strong> para enviarte el versículo diario.</li>
        <li><strong>Zona horaria y modelo de dispositivo</strong> — solo para enviarte la notificación a la hora correcta.</li>
      </ul>

      <h3>2. Para qué los usamos</h3>
      <ul>
        <li>Permitirte iniciar sesión en distintos dispositivos.</li>
        <li>Sincronizar tus notas y marcadores entre tus dispositivos.</li>
        <li>Enviarte la notificación diaria si la activaste.</li>
        <li>Mejorar la app analizando uso agregado (qué secciones se usan más).</li>
      </ul>
      <p><strong>Nunca</strong> vendemos ni compartimos tus datos con terceros con fines comerciales.</p>

      <h3>3. Dónde se guardan</h3>
      <p>Usamos <strong>Supabase</strong> (servidor en Sudamérica - São Paulo) como base de datos, y <strong>Vercel</strong> (Estados Unidos) como servidor web. Ambos cumplen con estándares internacionales de seguridad (TLS, encriptación en reposo).</p>

      <h3>4. Tus derechos</h3>
      <p>Según la Ley 25.326 (Protección de Datos Personales — Argentina) y reglamentaciones internacionales, tenés derecho a:</p>
      <ul>
        <li><strong>Acceder</strong> a tus datos personales.</li>
        <li><strong>Rectificarlos</strong> si están incorrectos.</li>
        <li><strong>Solicitar su eliminación</strong> en cualquier momento.</li>
        <li><strong>Revocar tu consentimiento</strong> a las notificaciones (desde "Ajustes" o desde "Mis dispositivos").</li>
      </ul>
      <p>Para ejercer cualquiera de estos derechos, escribinos a <a href="mailto:${ADMIN_EMAIL}">${ADMIN_EMAIL}</a> y procesaremos tu pedido dentro de los 10 días hábiles.</p>

      <h3>5. Cookies y rastreo</h3>
      <p>No usamos cookies de rastreo ni publicitarias. Usamos <strong>localStorage</strong> (almacenamiento local de tu navegador) para guardar tus preferencias, y un sistema de analytics anónimo sin cookies (sin rastreo entre sitios).</p>

      <h3>6. Menores de edad</h3>
      <p>La sección "Biblia para niños" está pensada para usar con acompañamiento de un adulto. No recolectamos datos de menores de 13 años. Si tenés esa edad y querés usar la app, pediles a tus papás que se registren ellos.</p>

      <h3>7. Cambios en esta política</h3>
      <p>Si hacemos cambios importantes en cómo manejamos tus datos, te notificaremos via email (si te registraste) o desde un aviso dentro de la app. La fecha de la última actualización está al pie de este documento.</p>

      <h3>8. Contacto</h3>
      <p>¿Dudas, sugerencias o pedido de baja? <a href="mailto:${ADMIN_EMAIL}">${ADMIN_EMAIL}</a></p>
    `;
  }

  function termsHtml() {
    return `
      <h2>📜 Términos de Uso</h2>
      <p>Bienvenida/o a <strong>Palabra Viva</strong>. Al usar esta app aceptás estos términos. Son simples y están escritos para que se entiendan.</p>

      <h3>1. Qué es Palabra Viva</h3>
      <p>Es una aplicación gratuita que ofrece acceso a la Biblia (texto y audio), versículos diarios, oraciones, planes de lectura, radios cristianas y otros recursos para el crecimiento espiritual de la comunidad cristiana de habla hispana.</p>

      <h3>2. Uso permitido</h3>
      <p>Podés usar la App libremente para:</p>
      <ul>
        <li>Leer y escuchar la Biblia para uso personal o familiar.</li>
        <li>Compartir versículos, imágenes generadas y enlaces a la App con amigos y familia.</li>
        <li>Sugerir mejoras y reportar errores.</li>
      </ul>

      <h3>3. Uso NO permitido</h3>
      <ul>
        <li>Redistribuir o reempaquetar el contenido de la App con fines comerciales sin autorización escrita.</li>
        <li>Usar la App de forma que viole leyes locales o internacionales.</li>
        <li>Intentar acceder a datos de otros usuarios o vulnerar la seguridad del sistema.</li>
        <li>Usar la App para propagar discurso de odio, ofensivo o contrario a la fe cristiana.</li>
      </ul>

      <h3>4. Contenido de terceros</h3>
      <p>La App incluye:</p>
      <ul>
        <li><strong>Texto bíblico</strong>: dominio público (Reina-Valera 1909/1960) o usado bajo licencia.</li>
        <li><strong>Audio bíblico</strong>: archive.org bajo licencia Creative Commons.</li>
        <li><strong>Radios cristianas</strong>: streams públicos de cada emisora, ofrecidos como acceso facilitado sin alterar el contenido original.</li>
        <li><strong>Imágenes</strong>: Unsplash + Wikimedia Commons bajo licencias libres.</li>
      </ul>
      <p>Todos los derechos pertenecen a sus respectivos titulares. Si sos titular de algún contenido y querés que lo removamos, escribinos.</p>

      <h3>5. Sin garantía</h3>
      <p>La App se ofrece <strong>"tal como está"</strong>. Hacemos lo posible para que funcione bien, pero no garantizamos disponibilidad 100% del tiempo ni ausencia total de errores. Si encontrás un problema, te agradecemos mucho que nos lo cuentes.</p>

      <h3>6. Donaciones</h3>
      <p>Las donaciones son <strong>completamente voluntarias</strong>. Toda la app es gratuita con o sin donación. Los aportes se usan exclusivamente para cubrir costos de infraestructura (servidor, dominio, etc.) y mejoras de la App.</p>

      <h3>7. Sin diagnóstico ni asesoramiento profesional</h3>
      <p>La App ofrece contenido inspiracional y bíblico, pero <strong>no reemplaza</strong> asesoramiento médico, psicológico, legal ni espiritual profesional. Si atravesás una crisis grave, buscá ayuda profesional.</p>

      <h3>8. Cambios y discontinuación</h3>
      <p>Nos reservamos el derecho de modificar, agregar o discontinuar funcionalidades en cualquier momento. Si la App va a cerrar, lo informaremos con al menos 30 días de anticipación.</p>

      <h3>9. Jurisdicción</h3>
      <p>Esta App se rige por las leyes de la República Argentina. Para cualquier controversia, las partes se someten a los tribunales ordinarios de la Ciudad de Buenos Aires.</p>

      <h3>10. Contacto</h3>
      <p>Para cualquier consulta sobre estos términos: <a href="mailto:${ADMIN_EMAIL}">${ADMIN_EMAIL}</a></p>
    `;
  }

  function open(initialTab = 'privacy') {
    if (document.querySelector('.pv-legal-panel')) return;
    injectStyles();
    history.pushState({ pvLegal: true }, '', location.href.split('#')[0] + '#legal');

    const panel = document.createElement('section');
    panel.className = 'pv-legal-panel';
    panel.setAttribute('aria-label', 'Documentos legales');
    panel.innerHTML = `
      <div class="pv-legal-inner">
        <div class="pv-legal-head">
          <div>
            <div class="ver">Documentos legales · v${VERSION}</div>
            <h1>📋 Privacidad y términos</h1>
          </div>
          <button class="pv-legal-close" data-close>Cerrar ✕</button>
        </div>
        <div class="pv-legal-tabs" role="tablist">
          <button class="pv-legal-tab ${initialTab === 'privacy' ? 'active' : ''}" data-tab="privacy">🔐 Privacidad</button>
          <button class="pv-legal-tab ${initialTab === 'terms'   ? 'active' : ''}" data-tab="terms">📜 Términos</button>
        </div>
        <article class="pv-legal-body" id="pv-legal-content">${initialTab === 'privacy' ? privacyHtml() : termsHtml()}</article>
        <div class="pv-legal-foot">Última actualización: ${VERSION}<br>Para dudas: <a href="mailto:${ADMIN_EMAIL}">${ADMIN_EMAIL}</a></div>
      </div>
    `;

    function close(useHistory = true) {
      window.removeEventListener('popstate', onPop);
      panel.remove();
      if (useHistory && location.hash === '#legal') {
        window._pvPanelClosing = true;
        history.back();
      }
    }
    function onPop() {
      if (location.hash === '#legal') return;
      window.removeEventListener('popstate', onPop);
      panel.remove();
    }

    panel.querySelector('[data-close]').onclick = () => close(true);
    panel.querySelectorAll('[data-tab]').forEach(btn => {
      btn.onclick = () => {
        panel.querySelectorAll('.pv-legal-tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        const content = panel.querySelector('#pv-legal-content');
        content.innerHTML = btn.dataset.tab === 'privacy' ? privacyHtml() : termsHtml();
        content.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
    });

    document.body.appendChild(panel);
    window.addEventListener('popstate', onPop);
  }

  window.PVLegal = {
    open,
    openPrivacy: () => open('privacy'),
    openTerms: () => open('terms')
  };
})();

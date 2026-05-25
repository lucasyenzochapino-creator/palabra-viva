const VERSION    = 'palabra-viva-v11';
const RUNTIME    = 'palabra-viva-runtime-v11';
const APP_SHELL  = [
  '/',
  '/manifest.webmanifest',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-192.png',
  '/icon-maskable-512.png',
  '/apple-touch-icon.png',
  '/favicon-32.png'
];

// URLs de audio y streaming que NUNCA se deben interceptar ni cachear.
// El navegador los maneja directamente para que el audio en segundo plano funcione.
const AUDIO_PATTERNS = [
  /\.mp3(\?|$)/i,
  /\.m3u8(\?|$)/i,
  /\.ogg(\?|$)/i,
  /\.aac(\?|$)/i,
  /\.opus(\?|$)/i,
  /archive\.org\/download/i,
  /zeno\.fm/i, /radioca\.st/i, /radiomast\.io/i, /305stream\.com/i,
  /livestreamcdn\.net/i, /streamingecuador\.net/i, /novotempo\.com/i,
  /radio\.co/i, /unoredcdn\.net/i, /streams\.radio/i, /sp\.unoredcdn/i,
  /stream\.live\./i, /stream\.zeno/i, /stream1\./i,
  /\/stream$/i, /\/stream\?/i, /\/listen$/i, /playlist\.m3u8/i,
];

// Llamadas a Supabase: NUNCA cachear (datos sensibles y dinámicos)
const SUPABASE_PATTERN = /supabase\.co\//i;

function isAudioUrl(url) {
  return AUDIO_PATTERNS.some(re => re.test(url));
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(APP_SHELL).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== VERSION && key !== RUNTIME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = event.request.url;

  // Audio/streams: pasar directo al navegador
  if (isAudioUrl(url)) return;

  // Supabase: nunca cachear
  if (SUPABASE_PATTERN.test(url)) return;

  const request = event.request;
  const isNavigation = request.mode === 'navigate';

  // Assets con query param ?v=X son cache-busted intencionalmente.
  // Estrategia: network-first → siempre traemos la versión NUEVA si hay red.
  // Esto evita el bug "el SW sigue sirviendo el JS viejo" tras un deploy.
  try {
    const urlObj = new URL(url);
    if (urlObj.searchParams.has('v') && !isNavigation) {
      event.respondWith(
        fetch(request).then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(RUNTIME).then((c) => c.put(request, copy)).catch(() => {});
          }
          return response;
        }).catch(() => caches.match(request))
      );
      return;
    }
  } catch {}

  // Estrategia para navegación (HTML): network-first con fallback al cache
  // → garantiza que siempre obtengamos el HTML más nuevo cuando hay red,
  //   pero si no hay red, abre la app igual.
  if (isNavigation) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME).then((c) => c.put(request, copy));
          return response;
        })
        .catch(() =>
          caches.match(request).then((r) => r || caches.match('/'))
        )
    );
    return;
  }

  // Para assets (JS, CSS, JSON, imágenes): stale-while-revalidate
  //   1. Devolver inmediatamente del cache si existe (rápido + offline)
  //   2. En paralelo, actualizar el cache en background con la red
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request).then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(RUNTIME).then((c) => c.put(request, copy));
        }
        return response;
      }).catch(() => cached);

      return cached || networkFetch;
    })
  );
});

// Permite a la app pedirle al SW que se actualice (skipWaiting)
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

// Click en notificación → abrir/enfocar la app + limpiar badge "1" del ícono
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // Limpiar el contador "1" del ícono de la app
  try { self.navigator.clearAppBadge?.(); } catch {}
  try { self.registration.clearAppBadge?.(); } catch {}
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes(self.location.origin)) {
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});

// Cuando se cierra una notificación (sin click), también limpiar badge
self.addEventListener('notificationclose', () => {
  try { self.navigator.clearAppBadge?.(); } catch {}
  try { self.registration.clearAppBadge?.(); } catch {}
});

// ── Web Push: recibir push del server y mostrar notificación ──────────────
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: 'Palabra Viva', body: event.data?.text() || '' };
  }
  const title = data.title || '📖 Palabra Viva';
  const options = {
    body: data.body || '',
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/icon-192.png',
    tag: data.tag || 'pv-push',
    data: { url: data.url || '/' },
    requireInteraction: false,
    vibrate: [200, 100, 200]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Re-subscribe si el browser invalida la suscripción
self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil(
    (async () => {
      try {
        if (event.oldSubscription) {
          // Try to renew with same key
          const newSub = await self.registration.pushManager.subscribe(event.oldSubscription.options);
          // Sería ideal notificar al server con el nuevo endpoint, pero por
          // ahora dejamos que el cliente vuelva a suscribirse al abrir la app.
          console.log('[SW] Push subscription renewed', newSub.endpoint);
        }
      } catch (e) {
        console.warn('[SW] pushsubscriptionchange failed', e);
      }
    })()
  );
});

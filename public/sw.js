const VERSION    = 'palabra-viva-v7';
const RUNTIME    = 'palabra-viva-runtime-v7';
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

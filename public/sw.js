const CACHE_NAME = 'palabra-viva-v5';
const APP_SHELL = ['/manifest.webmanifest', '/icon.svg'];

// URLs de audio y streaming que NUNCA se deben interceptar ni cachear.
// El navegador los maneja directamente para que el audio en segundo plano funcione.
const AUDIO_PATTERNS = [
  /\.mp3(\?|$)/i,
  /\.m3u8(\?|$)/i,
  /\.ogg(\?|$)/i,
  /\.aac(\?|$)/i,
  /\.opus(\?|$)/i,
  /archive\.org\/download/i,
  /zeno\.fm/i,
  /radioca\.st/i,
  /radiomast\.io/i,
  /305stream\.com/i,
  /livestreamcdn\.net/i,
  /streamingecuador\.net/i,
  /novotempo\.com/i,
  /radio\.co/i,
  /unoredcdn\.net/i,
  /streams\.radio/i,
  /sp\.unoredcdn/i,
  /stream\.live\./i,
  /stream\.zeno/i,
  /stream1\./i,
  /\/stream$/i,
  /\/stream\?/i,
  /\/listen$/i,
  /playlist\.m3u8/i,
];

function isAudioUrl(url) {
  return AUDIO_PATTERNS.some(re => re.test(url));
}

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = event.request.url;

  // ── Audio/streams: pasar directo al navegador, sin interceptar ────────
  // Crítico para que el audio siga funcionando en segundo plano.
  if (isAudioUrl(url)) return;

  const request = event.request;
  const isNavigation = request.mode === 'navigate';

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => {
        if (isNavigation) return caches.match('/index.html');
        return caches.match(request);
      })
  );
});

// MighT service worker: network-first for the app (dev-friendly), cache-first for art & fonts, never caches /api.
const CACHE = "might-v2";
const PRECACHE = [
  "/",
  "/manifest.webmanifest",
  "/fonts/MonaSans.ttf",
  "/brand/logo-white.svg",
  "/brand/logo-black.svg",
  "/brand/silhouette.svg",
  "/icon-192.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin || url.pathname.startsWith("/api")) return;

  const isAsset = /^\/(figures|fonts|brand)\//.test(url.pathname);
  if (isAsset) {
    e.respondWith(
      caches.match(e.request).then(
        (hit) =>
          hit ||
          fetch(e.request).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
            return res;
          }),
      ),
    );
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok && (e.request.mode === "navigate" || url.pathname.startsWith("/assets/"))) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then((hit) => hit || caches.match("/"))),
  );
});

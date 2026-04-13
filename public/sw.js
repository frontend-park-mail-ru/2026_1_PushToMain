const CACHE_NAME = "app-v1";
const APP_SHELL = [
  "/",
  "/index.html",
  "8c1cbe877c7fb2a26df6.ttf",
  "eab2686c0c146e017020.ttf",
  "public/assets/svg/Logo.svg",
  "public/assets/svg/favicon.svg",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        }),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== "GET") return;

  if (url.pathname.startsWith("/api/")) return;

  if (
    url.pathname.includes("hot-update") ||
    url.pathname.includes("webpack") ||
    url.pathname.includes("sockjs") ||
    url.port === "3000"
  ) {
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match("/index.html");

        try {
          const network = await fetch(req);
          cache.put("/index.html", network.clone());
          return network;
        } catch {
          return cached;
        }
      })(),
    );
    return;
  }

  if (req.destination === "font" || req.destination === "image") {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(req);

        if (cached) return cached;

        const network = await fetch(req);
        cache.put(req, network.clone());
        return network;
      })(),
    );
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req);

      const networkPromise = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            cache.put(req, res.clone());
          }
          return res;
        })
        .catch(() => null);

      return cached || networkPromise;
    })(),
  );
});

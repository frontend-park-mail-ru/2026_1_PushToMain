importScripts("/precache-assets.js");
const CACHE_NAME = "app-v1";
let lastShownEmailId = null;

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

      const cache = await caches.open(CACHE_NAME);
      const cachedIndex = await cache.match("/index.html");
      if (!cachedIndex) {
        try {
          const response = await fetch("/index.html");
          await cache.put("/index.html", response);
        } catch (e) {
          console.log("Could not repopulate cache");
        }
      }
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
        try {
          const network = await fetch(req);
          cache.put("/index.html", network.clone());
          return network;
        } catch {
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match("/index.html");
          return cached || new Response("Offline", { status: 503 });
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

self.addEventListener("message", (event) => {
  const { title, body, icon, url, emailId } = event.data;

  if (emailId && lastShownEmailId === emailId) return;
  if (emailId) lastShownEmailId = emailId;

  const options = {
    body: body || "You have a new email",
    icon: icon || "/images/email-icon.png",
    badge: "/images/badge-icon.png",
    data: { url: url || "/" },
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification(title || "New Email", options),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    }),
  );
});

importScripts("/precache-assets.js");

const CACHE_NAME = "app-v3";
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
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      );

      await self.clients.claim();

      const allClients = await self.clients.matchAll({ type: "window" });
      allClients.forEach((client) => client.navigate(client.url));
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
          // bypass the browser’s HTTP cache completely
          const network = await fetch(req, { cache: "no-cache" });
          // update the cache so the offline fallback is fresh
          const cache = await caches.open(CACHE_NAME);
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

  event.respondWith(
    (async () => {
      try {
        const networkResponse = await fetch(req);
        if (networkResponse.status === 200) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, networkResponse.clone());
        }
        return networkResponse;
      } catch (networkError) {
        const cached = await caches.match(req);
        if (cached) return cached;

        if (req.destination === "image") {
          return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"/>',
            { headers: { "Content-Type": "image/svg+xml" } },
          );
        }
        return new Response("Resource not available offline", { status: 503 });
      }
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
      if (clients.openWindow) return clients.openWindow(urlToOpen);
    }),
  );
});

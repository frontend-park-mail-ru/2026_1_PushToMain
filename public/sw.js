const CACHE_NAME = "v1";

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(CACHE_NAME);

  const manifestResponse = await fetch("/assets-manifest.json");
  const manifest = await manifestResponse.json();

  console.log(`Caching ${manifest.files.length} files from manifest`);

  await cache.addAll(manifest.files);
};

const putInCache = async (request, response) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
};

const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    await self.registration.navigationPreload.enable();
  }
};

self.addEventListener("activate", (event) => {
  event.waitUntil(enableNavigationPreload());
});

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        await addResourcesToCache();
        console.log("All assets cached successfully");
      } catch (error) {
        console.error("Failed to cache from manifest:", error);
        await cache.addAll([
          "/",
          "/index.html",
          "/index.scss",
          "/assets/svg/favicon.svg",
          "/assets/svg/Logo.svg",
        ]);
      }
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith("/api/")) return;

  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          const networkResponse = await fetch(event.request, {
            mode: "cors",
            credentials: "omit",
          });
          return networkResponse;
        } catch (error) {
          const cachedResponse = await caches.match("/index.html");
          if (cachedResponse) return cachedResponse;
          return new Response("Offline – content not available", {
            status: 503,
            statusText: "Service Unavailable",
          });
        }
      })(),
    );
  } else {
    event.respondWith(
      (async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(event.request, {
            mode: "cors",
            credentials: "omit",
          });

          if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          console.log("Network failed for:", url.pathname);
          return new Response("Offline – content not available", {
            status: 503,
            statusText: "Service Unavailable",
          });
        }
      })(),
    );
  }
});

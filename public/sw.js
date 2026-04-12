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
  if (event.request.method !== "GET") return;

  event.respondWith(async () => {
    if (navigator.onLine) {
      const networkResponse = await fetch(event.request);
      putInCache(event.request, networkResponse.clone());
      return networkResponse;
    } else {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);
      return cachedResponse || new Response("Offline", { status: 404 });
    }
  });
});

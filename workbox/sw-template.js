importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js"
);

if (workbox) {
  console.log("✅ Workbox loaded");

  // Precaching các asset được build (Next.js static chunks, css, v.v)
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

  // Remove navigation and broad asset caches created by older worker versions.
  self.addEventListener("activate", (event) => {
    event.waitUntil(
      Promise.all([caches.delete("pages-cache"), caches.delete("assets-cache")])
    );
  });

  workbox.routing.registerRoute(
    ({ url }) => url.pathname.endsWith("manifest.json"),
    new workbox.strategies.NetworkOnly()
  );

  // Navigation responses can contain authenticated or user-specific content.
  // Always use the network; the catch handler below only serves a generic page.
  workbox.routing.registerRoute(
    ({ request }) => request.mode === "navigate",
    new workbox.strategies.NetworkOnly()
  );

  // Cache only immutable, same-origin build assets; never cache API or user media.
  workbox.routing.registerRoute(
    ({ url, request }) =>
      url.origin === self.location.origin &&
      url.pathname.startsWith("/_next/static/") &&
      ["style", "script", "font"].includes(request.destination),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: "assets-cache"
    })
  );

  // Fallback offline.html nếu offline hoàn toàn
  workbox.routing.setCatchHandler(async ({ event }) => {
    if (event.request.destination === "document") {
      const cachedResponse = await caches.match("/offline.html");
      if (cachedResponse) return cachedResponse;

      return new Response("<h1>Offline</h1><p>No cached page found.</p>", {
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "text/html"
        }
      });
    }
    return Response.error();
  });
} else {
  console.log("❌ Workbox failed to load");
}

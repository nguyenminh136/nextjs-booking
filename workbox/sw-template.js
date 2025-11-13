/* eslint-disable no-undef */
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js"
);

if (workbox) {
  console.log("✅ Workbox loaded");

  // Precaching các asset được build (Next.js static chunks, css, v.v)
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

  workbox.routing.registerRoute(
    ({ url }) => url.pathname.endsWith("manifest.json"),
    new workbox.strategies.NetworkOnly()
  );

  // Cache các trang HTML (App Router)
  workbox.routing.registerRoute(
    ({ request }) => request.mode === "navigate",
    new workbox.strategies.NetworkFirst({
      cacheName: "pages-cache",
      networkTimeoutSeconds: 3,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50
        })
      ]
    })
  );

  // Cache static assets (images, fonts, js, css)
  workbox.routing.registerRoute(
    ({ request }) =>
      ["style", "script", "image", "font"].includes(request.destination),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: "assets-cache"
    })
  );

  // Fallback offline.html nếu offline hoàn toàn
  workbox.routing.setCatchHandler(async ({ event }) => {
    if (event.request.destination === "document") {
      const cachedResponse = await caches.match("/offline.html");
      console.log(cachedResponse);
      if (cachedResponse) return cachedResponse;

      return new Response("<h1>Offline</h1><p>No cached page found.</p>", {
        headers: { "Content-Type": "text/html" }
      });
    }
    return Response.error();
  });
} else {
  console.log("❌ Workbox failed to load");
}

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js"
);

if (workbox) {
  console.log("✅ Workbox loaded");

  // Precaching các asset được build (Next.js static chunks, css, v.v)
  workbox.precaching.precacheAndRoute([{"revision":"dc987e0001f82b22cb155959e09e2570","url":"/default-avatar.png"},{"revision":"d09f95206c3fa0bb9bd9fefabfd0ea71","url":"/file.svg"},{"revision":"2aaafa6a49b6563925fe440891e32717","url":"/globe.svg"},{"revision":"7bd117f74aa9053658f52511eba897e8","url":"/icons/icon-192x192.png"},{"revision":"5f7be61de73d670998fce7b76016ce39","url":"/icons/icon-512x512.png"},{"revision":"f46713c8acec95daabdbec338dfd9bd2","url":"/manifest.json"},{"revision":"8e061864f388b47f33a1c3780831193e","url":"/next.svg"},{"revision":"665b7c78aa1d5c6f87e39e6639baf2be","url":"/offline.html"},{"revision":"35707bd9960ba5281c72af927b79291f","url":"/placeholder.svg"},{"revision":"4779d676e53a7384ed487d69d95831bc","url":"/slotspace_leaf_icon.svg"},{"revision":"c0af2f507b369b085b35ef4bbe3bcf1e","url":"/vercel.svg"},{"revision":"a2760511c65806022ad20adf74370ff3","url":"/window.svg"},{"revision":"cbc9313050e0cafd6272edd439e4a716","url":"/workers/heavy-worker.js"}]);

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

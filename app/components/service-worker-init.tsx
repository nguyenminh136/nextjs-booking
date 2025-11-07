"use client";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("✅ Workbox Service Worker registered:", reg.scope))
        .catch((err) => console.error("SW registration failed:", err));
    }
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-2">Workbox Demo</h1>
      <p>✅ Service Worker registered via Workbox</p>
      <p>✅ Static files, images, and APIs are cached automatically</p>
      <p>➡ Open DevTools → Application → Service Workers</p>
      <p>➡ Test offline mode!</p>
    </main>
  );
}

"use client";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/session-provider";
import SessionWatcher from "@/components/session-watcher";
import { inter, spaceGrotesk } from "./fonts";
import { StoreProvider } from "./StoreProvider";

import "./globals.css";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(reg =>
          console.log("✅ Workbox Service Worker registered:", reg.scope)
        )
        .catch(err => console.error("SW registration failed:", err));
    }
  }, []);
  return (
    <StoreProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${inter.variable} ${spaceGrotesk.variable}`}
      >
        <head />
        <body>
          <SessionProvider>
            <SessionWatcher />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </SessionProvider>
        </body>
      </html>
    </StoreProvider>
  );
}

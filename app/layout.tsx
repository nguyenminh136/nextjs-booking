import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/session-provider";
import SessionWatcher from "@/components/session-watcher";
import { inter, spaceGrotesk } from "./fonts";
import { StoreProvider } from "./StoreProvider";
import QueryProvider from "./QueryProvider";
import type { Metadata, Viewport } from "next";
import ServiceWorkerRegister from "./components/service-worker-register";

import "./globals.css";

export const metadata: Metadata = {
  title: "NextJS Booking",
  description: "A progressive booking platform",
  manifest: "/manifest.json"
};

export const viewport: Viewport = {
  themeColor: "#0070f3"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${inter.variable} ${spaceGrotesk.variable}`}
      >
        <head />
        <body>
          <QueryProvider>
            <SessionProvider>
              <SessionWatcher />
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {children}
                <ServiceWorkerRegister />
                <Toaster />
              </ThemeProvider>
            </SessionProvider>
          </QueryProvider>
        </body>
      </html>
    </StoreProvider>
  );
}

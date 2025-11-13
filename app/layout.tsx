import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/session-provider";
import SessionWatcher from "@/components/session-watcher";
import { inter, spaceGrotesk } from "./fonts";
import { StoreProvider } from "./StoreProvider";
import type { Metadata } from "next";

import "./globals.css";
import ServiceWorkerRegister from "./components/service-worker-register";

export const metadata: Metadata = {
  title: "NextJS Booking",
  description: "A progressive booking platform",
  manifest: "/manifest.json",
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
        </body>
      </html>
    </StoreProvider>
  );
}

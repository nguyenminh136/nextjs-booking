import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import { SessionProvider } from "@/providers/session-provider";
import SessionWatcher from "@/components/session-watcher";
import { inter, spaceGrotesk } from "./fonts";
import { StoreProvider } from "./providers/store-provider";
import QueryProvider from "./providers/query-provider";
import type { Metadata } from "next";
import ServiceWorkerRegister from "./components/service-worker-register";

// @ts-ignore: global CSS import type declarations are handled by Next.js
import "./globals.css";

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

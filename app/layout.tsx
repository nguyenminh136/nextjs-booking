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
            </ThemeProvider>
          </SessionProvider>
        </body>
      </html>
    </StoreProvider>
  );
}

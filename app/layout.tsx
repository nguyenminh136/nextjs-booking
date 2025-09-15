import { inter, spaceGrotesk } from "./fonts";
import { ThemeProvider } from "@/context/theme-context";
import { NavigationHeader } from "@/comps/header";

import "./globals.css";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <NavigationHeader />
        <ThemeProvider>
          <div className="flex h-screen flex-col md:overflow-hidden">
            <div className="flex-grow overflow-y-auto">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
